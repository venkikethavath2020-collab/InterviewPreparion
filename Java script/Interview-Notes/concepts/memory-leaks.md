# Memory Management & Memory Leaks

## Definition

JavaScript manages memory automatically via **garbage collection (GC)**. A **memory leak** is memory that is no longer needed but remains referenced, so the GC cannot reclaim it — causing growing memory use and eventual slowdowns/crashes.

## Why It Matters

Long-running apps (SPAs, Node servers) accumulate leaks that degrade performance over time. Understanding GC and common leak sources is a senior-level expectation.

## How Garbage Collection Works

Modern engines use **mark-and-sweep**: starting from "roots" (global object, call stack), the GC marks all reachable objects; anything unreachable is swept (freed). An object is collectible only when **nothing references it**.

## Common Leak Sources

**1. Lingering global variables**
```js
function f() { leaked = "oops"; } // non-strict: accidental global, never GC'd
```
Fix: `"use strict"`, declare with `let`/`const`.

**2. Forgotten timers / intervals**
```js
const id = setInterval(() => doWork(obj), 1000); // keeps `obj` alive forever
clearInterval(id); // fix: clear when done
```

**3. Detached DOM nodes**
```js
const el = document.getElementById("x");
document.body.removeChild(el); // removed from DOM...
// but a JS variable still references it → not collected
```
Fix: null out references after removal.

**4. Unremoved event listeners**
```js
node.addEventListener("click", handler);
// closures in handler retain scope; remove when the node goes away:
node.removeEventListener("click", handler);
```

**5. Closures holding large scopes**
A closure that captures a large object keeps it alive for the closure's lifetime — see [closures](./closures.md).

**6. Growing caches / maps**
Unbounded memoization caches. Use an **LRU** policy or **WeakMap**.

## WeakMap / WeakSet

Keys are held **weakly** — if nothing else references the key object, it (and its value) can be GC'd. Ideal for metadata keyed by DOM nodes/objects without preventing collection.
```js
const cache = new WeakMap();
cache.set(domNode, data); // does not keep domNode alive
```

## Detecting Leaks

* Chrome DevTools → Memory → heap snapshots (compare over time).
* Performance monitor → watch JS heap trend upward.
* Node: `--inspect`, `process.memoryUsage()`, heap snapshots.

## Interview Questions

1. How does garbage collection work in JS?
2. Name common causes of memory leaks.
3. What is a detached DOM node?
4. When would you use a `WeakMap`?
5. How do you detect a memory leak?

## Key Takeaways

* GC frees only **unreachable** objects.
* Top leak sources: timers, listeners, detached DOM, accidental globals, unbounded caches, retaining closures.
* `WeakMap`/`WeakSet` let you associate data without blocking collection.

Related: [closures](./closures.md), [event-loop](./event-loop.md), [variables-and-datatypes](./variables-and-datatypes.md).
