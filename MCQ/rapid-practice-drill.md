# Rapid Practice — Drill Sheet (Reference + Optimize Follow-ups)

> **This is a DRILL sheet, not an answer key.** Each problem shows the prompt first.
> Try it on paper or in an editor (autocomplete OFF) → *then* expand the answer.
> Reading the solution without trying first = the thing that's been failing you.
>
> 🟢 = baseline solution  ⚡ = the "now optimize it" version they ask next
> ⚠️ = the bug to avoid (from your own attempts)  🎯 = what to say out loud
>
> Runnable code: [rapid-practice-solutions.js](rapid-practice-solutions.js) (32/32 pass).

---

## STRINGS

---

### 1. Reverse a String
`"javascript"` → `"tpircsavaj"`

<details><summary>Answer</summary>

🟢 **One-liner (say this exists):**
```js
function reverseString(str) {
  return [...str].reverse().join('');   // spread handles emoji/surrogate pairs
}
```
⚡ **Manual (if they say "no built-ins"):**
```js
function reverseString(str) {
  let res = "";
  for (let i = str.length - 1; i >= 0; i--) res += str[i];
  return res;
}
```
🎯 *"Built-in is spread-reverse-join. Manually, I iterate from the last index backward and build a new string."*
</details>

---

### 2. Reverse Each Word (keep word order)
`"hello world from js"` → `"olleh dlrow morf sj"`

<details><summary>Answer</summary>

🟢
```js
function reverseEachWord(sentence) {
  return sentence
    .split(' ')
    .map(word => [...word].reverse().join(''))
    .join(' ');
}
```
⚠️ **Your bug:** `+= word + ' '` leaves a **trailing space**. `.join(' ')` only puts spaces *between* words.

🎯 *"Split into words, reverse each, join with spaces — join avoids a trailing space."*
</details>

---

### 3. Capitalize Each Word
`"i am preparing for interview"` → `"I Am Preparing For Interview"`

<details><summary>Answer</summary>

🟢
```js
function capitalizeWords(sentence) {
  if (!sentence) return "";
  return sentence
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
```
⚠️ Return `""` (not `undefined`) on empty input + use `.join(' ')` to avoid the trailing space.

🎯 *"Split, uppercase the first char of each word, keep the rest, join back."*
</details>

---

### 4. Palindrome (ignore case)
`"Madam"` → `true`

<details><summary>Answer</summary>

🟢
```js
function isPalindrome(str) {
  const lower = str.toLowerCase();
  return lower === [...lower].reverse().join('');
}
```
⚠️ **No `? true : false`** — `===` already returns a boolean.

⚡ **Two-pointer (no extra string):**
```js
function isPalindrome(str) {
  const s = str.toLowerCase();
  let i = 0, j = s.length - 1;
  while (i < j) if (s[i++] !== s[j--]) return false;
  return true;
}
```
🎯 *"Compare from both ends inward, or reverse and compare. Two-pointer avoids building a second string."*
</details>

---

### 5. First Non-Repeating Character
`"aabbcdddeff"` → `"c"`

<details><summary>Answer</summary>

🟢
```js
function firstNonRepeating(str) {
  const map = new Map();
  for (const ch of str) map.set(ch, (map.get(ch) || 0) + 1);
  for (const [ch, count] of map) if (count === 1) return ch;
  return "";
}
```
🎯 *"Count first, then scan again and return the first char with count 1. A Map keeps insertion order so 'first' is reliable."*
</details>

---

### 6. Count Vowels
`"Interview Preparation"` → `9`

<details><summary>Answer</summary>

🟢
```js
function countVowels(str) {
  const vowels = "aeiou";
  let count = 0;
  for (const ch of str) if (vowels.includes(ch.toLowerCase())) count++;
  return count;
}
```
🎯 *"Check each char against a vowel set, case-insensitive, increment."*
</details>

---

### 7. String Compression (RLE)
`"aaabbccccdaa"` → `"a3b2c4d1a2"`

<details><summary>Answer</summary>

🟢
```js
function compress(str) {
  if (!str) return "";
  let count = 1, result = "";
  for (let i = 1; i <= str.length; i++) {
    if (str[i] === str[i - 1]) count++;
    else { result += str[i - 1] + count; count = 1; }
  }
  return result;
}
```
⚠️ Loop to `i <= length` so the **last run flushes**. Easy to forget.

