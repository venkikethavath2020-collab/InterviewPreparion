# MODULE 17: NODE.JS INTERVIEW MASTER SECTION

> Format: **Q — concise answer** · *(Why asked / Follow-up)* where useful. Use this as rapid Q&A drilling.

---

## PART A — TOP 100 NODE.JS INTERVIEW QUESTIONS

### Fundamentals (1–20)
1. **What is Node.js?** A JS runtime on V8 with event-driven, non-blocking I/O. *(FU: language or framework? → neither)*
2. **Is Node single-threaded?** Your JS is; libuv has a 4-thread pool + OS async + worker_threads.
3. **What is V8?** Google's C++ JS engine, JIT-compiles JS to machine code.
4. **What is libuv?** C library: event loop + async I/O + thread pool.
5. **Engine vs runtime?** Engine runs JS; runtime adds host APIs + event loop + queues.
6. **Why is Node fast?** V8 JIT + non-blocking I/O + event loop, low per-connection cost. *(FU: when slow? → CPU-bound)*
7. **Blocking vs non-blocking?** Wait-until-done vs return-immediately + callback.
8. **Event-driven architecture?** Flow driven by events; handlers run on emit (EventEmitter).
9. **What runs on the thread pool?** fs, dns.lookup, crypto(pbkdf2/scrypt), zlib. Network does NOT.
10. **Default thread pool size?** 4; `UV_THREADPOOL_SIZE` (max 1024).
11. **What is the event loop?** libuv loop running queued callbacks when stack is empty.
12. **Event loop phases?** timers → pending → poll → check → close.
13. **process.nextTick vs setImmediate?** nextTick runs before promises & before loop continues; setImmediate in check phase.
14. **setTimeout(0) vs setImmediate?** Non-deterministic in main; setImmediate first inside I/O callbacks.
15. **Microtask vs macrotask?** Promises/nextTick (drained fully each tick, high priority) vs timers/I/O/setImmediate.
16. **What is the call stack?** LIFO of function frames; one per thread.
17. **Stack vs heap?** Primitives/refs/frames vs objects (GC-managed).
18. **Browser vs Node?** Same V8, different host (no DOM in Node, `global` vs `window`, diff event loops).
19. **What is globalThis?** Standard global ref working in both.
20. **When does a Node process exit?** When no pending timers/I/O/handles remain.

### Modules (21–30)
21. **CommonJS vs ESM?** sync/value-copy/cached vs async/live-bindings/static/tree-shakeable.
22. **module.exports vs exports?** exports is a ref; reassigning it breaks the export.
23. **What is the module wrapper?** Injects exports, require, module, __filename, __dirname + scope.
24. **What is module caching?** Module runs once; cached exports → enables Singleton.
25. **Module resolution order?** core → path → node_modules (walk up).
26. **Circular dependencies?** CJS returns partial exports; ESM uses live bindings (TDZ risk).
27. **Dynamic import?** `import()` returns a Promise; lazy/conditional, load ESM in CJS.
28. **How to get __dirname in ESM?** `fileURLToPath(import.meta.url)`.
29. **Tree-shaking — why ESM only?** Static structure analyzable at build time.
30. **Top-level await?** ESM only.

### Async (31–45)
31. **Error-first callback?** `(err, data) => {}` convention.
32. **Callback hell + fix?** Nesting; fix with promises/async-await.
33. **Promise states?** pending → fulfilled/rejected, settles once.
34. **Where do .then callbacks run?** Microtask queue.
35. **async/await internals?** Sugar over promises; continuation after await = microtask.
36. **Sequential vs parallel awaits?** Use `Promise.all` for independent ops.
37. **Promise.all vs allSettled?** Fail-fast vs never-rejects (all results).
38. **race vs any?** First settle (incl. reject) vs first fulfill.
39. **unhandledRejection behavior?** Crashes by default (Node 15+).
40. **promisify?** util.promisify converts error-first callback → promise.
41. **What is a thenable?** Object with `.then`; adopted by await.
42. **Can await block other requests?** No — only pauses its own async function.
43. **Microtask starvation?** Flood of promises/nextTick can starve I/O.
44. **try/catch with promises?** Works with await; not around non-awaited promises.
45. **finally use?** Cleanup regardless of outcome.

