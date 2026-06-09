# Reverse Each Word in a Sentence

## Difficulty
Easy

## Category
Strings

## Problem Statement

Given a sentence, reverse **each word individually** while keeping the original word order and spacing.

## Example

```text
Input:  "hello world from js"
Output: "olleh dlrow morf sj"
```

---

## Approach 1 — Split, Map, Reverse, Join

### Explanation

Split the sentence on spaces into words. Reverse each word (manually or with a built-in), then join back with spaces. Word order is preserved because we only reverse *within* each word.

### Time Complexity
O(n) — every character is touched once.

### Space Complexity
O(n)

### Solution

```js
const reverseEachWord = (str = "") => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => {
      let reversed = "";
      for (let i = word.length - 1; i >= 0; i--) reversed += word[i];
      return reversed;
    })
    .join(" ");
};
```

---

## Approach 2 — Idiomatic One-liner

### Explanation

Use built-ins for each step. Concise and interview-friendly.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const reverseEachWord = (str = "") =>
  str
    .split(" ")
    .map((w) => w.split("").reverse().join(""))
    .join(" ");
```

---

## Common Interview Follow-up Questions

1. How do you preserve multiple consecutive spaces? (`split(" ")` keeps empty strings between double spaces, so spacing is preserved.)
2. Reverse the *order* of words instead of each word? (`str.split(" ").reverse().join(" ")`.)
3. Do it without `split`/`map`/`join` — build words manually while scanning.

## Edge Cases

* Empty string → `""`
* Single word → that word reversed
* Leading / trailing spaces — preserved with `split(" ")`
* Multiple spaces between words

## Key Takeaways

* Reversing each word ≠ reversing the whole sentence.
* `split(" ")` preserves spacing; `split(/\s+/)` collapses it — choose based on requirements.
