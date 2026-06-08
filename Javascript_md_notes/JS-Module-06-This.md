# JS MODULE 6: THE `this` KEYWORD

---

## 1. What is `this`
**Definition:** A special keyword referring to the **execution context's object** — *what object the current code is running on*. Its value is determined by **HOW a function is called** (call site), **not where it's defined** (except arrow functions).
**Why it exists:** Lets the same function operate on different objects (reusable methods).

---

## 2. The Binding Rules (priority order)
```
1. new binding        → new Fn()        → this = new object
2. explicit binding   → call/apply/bind → this = passed object
3. implicit binding   → obj.method()    → this = obj
4. default binding    → fn()            → this = undefined (strict) / global (non-strict)
* Arrow functions     → ignore all above; inherit `this` LEXICALLY
```

---

## 3. Global Context
```js
console.log(this);   // browser: window | Node module: {} (module.exports) | Node REPL: global
// strict mode standalone function:
function f() { 'use strict'; console.log(this); }  // undefined
function g() { console.log(this); }                // window (non-strict)
```

## 4. Object (Implicit) Context
```js
const user = {
  name: 'Ana',
  greet() { console.log(this.name); }
};
user.greet();           // 'Ana' — this = user
const g = user.greet;
g();                    // undefined / error — lost binding (default)
```
**Lost `this`:** extracting a method loses its implicit binding → common bug (pass `user.greet.bind(user)`).

## 5. Constructor (`new`) Context
```js
function Person(name) {
  this.name = name;     // this = brand-new object
}
const p = new Person('Bob');   // p.name = 'Bob'
```
`new` creates an object, sets its prototype, binds `this` to it, returns it (unless constructor returns an object).

---

## 6. `call`, `apply`, `bind`
**Definition:** Explicitly set `this`.
| Method | Calls now? | Args |
|--------|-----------|------|
| `call(thisArg, a, b)` | ✅ immediately | comma-separated |
| `apply(thisArg, [a, b])` | ✅ immediately | array |
| `bind(thisArg, a)` | ❌ returns new fn | partial, call later |
```js
function intro(greeting) { return `${greeting}, ${this.name}`; }
const user = { name: 'Ana' };
intro.call(user, 'Hi');           // 'Hi, Ana'
intro.apply(user, ['Hello']);     // 'Hello, Ana'
const bound = intro.bind(user);   // returns fn
bound('Hey');                     // 'Hey, Ana'
```
**Mnemonic:** **C**all = **C**omma, **A**pply = **A**rray, **B**ind = **B**ound (later).

---

## 7. Arrow Function Behavior (critical)
Arrow functions have **no own `this`** — they capture `this` from the **enclosing lexical scope** at definition time. Also no own `arguments`, can't be `new`-ed, no `prototype`.
```js
const obj = {
  name: 'Ana',
  regular() { setTimeout(function () { console.log(this.name); }, 0); }, // undefined (default binding)
  arrow()   { setTimeout(() => console.log(this.name), 0); }            // 'Ana' (lexical this = obj)
};
```
**Use arrows** for callbacks needing the outer `this` (timers, array methods inside methods). **Don't use arrows** as object methods that need their own `this`.

---

## 8. `this` in Classes
```js
class Counter {
  count = 0;
  inc() { this.count++; }                 // this = instance
  incArrow = () => { this.count++; };     // bound to instance (class field arrow)
}
const c = new Counter();
const f = c.inc; f();        // ❌ this undefined (lost) → TypeError
const a = c.incArrow; a();   // ✅ works (arrow bound to instance)
```
React-style: class field arrows auto-bind `this` to the instance.

---

## OUTPUT PREDICTION QUESTIONS
```js
// 1
const obj = { x: 1, getX() { return this.x; } };
const fn = obj.getX;
console.log(obj.getX());  // 1
console.log(fn());        // undefined (lost binding)

// 2
const obj2 = {
  x: 10,
  inner: { x: 20, get() { return this.x; } }
};
console.log(obj2.inner.get());  // 20 (this = inner)

// 3
function f() { return this; }
console.log(f() === globalThis);  // true (non-strict) / false→undefined (strict)

// 4
const o = {
  val: 42,
  normal() { return (() => this.val)(); },  // arrow inherits o
  arrow: () => this.val                      // this = module/undefined
};
console.log(o.normal());  // 42
console.log(o.arrow());   // undefined

// 5
const btn = { clicks: 0, click() { [1].forEach(function(){ this.clicks++; }); } };
// `this` inside forEach callback = undefined → error; fix: arrow or thisArg
```

---

## INTERVIEW QUESTIONS
**🟢:** What determines `this`? · call vs apply vs bind? · Arrow function `this`?
**🟡:** Why is `this` lost when extracting a method? · 4 binding rules + priority? · `this` in setTimeout callback?
**🔴:** Implement `bind` from scratch. · `new` keyword internals + `this`. · Arrow vs regular in class methods. · `this` with call/apply edge cases (null/primitive boxing).
**🧩:** Method passed as callback loses context — fix 3 ways. · Predict nested object `this`. · Why does React need binding (or class arrows)?

**Implement bind:**
```js
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...args) { return fn.apply(ctx, [...preset, ...args]); };
};
```

## ⚡ REVISION
- `this` = decided by **call site**: new > call/apply/bind > obj.method() > default (undefined strict).
- Arrow fns = lexical `this` (no own), no arguments/prototype, can't `new`.
- call (comma, now), apply (array, now), bind (returns fn, later).
- Extracting a method loses binding → use bind/arrow.
- Class field arrows auto-bind to instance.

➡️ Next: **Module 7 — Objects.**
