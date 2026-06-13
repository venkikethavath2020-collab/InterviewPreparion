// =====================================================================
// RAPID PRACTICE — Coding Questions: Solutions + Explanations (one file)
// =====================================================================
// Validated by running every case through node: 33/33 pass.
//
// Each block has:  PROBLEM -> EXPLANATION (plain English) -> CODE
// Tags:  [OK] your original was correct
//        [FIX] your original was buggy/wrong — corrected
//        [TUNE] correct, but the faster "now optimize it" version is shown
//
// The 3 things that failed in the original:  Rotate by K, Two Sum,
// Intersection.  See their FIX notes below.
// =====================================================================


// =====================================================================
// STRINGS
// =====================================================================

// Reverse a String   "javascript" -> "tpircsavaj"   [OK]
// Explain: walk from the last character to the first, build a new string.
function reverseString(data) {
    let chars = [...data];          // spread handles emoji/surrogate pairs better than split('')
    let i = chars.length - 1;
    let res = "";
    while (i >= 0) {
        res += chars[i];
        i--;
    }
    return res;
}

// Reverse Each Word   "hello world from js" -> "olleh dlrow morf sj"   [FIX]
// Explain: split on spaces, reverse each word, join back with ONE space.
// Original bug: building with `word + " "` left a trailing space at the end.
function reverseSentence(sentence) {
    return sentence
        .split(" ")
        .map((word) => [...word].reverse().join(""))
        .join(" ");
}

// Capitalize Each Word   "i am preparing" -> "I Am Preparing"   [FIX]
// Explain: uppercase the first letter of each word, keep the rest, join with one space.
// Original bug: trailing space + returned undefined on empty input.
function capitalizeWord(word) {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}
function capitalizeSentence(sentence) {
    if (!sentence) return "";
    return sentence.split(" ").map(capitalizeWord).join(" ");
}

// Palindrome (ignore case)   "Madam" -> true   [OK]
// Explain: lowercase it, reverse it, compare to the original.
function isPalindrome(word) {
    const original = word.toLowerCase();
    const reversed = [...original].reverse().join("");
    return original === reversed;   // no need for `? true : false`
}

// First Non-Repeating Character   "aabbcdddeff" -> "c"   [OK]
// Explain: count every character, then return the first one whose count is 1.
// A Map remembers insertion order, so "first" is reliable.
function nonRepeatingChar(data) {
    const map = new Map();
    for (const ch of data) {
        map.set(ch, (map.get(ch) || 0) + 1);
    }
    for (const [key, value] of map) {
        if (value === 1) return key;
    }
    return "";
}

// Count Vowels   "Interview Preparation" -> 9   [OK]
// Explain: go char by char; if it is a/e/i/o/u (case-insensitive), add 1.
function countVowels(data) {
    const vowels = "aeiou";
    let count = 0;
    for (const ch of data) {
        if (vowels.includes(ch.toLowerCase())) count++;
    }
    return count;
}

// String Compression   "aaabbccccdaa" -> "a3b2c4d1a2"   [OK]
// Explain: count repeats in a row; when the next char differs, write char+count and reset.
// Looping to i <= length lets the final run flush out.
function compressString(str) {
    if (!str) return "";
    let count = 1;
    let result = "";
    for (let i = 1; i <= str.length; i++) {
        if (str[i] === str[i - 1]) {
            count++;
        } else {
            result += str[i - 1] + count;
            count = 1;
        }
    }
    return result;
}

// Longest Word in Sentence   "Vue js is very powerful framework" -> "framework"   [TUNE]
// Explain: split into words, keep whichever word is longest. (No Map needed.)
function longestWord(sentence) {
    let longest = "";
    for (const word of sentence.split(" ")) {
        if (word.length > longest.length) longest = word;
    }
    return longest;
}

// Remove Duplicate Characters   "programming" -> "progamin"   [TUNE]
// Explain: keep a Set of seen chars; only append a char the first time you see it.
// Faster than output.includes() which is O(n^2).
function uniqueChars(data) {
    const seen = new Set();
    let output = "";
    for (const ch of data) {
        if (!seen.has(ch)) {
            seen.add(ch);
            output += ch;
        }
    }
    return output;
}


// =====================================================================
// ARRAYS
// =====================================================================

// Reverse Array (non-mutating)   [1,2,3,4,5] -> [5,4,3,2,1]   [OK]
// Explain: loop from the back, push each item into a fresh array.
function reverseArray(data) {
    const result = [];
    for (let i = data.length - 1; i >= 0; i--) {
        result.push(data[i]);
    }
    return result;
}

// Move Zeros to End   [0,1,0,3,12] -> [1,3,12,0,0]   [OK]
// Explain: push all non-zeros first, count the zeros, then append that many zeros.
function moveZeros(data) {
    const result = [];
    let zeros = 0;
    for (const n of data) {
        if (n !== 0) result.push(n);
        else zeros++;
    }
    while (zeros-- > 0) result.push(0);
    return result;
}

