# Count Vowels

## Difficulty
Easy

## Category
Strings

## Problem Statement

Given a string, count the number of vowels (`a, e, i, o, u`, case-insensitive). A common variant also returns the per-vowel breakdown.

## Example

```text
Input:  "Interview Preparation"
Output: 9

Input:  "Hai hello how are you"
Output: { count: 9, breakdown: { a: 2, i: 1, e: 2, o: 3, u: 1 } }
```

---

## Approach 1 — Set Lookup

### Explanation

Store vowels in a `Set` for O(1) membership checks. Walk the lowercased string and increment on each hit.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const countVowels = (str = "") => {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;
  for (const ch of str.toLowerCase()) {
    if (vowels.has(ch)) count++;
  }
  return count;
};
```

---

## Approach 2 — With Per-Vowel Breakdown

### Explanation

Track each vowel’s individual count in an object alongside the total. Useful when the interviewer asks for frequency, not just a total.

### Solution

```js
const countVowels = (str = "") => {
  const vowels = ["a", "e", "i", "o", "u"];
  const breakdown = {};
  let total = 0;
  for (const ch of str.toLowerCase()) {
    if (vowels.includes(ch)) {
      breakdown[ch] = (breakdown[ch] || 0) + 1;
      total++;
    }
  }
  return { total, breakdown };
};
```

---

## Approach 3 — Regex

### Explanation

Match all vowels and read the match-array length.

### Solution

```js
const countVowels = (str = "") =>
  (str.match(/[aeiou]/gi) || []).length;
```

---

## Common Interview Follow-up Questions

1. Count consonants instead.
2. Return which vowel is most frequent.
3. Should `y` count as a vowel? (Clarify the spec.)

## Edge Cases

* Empty string → `0`
* No vowels → `0`
* Uppercase vowels — normalize with `toLowerCase()`
* `match` returns `null` when no match — guard with `|| []`

## Key Takeaways

* A `Set` gives O(1) vowel lookup and the cleanest intent.
* `str.match(/[aeiou]/gi)` is the shortest answer but can return `null`.
