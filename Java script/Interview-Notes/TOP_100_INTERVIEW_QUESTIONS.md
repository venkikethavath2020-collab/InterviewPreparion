# ⭐ Top 100 JavaScript Interview Questions

> Rapid-fire revision checklist. Each links to a detailed answer. Use this the night before an interview — read the question, answer out loud, click through if you stumble.

[← Back to Master Guide](./MASTER_INTERVIEW_GUIDE.md)

---

## 🔤 Coding — Strings (1–14)

1. Reverse a string three ways → [link](./string-questions/reverse-string.md)
2. Why can't you reverse a JS string in place? → [link](./string-questions/reverse-string.md)
3. Reverse each word in a sentence → [link](./string-questions/reverse-each-word.md)
4. Capitalize the first letter of each word → [link](./string-questions/capitalize-each-word.md)
5. Check if a string is a palindrome (two pointers) → [link](./string-questions/palindrome-string.md)
6. Palindrome ignoring case & punctuation → [link](./string-questions/palindrome-string.md)
7. First non-repeating character → [link](./string-questions/first-non-repeating-char.md)
8. Count vowels in a string → [link](./string-questions/count-vowels.md)
9. Check if two strings are anagrams → [link](./string-questions/check-anagram.md)
10. Run-length string compression → [link](./string-questions/string-compression.md)
11. Find the longest word → [link](./string-questions/longest-word.md)
12. Remove duplicate characters → [link](./string-questions/remove-duplicate-characters.md)
13. Character frequency map → [link](./object-questions/character-frequency.md)
14. Reverse a string with emoji safely (`[...str]`) → [link](./string-questions/reverse-string.md)

## 🔢 Coding — Arrays (15–32)

15. Reverse an array in place (two pointers) → [link](./array-questions/reverse-array.md)
16. Does `Array.reverse()` mutate? → [link](./array-questions/reverse-array.md)
17. Remove duplicates from an array → [link](./array-questions/remove-duplicates.md)
18. Remove duplicates from a sorted array in place → [link](./array-questions/remove-duplicates.md)
19. Move all zeros to the end → [link](./array-questions/move-zeros-to-end.md)
20. Rotate an array right by k → [link](./array-questions/rotate-array.md)
21. Why use `k % n` when rotating? → [link](./array-questions/rotate-array.md)
22. Find the missing number (1..n) → [link](./array-questions/find-missing-number.md)
23. Find missing number with XOR (overflow-safe) → [link](./array-questions/find-missing-number.md)
24. Find the maximum element (seed correctly) → [link](./array-questions/max-element.md)
25. Why `Math.max(...arr)` fails for huge arrays → [link](./array-questions/max-element.md)
26. Find the second largest (distinct) → [link](./array-questions/second-largest.md)
27. Find the k-th largest element → [link](./array-questions/second-largest.md)
28. Highest frequency element (mode) → [link](./array-questions/highest-frequency-element.md)
29. Two Sum (hash map) → [link](./array-questions/two-sum.md)
30. Find all pairs with a given sum → [link](./array-questions/find-pairs-with-sum.md)
31. Intersection of two arrays → [link](./array-questions/array-intersection.md)
32. Find duplicate elements → [link](./array-questions/find-duplicates.md)

## 🧩 Coding — Objects & Recursion (33–42)

33. Flatten a nested array (infinite depth) → [link](./object-questions/flatten-nested-array.md)
34. Flatten an array to a given depth → [link](./object-questions/flatten-nested-array.md)
35. Flatten an array iteratively (no recursion) → [link](./object-questions/flatten-nested-array.md)
36. Flatten a nested object (dot keys) → [link](./object-questions/flatten-nested-object.md)
37. Unflatten an object → [link](./object-questions/flatten-nested-object.md)
38. Group anagrams → [link](./object-questions/group-anagrams.md)
39. Count occurrences by id → [link](./object-questions/count-by-id.md)
40. Group objects by a property (generic `groupBy`) → [link](./object-questions/group-by-property.md)
41. Sum of object values → [link](./object-questions/sum-object-values.md)
42. Remove duplicate objects by key → [link](./object-questions/remove-duplicate-objects.md)

## 🔢 Coding — Numbers & Sorting (43–50)

43. Palindrome number without strings → [link](./number-questions/palindrome-number.md)
44. Reverse an integer → [link](./number-questions/palindrome-number.md)
45. Factorial (iterative & BigInt) → [link](./number-questions/factorial.md)
46. Fibonacci — naive vs memoized vs O(1) → [link](./number-questions/fibonacci.md)
47. Why is naive Fibonacci O(2ⁿ)? → [link](./number-questions/fibonacci.md)
48. Implement Quick Sort → [link](./sorting-recursion/quick-sort.md)
49. Quick sort vs merge sort trade-offs → [link](./sorting-recursion/quick-sort.md)
50. Transpose / rotate a matrix → [link](./sorting-recursion/matrix-operations.md)

