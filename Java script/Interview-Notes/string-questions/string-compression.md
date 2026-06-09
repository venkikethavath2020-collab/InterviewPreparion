# String Compression (Run-Length Encoding)

## Difficulty
Easy / Medium

## Category
Strings / Two Pointers

## Problem Statement

Compress a string by replacing runs of repeated characters with the character followed by its count, e.g. `"aaabbccccd"` → `"a3b2c4d1"`. A common variant ("LeetCode 443") returns the original string if the compressed version is not shorter.

## Example

```text
Input:  "aaabbccccdaa"
Output: "a3b2c4d1a2"
```

---

## Approach 1 — Linear Scan with Counter

### Explanation

Walk the string. Compare each character with the next; if they match, increment the run counter; otherwise flush `char + count` to the result and reset the counter.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const compressString = (str = "") => {
  if (str.length === 0) return "";
  let result = "";
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + count;
      count = 1;
    }
  }
  return result;
};
```

---

## Approach 2 — Return Original if Not Shorter (Interview Variant)

### Explanation

Build the compressed form, then only use it when it actually saves space (e.g. `"abc"` → `"a1b1c1"` is longer, so return `"abc"`).

### Solution

```js
const compress = (str = "") => {
  let result = "";
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) count++;
    else {
      result += str[i] + count;
      count = 1;
    }
  }
  return result.length < str.length ? result : str;
};
```

---

## Common Interview Follow-up Questions

1. Compress **in place** on a character array returning the new length (LeetCode 443 hard variant).
2. Omit the count when it is 1 (`"a"` instead of `"a1"`).
3. Decompress the encoded string back.

## Edge Cases

* Empty string → `""`
* No repeats (`"abc"`) → compressed is longer; decide whether to return original
* Single character → `"a1"`
* Counts ≥ 10 (multi-digit) — concatenation handles this naturally

## Key Takeaways

* Comparing `str[i]` with `str[i+1]` avoids a separate look-back.
* Always clarify the "return original if longer" rule — it is the crux of the real problem.
