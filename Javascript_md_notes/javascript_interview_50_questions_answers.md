# JavaScript Interview Practice — 50 Problems & Answers

> Senior Frontend / Vue.js interview preparation  
> Covers JavaScript fundamentals, arrays, objects, recursion, algorithms, async JavaScript, and advanced patterns.

---

# 🟢 Level 1 — Basic JavaScript

## 1. Reverse a string

```js
function reverseString(input) {
    return input.split('').reverse().join('')
}

console.log(reverseString("hello"))
// "olleh"
```

**Time:** O(n)  
**Space:** O(n)

---

## 2. Check palindrome

```js
function isPalindrome(input) {
    let left = 0
    let right = input.length - 1

    while (left < right) {
        if (input[left] !== input[right]) {
            return false
        }

        left++
        right--
    }

    return true
}

console.log(isPalindrome("madam"))
// true
```

**Time:** O(n)  
**Space:** O(1)

---

## 3. Find the largest number

```js
function findLargest(numbers) {
    let largest = numbers[0]

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] > largest) {
            largest = numbers[i]
        }
    }

    return largest
}

console.log(findLargest([10, 5, 25, 8, 40, 15]))
// 40
```

**Time:** O(n)  
**Space:** O(1)

---

## 4. Find the smallest number

```js
function findSmallest(numbers) {
    let smallest = numbers[0]

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < smallest) {
            smallest = numbers[i]
        }
    }

    return smallest
}

console.log(findSmallest([10, 5, 25, 8, 40, 15]))
// 5
```

**Time:** O(n)  
**Space:** O(1)

---

## 5. Remove duplicates

```js
function removeDuplicates(numbers) {
    return [...new Set(numbers)]
}

console.log(removeDuplicates([1, 2, 3, 2, 4, 1, 5]))
// [1, 2, 3, 4, 5]
```

**Time:** O(n)  
**Space:** O(n)

---

## 6. Find only duplicate values

```js
function findDuplicates(numbers) {
    const seen = new Set()
    const duplicates = new Set()

    for (const number of numbers) {
        if (seen.has(number)) {
            duplicates.add(number)
        } else {
            seen.add(number)
        }
    }

    return [...duplicates]
}

console.log(findDuplicates([1, 2, 3, 2, 4, 1, 5, 3]))
// [2, 1, 3]
```

**Time:** O(n)  
**Space:** O(n)

### Key interview point

`Set` is useful for checking whether a value has already appeared.

---

## 7. Count occurrences

```js
function countOccurrences(numbers) {
    const frequency = {}

    for (const number of numbers) {
        frequency[number] = (frequency[number] || 0) + 1
    }

    return frequency
}

console.log(countOccurrences([1, 2, 2, 3, 1, 1, 4]))
// { 1: 3, 2: 2, 3: 1, 4: 1 }
```

**Time:** O(n)  
**Space:** O(n)

---

## 8. Move zeros to the end

### Simple solution

```js
function moveZerosToEnd(numbers) {
    const nonZeros = []
    const zeros = []

    for (const number of numbers) {
        if (number === 0) {
            zeros.push(number)
        } else {
            nonZeros.push(number)
        }
    }

    return [...nonZeros, ...zeros]
}

console.log(moveZerosToEnd([0, 1, 0, 3, 12]))
// [1, 3, 12, 0, 0]
```

**Time:** O(n)  
**Space:** O(n)

### Optimized in-place solution

```js
function moveZerosToEnd(numbers) {
    let position = 0

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== 0) {
            numbers[position] = numbers[i]
            position++
        }
    }

    while (position < numbers.length) {
        numbers[position] = 0
        position++
    }

    return numbers
}
```

**Time:** O(n)  
**Space:** O(1)

---

# 🟡 Level 2 — Arrays & Objects

## 9. Group employees by department

```js
function groupByDepartment(employees) {
    const result = {}

    for (const employee of employees) {
        const { dept, name } = employee

        if (!result[dept]) {
            result[dept] = []
        }

        result[dept].push(name)
    }

    return result
}

const employees = [
    { name: "Venki", dept: "IT" },
    { name: "Raj", dept: "HR" },
    { name: "Sam", dept: "IT" },
    { name: "John", dept: "Finance" },
    { name: "Ram", dept: "HR" }
]

console.log(groupByDepartment(employees))
/*
{
    IT: ["Venki", "Sam"],
    HR: ["Raj", "Ram"],
    Finance: ["John"]
}
*/
```

