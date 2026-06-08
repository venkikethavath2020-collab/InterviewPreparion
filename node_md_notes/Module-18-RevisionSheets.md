# MODULE 18: NODE.JS REVISION SHEET

> Tiered for time available before the interview. Skim the level that fits.

---

# 🗓️ 1-DAY REVISION NOTES (deep but skimmable)

### Architecture
- **Node = V8 + libuv + core libs.** Runtime, not language/framework.
- Single-threaded **JS**; libuv thread pool (4) + OS async + worker_threads underneath.
- Non-blocking I/O: **network → epoll/kqueue/IOCP**, **fs/dns/crypto/zlib → thread pool**.
- V8: Parser → Ignition (bytecode) → TurboFan (optimize) → deopt. Hidden classes for fast prop access.
- Fast for I/O-bound, **bad for CPU-bound** → never block the event loop.

### Event Loop
- Phases: **timers → pending → poll → check(setImmediate) → close**.
- Priority: **sync → process.nextTick → Promise microtasks → macrotask phase**.
- Microtasks drain fully between every callback (Node ≥11).
- In I/O callbacks, **setImmediate beats setTimeout(0)**.

### Modules
- **CJS:** sync, value-copy, cached (→ Singleton), wrapper injects 5 vars.
- **ESM:** async, live bindings, static (tree-shaking), TLA. `import.meta.url` for __dirname.
- Resolution: core → path → node_modules. Circular: CJS partial / ESM live-binding (TDZ).

### Async
- Promise: pending→fulfilled/rejected (once). `.then`/`await` = microtasks.
- all (fail-fast) · allSettled (never rejects) · race (first settle) · any (first fulfill).
- Parallelize independent awaits with `Promise.all`. async fn always returns a Promise.

### Streams
- Chunked → constant memory. Types: Readable/Writable/Duplex/Transform.
- Backpressure: write()→false ⇒ wait 'drain'. Use **pipeline** (errors+cleanup).

### Memory
- Heap = New (Scavenge) + Old (Mark-Sweep-Compact). GC = reachability (handles cycles).
- Leaks: globals, unbounded caches, listeners, timers, closures. Detect: heap snapshots diff, --trace-gc.

### HTTP/Express
- req=Readable, res=Writable. 401 auth vs 403 authz. Sessions(stateful/Redis) vs JWT(stateless/short TTL+refresh).
- Express = middleware pipeline; order matters; error MW `(err,req,res,next)` last; wrap async (v4).

### DB
- Pool connections (size vs DB max across pods); release in finally. Parameterize (injection).
- Transactions ACID; indexes (B-tree, composite leftmost-prefix). Watch N+1.

### Security
- bcrypt/argon2 passwords. JWT: short TTL, httpOnly, validate alg/exp.
- CSRF→SameSite+tokens; XSS→escape+CSP+HttpOnly; SQLi→parameterize; Helmet; CORS explicit; rate limit→429.

### Scale
- 1 process = 1 core → cluster/PM2/replicas. Stateless → state in Redis/DB.
- Cache-aside+TTL; queues decouple+absorb spikes; CDN; replicas+pooling.
- cluster (processes+IPC) vs worker_threads (threads+shared memory/CPU).

---

# ⏳ 3-HOUR REVISION NOTES (core only)

1. **Node** = V8 + libuv. Single-threaded JS; thread pool (4) for fs/dns/crypto/zlib; OS async for network.
2. **Event loop:** timers→pending→poll→check→close; nextTick > promises > macrotasks.
3. **setImmediate** runs after poll (check); inside I/O it beats setTimeout(0).
4. **CJS vs ESM:** sync/value/cached vs async/live-binding/tree-shake.
5. **Promises:** microtasks; all/allSettled/race/any; Promise.all to parallelize.
6. **Streams:** constant memory; backpressure via write()→false→drain; use pipeline.
7. **Memory:** generational GC, mark-sweep, leaks from unbounded caches/listeners.
8. **HTTP:** req/res are streams; sessions vs JWT; cookie flags.
9. **Express:** middleware order; error MW 4 args; async wrap (v4).
10. **DB:** pooling, transactions, indexes, N+1, parameterize.
11. **Security:** bcrypt, JWT TTL, CSRF/XSS/SQLi defenses, Helmet, CORS, rate limit.
12. **Scale:** cluster/PM2 for cores, Redis for state/cache, queues for async, statelessness.
13. **Advanced:** EventEmitter sync + 'error' crashes; worker_threads CPU; UV_THREADPOOL_SIZE; libuv.
14. **Golden rule:** never block the event loop; profile before optimizing.

