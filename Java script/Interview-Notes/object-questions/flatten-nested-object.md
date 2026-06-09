# Flatten a Nested Object

## Difficulty
Medium

## Category
Recursion / Objects

## Problem Statement

Given a nested object, flatten it into a single-level object whose keys are dot-separated paths.

## Example

```text
Input:  { a: { b: 1, c: { d: 2 } } }
Output: { "a.b": 1, "a.c.d": 2 }
```

---

## Approach 1 — Recursion with Path Accumulator

### Explanation

Recurse over keys, building a dot-joined `newKey`. When a value is a (non-null) object, recurse; otherwise assign the leaf into the result.

### Time Complexity
O(n) — n total keys.

### Space Complexity
O(d) — recursion depth + result.

### Solution

```js
const flattenObject = (obj = {}, parent = "", res = {}) => {
  for (const key in obj) {
    const newKey = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
};
```

> Note the `typeof null === "object"` quirk — the explicit `!== null` check prevents recursing into `null`. The `!Array.isArray` guard keeps arrays as leaves; remove it if arrays should also be flattened (`a.0`, `a.1`).

---

## Approach 2 — Unflatten (Reverse Operation)

### Explanation

A common follow-up: turn `{ "a.b.c": 1 }` back into nested form.

### Solution

```js
const unflatten = (flat) => {
  const result = {};
  for (const path in flat) {
    const keys = path.split(".");
    keys.reduce((acc, key, i) => {
      if (i === keys.length - 1) acc[key] = flat[path];
      else acc[key] = acc[key] || {};
      return acc[key];
    }, result);
  }
  return result;
};
```

---

## Common Interview Follow-up Questions

1. Handle arrays — should `{ a: [1, 2] }` become `{ "a.0": 1, "a.1": 2 }`?
2. Why is `typeof null === "object"` a problem here?
3. Write the inverse `unflatten` function.
4. Handle circular references (would infinite-loop without a visited set).

## Edge Cases

* `null` values — must not recurse into them
* Empty nested objects (`{ a: {} }`) — produce no leaf key
* Arrays as values
* Circular references

## Key Takeaways

* Guard against `typeof null === "object"` explicitly.
* Decide whether arrays are leaves or should be indexed into the path.