**Time:** O(n)  
**Space:** O(n)

### Important

Don't write:

```js
result[dept] = result[dept].push(name)
```

because `push()` returns the **new array length**, not the array.

---

## 10. Find employee with highest salary

```js
function highestSalaryEmployee(employees) {
    let highest = employees[0]

    for (let i = 1; i < employees.length; i++) {
        if (employees[i].salary > highest.salary) {
            highest = employees[i]
        }
    }

    return highest
}

console.log(highestSalaryEmployee([
    { name: "Venki", salary: 80000 },
    { name: "Raj", salary: 95000 },
    { name: "Sam", salary: 75000 },
    { name: "John", salary: 120000 }
]))
// { name: "John", salary: 120000 }
```

**Time:** O(n)  
**Space:** O(1)

---

## 11. Sort employees by salary

```js
function sortBySalary(employees) {
    return [...employees].sort((a, b) => b.salary - a.salary)
}

console.log(sortBySalary([
    { name: "Venki", salary: 80000 },
    { name: "Raj", salary: 95000 },
    { name: "Sam", salary: 75000 }
]))
```

**Time:** O(n log n) approximately  
**Space:** Depends on JavaScript engine; copying with `[...employees]` is O(n).

---

## 12. Find second largest number

```js
function secondLargest(numbers) {
    let largest = -Infinity
    let secondLargest = -Infinity

    for (const number of numbers) {
        if (number > largest) {
            secondLargest = largest
            largest = number
        } else if (number > secondLargest && number !== largest) {
            secondLargest = number
        }
    }

    return secondLargest
}

console.log(secondLargest([10, 50, 20, 80, 40, 80]))
// 50
```

**Time:** O(n)  
**Space:** O(1)

### Important

This treats the problem as finding the second **distinct** largest value.

---

## 13. Find missing number

```js
function findMissingNumber(numbers) {
    const n = numbers.length + 1

    const expected = n * (n + 1) / 2

    const actual = numbers.reduce((sum, number) => {
        return sum + number
    }, 0)

    return expected - actual
}

console.log(findMissingNumber([1, 2, 3, 5, 6]))
// 4
```

**Time:** O(n)  
**Space:** O(1)

### Alternative: XOR

For very large integer ranges, XOR avoids arithmetic-sum overflow concerns in languages where integer overflow matters.

---

## 14. Find common elements

```js
function intersection(a, b) {
    const setB = new Set(b)
    const result = []

    for (const value of a) {
        if (setB.has(value)) {
            result.push(value)
        }
    }

    return [...new Set(result)]
}

console.log(intersection(
    [1, 2, 3, 4, 5],
    [3, 4, 5, 6, 7]
))
// [3, 4, 5]
```

**Time:** O(n + m)  
**Space:** O(m + result)

---

## 15. Merge two arrays without duplicates

```js
function mergeUnique(a, b) {
    return [...new Set([...a, ...b])]
}

console.log(mergeUnique(
    [1, 2, 3],
    [2, 3, 4, 5]
))
// [1, 2, 3, 4, 5]
```

**Time:** O(n + m)  
**Space:** O(n + m)

---

## 16. Flatten an array

```js
function flattenArray(data) {
    const result = []

    function flatten(value) {
        for (const item of value) {
            if (Array.isArray(item)) {
                flatten(item)
            } else {
                result.push(item)
            }
        }
    }

    flatten(data)

    return result
}

console.log(flattenArray([1, [2, 3], [4, [5, 6]], 7]))
// [1, 2, 3, 4, 5, 6, 7]
```

**Time:** O(n) where n is the total number of elements  
**Space:** O(n) plus recursion stack.

---

# 🟠 Level 3 — JavaScript Logic

## 17. Two Sum

```js
function twoSum(numbers, target) {
    const seen = new Set()

    for (const number of numbers) {
        const complement = target - number

        if (seen.has(complement)) {
            return [complement, number]
        }

        seen.add(number)
    }

    return []
}

console.log(twoSum([2, 7, 11, 15], 9))
// [2, 7]
```

