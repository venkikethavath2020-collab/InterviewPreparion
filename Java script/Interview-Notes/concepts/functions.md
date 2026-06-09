# Functions (Declarations, Expressions, Arrow, HOF)

## Definition

Functions are reusable, **first-class** values: they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures.

## Function Declaration vs Expression

```js
// Declaration (statement) — fully hoisted
function a() { console.log("a"); }

// Expression — assigned to a variable; not callable before assignment
const b = function () { console.log("b"); };
```

**Hoisting difference:**
```js
a1();  // ✅ works (declaration hoisted with body)
b1();  // ❌ TypeError (b1 is undefined until assignment)
function a1() {}
const b1 = function () {};
```

## Anonymous & Named Function Expressions

```js
const fn = function () {};            // anonymous
const fn2 = function named() {};      // named — `named` only visible inside itself
// useful for recursion and clearer stack traces
```

## Parameters vs Arguments

- **Parameters** — names in the signature.
- **Arguments** — actual values passed at call time.

## Arrow Functions

Differences from regular functions:
1. **Concise syntax** + implicit return: `const add = (a, b) => a + b;`
2. **No own `this`** — lexically inherited (see [this-keyword](./this-keyword.md)).
3. **No `arguments` object** — use rest params (`...args`).
4. **Cannot be used as constructors** (no `new`).

```js
const obj = {
  name: "venkatesh",
  arrow: () => console.log(this.name),    // undefined — `this` is outer scope
  regular() { console.log(this.name); },  // "venkatesh"
};
```

## First-Class & Higher-Order Functions

```js
// Passed as argument
function logGreeting(fn, name) { console.log(fn(name)); }

// Returned from a function
function makeGreeter(greeting) {
  return (name) => `${greeting}, ${name}!`;
}
const hello = makeGreeter("Hello");
hello("Bob"); // "Hello, Bob!"
```
A **higher-order function** takes and/or returns functions (`map`, `filter`, `reduce`, `makeGreeter`).

## Pure Functions

A pure function:
1. Returns the **same output** for the same input.
2. Has **no side effects** (no external mutation, no I/O).

Pure functions are easier to test, memoize, and reason about.

## IIFE (Immediately Invoked Function Expression)

```js
(function () {
  console.log("runs immediately, isolated scope");
})();
```
Used (pre-modules) for private scope.

## Interview Questions

1. Declaration vs expression — hoisting difference.
2. Differences between arrow and regular functions (`this`, `arguments`, `new`).
3. What are first-class and higher-order functions?
4. What makes a function pure?
5. What is an IIFE and why use one?

## Key Takeaways

* Functions are first-class values; HOFs take/return functions.
* Arrow functions: lexical `this`, no `arguments`, not constructible.
* Declarations hoist with body; expressions do not.
* Prefer pure functions for testability.

Related: [closures](./closures.md), [this-keyword](./this-keyword.md), [hoisting](./hoisting.md), [currying](./currying.md).
