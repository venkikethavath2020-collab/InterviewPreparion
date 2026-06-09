# Find Only the Duplicate Elements

## Difficulty
Easy

## Category
Arrays / Hash Set

## Problem Statement

Given an array, return the elements that appear more than once (the duplicates themselves), not the unique list.

## Example

```text
Input:  [1, 3, 2, 4, 8, 9, 22, 2, 6, 1]
Output: [2, 1]
```

---

## Approach 1 — Seen Set

### Explanation

Keep a `Set` of values already seen. The first time you see a value again, it is a duplicate — push it.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const onlyDuplicates = (arr = []) => {
  const seen = new Set();
  const duplicates = [];
  for (const x of arr) {
    if (seen.has(x)) duplicates.push(x);
    else seen.add(x);
  }
  return duplicates;
};
```

> This pushes a value once per extra occurrence. For a value appearing 3×, it appears twice in the output. To list each duplicate value **once**, collect into a `Set` and spread.

---

## Approach 2 — Each Duplicate Value Once

### Solution

```js
const duplicateValues = (arr = []) => {
  const counts = {};
  const dups = new Set();
  for (const x of arr) {
    counts[x] = (counts[x] || 0) + 1;
    if (counts[x] === 2) dups.add(x);
  }
  return [...dups];
};
```

---

## Common Interview Follow-up Questions

1. List each duplicate exactly once vs. once per repeat.
2. Find the **single** duplicate in an array of `1..n` (Floyd's cycle detection, O(1) space).
3. Return the indices of duplicates.

## Edge Cases

* No duplicates → `[]`
* All identical → that value (once or many times depending on spec)
* Mixed types — `Set` keeps types distinct

## Key Takeaways

* Clarify "each duplicate once" vs "once per extra occurrence" — it changes the implementation.
* The seen-set pattern is the O(n) baseline.
