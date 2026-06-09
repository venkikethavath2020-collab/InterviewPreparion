# 🔴 Hard / Senior-Level Problems

> Advanced challenges and the deep-internals topics that separate senior candidates. These probe your understanding of the language machinery, not just algorithms.

[← Back to Master Guide](./MASTER_INTERVIEW_GUIDE.md)

## Table of Contents
- [Implement From Scratch (Polyfills)](#implement-from-scratch-polyfills)
- [Advanced Function Patterns](#advanced-function-patterns)
- [Deep Internals](#deep-internals)

---

## Implement From Scratch (Polyfills)

The single most common senior ask — "implement X yourself."

| Challenge | Tests |
|---|---|
| [`Function.prototype.call`](./functions-performance/polyfills.md) | `this` binding, temp property cleanup |
| [`Function.prototype.apply`](./functions-performance/polyfills.md) | array args, type validation |
| [`Function.prototype.bind`](./functions-performance/polyfills.md) | partial application, deferred invocation |
| [`Array.prototype.map`](./functions-performance/polyfills.md) | callback signature `(v, i, arr)` |
| [`Array.prototype.filter`](./functions-performance/polyfills.md) | push element, not predicate return |
| [`Array.prototype.reduce`](./functions-performance/polyfills.md) | initial-value handling (the falsy bug) |
| [`memoize`](./functions-performance/memoize.md) | closure cache, `key in cache` correctness |

## Advanced Function Patterns

| Challenge | Tests |
|---|---|
| [Generic Curry](./concepts/currying.md) | closures, arity, partial application |
| [Debounce with leading edge + cancel](./functions-performance/debounce.md) | timers, `this`/args forwarding |
| [Throttle with trailing call](./functions-performance/throttle.md) | timestamps vs timers |
| [Quick Sort (in-place Lomuto)](./sorting-recursion/quick-sort.md) | partitioning, O(log n) space, worst case |

## Deep Internals (Senior Theory)

These concept docs include a **Senior-Level Discussion** section.

| Topic | Senior angle |
|---|---|
| [Event Loop](./concepts/event-loop.md) | micro vs macro tasks, Node phases, starvation |
| [Closures](./concepts/closures.md) | stale closures in hooks, memory retention |
| [Prototype Chain](./concepts/prototype.md) | `Object.create(null)`, extending built-ins |
| [`this` Keyword](./concepts/this-keyword.md) | binding precedence, `this` substitution |
| [Promises](./concepts/promises.md) | combinator failure semantics, microtask timing |
| [Async/Await](./concepts/async-await.md) | parallel vs sequential, top-level await |
| [Execution Context](./concepts/execution-context.md) | creation vs execution phase, call stack |
| [Memory Leaks & GC](./concepts/memory-leaks.md) | mark-and-sweep, WeakMap, detached DOM |
| [Type Coercion](./concepts/type-coercion.md) | `ToPrimitive`, `[] + {}`, `==` edge cases |

---

## Recommended Hard Output-Prediction Drills

```js
// 1. Event loop ordering
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// → 1, 4, 3, 2   (see event-loop.md)

// 2. Closure in a loop
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
// → 3, 3, 3   (see closures.md)

// 3. this binding
const o = { x: 1, f() { return (() => this.x)(); } };
o.f(); // → 1   (arrow inherits this — see this-keyword.md)

// 4. Coercion
console.log([] + []);   // ""
console.log([] + {});   // "[object Object]"
console.log(+[1,2]);    // NaN   (see type-coercion.md)
```

---

**Back to:** [Master Guide](./MASTER_INTERVIEW_GUIDE.md) · [Concepts](./JAVASCRIPT_CONCEPTS.md)
