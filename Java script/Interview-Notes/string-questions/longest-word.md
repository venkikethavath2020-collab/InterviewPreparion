# Longest Word in a Sentence

## Difficulty
Easy

## Category
Strings

## Problem Statement

Given a sentence, return the longest word. If multiple words share the maximum length, return the first one encountered.

## Example

```text
Input:  "Vue js is very powerful framework"
Output: "powerful"
```

---

## Approach 1 — Single Pass

### Explanation

Split into words and track the longest seen so far. One linear pass, O(1) extra besides the split array.

### Time Complexity
O(n)

### Space Complexity
O(n) — split array.

### Solution

```js
const longestWord = (str = "") => {
  let longest = "";
  for (const word of str.split(" ")) {
    if (word.length > longest.length) longest = word;
  }
  return longest;
};
```

---

## Approach 2 — Reduce (Declarative)

### Solution

```js
const longestWord = (str = "") =>
  str.split(" ").reduce((a, b) => (b.length > a.length ? b : a), "");
```

---

## Common Interview Follow-up Questions

1. Return all words tied for the longest length.
2. Return just the length, not the word.
3. Ignore punctuation attached to words (`"framework."`).

## Edge Cases

* Empty string → `""`
* Single word → that word
* Ties — first wins with `>` (use `>=` for last)
* Punctuation counts toward length unless stripped

## Key Takeaways

* `>` keeps the first of equal-length words; `>=` keeps the last.
* `reduce` is the cleanest functional form.
