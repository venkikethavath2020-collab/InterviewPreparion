# Character Frequency

## Difficulty
Easy

## Category
Strings / Hash Map

## Problem Statement

Given a string, return an object mapping each character to how many times it appears.

## Example

```text
Input:  "aabccc"
Output: { a: 2, b: 1, c: 3 }
```

---

## Approach 1 — Frequency Object

### Explanation

Iterate once, incrementing a counter per character.

### Time Complexity
O(n)

### Space Complexity
O(k) — distinct characters.

### Solution

```js
const charFrequency = (str = "") => {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
};
```

---

## Approach 2 — Reduce

### Solution

```js
const charFrequency = (str = "") =>
  [...str].reduce((acc, ch) => {
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});
```

---

## Common Interview Follow-up Questions

1. Return the most frequent character.
2. Count words instead of characters.
3. Build this as the basis for anagram checks — see [check-anagram](../string-questions/check-anagram.md).

## Edge Cases

* Empty string → `{}`
* Spaces and punctuation count as characters
* Case sensitivity (`"A"` vs `"a"`)
* Unicode — `for...of` / spread iterate code points correctly

## Key Takeaways

* This frequency-map pattern underpins anagrams, first-non-repeating, and mode problems.
* `for...of`/spread is Unicode-safe.
