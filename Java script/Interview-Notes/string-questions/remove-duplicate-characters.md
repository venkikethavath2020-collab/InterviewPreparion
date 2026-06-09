# Remove Duplicate Characters

## Difficulty
Easy

## Category
Strings / Set

## Problem Statement

Given a string, return a new string with duplicate characters removed, keeping the first occurrence of each character.

## Example

```text
Input:  "programming"
Output: "progamin"
```

---

## Approach 1 — Set (Insertion Order)

### Explanation

A `Set` stores unique values and preserves insertion order. Build it from the string and join back.

### Time Complexity
O(n)

### Space Complexity
O(k) — distinct characters.

### Solution

```js
const removeDuplicateChars = (str = "") => [...new Set(str)].join("");
```

---

## Approach 2 — Manual Seen Object

### Explanation

Track seen characters in an object; append only the first occurrence. Equivalent without `Set`.

### Solution

```js
const removeDuplicateChars = (str = "") => {
  const seen = {};
  let result = "";
  for (const ch of str) {
    if (!seen[ch]) {
      seen[ch] = true;
      result += ch;
    }
  }
  return result;
};
```

---

## Common Interview Follow-up Questions

1. Keep the **last** occurrence instead of the first.
2. Remove only characters that appear more than once (keep none of the duplicates).
3. Case-insensitive de-duplication.

## Edge Cases

* Empty string → `""`
* All unique → unchanged
* All identical (`"aaaa"`) → `"a"`
* Case differences (`"Aa"`)

## Key Takeaways

* `[...new Set(str)].join("")` is the idiomatic one-liner and preserves order.
