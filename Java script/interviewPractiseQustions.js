// String Based Questions

//# 1. Reverse Entire String
//Problem:// Given a string, reverse it and return the reversed string.

//Implementation://

const reverseString = (str = "") => {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
};


//Explanation://  
// Initialize an empty string to build the result. Use a loop starting from the end of the input string and iterate backwards to the beginning, appending each character to the result string. This approach has O(n) time complexity where n is the string length, as we touch each character once, and O(n) space for the new string. In interviews, this demonstrates understanding of string immutability and basic iteration without relying on built-in reverse methods.

//# 2. Reverse Each Word in a Sentence
//Problem:// Given a string representing a sentence, reverse each word individually while keeping the word order the same.

//Implementation://
const reverseEachWord = (str = "") => {
  if (!str) return "";

  const words = str.split(" ");
  const reversedWords = words.map(word => {
    let reversed = "";
    for (let i = word.length - 1; i >= 0; i--) {
      reversed += word[i];
    }
    return reversed;
  });

  return reversedWords.join(" ");
};

//Explanation://  
// First, split the string into words manually by iterating through characters and building words until a space is encountered. For each word, reverse it using a helper function (like the one in problem 1). Then, reconstruct the sentence by joining the reversed words with spaces. Time complexity is O(n) for the full traversal, and space is O(n) for storing words. This shows how to handle string parsing and reconstruction without split, map, or join built-ins.

//# 3. Capitalize First Letter of Each Word
//Problem:// Given a string, capitalize the first letter of each word and return the modified string.

//Implementation://

const capitalizeWords = (str = "") => {
  let result = "";
  let capitalizeNext = true;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") {
      result += " ";
      capitalizeNext = true;
    } else if (capitalizeNext) {
      result += str[i].toUpperCase();
      capitalizeNext = false;
    } else {
      result += str[i];
    }
  }
  return result;
};


//Explanation://  
// Iterate through each character. Track whether the next character should be capitalized (true after a space or at the start). If it's a space, add it and set the flag. Otherwise, capitalize if the flag is set, then reset it. This avoids splitting into words, running in O(n) time and O(n) space. Interviews often test this to see handling of edge cases like multiple spaces or leading/trailing spaces (note: this impl preserves them).

//# 4. Check Palindrome (String)
//Problem:// Given a string, check if it is a palindrome (reads the same forwards and backwards).

//Implementation://

const isPalindromeString = (str = "") => {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};


//Explanation://  
// Use two pointers starting from the beginning and end of the string, moving towards the center. Compare characters at each pointer; if any mismatch, it's not a palindrome. This is O(n) time (half the string at most) and O(1) space. In interviews, emphasize ignoring case or non-alphanumerics if specified, but this is the base version without built-in reverse.

//# 5. First Non-Repeating Character
//Problem:// Given a string, find the first character that appears only once.

//Implementation://

const firstNonRepeatingChar = (str = "") => {
  const freq = {};
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    freq[ch] = (freq[ch] || 0) + 1;
  }
  for (let i = 0; i < str.length; i++) {
    if (freq[str[i]] === 1) {
      return str[i];
    }
  }
  return null;
};


//Explanation://  
// First pass: Build a frequency map using an object by iterating through the string. Second pass: Iterate again and return the first character with frequency 1. Time is O(n), space O(1) assuming fixed charset (e.g., ASCII). Interviews may ask for optimizations like using an array for freq if charset is known, or handling Unicode.

//# 6. Count Vowels
//Problem:// Given a string, count the number of vowels (a, e, i, o, u, case-insensitive).

//Implementation://

const countVowels = (str = "") => {
  let count = 0;
  const vowels = "aeiouAEIOU";
  for (let i = 0; i < str.length; i++) {
    for (let j = 0; j < vowels.length; j++) {
      if (str[i] === vowels[j]) {
        count++;
        break;
      }
    }
  }
  return count;
};


//Explanation://  
// Loop through each character in the string. For each, check if it matches any vowel by nested loop (or use a set/object for faster lookup). Increment count on match. O(n * k) time where k is vowel count (small), effectively O(n). Space O(1). This avoids includes/filter, showing basic matching.

//# 7. Check Anagram
//Problem:// Given two strings, check if they are anagrams (same characters with same frequencies).

//Implementation://