---

# ⚡ 30-MINUTE REVISION (last-minute)

- **Node:** JS runtime on V8 + libuv; event-driven, non-blocking I/O; single-threaded JS.
- **Thread pool (4):** fs, dns.lookup, crypto, zlib. **Network = OS async.** Tune `UV_THREADPOOL_SIZE`.
- **Event loop phases:** timers → pending → poll → check → close.
- **Priority:** sync → nextTick → promises → timers/setImmediate.
- **setImmediate > setTimeout(0)** inside I/O callbacks.
- **CJS** (sync, cached, value) vs **ESM** (async, live bindings, tree-shake).
- **Promise.all** (fail-fast), **allSettled** (all results), **race** (first settle), **any** (first fulfill).
- **Streams:** chunked, backpressure (write→false→drain), use **pipeline**.
- **GC:** New(scavenge)+Old(mark-sweep); leaks = unbounded caches/listeners.
- **401** auth vs **403** authz; **Sessions** (Redis) vs **JWT** (stateless, short TTL+refresh).
- **Express:** middleware order; error MW 4 args; async wrap in v4.
- **DB:** pool, transactions(ACID), indexes, N+1, parameterize.
- **Security:** bcrypt, JWT, CSRF(SameSite), XSS(CSP/escape), SQLi(params), Helmet, CORS, rate limit.
- **Scale:** cluster/PM2 (cores), Redis (cache/session), queues (async), stateless.
- **Never block the event loop.**

---

# 📋 GENERAL CHEAT SHEET

```
RUNTIME      V8 (JIT) + libuv (loop+pool) + core libs
THREADS      JS main thread + pool(4) + OS async + worker_threads
THREAD POOL  fs, dns.lookup, crypto(pbkdf2/scrypt), zlib
OS ASYNC     net/http/tcp (epoll/kqueue/IOCP)
EXIT WHEN    no timers + no pending I/O + no active handles
CPU WORK     worker_threads / queue / separate service (don't block!)
SCALE CORES  cluster / PM2 -i max / K8s replicas
STATE        Redis (sessions, cache, pub/sub, rate limit, queues)
```

---

# 🔄 EVENT LOOP CHEAT SHEET

```
        ┌──────────────────────────────┐
   ┌───►│ 1 TIMERS    setTimeout/Interval│
   │    ├──────────────────────────────┤
   │    │ 2 PENDING   deferred sys cbs  │
   │    ├──────────────────────────────┤
   │    │ 3 POLL      I/O callbacks     │  ← most work; may block here
   │    ├──────────────────────────────┤
   │    │ 4 CHECK     setImmediate      │
   │    ├──────────────────────────────┤
   │    │ 5 CLOSE     'close' events    │
   └────┴──────────────────────────────┘
  After each callback/phase: drain nextTick queue → then Promise microtasks

PRIORITY:  sync code → process.nextTick → Promises → (next macrotask phase)

main module: setTimeout(0) vs setImmediate = NON-DETERMINISTIC
inside I/O:  setImmediate ALWAYS before setTimeout(0)
nextTick recursion → STARVES the loop (I/O never runs)
```

---

# 🌊 STREAMS CHEAT SHEET

```
TYPES     Readable | Writable | Duplex | Transform
READABLE  on('data'/'end'/'error'); for await (chunk of rs); push(null)=EOF
WRITABLE  write()→false ⇒ backpressure; once('drain') to resume; end()
BACKPRESS fast producer + slow consumer → pause until drain
PIPE      readable.pipe(transform).pipe(writable)  // no error handling!
PIPELINE  await pipeline(src, gzip, dst)            // errors + cleanup ✅
HWM       highWaterMark = buffer threshold (64KB fs default)
OBJECTMODE counts items not bytes
USE CASE  huge files, HTTP req/res, compression, encryption, CSV/JSON
```

