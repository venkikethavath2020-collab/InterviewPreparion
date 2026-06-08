# ESSENTIAL JS — SECTION 18: CODING INTERVIEW PATTERNS (Implement From Scratch)
> The classic "implement X" round. Each with line-by-line reasoning + edge cases.

---

## 1. Debounce
**Delays execution until N ms after the LAST call.** (search input, resize, autosave)
```js
function debounce(fn, delay) {
  let timer;                                  // closure: persists across calls
  return function (...args) {                 // returned wrapper
    clearTimeout(timer);                      // cancel the pending call
    timer = setTimeout(() => {                // schedule fresh
      fn.apply(this, args);                   // preserve `this` + args
    }, delay);
  };
}
// + immediate (leading edge) + cancel
function debounce(fn, delay, immediate = false) {
  let timer;
  function debounced(...args) {
    const callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; if (!immediate) fn.apply(this, args); }, delay);
    if (callNow) fn.apply(this, args);
  }
  debounced.cancel = () => { clearTimeout(timer); timer = null; };
  return debounced;
}
```
**Why each line:** `timer` in closure remembers the pending timeout; `clearTimeout` resets it on every call so only the last survives; `apply(this, args)` keeps the original context/arguments.

## 2. Throttle
**Runs at most ONCE per N ms.** (scroll, mousemove, rate-limit)
```js
function throttle(fn, limit) {
  let inThrottle = false;                     // gate flag in closure
  return function (...args) {
    if (!inThrottle) {                        // only if not cooling down
      fn.apply(this, args);                   // run immediately (leading)
      inThrottle = true;                      // start cooldown
      setTimeout(() => (inThrottle = false), limit);  // reopen after limit
    }
  };
}
// timestamp version (trailing-aware)
function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) { last = now; fn.apply(this, args); }
  };
}
```

## 3. Memoization
**Cache results by arguments** (pure functions).
```js
function memoize(fn) {
  const cache = new Map();                     // private cache (closure)
  return function (...args) {
    const key = JSON.stringify(args);          // serialize args as key
    if (cache.has(key)) return cache.get(key); // cache hit
    const result = fn.apply(this, args);       // compute
    cache.set(key, result);                    // store
    return result;
  };
}
// object-keyed (WeakMap, no leak) for single-object-arg fns
```
**Edge:** `JSON.stringify` keys fail for functions/circular/order-sensitive args; bound the cache (LRU) to avoid leaks.

## 4. Deep Clone
```js
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;   // primitives
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (seen.has(obj)) return seen.get(obj);                   // handle circular
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);                                      // register before recursing
  for (const key of Reflect.ownKeys(obj))                   // incl. symbols
    clone[key] = deepClone(obj[key], seen);
  return clone;
}
// Modern built-in: structuredClone(obj) — handles Date/Map/Set/cycles (not functions)
```

## 5. Array Flatten
```js
// recursive
function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) && depth > 0
      ? acc.concat(flatten(val, depth - 1))     // recurse, decrement depth
      : acc.concat(val), []);
}
// iterative (stack) — avoids call-stack limits
function flattenIter(arr) {
  const stack = [...arr], res = [];
  while (stack.length) {
    const next = stack.pop();
    Array.isArray(next) ? stack.push(...next) : res.push(next);
  }
  return res.reverse();
}
// built-in: arr.flat(Infinity)
```

## 6. Group By
```js
function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    (groups[key] ||= []).push(item);            // init array if absent, then push
    return groups;
  }, {});
}
groupBy([{t:'a',v:1},{t:'b',v:2},{t:'a',v:3}], 't');
// { a: [{t:'a',v:1},{t:'a',v:3}], b: [{t:'b',v:2}] }
```

## 7. Polyfill `map`
```js
Array.prototype.myMap = function (cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function');
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++)
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this);  // skip holes
  return out;
};
```

## 8. Polyfill `filter`
```js
Array.prototype.myFilter = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++)
    if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  return out;
};
```

## 9. Polyfill `reduce`
```js
Array.prototype.myReduce = function (cb, initial) {
  let acc = initial, i = 0;
  if (arguments.length < 2) {                       // no initial value
    while (i < this.length && !(i in this)) i++;    // skip leading holes
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];                                // first element as seed
  }
  for (; i < this.length; i++)
    if (i in this) acc = cb(acc, this[i], i, this);
  return acc;
};
```