**Time:** O(n)  
**Space:** O(n)

### Why?

For each number:

```text
needed = target - current
```

Instead of checking every pair, use a `Set` for O(1)-average lookup.

---

## 18. First non-repeating character

```js
function firstNonRepeatingCharacter(input) {
    const frequency = {}

    for (const char of input) {
        frequency[char] = (frequency[char] || 0) + 1
    }

    for (const char of input) {
        if (frequency[char] === 1) {
            return char
        }
    }

    return null
}

console.log(firstNonRepeatingCharacter("aabbcdde"))
// "c"
```

**Time:** O(n)  
**Space:** O(k), where k is number of distinct characters.

---

## 19. First repeating character

```js
function firstRepeatingCharacter(input) {
    const seen = new Set()

    for (const char of input) {
        if (seen.has(char)) {
            return char
        }

        seen.add(char)
    }

    return null
}

console.log(firstRepeatingCharacter("abcdefca"))
// "c"
```

**Time:** O(n)  
**Space:** O(k)

---

## 20. Find longest word

```js
function longestWord(sentence) {
    const words = sentence.split(/\s+/)

    let longest = ""

    for (const word of words) {
        if (word.length > longest.length) {
            longest = word
        }
    }

    return longest
}

console.log(longestWord(
    "JavaScript is an amazing programming language"
))
// "JavaScript"
```

**Time:** O(n)  
**Space:** O(n) because of `split()`.

---

## 21. Count vowels

```js
function countVowels(input) {
    let count = 0
    const vowels = new Set(["a", "e", "i", "o", "u"])

    for (const char of input.toLowerCase()) {
        if (vowels.has(char)) {
            count++
        }
    }

    return count
}

console.log(countVowels("javascript"))
// 3
```

**Time:** O(n)  
**Space:** O(1) for the fixed vowel set.

---

## 22. Character frequency

```js
function characterFrequency(input) {
    const frequency = {}

    for (const char of input) {
        frequency[char] = (frequency[char] || 0) + 1
    }

    return frequency
}

console.log(characterFrequency("javascript"))
```

**Time:** O(n)  
**Space:** O(k)

---

## 23. Check anagrams

```js
function areAnagrams(a, b) {
    if (a.length !== b.length) {
        return false
    }

    const frequency = {}

    for (const char of a) {
        frequency[char] = (frequency[char] || 0) + 1
    }

    for (const char of b) {
        if (!frequency[char]) {
            return false
        }

        frequency[char]--
    }

    return true
}

console.log(areAnagrams("listen", "silent"))
// true
```

**Time:** O(n)  
**Space:** O(k)

---

## 24. Rotate an array

```js
function rotateArray(numbers, k) {
    const n = numbers.length

    if (n === 0) {
        return numbers
    }

    k = k % n

    return [
        ...numbers.slice(n - k),
        ...numbers.slice(0, n - k)
    ]
}

console.log(rotateArray([1, 2, 3, 4, 5], 2))
// [4, 5, 1, 2, 3]
```

**Time:** O(n)  
**Space:** O(n)

### In-place version

The classic O(1)-extra-space approach uses the array reversal technique:

```js
function rotateInPlace(numbers, k) {
    const n = numbers.length

    if (n === 0) return numbers

    k %= n

    function reverse(left, right) {
        while (left < right) {
            ;[numbers[left], numbers[right]] =
                [numbers[right], numbers[left]]

            left++
            right--
        }
    }

    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)

    return numbers
}
```

---

# 🔴 Level 4 — Recursion & Algorithms

## 25. Factorial

### Recursive

```js
function factorial(n) {
    if (n <= 1) {
        return 1
    }

    return n * factorial(n - 1)
}

console.log(factorial(5))
// 120
```

**Time:** O(n)  
**Space:** O(n) because of recursion stack.

### Iterative

```js
function factorial(n) {
    let result = 1

    for (let i = 2; i <= n; i++) {
        result *= i
    }

    return result
}
```

**Space:** O(1)

---

## 26. Fibonacci

### Basic recursive version

