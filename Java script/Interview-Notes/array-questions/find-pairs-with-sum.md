# Find All Pairs With a Given Sum

## Difficulty
Easy / Medium

## Category
Arrays / Hash Set

## Problem Statement

Given an array and a target, return **all unique pairs** of values that sum to the target.

## Example

```text
Input:  [1, 2, 3, 4, 5], target = 5
Output: [[1, 4], [2, 3]]
```

---

## Approach 1 — Brute Force

### Explanation

Check every pair. O(n²); fine for small inputs.

### Time Complexity
O(n²)

### Space Complexity
O(1) (excluding output)

### Solution

```js
const findPairs = (arr, target) => {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
};
```

---

## Approach 2 — Hash Set (Optimized, Unique Pairs)

### Explanation

For each number, check if its complement was seen. Use a `Set` of already-paired values to avoid duplicates.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const findPairs = (arr = [], target) => {
  const seen = new Set();
  const used = new Set();
  const pairs = [];
  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement) && !used.has(num) && !used.has(complement)) {
      pairs.push([complement, num]);
      used.add(num);
      used.add(complement);
    }
    seen.add(num);
  }
  return pairs;
};
```

---

## Approach 3 — Sort + Two Pointers

### Explanation

Sort, then move two pointers inward. Skipping equal neighbors avoids duplicate pairs. O(n log n).

### Solution

```js
const findPairs = (arr, target) => {
  const a = [...arr].sort((x, y) => x - y);
  let left = 0,
    right = a.length - 1;
  const pairs = [];
  while (left < right) {
    const sum = a[left] + a[right];
    if (sum === target) {
      pairs.push([a[left], a[right]]);
      left++;
      right--;
      while (left < right && a[left] === a[left - 1]) left++;
      while (left < right && a[right] === a[right + 1]) right--;
    } else if (sum < target) left++;
    else right--;
  }
  return pairs;
};
```

---

## Common Interview Follow-up Questions

1. Count the pairs instead of listing them.
2. Allow an element to pair with itself if it appears twice.
3. Return index pairs rather than value pairs.

## Edge Cases

* No pairs → `[]`
* Duplicate values producing duplicate pairs — must de-duplicate
* Target equal to twice an element (`[2,2]`, target 4)
* Negative numbers

## Key Takeaways

* Decide early whether pairs must be unique — it drives the `used`/skip logic.
* Hash set is O(n); sort + two pointers is O(n log n) but needs no extra hash.