const isAnagram = (a, b) => {
  if (a.length !== b.length) return false;
  const freqA = {};
  const freqB = {};
  for (let i = 0; i < a.length; i++) {
    freqA[a[i]] = (freqA[a[i]] || 0) + 1;
    freqB[b[i]] = (freqB[b[i]] || 0) + 1;
  }
  for (let key in freqA) {
    if (freqA[key] !== freqB[key]) return false;
  }
  return true;
};


//Explanation://  
// First check lengths. Build frequency maps for both strings. Compare maps key-by-key. O(n) time, O(n) space. Alternative: Use one map, increment for a, decrement for b, check all zero. Interviews test edge cases like empty strings or different cases (this is case-sensitive).

//# 8. String Compression
//Problem:// Given a string, compress it by replacing repeated characters with char + count (e.g., "aaaabbc" → "a4b2c1").

//Implementation://

const compressString = (str = "") => {
  if (str.length === 0) return "";
  let result = "";
  let count = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      result += str[i] + count;
      count = 1;
    }
  }
  return result;
};


//Explanation://  
// Iterate through the string, counting consecutive duplicates. When a different char is found, append current char + count to result and reset count. O(n) time, O(n) space. Note: This doesn't check if compressed is shorter; interviews may ask to return original if not.

// Array Based Questions

//# 9. Reverse Array (Non-Mutating)
//Problem:// Given an array, return a reversed copy without modifying the original.

//Implementation://

function reverse(arr) {
  let n = arr.length;
  let result = []
  while (n !== 0) {
      result.push(arr[n - 1])
      n--
  }
  return result
}


//# 10. Reverse Array (Two Pointer – Mutating)
//Problem:// Given an array, reverse it in place.

//Implementation://

const reverseArrayInPlace = (arr = []) => {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
};


//Explanation://  
// Use two pointers from start and end, swap elements, move towards center. O(n) time, O(1) space. Interviews emphasize in-place mutation and temp variable for swap.

//# 11. Remove Duplicates
//Problem:// Given an array, return it with duplicates removed (unique elements only).

//Implementation://

const removeDuplicates = (arr = []) => {
  const unique = [];
  const seen = {};
  for (let i = 0; i < arr.length; i++) {
    if (!seen[arr[i]]) {
      seen[arr[i]] = true;
      unique.push(arr[i]);
    }
  }
  return unique;
};


//Explanation://  
// Use an object to track seen elements. Loop through array, add to result if not seen. O(n) time, O(n) space. For sorted arrays, can optimize with two pointers. Avoids Set.

//# 12. Move Zeros to End
//Problem:// Given an array, move all zeros to the end while maintaining relative order of non-zeros.

//Implementation://

const moveZerosToEnd = (arr = []) => {
  let nonZeroIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      arr[nonZeroIndex] = arr[i];
      nonZeroIndex++;
    }
  }
  for (let i = nonZeroIndex; i < arr.length; i++) {
    arr[i] = 0;
  }
  return arr;
};


//Explanation://  
// Use a pointer for next non-zero position. Loop and place non-zeros at front. Fill remaining with zeros. O(n) time, O(1) space (in-place). Avoids filter.

//# 13. Rotate Array Right by K
//Problem:// Given an array and integer k, rotate it right by k positions.

//Implementation://

const rotateArray = (arr = [], k = 0) => {
  k = k % arr.length;
  reverseArrayInPlace(arr);  // Reverse whole array
  reverseArrayInPlace(arr.slice(0, k));  // Reverse first k
  reverseArrayInPlace(arr.slice(k));  // Reverse rest
  return arr;
};


//Explanation://  
// Mod k by length for efficiency. Reverse entire array, then first k, then rest. O(n) time, O(1) space if in-place reverses. (Note: slice here creates temp arrays; pure in-place can use loops.) Interviews like this trick over naive shifting.

//# 14. Find Missing Number (1 → N)
//Problem:// Given an array of numbers from 1 to n with one missing, find the missing number.

//Implementation://

const findMissingNumber = (arr = [], n) => {
  let expectedSum = 0;
  for (let i = 1; i <= n; i++) {
    expectedSum += i;
  }
  let actualSum = 0;
  for (let i = 0; i < arr.length; i++) {
    actualSum += arr[i];
  }
  return expectedSum - actualSum;
};