```js
function fibonacci(n) {
    if (n <= 1) {
        return n
    }

    return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(7))
// 13
```

This has approximately **O(2^n)** time complexity.

### Optimized version

```js
function fibonacci(n) {
    if (n <= 1) {
        return n
    }

    let prev = 0
    let current = 1

    for (let i = 2; i <= n; i++) {
        const next = prev + current
        prev = current
        current = next
    }

    return current
}
```

**Time:** O(n)  
**Space:** O(1)

---

## 27. Recursive array sum

```js
function recursiveSum(numbers, index = 0) {
    if (index === numbers.length) {
        return 0
    }

    return numbers[index] + recursiveSum(numbers, index + 1)
}

console.log(recursiveSum([1, 2, 3, 4, 5]))
// 15
```

**Time:** O(n)  
**Space:** O(n) recursion stack.

---

## 28. Recursive reverse string

```js
function reverseString(input) {
    if (input.length <= 1) {
        return input
    }

    return reverseString(input.slice(1)) + input[0]
}

console.log(reverseString("hello"))
// "olleh"
```

**Time:** O(n²) in many JavaScript implementations because strings are repeatedly copied.

---

## 29. Implement Quick Sort

```js
function quickSort(data) {
    if (data.length <= 1) {
        return data
    }

    const pivot = data[data.length - 1]

    const left = []
    const right = []

    for (let i = 0; i < data.length - 1; i++) {
        if (data[i] < pivot) {
            left.push(data[i])
        } else {
            right.push(data[i])
        }
    }

    return [
        ...quickSort(left),
        pivot,
        ...quickSort(right)
    ]
}

console.log(quickSort([5, 2, 8, 1, 9, 3]))
// [1, 2, 3, 5, 8, 9]
```

**Average time:** O(n log n)  
**Worst case:** O(n²)  
**Space:** O(n) for this non-in-place implementation.

### Critical interview point

Always include a base condition:

```js
if (data.length <= 1) return data
```

And don't accidentally put the pivot into the recursive partition.

---

## 30. Binary Search

```js
function binarySearch(numbers, target) {
    let left = 0
    let right = numbers.length - 1

    while (left <= right) {
        const middle = Math.floor((left + right) / 2)

        if (numbers[middle] === target) {
            return middle
        }

        if (numbers[middle] < target) {
            left = middle + 1
        } else {
            right = middle - 1
        }
    }

    return -1
}

console.log(
    binarySearch([1, 3, 5, 7, 9, 11, 15], 9)
)
// 4
```

**Time:** O(log n)  
**Space:** O(1)

### Requirement

Binary search requires the data to be **sorted**.

---

# 🟣 Level 5 — Advanced JavaScript

## 31. Implement debounce

```js
function debounce(fn, delay) {
    let timer

    return function (...args) {
        clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
```

Example:

```js
const search = debounce(() => {
    console.log("API call")
}, 500)

search()
search()
search()
```

Only the final call executes after 500ms of inactivity.

**Common use cases:**

- Search input
- Resize
- Auto-save
- Form validation

---

## 32. Implement throttle

```js
function throttle(fn, delay) {
    let lastCall = 0

    return function (...args) {
        const now = Date.now()

        if (now - lastCall >= delay) {
            lastCall = now
            fn.apply(this, args)
        }
    }
}
```

Example:

```js
window.addEventListener(
    "scroll",
    throttle(handleScroll, 500)
)
```

This allows at most one execution per 500ms.

**Common use cases:**

- Scroll events
- Mouse movement
- Window resize
- Drag events

---

## 33. Implement your own map

```js
Array.prototype.myMap = function (callback) {
    const result = []

    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this))
    }

    return result
}

console.log(
    [1, 2, 3].myMap(x => x * 2)
)
// [2, 4, 6]
```

**Time:** O(n)  
**Space:** O(n)

---

## 34. Implement your own filter

```js
Array.prototype.myFilter = function (callback) {
    const result = []

    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i])
        }
    }

    return result
}

console.log(
    [1, 2, 3, 4].myFilter(x => x % 2 === 0)
)
// [2, 4]
```

---

## 35. Implement your own reduce

