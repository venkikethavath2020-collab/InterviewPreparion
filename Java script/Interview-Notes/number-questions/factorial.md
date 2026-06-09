# Factorial

## Difficulty
Easy

## Category
Numbers / Recursion

## Problem Statement

Compute `n!` = `n × (n-1) × … × 1`. By definition `0! = 1`.

## Example

```text
Input:  5
Output: 120   (5 × 4 × 3 × 2 × 1)
```

---

## Approach 1 — Iterative

### Explanation

Multiply from 2 up to n. No recursion overhead, no stack risk.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const factorial = (n) => {
  if (n < 0) return undefined; // factorial undefined for negatives
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};
```

---

## Approach 2 — Recursive

### Explanation

`fact(n) = n × fact(n - 1)`, base case `fact(0) = 1`. Elegant but uses O(n) stack frames.

### Time Complexity
O(n)

### Space Complexity
O(n) — call stack.

### Solution

```js
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
```

---

## Approach 3 — BigInt for Large n

### Explanation

`Number` loses precision beyond `2^53`. For large factorials use `BigInt`.

### Solution

```js
const factorialBig = (n) => {
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result; // e.g. factorialBig(25)
};
```

---

## Common Interview Follow-up Questions

1. At what `n` does `Number` lose precision? (Around `n = 18`, `n!` exceeds `Number.MAX_SAFE_INTEGER`.)
2. Convert the recursive version to tail-recursive form.
3. Compute trailing zeros of `n!` without computing the factorial (count factors of 5).

## Edge Cases

* `0!` → `1`
* `1!` → `1`
* Negative input → undefined / error
* Large `n` → precision loss; use `BigInt`

## Key Takeaways

* Prefer iteration to avoid stack growth.
* Use `BigInt` once results exceed `2^53`.
