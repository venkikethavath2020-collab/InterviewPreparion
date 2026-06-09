# The `this` Keyword

## Definition

`this` is a reference determined by **how a function is called** (its call site), not where it is defined — except for arrow functions, which inherit `this` lexically.

## Why It Exists

`this` lets the same function operate on different objects (method sharing, reuse via `call`/`apply`/`bind`) without hard-coding the target.

## Internal Working — Binding Rules (in priority order)

1. **`new` binding** — `new Fn()` → `this` is the brand-new instance.
2. **Explicit binding** — `fn.call/apply/bind(obj)` → `this` is `obj`.
3. **Implicit binding** — `obj.method()` → `this` is `obj` (the object left of the dot).
4. **Default binding** — plain `fn()` → `this` is `undefined` (strict mode) or the global object (non-strict, "this substitution").
5. **Arrow functions** — no own `this`; they capture `this` from the enclosing lexical scope.

## Example

```js
// Global scope
console.log(this); // browser: window | Node module: {} | Node global: globalThis

// Plain function call
function show() { console.log(this); }
show();        // strict: undefined | non-strict: global object

// Method call → object
const obj = {
  a: 10,
  x() { console.log(this); }, // → obj
};
obj.x();

// Arrow function → lexical (does NOT bind to obj)
const sample = {
  a: 100,
  x: () => console.log(this), // → outer/global `this`, not sample
};
sample.x();

// Nested arrow inherits the enclosing method's `this`
const sample2 = {
  a: 43,
  x() {
    const inner = () => console.log(this); // → sample2
    inner();
  },
};
sample2.x();
```

## Strict vs Non-Strict Mode

```js
function f() { console.log(this); }
f();             // non-strict → global object (this substitution)
// "use strict" → undefined
```

## Interview Explanation

> "`this` is set at call time by four rules — new > explicit (call/apply/bind) > implicit (object.method) > default. Arrow functions are the exception: they have no own `this` and use the surrounding scope's `this`."

## Sharing Methods with call/apply/bind

```js
const student = { name: "Venki", printName() { console.log(this.name); } };
const other = { name: "Kethavath" };
student.printName.call(other); // "Kethavath"
```
See [call-apply-bind](./call-apply-bind.md).

## Real-world Use Cases

* Object methods accessing their own state.
* Reusing a method across objects via `call`/`apply`.
* Arrow functions in callbacks/class fields to keep the outer `this` (e.g. React handlers, `setTimeout`).

## Common Mistakes

* Using an arrow function as an object **method** expecting `this` to be the object — it won't be.
* Losing `this` when passing a method as a callback (`setTimeout(obj.fn)` → default binding). Fix with `bind` or an arrow wrapper.
* Forgetting that strict mode makes default `this` `undefined`.

## `this` in Other Contexts

* **DOM event handler** (regular function): `this` = the element.
* **Class methods**: `this` = the instance (when called on it).
* **Module top level (Node)**: `this` = `module.exports` (`{}`).

## Interview Questions

1. What are the rules that determine `this`?
2. Why is `this` `undefined` inside a plain function in strict mode?
3. How do arrow functions handle `this`?
4. Output prediction for `obj.method` vs detached `const m = obj.method; m()`.

## Senior-Level Discussion

* `this` substitution and the strict/non-strict split are common source-of-bug areas.
* Class fields with arrow functions auto-bind `this` (no constructor `.bind`).
* `bind` creates a permanently-bound copy; re-binding has no effect.

## Key Takeaways

* `this` depends on the **call site**, governed by new > explicit > implicit > default.
* Arrow functions inherit `this` lexically — never use them as object methods needing `this`.

Related: [call-apply-bind](./call-apply-bind.md), [closures](./closures.md), [prototype](./prototype.md), [strict-mode](./strict-mode.md).