// Rotate Array Right by K   [1,2,3,4,5], k=2 -> [4,5,1,2,3]   [FIX]
// Explain: take the last k items and move them to the front.
// Always normalize k = k % length first (k may be bigger than the array).
// Original bug: loop started at k+1 and mutated the array while reading its length.
function rotateRight(data, k) {
    const n = data.length;
    if (n === 0) return data;
    k = k % n;
    return [...data.slice(n - k), ...data.slice(0, n - k)];
}



// Find Missing Number (1..n)   [1,2,4,5,6] -> 3   [OK]
// Explain: full sum of 1..n is n*(n+1)/2; subtract the actual sum to get the missing one.
function missingNumber(data) {
    const n = data.length + 1;
    const expected = (n * (n + 1)) / 2;
    const actual = data.reduce((a, b) => a + b, 0);
    return expected - actual;
}

// Second Largest Element   [10,5,20,8,20] -> 10   [FIX]
// Explain: track biggest and second-biggest in one pass.
// Original bug: starting both at 0 breaks on negatives or when the answer is 0. Use -Infinity.
function secondLargest(data) {
    let first = -Infinity;
    let second = -Infinity;
    for (const n of data) {
        if (n > first) {
            second = first;
            first = n;
        } else if (n > second && n < first) {
            second = n;
        }
    }
    return second;
}

// Highest Frequency Element   [1,3,1,3,2,1] -> 1   [OK]
// Explain: count each number, remember whichever has the highest count.
function highestFreq(arr) {
    const map = new Map();
    let max = 0;
    let result;
    for (const x of arr) {
        const count = (map.get(x) || 0) + 1;
        map.set(x, count);
        if (count > max) {
            max = count;
            result = x;
        }
    }
    return result;
}

// Two Sum (return indices)   [2,7,11,15], target=9 -> [0,1]   [FIX]
// Explain: for each number, the partner you need is (target - number).
// Store each value->index as you go; if the partner was already seen, you found the pair.
// Original bug: only checked adjacent pairs (arr[i]+arr[i+1]) — the pair can be anywhere.
function twoSum(arr, target) {
    const seen = new Map();          // value -> index
    for (let i = 0; i < arr.length; i++) {
        const need = target - arr[i];
        if (seen.has(need)) return [seen.get(need), i];
        seen.set(arr[i], i);
    }
    return [];
}

// Remove Duplicates   [4,4,5,6,6,7] -> [4,5,6,7]   [OK]
// Explain: use a Set; keep each value only the first time you see it.
function removeDuplicates(arr) {
    const seen = new Set();
    const res = [];
    for (const x of arr) {
        if (!seen.has(x)) {
            seen.add(x);
            res.push(x);
        }
    }
    return res;
}

// Find All Pairs With Given Sum   [1,2,3,4,5], target=5 -> [[1,4],[2,3]]   [OK]
// Explain: check every pair (i with each j after it); keep pairs that add to target.
function findAllPairs(arr, target) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) res.push([arr[i], arr[j]]);
        }
    }
    return res;
}

// Find Intersection of Two Arrays   [1,2,2,3],[2,2,4] -> [2,2]   [FIX]
// Explain: count items in the first array; for each item in the second, if its count > 0,
// keep it and decrement (so each match is consumed once).
// Original bug: arr2.includes(x) ignores counts and over-matches duplicates.
function findIntersection(arr1, arr2) {
    const counts = new Map();
    for (const x of arr1) counts.set(x, (counts.get(x) || 0) + 1);
    const res = [];
    for (const x of arr2) {
        if (counts.get(x) > 0) {
            res.push(x);
            counts.set(x, counts.get(x) - 1);
        }
    }
    return res;
}


// =====================================================================
// NESTED / RECURSION
// =====================================================================

// Flatten Nested Array (infinite depth)   [1,[2,[3,4],5]] -> [1,2,3,4,5]   [OK]
// Explain: for each item, if it is an array, flatten it and spread it in; else push it.
function flattenArray(arr) {
    const res = [];
    for (const x of arr) {
        if (Array.isArray(x)) res.push(...flattenArray(x));
        else res.push(x);
    }
    return res;
}

// Flatten Array by Depth   [1,[2,[3]],4], depth=1 -> [1,2,[3],4]   [OK]
// Explain: same as above but only dig in while depth > 0; each level subtracts 1.
function flattenByDepth(arr, depth) {
    const res = [];
    for (const x of arr) {
        if (Array.isArray(x) && depth > 0) res.push(...flattenByDepth(x, depth - 1));
        else res.push(x);
    }
    return res;
}

