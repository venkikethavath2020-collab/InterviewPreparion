# Check Anagram

## Difficulty
Easy

## Category
Strings / Hash Map

## Problem Statement

Given two strings, determine whether they are anagrams — i.e. they contain the same characters with the same frequencies.

## Example

```text
Input:  "listen", "silent"  → true
Input:  "hello",  "world"   → false
```

---

## Approach 1 — Sort and Compare

### Explanation

If two strings are anagrams, their sorted character arrays are identical. Easy to write; sorting dominates the cost.

### Time Complexity
O(n log n)

### Space Complexity
O(n)

### Solution

```js
const isAnagram = (a, b) => {
  if (a.length !== b.length) return false;
  const norm = (s) => s.split("").sort().join("");
  return norm(a) === norm(b);
};
```

---

## Approach 2 — Frequency Map (Optimized)

### Explanation

Count characters from `a` (increment) and `b` (decrement) in a single map. If any count is non-zero at the end, they are not anagrams. Linear time.

### Time Complexity
O(n)

### Space Complexity
O(k) — distinct characters.

### Solution

```js
const isAnagram = (a, b) => {
  if (a.length !== b.length) return false;
  const freq = {};
  for (const ch of a) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of b) {
    if (!freq[ch]) return false;
    freq[ch]--;
  }
  return true;
};
```

---

## Common Interview Follow-up Questions

1. Case-insensitive / ignore spaces? Normalize first: `s.toLowerCase().replace(/\s/g, "")`.
2. Group a list of words into anagram buckets — see [group-anagrams](../object-questions/group-anagrams.md).
3. Why is the length check a useful early exit?
4. Unicode anagrams — `for...of` over code points.

## Edge Cases

* Different lengths → immediately `false`
* Empty strings → `true` (both empty)
* Case sensitivity and whitespace
* Unicode / accented characters

## Key Takeaways

* The length check is a cheap early exit.
* Frequency-map increment/decrement is O(n) — beats the O(n log n) sort approach.
