# Polyfills (call, apply, bind, map, filter, reduce)

## Difficulty
Medium / Hard

## Category
Functions / Prototypes / Interview Favorites

## Problem Statement

Implement from scratch the core function and array methods that interviewers love to ask: `call`, `apply`, `bind`, `map`, `filter`, `reduce`. Writing these proves you understand `this` binding, the prototype chain, and higher-order functions.

---

## `Function.prototype.myCall`

`call` invokes a function with an explicit `this` and individually-passed arguments.

```js
Function.prototype.myCall = function (context = {}, ...args) {
  if (typeof this !== "function") {
    throw new TypeError(this + " is not callable");
  }
  context.fn = this;            // attach the function to the context
  const result = context.fn(...args);
  delete context.fn;            // clean up the temporary property
  return result;
};
```

> A robust implementation uses a unique `Symbol` key instead of `fn` to avoid clobbering an existing property.

---

## `Function.prototype.myApply`

Same as `call`, but arguments arrive as an array.

```js
Function.prototype.myApply = function (context = {}, args = []) {
  if (typeof this !== "function") throw new TypeError(this + " is not callable");
  if (!Array.isArray(args)) throw new TypeError("args must be an array");
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
```

---

## `Function.prototype.myBind`

`bind` returns a **new function** with `this` (and optionally some leading args) permanently fixed; it is called later.

```js
Function.prototype.myBind = function (context = {}, ...boundArgs) {
  if (typeof this !== "function") throw new TypeError("not bindable");
  const fn = this;
  return function (...newArgs) {
    return fn.apply(context, [...boundArgs, ...newArgs]); // partial application
  };
};
```

---

## `Array.prototype.myMap`

Returns a new array of transformed values. Callback gets `(value, index, array)`.

```js
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    out.push(cb(this[i], i, this));
  }
  return out;
};
```

---

## `Array.prototype.myFilter`

Returns elements for which the callback is truthy.

```js
Array.prototype.myFilter = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (cb(this[i], i, this)) out.push(this[i]); // push the element, not cb's return
  }
  return out;
};
```

> ⚠️ The source pushed `cb(...)`'s return value. Correct `filter` pushes the **element** (`this[i]`) when the predicate is truthy.

---

## `Array.prototype.myReduce`

Folds the array into a single accumulated value.

```js
Array.prototype.myReduce = function (cb, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  if (acc === undefined) {        // no initial value → use first element
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    acc = cb(acc, this[i], i, this);
  }
  return acc;
};
```

> ⚠️ The source used `if (accumulator)` which mishandles falsy accumulators (`0`, `""`). Detect "no initial value" with `=== undefined` and a start index instead.

---

## Common Interview Follow-up Questions

1. Why use a `Symbol` key in `call`/`apply` instead of `fn`? (Avoid overwriting an existing property.)
2. How does `bind` enable **partial application**?
3. What's the bug in `if (accumulator)` for `reduce`? (Falsy accumulators get skipped.)
4. Make `bind` work with `new` (constructor calls).

## Edge Cases

* `call`/`apply` on a non-function → throw
* `reduce` on an empty array with no initial value → should throw (`TypeError`)
* `filter` pushing the wrong value
* Sparse arrays (native methods skip holes; naive polyfills don't)

## Key Takeaways

* `call`/`apply` differ only in how arguments are passed; `bind` returns a deferred, partially-applied function.
* Watch the classic bugs: falsy-accumulator in `reduce`, wrong push value in `filter`.
* Related: [call-apply-bind concept](../concepts/call-apply-bind.md), [this-keyword](../concepts/this-keyword.md).