🎯 *"Count consecutive repeats; when the char changes, append char+count and reset."*
</details>

---

### 8. Longest Word in Sentence
`"Vue js is very powerful framework"` → `"framework"`

<details><summary>Answer</summary>

🟢
```js
function longestWord(sentence) {
  let longest = "";
  for (const w of sentence.split(' ')) if (w.length > longest.length) longest = w;
  return longest;
}
```
⚠️ No Map needed — a single running max is enough.

🎯 *"Split into words, keep whichever is longest."*
</details>

---

### 9. Remove Duplicate Characters
`"programming"` → `"progamin"`

<details><summary>Answer</summary>

🟢
```js
function uniqueChars(str) {
  const seen = new Set();
  let out = "";
  for (const ch of str) if (!seen.has(ch)) { seen.add(ch); out += ch; }
  return out;
}
```
⚡ `Set` is **O(n)**. Your `output.includes(ch)` version is **O(n²)** — rescans the string each char.

🎯 *"Track seen chars in a Set, append only the first occurrence."*
</details>

---

## ARRAYS

---

### 10. Reverse Array (non-mutating)
`[1,2,3,4,5]` → `[5,4,3,2,1]`

<details><summary>Answer</summary>

🟢
```js
function reverseArray(data) {
  const result = [];
  for (let i = data.length - 1; i >= 0; i--) result.push(data[i]);
  return result;
}
```
🎯 *"Walk from the end into a new array — original stays untouched."*
</details>

---

### 11. Move Zeros to End
`[0,1,0,3,12]` → `[1,3,12,0,0]`

<details><summary>Answer</summary>

🟢
```js
function moveZeros(data) {
  const result = [];
  let zeros = 0;
  for (const n of data) n !== 0 ? result.push(n) : zeros++;
  while (zeros-- > 0) result.push(0);
  return result;
}
```
🎯 *"Push non-zeros first, then append the counted zeros."*
</details>

---

### 12. Rotate Array Right by K 🔴
`[1,2,3,4,5], k=2` → `[4,5,1,2,3]`

<details><summary>Answer</summary>

⚠️ **Your version was WRONG** — loop started at `k+1` and mutated the array while reading its length.

🟢
```js
function rotateRight(data, k) {
  const n = data.length;
  if (n === 0) return data;
  k = k % n;                                  // normalize — k may exceed length
  return [...data.slice(n - k), ...data.slice(0, n - k)];
}
```
🎯 *"Normalize k modulo length, slice off the last k, prepend them."* O(n).
</details>

---

### 13. Find Missing Number (1..n)
`[1,2,4,5,6]` → `3`

<details><summary>Answer</summary>

🟢
```js
function missingNumber(data) {
  const n = data.length + 1;
  const expected = (n * (n + 1)) / 2;
  return expected - data.reduce((a, b) => a + b, 0);
}
```
🎯 *"Expected sum minus actual sum is the missing number."*
</details>

---

### 14. Second Largest Element ⚠️
`[10,5,20,8,20]` → `10`

<details><summary>Answer</summary>

⚠️ **Your bug:** init `first = 0, second = 0` breaks on negative numbers and when the real answer is `0`.

🟢
```js
function secondLargest(data) {
  let first = -Infinity, second = -Infinity;
  for (const n of data) {
    if (n > first) { second = first; first = n; }
    else if (n > second && n < first) { second = n; }
  }
  return second;
}
```
🎯 *"One pass, track largest and second-largest distinct. Init to -Infinity, never 0."*
</details>

---

### 15. Highest Frequency Element
`[1,3,1,3,2,1]` → `1`

<details><summary>Answer</summary>

🟢
```js
function highestFreq(arr) {
  const map = new Map();
  let max = 0, result;
  for (const x of arr) {
    const count = (map.get(x) || 0) + 1;
    map.set(x, count);
    if (count > max) { max = count; result = x; }
  }
  return result;
}
```
🎯 *"Frequency map, track the max as you go."*
</details>

---

### 16. Two Sum (return indices) 🔴
`[2,7,11,15], target=9` → `[0,1]`

<details><summary>Answer</summary>

