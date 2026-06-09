# Flatten a Nested Array

## Difficulty
Medium

## Category
Recursion / Arrays

## Problem Statement

Given an arbitrarily nested array, flatten it into a single-level array. Variants ask for **infinite depth** or flattening up to a **given depth**.

## Example

```text
Input:  [1, [2, [3, 4], 5]]
Output: [1, 2, 3, 4, 5]

Input:  [1, [2, [3]], 4], depth = 1
Output: [1, 2, [3], 4]
```

---

## Approach 1 — Recursion (Infinite Depth)

### Explanation

Walk the array. If an element is itself an array, recurse; otherwise push it. The call stack depth equals the nesting depth.

### Time Complexity
O(n) — n total elements.

### Space Complexity
O(d) — recursion depth.

### Solution

```js
const flattenArray = (arr = []) => {
  const result = [];
  const helper = (sub) => {
    for (const item of sub) {
      if (Array.isArray(item)) helper(item);
      else result.push(item);
    }
  };
  helper(arr);
  return result;
};
```

---

## Approach 2 — Flatten by Depth

### Explanation

Carry a `depth` budget. Recurse only while the budget is positive; otherwise keep the nested array as-is.

### Solution

```js
const flattenByLevel = (arr = [], depth = 1) => {
  const result = [];
  arr.forEach((item) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenByLevel(item, depth - 1));
    } else {
      result.push(item);
    }
  });
  return result;
};
```

---

## Approach 3 — Iterative with a Stack (No Recursion)

### Explanation

Avoids stack-overflow on deeply nested input by using an explicit stack.

### Solution

```js
const flatten = (arr) => {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) stack.push(...next);
    else result.push(next);
  }
  return result.reverse(); // pop reverses order
};
```

---

## Built-in

```js
arr.flat(Infinity); // infinite depth
arr.flat(1);        // one level
```

---

## Common Interview Follow-up Questions

1. Implement `Array.prototype.flat` as a polyfill.
2. Flatten while filtering out a value (`flatMap`).
3. Why might deep recursion overflow the stack? (Each nesting level adds a frame — use the iterative version.)

## Edge Cases

* Already flat → unchanged
* Empty arrays inside (`[1, [], 2]`)
* Very deep nesting — prefer the iterative stack approach
* Mixed types

## Key Takeaways

* `arr.flat(Infinity)` is the built-in; know the recursive and iterative implementations.
* Recursion depth = nesting depth — switch to a stack for very deep inputs.
