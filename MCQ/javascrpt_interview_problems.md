# JS Coding Problems — Reference + Optimize Follow-ups

> **This is a DRILL sheet, not an answer key.** Each problem shows the prompt first.
> Try it on paper or in an editor (autocomplete OFF) → *then* expand the answer.
> Reading the solution without trying first = the thing that's been failing you.
>
> 🟢 = baseline solution  ⚡ = the "now optimize it" version they ask next
> ⚠️ = the follow-up question  🎯 = what to say out loud

---

## STRINGS

---

### 1. Reverse a String
`"javascript"` → `"tpircsavaj"`

<details><summary>Answer</summary>

🟢 **One-liner (say this exists):**
```js
function reverseString(str) {
  return str.split('').reverse().join('');
}
```

⚡ **Manual (if they say "no built-ins"):**
```js
function reverseString(str) {
  let res = "";
  for (let i = str.length - 1; i >= 0; i--) {
    res += str[i];
  }
  return res;
}
```
🎯 *"Built-in is split-reverse-join. Manually, I iterate from the last index backward and build a new string."*
</details>

---

### 2. Reverse Each Word (keep word order)
`"hello world from js"` → `"olleh dlrow morf sj"`

<details><summary>Answer</summary>

🟢 **Clean — note `.map().join(' ')` avoids the trailing-space bug:**
```js
function reverseEachWord(sentence) {
  return sentence
    .split(' ')
    .map(word => word.split('').reverse().join(''))
    .join(' ');
}
```
⚠️ **Your earlier bug:** building with `+= word + ' '` leaves a trailing space.
`.join(' ')` puts spaces *between* words only. Always prefer it.

🎯 *"Split into words, reverse each one, join back with spaces — join avoids a trailing space."*
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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```
⚠️ Return `""` (not `undefined`) on empty input — consistent return type.

🎯 *"Split, uppercase the first char of each word, keep the rest, join back."*
</details>

---

### 4. Palindrome (ignore case)
`"Madam"` → `true`

<details><summary>Answer</summary>

🟢 **Simple version:**
```js
function isPalindrome(str) {
  const lower = str.toLowerCase();
  return lower === lower.split('').reverse().join('');
}
```
⚠️ **No `? true : false`** — the `===` already returns a boolean.

⚡ **Two-pointer (more efficient, no extra string) + handles spaces/punctuation:**
```js
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++; right--;
  }
  return true;
}
```
🎯 *"Lowercase, then compare from both ends with two pointers. Strip non-alphanumerics if spaces and punctuation should be ignored."*
</details>

---

### 5. First Non-Repeating Character
`"aabbcdddeff"` → `"c"`

<details><summary>Answer</summary>

🟢 **Map for counts, second pass for first count === 1 (this is optimal):**
```js
function firstNonRepeating(str) {
  const map = new Map();
  for (const ch of str) {
    map.set(ch, (map.get(ch) || 0) + 1);
  }
  for (const [ch, count] of map) {
    if (count === 1) return ch;
  }
  return null;
}
```
⚠️ Map preserves **insertion order**, which is why the second pass finds the *first* unique char correctly. Mention that — it's why a plain object is riskier here.

🎯 *"Count frequencies in one pass, then scan again for the first char with count one. O(n)."*
</details>

---

### 6. Count Vowels
`"Interview Preparation"` → `9`

<details><summary>Answer</summary>

🟢
```js
function countVowels(str) {
  const vowels = new Set(['a','e','i','o','u']);
  let count = 0;
  for (const ch of str.toLowerCase()) {
    if (vowels.has(ch)) count++;
  }
  return count;
}
```
🎯 *"Lowercase each char, check against a vowel set, increment. Set lookup is O(1)."*
(A string `'aeiou'.includes(ch)` works too — Set is marginally cleaner for "is it in this group.")
</details>

---

### 7. Check Anagram — *you attempt first*
`"listen"`, `"silent"` → `true`

<details><summary>Answer</summary>

🟢 **Sort version (O(n log n)):**
```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const sort = s => [...s].sort().join('');
  return sort(a) === sort(b);
}
```

⚡ **Count version (O(n)) — the optimize follow-up:**
```js
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch] || 0) + 1;
  for (const ch of b) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}
