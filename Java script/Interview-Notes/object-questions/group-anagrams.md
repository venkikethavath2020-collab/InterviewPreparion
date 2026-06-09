# Group Anagrams

## Difficulty
Medium

## Category
Strings / Hash Map

## Problem Statement

Given an array of words, group them so that words that are anagrams of each other end up in the same group.

## Example

```text
Input:  ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

---

## Approach 1 — Sorted-String Key

### Explanation

Anagrams share the same sorted character sequence. Use that sorted string as a hash-map key and bucket the words.

### Time Complexity
O(m · k log k) — m words, k average length.

### Space Complexity
O(m · k)

### Solution

```js
const groupAnagrams = (words = []) => {
  const map = {};
  for (const word of words) {
    const key = word.split("").sort().join("");
    (map[key] ||= []).push(word);
  }
  return Object.values(map);
};
```

---

## Approach 2 — Character-Count Key (Optimized)

### Explanation

Instead of sorting (O(k log k)), build a frequency signature in O(k). For lowercase a–z, a 26-slot count array stringified is a perfect key.

### Time Complexity
O(m · k)

### Space Complexity
O(m · k)

### Solution

```js
const groupAnagrams = (words = []) => {
  const map = new Map();
  for (const word of words) {
    const count = new Array(26).fill(0);
    for (const ch of word) count[ch.charCodeAt(0) - 97]++;
    const key = count.join(",");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return [...map.values()];
};
```

---

## Common Interview Follow-up Questions

1. Why is the count-key faster than the sort-key? (O(k) vs O(k log k).)
2. Handle Unicode / mixed case.
3. Return only groups with more than one member.

## Edge Cases

* Empty input → `[]`
* All unique (no anagrams) → each word in its own group
* Single word
* Case sensitivity

## Key Takeaways

* The sorted-string key is the easiest to explain; the count-array key is asymptotically faster.
* Related: [check-anagram](../string-questions/check-anagram.md).
