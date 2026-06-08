# JS MODULE 26: JAVASCRIPT REVISION SHEET

---

# 🗓️ 1-DAY REVISION NOTES

### Fundamentals
- JS = single-threaded, dynamic, weakly-typed, JIT-compiled, prototype-based; implements ECMAScript.
- Engine (V8) runs JS; **runtime** = engine + host APIs + event loop. setTimeout/fetch = runtime, not language.
- Primitives (by value): number, string, boolean, null, undefined, symbol, bigint. Objects by reference.
- `==` coerces, `===` doesn't; typeof null = 'object'; NaN !== NaN.

### Execution & Hoisting
- EC two phases: **Creation** (hoist: var→undefined, let/const→TDZ, fn→full; bind this; scope chain) → **Execution**.
- var function-scoped; let/const block-scoped + TDZ.
- Function declarations hoisted; expressions/arrows follow var/let.

### Scope & Closures
- Lexical scope = where defined; scope chain = outer-env lookup.
- Closure = function + captured lexical env (remembers outer vars). Uses: privacy, memo, debounce, throttle, currying.
- var-loop trap → use let.

### this
- Set by call site: new > call/apply/bind > obj.method() > default (undefined strict).
- Arrow = lexical this (no own arguments/prototype/new).

### Objects & Prototypes
- Objects = key-value, heap, reference-compared. freeze/seal shallow; spread/assign shallow.
- Every object has [[Prototype]]; fns have .prototype. Lookup walks chain → Object.prototype → null.
- class = sugar over prototypes; #private; super before this.

### Async
- Event loop: run sync → drain ALL microtasks → 1 macrotask → repeat.
- Micro (Promise/.then, await, queueMicrotask) > Macro (setTimeout/interval, I/O).
- Promise: pending→fulfilled/rejected (once); all/allSettled/race/any.
- async returns promise; await pauses fn (non-blocking), continuation = microtask; Promise.all to parallelize.

### Memory & Engine
- Stack (primitives) vs Heap (objects, GC). Mark-and-sweep (reachability, handles cycles).
- Leaks: globals, timers, detached DOM, listeners, closures.
- V8: Parser→AST→Ignition(bytecode)→TurboFan(optimize)→deopt. Hidden classes + inline caching (mono>poly>mega).

### Arrays/DOM/Browser
- map/filter/reduce/find/some/every O(n) non-mutating; sort/splice/push mutate.
- Reflow (geometry, expensive) vs repaint vs composite (transform/opacity, cheap).
- CRP: HTML→DOM + CSS→CSSOM → render tree → layout → paint → composite. defer/async scripts.

### Modules/Perf/Security
- CJS sync/value/cached; ESM async/live-binding/tree-shakeable; dynamic import = code split.
- Debounce (after stop) vs throttle (per interval); memoize pure fns.
- XSS (escape/CSP/sanitize), CSRF (SameSite/token), CORS (server headers), SOP.

---

# ⏳ 3-HOUR REVISION

1. **Types/coercion:** primitives vs objects, == vs ===, falsy values, typeof quirks.
2. **EC/Hoisting:** creation→execution, var/let/const, TDZ.
3. **Scope/Closures:** lexical scope, scope chain, closure mechanism, var-loop trap, debounce/memoize.
4. **this:** call-site rules, call/apply/bind, arrow lexical this.
5. **Prototypes:** chain lookup, new internals, class = sugar, inheritance.
6. **Event loop:** micro>macro, drain order, setTimeout(0), output prediction.
7. **Promises/async:** states, combinators, await=microtask, parallel vs sequential, build promise.
8. **Memory:** stack/heap, mark-sweep, leaks.
9. **Engine:** Ignition/TurboFan, hidden classes, inline caching, deopt.
10. **Arrays:** implement map/filter/reduce; sort mutates.
11. **DOM/browser:** reflow/repaint/composite, CRP, event delegation.
12. **Modules/perf/security:** ESM/CJS, tree shaking, debounce/throttle, XSS/CSRF/CORS.

---

# ⚡ 30-MINUTE REVISION (last-minute)

- JS = single-threaded, dynamic, JIT, prototype-based. == coerces, use ===.
- Hoisting: var→undefined, let/const→TDZ, fn-decl→full. var function-scoped, let/const block.
- Closure = fn + captured lexical env; var-loop→use let.
- this = call site (new>bind>method>default); arrow = lexical.
- Prototype chain lookup → Object.prototype → null; class = sugar.
- **Event loop:** sync → drain ALL microtasks → 1 macrotask → repeat. Micro (Promise/await) > Macro (setTimeout).
- setTimeout(0) ≠ immediate. async returns promise; await continuation = microtask; Promise.all to parallelize.
- Promise: all(fail-fast)/allSettled(all)/race(first settle)/any(first fulfill).
- Stack=primitives, Heap=objects(GC mark-sweep, handles cycles). Leaks: globals/timers/listeners/closures/detached DOM.
- V8: Ignition→TurboFan→deopt; hidden classes + inline caching (mono fastest).
- map/filter/reduce O(n) non-mutating; sort/splice mutate.
- Reflow(geometry) > repaint > composite(transform/opacity cheap).
- CJS sync/value; ESM async/live/tree-shake; dynamic import = split.
- Debounce(after stop) vs throttle(per interval); memoize pure.
- XSS→escape/CSP; CSRF→SameSite/token; CORS→server headers; SOP base.

