# Find the Missing Number (1 → N)

## Difficulty
Easy

## Category
Arrays / Math / Bit Manipulation

## Problem Statement

Given an array containing `n - 1` distinct numbers taken from the range `1..n` (one number missing), find the missing number.

## Example

```text
Input:  [1, 2, 4, 5, 6], n = 6
Output: 3
```

---

## Approach 1 — Sum Formula (Gauss)

### Explanation

The sum of `1..n` is `n(n+1)/2`. Subtract the actual array sum to get the missing value. Single pass, O(1) space.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const findMissingNumber = (arr = [], n) => {
  const expected = (n * (n + 1)) / 2;
  const actual = arr.reduce((sum, x) => sum + x, 0);
  return expected - actual;
};

// If n is not given, it equals arr.length + 1:
const findMissing = (arr = []) => {
  const n = arr.length + 1;
  const expected = (n * (n + 1)) / 2;
  return expected - arr.reduce((s, x) => s + x, 0);
};
```

---

## Approach 2 — XOR (Overflow-Safe, Optimized)

### Explanation

XOR all numbers `1..n` and all array elements together. Equal values cancel out (`a ^ a = 0`), leaving the missing number. Avoids the integer-overflow risk of large sums.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const findMissingXor = (arr = [], n) => {
  let xor = 0;
  for (let i = 1; i <= n; i++) xor ^= i;
  for (const num of arr) xor ^= num;
  return xor;
};
```

---

## Common Interview Follow-up Questions

1. Two numbers are missing — how do you find both? (Sum + sum-of-squares, or XOR partitioning.)
2. The range starts at 0 (LeetCode 268).
3. Why prefer XOR over the sum formula for very large `n`? (No overflow.)

## Edge Cases

* Missing number is `1` or `n` (the boundaries)
* Empty array with `n = 1` → missing is `1`
* Very large `n` where the sum could overflow

## Key Takeaways

* The Gauss sum is the simplest; XOR is the overflow-safe equivalent.
* Both are O(n) time, O(1) space.
