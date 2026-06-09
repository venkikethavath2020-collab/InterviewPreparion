# Reverse a String

## Difficulty
Easy

## Category
Strings

## Problem Statement

Given a string, reverse it and return the reversed string. Strings in JavaScript are **immutable**, so you must build a new string (or convert to an array) rather than mutating in place.

## Example

```text
Input:  "javascript"
Output: "tpircsavaj"

Input:  "hello"
Output: "olleh"
```

---

## Approach 1 — Manual Loop (No Built-ins)

### Explanation

Start an empty result string. Iterate from the **last** character to the first, appending each character. Demonstrates understanding of string immutability and indexing without relying on `Array.prototype.reverse`.

### Time Complexity
O(n)

### Space Complexity
O(n) — a new string of length n.

> Note: repeated `reversed += str[i]` can be O(n²) in naive engines because each concatenation may copy the string. Modern V8 optimizes this with rope/cons strings, but in an interview mention the array-join approach as the safer alternative.

### Solution

```js
const reverseString = (str = "") => {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
};
```

---

## Approach 2 — Built-in Chain (Idiomatic)

### Explanation

Convert the string to an array of characters, reverse the array, then join back. The most common one-liner in interviews — clean and readable.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const reverseString = (str = "") =>
  str.split("").reverse().join("");
```

---

## Approach 3 — Two Pointer on Char Array (In-place style)

### Explanation

If asked to reverse a **character array in place** (a classic LeetCode variant), swap from both ends toward the center. O(1) extra space.

### Solution

```js
const reverseChars = (chars) => {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
  return chars;
};
```

---

## Common Interview Follow-up Questions

1. Why can't you reverse a JavaScript string in place? (Strings are immutable primitives.)
2. How would you reverse a string containing emoji / surrogate pairs? (`split("")` breaks surrogate pairs — use `[...str]` or `Array.from(str)` which is iterator-aware.)
3. Reverse only the words, not the characters? (See [reverse-each-word](./reverse-each-word.md))
4. What is the time complexity of `+=` string concatenation in a loop?

## Edge Cases

* Empty string `""` → `""`
* Single character `"a"` → `"a"`
* Unicode / emoji (`"a😀b"`) — `split("")` mangles the emoji; use `[...str]`
* `null` / `undefined` — default parameter guards against `undefined`

## Key Takeaways

* Strings are immutable; reversing always allocates new memory.
* `split("").reverse().join("")` is the idiomatic answer; `[...str]` is the Unicode-safe variant.
* Two-pointer swap is the optimal answer when working on a character array.