### Streams/Buffers (46–55)
46. **What is a stream / why?** Chunked processing → constant memory, lower latency.
47. **Stream types?** Readable, Writable, Duplex, Transform.
48. **What is backpressure?** Flow control: slow consumer pauses fast producer (write→false→drain).
49. **pipe vs pipeline?** pipeline handles errors + cleanup → preferred.
50. **highWaterMark?** Internal buffer threshold (default 64KB fs).
51. **Read a 50GB file?** Streams (createReadStream) / readline.
52. **Transform stream example?** gzip, uppercase, CSV→JSON.
53. **Buffer vs string?** Raw binary off-heap vs text.
54. **alloc vs allocUnsafe?** Zero-filled safe vs fast-but-may-leak-old-memory.
55. **Where are Buffers stored?** Off the V8 heap.

### HTTP/Express (56–70)
56. **How does Node handle a request?** TCP → llhttp parse → 'request' event → handler → res stream.
57. **Is req/res a stream?** req=Readable, res=Writable.
58. **401 vs 403?** Not authenticated vs not authorized.
59. **Idempotent methods?** GET, PUT, DELETE (not POST/PATCH).
60. **Sessions vs JWT?** Stateful (Redis to scale) vs stateless (short TTL + refresh).
61. **Cookie security flags?** HttpOnly, Secure, SameSite.
62. **What is Express?** Middleware pipeline over http.
63. **What is middleware?** `(req,res,next)`; runs in order; next() passes control.
64. **Error middleware?** 4 args `(err,req,res,next)`, registered last.
65. **Async errors in Express 4?** Wrap with `.catch(next)` (Express 5 auto).
66. **req.params vs query vs body?** URL params vs ?query vs parsed body.
67. **Why middleware order matters?** Body parser before routes; auth before handler.
68. **CORS?** Browser cross-origin control via Access-Control headers.
69. **Helmet?** Sets secure HTTP headers.
70. **Rate limiting?** Cap req/window → 429; Redis for distributed.

### DB/Security/Scale (71–90)
71. **Connection pooling — why?** Reuse warm connections; opening is expensive.
72. **Pool sizing risk?** Workers × pool > DB max_connections → exhaustion.
73. **What is a transaction?** Atomic all-or-nothing (ACID).
74. **Isolation levels?** Read Committed → Repeatable Read → Serializable.
75. **What is an index?** B-tree speeding reads, slowing writes.
76. **N+1 problem?** Query per item; fix with JOIN/eager load/DataLoader.
77. **SQL injection fix?** Parameterized queries.
78. **Password storage?** bcrypt/argon2 (slow, salted), never sha256.
79. **JWT pitfalls?** Reject alg:none, short TTL, httpOnly cookie, no secrets in payload.
80. **CSRF defense?** SameSite cookies + CSRF tokens.
81. **XSS defense?** Escape output + CSP + HttpOnly.
82. **Vertical vs horizontal scaling?** Bigger box vs more boxes (needs statelessness).
83. **Clustering?** N processes (one/core) sharing a port.
84. **cluster vs worker_threads?** Processes+IPC vs threads+shared memory (CPU).
85. **Why must services be stateless?** So any instance serves any request (scale).
86. **Caching pattern?** Cache-aside + TTL.
87. **Redis use cases?** Cache, sessions, pub/sub, rate limit, queues.
88. **Load balancing algorithms?** Round-robin, least-conn, IP-hash.
89. **Message queue benefits?** Decouple, absorb spikes, async, retries.
90. **CDN role?** Cache static assets at edge.

