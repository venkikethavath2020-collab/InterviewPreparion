# ESSENTIAL JS — SECTION 1: VARIABLES & DATA TYPES
> Senior JS Architect / V8 Engineer interview notes. Full 13-point treatment.

---

## PART A — `var`, `let`, `const`

### 1. Definition
Three keywords to declare variables (bindings):
- **`var`** — function-scoped, hoisted & initialized to `undefined`, re-declarable, attaches to global object at top level.
- **`let`** — block-scoped, hoisted but in TDZ, reassignable, NOT re-declarable in same scope.
- **`const`** — block-scoped, TDZ, **must be initialized**, binding can't be reassigned (object contents still mutable).

### 2. Why It Exists
`var` was the only option pre-ES6 and caused bugs (function scope, hoisting surprises, accidental globals, loop closures). ES6 added `let`/`const` to give **block scoping**, **TDZ safety**, and **immutable bindings** → safer, more predictable code.

### 3. Internal Working

**Memory Allocation (creation phase of the EC):**
```
var x        → memory: x = undefined          (Variable Environment)
let y        → memory: y = <uninitialized>    (Lexical Environment, TDZ)
const z      → memory: z = <uninitialized>    (Lexical Environment, TDZ)
```
- `var` lives in the **Variable Environment**; `let`/`const` in the **Lexical Environment** (separate record).
- During the **creation phase** all are "hoisted" (registered), but only `var` is initialized to `undefined`.

**Hoisting Behavior:**
```js
console.log(a); var a = 1;   // undefined  (hoisted + initialized)
console.log(b); let b = 1;   // ReferenceError (TDZ)
console.log(c); const c = 1; // ReferenceError (TDZ)
```

**Temporal Dead Zone (TDZ):** the span from entering the scope until the `let`/`const` declaration executes. The binding exists but **accessing it throws `ReferenceError`**. Exists to catch use-before-initialization bugs and make `const` semantics sound.
```
{
  // ── TDZ for x starts ──
  // console.log(x) → ReferenceError
  let x = 5;   // ── TDZ ends ──
}
```

**Global Object Attachment:**
```js
var g = 1;
let l = 2;
const c = 3;
// In a browser, at top level (script, not module):
window.g; // 1   ✅ var attaches to window
window.l; // undefined  ❌ let does NOT
window.c; // undefined  ❌ const does NOT
```
- `var` at the top level becomes a **property of the global object** (`window`/`globalThis`). `let`/`const` create bindings in a separate **declarative record** (not on `window`).
- **In ES modules** and Node module scope, even `var` does NOT attach to `globalThis` (module scope ≠ global script scope).

### 4. Real-World Examples
```js
// Loop closure: var bug vs let fix
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0 1 2

// const for references that shouldn't be reassigned
const API = '/api';      // can't reassign
const config = {};       // but config.x = 1 is allowed (contents mutable)
```

### 5. Interview Questions
- Difference between var, let, const?
- What is the TDZ and why does it exist?
- Does `let` hoist? (Yes — but uninitialized/TDZ.)
- Why does `var` attach to `window` but `let` doesn't?
- Can you reassign/mutate a `const` object?

### 6. Follow-up Questions
- "Show the output of a loop with var vs let + setTimeout. Why?"
- "How would you fix the var-loop bug without let?" (IIFE.)
- "Is `const` truly immutable?" (Binding yes; value no — use `Object.freeze` for shallow immutability.)
- "Where do let/const live if not on window?" (Declarative environment record.)

