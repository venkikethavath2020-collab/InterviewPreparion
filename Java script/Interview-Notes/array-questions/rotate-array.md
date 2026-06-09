# Rotate Array Right by K

## Difficulty
Medium

## Category
Arrays / Reversal Trick

## Problem Statement

Rotate an array to the right by `k` positions. Elements that fall off the end wrap around to the front.

## Example

```text
Input:  [1, 2, 3, 4, 5], k = 2
Output: [4, 5, 1, 2, 3]
```

---

## Approach 1 — Slice and Concat (Non-Mutating)

### Explanation

Normalize `k` with modulo, then take the last `k` elements and put them in front of the rest.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const rotateArray = (arr = [], k = 0) => {
  if (arr.length === 0) return arr;
  k = k % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k)];
};
```

> Careful: when `k % length === 0`, `slice(-0)` is `slice(0)` (the whole array). Guard against `k === 0` if needed.

---

## Approach 2 — Reversal Trick (In-Place, Optimized)

### Explanation

1. Reverse the whole array.
2. Reverse the first `k` elements.
3. Reverse the remaining `n - k` elements.

This yields a right rotation by `k` using O(1) extra space — the interview-favorite trick.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const reverseRange = (arr, l, r) => {
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    l++;
    r--;
  }
};

const rotateArray = (arr = [], k = 0) => {
  const n = arr.length;
  if (n === 0) return arr;
  k = k % n;
  reverseRange(arr, 0, n - 1);
  reverseRange(arr, 0, k - 1);
  reverseRange(arr, k, n - 1);
  return arr;
};
```

---

## Common Interview Follow-up Questions

1. Rotate **left** by `k`. (Rotate right by `n - k`, or change the reversal split point.)
2. Why take `k % n`? (`k` may exceed the array length.)
3. Rotate using a cyclic-replacement (juggling) algorithm.

## Edge Cases

* `k = 0` or `k = n` → array unchanged
* `k > n` → use `k % n`
* Empty / single-element array
* Negative `k` (left rotation)

## Key Takeaways

* `k % n` normalizes the rotation amount.
* The three-reversal trick is the canonical O(1)-space in-place solution.
