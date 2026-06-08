# 🟢 Node.js Interview Master Notes
> Complete beginner → advanced notes for Senior Software Engineer interviews.
> First-principles · internals · diagrams · interview Q&A · cheat sheets.

## 📚 Modules

| # | Module | Covers |
|---|--------|--------|
| 1 | [Fundamentals](Module-01-Fundamentals.md) | What/why Node, V8, runtime, single-thread, non-blocking I/O, architecture, browser vs Node |
| 2 | [Internals](Module-02-Internals.md) | Call stack, heap, event loop phases, micro/macrotasks, nextTick/setImmediate, output prediction |
| 3 | [Module System](Module-03-ModuleSystem.md) | CommonJS vs ESM, exports, require, resolution, circular deps |
| 4 | [Core Modules](Module-04-CoreModules.md) | fs, path, os, http(s), events, stream, buffer, crypto, cluster, worker_threads, child_process, etc. |
| 5 | [Async Programming](Module-05-Async.md) | Callbacks, promises, async/await, all/allSettled/race/any, error handling |
| 6 | [Streams & Buffers](Module-06-Streams.md) | Stream types, piping, backpressure, internal implementation |
| 7 | [Memory Management](Module-07-Memory.md) | Stack/heap, GC, mark-sweep, leaks, detection, profiling |
| 8 | [HTTP & Web Servers](Module-08-HTTP.md) | Request/response lifecycle, REST, status codes, cookies, sessions, JWT |
| 9 | [Express.js](Module-09-Express.md) | Middleware, lifecycle, error handling, auth/authz |
| 10 | [Databases](Module-10-Databases.md) | Postgres/MySQL/Mongo, pooling, transactions, indexes, ORM, N+1 |
| 11 | [Security](Module-11-Security.md) | AuthN/Z, JWT, OAuth, CSRF, XSS, SQLi, rate limit, Helmet, CORS |
| 12 | [Scalability](Module-12-Scalability.md) | Clustering, LB, worker_threads, caching, Redis, architecture |
| 13 | [Testing](Module-13-Testing.md) | Unit/integration/E2E, Jest, Supertest, mocking |
| 14 | [Design Patterns](Module-14-DesignPatterns.md) | Singleton, Factory, Observer, Strategy, Repository, DI |
| 15 | [Advanced](Module-15-Advanced.md) | EventEmitter/Streams internals, V8, libuv, thread pool, cluster, N-API |
| 16 | [System Design](Module-16-SystemDesign.md) | Chat, URL shortener, notifications, payments, e-commerce |
| 17 | [Interview Master](Module-17-InterviewMaster.md) | Top 100 + 50 advanced + 25 scenario/debug/perf/prod Qs |
| 18 | [Revision Sheets](Module-18-RevisionSheets.md) | 1-day / 3-hour / 30-min notes + all cheat sheets |

## 🎯 How to Use
- **Learning:** read Modules 1→18 in order.
- **1 week before:** Modules 2, 5, 6, 7, 11, 12, 15 (most-tested internals).
- **1 day before:** Module 18 (1-day notes) + Module 17 (Top 100).
- **30 min before:** Module 18 → 30-minute revision + cheat sheets.

## 🔑 The Golden Rules
1. Never block the event loop.
2. Network I/O = OS async; fs/dns/crypto/zlib = thread pool.
3. nextTick > promises > timers/setImmediate.
4. Stateless services + Redis = horizontal scale.
5. Parameterize queries, bcrypt passwords, short-lived JWTs.
6. Measure before optimizing.