⚠️ **Your version was WRONG** — only checked adjacent pairs (`arr[i]+arr[i+1]`). The pair can be **anywhere**. Fails `[3,2,4], 6`.

🟢 **Hash map, one pass — O(n):**
```js
function twoSum(arr, target) {
  const seen = new Map();           // value -> index
  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(arr[i], i);
  }
  return [];
}
```
🎯 *"For each number I check if its complement was already seen. Store value→index as I go."* The single most-asked array question — never brute-force the final answer.
</details>

---

### 17. Remove Duplicates
`[4,4,5,6,6,7]` → `[4,5,6,7]`

<details><summary>Answer</summary>

🟢
```js
function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(x => seen.has(x) ? false : seen.add(x));
}
```
🎯 *"Set tracks seen values; keep each only the first time."*
</details>

---

### 18. Find All Pairs With Given Sum
`[1,2,3,4,5], target=5` → `[[1,4],[2,3]]`

<details><summary>Answer</summary>

🟢 **Brute force O(n²):**
```js
function findAllPairs(arr, target) {
  const res = [];
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] + arr[j] === target) res.push([arr[i], arr[j]]);
  return res;
}
```
⚡ **Set of complements O(n)** — same trick as Two Sum.

🎯 *"Check complements in a Set, collect pairs that hit the target."*
</details>

---

### 19. Find Intersection of Two Arrays 🔴
`[1,2,2,3], [2,2,4]` → `[2,2]`

<details><summary>Answer</summary>

⚠️ **Your bug:** `arr2.includes(x)` ignores counts and over-matches duplicates (`[2,2,2] ∩ [2]` → wrongly `[2,2,2]`).

🟢 **Count one side, consume from the count:**
```js
function findIntersection(arr1, arr2) {
  const counts = new Map();
  for (const x of arr1) counts.set(x, (counts.get(x) || 0) + 1);
  const res = [];
  for (const x of arr2) {
    if (counts.get(x) > 0) { res.push(x); counts.set(x, counts.get(x) - 1); }
  }
  return res;
}
```
🎯 *"Intersection with multiplicity = min count per element. Build a frequency map, decrement as I match."* O(n+m).
</details>

---

## NESTED / RECURSION

---

### 20. Flatten Nested Array (infinite depth)
`[1,[2,[3,4],5]]` → `[1,2,3,4,5]`

<details><summary>Answer</summary>

🟢
```js
function flatten(arr) {
  const res = [];
  for (const x of arr) Array.isArray(x) ? res.push(...flatten(x)) : res.push(x);
  return res;
}
```
⚡ Built-in: `arr.flat(Infinity)`.

🎯 *"Recurse into arrays, push primitives, until everything is in one array."*
</details>

---

### 21. Flatten Array by Depth
`[1,[2,[3]],4], depth=1` → `[1,2,[3],4]`

<details><summary>Answer</summary>

🟢
```js
function flattenByDepth(arr, depth) {
  const res = [];
  for (const x of arr)
    (Array.isArray(x) && depth > 0)
      ? res.push(...flattenByDepth(x, depth - 1))
      : res.push(x);
  return res;
}
```
🎯 *"Same as full flatten but only recurse while depth > 0; each level subtracts 1."*
</details>

---

### 22. Flatten Nested Object
`{ a:{ b:1, c:{ d:2 }}}` → `{ "a.b":1, "a.c.d":2 }`

<details><summary>Answer</summary>

🟢
```js
function flattenObject(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key]))
      flattenObject(obj[key], newKey, result);
    else result[newKey] = obj[key];
  }
  return result;
}
```
⚠️ The `!== null && !Array.isArray` guard is what trips most people — `typeof null === "object"`.

🎯 *"Recurse plain objects, build dot-paths; store primitives at the dotted key."*
</details>

---

## OBJECTS / MAPS

---

### 23. Character Frequency
`"aabccc"` → `{ a:2, b:1, c:3 }`

<details><summary>Answer</summary>

🟢
```js
function freqChars(str) {
  const obj = {};
  for (const ch of str) obj[ch] = (obj[ch] || 0) + 1;
  return obj;
}
```
🎯 *"Increment each char's slot in an object."*
</details>

---

### 24. Group Anagrams ➕
`["eat","tea","tan","ate","nat","bat"]` → `[["eat","tea","ate"],["tan","nat"],["bat"]]`