### Advanced/Testing/Patterns (91–100)
91. **EventEmitter internals?** Sync emit, default 10 listeners, unhandled 'error' crashes.
92. **V8 hidden classes?** Shapes for fast property access; keep them stable.
93. **What causes deopt?** Type changes, inconsistent shapes, delete in hot path.
94. **N-API?** ABI-stable C API for native addons.
95. **Testing pyramid?** Many unit, some integration, few E2E.
96. **Mock vs stub vs spy?** Records+asserts / canned returns / wraps real.
97. **Supertest?** HTTP endpoint testing without a live server.
98. **Singleton in Node?** Module cache gives it free.
99. **Dependency Injection?** Inject deps for loose coupling + testability.
100. **Observer pattern in Node?** EventEmitter.

---

## PART B — TOP 50 ADVANCED QUESTIONS
1. Trace exact output of mixed nextTick/promise/setTimeout/setImmediate code.
2. Why is setImmediate deterministic inside I/O but not in main module?
3. How does network I/O avoid the thread pool (epoll/kqueue/IOCP)?
4. Explain microtask checkpoint and Node 11+ draining-between-callbacks change.
5. How does nextTick starve the event loop?
6. ESM 3 phases (construction/instantiation/evaluation) + live bindings.
7. CJS vs ESM circular dependency behavior in depth.
8. How does require() cache work and break (path/casing/multiple copies)?
9. Implement promisify from scratch.
10. Implement a basic Promise (states + then + microtask scheduling).
11. Backpressure end-to-end with push()/write() return values.
12. Implement a Transform stream + object mode.
13. How does pipeline differ from pipe in error/cleanup handling?
14. V8 generational GC: scavenge vs mark-sweep-compact.
15. How does mark-and-sweep handle circular references?
16. Detect & diff heap snapshots to find a leak.
17. WeakMap vs Map for caches.
18. Tune --max-old-space-size in a container vs OOMKill.
19. Monomorphic vs polymorphic vs megamorphic functions & inline caches.
20. SharedArrayBuffer + Atomics for worker synchronization.
21. Worker pool design (Piscina) and when to use it.
22. cluster connection distribution (round-robin/SCHED_RR) internals.
23. cluster vs worker_threads vs child_process — choose for a scenario.
24. N-API vs WASM vs FFI trade-offs.
25. ref/unref and process liveness.
26. Event loop lag measurement (perf_hooks) & root causes.
27. Idempotency key design for payments.
28. Saga/outbox pattern vs 2PC for distributed transactions.
29. Distributed rate limiting with Redis (token bucket).
30. Distributed locks (Redlock) caveats.
31. Cache invalidation + thundering herd mitigation.
32. JWT revocation strategies (blocklist vs short TTL + refresh rotation).
33. OAuth Authorization Code + PKCE flow.
34. Webhook reliability + signature verification + idempotent processing.
35. WebSocket scaling across instances (Redis adapter).
36. Preventing overselling under flash sale (atomic/optimistic locking).
37. Connection pool sizing math vs DB max_connections across pods.
38. Read replicas + replication lag handling.
39. Graceful shutdown (drain connections, close server, finish in-flight).
40. Zero-downtime deploys (rolling, SIGTERM handling).
41. Streaming JSON parse of huge payloads.
42. Avoiding event-loop blocking on JSON.parse/stringify of large objects.
43. AsyncLocalStorage for request context/tracing.
44. Structured clone vs serialization cost in worker messaging.
45. TLS termination at LB vs in Node.
46. HTTP keep-alive + agent pooling for outbound requests.
47. Circuit breaker + retry-with-backoff + bulkhead patterns.
48. CQRS / event sourcing in Node services.
49. Memory-efficient streaming uploads/downloads (multipart).
50. Observability: logs/metrics/traces + correlation IDs.

---

