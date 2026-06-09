# Intersection of Two Arrays

## Difficulty
Easy

## Category
Arrays / Hash Set

## Problem Statement

Given two arrays, return their intersection. Clarify whether the result should be **unique** values or should account for **multiplicity** (LeetCode 349 vs 350).

## Example

```text
Input:  [1, 2, 2, 3], [2, 2, 4]
Output (unique):       [2]
Output (multiplicity): [2, 2]
```

---

## Approach 1 — Set Membership (Unique Intersection)

### Explanation

Put one array in a `Set` for O(1) lookups, filter the other, then de-duplicate.

### Time Complexity
O(n + m)

### Space Complexity
O(n)

### Solution

```js
const intersection = (a, b) => {
  const setA = new Set(a);
  return [...new Set(b.filter((x) => setA.has(x)))];
};
```

---

## Approach 2 — Frequency Map (With Multiplicity)

### Explanation

Count occurrences in the first array; for each element of the second, emit it while its remaining count is positive. Preserves duplicates correctly.

### Time Complexity
O(n + m)

### Space Complexity
O(n)

### Solution

```js
const intersect = (a, b) => {
  const freq = {};
  for (const x of a) freq[x] = (freq[x] || 0) + 1;
  const result = [];
  for (const x of b) {
    if (freq[x] > 0) {
      result.push(x);
      freq[x]--;
    }
  }
  return result;
};
```

---

## Common Interview Follow-up Questions

1. Return the **union** instead of the intersection.
2. Return the **difference** (elements in A not in B).
3. What if the arrays are sorted? (Two pointers, O(1) extra space.)
4. What if one array is huge and one is tiny? (Build the set from the smaller one.)

## Edge Cases

* No common elements → `[]`
* Duplicates in both — unique vs multiplicity changes the result
* One empty array → `[]`
* Order of output (preserve input order vs not)

## Key Takeaways

* Build the hash set from the **smaller** array to minimize memory.
* Decide up front whether duplicates should be preserved.