<details><summary>Answer</summary>

🟢
```js
function groupAnagrams(words) {
  const map = new Map();
  for (const word of words) {
    const key = [...word].sort().join('');   // sorted letters = signature
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return [...map.values()];
}
```
🎯 *"Two words are anagrams iff their sorted letters match, so bucket by the sorted string."*
</details>

---

### 25. Count By ID
`[{id:1},{id:2},{id:1},{id:3},{id:2}]` → `{ 1:2, 2:2, 3:1 }`

<details><summary>Answer</summary>

🟢
```js
function countByID(arr) {
  const obj = {};
  for (const item of arr) obj[item.id] = (obj[item.id] || 0) + 1;
  return obj;
}
```
🎯 *"Use id as the key, increment per occurrence."*
</details>

---

### 26. Sum of Object Values
`{ a:10, b:20, c:30 }` → `60`

<details><summary>Answer</summary>

🟢
```js
function sumValues(obj) {
  return Object.values(obj).reduce((a, b) => a + b, 0);
}
```
🎯 *"Get the values, reduce into a sum."*
</details>

---

## NUMBERS

---

### 27. Palindrome Number
`121` → `true`

<details><summary>Answer</summary>

🟢
```js
function isPalindromeNumber(num) {
  if (num < 0) return false;
  let original = num, reversed = 0;
  while (num > 0) { reversed = reversed * 10 + (num % 10); num = Math.floor(num / 10); }
  return reversed === original;
}
```
🎯 *"Rebuild the number backwards with %10 and /10, compare to original. Negatives are never palindromes."*
</details>

---

### 28. Reverse a Number
`53040` → `4035`

<details><summary>Answer</summary>

🟢
```js
function reverseNumber(num) {
  let reversed = 0;
  while (num > 0) { reversed = reversed * 10 + (num % 10); num = Math.floor(num / 10); }
  return reversed;
}
```
🎯 *"Peel the last digit with %10, build the reversed number digit by digit."*
</details>

---

### 29. Factorial
`5` → `120`

<details><summary>Answer</summary>

🟢
```js
function factorial(num) {
  if (num === 0 || num === 1) return 1;
  return num * factorial(num - 1);
}
```
🎯 *"Multiply 1..n, base case 0 or 1."*
</details>

---

### 30. Fibonacci
`n=7` → `13`

<details><summary>Answer</summary>

⚠️ **Recursion is O(2ⁿ)** — they WILL ask you to optimize. `fib(50)` hangs.

🟢 **Iterative O(n), O(1) space:**
```js
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
```
🎯 *"Each value is the sum of the previous two. Two variables, single loop — no recomputation."*
</details>

---

## SORTING

---

### 31. Quick Sort
`[10,7,8,9,1,5]` → `[1,5,7,8,9,10]`

<details><summary>Answer</summary>

🟢
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++)
    (arr[i] < pivot ? left : right).push(arr[i]);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```
🎯 *"Partition around a pivot — smaller left, larger right — recurse each side, concat."* Avg O(n log n).
</details>

---

## ⚡ THE "NOW OPTIMIZE IT" FOLLOW-UPS THEY ALWAYS ASK

| Problem | Naive | Optimized | Why |
|---|---|---|---|
| Fibonacci | recursion O(2ⁿ) | iterative O(n) | naive recomputes; `fib(50)` hangs |
| Remove dup chars | `includes` O(n²) | `Set` O(n) | includes rescans each char |
| All pairs / Two Sum | nested loop O(n²) | Map of complements O(n) | one pass |
| Intersection | nested `includes` | frequency Map O(n+m) | also fixes duplicate over-match |
| Reverse string | manual loop | `[...s].reverse().join('')` | shows you know built-ins too |

## 🎯 THE 5 HABITS THAT COST YOU ANSWERS

1. **Trailing separators** — `join(' ')`, never append `word + ' '`.
2. **Init extremes to ±Infinity**, not `0` (breaks on negatives / zero).
3. **"Adjacent" ≠ "any pair"** — Two Sum / pair problems need a Map, not `i, i+1`.
4. **`includes` is O(n) and ignores counts** — reach for `Set` / `Map`.
5. **State complexity out loud** for every answer — that one sentence separates "hire" from "maybe."
