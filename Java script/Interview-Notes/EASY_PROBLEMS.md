# 🟢 Easy Problems

> Fundamentals and warm-ups. Master these cold — they appear in nearly every screening round and form the building blocks of harder problems.

[← Back to Master Guide](./MASTER_INTERVIEW_GUIDE.md)

## Table of Contents
- [Strings](#strings)
- [Arrays](#arrays)
- [Objects](#objects)
- [Numbers](#numbers)

---

## Strings

| Problem | Key Idea | Complexity |
|---|---|---|
| [Reverse a String](./string-questions/reverse-string.md) | loop / `split.reverse.join` / two-pointer | O(n) |
| [Reverse Each Word](./string-questions/reverse-each-word.md) | split → reverse each → join | O(n) |
| [Capitalize Each Word](./string-questions/capitalize-each-word.md) | flag on space / regex `\b\w` | O(n) |
| [Check Palindrome](./string-questions/palindrome-string.md) | two pointers, O(1) space | O(n) |
| [First Non-Repeating Char](./string-questions/first-non-repeating-char.md) | frequency map, two passes | O(n) |
| [Count Vowels](./string-questions/count-vowels.md) | Set lookup / regex | O(n) |
| [Check Anagram](./string-questions/check-anagram.md) | frequency increment/decrement | O(n) |
| [Longest Word](./string-questions/longest-word.md) | single pass / reduce | O(n) |
| [Remove Duplicate Chars](./string-questions/remove-duplicate-characters.md) | `[...new Set(str)]` | O(n) |

## Arrays

| Problem | Key Idea | Complexity |
|---|---|---|
| [Reverse an Array](./array-questions/reverse-array.md) | two-pointer swap, O(1) space | O(n) |
| [Remove Duplicates](./array-questions/remove-duplicates.md) | `Set` / two-pointer (sorted) | O(n) |
| [Move Zeros to End](./array-questions/move-zeros-to-end.md) | write-pointer, in-place | O(n) |
| [Find Missing Number](./array-questions/find-missing-number.md) | Gauss sum / XOR | O(n) |
| [Maximum Element](./array-questions/max-element.md) | seed with `arr[0]`, not 0 | O(n) |
| [Second Largest](./array-questions/second-largest.md) | track two, single pass | O(n) |
| [Highest Frequency](./array-questions/highest-frequency-element.md) | frequency map + max | O(n) |
| [Two Sum](./array-questions/two-sum.md) | hash map of complements | O(n) |
| [Find Pairs With Sum](./array-questions/find-pairs-with-sum.md) | hash set / two pointers | O(n) |
| [Array Intersection](./array-questions/array-intersection.md) | Set membership | O(n+m) |
| [Find Duplicates](./array-questions/find-duplicates.md) | seen set | O(n) |

## Objects

| Problem | Key Idea | Complexity |
|---|---|---|
| [Count by ID](./object-questions/count-by-id.md) | accumulator object | O(n) |
| [Group by Property](./object-questions/group-by-property.md) | generic `groupBy` | O(n) |
| [Sum of Object Values](./object-questions/sum-object-values.md) | `Object.values` + reduce | O(n) |
| [Remove Duplicate Objects](./object-questions/remove-duplicate-objects.md) | Set on key | O(n) |
| [Character Frequency](./object-questions/character-frequency.md) | frequency map | O(n) |

## Numbers

| Problem | Key Idea | Complexity |
|---|---|---|
| [Palindrome Number](./number-questions/palindrome-number.md) | math reversal, no string | O(d) |
| [Factorial](./number-questions/factorial.md) | iterative / BigInt | O(n) |
| [Fibonacci](./number-questions/fibonacci.md) | iterative O(1) space | O(n) |

---

**Next up:** [🟡 Medium Problems →](./MEDIUM_PROBLEMS.md)
