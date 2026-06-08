# JS MODULE 21: ADVANCED JAVASCRIPT

---

## 1. WeakMap
**Definition:** A Map whose **keys must be objects** and are held **weakly** — if the key object has no other references, it's **garbage-collected** (and the entry disappears). Not iterable, no `size`.
```js
const wm = new WeakMap();
let obj = {};
wm.set(obj, 'metadata');
obj = null;   // entry auto-removed by GC (no leak)
```
**Use:** private data per object, caches/metadata that shouldn't prevent GC, DOM node → data maps.
| | Map | WeakMap |
|---|-----|---------|
| Keys | any | objects only |
| GC | strong refs (leak risk) | weak (auto-clean) |
| Iterable / size | ✅ | ❌ |

## 2. WeakSet
Like Set but objects-only + weakly held. Use: tracking objects (e.g., "visited") without preventing GC.
```js
const seen = new WeakSet();
seen.add(node);  seen.has(node);
```

---

## 3. Symbol
**Definition:** A **unique, immutable primitive** — every `Symbol()` is unique. Used for collision-free property keys and well-known protocol hooks.
```js
const id = Symbol('id');
const obj = { [id]: 123 };   // unique key, won't collide, hidden from for-in/Object.keys
Symbol('a') === Symbol('a'); // false (always unique)
```
**Well-known symbols** customize language behavior: `Symbol.iterator` (iteration), `Symbol.asyncIterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`.
**`Symbol.for('key')`** → global symbol registry (shared).
**Use:** library-safe keys, metadata, implementing iteration protocols, enums.

---

## 4. Iterators
**Definition:** An object implementing the **iterator protocol**: a `next()` method returning `{ value, done }`. The **iterable protocol** = an object with a `[Symbol.iterator]()` method returning an iterator.
```js
const range = {
  from: 1, to: 3,
  [Symbol.iterator]() {
    let cur = this.from, last = this.to;
    return { next: () => cur <= last ? { value: cur++, done: false } : { value: undefined, done: true } };
  }
};
for (const n of range) console.log(n);   // 1 2 3
[...range];                               // [1,2,3]
```
Arrays, strings, Maps, Sets are built-in iterables. `for...of`, spread, destructuring use the iterator protocol.

---

## 5. Generator Functions
**Definition:** `function*` that can **pause and resume** via `yield`, producing a lazy sequence. Returns a generator (an iterator).
```js
function* gen() {
  yield 1;
  yield 2;
  const x = yield 3;   // receives value from next(x)
  return x;
}
const g = gen();
g.next();   // {value:1, done:false}
g.next();   // {value:2, done:false}
g.next();   // {value:3, done:false}
g.next(10); // {value:10, done:true}  (x = 10)

// infinite lazy sequence
function* ids() { let i = 1; while (true) yield i++; }
```
**Use:** lazy/infinite sequences, custom iteration, async flow control (pre-async/await, redux-saga), state machines.
**Internals:** generators are the mechanism async/await is conceptually built on (pause/resume).

---

## 6. Proxy
**Definition:** Wraps an object to **intercept fundamental operations** (get, set, has, deleteProperty, apply, construct...) via **traps**.
```js
const target = { x: 1 };
const proxy = new Proxy(target, {
  get(t, key, recv) { console.log('get', key); return Reflect.get(t, key, recv); },
  set(t, key, val, recv) {
    if (key === 'x' && typeof val !== 'number') throw new TypeError('x must be number');
    return Reflect.set(t, key, val, recv);
  }
});
proxy.x = 5;     // validated
proxy.x;         // logs 'get x' → 5
```
**Use:** validation, reactivity (**Vue 3**!), logging, access control, default values, virtualization/lazy loading, negative array indices.

## 7. Reflect
**Definition:** A built-in object providing methods for **default object operations** (`Reflect.get/set/has/deleteProperty/ownKeys/apply/construct`). Designed to pair with Proxy traps (same method names) and to perform the default behavior correctly (preserving `receiver`/`this`).
```js
Reflect.get(obj, 'x');
Reflect.set(obj, 'x', 1);
Reflect.has(obj, 'x');        // like 'x' in obj
Reflect.ownKeys(obj);         // all keys incl. symbols
Reflect.apply(fn, thisArg, args);
```
**Why with Proxy:** inside a trap, `Reflect.<op>(...arguments)` does the default thing with correct semantics.

---

## 8. Other Advanced
- **Optional chaining `?.`** / **Nullish coalescing `??`** (ES2020).
- **BigInt** for integers beyond `Number.MAX_SAFE_INTEGER`.
- **Tagged templates**, **labeled statements**, **`structuredClone`** (deep clone).
- **AbortController** for cancellation.

---

## INTERVIEW QUESTIONS
**🟢:** WeakMap vs Map? · What is a Symbol? · What is a generator?
**🟡:** Why are WeakMap entries GC-able? · Iterator vs iterable protocol? · Proxy use cases? · Reflect + Proxy pairing?
**🔴:** Implement a custom iterable. · How does Vue 3 use Proxy (track/trigger)? · Generators for async flow. · Symbol.iterator / well-known symbols. · Build a reactive/validation proxy.
**🧩:** Per-object private metadata without leaks — WeakMap. · Infinite lazy sequence — generator. · Validate all writes to an object — Proxy. · Library-safe property keys — Symbol.

**Output prediction:**
```js
function* g(){ yield* [1,2]; yield 3; }
console.log([...g()]);   // [1, 2, 3]

const p = new Proxy({}, { get: () => 42 });
console.log(p.anything); // 42

console.log(Symbol('a') === Symbol('a'));  // false
```

## ⚡ REVISION
- **WeakMap/WeakSet**: object keys, weakly held (GC-able), not iterable → private data/metadata caches.
- **Symbol**: unique primitive key; well-known symbols (`Symbol.iterator`) hook language behavior.
- **Iterator** = `next()→{value,done}`; **iterable** = `[Symbol.iterator]()`. for...of/spread use it.
- **Generator** `function*`/`yield` = pausable lazy sequences (basis of async flow).
- **Proxy** intercepts ops (Vue 3 reactivity); **Reflect** performs defaults (pair in traps).

➡️ Next: **Module 22 — JS Engine Internals.**
