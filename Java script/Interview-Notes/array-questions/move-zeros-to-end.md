# Move Zeros to End

## Difficulty
Easy

## Category
Arrays / Two Pointers

## Problem Statement

Move all zeros in an array to the end while maintaining the relative order of the non-zero elements.

## Example

```text
Input:  [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]
```

---

## Approach 1 — Partition into Two Arrays (Non-Mutating)

### Explanation

Split into non-zeros and zeros, then concatenate. Simple but O(n) extra space.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const moveZerosToEnd = (arr = []) => {
  const nonZeros = [];
  const zeros = [];
  for (const x of arr) (x !== 0 ? nonZeros : zeros).push(x);
  return [...nonZeros, ...zeros];
};
```

---

## Approach 2 — In-Place Two Pointers (Optimized)

### Explanation

A write pointer (`nonZeroIndex`) tracks where the next non-zero goes. Copy non-zeros forward, then fill the remaining slots with 0. O(1) extra space.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const moveZerosToEnd = (arr = []) => {
  let nonZeroIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) arr[nonZeroIndex++] = arr[i];
  }
  while (nonZeroIndex < arr.length) arr[nonZeroIndex++] = 0;
  return arr;
};
```

---

## Approach 3 — Swap Variant

### Explanation

Swap each non-zero with the slot at the write pointer. Reduces total writes when there are few non-zeros.

### Solution

```js
const moveZeros = (arr) => {
  let last = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[last], arr[i]] = [arr[i], arr[last]];
      last++;
    }
  }
  return arr;
};
```

---

## Common Interview Follow-up Questions

1. Move zeros to the **front** instead.
2. Move all instances of a given value (not just 0).
3. Minimize the number of writes — the swap variant only writes non-zeros.

## Edge Cases

* Empty array → `[]`
* All zeros → unchanged
* No zeros → unchanged
* Zeros already at the end

## Key Takeaways

* The write-pointer technique is the canonical O(1)-space answer.
* Relative order of non-zeros must be preserved — don't sort.
