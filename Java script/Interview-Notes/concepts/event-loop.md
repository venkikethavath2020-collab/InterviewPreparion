# Event Loop (Microtasks vs Macrotasks)

## Definition

The **event loop** is the mechanism that lets single-threaded JavaScript perform non-blocking asynchronous work. It coordinates the **call stack**, **Web APIs**, the **microtask queue**, and the **macrotask (callback) queue**.

## Why It Exists

JavaScript runs on a single thread. To stay responsive while waiting on timers, network requests, and I/O, async callbacks are offloaded and later scheduled back onto the stack — instead of blocking.

## Internal Working

Building blocks:

1. **Call Stack** — tracks currently executing function calls (LIFO).
2. **Web APIs** — browser/Node features (`setTimeout`, `fetch`, DOM events) that run work off-thread.
3. **Macrotask Queue** (a.k.a. callback/task queue) — `setTimeout`, `setInterval`, I/O, UI events, `setImmediate` (Node).
4. **Microtask Queue** — Promise reactions (`.then/.catch/.finally`), `queueMicrotask`, `MutationObserver`. **Higher priority.**
5. **Event Loop** — when the stack is empty: drain **all** microtasks, then run **one** macrotask, then repeat.

### The Loop Cycle
```text
1. Run the current script to completion (call stack empties).
2. Drain the ENTIRE microtask queue.
3. Take ONE macrotask, run it.
4. Drain the ENTIRE microtask queue again.
5. (Render, in browsers.)
6. Repeat.
```

## Example

```js
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");          // macrotask
  Promise.resolve().then(() =>
    console.log("Promise inside timeout")   // microtask, runs right after the timeout body
  );
}, 0);

Promise.resolve().then(() => console.log("Promise callback")); // microtask

console.log("End");
```

**Output:**
```text
Start
End
Promise callback          ← microtasks drain before any macrotask
Timeout callback
Promise inside timeout
```

## Interview Explanation

> "JavaScript is single-threaded with a call stack. Async callbacks go to queues. The event loop empties the entire microtask queue before taking the next macrotask. So Promise callbacks always run before `setTimeout` callbacks, even with a 0ms delay."

## Microtasks vs Macrotasks

| | Microtasks | Macrotasks |
|---|---|---|
| Sources | Promises, `queueMicrotask`, MutationObserver | `setTimeout`, `setInterval`, I/O, UI events |
| Priority | Higher — drained fully first | One per loop iteration |
| Risk | Starvation if they keep enqueuing more | Long tasks block rendering (jank) |

## Real-world Use Cases

* Knowing Promise resolutions run before timers.
* Chunking long work with `setTimeout`/`requestIdleCallback` to avoid blocking the UI.
* `requestAnimationFrame` for animations (runs before paint).

## Common Mistakes

* Assuming `setTimeout(fn, 0)` runs immediately — it waits behind all microtasks.
* Blocking the main thread with a long synchronous loop (freezes the UI).
* Creating infinite microtask chains → **starvation** of macrotasks/rendering.

## Interview Questions

1. Explain the event loop.
2. Predict the output of mixed `setTimeout` + `Promise` code.
3. Difference between microtasks and macrotasks.
4. What is starvation?

## Senior-Level Discussion

* **Node's event loop has phases**: timers → pending callbacks → poll → check (`setImmediate`) → close. `process.nextTick` jumps ahead of even the microtask queue.
* Browsers interleave rendering between macrotasks but not between microtasks.
* Use Web Workers for CPU-bound work to keep the main thread free.

## Key Takeaways

* Single thread + queues + event loop = non-blocking async.
* Microtasks drain completely before the next macrotask.
* Long sync work and microtask floods both harm responsiveness.

Related: [promises](./promises.md), [async-await](./async-await.md), [callbacks](./callbacks.md).
