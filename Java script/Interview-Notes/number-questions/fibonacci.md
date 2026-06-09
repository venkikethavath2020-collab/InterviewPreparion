# Fibonacci

## Difficulty
Easy / Medium

## Category
Numbers / Recursion / Dynamic Programming

## Problem Statement

Return the n-th Fibonacci number (or the sequence), where `F(0)=0`, `F(1)=1`, and `F(n) = F(n-1) + F(n-2)`.

## Example

```text
n = 7 → sequence: 0, 1, 1, 2, 3, 5, 8, 13
F(7) = 13
```

---

## Approach 1 — Naive Recursion (Avoid)

### Explanation

Direct recurrence. **Exponential** time — recomputes the same subproblems. Good to state, then immediately improve.

### Time Complexity
O(2ⁿ)

### Space Complexity
O(n) — stack.

### Solution

```js
const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
```

---

## Approach 2 — Memoization (Top-Down DP)

### Explanation

Cache results so each `n` is computed once. Linear time.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const fib = (n, memo = {}) => {
  if (n < 2) return n;
  if (memo[n] !== undefined) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
};
```

---

## Approach 3 — Iterative, O(1) Space (Optimal)

### Explanation

Keep only the last two values. Constant space, linear time — the interview-optimal answer.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const fib = (n) => {
  if (n < 2) return n;
  let prev = 0,
    curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
};
```

---

## Common Interview Follow-up Questions

1. Why is naive recursion exponential? (Overlapping subproblems form a binary tree.)
2. Return the full sequence up to n.
3. Compute F(n) in O(log n) with matrix exponentiation.
4. Use `BigInt` for very large n (overflow past `2^53`).

## Edge Cases

* `n = 0` → `0`, `n = 1` → `1`
* Negative n (undefined / clarify)
* Large n → precision loss; use `BigInt`

## Key Takeaways

* Naive recursion is O(2ⁿ) — never the final answer.
* Iterative two-variable rolling sum is O(n) time, O(1) space.
