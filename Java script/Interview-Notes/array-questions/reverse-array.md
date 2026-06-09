# Reverse an Array

## Difficulty
Easy

## Category
Arrays / Two Pointers

## Problem Statement

Reverse an array. Two flavours are common:
1. **Non-mutating** — return a reversed copy, leaving the original intact.
2. **In-place** — reverse the original array using O(1) extra space.

## Example

```text
Input:  [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
```

---

## Approach 1 — Non-Mutating Copy

### Explanation

Build a new array by pushing elements from the end. The input is untouched.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
function reverse(arr) {
  let n = arr.length;
  const result = [];
  while (n !== 0) {
    result.push(arr[n - 1]);
    n--;
  }
  return result;
}

// Idiomatic non-mutating: [...arr].reverse()
```

---

## Approach 2 — In-Place Two Pointers (Optimized)

### Explanation

Swap the elements at the two ends and move both pointers toward the center. O(1) extra space — the optimal in-place solution.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const reverseArrayInPlace = (arr = []) => {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr;
};
```

---

## Common Interview Follow-up Questions

1. What does `Array.prototype.reverse()` do — mutate or copy? (It **mutates** in place and returns the same array.)
2. How do you reverse without mutating? (`[...arr].reverse()` or `arr.slice().reverse()`.)
3. Reverse only a sub-range `[i, j]`.

## Edge Cases

* Empty array → `[]`
* Single element → unchanged
* Even vs odd length (middle element stays put on odd length)

## Key Takeaways

* `reverse()` mutates; copy first if the original must be preserved.
* Two-pointer swap is the O(1)-space in-place answer.
