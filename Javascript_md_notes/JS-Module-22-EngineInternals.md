# JS MODULE 22: JAVASCRIPT ENGINE INTERNALS (V8)

---

## 1. V8 Architecture Overview
```
Source Code
   │
   ▼
┌──────────┐   AST    ┌──────────┐  bytecode  ┌─────────────────────┐
│  Parser  │ ───────► │ Ignition │ ─────────► │ Execute (interpret) │
└──────────┘          └──────────┘            └──────────┬──────────┘
                                                         │ profiling (hot?)
                                                         ▼
                                              ┌────────────────────┐
                                              │ TurboFan (optimize)│ → machine code
                                              └─────────┬──────────┘
                                                        │ assumption breaks
                                                        ▼
                                                  Deoptimization → back to bytecode
```

---

## 2. Parsing
- **Lexer/Scanner:** source → **tokens**.
- **Parser:** tokens → **AST** (Abstract Syntax Tree).
- **Lazy parsing (pre-parsing):** V8 skips full parsing of functions not yet called (just enough to know boundaries) → faster startup; fully parses on first call.

## 3. AST (Abstract Syntax Tree)
**Definition:** A tree representation of the code's syntactic structure.
```js
// const x = 1 + 2;
VariableDeclaration
 └─ VariableDeclarator (x)
     └─ BinaryExpression (+)
         ├─ Literal 1
         └─ Literal 2
```
Used by the interpreter (to generate bytecode) and by tools (Babel, ESLint, bundlers).

---

## 4. Ignition (Interpreter)
**Definition:** V8's bytecode interpreter. Compiles AST → **bytecode** and executes it. **Fast startup**, low memory. Collects **profiling/feedback** (type info, call counts) to inform optimization.

## 5. TurboFan (Optimizing Compiler)
**Definition:** Compiles **hot** (frequently-run) functions from bytecode → highly **optimized machine code**, using the profiling feedback (e.g., "this var is always a number") to make **speculative optimizations**.
- **Hot code** detected via execution counters.
- Generates specialized machine code (inlining, escape analysis, etc.).

## 6. Deoptimization
**Definition:** When a speculative assumption breaks (e.g., a "number" becomes a string), TurboFan **throws away** the optimized code and falls back to bytecode (Ignition), then may re-optimize later.
```js
function add(a, b) { return a + b; }
add(1, 2);      // optimized for numbers
add('x', 'y');  // assumption broken → DEOPT
```
**Avoid frequent deopts:** keep types consistent (monomorphic).

---

## 7. Hidden Classes (Shapes / Maps)
**Definition:** Since JS objects are dynamic, V8 creates internal **hidden classes** describing an object's **shape** (property names + offsets). Objects with the **same shape** share a hidden class → fast property access by offset (like a struct).
```js
function Point(x, y) { this.x = x; this.y = y; }   // all instances share one shape ✅
const a = new Point(1, 2);
const b = new Point(3, 4);   // same hidden class as a

// ❌ shape divergence
const p = {}; p.x = 1; p.y = 2;   // transitions through shapes
const q = {}; q.y = 1; q.x = 2;   // DIFFERENT shape (order matters)
delete p.x;                        // new shape (deopt)
```
**Rules for fast objects:** initialize all properties in the constructor, same order; avoid adding props later or `delete`.

---

## 8. Inline Caching (IC)
**Definition:** V8 caches the result of property lookups (which hidden class → which offset) at each access site, so repeated accesses skip the lookup.
```js
function getX(obj) { return obj.x; }   // IC remembers: shape S → x at offset 0
```
| IC state | Meaning | Speed |
|----------|---------|-------|
| **Monomorphic** | one shape seen | fastest |
| **Polymorphic** | few shapes (2–4) | slower |
| **Megamorphic** | many shapes | slowest (IC gives up) |
**Keep call sites monomorphic** (same object shape) for max speed.

---

## 9. Garbage Collection (Orinoco)
V8's GC: **generational** (New space → Scavenge, Old space → Mark-Sweep-Compact), **incremental + concurrent + parallel** to minimize stop-the-world pauses. (See Modules 14 & Node 7.)

---

## 10. Putting It Together (optimization checklist)
- **Stable shapes** → good hidden classes → monomorphic ICs.
- **Consistent types** → no deopt.
- **Avoid:** `delete`, adding props post-construction, mixed-type arrays, `arguments` leaking, `eval`/`with`.
- **Prefer:** constructors/classes with fixed fields, typed arrays for numeric data, small functions (inlinable).

---

## INTERVIEW QUESTIONS
**🟢:** What does V8 do (parse/compile/execute)? · What is an AST? · Interpreted or compiled?
**🟡:** Ignition vs TurboFan? · What is JIT + deopt? · What are hidden classes? · What is inline caching?
**🔴:** Full V8 pipeline + speculative optimization. · Monomorphic vs polymorphic vs megamorphic ICs. · How property order affects hidden classes. · Lazy parsing. · What causes deopt and how to avoid.
**🧩:** A function got slow after handling mixed types — deopt/megamorphic; fix. · Objects built in different orders are slow — shape divergence. · `delete` in hot path hurts perf — why. · Optimize a hot loop for V8.

**Output prediction (perf reasoning, not literal output):**
```js
// Which is faster & why?
function A(){ this.x=1; this.y=2; }     // ✅ shared hidden class
const a = {}; a.x=1; a.y=2;             // transitions
const b = {}; b.y=1; b.x=2;             // ❌ different shape than a
```

## ⚡ REVISION
- V8: Parser → AST → Ignition (bytecode interpreter) → TurboFan (optimize hot code) → deopt fallback.
- Lazy parse for fast startup; profiling drives optimization.
- **Hidden classes** = object shapes; same props + order = shared shape = fast access.
- **Inline caching**: monomorphic (fast) > polymorphic > megamorphic.
- Keep types consistent + shapes stable; avoid delete/reorder → avoid deopt.

➡️ Next: **Module 23 — Security.**