## 10. Polyfill `bind`
```js
Function.prototype.myBind = function (ctx, ...presetArgs) {
  const fn = this;                                  // the function to bind
  return function (...laterArgs) {
    return fn.apply(ctx, [...presetArgs, ...laterArgs]);  // fix this + partial args
  };
};
// (full spec also handles `new` on the bound fn — interview bonus)
```

## 11. Polyfill `call`
```js
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;                          // null/undefined → global
  const key = Symbol('fn');                         // unique temp key (no collision)
  ctx[key] = this;                                  // attach fn as method → sets `this`
  const result = ctx[key](...args);                 // invoke as method
  delete ctx[key];                                  // cleanup
  return result;
};
```

## 12. Polyfill `apply`
```js
Function.prototype.myApply = function (ctx, args = []) {
  ctx = ctx ?? globalThis;
  const key = Symbol('fn');
  ctx[key] = this;
  const result = ctx[key](...args);                 // args is an ARRAY
  delete ctx[key];
  return result;
};
```

## 13. `Promise.all`
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);   // empty → resolve immediately
    promises.forEach((p, i) => {
      Promise.resolve(p)                             // wrap non-promises
        .then(val => {
          results[i] = val;                          // preserve order by index
          if (++completed === promises.length) resolve(results);  // all done
        })
        .catch(reject);                              // fail-fast: first rejection
    });
  });
}
```

## 14. `Promise.race`
```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p =>
      Promise.resolve(p).then(resolve, reject));     // first to settle wins (resolve OR reject)
  });
}
```

## Bonus: `Promise.allSettled` / `Promise.any`
```js
function allSettled(promises) {
  return Promise.all(promises.map(p =>
    Promise.resolve(p).then(
      value => ({ status: 'fulfilled', value }),
      reason => ({ status: 'rejected', reason })
    )));
}
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let rejections = 0; const errors = [];
    promises.forEach((p, i) => Promise.resolve(p).then(resolve, err => {
      errors[i] = err;
      if (++rejections === promises.length) reject(new AggregateError(errors, 'All promises rejected'));
    }));
  });
}
```

## Other Common "Implement" Asks
```js
// curry
function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
  };
}
// once
const once = (fn) => { let called, result; return (...a) => called ? result : (called = true, result = fn(...a)); };
// compose / pipe
const compose = (...fns) => x => fns.reduceRight((acc, f) => f(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, f) => f(acc), x);
// EventEmitter (see Design Patterns module)
// deepEqual, retry, chunk, sleep
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
```

## Interview Tips per Pattern
- **Debounce/throttle:** explain closure for state + `apply(this, args)`; know debounce (after stop) vs throttle (per interval) + leading/trailing edges.
- **Polyfills:** mention callback signature `(el, i, arr)`, `thisArg`, skipping holes (`i in this`), reduce's no-initial edge.
- **call/apply/myBind:** Symbol key to avoid collision; cleanup; `?? globalThis`; bonus: bind + `new`.
- **Promise.all:** preserve order by index, fail-fast, wrap non-promises with `Promise.resolve`, handle empty array.
- **Deep clone:** WeakMap for cycles, handle Date/RegExp/symbols, mention `structuredClone`.

## ⚡ REVISION
- **debounce** = clearTimeout+setTimeout (last call wins). **throttle** = flag/timestamp gate (once per interval).
- **memoize** = Map cache keyed by JSON.stringify(args) (bound it).
- **deepClone** = recurse + WeakMap(cycles) + Date/RegExp/symbols (or structuredClone).
- **flatten** = reduce+recursion / stack iterative / flat(Infinity).
- **polyfills** = loop + callback `(el,i,arr)` + thisArg + skip holes; reduce no-initial edge.
- **call/apply/bind** = temp Symbol key sets `this`; bind returns partial-applied fn.
- **Promise.all** = index-ordered results, fail-fast, Promise.resolve wrap, empty→resolve([]). **race** = first settle.

➡️ Next (final): **Interview Master Section** (Top 100 + topic-specific Q&A).
