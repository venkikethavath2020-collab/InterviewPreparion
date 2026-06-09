# Closures

## Definition

A **closure** is a function bundled together with references to its surrounding (lexical) state. A function "remembers" the variables of the scope in which it was *defined*, even after that outer function has finished executing.

> Function + Lexical Environment = Closure

## Why It Exists

Closures fall naturally out of JavaScript's lexical scoping. They enable **data privacy**, **stateful functions**, **partial application/currying**, and **callbacks that retain context** — without classes or globals.

## Internal Working

When a function is created, it keeps a hidden reference to its lexical environment (the variable bindings around it). Those bindings stay alive as long as the closure is reachable, even after the outer call returns. Closures hold **references**, not copies.

## Example

```js
function outer() {
  let count = 0;            // private to outer
  return function inner() {
    count++;                // inner still sees count after outer() returned
    console.log(count);
  };
}

const fn = outer();
fn(); // 1
fn(); // 2  ← state persists across calls
```

Each call to the outer function creates a **fresh** environment:

```js
function test() {
  let a = 10;
  return () => { a++; console.log(a); };
}
const fn1 = test();
const fn2 = test();
fn1(); // 11
fn2(); // 11  ← independent closure
fn1(); // 12
```

## Interview Explanation

> "A closure is when an inner function retains access to variables from its outer function's scope even after the outer function has returned. It works because functions capture a reference to their lexical environment, which the garbage collector keeps alive as long as the closure exists."

## Real-world Use Cases

**1. Private variables / encapsulation**
```js
function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}
```

**2. Function factories**
```js
const multiplier = (factor) => (n) => n * factor;
const double = multiplier(2);
double(5); // 10
```

**3. Currying** — `const sum = a => b => c => a + b + c;`

**4. Event handlers / callbacks** that close over component state.

## Common Mistakes

**The `var` loop trap:**
```js
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0); // 4 4 4
}
```
All callbacks share one `i` (function-scoped). Fix with `let` (block-scoped, fresh binding per iteration):
```js
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 0); // 1 2 3
}
```

* **Memory leaks** — closures keep referenced variables alive; detach unused handlers.
* Assuming closures copy values — they capture **references**.

## Interview Questions

1. Explain closures with an example.
2. Why does the `var` + `setTimeout` loop print `4 4 4`? How do you fix it?
3. Implement a private counter using a closure.
4. How do closures cause memory leaks?

## Senior-Level Discussion

* Closures + the module pattern (IIFE) predate ES modules for encapsulation.
* Every function technically forms a closure; the cost is only meaningful when it retains large objects.
* In React, stale-closure bugs in hooks (`useEffect` capturing an old state value) are a direct consequence of this mechanism — dependency arrays exist to refresh the captured environment.

## Key Takeaways

* Closures capture references to their lexical scope, not snapshots.
* They power privacy, currying, memoization, and stateful callbacks.
* `let` vs `var` in loops is the canonical closure gotcha.

Related: [scope](./scope.md), [hoisting](./hoisting.md), [currying](./currying.md).
