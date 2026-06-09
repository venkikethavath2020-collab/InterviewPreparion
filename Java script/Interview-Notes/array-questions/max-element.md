# Maximum Element in an Array

## Difficulty
Easy

## Category
Arrays

## Problem Statement

Find the maximum element in an array.

## Example

```text
Input:  [5, 3, 9, 1, 6]
Output: 9
```

---

## Approach 1 — Single Pass

### Explanation

Initialize `max` to the **first element** (not 0 — that breaks for all-negative arrays) and update while scanning.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const findMax = (arr = []) => {
  if (arr.length === 0) return null;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
};
```

> ⚠️ A common bug (seen in the source files) is initializing `max = 0`. For `[-5, -3, -9]` that wrongly returns `0`. Always seed with `arr[0]` or `-Infinity`.

---

## Approach 2 — Built-ins

### Explanation

`Math.max` with spread, or `reduce`. Note `Math.max(...arr)` can blow the call-stack for very large arrays (argument limit ~100k+).

### Solution

```js
const findMax = (arr = []) => Math.max(...arr);

// Stack-safe for huge arrays:
const findMaxSafe = (arr = []) => arr.reduce((m, x) => (x > m ? x : m), -Infinity);
```

---

## Common Interview Follow-up Questions

1. Find min and max in a **single pass** (track both).
2. Find the max without comparison operators (rarely asked).
3. Why does `Math.max(...arr)` fail for very large arrays? (Spread hits the argument-count limit.)

## Edge Cases

* Empty array → `null` (or throw — clarify)
* All negative numbers — must seed with `arr[0]`/`-Infinity`, never `0`
* Single element
* `NaN` present (`>` comparisons with `NaN` are always false)

## Key Takeaways

* Seed `max` with `arr[0]` or `-Infinity`, never `0`.
* `reduce` is the stack-safe alternative to `Math.max(...arr)`.