## PART C — TOP 25 SCENARIO-BASED QUESTIONS
1. One endpoint slows the whole service → blocking event loop (sync crypto/big JSON/sync fs). Diagnose with event-loop lag + profiler.
2. Image processing collapses throughput → worker_threads/queue/separate service.
3. Exactly 4 concurrent file ops max out → UV_THREADPOOL_SIZE.
4. Sessions break after adding a 2nd instance → move to Redis store.
5. Async route throws, client hangs (Express 4) → wrap `.catch(next)`.
6. Cannot set headers after sent → response sent twice / write before setHeader.
7. DB connections exhausted under load → pool too small or leaked (release in finally).
8. List endpoint fires 100 queries → N+1; fix with JOIN/eager load.
9. App OOMKilled every few hours → memory leak; heap snapshot diff.
10. Latency spikes correlate with GC → reduce allocations / cap heap.
11. Fast producer OOMs app → no backpressure; use pipeline.
12. Need to read 50GB file → streams + readline.
13. CPU task needs 4× throughput → worker pool.
14. One crash kills all users → cluster/PM2 for process isolation + restart.
15. Brute-force on /login → rate limit + lockout + bcrypt.
16. Double charge on retry → idempotency keys + ACID.
17. Messages lost when recipient on another WS server → Redis pub/sub adapter.
18. Overselling in flash sale → atomic decrement / optimistic lock / reservation.
19. Webhook processed twice → idempotent handler + signature verify.
20. Notification duplicates → idempotency key + at-least-once dedup.
21. Mixing CJS & ESM breaks imports → interop strategy / dynamic import.
22. Circular dep returns undefined → restructure / lazy require.
23. Slow query under load → add index, verify with EXPLAIN ANALYZE.
24. Deploy causes dropped requests → graceful shutdown (SIGTERM drain).
25. Logs leak stack traces/PII in prod → sanitize errors, structured logging.

---

## PART D — TOP 25 DEBUGGING QUESTIONS
1. How to debug a Node app? `--inspect` + Chrome DevTools / VS Code debugger.
2. Find a memory leak? Heap snapshots diff, --trace-gc, clinic heapprofiler.
3. Find what blocks the event loop? perf_hooks event-loop delay, --prof, clinic flame/0x.
4. Debug high CPU? CPU profiler / flame graph.
5. Debug an unhandled rejection? Stack trace, `process.on('unhandledRejection')`, async stack traces.
6. Debug "Cannot set headers after sent"? Find double response / write-then-header.
7. Debug a hanging request? Missing next()/res.end, unresolved promise, missing await.
8. Debug thread pool saturation? UV_THREADPOOL_SIZE + check fs/crypto load.
9. Debug DB connection exhaustion? Log pool stats, find unreleased connections.
10. Debug intermittent failures? Logs + correlation IDs + distributed tracing.
11. Reproduce a prod-only bug? Load test, mirror env, feature flags.
12. Debug a flaky test? Isolate state, fake timers, remove order dependence.
13. Inspect a running process? `kill -SIGUSR1` (inspector), heapsnapshot signal.
14. Debug native addon crash? core dumps, llnode, --abort-on-uncaught-exception.
15. Debug WebSocket disconnects? Heartbeats, proxy timeouts, backpressure.
16. Trace slow endpoint? APM (OpenTelemetry), span timing.
17. Debug GC pauses? --trace-gc, allocation profiling.
18. Find which dependency is vulnerable? `npm audit`, lockfile.
19. Debug "EADDRINUSE"? Port already bound; find/kill process.
20. Debug "ECONNRESET"? Peer closed connection; keep-alive/timeout tuning.
21. Debug high RSS but low heapUsed? Off-heap (Buffers/external) growth.
22. Debug event emitter leak warning? Count listeners; remove in cleanup.
23. Debug stuck on `await`? Promise never settles; add timeout (race).
24. Debug async context loss? AsyncLocalStorage.
25. Debug deopt? --trace-deopt, stabilize object shapes.

