# Memoization

## Difficulty
Medium

## Category
Functions / Performance / Closures

## Definition

**Memoization** caches the result of a function for a given set of arguments, so repeated calls with the same inputs return the cached value instead of recomputing.

## Why It Exists

To trade memory for speed on **pure**, expensive, or repeatedly-called functions (DP subproblems, derived selectors, costly pure computations).

## Internal Working

A closure holds a cache (object or `Map`) keyed by a serialization of the arguments. On each call, look up the key; return the hit or compute, store, and return.

## Example

```js
function memoize(fn, context) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (!(key in cache)) {
      cache[key] = fn.apply(context || this, args);
    }
    return cache[key];
  };
}

const slowMultiply = (a, b) => {
  for (let i = 0; i < 1e7; i++) {} // simulate heavy work
  return a * b;
};

const fast = memoize(slowMultiply);
console.time("first");
fast(2e5, 3e6); // computes
console.timeEnd("first");

console.time("second");
fast(2e5, 3e6); // cached — near-instant
console.timeEnd("second");
```

> ⚠️ The original source used `if (!res[argsCache])` — a falsy cached result (`0`, `""`, `false`) would be recomputed. Use `key in cache` (or `cache.has(key)` with a `Map`) instead.

---

## Map-Based Variant (Handles Any Key Type)

```js
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
```

---

## Real-world Use Cases

* Memoized Fibonacci / DP subproblems — see [fibonacci](../number-questions/fibonacci.md)
* React `useMemo` / `useCallback`, Reselect selectors
* Caching pure API transforms
* Expensive layout / geometry calculations

## Common Mistakes

* Using `if (!cache[key])` instead of `key in cache` — falsy results break caching.
* `JSON.stringify` key collisions for object args (key order matters; functions/`undefined` are dropped).
* Memoizing **impure** functions — stale results when external state changes.
* Unbounded cache growth — consider an LRU eviction policy.

## Interview Questions

1. Implement a generic `memoize`.
2. How do you key on object arguments reliably?
3. When is memoization harmful? (Impure functions, low hit rate, memory pressure.)

## Key Takeaways

* Memoize **pure** functions only.
* Use `key in cache` / `Map.has` so falsy results cache correctly.
* Watch cache size — add LRU eviction for hot paths.
