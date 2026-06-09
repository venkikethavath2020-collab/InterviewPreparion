# Palindrome Number

## Difficulty
Easy

## Category
Numbers / Math

## Problem Statement

Determine whether an integer reads the same forwards and backwards — **without** converting it to a string.

## Example

```text
Input:  121  → true
Input:  -121 → false  (the minus sign breaks symmetry)
Input:  10   → false
```

---

## Approach 1 — Reverse Digits Mathematically

### Explanation

Rebuild the number in reverse using modulo and integer division, then compare to the original. Negatives are immediately `false`.

### Time Complexity
O(d) — d digits.

### Space Complexity
O(1)

### Solution

```js
const isPalindromeNumber = (num) => {
  if (num < 0) return false;
  let original = num;
  let reversed = 0;
  while (num > 0) {
    reversed = reversed * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return original === reversed;
};
```

---

## Approach 2 — Reverse Half (Optimized)

### Explanation

Only reverse the second half of the number and compare with the first half. Avoids potential overflow on huge numbers (relevant in fixed-width languages; in JS it is a nice micro-optimization).

### Solution

```js
const isPalindrome = (x) => {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
};
```

---

## Reverse a Number (Related)

```text
Input: 53040 → 4035  (leading zeros drop)
```

```js
const reverseNumber = (num) => {
  const sign = Math.sign(num);
  let n = Math.abs(num);
  let rev = 0;
  while (n > 0) {
    rev = rev * 10 + (n % 10);
    n = Math.floor(n / 10);
  }
  return rev * sign;
};
```

---

## Common Interview Follow-up Questions

1. Solve it without converting to a string (the whole point of the math version).
2. Why are negative numbers never palindromes?
3. Handle numbers ending in `0` (only `0` itself is a palindrome).

## Edge Cases

* Negative numbers → `false`
* Single digit → always `true`
* Trailing zero (`10`, `100`) → `false` except `0`
* `0` → `true`

## Key Takeaways

* The modulo/division reversal is the canonical no-string solution.
* Reversing only half avoids overflow and halves the work.
