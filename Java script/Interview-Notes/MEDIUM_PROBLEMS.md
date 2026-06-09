# 🟡 Medium Problems

> The interview sweet spot. These test recursion, multi-step reasoning, the right data structure, and clean trade-off analysis — exactly what most coding rounds target for 3–8 YOE candidates.

[← Back to Master Guide](./MASTER_INTERVIEW_GUIDE.md)

## Table of Contents
- [Recursion & Nested Structures](#recursion--nested-structures)
- [Arrays](#arrays)
- [Sorting](#sorting)
- [Functions & Performance](#functions--performance)

---

## Recursion & Nested Structures

| Problem | Key Idea | Complexity |
|---|---|---|
| [Flatten Nested Array](./object-questions/flatten-nested-array.md) | recursion / iterative stack / `flat()` | O(n) |
| [Flatten Nested Object](./object-questions/flatten-nested-object.md) | recursion + path accumulator | O(n) |
| [Group Anagrams](./object-questions/group-anagrams.md) | sorted-key / char-count key | O(m·k) |

## Arrays

| Problem | Key Idea | Complexity |
|---|---|---|
| [Rotate Array by K](./array-questions/rotate-array.md) | reversal trick, in-place | O(n) |
| [Second Largest](./array-questions/second-largest.md) | distinct second, single pass | O(n) |
| [Find Pairs With Sum](./array-questions/find-pairs-with-sum.md) | unique pairs, set/two-pointer | O(n) |

## Sorting

| Problem | Key Idea | Complexity |
|---|---|---|
| [Quick Sort](./sorting-recursion/quick-sort.md) | divide & conquer, pivot partition | O(n log n) avg |
| [Matrix Operations](./sorting-recursion/matrix-operations.md) | map / transpose | O(m·n) |

## Numbers

| Problem | Key Idea | Complexity |
|---|---|---|
| [Fibonacci (DP)](./number-questions/fibonacci.md) | memoization / rolling sum | O(n) |

## Functions & Performance

| Topic | Key Idea |
|---|---|
| [Debounce](./functions-performance/debounce.md) | closure over timer; "wait until quiet" |
| [Throttle](./functions-performance/throttle.md) | closure over timestamp; "once per interval" |
| [Memoization](./functions-performance/memoize.md) | cache keyed by serialized args |
| [Currying](./concepts/currying.md) | accumulate args until arity met |

---

**Next up:** [🔴 Hard Problems →](./HARD_PROBLEMS.md)
