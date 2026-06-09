# Quick Sort

## Difficulty
Medium

## Category
Sorting / Divide & Conquer / Recursion

## Problem Statement

Sort an array using the quick-sort algorithm: pick a pivot, partition elements into those less than and those greater than the pivot, then recursively sort the partitions.

## Example

```text
Input:  [10, 7, 8, 9, 1, 5]
Output: [1, 5, 7, 8, 9, 10]
```

---

## Approach 1 — Functional Partition (Readable)

### Explanation

Choose the last element as the pivot. Build `left` (< pivot) and `right` (≥ pivot) arrays, recurse on each, and concatenate around the pivot. Clear to explain, but allocates new arrays.

### Time Complexity
- Average: O(n log n)
- Worst: O(n²) (already-sorted input with a poor pivot)

### Space Complexity
O(n) — extra arrays + recursion.

### Solution

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    (arr[i] < pivot ? left : right).push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

---

## Approach 2 — In-Place Lomuto Partition (Optimized Space)

### Explanation

Partition within the same array using index swaps — O(log n) stack space, no auxiliary arrays. This is what production quick-sort looks like.

### Time Complexity
O(n log n) average, O(n²) worst.

### Space Complexity
O(log n) — recursion only.

### Solution

```js
const quickSort = (arr, low = 0, high = arr.length - 1) => {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const p = i + 1;
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
};
```

---

## Common Interview Follow-up Questions

1. How do you avoid the O(n²) worst case? (Randomized or median-of-three pivot.)
2. Is quick sort stable? (No — equal elements may be reordered.)
3. Quick sort vs merge sort trade-offs? (Quick: in-place, cache-friendly, unstable, O(n²) worst. Merge: stable, O(n log n) guaranteed, O(n) space.)
4. Quickselect for the k-th smallest element (partition once, recurse one side → O(n) average).

## Edge Cases

* Empty / single-element array → returned as-is
* Already sorted / reverse sorted → worst case with naive pivot
* All duplicates → degrades to O(n²) with Lomuto; use 3-way partition (Dutch National Flag)

## Key Takeaways

* Average O(n log n); worst O(n²) — randomized pivot mitigates it.
* The functional version is easiest to explain; the in-place version is what is actually used.
* Quick sort is **not stable**.
