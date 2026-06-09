# Second Largest Element

## Difficulty
Easy / Medium

## Category
Arrays

## Problem Statement

Find the second largest element in an array. Clarify whether duplicates of the largest should be skipped (e.g. for `[20, 20, 10]` is the answer `10` or `20`?).

## Example

```text
Input:  [10, 5, 20, 8, 20]
Output: 10   (distinct second largest)
```

---

## Approach 1 — Single Pass, Two Trackers (Optimized)

### Explanation

Track `first` and `second` largest. When a value beats `first`, demote `first` to `second`. When a value sits strictly between `second` and `first`, update `second`. The `num < first` guard makes the result the **distinct** second largest.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const secondLargest = (arr = []) => {
  if (arr.length < 2) return null;
  let first = -Infinity;
  let second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num < first) {
      second = num;
    }
  }
  return second === -Infinity ? null : second;
};
```

---

## Approach 2 — Sort then Pick (Simpler, slower)

### Explanation

Sort descending and scan for the first value smaller than the max (to skip duplicates). O(n log n).

### Solution

```js
const secondLargest = (arr = []) => {
  const sorted = [...new Set(arr)].sort((a, b) => b - a);
  return sorted.length >= 2 ? sorted[1] : null;
};
```

---

## Common Interview Follow-up Questions

1. Should `[20, 20]` return `20` or `null`? (Defines "distinct" vs "second by position".)
2. Generalize to the **k-th** largest. (Quickselect → O(n) average, or a min-heap of size k.)
3. Find second smallest by symmetry.

## Edge Cases

* Array of length < 2 → `null`
* All elements equal (`[5, 5, 5]`) → no distinct second → `null`
* Negative numbers — seed with `-Infinity`, not `0`
* Exactly two elements

## Key Takeaways

* The single-pass two-tracker approach is O(n) time, O(1) space.
* The `num < first` clause is what makes the second largest *distinct*.
* For k-th largest, reach for Quickselect or a heap.
