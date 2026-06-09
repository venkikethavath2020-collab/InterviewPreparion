# First Non-Repeating Character

## Difficulty
Easy

## Category
Strings / Hash Map

## Problem Statement

Given a string, find the first character that appears exactly once. Return `null` (or `-1` for index variants) if none exists.

## Example

```text
Input:  "aabbcdddeff"
Output: "c"

Input:  "aabb"
Output: null
```

---

## Approach 1 — Frequency Map (Two Pass)

### Explanation

First pass builds a frequency map. Second pass scans the string in order and returns the first character whose count is 1. Two passes keep order correct while being O(n).

### Time Complexity
O(n)

### Space Complexity
O(k) — k distinct characters (O(1) for a fixed ASCII charset).

### Solution

```js
const firstNonRepeatingChar = (str = "") => {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  for (const ch of str) {
    if (freq[ch] === 1) return ch;
  }
  return null;
};
```

---

## Approach 2 — Map preserving insertion order

### Explanation

A `Map` preserves insertion order, so after counting you can iterate the map entries once and return the first key with value 1 — still two passes but tidier.

### Solution

```js
const firstNonRepeating = (str = "") => {
  const map = new Map();
  for (const ch of str) map.set(ch, (map.get(ch) || 0) + 1);
  for (const [ch, count] of map) {
    if (count === 1) return ch;
  }
  return null;
};
```

---

## Common Interview Follow-up Questions

1. Return the **index** instead of the character. (LeetCode 387.)
2. What if the stream is infinite (find first non-repeating in a stream)? Use a queue + count map.
3. Handle Unicode characters. (`for...of` iterates code points correctly.)

## Edge Cases

* Empty string → `null`
* All characters repeat → `null`
* Single character → that character
* Case sensitivity (`"A"` vs `"a"`)

## Key Takeaways

* Two passes over a frequency map is O(n) time, O(1) space for fixed charset.
* `for...of` is Unicode-safe; index-based loops can split surrogate pairs.
