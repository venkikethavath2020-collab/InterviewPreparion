# Capitalize First Letter of Each Word

## Difficulty
Easy

## Category
Strings

## Problem Statement

Given a string, capitalize the first letter of each word and return the modified string.

## Example

```text
Input:  "i am preparing for interview"
Output: "I Am Preparing For Interview"
```

---

## Approach 1 — Single Pass with a Flag (No split)

### Explanation

Walk every character. Keep a `capitalizeNext` flag that is `true` at the start and after every space. When the flag is set and we hit a non-space, uppercase that char and clear the flag. This preserves multiple/leading/trailing spaces.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const capitalizeWords = (str = "") => {
  let result = "";
  let capitalizeNext = true;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      result += " ";
      capitalizeNext = true;
    } else if (capitalizeNext) {
      result += str[i].toUpperCase();
      capitalizeNext = false;
    } else {
      result += str[i];
    }
  }
  return result;
};
```

---

## Approach 2 — Split / Map / Join

### Explanation

Split into words, uppercase the first letter of each, slice the rest. Cleanest to read.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const capitalizeWords = (str = "") =>
  str
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
```

---

## Approach 3 — Regex (Most concise)

### Explanation

Match the first letter of each word with a word-boundary regex and uppercase it.

### Solution

```js
const capitalizeWords = (str = "") =>
  str.replace(/\b\w/g, (ch) => ch.toUpperCase());
```

---

## Common Interview Follow-up Questions

1. Title-case but keep small words ("of", "the") lowercase — how?
2. Handle multiple spaces without collapsing them. (Approach 1 and the `split(" ")` version preserve them.)
3. Capitalize only the first letter of the whole sentence?

## Edge Cases

* Empty string → `""`
* Leading/trailing spaces
* Multiple consecutive spaces
* Already-capitalized input

## Key Takeaways

* The flag-based single pass is the most control-friendly and preserves whitespace exactly.
* Regex `\b\w` is the shortest production-ready solution.
