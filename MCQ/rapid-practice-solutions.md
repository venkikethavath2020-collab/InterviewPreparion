# Rapid Practice — Solutions Guide

> Companion doc for [rapid-practice-solutions.js](rapid-practice-solutions.js).
> Code lives in the `.js` file (validated: **32/32 cases pass** via `node`).
> This `.md` is the quick-read explanation of *what each function does and why*.
>
> **Tags:** `OK` = original answer was correct · `FIX` = original was buggy, corrected · `TUNE` = correct but the faster "now optimize it" version is shown.

---

## Strings

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `reverseString` | `"javascript"` → `"tpircsavaj"` | OK | Walk last char → first, build a new string. |
| `reverseSentence` | `"hello world"` → `"olleh dlrow"` | FIX | Split on spaces, reverse each word, join with **one** space (no trailing space). |
| `capitalizeSentence` | `"i am"` → `"I Am"` | FIX | Uppercase first letter of each word, join with one space. |
| `isPalindrome` | `"Madam"` → `true` | OK | Lowercase, reverse, compare to original. |
| `nonRepeatingChar` | `"aabbcdddeff"` → `"c"` | OK | Count all chars, return first with count 1 (Map keeps insertion order). |
| `countVowels` | `"Interview Preparation"` → `9` | OK | Count chars that are a/e/i/o/u, case-insensitive. |
| `compressString` | `"aaabbccccdaa"` → `"a3b2c4d1a2"` | OK | Count repeats in a row; on change write char+count, reset. |
| `longestWord` | `"... powerful framework"` → `"framework"` | TUNE | Split, keep the longest word. |
| `uniqueChars` | `"programming"` → `"progamin"` | TUNE | `Set` of seen chars; append only new ones (O(n) vs `includes` O(n²)). |

---

## Arrays

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `reverseArray` | `[1,2,3,4,5]` → `[5,4,3,2,1]` | OK | Loop from the back into a fresh array (non-mutating). |
| `moveZeros` | `[0,1,0,3,12]` → `[1,3,12,0,0]` | OK | Push non-zeros, count zeros, append that many zeros. |
| `rotateRight` | `[1,2,3,4,5], k=2` → `[4,5,1,2,3]` | **FIX** | Take last `k` to front. **Normalize `k % length` first.** Original loop logic was wrong. |
| `missingNumber` | `[1,2,4,5,6]` → `3` | OK | Expected sum `n*(n+1)/2` minus actual sum. |
| `secondLargest` | `[10,5,20,8,20]` → `10` | **FIX** | Track 1st & 2nd in one pass. **Init `-Infinity`, not `0`** (breaks on negatives/zero). |
| `highestFreq` | `[1,3,1,3,2,1]` → `1` | OK | Count each; remember the max-count value. |
| `twoSum` | `[2,7,11,15], 9` → `[0,1]` | **FIX** | For each `x`, look for `target − x` in a Map of seen values. Original only checked **adjacent** pairs. |
| `removeDuplicates` | `[4,4,5,6,6,7]` → `[4,5,6,7]` | OK | `Set`; keep each value the first time only. |
| `findAllPairs` | `[1,2,3,4,5], 5` → `[[1,4],[2,3]]` | OK | Check every `i,j` pair (j after i); keep those summing to target. |
| `findIntersection` | `[1,2,2,3],[2,2,4]` → `[2,2]` | **FIX** | Count first array, **consume counts** from second. Original `includes` over-matched duplicates. |

---

## Nested / Recursion

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `flattenArray` | `[1,[2,[3,4],5]]` → `[1,2,3,4,5]` | OK | If item is an array, flatten + spread it; else push it. |
| `flattenByDepth` | `[1,[2,[3]],4], 1` → `[1,2,[3],4]` | OK | Same, but only recurse while `depth > 0`; each level −1. |
| `flattenObject` | `{a:{b:1,c:{d:2}}}` → `{"a.b":1,"a.c.d":2}` | OK | Recurse plain objects, build dotted keys. Guard against `null` and arrays. |

---

## Objects / Maps

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `freqChars` | `"aabccc"` → `{a:2,b:1,c:3}` | OK | Add 1 to each char's slot in an object. |
| `groupAnagrams` | `["eat","tea","tan"...]` → grouped | **NEW** | Sort each word's letters → signature; group words with the same signature. |
| `countByID` | `[{id:1},{id:2},{id:1}...]` → `{1:2,2:2,3:1}` | OK | Use `id` as key, increment. |
| `sumOfObjectValues` | `{a:10,b:20,c:30}` → `60` | OK | `Object.values` then reduce to a sum. |

---

## Numbers

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `isPalindromeNumber` | `121` → `true` | OK | Rebuild number backwards with `%10` / `/10`, compare. |
| `reverseNumber` | `53040` → `4035` | OK | Peel last digit with `%10`, build reversed number. |
| `factorial` | `5` → `120` | OK | `n * factorial(n-1)`, base case 0/1. |
| `fibonacci` | `n=7` → `13` | TUNE | Two-variable loop, O(n) — instead of O(2ⁿ) recursion. |

---

## Sorting

| Function | In → Out | Tag | Idea |
|---|---|---|---|
| `quickSort` | `[10,7,8,9,1,5]` → `[1,5,7,8,9,10]` | OK | Pivot: smaller left, bigger right; recurse each side; `left + pivot + right`. |

---

## 5 things to always remember

1. Join words with `join(" ")` — don't append `word + " "` (leaves a trailing space).
2. For biggest/smallest trackers, init `-Infinity` / `Infinity`, never `0`.
3. Pair problems: the answer can be **anywhere** — use a Map, not just neighbors (Two Sum).
4. Need uniqueness or counting? Reach for `Set` / `Map`.
5. State the time complexity out loud (e.g. "this is O(n)").

---

## Run it

```bash
node MCQ/rapid-practice-solutions.js
```
Uncomment the self-check block at the bottom of the `.js` file to see outputs.