---

## PART E — TOP 25 PERFORMANCE QUESTIONS
1. Why is my Node app slow? Likely event-loop blocking; profile first.
2. How to not block the event loop? Async I/O, offload CPU to workers, chunk work.
3. Parallelize independent async ops? Promise.all.
4. Speed up DB access? Pooling, indexes, caching, avoid N+1.
5. Reduce latency on reads? Cache-aside (Redis), CDN, replicas.
6. Use all CPU cores? cluster/PM2/replicas + worker_threads for CPU.
7. Tune thread pool? UV_THREADPOOL_SIZE for heavy fs/crypto.
8. Stream large responses? createReadStream + pipeline (constant memory).
9. Reduce GC pressure? Fewer allocations, reuse buffers, object pools.
10. Faster JSON for big payloads? Stream parse, avoid sync stringify, fast-json-stringify.
11. Keep-alive for outbound HTTP? Reuse agents/sockets.
12. Compression? gzip/brotli (zlib) at proxy or app.
13. Reduce cold start (serverless)? Smaller deps, lazy init, provisioned concurrency.
14. Cache HTTP responses? ETag/Cache-Control, CDN.
15. Batch DB writes? Bulk insert, pipelining.
16. Avoid memory bloat from caches? LRU + TTL, WeakMap.
17. Improve throughput under spikes? Queue + autoscale workers.
18. Reduce p99 latency? Remove blocking, tune GC, connection reuse, timeouts.
19. Optimize hot functions? Monomorphic, stable shapes, avoid deopt.
20. Profile production safely? Sampling profiler, low-overhead APM.
21. Lower TLS overhead? Session resumption, terminate at LB.
22. Reduce payload size? Pagination, field selection, compression.
23. Speed up startup? Defer non-critical init, V8 snapshots.
24. Backpressure to protect memory? pipeline + bounded queues.
25. Measure before optimizing? Always benchmark/profile (autocannon, clinic).

---

## PART F — TOP 25 PRODUCTION ISSUES QUESTIONS
1. App crashes on uncaught exception → handle, log, exit & restart (PM2/K8s); don't keep running corrupt state.
2. Memory grows until OOMKill → leak; snapshot diff; bound caches.
3. Event loop blocked → offload CPU; find sync calls.
4. DB connection pool exhausted → size pool, release connections, add timeouts.
5. Thundering herd on cache expiry → jittered TTL, lock/single-flight, stale-while-revalidate.
6. Cascading failures → circuit breaker, timeouts, bulkheads.
7. Slow deploy drops requests → graceful shutdown on SIGTERM.
8. Sessions lost after scaling → centralize in Redis.
9. Duplicate processing → idempotency keys.
10. Rate limit bypass across instances → distributed (Redis) limiter.
11. Redis down takes app down → treat cache as optional; fallback to DB.
12. Webhook storms / retries → idempotent + dedup + DLQ.
13. Replication lag serves stale reads → read-your-writes routing / primary reads.
14. Log volume explosion → sampling, levels, structured logs.
15. Secret leaked in logs/repo → vault, rotate, scrub.
16. Unbounded request body → DoS; set size limits.
17. Hot partition/shard → better partition key.
18. Clock skew breaks JWT exp → NTP, leeway.
19. File descriptor exhaustion → ulimit, close sockets/streams.
20. Zombie connections (ECONNRESET) → keep-alive/timeout tuning.
21. Poison message blocks queue → DLQ + retry limits.
22. Deadlocks in DB → consistent lock ordering, retries.
23. Noisy neighbor in worker pool → bulkhead/isolation.
24. Missing observability during incident → logs+metrics+traces+alerts (set up beforehand).
25. Dependency CVE in prod → npm audit, patch, lockfile, SCA in CI.

---

➡️ Next: **Module 18 — Revision Sheets & Cheat Sheets.**
