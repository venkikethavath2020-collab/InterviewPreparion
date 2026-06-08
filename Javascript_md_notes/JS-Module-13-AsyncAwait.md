# JS MODULE 13: ASYNC / AWAIT

---

## 1. What & Why
**Definition:** Syntactic sugar over Promises that lets you write asynchronous code that **reads like synchronous code**. `async` marks a function that returns a Promise; `await` pauses until a Promise settles.
**Why:** Flatter than `.then` chains, natural `try/catch` error handling, easier to read/debug.
```js
// Promise chain
fetchUser(id).then(u => fetchOrders(u)).then(o => render(o)).catch(handle);
// async/await
async function load(id) {
  try {
    const u = await fetchUser(id);
    const o = await fetchOrders(u);
    render(o);
  } catch (e) { handle(e); }
}
```

---

## 2. `async` Function
- **Always returns a Promise.** A returned value → resolved promise; a thrown error → rejected promise.
```js
async function f() { return 1; }
f();                          // Promise {<fulfilled>: 1}
async function g() { throw new Error('x'); }
g();                          // Promise {<rejected>: Error}
```

## 3. `await`
- Can only be used inside `async` functions (or top-level in ES modules).
- **Pauses** the async function until the awaited promise settles, then resumes with the resolved value (or throws the rejection).
- Crucially: it **does NOT block the thread** — the event loop keeps running; only **this function** is suspended.
```js
const data = await fetch(url);   // waits for the promise, non-blocking
```

---

## 4. How Async/Await Uses Promises Internally
`async/await` is built on Promises + the **microtask queue** + a state-machine/generator-like suspension. Conceptually:
```js
async function f() {
  console.log('A');
  await something();      // ≈ pause; schedule the rest as a .then() microtask
  console.log('B');       // continuation runs as a microtask when `something()` settles
}
// roughly equivalent to:
function f() {
  console.log('A');
  return Promise.resolve(something()).then(() => { console.log('B'); });
}
```
**Everything after an `await` runs as a microtask** (same priority as `.then`). The engine implements this via a coroutine/state machine that resumes on promise resolution.

```js
console.log('1');
(async () => { console.log('2'); await null; console.log('4'); })();
console.log('3');
// 1, 2, 3, 4   (2 sync, then continuation 4 is a microtask after 3)
```

---

## 5. Error Handling
```js
// try/catch (clean)
async function f() {
  try { const x = await risky(); }
  catch (e) { handle(e); }
  finally { cleanup(); }
}
// or .catch on the returned promise
f().catch(handle);
// per-await without try wrapping everything:
const [err, data] = await risky().then(d => [null, d]).catch(e => [e]);
```
**Mistake:** an un-awaited promise's rejection isn't caught by surrounding `try/catch`.

---

## 6. Sequential vs Parallel (critical perf point)
```js
// ❌ Sequential — total = sum of all (slow)
const a = await taskA();   // wait
const b = await taskB();   // then wait
// ✅ Parallel — total = max (fast)
const [a, b] = await Promise.all([taskA(), taskB()]);
// Start all, await later:
const pa = taskA(); const pb = taskB();   // both started
const a2 = await pa; const b2 = await pb;
```
**Rule:** if awaits are **independent**, run them in parallel with `Promise.all`.

---

## 7. Top-Level Await
In **ES modules**, `await` works at the top level (no async wrapper). Blocks the module's evaluation until resolved — use carefully (can delay module loading).
```js
// module.mjs
const config = await loadConfig();   // top-level await (ESM only)
```

---

## 8. Loops with Async
```js
// Sequential (each waits) — sometimes intended:
for (const id of ids) { await process(id); }
// Parallel:
await Promise.all(ids.map(id => process(id)));
// ❌ forEach doesn't await! (callbacks run, loop doesn't wait)
ids.forEach(async id => { await process(id); });  // fire-and-forget bug
```

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** try/catch around awaits; parallelize independent awaits; use `for...of` (not `forEach`) for sequential async; handle the returned promise's rejection.
**Mistakes:** sequential awaits that could be parallel; `await` in `forEach`; forgetting `await` (returns pending promise); un-awaited rejections; blocking top-level await.
**Performance:** `Promise.all` for concurrency; avoid awaiting in tight loops unnecessarily; microtask ordering still applies.

---

## INTERVIEW QUESTIONS
**🟢:** What does async return? · What does await do? · Does await block the thread?
**🟡:** How does async/await relate to promises/microtasks? · Sequential vs parallel awaits? · Error handling patterns? · Why doesn't forEach await?
**🔴:** Desugar async/await to promises. · await continuation = microtask (prove with output). · Top-level await semantics. · Implement a concurrency-limited async map.
**🧩:** Slow page: 3 independent awaits in series — fix (Promise.all). · forEach async bug — fix (for...of / map+all). · Unhandled rejection from un-awaited call. · Retry-with-backoff using async/await.

**Output prediction:**
```js
async function f() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}
console.log('0'); f(); console.log('3');
// 0, 1, 3, 2

async function g() { return 5; }
g().then(v => console.log(v));   // 5 (async returns a promise)
```

## ⚡ REVISION
- `async` fn always returns a Promise; `await` pauses that fn (non-blocking), resumes as a microtask.
- After `await` = microtask (same as `.then`).
- try/catch/finally for errors; handle returned-promise rejection.
- Parallelize independent awaits with `Promise.all`; use `for...of` not `forEach` for sequential async.
- Top-level await = ESM only.

➡️ Next: **Module 14 — Memory Management.**
