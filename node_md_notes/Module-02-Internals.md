# MODULE 2: NODE.JS INTERNALS (Event Loop Deep Dive)
> The single most-tested topic in Node interviews. Master output prediction.

---

## 1. Call Stack

**Definition:** A LIFO (Last-In-First-Out) data structure that tracks **function execution**. When a function is called, a **stack frame** is pushed; when it returns, it's popped. JS has **one call stack** (single-threaded).

```
function a(){ b(); }
function b(){ c(); }
function c(){ console.log('hi'); }
a();

Stack grows:        then unwinds:
│ c() │             │      │
│ b() │   ──►       │      │
│ a() │             │      │
└─────┘             └──────┘
```

**Why it exists:** To remember "where to return to" after each call.

**Stack Overflow:** Infinite/too-deep recursion exceeds the stack size → `RangeError: Maximum call stack size exceeded`.

**Interview Qs:**
- *What is the call stack?* → LIFO structure tracking function calls; one per thread.
- *What causes stack overflow?* → Too-deep/infinite recursion. Fix with base cases, iteration, or trampolining.
- *Where do async callbacks run?* → NOT directly on the stack from the timer — they're queued and pushed onto an **empty** stack later by the event loop.

---

## 2. Heap Memory

**Definition:** An unstructured region of memory where **objects, closures, arrays, strings** (reference types) are stored. The call stack holds **primitives + references (pointers)** into the heap.

```
Stack                  Heap
─────                  ────
x = 5     (primitive)
obj ──────────────►  { name: 'A', data: [...] }
```

**Why:** Objects have dynamic size/lifetime; they can't live on the fixed-size stack.

**GC:** V8's garbage collector reclaims heap objects no longer reachable (Module 7).

**Interview Q:** *Stack vs heap?* → Stack: primitives + references, fast, auto-freed on return, fixed size. Heap: objects, slower, GC-managed, large.

---

## 3. Execution Context

**Definition:** The environment in which JS code is evaluated. Types:
- **Global EC** — created once at start (`global`/`globalThis`, `this`).
- **Function EC** — created on each function call.
- **(eval EC)** — rare.

Each EC has two phases:
1. **Creation phase:** hoisting (`var`→`undefined`, functions fully hoisted, `let/const`→TDZ), `this` binding, scope chain set up.
2. **Execution phase:** code runs line by line, assignments happen.

```js
console.log(x); // undefined (hoisted), not error
var x = 10;
console.log(y); // ReferenceError (TDZ)
let y = 20;
```

**Interview Qs:** *What is hoisting?* → Declarations moved to top of scope during creation phase. *TDZ?* → Temporal Dead Zone: `let/const` exist but are unreachable until declared. *What's in an EC?* → Variable environment, scope chain, `this`.

---

## 4. The Event Loop (The Heart of Node)

**Definition:** A C (libuv) loop that continuously checks queues and runs callbacks when the call stack is empty, enabling async behavior on a single thread.

### The 6 Phases (in order, each a FIFO callback queue)
```
   ┌───────────────────────────────────────────┐
┌─►│  1. TIMERS                                 │  setTimeout, setInterval callbacks
│  ├───────────────────────────────────────────┤
│  │  2. PENDING CALLBACKS                      │  some system/TCP error callbacks
│  ├───────────────────────────────────────────┤
│  │  3. IDLE / PREPARE (internal use)          │
│  ├───────────────────────────────────────────┤
│  │  4. POLL                                   │  retrieve I/O events; run I/O callbacks
│  │     - calculates how long to block         │  (fs reads, incoming connections)
│  ├───────────────────────────────────────────┤
│  │  5. CHECK                                  │  setImmediate callbacks
│  ├───────────────────────────────────────────┤
│  │  6. CLOSE CALLBACKS                        │  socket.on('close'), etc.
└──┴───────────────────────────────────────────┘

  ⚡ BETWEEN EVERY PHASE (and between each callback in Node ≥11):
     drain process.nextTick queue, then microtask (Promise) queue
```

### Phase Details
| Phase | Handles | Notes |
|-------|---------|-------|
| **Timers** | `setTimeout`, `setInterval` | Runs callbacks whose threshold elapsed |
| **Pending** | Deferred system callbacks | e.g., some TCP errors (ECONNREFUSED) |
| **Poll** | I/O callbacks (fs, network) | Blocks here waiting for I/O if no timers; **most work happens here** |
| **Check** | `setImmediate` | Designed to run right after poll |
| **Close** | `'close'` events | Cleanup |

**Why two queue types?** Macrotasks (timers, I/O, setImmediate) are processed phase-by-phase. Microtasks (`nextTick`, Promises) are drained **completely** after each macrotask and between phases — they have **higher priority**.

---

## 5. Queues: Macrotask vs Microtask

| | Macrotask (Task) Queue | Microtask Queue |
|---|------------------------|-----------------|
| Examples | `setTimeout`, `setImmediate`, I/O, `setInterval` | Promises (`.then`), `queueMicrotask`, `process.nextTick`* |
| When drained | One per loop tick (per phase) | **Entirely**, after each macrotask & between phases |
| Priority | Lower | Higher |