```js
Array.prototype.myReduce = function (callback, initialValue) {
    let index = 0
    let accumulator

    if (arguments.length >= 2) {
        accumulator = initialValue
    } else {
        if (this.length === 0) {
            throw new TypeError("Reduce of empty array")
        }

        accumulator = this[0]
        index = 1
    }

    for (; index < this.length; index++) {
        accumulator = callback(
            accumulator,
            this[index],
            index,
            this
        )
    }

    return accumulator
}

console.log(
    [1, 2, 3, 4].myReduce(
        (acc, x) => acc + x,
        0
    )
)
// 10
```

### Important interview point

A proper `reduce` implementation must handle the case where no initial value is supplied.

---

# 🔥 Level 6 — Output-Based Interview Problems

## 36. Output

```js
console.log(a)

var a = 10
```

### Answer

```text
undefined
```

### Why?

`var` declarations are hoisted and initialized with `undefined`.

Conceptually:

```js
var a

console.log(a)

a = 10
```

---

## 37. Output

```js
console.log(a)

let a = 10
```

### Answer

```text
ReferenceError
```

`let` is hoisted but remains in the **Temporal Dead Zone (TDZ)** until execution reaches its declaration.

---

## 38. Output

```js
var x = 10

function test() {
    console.log(x)
    var x = 20
}

test()
```

### Answer

```text
undefined
```

Inside `test`, the local `var x` is hoisted:

```js
function test() {
    var x

    console.log(x)

    x = 20
}
```

The local `x` shadows the outer `x`.

---

## 39. Output

```js
let x = 10

function test() {
    let x = 20

    if (true) {
        let x = 30
        console.log(x)
    }

    console.log(x)
}

test()
```

### Answer

```text
30
20
```

Each `let` is block scoped.

---

## 40. Output

```js
const obj = {
    name: "Venki"
}

const user = obj

user.name = "Raj"

console.log(obj.name)
```

### Answer

```text
Raj
```

Both variables reference the **same object**.

```text
obj  ──────┐
           ↓
        { name: "Raj" }
           ↑
user ──────┘
```

`const` prevents reassignment of the variable; it does not make the object immutable.

---

## 41. Output

```js
const obj = {
    name: "Venki"
}

const user = { ...obj }

user.name = "Raj"

console.log(obj.name)
console.log(user.name)
```

### Answer

```text
Venki
Raj
```

The spread creates a new object.

However, spread is only a **shallow copy**.

---

## 42. Output

```js
console.log("1")

setTimeout(() => {
    console.log("2")
}, 0)

Promise.resolve().then(() => {
    console.log("3")
})

console.log("4")
```

### Answer

```text
1
4
3
2
```

### Execution order

1. Synchronous code
2. Microtasks
3. Macrotasks / timer callbacks

So:

```text
console.log("1")
       ↓
setTimeout → task queue
       ↓
Promise.then → microtask queue
       ↓
console.log("4")
       ↓
microtask → "3"
       ↓
timer → "2"
```

---

## 43. Output

```js
console.log("1")

setTimeout(() => console.log("2"), 0)

queueMicrotask(() => console.log("3"))

Promise.resolve().then(() => console.log("4"))

console.log("5")
```

### Answer

```text
1
5
3
4
2
```

Both `queueMicrotask()` and `Promise.then()` schedule microtasks.

They execute in the order they were queued.

---

# 💀 Level 7 — Senior JavaScript

## 44. Implement Promise.all

```js
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const results = []
        let completed = 0

        if (promises.length === 0) {
            resolve([])
            return
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value
                    completed++

                    if (completed === promises.length) {
                        resolve(results)
                    }
                })
                .catch(reject)
        })
    })
}
```

Example:

```js
promiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
]).then(console.log)

// [1, 2, 3]
```

### Important behavior

`Promise.all()`:

- Resolves when **all** promises resolve.
- Preserves **input order**, not completion order.
- Rejects as soon as one input rejects.
- Accepts normal values too via promise resolution.

**Time:** Depends on the promises; orchestration itself is O(n).  
**Space:** O(n).

---

## 45. Retry failed API calls

```js
async function retry(fn, attempts) {
    let lastError

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error

            if (attempt === attempts) {
                throw lastError
            }
        }
    }
}
```

Usage:

```js
retry(fetchUsers, 3)
    .then(users => {
        console.log(users)
    })
    .catch(error => {
        console.error(error)
    })
```

### Important

This means **3 total attempts**, not 3 retries after the first attempt.

If you want "1 initial attempt + 3 retries", use:

```js
retry(fetchUsers, 4)
```

---

## 46. Limit concurrent API requests

A simple concurrency-limited implementation:

```js
async function processRequests(urls, limit) {
    const results = new Array(urls.length)
    let nextIndex = 0

    async function worker() {
        while (true) {
            const index = nextIndex++

            if (index >= urls.length) {
                return
            }

            results[index] = await fetch(urls[index])
        }
    }

    const workers = []

    for (let i = 0; i < Math.min(limit, urls.length); i++) {
        workers.push(worker())
    }

    await Promise.all(workers)

    return results
}
```

Usage:

```js
processRequests([
    "/api/1",
    "/api/2",
    "/api/3",
    "/api/4",
    "/api/5",
    "/api/6"
], 2)
```

At most **2 requests** are actively running at once.

### Important interview concept

This is different from:

```js
await Promise.all(urls.map(url => fetch(url)))
```

because `Promise.all()` starts everything immediately.

A concurrency limiter controls the number of in-flight operations.

---

## 47. Memoization

```js
function memoize(fn) {
    const cache = new Map()

    return function (...args) {
        const key = JSON.stringify(args)

        if (cache.has(key)) {
            return cache.get(key)
        }

        const result = fn.apply(this, args)

        cache.set(key, result)

        return result
    }
}
```

Example:

```js
const expensive = memoize((a, b) => {
    console.log("calculating...")
    return a + b
})

console.log(expensive(2, 3))
console.log(expensive(2, 3))
console.log(expensive(2, 3))
```

Output:

```text
calculating...
5
5
5
```

### Important

This simple version works well for primitive/JSON-like arguments.

A production-quality memoizer needs to think about:

- Object identity
- `NaN`
- `-0`
- Functions
- Symbols
- Cache size
- Memory leaks

---

## 48. Deep clone

For a robust modern JavaScript environment, prefer:

```js
const clone = structuredClone(original)
```

Example:

```js
const user = {
    name: "Venki",
    address: {
        city: "Hyderabad"
    }
}

const clone = structuredClone(user)

clone.address.city = "Mumbai"

console.log(user.address.city)
// Hyderabad

console.log(clone.address.city)
// Mumbai
```

### Interview implementation

A simplified recursive version:

```js
function deepClone(value) {
    if (value === null || typeof value !== "object") {
        return value
    }

    if (value instanceof Date) {
        return new Date(value)
    }

    if (Array.isArray(value)) {
        return value.map(item => deepClone(item))
    }

    const result = {}

    for (const key of Object.keys(value)) {
        result[key] = deepClone(value[key])
    }

    return result
}
```

### Important limitation

The simplified recursive version does **not** handle circular references.

For example:

```js
const obj = {}
obj.self = obj
```

A production implementation needs a `WeakMap` to track already-cloned objects.

---

## 49. Deep equality

```js
function deepEqual(a, b) {
    if (Object.is(a, b)) {
        return true
    }

    if (
        typeof a !== "object" ||
        typeof b !== "object" ||
        a === null ||
        b === null
    ) {
        return false
    }

    if (Array.isArray(a) !== Array.isArray(b)) {
        return false
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) {
        return false
    }

    for (const key of keysA) {
        if (
            !Object.prototype.hasOwnProperty.call(b, key) ||
            !deepEqual(a[key], b[key])
        ) {
            return false
        }
    }

    return true
}

console.log(
    deepEqual(
        {
            name: "Venki",
            address: { city: "Hyderabad" }
        },
        {
            name: "Venki",
            address: { city: "Hyderabad" }
        }
    )
)
// true
```

### Important

This is a simplified implementation. A fully general deep-equality utility may need special handling for:

- `Date`
- `RegExp`
- `Map`
- `Set`
- Typed arrays
- Symbols
- Circular references
- Property descriptors

---

## 50. Build an EventEmitter

