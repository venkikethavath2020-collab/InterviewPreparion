# JS MODULE 11: EVENT LOOP (MOST IMPORTANT)
> The #1 output-prediction topic. Master microtask vs macrotask ordering.

---

## 1. The Problem It Solves
JS is **single-threaded** (one call stack). Yet it handles async (timers, network, events) **without blocking**. The **event loop** + **queues** + **host APIs** make this possible.

---

## 2. The Architecture (Browser)
```
        ┌──────────────┐
        │  Call Stack  │  ← runs JS (one frame at a time)
        └──────┬───────┘
               │ calls async API
        ┌──────▼───────┐
        │   Web APIs   │  ← setTimeout, fetch, DOM events, timers (browser-provided)
        └──────┬───────┘  (run OUTSIDE the stack; on completion, queue a callback)
               │
   ┌───────────┴────────────┐
   ▼                        ▼
┌─────────────────┐   ┌─────────────────────┐
│ Macrotask Queue │   │  Microtask Queue    │
│ (Task Queue):   │   │ Promises (.then),   │
│ setTimeout,     │   │ queueMicrotask,     │
│ setInterval,    │   │ MutationObserver,   │
│ I/O, UI events  │   │ async/await cont.   │
└────────┬────────┘   └──────────┬──────────┘
         │                       │
         └────────►  EVENT LOOP  ◄┘
   "When stack is empty: drain ALL microtasks, then take ONE macrotask, repeat."
```

---

## 3. The Event Loop Algorithm (memorize)
```
loop forever:
  1. Run all synchronous code (until call stack empty)
  2. Drain the ENTIRE microtask queue (run microtasks until empty —
     including new ones added during draining)
  3. (Browser) render/paint if needed
  4. Take ONE macrotask from the task queue → run it
  5. Go to step 2 (drain microtasks again)
```
**Golden rule:** **Microtasks have higher priority** — the queue is **fully drained** after each macrotask (and after the initial sync run). One macrotask runs per "tick," then all microtasks.

---

## 4. Macrotask vs Microtask
| | Macrotask (Task) | Microtask |
|---|------------------|-----------|
| Examples | `setTimeout`, `setInterval`, `setImmediate`(Node), I/O, UI events, `MessageChannel` | Promise `.then/.catch/.finally`, `await` continuation, `queueMicrotask`, `MutationObserver` |
| Priority | Lower | **Higher** |
| Drained | **One per tick** | **All, after each macrotask** |

---

## 5. The APIs

**`setTimeout(fn, 0)`** → schedules a **macrotask**; min delay clamped (~4ms in browsers after nesting); runs after sync + all microtasks.
**`setInterval`** → repeated macrotasks (beware drift + pile-up if handler is slow).
**`Promise.then`** → **microtask**.
**`async/await`** → everything after `await` is a **microtask** (continuation).
**`queueMicrotask(fn)`** → explicitly schedule a microtask.
**`MutationObserver`** → microtask (fires after DOM changes).
**`requestAnimationFrame`** → runs before next paint (special render-phase callback, not a normal macro/microtask).

---

## 6. THE MASTER OUTPUT-PREDICTION PROBLEM
```js
console.log('1 - sync start');

setTimeout(() => console.log('2 - setTimeout'), 0);

Promise.resolve().then(() => console.log('3 - promise'));

queueMicrotask(() => console.log('4 - queueMicrotask'));

(async () => {
  console.log('5 - async start');
  await null;
  console.log('6 - after await');
})();

console.log('7 - sync end');
```
**Trace:**
```
SYNC: 1, 5 (sync part of async fn), 7
DRAIN MICROTASKS (in order queued): 3, 4, 6
MACROTASK: 2
```
**Output:** `1, 5, 7, 3, 4, 6, 2`
(Microtasks 3,4,6 all run before the setTimeout macrotask.)

---

## 7. Tricky Examples

**A — microtasks added during draining still run before next macrotask:**
```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => {
  console.log('p1');
  Promise.resolve().then(() => console.log('p2'));  // added during drain
});
// Output: p1, p2, timeout  (queue fully drained incl. new microtasks)
```

**B — nested timers + promises:**
```js
console.log('A');
setTimeout(() => {
  console.log('B');
  Promise.resolve().then(() => console.log('C'));
}, 0);
setTimeout(() => console.log('D'), 0);
Promise.resolve().then(() => console.log('E'));
console.log('F');
// A, F, E, B, C, D
// (sync A,F → micro E → macro B → its micro C → macro D)
```

**C — await ordering:**
```js
async function f() {
  console.log('1');
  await console.log('2');   // '2' runs sync; rest is microtask
  console.log('3');
}
console.log('0'); f(); console.log('4');
// 0, 1, 2, 4, 3
```

---

## 8. Node.js Event Loop (differs — see Node notes)
Node uses **libuv** with phases (timers → pending → poll → check(setImmediate) → close) + `process.nextTick` (runs before promise microtasks). Browser has a simpler micro/macro model. Key Node-only: `setImmediate`, `process.nextTick`.

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** don't block the stack (chunk heavy work, use `setTimeout`/`requestIdleCallback`/workers); understand micro>macro for ordering; avoid microtask floods.
**Mistakes:** assuming `setTimeout(0)` runs immediately; expecting promises after timers; infinite microtask loops (starves rendering/macrotasks); blocking the main thread (jank).
**Performance:** long sync tasks block UI (use Web Workers for CPU work); microtask starvation freezes rendering; batch DOM updates.

---

## INTERVIEW QUESTIONS
**🟢:** What is the event loop? · Micro vs macrotask? · Is `setTimeout(0)` immediate?
**🟡:** Order of sync/promise/setTimeout? · What's a microtask (examples)? · Why is JS non-blocking on one thread? · queueMicrotask vs setTimeout?
**🔴:** Full event loop algorithm. · Why do microtasks added during draining still run first? · async/await → microtask mapping. · requestAnimationFrame timing. · Browser vs Node event loop.
**🧩:** Predict complex mixed output. · UI freezes during heavy loop — fix (chunk/worker). · Promise never resolves but timer fires — explain. · Microtask infinite loop starves the page.

## ⚡ REVISION
- Single thread + stack; Web APIs run async work; callbacks go to queues.
- **Loop:** run sync → drain ALL microtasks → 1 macrotask → drain microtasks → repeat.
- Microtasks (Promise/.then, await, queueMicrotask, MutationObserver) > Macrotasks (setTimeout/interval, I/O, events).
- `setTimeout(0)` ≠ immediate (after sync + microtasks).
- Don't block the stack; don't starve with microtask floods.

➡️ Next: **Module 12 — Promises.**
