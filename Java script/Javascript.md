Below is a **clean JavaScript Interview Reference `.md` file** you can save as:

```
javascript-interview-notes.md
```

It contains **core + advanced JS concepts commonly asked in frontend interviews (especially for 5+ years experience)**.

---

# JavaScript Interview Reference Guide

## Table of Contents

1. Execution Context
2. Call Stack
3. Hoisting
4. Scope & Lexical Environment
5. Closures
6. `this` Keyword
7. Prototypes & Inheritance
8. Event Loop
9. Promises
10. Async / Await
11. Microtasks vs Macrotasks
12. Debounce & Throttle
13. Currying
14. Memoization
15. Shallow vs Deep Copy
16. Map vs Set
17. WeakMap vs WeakSet
18. Modules
19. Memory Management
20. Common Interview Coding Patterns

---

# 1. Execution Context

Execution context is the environment where JavaScript code is executed.

Types:

* Global Execution Context
* Function Execution Context
* Eval Execution Context

Execution phases:

1. Memory Creation Phase
2. Execution Phase

Example:

```js
var a = 10

function test() {
  var b = 20
}

test()
```

---

# 2. Call Stack

Call stack tracks function execution order.

Example:

```js
function one() {
  two()
}

function two() {
  console.log("Hello")
}

one()
```

Call stack:

```
one()
two()
console.log()
```

---

# 3. Hoisting

JavaScript moves variable and function declarations to the top of scope.

Example:

```js
console.log(a)

var a = 10
```

Internally:

```js
var a
console.log(a)
a = 10
```

Output:

```
undefined
```

Function hoisting:

```js
sayHello()

function sayHello() {
  console.log("Hello")
}
```

---

# 4. Scope & Lexical Environment

Scope determines variable accessibility.

Types:

* Global scope
* Function scope
* Block scope

Example:

```js
function outer() {
  let a = 10

  function inner() {
    console.log(a)
  }

  inner()
}
```

This is **lexical scoping**.

---

# 5. Closures

Closure = function + its lexical environment.

Example:

```js
function counter() {
  let count = 0

  return function () {
    count++
    console.log(count)
  }
}

const inc = counter()

inc()
inc()
```

Output:

```
1
2
```

Use cases:

* data privacy
* function factories
* React hooks / Vue composables

---

# 6. `this` Keyword

`this` refers to the object calling the function.

Example:

```js
const obj = {
  name: "Venki",
  greet() {
    console.log(this.name)
  }
}

obj.greet()
```

Arrow function difference:

```js
const obj = {
  name: "Venki",
  greet: () => {
    console.log(this.name)
  }
}
```

Arrow functions **do not bind their own `this`**.

---

# 7. Prototypes & Inheritance

Every JS object has a prototype.

Example:

```js
function Person(name) {
  this.name = name
}

Person.prototype.sayHi = function () {
  console.log("Hi " + this.name)
}

const p = new Person("Ada")
p.sayHi()
```

Prototype chain:

```
object → prototype → Object.prototype → null
```

---

# 8. Event Loop

JavaScript is **single-threaded**.

Event loop manages async operations.

Flow:

```
Call Stack
↓
Web APIs
↓
Callback Queue
↓
Event Loop
```

Example:

```js
console.log("start")

setTimeout(() => {
  console.log("timeout")
}, 0)

console.log("end")
```

Output:

```
start
end
timeout
```

---

# 9. Promises

Promise represents future completion of async operation.

States:

* pending
* fulfilled
* rejected

Example:

```js
const promise = new Promise((resolve, reject) => {
  resolve("done")
})

promise.then(res => console.log(res))
```

---

# 10. Async / Await

Async/await simplifies promise handling.

Example:

```js
async function getUser() {
  const res = await fetch("/api/user")
  const data = await res.json()
  return data
}
```

---

# 11. Microtasks vs Macrotasks

Microtasks:

* Promise
* queueMicrotask
* MutationObserver

Macrotasks:

* setTimeout
* setInterval
* setImmediate

Example:

```js
console.log("start")

setTimeout(() => console.log("timeout"))

Promise.resolve().then(() => console.log("promise"))

console.log("end")
```

Output:

```
start
end
promise
timeout
```

---

# 12. Debounce

Debounce delays execution until user stops triggering.

Example:

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

Use cases:

* search input
* resize events

---

# 13. Throttle

Throttle ensures function runs once in given time.

Example:

```js
function throttle(fn, limit) {
  let flag = true

  return function () {
    if (!flag) return

    fn()
    flag = false

    setTimeout(() => {
      flag = true
    }, limit)
  }
}
```

---

# 14. Currying

Currying transforms function arguments.

Example:

```js
function multiply(a) {
  return function (b) {
    return a * b
  }
}

multiply(2)(3)
```

Output:

```
6
```

---

# 15. Shallow vs Deep Copy

Shallow copy:

```js
const obj2 = { ...obj1 }
```

Deep copy:

```js
const obj2 = JSON.parse(JSON.stringify(obj1))
```

Better:

```
structuredClone()
```

---

# 16. Map vs Set

Map:

* key-value pairs
* keys can be any type

Example:

```js
const map = new Map()

map.set("name", "Venki")
```

Set:

* unique values

Example:

```js
const set = new Set([1,2,3])
```

---

# 17. WeakMap vs WeakSet

Weak collections allow **garbage collection**.

Example:

```js
const wm = new WeakMap()

wm.set(obj, "data")
```

Used for:

* caching
* private data

---

# 18. Modules

JavaScript supports ES Modules.

Export:

```js
export function add(a,b) {
  return a + b
}
```

Import:

```js
import { add } from "./math.js"
```

---

# 19. Memory Management

Memory lifecycle:

```
allocate memory
use memory
release memory
```

Garbage collector removes unused objects.

Common leaks:

* global variables
* event listeners
* closures

---

# 20. Common Coding Interview Patterns

### Remove duplicates

```js
[...new Set(arr)]
```

---

### Flatten array

```js
arr.flat(Infinity)
```

---

### Deep clone

```js
structuredClone(obj)
```

---

### Reverse string

```js
str.split("").reverse().join("")
```

---

# Senior JS Interview Tip

Senior frontend interviews usually test:

* closures
* event loop
* promises
* prototype chain
* async race conditions
* debounce/throttle
* memory leaks

If you master these topics, you can handle **most JavaScript interviews**.

---

If you want, I can also generate a **"Senior Frontend Interview Master Notes.md"** that includes:

* JavaScript
* Vue
* System design
* Performance
* Testing
* Browser internals

This becomes a **complete 5–10 year frontend interview handbook.**
