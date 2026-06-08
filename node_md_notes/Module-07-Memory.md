# MODULE 7: MEMORY MANAGEMENT

---

## 1. Stack vs Heap Memory
| | Stack | Heap |
|---|-------|------|
| Stores | Primitives, references, call frames | Objects, arrays, closures, strings |
| Speed | Very fast | Slower |
| Size | Small, fixed | Large |
| Management | Auto (pop on return) | **Garbage Collected** |
| Lifetime | Function scope | Until unreachable |

```
let n = 5;            // n → stack
let o = {a:1};        // o(ref) → stack, {a:1} → heap
```

---

## 2. V8 Memory Structure (Generational Heap)
V8 splits the heap by the **generational hypothesis**: *most objects die young*.
```
┌──────────────────── V8 HEAP ─────────────────────┐
│  NEW SPACE (Young Gen)  ~1-8MB, two semi-spaces   │
│    └─ Scavenge GC: fast, frequent (Cheney's algo) │
│  OLD SPACE (Old Gen)    large, long-lived objects │
│    └─ Mark-Sweep-Compact: slower, less frequent   │
│  Large Object Space · Code Space · Map Space ...  │
└────────────────────────────────────────────────────┘
+ Off-heap: Buffers, external C++ memory
```
- **New Space:** new objects. Collected by **Scavenge** (copy survivors between two semi-spaces). Objects surviving ~2 GCs are **promoted** to Old Space.
- **Old Space:** survivors. Collected by **Mark-Sweep-Compact** (major GC).

---

## 3. Garbage Collection
**Definition:** Automatic reclamation of heap memory that's no longer **reachable** from roots (global, stack, active closures).

**V8 GC types:**
- **Scavenge (minor):** young gen, fast, frequent, parallel.
- **Mark-Sweep-Compact (major):** old gen, slower; runs incrementally/concurrently to reduce pauses.
- **Orinoco:** V8's modern concurrent/parallel GC reducing "stop-the-world" pauses.

---

## 4. Mark and Sweep (Core Algorithm)
```
1. MARK:  start from roots → traverse all reachable objects → mark them "alive"
2. SWEEP: scan heap → any UNMARKED object is garbage → free it
3. COMPACT (old gen): move survivors together → defragment memory
```
```
Roots ──► A ──► B      C (no ref)   D ──► E
         marked marked  UNMARKED → swept
```
**Reachability, not reference counting:** V8 uses reachability, so **circular references are collected** as long as the cycle is unreachable from roots (unlike naive refcounting).

---

## 5. Memory Leaks
**Definition:** Memory that's no longer needed but stays **reachable**, so GC can't free it → heap grows until OOM crash (`JavaScript heap out of memory`).

**Top causes in Node:**
1. **Global variables** holding growing data.
2. **Unbounded caches / Maps** (no eviction) — classic.
3. **Event listeners not removed** (`emitter.on` in a loop) → `MaxListenersExceededWarning`.
4. **Closures** capturing large objects that outlive their need.
5. **Timers** (`setInterval`) never cleared, referencing data.
6. **Detached references** kept in arrays/maps after use.
7. **Streams** not closed/destroyed.

```js
// ❌ leak: cache grows forever
const cache = {};
app.get('/u/:id', (req,res) => { cache[req.params.id] = bigObject; });
// ✅ bounded: LRU with max size / TTL (lru-cache), or WeakMap for object keys
```
**`WeakMap`/`WeakSet`:** keys are weakly held → GC can collect them → great for metadata caches that shouldn't prevent collection.

---

## 6. Detecting Leaks
**Symptoms:** RSS/heap grows monotonically; GC runs more often; latency spikes; eventual OOM.

**Tools & techniques:**
```js
console.log(process.memoryUsage());
// { rss, heapTotal, heapUsed, external, arrayBuffers }
```
- **`--inspect`** + Chrome DevTools → take **heap snapshots**, compare over time, look for growing retained sizes.
- **Heap snapshots diff:** snapshot → run load → snapshot → compare; growing object counts = leak source.
- **`clinic doctor` / `clinic heapprofiler`**, `heapdump`, `node --heapsnapshot-signal=SIGUSR2`.
- **`--max-old-space-size=N`** to cap heap (and surface leaks faster in test).
- Watch RSS in production (Prometheus/Grafana, container memory metrics).

| `memoryUsage()` field | Meaning |
|------------------------|---------|
| `rss` | Total process memory (Resident Set Size) |
| `heapTotal` | V8 heap allocated |
| `heapUsed` | V8 heap actually used |
| `external` | C++ objects bound to JS (Buffers) |
| `arrayBuffers` | ArrayBuffer/Buffer memory |

---

## 7. Profiling (Performance + Memory)
- **CPU profiling:** `node --prof` → process with `--prof-process`; or `--inspect` → DevTools Profiler / flame graphs (`clinic flame`, `0x`).
- **Memory profiling:** heap snapshots + allocation timeline.
- **Event loop lag:** measure with `perf_hooks` `monitorEventLoopDelay()` — high lag = blocking or GC pressure.
- **`--trace-gc`** logs every GC (frequency/duration → memory pressure).

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';
const h = monitorEventLoopDelay(); h.enable();
setInterval(() => console.log('p99 lag ms', h.percentile(99) / 1e6), 5000);
```

---

## 8. Production Examples
- **Leak:** A request-scoped object pushed into a module-level array on every request → heap climbs → pod OOMKilled every few hours. Fix: remove the array / bound it / use request scope.
- **Listener leak:** Adding `db.on('error', ...)` inside a per-request handler → thousands of listeners. Fix: attach once at startup.
- **Cache leak:** In-memory cache without TTL grows with unique keys (e.g., per-user URLs). Fix: `lru-cache` with `max`+`ttl`, or Redis.
- **Big heap tuning:** Container has 2GB; set `--max-old-space-size=1536` so V8 GCs before the container OOMKills the process.

---

## PRACTICE QUESTIONS
**🟢:** Stack vs heap? · What is GC? · What's a memory leak?
**🟡:** New vs Old space? · Scavenge vs Mark-Sweep? · Common leak causes in Node? · `process.memoryUsage()` fields?
**🔴:** How does mark-and-sweep handle circular refs? · WeakMap vs Map for caches? · Generational hypothesis? · How to take/diff a heap snapshot? · Tune V8 heap in a container.
**🧩:** Pod OOMKilled every 3h — debug methodology (snapshots, RSS trend, --trace-gc). · Latency spikes correlate with GC — fix (reduce allocations, cap heap). · Choose a cache that won't leak.

## ⚡ REVISION
- Heap = New (Scavenge) + Old (Mark-Sweep-Compact). Most objects die young → promotion after ~2 GCs.
- GC = reachability from roots (handles cycles).
- Leaks = still-reachable-but-unneeded: globals, unbounded caches, listeners, timers, closures.
- Detect: `memoryUsage()`, heap snapshots diff, `--trace-gc`, clinic.
- Tune: `--max-old-space-size`; use WeakMap/LRU.

➡️ Next: **Module 8 — HTTP & Web Servers.**
