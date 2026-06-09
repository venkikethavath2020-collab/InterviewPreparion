# Check Palindrome (String)

## Difficulty
Easy

## Category
Strings / Two Pointers

## Problem Statement

Given a string, check whether it reads the same forwards and backwards. Common variants ask you to ignore case and non-alphanumeric characters.

## Example

```text
Input:  "Madam"  (ignore case)  → true
Input:  "racecar"               → true
Input:  "hello"                 → false
Input:  "A man, a plan, a canal: Panama" (alphanumeric, ignore case) → true
```

---

## Approach 1 — Two Pointers

### Explanation

Place one pointer at the start and one at the end. Compare characters and move both inward. The first mismatch means it is not a palindrome. O(1) extra space.

### Time Complexity
O(n)

### Space Complexity
O(1)

### Solution

```js
const isPalindromeString = (str = "") => {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
};
```

---

## Approach 2 — Reverse and Compare

### Explanation

Reverse the string and compare with the original. Simpler to write but uses O(n) extra space.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const isPalindrome = (str = "") =>
  str === str.split("").reverse().join("");
```

---

## Approach 3 — Normalize then Two Pointers (Interview-Optimized)

### Explanation

Real interviews usually want case-insensitive, alphanumeric-only comparison. Strip non-alphanumerics and lowercase first, then two-pointer.

### Solution

```js
const isPalindromeClean = (str = "") => {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
};
```

---

## Common Interview Follow-up Questions

1. Ignore case and punctuation — see Approach 3.
2. Check if a string can become a palindrome by removing **at most one** character. (Valid Palindrome II — two-pointer with a single skip.)
3. Find the longest palindromic substring. (Expand-around-center, O(n²).)
4. Palindrome for a number without converting to string — see [palindrome-number](../number-questions/palindrome-number.md).

## Edge Cases

* Empty string → `true` (vacuously a palindrome)
* Single character → `true`
* Mixed case → decide whether to normalize
* Strings with spaces / punctuation

## Key Takeaways

* Two pointers give O(1) space — the optimal answer.
* Always clarify whether case and non-alphanumeric characters matter.
