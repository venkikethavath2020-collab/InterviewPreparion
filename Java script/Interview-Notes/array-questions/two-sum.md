# Two Sum (Return Indices)

## Difficulty
Easy

## Category
Arrays / Hash Map

## Problem Statement

Given an array of numbers and a target, return the **indices** of the two numbers that add up to the target. Assume exactly one solution.

## Example

```text
Input:  [2, 7, 11, 15], target = 9
Output: [0, 1]   (2 + 7 = 9)
```

---

## Approach 1 — Brute Force (Nested Loops)

### Explanation

Check every pair `(i, j)`. Simple but quadratic.

### Time Complexity
O(n²)

### Space Complexity
O(1)

### Solution

```js
const twoSum = (arr, target) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) return [i, j];
    }
  }
  return null;
};
```

---

## Approach 2 — Hash Map (Optimized)

### Explanation

For each element, compute the complement `target - num`. If we have seen the complement, we have our pair. Otherwise record the current value → index. One pass, O(n).

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const twoSum = (arr = [], target) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const diff = target - arr[i];
    if (map[diff] !== undefined) return [map[diff], i];
    map[arr[i]] = i;
  }
  return null;
};
```

---

## Approach 3 — Two Pointers (Sorted Input)

### Explanation

If the array is sorted (or you may sort and track original indices), move pointers from both ends based on the current sum. O(n) after sort, O(1) extra space — but indices change after sorting, so this returns **values** unless you preserve original positions.

### Solution

```js
const twoSumSorted = (arr, target) => {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
  return null;
};
```

---

## Common Interview Follow-up Questions

1. Return the **values** instead of indices.
2. Multiple valid pairs — return all of them — see [find-pairs-with-sum](./find-pairs-with-sum.md).
3. Three Sum / Four Sum extensions.
4. What if the array is already sorted? (Two pointers, O(1) space.)

## Edge Cases

* No valid pair → `null`
* Duplicate values (`[3, 3]`, target 6) — the hash map handles this
* Negative numbers and zero
* Same element cannot be used twice

## Key Takeaways

* The hash-map pass is the canonical O(n) answer.
* Two pointers shine when the array is sorted and O(1) space is required.
