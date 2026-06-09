# Remove Duplicates from an Array

## Difficulty
Easy

## Category
Arrays / Hash Set

## Problem Statement

Given an array, return a new array containing only unique elements, preserving first-seen order.

## Example

```text
Input:  [4, 4, 5, 6, 6, 7]
Output: [4, 5, 6, 7]
```

---

## Approach 1 — Seen Object

### Explanation

Track seen values in an object/hash. Push an element only the first time it appears.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const removeDuplicates = (arr = []) => {
  const seen = {};
  const unique = [];
  for (const x of arr) {
    if (!seen[x]) {
      seen[x] = true;
      unique.push(x);
    }
  }
  return unique;
};
```

> ⚠️ An object coerces keys to strings, so `1` and `"1"` collide. Use a `Set` to preserve types.

---

## Approach 2 — Set (Idiomatic)

### Explanation

`new Set(arr)` removes duplicates with strict equality and preserves insertion order. Spread back to an array.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const removeDuplicates = (arr = []) => [...new Set(arr)];
```

---

## Approach 3 — Two Pointers (Sorted Array, In-Place)

### Explanation

If the array is **sorted**, duplicates are adjacent. A slow/fast pointer pair overwrites duplicates in place using O(1) extra space (LeetCode 26).

### Solution

```js
const removeDuplicatesSorted = (arr) => {
  if (arr.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  return slow + 1; // new length
};
```

---

## Common Interview Follow-up Questions

1. Why might `1` and `"1"` collide in the object approach? (Object keys are strings.)
2. Return only the elements that appear **more than once** (the duplicates themselves).
3. De-duplicate an array of **objects** by a key — see [remove-duplicate-objects](../object-questions/remove-duplicate-objects.md).

## Edge Cases

* Empty array → `[]`
* No duplicates → unchanged
* Mixed types (`1` vs `"1"`) — `Set` keeps them distinct, object does not
* `NaN` — `Set` treats `NaN` as equal to itself (handled correctly)

## Key Takeaways

* `[...new Set(arr)]` is the go-to, type-safe one-liner.
* For a sorted array, two pointers give O(1) space.
