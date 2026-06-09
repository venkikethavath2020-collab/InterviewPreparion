# Sum of Object Values

## Difficulty
Easy

## Category
Objects

## Problem Statement

Given an object whose values are numbers, return the sum of all values. Variants combine this with object→array conversion and key/value transforms.

## Example

```text
Input:  { a: 10, b: 20, c: 30 }
Output: 60
```

---

## Approach 1 — `Object.values` + `reduce`

### Explanation

`Object.values` gives the values array; `reduce` sums them.

### Time Complexity
O(n)

### Space Complexity
O(n) — values array (O(1) with a `for...in` loop).

### Solution

```js
const sumObjectValues = (obj = {}) =>
  Object.values(obj).reduce((sum, v) => sum + v, 0);
```

---

## Approach 2 — `for...in` (No Intermediate Array)

### Solution

```js
const sumObjectValues = (obj = {}) => {
  let sum = 0;
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) sum += obj[key];
  }
  return sum;
};
```

---

## Related: Object ↔ Array Conversions

```js
// Object to array of [key, value] pairs
const objToArray = (obj) => Object.entries(obj); // [["a", 1], ["b", 2]]

// Array of pairs back to object
const arrayToObj = (pairs) => Object.fromEntries(pairs);
```

---

## Common Interview Follow-up Questions

1. Sum only numeric values, skipping non-numbers. (`typeof v === "number"` guard.)
2. Sum nested object values recursively.
3. Convert an object's entries to an array and back.

## Edge Cases

* Empty object → `0`
* Non-numeric values → `NaN` unless filtered
* Inherited enumerable properties — `for...in` includes them; guard with `Object.hasOwn`
* Nested objects (would need recursion)

## Key Takeaways

* `Object.values(obj).reduce(...)` is the idiomatic one-liner.
* Use `Object.hasOwn` to avoid inherited keys with `for...in`.