---

# 🔄 EVENT LOOP CHEAT SHEET
```
ALGORITHM:
  run sync (call stack empties)
  → drain ENTIRE microtask queue (incl. new ones)
  → (browser) render if needed
  → take ONE macrotask
  → repeat

MICROTASKS (higher priority, drained fully each tick):
  Promise.then/catch/finally, await continuation, queueMicrotask, MutationObserver
MACROTASKS (one per tick):
  setTimeout, setInterval, setImmediate(Node), I/O, UI events, MessageChannel

RULES:
  setTimeout(0) ≠ immediate (runs after sync + all microtasks)
  microtasks added during draining still run before next macrotask
  after await = microtask
  Node adds: process.nextTick (before promises) + phases (timers→poll→check)

PREDICT: sync first → all microtasks → one macrotask → microtasks → ...
```

---

# 🔒 CLOSURES CHEAT SHEET
```
DEF: function + reference to its lexical environment (remembers outer vars after outer returns)
MECHANISM: fn stores [[Environment]]; captured env stays on HEAP while fn reachable
USES: data privacy, memoization, debounce, throttle, currying, module pattern, factories
VAR-LOOP TRAP: var shares one binding (logs final value) → use let (per-iteration binding) or IIFE

debounce: clearTimeout(t); t=setTimeout(fn, delay)        // after calls stop
throttle: if(!flag){fn(); flag=true; setTimeout(()=>flag=false, limit)}  // per interval
memoize:  cache=new Map(); key=JSON.stringify(args); return cached or compute+store
once:     let done; return (...a)=> done ? undefined : (done=true, fn(...a))
LEAK RISK: captured large objects retained until closure unreachable → null refs
```

---

# 🧬 PROTOTYPE CHEAT SHEET
```
obj.__proto__ / [[Prototype]]   → object's link to its prototype
Fn.prototype                    → object given to instances via new
LOOKUP: own? → prototype? → ...→ Object.prototype → null → undefined
new Fn(): create obj → link obj.__proto__=Fn.prototype → run ctor(this=obj) → return obj
hasOwnProperty(k) = own only;  'k' in obj = whole chain
class extends = sugar: Child.prototype.__proto__ = Parent.prototype
super(): parent ctor (before this); super.m(): parent method
Object.create(proto) → new obj with given prototype; Object.create(null) → no prototype
instanceof: walks prototype chain
SET creates OWN prop (doesn't touch prototype); shared methods → put on prototype (memory)
```

---

# ⚙️ ASYNC CHEAT SHEET
```
PROMISE: pending → fulfilled/rejected (settles ONCE)
.then(onF, onR) / .catch / .finally  → run as MICROTASKS
COMBINATORS:
  Promise.all([..])        all fulfill | any rejects (fail-fast) → values[]
  Promise.allSettled([..]) always resolves → {status,value/reason}[]
  Promise.race([..])       first SETTLES (fulfill or reject)
  Promise.any([..])        first FULFILLS | all reject → AggregateError
ASYNC/AWAIT:
  async fn → always returns a Promise
  await → pauses THIS fn (non-blocking); continuation = microtask
  try/catch/finally for errors; handle returned-promise rejection
PARALLEL: const [a,b] = await Promise.all([taskA(), taskB()])  (independent work)
LOOPS: for...of (sequential await) | map+Promise.all (parallel) | NOT forEach
PATTERNS: timeout=race([fetch,timer]); cancel=AbortController; retry=loop+backoff
```

---

# 🎯 FINAL ONE-LINERS
- "JS is single-threaded; the event loop + async APIs make it non-blocking."
- "Microtasks drain fully before each macrotask; setTimeout(0) isn't immediate."
- "Closure = function + its captured lexical environment."
- "`this` is decided by the call site; arrows capture it lexically."
- "Inheritance is prototype-based; class is just sugar."
- "Use === ; == coerces."
- "Stack holds primitives, heap holds objects; GC is mark-and-sweep by reachability."
- "Keep object shapes stable so V8 keeps hidden classes + inline caches fast."
- "Parallelize independent awaits with Promise.all."
- "Measure before optimizing."

---

✅ **ALL 26 JAVASCRIPT MODULES COMPLETE.**
