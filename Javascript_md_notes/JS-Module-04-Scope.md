# JS MODULE 4: SCOPE & LEXICAL ENVIRONMENT

---

## 1. What is Scope
**Definition:** The **region of code where a variable is accessible**. Scope determines variable visibility and lifetime.
**Why:** Encapsulation (avoid name collisions), memory management, predictable variable resolution.

---

## 2. Types of Scope
| Scope | Created by | Accessible |
|-------|-----------|------------|
| **Global** | Top-level | Everywhere |
| **Function** | Function body | Inside that function (and nested) |
| **Block** | `{ }` with `let`/`const` | Inside that block only |
| **Module** | ES module file | Within the module |

```js
let g = 'global';                  // global scope
function fn() {
  let f = 'function';              // function scope
  if (true) {
    let b = 'block';               // block scope
    var v = 'var ignores block';   // function scope (var!)
  }
  console.log(v);   // ✅ 'var ignores block'
  console.log(b);   // ❌ ReferenceError
}
```
**Key:** `var` is **function-scoped**; `let`/`const` are **block-scoped**.

---

## 3. Lexical Scope (Static Scope)
**Definition:** Scope is determined by **where code is written** (its physical/lexical position), **not where it's called**. Inner functions access outer variables based on **nesting at author time**.
```js
function outer() {
  let x = 10;
  function inner() {
    console.log(x);   // 10 — lexical access to outer's x
  }
  return inner;
}
const fn = outer();
fn();  // 10 — even though called elsewhere, scope is lexical
```
**Lexical ≠ dynamic:** JS uses lexical scope (definition site), not dynamic scope (call site). This is the foundation of **closures**.

---

## 4. How the Scope Chain Works
Each lexical environment has a reference to its **outer** environment. Variable lookup walks this chain outward until found or `null` (global's outer).
```
inner LE ──outer──► outer LE ──outer──► Global LE ──outer──► null
   x?  not here       x? found! ✅
```

---

## 5. Variable Resolution Process (Internal Lookup Algorithm)
```
LOOKUP(variable):
  1. Check current Environment Record (local scope)
     → found? return it
  2. Not found → follow `outer` reference to parent environment
  3. Repeat up the chain
  4. Reach global; still not found:
     - read in non-strict → ReferenceError
     - write in non-strict (no declaration) → creates GLOBAL (bad!)
     - strict mode → ReferenceError
```
```js
let a = 1;
function f() {
  let b = 2;
  function g() {
    let c = 3;
    console.log(a, b, c);  // resolves c(local), b(outer f), a(global)
  }
  g();
}
f();
```

---

## 6. Scope vs Context (common confusion)
| | Scope | Context (`this`) |
|---|-------|------------------|
| About | Variable access | The object `this` refers to |
| Determined by | Where defined (lexical) | How called (call site) |
| Set when | Author/compile time | Runtime |

---

## 7. Shadowing
Inner variable with the same name **shadows** the outer one within its scope.
```js
let x = 1;
function f() {
  let x = 2;        // shadows outer x
  console.log(x);   // 2
}
// Illegal shadowing: let x; var x; in same scope → error
```

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** prefer `const` > `let` > avoid `var`; keep scope as narrow as possible; avoid global variables (collisions, leaks).
**Mistakes:** accidental globals (assigning without declaration), assuming `var` is block-scoped, deep shadowing confusion.
**Performance:** variable lookup is O(depth of scope chain) — usually trivial; engines optimize; but extremely deep nesting/global access patterns can matter. Local variables resolve fastest.

---

## INTERVIEW QUESTIONS
**🟢:** What is scope? · Function vs block scope? · var vs let scoping?
**🟡:** What is lexical scope? · How does the scope chain resolve variables? · Scope vs context? · What is shadowing?
**🔴:** Lexical vs dynamic scope (why JS is lexical). · Internal lookup algorithm. · How scope chain enables closures. · Accidental global creation in non-strict mode.
**🧩:** Predict output with shadowing + var/let. · Why does a callback "remember" outer variables (lexical + closure)? · Loop with var vs let (classic — see Closures module).

**Output prediction:**
```js
let x = 'global';
function outer() {
  let x = 'outer';
  function inner() { console.log(x); }
  return inner;
}
outer()();   // 'outer'  (lexical, not global)

for (var i = 0; i < 3; i++) {}
console.log(i);   // 3  (var leaks out of loop block)
for (let j = 0; j < 3; j++) {}
console.log(typeof j);   // 'undefined' (let block-scoped) → actually ReferenceError if accessed
```

## ⚡ REVISION
- Scope = where a variable is accessible. Global / Function / Block / Module.
- `var` function-scoped; `let`/`const` block-scoped.
- **Lexical scope** = decided by where code is written (not called) → basis of closures.
- Scope chain = outer-env references; lookup walks outward until found or ReferenceError.
- Scope (defined) ≠ `this` context (called).

➡️ Next: **Module 5 — Closures.**
