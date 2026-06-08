# MODULE 15: ADVANCED NODE.JS

---

## 1. EventEmitter Internals
- Maintains `_events`: a map of `eventName → listener | listener[]`.
- `emit(name, ...args)` calls every listener **synchronously**, in registration order, on the current stack.
- `on` appends; `prependListener` adds to front; `once` wraps the listener to self-remove after firing.
- `_maxListeners` default **10** → warning beyond (leak detector), tune with `setMaxListeners`.
- Special `'error'` event: if emitted with **no listener**, it **throws** → uncaught exception → crash.
- `'newListener'`/`'removeListener'` meta-events fire on listener changes.
```js
emitter.emit('e');   // ≈ for (const l of _events['e']) l.call(this, ...args)
```
**Memory leak source:** adding listeners in hot paths without removing.

---

## 2. Streams Internals (Recap + Depth)
- Built on internal buffers + the EventEmitter.
- **Readable:** you implement `_read(size)`, call `push(chunk)`; `push` returns `false` when buffer ≥ `highWaterMark` (stop reading); `push(null)` = EOF.
- **Writable:** you implement `_write(chunk, enc, cb)`; call `cb()` when consumed; buffering tracked vs `highWaterMark`; `'drain'` fires when buffer empties.
- **Backpressure** = the interplay of these return values pausing fast producers.
- **Object mode** counts items not bytes.
- `pipeline()`/`finished()` manage lifecycle + errors + cleanup (always prefer over raw `.pipe`).

---

## 3. V8 Optimization
- **JIT:** Ignition (bytecode) → TurboFan (optimized machine code for hot functions).
- **Hidden classes / shapes:** keep object shapes stable & property order consistent → fast property access & inline caches.
- **Inline caching:** caches property location after first access; monomorphic (one shape) > polymorphic > megamorphic.
- **Deoptimization:** type changes, `arguments` misuse, `try/catch` in hot loops (historically), `delete` — avoid in hot paths.
- **Tips:** initialize all props in constructor; avoid mixed-type arrays; avoid changing variable types; prefer `for` over some functional hot loops if profiling shows need.
- **Flags:** `--max-old-space-size`, `--prof`, `--trace-opt`, `--trace-deopt`.

---

## 4. libuv (The Engine Room)
**Definition:** Cross-platform C library providing Node's **event loop, async I/O, thread pool, timers, and OS abstraction**.
```
libuv responsibilities:
- Event loop (6 phases)
- Async network I/O via epoll/kqueue/IOCP (NO thread pool)
- File I/O, DNS, crypto, zlib via THREAD POOL
- Timers, signals, child processes, TTY
```
- **Network I/O** → OS event notification (scalable, no thread per connection).
- **File/DNS/crypto/zlib** → thread pool (no portable async OS API).

---

## 5. Thread Pool
- Default **4** threads; configure with `UV_THREADPOOL_SIZE` (1–1024), set **before** Node starts.
- Used by: `fs.*`, `dns.lookup` (not `dns.resolve`), `crypto.pbkdf2/scrypt/randomBytes(async)`, `zlib`.
- **Saturation symptom:** exactly N concurrent heavy ops, rest queue → latency. Tune size to cores/workload.
```bash
UV_THREADPOOL_SIZE=8 node app.js
```

---

## 6. Worker Threads (Deep)
- True JS parallelism in one process; each worker = own V8 **isolate** + event loop + microtask queue.
- Communication: `postMessage` (structured clone — copies), `MessageChannel`, or **`SharedArrayBuffer`** (shared memory, use `Atomics` for sync).
- Cost: ~MBs + startup time → use a **pool** (Piscina) and reuse workers.
- Use for CPU-bound: hashing, image/video, compression, parsing, ML inference.
```js
new Worker(file, { workerData });
// shared memory:
const sab = new SharedArrayBuffer(1024);
const view = new Int32Array(sab);
Atomics.add(view, 0, 1);
```

---

## 7. Cluster Internals
- `cluster.fork()` uses `child_process.fork` → separate **processes** (own memory, V8, loop).
- The primary creates a listening socket; on Linux uses **round-robin** to hand connections to workers (`SCHED_RR`), or workers share the handle.
- IPC channel between primary↔workers (`worker.send`/`process.on('message')`).
- No shared memory → coordinate via Redis/DB. Use PM2/K8s in practice.
- **cluster vs worker_threads:** processes+IPC (isolation, crash safety) vs threads+shared memory (cheaper, CPU parallelism, one crash can affect process).

---

## 8. Native Addons (N-API)
**Definition:** C/C++ modules callable from JS — for performance-critical code or binding native libraries.
- **N-API / node-addon-api:** ABI-stable C API → addons survive Node version upgrades (no recompile).
- Built with `node-gyp`; loaded via `require('./build/Release/addon.node')`.
- Alternatives: **WebAssembly** (portable, sandboxed), **FFI**.
- Use when JS is too slow and `worker_threads` isn't enough (e.g., `bcrypt`, `sharp`, `sqlite3` are native addons).

---

## 9. Event Loop Internals (Master Recap)
```
Phases: timers → pending → idle/prepare → poll → check → close
Between every phase & callback (Node ≥11): drain nextTick queue, then microtask (Promise) queue
Poll phase: executes I/O callbacks; blocks (waits) for I/O if no timers due; decides loop liveness
Process exits when: no timers, no pending I/O, no active handles/requests (no `ref`'d work)
```
- `ref`/`unref`: an `unref`'d timer/handle won't keep the process alive.
- **Event loop lag** (`perf_hooks.monitorEventLoopDelay`) = blocking or GC pressure indicator.

---

## PRACTICE QUESTIONS
**🟢:** What is libuv? · What is the thread pool / default size? · What is N-API?
**🟡:** EventEmitter internals (sync? max listeners? error event)? · cluster vs worker_threads internals. · How does Readable.push signal backpressure? · Which ops use the thread pool?
**🔴:** How does network I/O avoid the thread pool (epoll/kqueue/IOCP)? · Causes of V8 deopt & how to keep code monomorphic. · SharedArrayBuffer + Atomics for worker sync. · How does cluster distribute connections? · When native addon vs WASM vs worker_threads?
**🧩:** App blocks on crypto at 4 concurrent — tune (UV_THREADPOOL_SIZE / workers). · Need 4× throughput on CPU task — workers + pool. · One crash kills all users — cluster for isolation. · Diagnose event-loop lag spikes (GC vs blocking).

## ⚡ REVISION
- libuv = event loop + async I/O + thread pool (4, `UV_THREADPOOL_SIZE`).
- Network → OS async; fs/dns/crypto/zlib → thread pool.
- EventEmitter: sync emit, max 10 listeners, unhandled 'error' crashes.
- worker_threads = CPU parallelism + SharedArrayBuffer/Atomics; cluster = processes + IPC.
- V8: stable shapes, monomorphic, avoid deopt. N-API for native speed.

➡️ Next: **Module 16 — System Design.**
