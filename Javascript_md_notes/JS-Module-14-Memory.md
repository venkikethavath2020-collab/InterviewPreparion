# JS MODULE 14: MEMORY MANAGEMENT

---

## 1. Stack vs Heap
| | Stack | Heap |
|---|-------|------|
| Stores | Primitives (number, string, boolean, null, undefined, symbol, bigint), references, call frames | Objects, arrays, functions (reference types) |
| Speed | Very fast | Slower |
| Size | Small, fixed | Large, dynamic |
| Management | Auto (LIFO, pop on return) | **Garbage collected** |
| Access | By value | By reference |
```js
let n = 5;            // n on stack (value)
let obj = { a: 1 };   // reference on stack → {a:1} on heap
let copy = obj;       // copies the REFERENCE (same heap object)
copy.a = 9;
console.log(obj.a);   // 9 (shared)
```

---

## 2. Primitives vs References
```js
// Primitives — copied by value
let a = 1; let b = a; b = 2; // a still 1
// References — copied by reference
let x = {}; let y = x; y.z = 1; // x.z === 1
// Equality
{} === {};   // false (different refs)
'a' === 'a'; // true (primitive value)
```

---

## 3. Garbage Collection (GC)
**Definition:** Automatic reclamation of heap memory no longer **reachable**. JS manages memory for you (no `free()`).
**Reachability:** an object is "alive" if reachable from a **root** (global object, current call stack, closures). Unreachable → eligible for collection.
```
Roots (global, stack, closures)
   │
   ▼
 reachable objects ── kept
 unreachable objects ── collected
```

---

## 4. Mark and Sweep (the algorithm)
```
1. MARK:  start from roots → traverse all reachable objects → mark "alive"
2. SWEEP: scan heap → unmarked objects = garbage → free them
3. (V8) COMPACT: move survivors together → reduce fragmentation
```
**Why reachability (not reference counting):** handles **circular references** correctly — a cycle unreachable from roots is collected (naive refcounting would leak it).
```js
let a = {}; let b = {};
a.ref = b; b.ref = a;   // circular
a = null; b = null;     // unreachable cycle → GC collects it ✅
```

**V8 generational GC (see Module 22 / Node Module 7):** New space (Scavenge — fast, frequent) + Old space (Mark-Sweep-Compact). Most objects die young → promoted after surviving.

---

## 5. Memory Leaks (still-reachable-but-unneeded)
**Top causes:**
1. **Accidental globals** (`x = 1` without declaration in non-strict).
2. **Forgotten timers/intervals** holding references.
3. **Detached DOM nodes** referenced by JS after removal from DOM.
4. **Closures** capturing large objects that outlive their need.
5. **Event listeners** not removed.
6. **Unbounded caches/Maps** (no eviction).
```js
// detached DOM leak
const el = document.getElementById('big');
document.body.removeChild(el);
// el still referenced by JS → not GC'd → leak (null it out)

// listener leak
function add() { window.addEventListener('resize', onResize); }  // never removed
```

---

## 6. Detecting & Fixing Leaks
**Detect:** Chrome DevTools **Memory** panel → heap snapshots (compare over time, find growing retained size), **detached DOM nodes**, allocation timeline; `performance.memory` (Chrome); Node `process.memoryUsage()`.
**Fix:**
- Remove event listeners (`removeEventListener`) on cleanup.
- Clear timers (`clearInterval`).
- Null out references to large/detached objects.
- Bound caches (LRU, TTL) or use **WeakMap/WeakSet** (keys weakly held → GC'd).
- Avoid accidental globals (strict mode).
```js
const cache = new WeakMap();   // entries auto-removed when key object is GC'd
```

---

## 7. Memory Optimization
- Reuse objects/buffers in hot paths (object pools).
- Avoid creating closures/functions in tight loops.
- Use primitives over objects where possible.
- Keep object shapes stable (V8 hidden classes).
- Use typed arrays for large numeric data.
- Paginate/stream large datasets instead of loading all.

---

## INTERVIEW QUESTIONS
**🟢:** Stack vs heap? · Primitives vs references? · What is GC?
**🟡:** Mark and sweep? · How does GC handle circular refs? · Common leak causes? · WeakMap for caches?
**🔴:** Generational GC (new/old space). · Reachability vs reference counting. · Detached DOM leaks. · How to take/diff a heap snapshot.
**🧩:** Page memory grows over time — debug methodology. · SPA leaks on route change (listeners/timers). · Closure holding big array — fix. · Choose WeakMap vs Map for metadata.

**Output prediction:**
```js
let a = { v: 1 };
let b = a;
b.v = 2;
console.log(a.v);     // 2 (same reference)

let s1 = 'x', s2 = s1;
s2 = 'y';
console.log(s1);      // 'x' (primitive copied by value)

console.log({} === {}, [] === []);  // false false
```

## ⚡ REVISION
- Stack = primitives/refs/frames (auto); Heap = objects (GC).
- GC = reachability from roots; Mark-and-Sweep (+ compact); handles cycles.
- Leaks = reachable-but-unneeded: globals, timers, detached DOM, listeners, closures, unbounded caches.
- Detect via heap snapshots; fix with cleanup + WeakMap/WeakSet + bounded caches.
- Optimize: stable shapes, reuse, primitives, typed arrays.

➡️ Next: **Module 15 — Arrays.**