---

# 🚇 EXPRESS CHEAT SHEET

```
app.use(mw)                application-level middleware
mw signature               (req, res, next) — call next() or respond
error mw                   (err, req, res, next) — 4 args, register LAST
order                      helmet → cors → json → logger → routes → 404 → error
req                        params (/:id) | query (?a=1) | body (parsed) | headers | cookies
res                        status() | json() | send() | set() | end()  (headers before body)
async v4                   wrap: fn=>(req,res,next)=>Promise.resolve(fn(...)).catch(next)
async v5                   auto-forwarded to error mw
auth flow                  authenticate(401) → authorize(403) → handler
router                     express.Router(); app.use('/api', router)
```

---

# 🔐 SECURITY CHEAT SHEET

```
AUTHN(401)  who are you   → bcrypt/argon2 passwords, JWT/OAuth/session
AUTHZ(403)  what can you  → RBAC/ABAC middleware
PASSWORDS   bcrypt(cost 12)/argon2 — salted, slow; NEVER sha256/md5/plaintext
JWT         short TTL(15m)+refresh; httpOnly cookie; validate alg(no 'none')/exp/iss/aud
SESSIONS    Redis store (shared) to scale horizontally
CSRF        SameSite cookies + CSRF token; check Origin; header-token APIs immune
XSS         escape output + CSP header + HttpOnly cookies; sanitize; no innerHTML/eval
SQLi        parameterized queries / prepared statements; least-priv DB user
NoSQLi      validate/cast types ({$gt:''} attacks)
CORS        explicit origins (not * with credentials); preflight OPTIONS
HELMET      CSP, HSTS, X-Content-Type-Options, X-Frame-Options, hide X-Powered-By
RATE LIMIT  per IP/user/window → 429 + Retry-After; Redis for distributed
HARDENING   input validation (Zod/Joi), body size limit, secrets in vault,
            npm audit, hide stack traces, HTTPS/TLS everywhere, no eval/user-input shell
```

---

# 🧠 MEMORY/GC CHEAT SHEET

```
STACK   primitives + refs + frames (auto)
HEAP    objects/closures/arrays (GC)
NEW     Scavenge (fast, frequent) → promote after ~2 GCs
OLD     Mark-Sweep-Compact (slower)
GC      reachability from roots (collects cycles)
LEAKS   globals, unbounded cache/Map, listeners, timers, closures, unclosed streams
DETECT  process.memoryUsage(), heap snapshots diff, --trace-gc, clinic, 0x
FIX     LRU+TTL, WeakMap, remove listeners, clear timers, --max-old-space-size
LAG     perf_hooks.monitorEventLoopDelay() → blocking/GC indicator
```

---

# 🚀 SCALABILITY CHEAT SHEET

```
VERTICAL    bigger box (limited)
HORIZONTAL  more instances (needs STATELESS)
CORES       cluster / PM2 -i max / K8s replicas (1 process = 1 core)
CPU TASK    worker_threads + pool (Piscina)
LB          round-robin/least-conn/IP-hash; L4 vs L7; TLS at LB
CACHE       browser→CDN→proxy→app(LRU)→Redis→DB; cache-aside+TTL
REDIS       cache, sessions, pub/sub, rate limit, queues, locks
QUEUE       Kafka/SQS/BullMQ → decouple, absorb spikes, retries, DLQ
DB          replicas(read), sharding, pooling
RESILIENCE  retries+backoff, circuit breaker, bulkhead, timeouts, graceful shutdown
```

---

# 🎯 FINAL ONE-LINERS (memorize)
- "Node is single-threaded for JS but multi-threaded under the hood via libuv."
- "Never block the event loop — offload CPU work to workers."
- "Network I/O uses OS async; file/crypto/dns/zlib use the thread pool."
- "nextTick > promises > timers/setImmediate."
- "Use pipeline over pipe for backpressure + error handling."
- "Stateless services + Redis = horizontal scale."
- "Parameterize queries, bcrypt passwords, short-lived JWTs."
- "Measure before you optimize."

---

✅ **ALL 18 MODULES COMPLETE.**