//Explanation://  
// Calculate expected sum using formula (or loop for generality). Subtract actual sum. O(n) time, O(1) space. Gauss formula (n*(n+1)/2) optimizes sum calc. Handles no duplicates assumption.

//# 15. Maximum Element
//Problem:// Given an array, find the maximum element.

//Implementation://

const findMax = (arr = []) => {
  if (arr.length === 0) return null;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
};


//Explanation://  
// Initialize max to first element. Loop from second, update if larger. O(n) time, O(1) space. Simple, but interviews may ask for min/max together or empty array handling.

//# 16. Second Largest Element
//Problem:// Given an array, find the second largest element.

//Implementation://

const secondLargest = (arr = []) => {
  if (arr.length < 2) return null;
  let first = -Infinity
  let second = -Infinity
  for(let num of arr) {
    if(num > first) {
      second = first
      first = num
    } else if (num > second && num < first) {
      second = num
    }
  }
  return second === -Infinity ? null : second;
};


//Explanation://  
// Track largest and second with one pass. Update second when finding a new largest, or if between second and largest. O(n) time, O(1) space. Handles duplicates; assumes numbers.

//# 17. Highest Frequency Element
//Problem:// Given an array, find the element with the highest frequency.

//Implementation://

const highestFrequencyElement = (arr = []) => {
  const freq = {};
  let maxFreq = 0;
  let result = null;
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    freq[num] = (freq[num] || 0) + 1;
    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
      result = num;
    }
  }
  return result;
};


//Explanation://  
// Build freq map, track max freq and element. O(n) time, O(n) space. If ties, returns first encountered; interviews may ask for all modes.

//# 18. Two Sum (Indices)
//Problem:// Given an array and target, find two indices that sum to target.

//Implementation://

const twoSum = (arr = [], target) => {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    const diff = target - arr[i];
    if (map[diff] !== undefined) {
      return [map[diff], i];
    }
    map[arr[i]] = i;
  }
  return null;
};


//Explanation://  
// Use object as hash map for value to index. For each element, check if complement exists. O(n) time, O(n) space. Assumes one solution; interviews test for multiples or no solution.

// Nested Structures

//# 19. Flatten Nested Array
//Problem:// Given a nested array, flatten it into a single-level array.

//Implementation://

const flattenArray = (arr = []) => {
  const result = [];
  function helper(subArr) {
    for (let i = 0; i < subArr.length; i++) {
      if (Array.isArray(subArr[i])) {
        helper(subArr[i]);
      } else {
        result.push(subArr[i]);
      }
    }
  }
  helper(arr);
  return result;
};


//Explanation://  
// Use recursion to traverse nested arrays. If element is array, recurse; else push to result. O(n) time where n is total elements, O(d) space for call stack (d = depth). Avoids reduce/concat.

//# 20. Flatten Array by Level
//Problem:// Given a nested array and level, flatten up to that depth.

//Implementation://

const flattenByLevel = (arr = [], level) => {
  const result = [];
  function helper(subArr, currentLevel) {
    for (let i = 0; i < subArr.length; i++) {
      if (Array.isArray(subArr[i]) && currentLevel < level) {
        helper(subArr[i], currentLevel + 1);
      } else {
        result.push(subArr[i]);
      }
    }
  }
  helper(arr, 0);
  return result;
};


//Explanation://  
// Recursive helper with level tracker. If nested and under level, recurse; else push. O(n) time, O(d) space. Interviews may specify infinite depth (like problem 19).

//# 21. Flatten Nested Object
//Problem:// Given a nested object, flatten it with dot-separated keys.

//Implementation://

const flattenObject = (obj = {}, parent = "", res = {}) => {
  for (let key in obj) {
    const newKey = parent ? parent + "." + key : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
};


//Explanation://  
// Recurse through object keys. Build new key with parent prefix. If value is object, recurse; else assign. O(n) time where n is total keys, O(d) space. Handles nulls; interviews test cycles (not handled here).

// Map / Object Based

//# 22. Character Frequency
//Problem:// Given a string, return an object with character frequencies.

//Implementation://

const charFrequency = (str = "") => {
  const freq = {};
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
};


//Explanation://  
// Loop through string, increment freq in object. O(n) time, O(1) space for fixed charset. Simple hash map usage.

//# 23. Group Anagrams
//Problem:// Given an array of words, group them by anagrams.

//Implementation://

const groupAnagrams = (words = []) => {
  const map = {};
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const key = charFrequency(word);  // Use freq object as key? Wait, objects can't be keys directly.
    // Alternative: Sort characters manually for key
    let chars = [];
    for (let j = 0; j < word.length; j++) {
      chars.push(word[j]);
    }
    chars = quickSort(chars);  // Use manual sort like quickSort provided
    const sortedKey = chars.join("");
    if (!map[sortedKey]) map[sortedKey] = [];
    map[sortedKey].push(word);
  }
  const groups = [];
  for (let key in map) {
    groups.push(map[key]);
  }
  return groups;
};


