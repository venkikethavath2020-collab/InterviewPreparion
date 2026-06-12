// Rapid Practice - Input / Output Coding Questions
// Strings

// Reverse Entire String
// Input: "javascript"
// Output: "tpircsavaj"
// Interview answer: Iterate from the last character to the first and build a new string.

// Reverse Each Word
// Input: "hello world from js"
// Output: "olleh dlrow morf sj"
// Interview answer: Split words by spaces, reverse each word, then join them back in the same order.

// Capitalize Each Word
// Input: "i am preparing for interview"
// Output: "I Am Preparing For Interview"
// Interview answer: Capitalize the first character after the start or a space, keeping the rest unchanged.

// Palindrome (Ignore case)
// Input: "Madam"
// Output: true
// Interview answer: Convert to the same case and compare characters from both ends using two pointers.

// First Non-Repeating Character
// Input: "aabbcdddeff"
// Output: "c"
// Interview answer: Count character frequencies first, then scan again and return the first count of one.

// Count Vowels
// Input: "Interview Preparation"
// Output: 9
// Interview answer: Check each character against vowels in a case-insensitive way and increment the count.

// Check Anagram
// Input: "listen", "silent"
// Output: true
// Interview answer: Both strings have the same character frequencies, so they are anagrams.

// String Compression
// Input: "aaabbccccdaa"
// Output: "a3b2c4d1a2"
// Interview answer: Count consecutive repeated characters and append the character with its count.

// Longest Word in Sentence
// Input: "Vue js is very powerful framework"
// Output: "framework"
// Interview answer: Split the sentence into words and keep the word with the greatest length.

// Remove Duplicate Characters
// Input: "programming"
// Output: "progamin"
// Interview answer: Track seen characters with a Set and append only the first occurrence of each character.

// Arrays

// Reverse Array (non-mutating)
// Input: [1, 2, 3, 4, 5]
// Output: [5, 4, 3, 2, 1]
// Interview answer: Traverse from the end and push elements into a new array, leaving the original unchanged.

// Move Zeros to End
// Input: [0,1,0,3,12]
// Output: [1,3,12,0,0]
// Interview answer: Move non-zero values forward first, then fill the remaining positions with zeroes.

// Rotate Array Right by K
// Input: [1,2,3,4,5], k = 2
// Output: [4,5,1,2,3]
// Interview answer: Normalize k with array length, then move the last k elements to the front.

// Find Missing Number (1 -> n)
// Input: [1,2,4,5,6], n = 6
// Output: 3
// Interview answer: Compare expected sum n * (n + 1) / 2 with the actual array sum.

// Second Largest Element
// Input: [10, 5, 20, 8, 20]
// Output: 10
// Interview answer: Track largest and second largest distinct values while scanning once.

// Highest Frequency Element
// Input: [1,3,1,3,2,1]
// Output: 1
// Interview answer: Build a frequency map and return the element with the maximum count.

// Two Sum (return indices)
// Input: [2,7,11,15], target = 9
// Output: [0,1]
// Interview answer: Store seen values in a map and check whether target minus current value already exists.

// Remove Duplicates
// Input: [4,4,5,6,6,7]
// Output: [4,5,6,7]
// Interview answer: Use a Set or a lookup object to keep only the first occurrence of each value.

// Find All Pairs With Given Sum
// Input: [1,2,3,4,5], target = 5
// Output: [[1,4],[2,3]]
// Interview answer: Use a Set to check complements and collect pairs whose values add to the target.

// Find Intersection of Two Arrays
// Input: [1,2,2,3], [2,2,4]
// Output: [2,2]
// Interview answer: Count values from one array, then scan the other and consume matching counts.

// Nested / Recursion

// Flatten Nested Array (infinite depth)
// Input: [1,[2,[3,4],5]]
// Output: [1,2,3,4,5]
// Interview answer: Use recursion to process nested arrays until every value is pushed into one result array.

// Flatten Array by Depth = 1
// Input: [1,[2,[3]],4]
// Output: [1,2,[3],4]
// Interview answer: Flatten only one nesting level and leave deeper nested arrays unchanged.

// Flatten Nested Object
// Input:

// { a: { b: 1, c: { d: 2 } } }


// Output: { "a.b": 1, "a.c.d": 2 }
// Interview answer: Recursively walk object keys and build dot-separated paths for primitive values.

// Objects / Maps

// Character Frequency
// Input: "aabccc"
// Output: { a: 2, b: 1, c: 3 }
// Interview answer: Iterate through characters and increment each character count in an object or Map.

// Group Anagrams
// Input: ["eat","tea","tan","ate","nat","bat"]
// Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
// Interview answer: Sort each word as a key and group words that produce the same sorted key.

// Count By ID
// Input:

// [{id:1},{id:2},{id:1},{id:3},{id:2}]


// Output: { 1: 2, 2: 2, 3: 1 }
// Interview answer: Use each id as a key and increment its count while iterating the objects.

// Sum of Object Values
// Input:

// { a: 10, b: 20, c: 30 }


// Output: 60
// Interview answer: Get the object values and reduce them into a single numeric sum.

// Numbers

// Palindrome Number
// Input: 121
// Output: true
// Interview answer: Reverse the number or compare digits from both ends and check equality with the original.

// Reverse a Number
// Input: 53040
// Output: 4035
// Interview answer: Repeatedly take the last digit with modulo and build the reversed number.

// Find Factorial
// Input: 5
// Output: 120
// Interview answer: Multiply numbers from 1 to n, or use recursion with base case 0 or 1.

// Fibonacci (n = 7)
// Output: 13
// Interview answer: Starting from 0 and 1, iteratively build the sequence until the nth value.

// Functions (Debounce / Throttle - Conceptual I/O)

// Debounce
// Input: Rapid calls at -> 0ms, 100ms, 200ms, 700ms with delay = 500ms
// Output: Function executes at 1200ms
// Interview answer: Debounce resets the timer on every call, so only the final call runs after 500ms of silence.

// Throttle
// Input: Rapid calls at -> 0ms, 100ms, 200ms, 700ms with delay = 500ms
// Output: Function executes at 0ms and 700ms
// Interview answer: Throttle allows one execution per delay window and ignores calls inside the active window.

// Matrix

// Set Odd Numbers to 0
// Input:

// [
//   [1,2,3],
//   [4,5,6]
// ]


// Output: [[0,2,0],[4,0,6]]
// Interview answer: Traverse every matrix cell and replace values where number % 2 !== 0 with zero.

// Matrix Transpose
// Input:

// [
//   [1,2,3],
//   [4,5,6]
// ]


// Output: [[1,4],[2,5],[3,6]]
// Interview answer: Swap rows and columns by setting result[col][row] = matrix[row][col].

// Sorting / Quick Sort Thinking

// Quick Sort Result
// Input: [10,7,8,9,1,5]
// Output: [1,5,7,8,9,10]
// Interview answer: Partition around pivots recursively so smaller values go left and larger values go right.

// Find 2nd Largest Using Sorting
// Input: [12, 35, 1, 10, 34, 1]
// Output: 34
// Interview answer: Sort ascending and scan backward for the first value smaller than the largest distinct value.
