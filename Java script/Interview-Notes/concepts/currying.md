# Currying

## Definition

**Currying** transforms a function that takes multiple arguments into a sequence of functions each taking one (or fewer) argument: `f(a, b, c)` → `f(a)(b)(c)`.

## Why It Exists

Currying enables **partial application** (fix some args now, supply the rest later), cleaner **function composition**, and small **reusable** specialized functions.

## Internal Working

A curried function collects arguments across calls (using closures). When it has received at least the function's **arity** (`fn.length`), it invokes the original; otherwise it returns a new function awaiting more arguments.

## Example

**Manual currying:**
```js
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6
```

**Generic curry (handles any arity, flexible grouping):**
```js
function curry(fn) {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

curriedSum(1)(2)(3);   // 6
curriedSum(1, 2)(3);   // 6
curriedSum(1)(2, 3);   // 6
curriedSum(1, 2, 3);   // 6
```

## Partial Application vs Currying

- **Currying**: always one-argument-at-a-time chains until arity is met.
- **Partial application**: pre-fill *some* arguments, leaving a function that takes the rest (`fn.bind(null, a)`).

Currying is one way to implement partial application.

## Interview Explanation

> "Currying turns `f(a,b,c)` into `f(a)(b)(c)`. A generic curry uses closures to accumulate arguments and only calls the original once it has enough (`fn.length`). It's great for partial application and composition."

## Real-world Use Cases

* Reusable specialized functions: `const add5 = add(5)`.
* Function composition pipelines (Ramda, lodash/fp).
* Event-handler / configuration factories.
* Logging: `const logError = log("ERROR")`.

## Common Mistakes

* **Arity is lost** for variadic functions (`fn.length` ignores rest params/defaults) — generic curry can't know when to stop.
* Currying changes how `this` works — be careful with methods (prefer arrow-based currying or bind context explicitly).
* Over-currying everything hurts readability and adds slight call overhead.

## Interview Questions

1. Implement a generic `curry` function.
2. Difference between currying and partial application.
3. Curry a function that supports both `sum(1)(2)(3)` and `sum(1,2,3)`.
4. Implement infinite currying: `sum(1)(2)(3)...()` returning the total.

## Senior-Level Discussion

* Preserve function metadata (`name`, `length`) with `Object.defineProperty` if downstream code depends on it.
* Infinite currying uses a function with a custom `toString`/`valueOf` to return the accumulated value when coerced.
* fp libraries auto-curry; understand placeholder arguments (`_`) for argument skipping.

## Key Takeaways

* Currying = one-arg-at-a-time via closures until arity is satisfied.
* Powers partial application, reuse, and composition — but use judiciously.

Related: [closures](./closures.md), [call-apply-bind](./call-apply-bind.md), [functions](./functions.md).
