# JS MODULE 5: CLOSURES (Top Interview Topic)

---

## 1. What is a Closure
**Definition:** A **closure** is a function bundled together with references to its **lexical environment** — it "remembers" the variables of the scope where it was **created**, even after that outer scope has finished executing.
```js
function outer() {
  let count = 0;              // lexical variable
  return function inner() {   // closure over `count`
    count++;
    return count;
  };
}
const counter = outer();      // outer() has returned...
counter(); // 1
counter(); // 2  — `count` still alive via closure
```

---

## 2. Why Closures Exist
- A natural consequence of **lexical scoping + first-class functions**.
- Enable **data privacy** (encapsulation), **stateful functions**, **function factories**, and async callbacks that retain context.

---

## 3. Internal Working
When a function is created, it stores a hidden reference (`[[Environment]]`) to its **defining lexical environment**. When that function later runs, its scope chain includes that captured environment — so its variables stay **reachable** and are **not garbage-collected**.
```
outer() runs → creates LE { count: 0 }
inner() created → inner.[[Environment]] = that LE
outer() returns → its EC pops the STACK,
   BUT the LE survives on the HEAP because inner still references it
counter() → walks scope chain → finds count in the captured LE
```
```
   STACK                 HEAP
 (outer popped)   ┌─────────────────────┐
                  │ LE { count: 2 }     │◄── inner.[[Environment]]
 counter() ───────┘  (kept alive)       │
                  └─────────────────────┘
```

---

## 4. Memory Implications
- Closed-over variables **persist in the heap** as long as the closure is reachable → can cause **memory "leaks"** if closures are retained unintentionally (e.g., in long-lived caches, listeners).
- Each closure instance gets its **own** copy of the environment.
```js
function makeCounters() {
  return [outer(), outer()];   // two independent counts
}
```
**Cleanup:** remove references (null out, remove listeners) so the GC can reclaim the captured environment.

---

## 5. Real-World Examples

### (a) Data Privacy (encapsulation / module pattern)
```js
function createBankAccount(balance) {
  return {
    deposit: (n) => (balance += n),
    withdraw: (n) => (balance -= n),
    getBalance: () => balance,   // balance is PRIVATE — no outside access
  };
}
const acc = createBankAccount(100);
acc.deposit(50); acc.getBalance(); // 150
// acc.balance → undefined (truly private)
```

### (b) Memoization (cache via closure)
```js
function memoize(fn) {
  const cache = new Map();          // private cache (closure)
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
const slowSquare = (n) => n * n;
const fast = memoize(slowSquare);
```

### (c) Debounce (delay until idle)
```js
function debounce(fn, delay) {
  let timer;                        // closure variable persists across calls
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onSearch = debounce(query => api(query), 300);
```

### (d) Throttle (max once per interval)
```js
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
const onScroll = throttle(handler, 200);
```

### (e) Module Pattern (IIFE + closure)
```js
const counter = (function () {
  let count = 0;                    // private
  return { inc: () => ++count, get: () => count };
})();
```

---

## 6. The Classic Loop Trap (most-asked)
```js
// ❌ var — all log 3 (shared single binding)
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);  // 3 3 3

// ✅ let — block scope creates a NEW binding per iteration
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);  // 0 1 2

// ✅ var fix with IIFE closure
for (var i = 0; i < 3; i++) ((j) => setTimeout(() => console.log(j), 0))(i); // 0 1 2
```
**Why:** `var` has one function-scoped `i` shared by all callbacks (=3 after loop). `let` creates a fresh binding each iteration captured by each closure.

---

## 7. Best Practices / Mistakes / Performance
**Best practices:** use closures for privacy/factories/memo/debounce; null references when done; prefer `let` in loops.
**Mistakes:** the var-loop trap; unintended retention (huge objects captured) → leaks; creating closures in hot loops unnecessarily.
**Performance:** closures are cheap but retained memory matters; avoid capturing large structures you don't need; engines optimize but can't free captured-and-reachable memory.

---

## INTERVIEW QUESTIONS
**🟢:** What is a closure? · Give a real use case. · Why do closures keep variables alive?
**🟡:** Implement debounce/throttle/memoize. · Explain the var-loop trap + fix. · How do closures enable data privacy?
**🔴:** Internal working ([[Environment]], heap retention). · Memory leak via closures — how/avoid. · Each closure has its own environment — prove it. · Closures + event loop (loop trap internals).
**🧩:** Build a private counter / once() function. · Debug a leak from retained closures. · Predict loop+setTimeout output (var vs let). · Module pattern from scratch.

**Output prediction:**
```js
function fn() {
  let arr = [];
  for (var i = 0; i < 3; i++) arr.push(() => i);
  return arr;
}
console.log(fn().map(f => f()));   // [3, 3, 3]

let add = (function () { let n = 0; return () => ++n; })();
console.log(add(), add(), add());  // 1 2 3
```

## ⚡ REVISION
- Closure = function + its captured lexical environment (remembers outer vars after outer returns).
- Mechanism: function stores `[[Environment]]`; captured LE lives on heap while closure reachable.
- Uses: privacy, memoization, debounce, throttle, module pattern, factories.
- var-loop trap → use `let` (fresh binding per iteration) or IIFE.
- Watch memory: closures retain captured vars until unreachable.

➡️ Next: **Module 6 — `this` keyword.**
