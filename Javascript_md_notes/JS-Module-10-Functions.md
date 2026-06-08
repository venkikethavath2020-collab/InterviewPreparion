# JS MODULE 10: FUNCTIONS

---

## 1. Functions are First-Class Citizens
**Definition:** In JS, functions are **values** — assignable to variables, passed as arguments, returned from functions, stored in data structures. This enables higher-order functions, callbacks, closures.

---

## 2. Function Declaration vs Expression
| | Declaration | Expression |
|---|-------------|------------|
| Syntax | `function f(){}` | `const f = function(){}` |
| Hoisting | **Fully hoisted** (callable before) | Only variable hoisted (var=undefined, let=TDZ) |
| Named | Yes | Optional (anonymous/named) |
```js
declared();             // ✅ works (hoisted)
function declared() {}
expressed();            // ❌ TypeError / ReferenceError
const expressed = function () {};
```

---

## 3. Arrow Functions
**Definition:** Concise function syntax (ES6) with **lexical `this`**, no own `arguments`, no `prototype`, can't be `new`-ed, can't be a generator.
```js
const add = (a, b) => a + b;            // implicit return
const obj = { x: () => ({ a: 1 }) };    // wrap object literal in ()
```
| | Regular | Arrow |
|---|---------|-------|
| `this` | Dynamic (call site) | Lexical (enclosing) |
| `arguments` | ✅ | ❌ (use rest `...args`) |
| `new` | ✅ | ❌ |
| `prototype` | ✅ | ❌ |
| Hoisting | (decl) hoisted | follows var/let |
| Best for | methods, constructors | callbacks needing outer `this` |

---

## 4. Higher-Order Functions (HOF)
**Definition:** A function that **takes a function as an argument and/or returns a function**.
```js
// takes a function
[1,2,3].map(x => x * 2);
// returns a function (factory)
const multiplier = (n) => (x) => x * n;
const double = multiplier(2);   double(5); // 10
```
Foundation of functional programming, composition, currying, decorators.

---

## 5. Callback Functions
**Definition:** A function passed to another function to be called later (sync or async).
```js
// sync
[1,2,3].forEach(x => console.log(x));
// async (error-first in Node)
fs.readFile('f', (err, data) => {});
```
**Callback hell** → solved by Promises/async-await (Modules 12–13).

---

## 6. Pure Functions
**Definition:** A function that (1) **always returns the same output for the same input** and (2) has **no side effects** (no mutation of external state, no I/O).
```js
const pure = (a, b) => a + b;                 // ✅ pure
let total = 0;
const impure = (n) => { total += n; };        // ❌ side effect
const impure2 = () => Date.now();             // ❌ non-deterministic
```
**Why:** predictable, testable, cacheable (memoizable), parallelizable. Core of functional programming + React/Redux.

---

## 7. Other Function Concepts
- **IIFE** (Immediately Invoked Function Expression): `(function(){ })()` — runs once, creates private scope (pre-module pattern).
- **Default params:** `function f(a = 1) {}`.
- **Rest params:** `function f(...args) {}` (real array, unlike `arguments`).
- **Currying:** `f(a)(b)(c)` — transform multi-arg into chain of single-arg.
- **Recursion:** function calls itself (needs base case; watch stack overflow).
- **`arguments` object:** array-like (regular functions only).

```js
// Currying
const curry = (a) => (b) => (c) => a + b + c;
curry(1)(2)(3);   // 6
```

---

## 8. Internal Behavior
- Functions are **objects** (have properties: `name`, `length`, `prototype`).
- `length` = number of declared params (before defaults/rest).
- Each call creates a new **Function Execution Context** (Module 2) + can form a **closure** (Module 5).

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** pure functions where possible; arrows for callbacks; named functions for stack traces; small single-purpose functions; rest over `arguments`.
**Mistakes:** arrow as object method (wrong `this`); using `arguments` in arrows; mutating params; deep recursion (stack overflow → iterate/TCO not guaranteed in V8).
**Performance:** monomorphic functions (consistent arg types) optimize better; avoid creating functions in hot loops; inline small functions (engine may do it).

---

## INTERVIEW QUESTIONS
**🟢:** Declaration vs expression? · Arrow vs regular? · What is a callback / HOF / pure function?
**🟡:** Hoisting differences? · Why no `this`/`arguments` in arrows? · Currying / IIFE use cases? · `arguments` vs rest?
**🔴:** Implement curry/compose/pipe. · Function `length` property. · Why pure functions enable memoization/concurrency. · Recursion vs iteration (stack).
**🧩:** Object method using arrow breaks `this` — fix. · Build a `once`/`compose` utility. · Convert callback to promise. · Memoize a pure function.

**Output prediction:**
```js
console.log(foo());          // 'A' (declaration hoisted)
function foo(){ return 'A'; }

const f = (a, b = 2, ...rest) => [a, b, rest];
console.log(f(1));           // [1, 2, []]
console.log(f(1, 5, 6, 7));  // [1, 5, [6, 7]]
console.log(f.length);       // 1 (params before default/rest)
```

## ⚡ REVISION
- Functions = first-class values (pass/return/store).
- Declaration hoisted; expression/arrow follow var/let.
- Arrow: lexical `this`, no arguments/prototype/new — best for callbacks.
- HOF take/return functions; callbacks run later; pure = same input→output + no side effects.
- Currying, IIFE, rest params, recursion are function-composition tools.

➡️ Next: **Module 11 — Event Loop (most important).**