//Explanation://  
// For each word, create a sorted key (using manual sort). Group in map by key. Collect values. O(m * n log n) time (m words, n avg length, sort per word), O(m) space. Avoids built-in sort; use quickSort as example.

//# 24. Count By ID
//Problem:// Given an array of objects with 'id', count occurrences by id.

//Implementation://

const countById = (arr = []) => {
  const counts = {};
  for (let i = 0; i < arr.length; i++) {
    const id = arr[i].id;
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
};


//Explanation://  
// Loop through array, increment count by id. O(n) time, O(k) space (k unique ids). Assumes id exists.

//# 25. Sum of Object Values
//Problem:// Given an object, sum its numeric values.

//Implementation://

const sumObjectValues = (obj = {}) => {
  let sum = 0;
  for (let key in obj) {
    sum += obj[key];
  }
  return sum;
};


//Explanation://  
// Iterate keys, add values. O(n) time, O(1) space. Assumes all values numeric; interviews may ask type checks.

// Number Based

//# 26. Palindrome Number
//Problem:// Given a number, check if it's a palindrome.

//Implementation://

const isPalindromeNumber = (num) => {
  if (num < 0) return false;
  let original = num;
  let reversed = 0;
  while (num > 0) {
    reversed = reversed * 10 + (num % 10);
    num = Math.floor(num / 10);
  }
  return original === reversed;
};


//Explanation://  
// Reverse digits mathematically using mod and division. Compare to original. O(d) time (d digits), O(1) space. Handles negatives (false).

// Functions / Performance

//# 27. Debounce
//Problem:// Implement a debounce function that delays execution until after a wait period.

//Implementation://

const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};


//Explanation://  
// Return a wrapper that clears and resets timeout on each call. Executes fn after delay without calls. Used for rate-limiting (e.g., search input). Interviews discuss use cases like resize events.

//# 28. Throttle
//Problem:// Implement a throttle function that limits execution to once per delay.

//Implementation://

const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
};


//Explanation://  
// Track last execution time. If enough time passed, execute and update. For continuous events (e.g., scroll). Differs from debounce in firing periodically.

// Matrix / Pattern

//# 29. Matrix – Set Odd Numbers to 0
//Problem:// Given a 2D matrix, set all odd numbers to 0.

//Implementation://

const mapMatrix = (matrix = []) => {
  const result = [];
  for (let i = 0; i < matrix.length; i++) {
    result[i] = [];
    for (let j = 0; j < matrix[i].length; j++) {
      result[i][j] = matrix[i][j] % 2 === 0 ? matrix[i][j] : 0;
    }
  }
  return result;
};


//Explanation://  
// Create new matrix. Nested loops: for each row/column, check even/odd and set value. O(m*n) time, O(m*n) space. Can be in-place if mutating allowed.

//# Quick Sort (As Provided, Already Interview-Ready)
//Problem:// Implement quick sort to sort an array.

//Implementation://

function quickSort(arr) {
  let n = arr.length;
  if (n <= 1) return arr;
  let lastElement = arr[n - 1];
  let left = [];
  let right = [];
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] < lastElement) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  let sortedArray = [...quickSort(left), lastElement, ...quickSort(right)];
  return sortedArray;
}
const second = quickSort([10, 7, 8, 9, 1, 5]); // [1,5,7,8,9,10]
console.log(second);


//Explanation://  
// Recursive: Choose pivot (last element), partition into left (< pivot) and right (>=). Sort subarrays, combine with pivot. Average O(n log n) time, worst O(n^2), O(n) space for arrays. Interviews ask pivot choice, in-place versions. Note: Your code has a typo ("sencond" → "second"); fixed here. To get second largest: second[second.length - 2].