### 7. Common Mistakes
- Assuming `var` is block-scoped.
- Expecting `let` to be `undefined` before declaration (it's TDZ → throws).
- Thinking `const` makes objects immutable.
- Relying on `var` attaching to `window` (breaks in modules).
- Re-declaring `let` in the same scope (SyntaxError).

### 8. Best Practices
- **`const` by default → `let` when reassigning → avoid `var`.**
- Declare variables at the narrowest scope needed.
- Use `Object.freeze` for true immutability of config objects.
- Use modules (no accidental globals).

### 9. Performance Considerations
- Negligible runtime difference; block scoping can help the engine free bindings sooner.
- `var` hoisting + accidental globals can cause leaks (globals live for the page lifetime).
- TDZ adds a tiny check but improves correctness; not a real perf concern.

### 10. Production Use Cases
- `const` for imports, config, references; `let` for loop counters/accumulators; `var` essentially never in modern code.
- Linters (ESLint `no-var`, `prefer-const`) enforce this in production codebases.

### 11. Coding Examples
```js
const user = { name: 'Ana' };
user.name = 'Bob';        // ✅ allowed (mutation)
// user = {};             // ❌ TypeError (reassignment)

let count = 0; count++;   // ✅

function f() {
  if (true) { var v = 1; let b = 2; }
  console.log(v);         // 1 (var function-scoped)
  // console.log(b);      // ReferenceError (block-scoped)
}
```

### 12. Tricky Edge Cases
```js
// (a) re-declaration
var x = 1; var x = 2;     // ✅ allowed
let y = 1; // let y = 2;  // ❌ SyntaxError

// (b) TDZ even with typeof
console.log(typeof a);    // 'undefined' (a never declared)
console.log(typeof b);    // ❌ ReferenceError (b in TDZ)
let b;

// (c) const without init
// const z;               // ❌ SyntaxError: Missing initializer

// (d) let in same block as a param name etc. → scoping nuances

// (e) Loop binding: `let` creates a NEW binding per iteration (spec)
```

### 13. Output Prediction
```js
console.log(a); var a = 5;          // undefined
// console.log(b); let b = 5;       // ReferenceError

for (var i = 0; i < 3; i++) {}
console.log(i);                     // 3 (var leaks)

{ let k = 1; }
// console.log(k);                  // ReferenceError

var v = 1;
function f(){ console.log(v); var v = 2; }
f();                                // undefined (local var hoisted, shadows global)
```

---

## PART B — Comparisons

| | `var` | `let` | `const` |
|---|-------|-------|---------|
| Scope | Function | Block | Block |
| Hoisting | Yes → `undefined` | Yes → TDZ | Yes → TDZ |
| Reassign | ✅ | ✅ | ❌ |
| Redeclare (same scope) | ✅ | ❌ | ❌ |
| Must initialize | ❌ | ❌ | ✅ |
| Attaches to `window` (top-level script) | ✅ | ❌ | ❌ |
| Use case | (avoid) | counters, mutable | default |

- **var vs let:** scope (function vs block), TDZ, global attachment, redeclaration.
- **let vs const:** reassignment (allowed vs not) + mandatory initialization for const.
- **var vs const:** every safety dimension — scope, TDZ, reassignment, global attachment — const wins.

---

## PART C — Data Types

### 1. Definition
JS has **7 primitives** + **objects**:
| Type | Example | typeof |
|------|---------|--------|
| String | `'hi'` | `'string'` |
| Number | `42`, `3.14`, `NaN`, `Infinity` | `'number'` |
| Boolean | `true` | `'boolean'` |
| Undefined | `undefined` | `'undefined'` |
| Null | `null` | **`'object'`** (historic bug) |
| Symbol | `Symbol('x')` | `'symbol'` |
| BigInt | `10n` | `'bigint'` |
| Object | `{}`, `[]`, `fn`, `new Date()` | `'object'` / `'function'` |

### 2. Why It Exists
Primitives model simple immutable values efficiently (stored by value); objects model complex, mutable, shareable structures (stored by reference on the heap).

### 3. Internal Working

**Primitive vs Reference storage:**
```
Stack                         Heap
─────                         ────
n = 5         (value)
s = 'hi'      (value)*
obj ─────────────────────►  { a: 1 }
arr ─────────────────────►  [1, 2, 3]
```
- **Primitives** are copied **by value** (each variable independent).
- **Objects** are accessed **by reference** (variables hold a pointer to one heap object).
- *(Engines may intern/optimize strings, but semantically strings behave as immutable values.)*

**Number:** IEEE-754 64-bit float (no separate int type) → `0.1 + 0.2 !== 0.3`. Safe integers up to `2^53 - 1`.
**BigInt:** arbitrary-precision integers for values beyond `Number.MAX_SAFE_INTEGER` (`9007199254740993n`).
**Symbol:** unique immutable identifier — collision-free keys, language protocols (`Symbol.iterator`).
**null vs undefined:** `undefined` = declared-but-unassigned / missing; `null` = intentional "no value."

### 4. Real-World Examples
```js
// Pass by value (primitive)
let a = 1; function inc(x){ x++; } inc(a); a; // 1 (unchanged)

// Pass by reference (object)
const o = { v: 1 }; function set(obj){ obj.v = 9; } set(o); o.v; // 9 (changed)

// Reassigning param doesn't affect caller (the reference itself is by value)
function replace(obj){ obj = { v: 99 }; } replace(o); o.v; // 9 (unchanged)
```

### 5. Interview Questions
- List the primitive types. Why is `typeof null` 'object'?
- Primitive vs reference types?
- Is JS pass-by-value or pass-by-reference?
- null vs undefined?
- Why `0.1 + 0.2 !== 0.3`? When use BigInt?

### 6. Follow-up Questions
- "Does modifying an object inside a function affect the caller? Reassigning it?" (Mutation yes; reassign no.)
- "How do you copy an object so the original isn't affected?" (spread/structuredClone — shallow vs deep.)
- "How to compare two objects?" (By reference; deep-equal needs manual/lib.)
- "What is `NaN` and how to check it?" (`Number.isNaN`.)

### 7. Common Mistakes
- Believing JS is pass-by-reference (it's **pass-by-value of the reference**).
- Using `typeof x === 'object'` to detect null (it matches null too).
- `===` on objects expecting value equality.
- Float comparison without epsilon.
- Mixing `Number` and `BigInt` in arithmetic (TypeError).

### 8. Best Practices
- Use `Number.isNaN` / `Number.isInteger`; compare floats with an epsilon.
- Treat objects as shared references; clone when isolation needed.
- Use `Object.is` for edge cases (`Object.is(NaN, NaN) === true`).
- Use `===` (no coercion).

### 9. Performance Considerations
- Primitives on the stack are cheap; objects allocate on the heap → GC pressure.
- Copying large objects (deep clone) is expensive.
- Strings are immutable — building via concatenation in loops can allocate a lot (use arrays + join for huge builds).

### 10. Production Use Cases
- BigInt: financial/crypto IDs, large counters, precise integers.
- Symbol: library-safe keys, iteration protocols, enums.
- Reference semantics: shared state, caches, mutation patterns (and their bugs).

### 11. Coding Examples
```js
typeof null;            // 'object'
typeof function(){};    // 'function'
typeof NaN;             // 'number'
typeof undeclared;      // 'undefined' (no error!)
10n + 5n;               // 15n
// 10n + 5;             // ❌ TypeError (mix BigInt + Number)
Object.is(NaN, NaN);    // true
Object.is(-0, 0);       // false
```

### 12. Tricky Edge Cases
```js
NaN === NaN;            // false
0 === -0;              // true,  but Object.is(0,-0) → false
typeof null;           // 'object'
[] instanceof Array;   // true; typeof [] → 'object'
0.1 + 0.2;             // 0.30000000000000004
let s = 'abc'; s[0] = 'x'; s;   // 'abc' (strings immutable, silent)
```

### 13. Output Prediction
```js
let a = { x: 1 }; let b = a; b.x = 2;
console.log(a.x);                  // 2 (same reference)

let p = 1; let q = p; q = 9;
console.log(p);                    // 1 (primitive copied)

console.log(typeof null, typeof undefined, typeof NaN);  // object undefined number
console.log(1 + null, 1 + undefined);                    // 1  NaN
console.log([] === []);            // false
console.log(0.1 + 0.2 === 0.3);    // false
```

---

## ⚡ QUICK REVISION
- `const` > `let` > avoid `var`. var=function-scope+hoist-undefined+window; let/const=block+TDZ.
- TDZ = exists but unusable until declared (ReferenceError) — catches use-before-init.
- 7 primitives (string/number/boolean/undefined/null/symbol/bigint) + object. `typeof null === 'object'`.
- Primitives copied by value; objects by reference. JS is **pass-by-value** (of the reference) — mutation affects caller, reassignment doesn't.
- Number = IEEE-754 float (`0.1+0.2` bug); BigInt for huge ints; Symbol for unique keys.

---

✅ **Section 1 (Variables & Data Types) complete.**
Reply **"next"** (or name the section) to continue to **Operators**.