## ⚡ Functions & Performance (51–62)

51. Implement debounce → [link](./functions-performance/debounce.md)
52. Implement throttle → [link](./functions-performance/throttle.md)
53. Debounce vs throttle — when to use each → [link](./functions-performance/throttle.md)
54. Implement memoize → [link](./functions-performance/memoize.md)
55. The falsy-cache bug in memoize → [link](./functions-performance/memoize.md)
56. Polyfill `Function.prototype.call` → [link](./functions-performance/polyfills.md)
57. Polyfill `apply` → [link](./functions-performance/polyfills.md)
58. Polyfill `bind` (with partial application) → [link](./functions-performance/polyfills.md)
59. Polyfill `Array.prototype.map` → [link](./functions-performance/polyfills.md)
60. Polyfill `filter` (the push bug) → [link](./functions-performance/polyfills.md)
61. Polyfill `reduce` (initial-value handling) → [link](./functions-performance/polyfills.md)
62. Implement a generic curry → [link](./concepts/currying.md)

## 🧠 Concepts — Fundamentals (63–74)

63. `var` vs `let` vs `const` → [link](./concepts/variables-and-datatypes.md)
64. Primitive vs reference types → [link](./concepts/variables-and-datatypes.md)
65. Why `typeof null === "object"` → [link](./concepts/variables-and-datatypes.md)
66. `null` vs `undefined` → [link](./concepts/variables-and-datatypes.md)
67. `==` vs `===` → [link](./concepts/type-coercion.md)
68. List all falsy values → [link](./concepts/type-coercion.md)
69. Output of `"5" + 3`, `"5" - 3`, `[] + {}` → [link](./concepts/type-coercion.md)
70. What does strict mode change? → [link](./concepts/strict-mode.md)
71. Pre-increment vs post-increment → [link](./concepts/type-coercion.md)
72. String → Number conversion methods → [link](./concepts/type-coercion.md)
73. `Number.isNaN` vs global `isNaN` → [link](./concepts/type-coercion.md)
74. `Object.freeze` vs `Object.seal` → [link](./concepts/objects.md)

## 🧠 Concepts — Scope & Execution (75–82)

75. What is hoisting? → [link](./concepts/hoisting.md)
76. What is the Temporal Dead Zone? → [link](./concepts/hoisting.md)
77. Function declaration vs expression hoisting → [link](./concepts/functions.md)
78. Lexical vs dynamic scope → [link](./concepts/scope.md)
79. Why does `var` leak out of a `for` loop? → [link](./concepts/scope.md)
80. Two phases of an execution context → [link](./concepts/execution-context.md)
81. What is a closure? → [link](./concepts/closures.md)
82. The `var` + `setTimeout` loop trap → [link](./concepts/closures.md)

## 🧠 Concepts — Functions & `this` (83–90)

83. Rules that determine `this` → [link](./concepts/this-keyword.md)
84. `this` in arrow vs regular functions → [link](./concepts/this-keyword.md)
85. `this` in strict vs non-strict mode → [link](./concepts/this-keyword.md)
86. Difference between call, apply, bind → [link](./concepts/call-apply-bind.md)
87. How does bind enable partial application? → [link](./concepts/call-apply-bind.md)
88. First-class vs higher-order functions → [link](./concepts/functions.md)
89. What is a pure function? → [link](./concepts/functions.md)
90. Rest vs spread operators → [link](./concepts/rest-and-spread.md)

## 🧠 Concepts — Objects, Async & Browser (91–100)

91. Explain the prototype chain → [link](./concepts/prototype.md)
92. `__proto__` vs `prototype` → [link](./concepts/prototype.md)
93. How do ES6 classes relate to prototypes? → [link](./concepts/classes.md)
94. What is callback hell and how to avoid it? → [link](./concepts/callbacks.md)
95. Promise states & combinators (`all`/`allSettled`/`race`/`any`) → [link](./concepts/promises.md)
96. async/await — sequential vs parallel → [link](./concepts/async-await.md)
97. Explain the event loop; micro vs macro tasks → [link](./concepts/event-loop.md)
98. Predict `setTimeout` + `Promise` output → [link](./concepts/event-loop.md)
99. localStorage vs sessionStorage vs cookies → [link](./concepts/web-storage.md)
100. Common memory leak causes & how GC works → [link](./concepts/memory-leaks.md)

---

## ✅ Self-Assessment

- Can you answer **80/100** out loud without clicking through? You're interview-ready.
- Stumbled on the coding ones? → drill [Easy](./EASY_PROBLEMS.md) → [Medium](./MEDIUM_PROBLEMS.md) → [Hard](./HARD_PROBLEMS.md).
- Stumbled on theory? → revise [JavaScript Concepts](./JAVASCRIPT_CONCEPTS.md).

---

**Back to:** [Master Guide](./MASTER_INTERVIEW_GUIDE.md)
