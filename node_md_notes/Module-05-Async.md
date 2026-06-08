# MODULE 5: ASYNCHRONOUS PROGRAMMING

---

## 1. Callbacks
**Definition:** A function passed to another function, called when work completes. Node uses the **error-first** convention: `(err, result) => {}`.
**Why:** Async I/O can't return a value immediately, so it calls you back.
```js
fs.readFile('a.txt', (err, data) => {
  if (err) return handle(err);   // ALWAYS check err first
  use(data);
});
```
**Event loop interaction:** The callback is queued by libuv and run by the event loop when the stack is empty (poll/timers phase).
**Mistakes:** Forgetting `return` after `if (err)`; calling a callback twice; throwing inside an async callback (uncatchable by outer try/catch).

---

## 2. Callback Hell
**Definition:** Deeply nested callbacks ("pyramid of doom") → unreadable, hard to error-handle.
```js
getUser(id, (e, u) => {
  getOrders(u, (e, o) => {
    getDetails(o, (e, d) => { /* 3 levels deep, 3× error handling */ });
  });
});
```
**Fixes:** Named functions, modularization, **Promises**, **async/await**, control-flow libs.

---

## 3. Promises
**Definition:** An object representing the eventual result of an async operation. States: **pending → fulfilled / rejected** (settles once, immutable).
```
        ┌─────────┐
        │ pending │
        └────┬────┘
     resolve │ reject
      ┌──────┴──────┐
      ▼             ▼
 ┌──────────┐  ┌──────────┐
 │fulfilled │  │ rejected │   (settled — cannot change)
 └──────────┘  └──────────┘
```
```js
const p = new Promise((resolve, reject) => {
  doAsync((err, res) => err ? reject(err) : resolve(res));
});
p.then(onFulfilled).catch(onError).finally(cleanup);
```
**Event loop:** `.then/.catch` callbacks run in the **microtask queue** (higher priority than timers/I/O).

---

## 4. Promise Chaining
Each `.then` returns a **new Promise**, enabling flat sequential flows. Returning a value passes it on; returning a Promise waits for it.
```js
getUser(id)
  .then(u => getOrders(u))     // flattened, not nested
  .then(o => getDetails(o))
  .then(d => render(d))
  .catch(err => handle(err));  // one catch handles the whole chain
```
**Mistake:** Not returning inside `.then` → broken chain / unhandled values. Nesting `.then` inside `.then` (anti-pattern).

---

## 5. Promise Internals
- A Promise stores state + value + callback queues.
- `.then` registers callbacks; when settled, they're scheduled as **microtasks**.
- **Thenable:** any object with a `.then` method — `await`/`Promise.resolve` adopt it.
- **Microtask checkpoint:** after each macrotask, all queued microtasks (Promise reactions) run to completion before the next macrotask.
- Unhandled rejection → `unhandledRejection` event (in Node 15+ it **crashes** the process by default).

---

## 6. Async/Await
**Definition:** Syntactic sugar over Promises. `async` functions **always return a Promise**; `await` pauses until the awaited Promise settles, then resumes (continuation = microtask).
```js
async function flow(id) {
  try {
    const u = await getUser(id);
    const o = await getOrders(u);   // sequential
    return o;
  } catch (err) {                   // catches ANY await rejection
    handle(err);
  }
}
```
**Key:** `await` only pauses the **current** async function, not the whole program — the event loop keeps running.

**Sequential vs parallel:**
```js
// ❌ Sequential (slow) — 3× latency
const a = await fetchA(); const b = await fetchB(); const c = await fetchC();
// ✅ Parallel — max(latency)
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
```

---

## 7. Promise Combinators

| Method | Resolves when | Rejects when | Returns |
|--------|---------------|--------------|---------|
| **`Promise.all`** | ALL fulfill | ANY rejects (fail-fast) | array of values |
| **`Promise.allSettled`** | ALL settle | never rejects | array of `{status, value/reason}` |
| **`Promise.race`** | first **settles** (fulfill OR reject) | first rejects | first settled |
| **`Promise.any`** | first **fulfills** | ALL reject (`AggregateError`) | first fulfilled |

```js
await Promise.all([a, b]);          // all-or-nothing
await Promise.allSettled([a, b]);   // want every result even on failure
await Promise.race([fetch(x), timeout(5000)]);   // timeout pattern
await Promise.any([mirror1, mirror2, mirror3]);  // first success wins
```
**Interview gold:** `race` settles on first **settle** (incl. reject); `any` waits for first **fulfill**. `all` is fail-fast; `allSettled` never rejects.

---

## 8. Error Handling

```js
// Callbacks: error-first
fn((err, res) => { if (err) ... });

// Promises: .catch
p.then(...).catch(...);

// async/await: try/catch
try { await ... } catch (e) { ... }

// Parallel with partial failures:
const results = await Promise.allSettled(tasks);
results.filter(r => r.status === 'rejected').forEach(...);
```
**Global safety nets (last resort):**
```js
process.on('unhandledRejection', (reason) => { log(reason); /* maybe exit */ });
process.on('uncaughtException', (err) => { log(err); process.exit(1); }); // don't keep running
```
**Mistakes:** Mixing callbacks + promises; forgetting `await` (returns a pending Promise); swallowing errors (empty catch); `try/catch` around a non-awaited Promise (won't catch it).

---

## 9. Event Loop Interaction Summary
```
sync code → process.nextTick → Promise microtasks → timers/setImmediate/I/O (macrotasks)
```
- `.then`, `await` continuations, `queueMicrotask` → **microtasks** (drained fully each tick).
- `setTimeout`, `setImmediate`, I/O callbacks → **macrotasks** (one phase at a time).
- A flood of microtasks can starve I/O (similar to nextTick starvation).

---

## PRACTICE QUESTIONS
**🟢:** What is a callback / error-first convention? · Promise states? · async returns what? · all vs race?
**🟡:** Chaining vs nesting? · Sequential vs parallel awaits? · all vs allSettled vs race vs any (table)? · Where do .then callbacks run (microtask)?
**🔴:** How does await map to microtasks? · What is a thenable? · unhandledRejection behavior across Node versions? · Implement promisify / a simple Promise.
**🧩:** 3 API calls, need all results even if some fail → allSettled. · Add a 5s timeout to a fetch → race. · Query 3 mirrors, use fastest success → any. · Convert callback-hell code to async/await.

## ⚡ REVISION
- Promise: pending→fulfilled/rejected, settles once.
- `.then`/`await` → microtasks (beat timers/I/O).
- all=fail-fast, allSettled=never rejects, race=first settle, any=first fulfill.
- Parallelize independent awaits with `Promise.all`.
- async fn always returns a Promise; `await` pauses only that function.

➡️ Next: **Module 6 — Streams & Buffers.**
