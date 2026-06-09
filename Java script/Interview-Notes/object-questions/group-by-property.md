# Group Objects by a Property

## Difficulty
Easy / Medium

## Category
Objects / Hash Map

## Problem Statement

Given an array of objects, group them into buckets keyed by a property (e.g. `dept`).

## Example

```text
Input:
[
  { name: "Venki", dept: "IT" },
  { name: "Raj",   dept: "HR" },
  { name: "Sam",   dept: "IT" }
]

Output:
{
  IT: [{ name: "Venki", dept: "IT" }, { name: "Sam", dept: "IT" }],
  HR: [{ name: "Raj", dept: "HR" }]
}
```

---

## Approach 1 — Accumulator Object

### Explanation

For each item, look up its bucket by the grouping key; create the array on first sight, then push.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const groupByDepartment = (arr = []) => {
  const result = {};
  for (const item of arr) {
    (result[item.dept] ||= []).push(item);
  }
  return result;
};
```

---

## Approach 2 — Generic `groupBy` (Reusable)

### Explanation

Parameterize the key — either a property name or a selector function. This mirrors lodash's `groupBy` and the new `Object.groupBy`.

### Solution

```js
const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const key = typeof keyFn === "function" ? keyFn(item) : item[keyFn];
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

// Usage:
groupBy(data, "dept");
groupBy(data, (x) => (x.marks >= 70 ? "pass" : "fail"));
```

---

## Native (Modern)

```js
Object.groupBy(data, (item) => item.dept); // ES2024 / Stage 4
```

---

## Common Interview Follow-up Questions

1. Group by a computed bucket (e.g. age range, pass/fail).
2. Return counts per group instead of the items — see [count-by-id](./count-by-id.md).
3. Group by multiple keys (composite key).

## Edge Cases

* Empty array → `{}`
* Missing grouping key → grouped under `"undefined"`
* Group key that collides numerically/string-wise

## Key Takeaways

* A generic `groupBy(arr, keyFn)` is far more reusable than a one-off function.
* `Object.groupBy` is the native equivalent in modern runtimes.