```js
class EventEmitter {
    constructor() {
        this.events = new Map()
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set())
        }

        this.events.get(event).add(callback)

        return () => {
            this.off(event, callback)
        }
    }

    off(event, callback) {
        const listeners = this.events.get(event)

        if (!listeners) {
            return
        }

        listeners.delete(callback)

        if (listeners.size === 0) {
            this.events.delete(event)
        }
    }

    emit(event, ...args) {
        const listeners = this.events.get(event)

        if (!listeners) {
            return
        }

        for (const callback of listeners) {
            callback(...args)
        }
    }

    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper)
            callback(...args)
        }

        this.on(event, wrapper)
    }
}
```

Usage:

```js
const emitter = new EventEmitter()

function handleLogin(user) {
    console.log("User logged in:", user)
}

emitter.on("login", handleLogin)

emitter.emit("login", {
    name: "Venki"
})

emitter.off("login", handleLogin)
```

`once()`:

```js
emitter.once("logout", () => {
    console.log("Logged out once")
})

emitter.emit("logout")
emitter.emit("logout")
```

Output:

```text
Logged out once
```

---

# 🎯 Important Interview Patterns to Master

After solving all 50, make sure you recognize these patterns immediately.

## 1. Frequency Map

Used for:

- Character frequency
- Number frequency
- Anagrams
- Duplicates
- First non-repeating character

Typical pattern:

```js
const frequency = {}

for (const item of data) {
    frequency[item] = (frequency[item] || 0) + 1
}
```

---

## 2. Set

Used for:

- Duplicate detection
- Unique values
- Fast membership checks
- Intersection

```js
const seen = new Set()

if (seen.has(value)) {
    // already exists
}

seen.add(value)
```

---

## 3. Two Pointers

Used for:

- Palindrome
- Sorted arrays
- Array reversal
- Two-sum variants
- Partitioning

Example:

```js
let left = 0
let right = data.length - 1

while (left < right) {
    // ...
    left++
    right--
}
```

---

## 4. Sliding Window

A very important next topic for interviews.

Typical problems:

- Longest substring without repeating characters
- Maximum sum subarray of size K
- Minimum window substring

---

## 5. Recursion

Recognize:

```js
function solve(input) {
    if (baseCondition) {
        return result
    }

    return solve(smallerInput)
}
```

Always identify:

1. Base case
2. Recursive case
3. How the input becomes smaller

---

## 6. Binary Search

Remember:

```text
Sorted data
    ↓
middle
    ↓
target < middle → search left
target > middle → search right
```

Complexity:

```text
O(log n)
```

---

## 7. Debounce vs Throttle

### Debounce

```text
Events:   █ █ █ █ █       █
                     ↓
Execute:              █
```

Wait until events stop.

Good for:

- Search
- Auto-save
- Validation

### Throttle

```text
Events:   █ █ █ █ █ █ █ █ █
Execute:  █       █       █
```

Execute at most once per interval.

Good for:

- Scroll
- Mouse movement
- Resize

---

## 8. Promise / Async Patterns

Know these extremely well for Senior Frontend interviews:

```js
Promise.all()
Promise.allSettled()
Promise.race()
Promise.any()
```

Understand:

- Parallel execution
- Sequential execution
- Error propagation
- Concurrency limiting
- Retry
- Cancellation with `AbortController`

---

# 🚀 Recommended Senior-Level Next Practice

After these 50, practice these specifically:

1. **Longest substring without repeating characters**
2. **Sliding window maximum**
3. **Two Sum / Three Sum**
4. **Merge overlapping intervals**
5. **Valid parentheses**
6. **Implement LRU Cache**
7. **Implement Promise.allSettled**
8. **Implement Promise.race**
9. **Implement async task queue**
10. **Concurrency limiter**
11. **Deep clone with circular references**
12. **Deep equality with circular references**
13. **Debounce with leading/trailing options**
14. **Throttle with leading/trailing options**
15. **Implement `call`, `apply`, and `bind`**
16. **Implement currying**
17. **Implement function composition**
18. **Implement a pub/sub system**
19. **Build an event emitter**
20. **Explain and predict complex event-loop output**

These are particularly useful for a **Senior Frontend Engineer** interview because they test JavaScript fundamentals rather than framework-specific syntax.