```
⚠️ **"Sorting is O(n log n) — faster?"** → Count chars in one map, decrement with the
second string. If any goes missing/negative, not an anagram. That's O(n).

🎯 *"Length check first. Either sort both and compare, or count chars and cancel them out. Counting is O(n) vs sorting's O(n log n)."*
</details>

---

### 8. String Compression
`"aaabbccccdaa"` → `"a3b2c4d1a2"`

<details><summary>Answer</summary>

🟢 **Clean — loop `< length`, append last group explicitly (no fragile `undefined` trick):**
```js
function compressString(str) {
  if (!str) return "";
  let result = "", count = 1;
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      count++;
    } else {
      result += str[i - 1] + count;
      count = 1;
    }
  }
  result += str[str.length - 1] + count;  // last run
  return result;
}
```
⚠️ **Your earlier version** looped `<= length` and compared against `undefined` to flush
the last group. It worked, but you couldn't cleanly explain why. This version you can.

🎯 *"Walk the string counting consecutive repeats. On a change, append char+count and reset. Append the final run after the loop."*
</details>

---

### 9. Longest Word
`"Vue js is very powerful framework"` → `"framework"`

<details><summary>Answer</summary>

🟢 **No Map needed — track the answer directly:**
```js
function longestWord(sentence) {
  let longest = "";
  for (const word of sentence.split(' ')) {
    if (word.length > longest.length) longest = word;
  }
  return longest;
}
```
⚠️ **Your earlier version** built a Map of every word→length then looped it. The Map
stored data you immediately threw away. Simpler is the senior signal — *"why the Map?"*
has no good answer.

🎯 *"Split into words, keep the one with the greatest length. Single pass, no extra structure."*
</details>

---

### 10. Remove Duplicate Characters
`"programming"` → `"progamin"`

<details><summary>Answer</summary>

🟢 **`includes` in a loop — O(n²), works but slow:**
```js
function removeDuplicates(str) {
  let out = "";
  for (const ch of str) {
    if (!out.includes(ch)) out += ch;
  }
  return out;
}
```

⚡ **Set — O(n), the optimize version:**
```js
function removeDuplicates(str) {
  const seen = new Set();
  let out = "";
  for (const ch of str) {
    if (!seen.has(ch)) { seen.add(ch); out += ch; }
  }
  return out;
}
```
⚠️ **"Make it faster?"** → `out.includes()` scans the whole string each time (O(n²)).
A Set gives O(1) lookups → O(n) overall.

🎯 *"Track seen chars in a Set, append only first occurrences. Set lookup is O(1) vs scanning the result string."*
</details>

---

## ARRAYS

---

### 11. Reverse Array (non-mutating)
`[1,2,3,4,5]` → `[5,4,3,2,1]`, original unchanged

<details><summary>Answer</summary>

🟢
```js
function reverseArray(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}
```
⚠️ **"Non-mutating" is the key word** — pushing into a *new* array leaves the input
untouched. `arr.reverse()` would mutate in place (wrong here). Know the difference.

🎯 *"Build a new array from the end backward, so the original is untouched. reverse() would mutate — I avoid it when non-mutating is required."*
</details>

---

### 12. Move Zeros to End — *know the in-place version*
`[0,1,0,3,12]` → `[1,3,12,0,0]`

<details><summary>Answer</summary>

🟢 **New-array version (works, but usually not what's tested):**
```js
function moveZeros(arr) {
  const result = [];
  let zeros = 0;
  for (const n of arr) {
    n !== 0 ? result.push(n) : zeros++;
  }
  while (zeros--) result.push(0);
  return result;
}
```

⚡ **In-place, O(1) extra space — THIS is what they actually want:**
```js
function moveZeros(arr) {
  let insertPos = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) arr[insertPos++] = arr[i];
  }
  while (insertPos < arr.length) arr[insertPos++] = 0;
  return arr;
}
```
⚠️ **The whole reason this question exists** is the in-place constraint. If you give the
new-array version, they'll say *"now without extra space."* Lead with in-place or have it ready.

🎯 *"Two-pointer: one scans, one marks where the next non-zero goes. Overwrite forward, fill the rest with zeros. O(1) extra space."*
</details>

---

### 13. Flatten Nested Array (from your earlier question)
`[1, [2, [3, 4]], 5]` → `[1, 2, 3, 4, 5]`

<details><summary>Answer</summary>

🟢 **Recursive:**
```js
function flattenArray(data) {
  const res = [];
  data.forEach(x => {
    if (Array.isArray(x)) {
      res.push(...flattenArray(x));   // spread the flattened sub-array in
    } else {
      res.push(x);
    }
  });
  return res;
}
```
⚠️ **Why the spread?** `flattenArray(x)` returns an array; `...` spreads its values in
individually. Without it, `push([...])` would nest an array inside — the opposite of flattening.

⚡ **Built-in (mention it exists):** `arr.flat(Infinity)` does this in one call.

🎯 *"Recurse into nested arrays, spread their flattened results into the parent. Or use flat(Infinity) built-in."*
</details>

---

## The patterns across all 13 (say these and you sound senior)

1. **Map/Set for O(1) lookups** beats scanning (`includes` in a loop = O(n²)). Used in: non-repeating, dedupe, anagram, vowels.
2. **Two pointers** for in-place / both-ends work. Used in: palindrome, move zeros.
3. **`.map().join(' ')`** over `+= x + ' '` — kills trailing-space bugs. Used in: reverse words, capitalize.
4. **Every question has an "optimize it" second half** — usually "do it in O(n)" or "in-place." Prep that half; it's where you win or lose.

---

## Your 3 weakest habits (an interviewer named these from your code)

1. **You don't check your own output** → trailing spaces slipped into 3 functions. *Say the result out loud, spaces included, before declaring done.*
2. **You over-engineer** → Map where a single variable works. *Reach for the simplest thing first.*
3. **You stop at the baseline** → you don't anticipate "now make it faster." *Every problem here has a ⚡ — that's the half you're missing.*

---

## Drill plan (you committed to this)

Pick **3** problems. Close this file. Write them **blank** — code from memory, autocomplete off.
Where you stall is your real gap. Reading these 13 does nothing; reproducing 3 proves something.

Start with: **First Non-Repeating Char**, **Move Zeros (in-place)**, **Anagram (O(n))**.
Those carry the patterns that transfer to everything else.