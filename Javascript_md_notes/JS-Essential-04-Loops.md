# ESSENTIAL JS — SECTION 4: LOOPS

---

## 1. The Loop Types
```js
// for — full control (init; condition; update)
for (let i = 0; i < arr.length; i++) {}

// while — condition checked first
while (cond) {}

// do...while — body runs at least once
do {} while (cond);

// for...of — iterates VALUES of iterables (arrays, strings, Maps, Sets, NodeLists)
for (const val of arr) {}

// for...in — iterates KEYS (enumerable, incl. inherited) — for OBJECTS
for (const key in obj) {}

// forEach — array method, callback per element
arr.forEach((val, i, arr) => {});
```

## 2. Internal Working
- **`for`/`while`/`do-while`:** raw control-flow; engine evaluates condition, runs body, updates — no function call overhead.
- **`for...of`:** uses the **iterator protocol** — calls `[Symbol.iterator]()` then `.next()` repeatedly until `done`. Works on any iterable.
- **`for...in`:** walks **enumerable string keys including inherited (prototype) ones** → order not guaranteed for integer-like keys; meant for objects, NOT arrays.
- **`forEach`:** invokes a **callback function per element** (function-call overhead); can't `break`/`continue`/`return` out of the loop.

## 3. Performance Differences
```
Fastest → slowest (typical, micro-benchmarks vary by engine):
  classic for / for...of  >  forEach / map  >  for...in
```
- `for...in` is slowest (prototype walk + key enumeration).
- `for` has no callback overhead → best for hot/perf-critical loops.
- `for...of` is clean + nearly as fast; can `break`.
- `forEach`/`map` have per-element callback cost but are readable.

