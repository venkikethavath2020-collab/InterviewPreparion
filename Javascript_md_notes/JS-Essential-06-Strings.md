# ESSENTIAL JS — SECTION 6: STRINGS

---

## 1. String Internals
**Definition:** A string is an immutable sequence of **UTF-16 code units**.
- **Immutability:** strings can't be changed in place — every "modification" returns a **new** string. `s[0] = 'x'` is silently ignored.
- **UTF-16 storage:** each code unit is 16 bits. Characters in the Basic Multilingual Plane = 1 code unit; others (emoji, some CJK) = **2 code units (surrogate pair)** → `length` counts code units, not visual characters.
- **V8 optimization:** small strings, **rope/cons strings** (lazy concatenation), interning of literals → efficient.
```js
'abc'.length;        // 3
'😀'.length;         // 2 (surrogate pair!)
[...'😀'].length;    // 1 (spread uses code points / iterator)
'café'.length;       // 4
```

## 2. Why Immutability
Enables safe sharing, hashing, interning, and engine optimizations. Mutation would break shared references.

## 3. The Methods (all non-mutating → return new strings)
```js
'  hi  '.trim();                 // 'hi'   (trimStart/trimEnd too)
'a,b,c'.split(',');              // ['a','b','c']   ('' → chars; no arg → whole)
'hello'.substring(1, 3);         // 'el'   (no negatives; swaps if start>end)
'hello'.slice(1, 3);             // 'el'   (supports negatives: slice(-2)→'lo')
'aaa'.replace('a', 'b');         // 'baa'  (first only; regex /g for all)
'aaa'.replaceAll('a', 'b');      // 'bbb'  (all; ES2021)
'hello'.includes('ell');         // true
'hello'.startsWith('he');        // true
'hello'.endsWith('lo');          // true
'5'.padStart(3, '0');            // '005'
'5'.padEnd(3, '0');              // '500'
'abc'.indexOf('b');              // 1   (-1 if not found)
'abc'.charAt(0);                 // 'a'
'abc'.at(-1);                    // 'c'  (negative index, ES2022)
'a'.repeat(3);                   // 'aaa'
'ABC'.toLowerCase();             // 'abc'
'abc'.charCodeAt(0);             // 97   ; String.fromCharCode(97) → 'a'
'😀'.codePointAt(0);             // 128512 (full code point)
```

### `substring` vs `slice` (tricky)
| | `slice(s, e)` | `substring(s, e)` |
|---|--------------|-------------------|
| Negatives | ✅ counts from end | ❌ treated as 0 |
| start > end | returns '' | **swaps** them |
```js
'hello'.slice(-3);        // 'llo'
'hello'.substring(-3);    // 'hello' (negative → 0)
'hello'.slice(3, 1);      // ''
'hello'.substring(3, 1);  // 'el' (swapped)
```

## 4. Real-World / Production
- Formatting (padStart for IDs/time `'9'.padStart(2,'0')`), slugs (`replace`/`toLowerCase`), parsing CSV (`split`), search (`includes`), templating, sanitization.

## 5. Interview Problems

### Reverse a String
```js
const reverse = s => [...s].reverse().join('');   // [...] handles surrogate pairs
// const reverse = s => s.split('').reverse().join('');  // breaks emoji
reverse('hello');   // 'olleh'
```

### Palindrome
```js
const isPalindrome = s => {
  const c = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return c === [...c].reverse().join('');
};
isPalindrome('A man, a plan, a canal: Panama');  // true
// Two-pointer (O(1) space):
function isPal(s){ let i=0,j=s.length-1; while(i<j) if(s[i++]!==s[j--]) return false; return true; }
```

### Anagram
```js
const isAnagram = (a, b) => {
  const norm = s => [...s.toLowerCase().replace(/\s/g,'')].sort().join('');
  return norm(a) === norm(b);
};
// O(n) with frequency map:
function isAnagram2(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch]||0) + 1;
  for (const ch of b) { if (!count[ch]) return false; count[ch]--; }
  return true;
}
```

### Character Count / First Non-Repeating
```js
const charCount = s => [...s].reduce((m, c) => (m[c] = (m[c]||0)+1, m), {});
charCount('aabbc');   // {a:2, b:2, c:1}

function firstUnique(s){
  const count = charCount(s);
  for (const c of s) if (count[c] === 1) return c;
  return null;
}
```

## 6. Common Mistakes
- Trying to mutate (`s[0]='x'` silently fails).
- `length` ≠ visible character count for emoji/surrogates (use `[...s]` or `Intl.Segmenter`).
- `replace('a','b')` only replaces first (use `/g` or `replaceAll`).
- `substring` negative confusion (use `slice`).
- Concatenation in huge loops (allocations) → build with array + `join`.

## 7. Best Practices
- Use `slice` over `substring` (predictable negatives).
- `replaceAll` / `/g` for all occurrences.
- `[...str]` / `for...of` / `Array.from` to iterate by code point (emoji-safe).
- Template literals for building strings.
- `Intl.Segmenter` for grapheme-accurate counting.

## 8. Performance
- Strings immutable → concatenation creates new strings; V8 uses rope/cons strings to defer cost, but building huge strings in tight loops still costs — prefer array push + `join`.
- Comparisons/hashing fast due to interning of literals.

## 9. Tricky Edge Cases
```js
'😀'.length;              // 2
'a' < 'b';               // true (lexicographic)
'10' < '9';              // true (string compare)
'abc'.split('');         // ['a','b','c']
''.split('');            // []
'a,b,'.split(',');       // ['a','b','']  (trailing empty)
'abc'.replace(/b/,'$&$&');  // 'abbc' ($& = matched)
'  '.trim() === '';      // true
String(123).padStart(5); // '  123'
'5' + 1;                 // '51'  (number coerced)
```

## 10. Output Prediction
```js
console.log('hello'.slice(-3));         // 'llo'
console.log('hello'.substring(-3));     // 'hello'
console.log('a-b-c'.split('-'));        // ['a','b','c']
console.log('aaa'.replace('a','x'));    // 'xaa'
console.log('aaa'.replaceAll('a','x')); // 'xxx'
console.log('5'.padStart(3,'0'));       // '005'
console.log([...'😀a'].length);         // 2
console.log('😀a'.length);              // 3
console.log('abc'.at(-1));              // 'c'
console.log('Hello'.indexOf('z'));      // -1
```

## Interview Questions
**🟢:** Are strings mutable? · slice vs substring? · replace vs replaceAll? · split usage?
**🟡:** Why `'😀'.length === 2`? · How to reverse a string with emoji safely? · padStart use case? · How to count characters?
**🔴:** UTF-16 + surrogate pairs + code units vs code points. · Implement palindrome/anagram (O(n)). · Why is string concatenation in loops slow (immutability)? · Intl.Segmenter for graphemes.
**🧩:** Reverse a string. · Check anagram efficiently. · First non-repeating char. · Format a number to 2 digits (padStart). · Replace all occurrences.

## ⚡ REVISION
- Strings = immutable UTF-16 code units; `length` counts code units (emoji = 2).
- All methods non-mutating (return new). slice (negatives ok) vs substring (negatives→0, swaps).
- replace (first) vs replaceAll/`/g` (all); padStart/padEnd; includes/startsWith/endsWith.
- Iterate by code point with `[...s]`/for...of (emoji-safe).
- Classic problems: reverse (`[...s].reverse().join('')`), palindrome (two-pointer), anagram (freq map O(n)).

➡️ Next: **Objects.**