> *`process.nextTick` is technically **its own queue**, drained **before** the Promise microtask queue.*

**Priority order between callbacks:**
```
process.nextTick queue   ← highest
Promise microtask queue
then next macrotask phase ← lowest
```

---

## 6. `process.nextTick()`

**Definition:** Schedules a callback to run **immediately after the current operation**, **before** the event loop continues and **before** Promise microtasks.

**Why it exists:** Allows an API to run a callback after the current JS finishes but before any I/O — e.g., to emit events asynchronously yet ASAP, or to let the caller attach listeners first.

**Danger:** Recursive `process.nextTick` **starves the event loop** — I/O never runs.

```js
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('sync');
// Output: sync → nextTick → promise
```

**Interview Q:** *nextTick vs Promise.then ordering?* → nextTick queue drains before the Promise queue. *Why is nextTick dangerous?* → Can starve I/O if recursive.

---

## 7. `setImmediate()` vs `setTimeout()` vs `setInterval`

- **`setImmediate(cb)`** → runs in the **check** phase (after poll).
- **`setTimeout(cb, 0)`** → runs in the **timers** phase (next iteration), min delay ~1ms.
- **`setInterval`** → repeated timers-phase callbacks.

**Tricky:** In the **main module**, `setTimeout(0)` vs `setImmediate` order is **non-deterministic** (depends on process startup timing):
```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// Order varies! Could be timeout→immediate OR immediate→timeout
```
**But inside an I/O callback, `setImmediate` ALWAYS runs first** (because we're already past poll, check is next):
```js
fs.readFile('x', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// ALWAYS: immediate → timeout
```

---

## 8. Promise Queue & Async/Await Internals

**Promises** resolve into the **microtask queue**. `async/await` is **syntactic sugar** over Promises — `await` pauses the async function and schedules the continuation as a **microtask** when the awaited Promise settles.

```js
async function f() {
  console.log('A');
  await null;          // pauses, rest becomes a microtask
  console.log('B');
}
console.log('start');
f();
console.log('end');
// start → A → end → B
```

Everything **after** an `await` runs as a microtask — same priority as `.then`.

---

## 9. THE MASTER OUTPUT-PREDICTION PROBLEM

```js
console.log('1 - start');

setTimeout(() => console.log('2 - setTimeout'), 0);

setImmediate(() => console.log('3 - setImmediate'));

Promise.resolve().then(() => console.log('4 - promise'));

process.nextTick(() => console.log('5 - nextTick'));

(async () => {
  console.log('6 - async start');
  await null;
  console.log('7 - after await');
})();

console.log('8 - end');
```

**Execution trace:**
```
SYNC PHASE (run top-to-bottom):
  1 - start
  6 - async start   (sync part of the async fn)
  8 - end

DRAIN nextTick queue:
  5 - nextTick

DRAIN microtask (Promise) queue:
  4 - promise
  7 - after await

EVENT LOOP — timers phase:
  2 - setTimeout

EVENT LOOP — check phase:
  3 - setImmediate
```
**Final order:** `1, 6, 8, 5, 4, 7, 2, 3`
*(2 and 3 order is stable here only because both are scheduled from the main module before the loop starts — typically timeout first, but can vary; nextTick & promises ALWAYS beat both.)*

---

## 10. Tricky Examples

**Example A — nested:**
```js
setTimeout(() => {
  console.log('timeout1');
  Promise.resolve().then(() => console.log('promise in timeout'));
}, 0);
setTimeout(() => console.log('timeout2'), 0);
// Output: timeout1, promise in timeout, timeout2
// (microtasks drain BETWEEN the two timer callbacks in Node ≥11)
```

**Example B — nextTick starvation:**
```js
let i = 0;
function loop() {
  if (i++ < 3) process.nextTick(loop);
  console.log('tick', i);
}
loop();
console.log('sync done');
// sync done is delayed? No — loop() runs sync first, then nextTicks drain before any I/O
```

---

## PRACTICE QUESTIONS

**🟢 Beginner:** What is the call stack? · Stack vs heap? · What is the event loop? · Name the 6 phases. · macrotask vs microtask? · What is hoisting/TDZ?

**🟡 Intermediate:** nextTick vs setImmediate vs setTimeout? · Why is setTimeout(0) vs setImmediate non-deterministic in main but deterministic in I/O? · How does async/await map to the queues? · What drains between phases?

**🔴 Advanced:** How can nextTick starve the loop? · Explain the poll phase blocking calculation. · Why is microtask draining "between each callback" a Node 11+ change? · Trace a complex mixed example.

**🧩 Scenario:** Predict output of mixed timer/promise/nextTick code · A library's callback fires "too early/late" — explain via nextTick vs setImmediate · CPU loop blocks timers — why don't your setTimeouts fire on time?

---

## ⚡ REVISION
- **Phases:** Timers → Pending → Poll → Check(setImmediate) → Close.
- **Priority:** sync → nextTick → Promises → macrotask phase.
- **Microtasks drain fully between every callback (Node ≥11).**
- **In I/O callbacks, setImmediate beats setTimeout(0).**
- **nextTick > Promise > setTimeout/setImmediate.**

➡️ Next: **Module 3 — Module System.**
