# JS MODULE 12: PROMISES

---

## 1. What is a Promise
**Definition:** An object representing the **eventual completion or failure** of an async operation, and its resulting value. A placeholder for a future value.
**Why:** Replaces callback hell with chainable, composable async flow + unified error handling.

---

## 2. Promise States (Lifecycle)
```
        ┌───────────┐
        │  pending  │
        └─────┬─────┘
    resolve() │ reject()
       ┌──────┴──────┐
       ▼             ▼
 ┌───────────┐ ┌───────────┐
 │ fulfilled │ │ rejected  │   ← SETTLED (immutable, settles once)
 └───────────┘ └───────────┘
```
- **pending** → initial.
- **fulfilled** → resolved with a value.
- **rejected** → failed with a reason.
- Once settled, **cannot change** (resolve/reject after first is ignored).

---

## 3. Creating & Consuming
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => Math.random() > 0.5 ? resolve('ok') : reject(new Error('fail')), 100);
});
p.then(val => console.log(val))      // fulfilled
 .catch(err => console.error(err))   // rejected (anywhere in chain)
 .finally(() => console.log('done')); // always
```
`.then(onFulfilled, onRejected)`, `.catch(fn)` = `.then(undefined, fn)`, `.finally(fn)` runs regardless (no arg).

---

## 4. Promise Chaining
Each `.then` returns a **new promise** → flat sequential flow. Return a value → passes on; return a promise → waits for it.
```js
fetchUser(id)
  .then(user => fetchOrders(user.id))   // return promise → chain waits
  .then(orders => orders.length)
  .then(count => console.log(count))
  .catch(err => handle(err));           // one catch for the whole chain
```
**Mistake:** not returning inside `.then` → breaks the chain (next gets `undefined`).

---

## 5. Promise Resolution (`.then` callbacks run as microtasks)
`.then/.catch/.finally` callbacks are scheduled on the **microtask queue** → run after current sync code, before timers (Module 11).
```js
console.log('1');
Promise.resolve().then(() => console.log('2'));
console.log('3');
// 1, 3, 2
```

---

## 6. Combinators
| Method | Resolves | Rejects | Returns |
|--------|----------|---------|---------|
| `Promise.all` | all fulfill | any rejects (fail-fast) | array of values |
| `Promise.allSettled` | all settle | never | array of `{status, value/reason}` |
| `Promise.race` | first **settles** | first rejects | first settled |
| `Promise.any` | first **fulfills** | all reject (`AggregateError`) | first fulfilled |
```js
await Promise.all([a, b, c]);          // all or nothing
await Promise.allSettled([a, b]);      // every result, even failures
await Promise.race([fetch(x), timeout(5000)]);  // timeout pattern
await Promise.any([m1, m2, m3]);       // first success
```

---

## 7. BUILD A PROMISE FROM SCRATCH (interview gold)
```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];   // {onF, onR, resolve, reject}
    const resolve = (val) => this.#settle('fulfilled', val);
    const reject  = (err) => this.#settle('rejected', err);
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }
  #settle(state, value) {
    if (this.state !== 'pending') return;      // settle once
    this.state = state; this.value = value;
    queueMicrotask(() => this.callbacks.forEach(cb => this.#run(cb)));  // microtask!
  }
  #run({ onF, onR, resolve, reject }) {
    try {
      if (this.state === 'fulfilled') {
        const r = onF ? onF(this.value) : this.value;
        r instanceof MyPromise ? r.then(resolve, reject) : resolve(r);  // chain thenables
      } else {
        if (onR) resolve(onR(this.value)); else reject(this.value);
      }
    } catch (e) { reject(e); }
  }
  then(onF, onR) {
    return new MyPromise((resolve, reject) => {
      const cb = { onF, onR, resolve, reject };
      if (this.state === 'pending') this.callbacks.push(cb);
      else queueMicrotask(() => this.#run(cb));
    });
  }
  catch(onR) { return this.then(null, onR); }
  finally(fn) { return this.then(v => { fn(); return v; }, e => { fn(); throw e; }); }
}
```
**Key points:** settle once, callbacks as microtasks, `.then` returns new promise, thenable chaining.

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** always `.catch` (or try/catch with await); return promises in chains; use combinators for parallelism; convert callbacks with `util.promisify`/`new Promise`.
**Mistakes:** forgetting to return in `.then`; unhandled rejections (Node crashes); mixing callbacks + promises; nesting `.then` (anti-pattern); creating promises inside loops without `Promise.all` (sequential).
**Performance:** parallelize independent work (`Promise.all`); microtask floods can starve rendering; avoid unnecessary promise wrapping.

---

## INTERVIEW QUESTIONS
**🟢:** Promise states? · then/catch/finally? · all vs race?
**🟡:** Why do .then callbacks run before setTimeout (microtask)? · Chaining vs nesting? · all vs allSettled vs race vs any? · Sequential vs parallel?
**🔴:** Build a Promise from scratch (settle-once, microtask, thenable chaining). · What is a thenable? · How does `.then` return a new promise? · Promise.all implementation.
**🧩:** Add a timeout to a fetch (race). · 3 APIs, need all results even on failure (allSettled). · Unhandled rejection crash — fix. · Convert callback hell to promise chain.

**Output prediction:**
```js
Promise.resolve()
  .then(() => { console.log('a'); return 1; })
  .then((v) => { console.log('b', v); })
  .then(() => { throw new Error('x'); })
  .catch((e) => console.log('caught', e.message))
  .finally(() => console.log('done'));
// a, b 1, caught x, done

console.log(Promise.resolve(42));  // Promise {<fulfilled>: 42}
```

## ⚡ REVISION
- Promise: pending → fulfilled/rejected, settles once.
- `.then/.catch/.finally` → microtasks; each `.then` returns a new promise (chain).
- all (fail-fast), allSettled (never rejects), race (first settle), any (first fulfill).
- Build-from-scratch: settle-once + queueMicrotask + thenable chaining + new promise per then.
- Always handle rejections; parallelize with Promise.all.

➡️ Next: **Module 13 — Async/Await.**
