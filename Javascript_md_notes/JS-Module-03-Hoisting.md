# JS MODULE 3: HOISTING

---

## 1. What is Hoisting
**Definition:** JavaScript's behavior of **allocating memory for variables and functions during the creation phase** (before execution), making declarations available "at the top" of their scope.
**Why it exists:** It's a **side effect of the two-phase EC model** — the engine scans and registers declarations in memory before running code. It's not literally "moving code up"; declarations are recorded during creation.

```
What you write:          How the engine sees it (conceptually):
console.log(x);          var x;            // hoisted, = undefined
var x = 5;          →    console.log(x);   // undefined
                         x = 5;
```

---

## 2. `var` Hoisting
- Hoisted **and initialized to `undefined`**.
- **Function-scoped** (not block-scoped).
```js
console.log(a);  // undefined (not ReferenceError)
var a = 10;
console.log(a);  // 10

if (true) { var b = 1; }
console.log(b);  // 1 — var ignores block scope
```

## 3. `let` / `const` Hoisting
- Hoisted **but NOT initialized** → live in the **Temporal Dead Zone (TDZ)** until the declaration line.
- Accessing before declaration → **`ReferenceError`**.
- **Block-scoped**.
```js
console.log(x);  // ❌ ReferenceError (TDZ)
let x = 5;

{ let y = 1; }
console.log(y);  // ❌ ReferenceError (block scoped)
```
**`const`:** same as `let` + must be initialized at declaration + can't be reassigned (the binding; object contents can still mutate).

---

## 4. Temporal Dead Zone (TDZ)
**Definition:** The time between entering a scope and the actual `let`/`const` declaration, during which the variable exists but **cannot be accessed**.
```
{
  // TDZ for x starts here ───────┐
  console.log(x); // ReferenceError│
  let x = 5;      // TDZ ends here ┘
  console.log(x); // 5
}
```
**Why it exists:** Catches bugs from using variables before initialization (a `var` would silently give `undefined`). Makes code safer and `const` semantics sound.

---

## 5. Function Hoisting
- **Function declarations** → **fully hoisted** (whole function available before its line).
- **Function expressions / arrow functions** → only the **variable** is hoisted (per var/let rules); the function value is NOT.
```js
hoisted();              // ✅ works
function hoisted() { console.log('hi'); }

notHoisted();           // ❌ TypeError: notHoisted is not a function
var notHoisted = function () {};

arrowFn();              // ❌ ReferenceError (TDZ) if let/const
const arrowFn = () => {};
```

---

## 6. Class Hoisting
- Classes are **hoisted but in the TDZ** (like `let`) → **not usable before declaration**.
```js
new Foo();  // ❌ ReferenceError
class Foo {}
```

---

## 7. Internal Memory Allocation (Creation Phase)
```
Creation phase scan:
  var x        → memory: x = undefined
  let y        → memory: y = <uninitialized> (TDZ)
  const z      → memory: z = <uninitialized> (TDZ)
  function f   → memory: f = <full function object>
  class C      → memory: C = <uninitialized> (TDZ)
  var g = ()=>{} → memory: g = undefined (value assigned at execution)
```

---

## 8. Hoisting Precedence (tricky)
Function declarations hoist **above** variable declarations with the same name:
```js
console.log(typeof foo);  // 'function'
var foo = 'bar';
function foo() {}
// During creation: function foo wins; then execution: foo = 'bar'
```

---

## OUTPUT PREDICTION EXAMPLES
```js
// 1
console.log(a); var a = 1;            // undefined

// 2
console.log(b); let b = 1;            // ReferenceError (TDZ)

// 3
foo(); function foo(){ console.log('A'); }   // 'A'

// 4
bar(); var bar = () => {};            // TypeError (bar is undefined)

// 5
var x = 1;
function test() {
  console.log(x);   // undefined! (local var x hoisted, shadows global)
  var x = 2;
}
test();

// 6
console.log(typeof fn); var fn = 1; function fn(){}   // 'function'

// 7
{
  console.log(c);   // ReferenceError (TDZ in block)
  let c = 3;
}
```

---

## INTERVIEW QUESTIONS
**🟢:** What is hoisting? · var vs let hoisting? · Are functions hoisted?
**🟡:** What is the TDZ and why? · Function declaration vs expression hoisting? · Class hoisting? · Why does `var x` print undefined but `let x` throws?
**🔴:** How does hoisting relate to the creation phase + memory? · Hoisting precedence (function vs var)? · Why was TDZ added in ES6? · Internal allocation for each declaration type.
**🧩:** Predict output of shadowed var inside function (#5). · Explain a TDZ bug in production. · Why does a `const` "not hoist" if it actually does?

## ⚡ REVISION
- Hoisting = declarations registered in memory during creation phase.
- `var` → hoisted = `undefined` (function-scoped). `let`/`const`/`class` → hoisted but **TDZ** (ReferenceError before declaration, block-scoped).
- Function **declarations** fully hoisted; **expressions/arrows** follow var/let rules.
- Function declaration > var in precedence.
- TDZ exists to catch use-before-init bugs.

➡️ Next: **Module 4 — Scope & Lexical Environment.**