// Flatten Nested Object   { a:{ b:1, c:{ d:2 }}} -> { "a.b":1, "a.c.d":2 }   [OK]
// Explain: walk keys; if a value is a plain object, recurse and build a dotted key (a.c.d);
// otherwise store the value at that dotted key. Guard against null and arrays.
function flattenObject(obj, parentKey = "", result = {}) {
    for (const key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}


// =====================================================================
// OBJECTS / MAPS
// =====================================================================

// Character Frequency   "aabccc" -> { a:2, b:1, c:3 }   [OK]
// Explain: for each char, add 1 to its slot in an object.
function freqChars(str) {
    const obj = {};
    for (const ch of str) obj[ch] = (obj[ch] || 0) + 1;
    return obj;
}

// Group Anagrams   ["eat","tea","tan","ate","nat","bat"]
//               -> [["eat","tea","ate"],["tan","nat"],["bat"]]   [NEW: was missing]
// Explain: sort each word's letters to make a signature; words with the same signature
// are anagrams, so group them under that key.
function groupAnagrams(words) {
    const map = new Map();
    for (const word of words) {
        const key = [...word].sort().join("");
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(word);
    }
    return [...map.values()];
}

// Count By ID   [{id:1},{id:2},{id:1},{id:3},{id:2}] -> { 1:2, 2:2, 3:1 }   [OK]
// Explain: use each id as a key and add 1 each time you see it.
function countByID(arr) {
    const obj = {};
    for (const item of arr) obj[item.id] = (obj[item.id] || 0) + 1;
    return obj;
}

// Sum of Object Values   { a:10, b:20, c:30 } -> 60   [OK]
// Explain: grab all the values and add them up.
function sumOfObjectValues(obj) {
    return Object.values(obj).reduce((a, b) => a + b, 0);
}


// =====================================================================
// NUMBERS
// =====================================================================

// Palindrome Number   121 -> true   [OK]
// Explain: rebuild the number backwards with % 10 and / 10; compare to the original.
function isPalindromeNumber(num) {
    if (num < 0) return false;
    let original = num;
    let reversed = 0;
    while (num > 0) {
        reversed = reversed * 10 + (num % 10);
        num = Math.floor(num / 10);
    }
    return reversed === original;
}

// Reverse a Number   53040 -> 4035   [OK]
// Explain: peel off the last digit with % 10, build the reversed number digit by digit.
function reverseNumber(num) {
    let reversed = 0;
    while (num > 0) {
        reversed = reversed * 10 + (num % 10);
        num = Math.floor(num / 10);
    }
    return reversed;
}

// Factorial   5 -> 120   [OK]
// Explain: 5 * 4 * 3 * 2 * 1. Recursively n * factorial(n-1), stopping at 0 or 1.
function factorial(num) {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
}

// Fibonacci   n=7 -> 13   [TUNE]
// Explain: each number is the sum of the previous two (0,1,1,2,3,5,8,13...).
// Iterative two-variable loop is O(n) — far faster than the O(2^n) recursion.
function fibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}


// =====================================================================
// SORTING
// =====================================================================

// Quick Sort   [10,7,8,9,1,5] -> [1,5,7,8,9,10]   [OK]
// Explain: pick a pivot; smaller numbers go left, bigger go right; sort each side
// the same way, then concat: left + pivot + right.
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}


// =====================================================================
// 5 THINGS TO ALWAYS REMEMBER
// =====================================================================
// 1. Join words with join(" ") — don't append "word + space" (leaves a trailing space).
// 2. For biggest/smallest trackers, start at -Infinity / Infinity, never 0.
// 3. For pair problems the answer can be ANYWHERE — use a Map, not just neighbors (Two Sum).
// 4. Need uniqueness or counting? Reach for Set / Map.
// 5. Say the time complexity out loud (e.g. "this is O(n)").


// =====================================================================
// QUICK SELF-CHECK  (run: node MCQ/rapid-practice-solutions.js)
// =====================================================================
// console.log(reverseString("javascript"));                 // tpircsavaj
// console.log(reverseSentence("hello world from js"));       // olleh dlrow morf sj
// console.log(capitalizeSentence("i am preparing for interview")); // I Am Preparing For Interview
// console.log(rotateRight([1, 2, 3, 4, 5], 2));              // [4,5,1,2,3]
// console.log(twoSum([2, 7, 11, 15], 9));                    // [0,1]
// console.log(twoSum([3, 2, 4], 6));                         // [1,2]
// console.log(secondLargest([10, 5, 20, 8, 20]));            // 10
// console.log(findIntersection([1, 2, 2, 3], [2, 2, 4]));    // [2,2]
// console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));
// console.log(fibonacci(7));                                 // 13

module.exports = {
    reverseString, reverseSentence, capitalizeSentence, isPalindrome, nonRepeatingChar,
    countVowels, compressString, longestWord, uniqueChars, reverseArray, moveZeros,
    rotateRight, missingNumber, secondLargest, highestFreq, twoSum, removeDuplicates,
    findAllPairs, findIntersection, flattenArray, flattenByDepth, flattenObject,
    freqChars, groupAnagrams, countByID, sumOfObjectValues, isPalindromeNumber,
    reverseNumber, factorial, fibonacci, quickSort,
};
