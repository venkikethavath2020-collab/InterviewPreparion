# Count Occurrences by ID

## Difficulty
Easy

## Category
Objects / Hash Map

## Problem Statement

Given an array of objects each with an `id`, count how many times each id appears.

## Example

```text
Input:  [{id:1}, {id:2}, {id:1}, {id:3}, {id:2}]
Output: { 1: 2, 2: 2, 3: 1 }
```

---

## Approach 1 — Accumulator Object

### Explanation

Iterate once, incrementing a counter keyed by id.

### Time Complexity
O(n)

### Space Complexity
O(k) — distinct ids.

### Solution

```js
const countById = (arr = []) => {
  const counts = {};
  for (const item of arr) {
    counts[item.id] = (counts[item.id] || 0) + 1;
  }
  return counts;
};
```

---

## Approach 2 — Reduce (Declarative)

### Solution

```js
const countById = (arr = []) =>
  arr.reduce((acc, { id }) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
```

---

## Common Interview Follow-up Questions

1. Group the full objects by id (not just count) — see [group-by-property](./group-by-property.md).
2. Count by an arbitrary key, passed as a parameter.
3. Return the id with the highest count.

## Edge Cases

* Empty array → `{}`
* Missing `id` on some objects → `undefined` becomes a key
* Numeric vs string ids (object keys are strings — `1` and `"1"` merge)

## Key Takeaways

* Object keys are always strings, so numeric and string ids collapse together.
* `reduce` and a plain `for` loop are equivalent here — pick for readability.