## 4. Memory Considerations
- `map` **allocates a new array**; `forEach`/`for`/`for...of` don't.
- Chained array methods create intermediate arrays (multiple passes + allocations).
- Generators/iterators (for...of) are memory-efficient for lazy/large sequences (don't materialize all).

## 5. Comparisons

### `for` vs `forEach`
| | `for` | `forEach` |
|---|-------|-----------|
| break/continue | ✅ | ❌ (can't break) |
| return from outer | ✅ | ❌ (returns from callback only) |
| async/await | works (sequential) | ❌ doesn't await |
| Speed | Faster | Slower (callback) |
| Readability | Lower | Higher |

### `forEach` vs `map`
| | `forEach` | `map` |
|---|-----------|-------|
| Returns | undefined | **new array** |
| Purpose | side effects | transform |
| Chainable | ❌ | ✅ |
**Mistake:** using `map` for side effects (creates a wasted array) → use `forEach`.

### `for...of` vs `for...in`
| | `for...of` | `for...in` |
|---|-----------|-----------|
| Iterates | values | keys (incl. inherited) |
| Works on | iterables (array/string/Map/Set) | objects (any enumerable keys) |
| Order | insertion/iteration order | not guaranteed (esp. arrays) |
| Use for | arrays/iterables | objects |
```js
const arr = ['a', 'b']; arr.extra = 'x';
for (const v of arr) console.log(v);   // 'a','b' (values, skips 'extra')
for (const k in arr) console.log(k);   // '0','1','extra' (keys incl. custom!)
```

### `while` vs `for`
- `for` when count/range known (init+update in one place).
- `while` when looping until a condition (unknown iterations, e.g., reading a stream).

## 6. Why `break`/`continue` Work in Loops but NOT `forEach`
`for`/`while`/`for...of` are **language constructs** — `break`/`continue` are statements the engine understands within them. `forEach` is a **function**; its callback is a separate function — `break`/`continue` are illegal there (SyntaxError), and `return` only exits the **callback** (the loop continues).
```js
[1,2,3].forEach(x => { if (x === 2) return; console.log(x); }); // 1, 3 (return skips, doesn't break)
for (const x of [1,2,3]) { if (x === 2) break; console.log(x); } // 1 (break works)
// To "break" forEach → use for...of, .some()/.every(), or throw
[1,2,3].some(x => x === 2);  // stops at 2 (short-circuits)
```

## 7. Async Loop Behavior (critical)

### `for` / `for...of` with await → SEQUENTIAL (works)
```js
for (const id of ids) {
  await process(id);   // waits each iteration (sequential)
}
```

### `forEach` with await → BROKEN (doesn't wait)
```js
ids.forEach(async (id) => { await process(id); });
console.log('done');   // logs BEFORE any process finishes!
```
**Why:** `forEach` calls the async callback and **ignores the returned promise** — it doesn't await. All callbacks fire synchronously; the loop completes immediately while promises are still pending. Errors are also swallowed.

### Parallel → `Promise.all`
```js
await Promise.all(ids.map(id => process(id)));   // all in parallel, awaited
// concurrency-limited: chunk + Promise.all, or p-limit
```

### Summary
| Pattern | Behavior |
|---------|----------|
| `for...of` + await | Sequential, awaited ✅ |
| `forEach` + async | Fire-and-forget, NOT awaited ❌ |
| `map` + `Promise.all` | Parallel, awaited ✅ |
| `for await...of` | Async iterables (streams) ✅ |

```js
// for await...of — for async iterables (e.g., paginated API, streams)
for await (const chunk of asyncStream) { process(chunk); }
```

## 8. Common Mistakes
- `await` inside `forEach` (silent bug).
- `for...in` over arrays (gets keys + inherited props, wrong order).
- `map` for side effects.
- trying to `break` `forEach`.
- mutating an array while iterating.
- off-by-one (`<=` vs `<`).

## 9. Best Practices
- `for...of` for arrays/iterables (clean + break + async-friendly).
- `for...in` only for objects (with `hasOwnProperty` guard) — or prefer `Object.keys()`.
- `map`/`filter`/`reduce` for transformations; `forEach` for pure side effects.
- `Promise.all` for parallel async; `for...of`+await for sequential.
- classic `for` for hot perf-critical loops.

## 10. Performance / Production
- Hot paths (game loops, big data): classic `for`.
- API calls in series (rate-limited): `for...of` + await; in parallel: `Promise.all` (with concurrency cap).
- Streaming/pagination: `for await...of`.

## 11. Coding Example
```js
// Sequential vs parallel timing
async function seq(ids){ for (const id of ids) await fetchOne(id); }      // sum of times
async function par(ids){ await Promise.all(ids.map(fetchOne)); }          // max time
```

## 12. Tricky Edge Cases
```js
// for...in includes inherited
Object.prototype.x = 1;
for (const k in {a:1}) console.log(k);   // 'a', 'x'  (inherited!) → use hasOwnProperty

// forEach skips holes in sparse arrays
[1,,3].forEach(v => console.log(v));     // 1, 3 (hole skipped)

// modifying length mid-loop
const a=[1,2,3]; a.forEach((v,i)=>{ if(i===0) a.push(4); }); // doesn't visit pushed 4

// var in loop closure
for (var i=0;i<3;i++) setTimeout(()=>console.log(i)); // 3 3 3
```

## 13. Output Prediction
```js
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));  // 0 1 2
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));  // 3 3 3

['a','b'].forEach((v,i) => console.log(i, v));   // 0 'a'  1 'b'

const arr = [1,2,3]; arr.prop = 9;
for (const x of arr) console.log(x);   // 1 2 3
for (const k in arr) console.log(k);   // 0 1 2 prop

async function f() {
  [1,2,3].forEach(async n => { await Promise.resolve(); console.log(n); });
  console.log('after');
}
f();   // 'after', then 1, 2, 3 (forEach didn't await)
```

## Interview Questions
**🟢:** for...of vs for...in? · forEach vs map? · Can you break out of forEach?
**🟡:** Why does await in forEach not work? · How to loop async sequentially vs parallel? · Why is for...in bad for arrays?
**🔴:** Iterator protocol behind for...of. · break/continue: why language constructs vs function. · for await...of use case. · Performance ranking + why.
**🧩:** API calls fire but code continues (forEach async) — fix. · Need to stop a loop early on a condition — for...of/some. · Rate-limited sequential calls — for...of+await. · Speed up independent calls — Promise.all.

## ⚡ REVISION
- `for`/`while`/`do-while` = control flow (break/continue/await work). `for...of` = values (iterables, break, await). `for...in` = keys incl. inherited (objects only).
- `forEach` = callback, NO break/continue, does NOT await async (fire-and-forget bug).
- `map` returns new array (transform); `forEach` for side effects.
- Async: `for...of`+await (sequential), `map`+`Promise.all` (parallel), `for await...of` (async iterables).
- Hot loops → classic `for`.

➡️ Next: **Arrays.**
