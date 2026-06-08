# MODULE 1: NODE.JS FUNDAMENTALS
> Senior Engineer Interview Notes — First Principles → Advanced
> Revision-friendly. Each topic: Definition · Why · Internals · Examples · Interview Qs · Mistakes · Best Practices · Performance · Production.

---

## 0. Quick Mental Model (Read This First)

```
        ┌─────────────────────────────────────────────────────────┐
        │                      NODE.JS                            │
        │                                                         │
        │   Your JS Code  ──►  V8 Engine (compiles & runs JS)     │
        │                          │                              │
        │                          ▼                              │
        │   Node Bindings (C++)  ◄──►  libuv (C library)          │
        │                          │                              │
        │              ┌───────────┴───────────┐                  │
        │              ▼                       ▼                  │
        │        Event Loop            Thread Pool (4 threads)    │
        │     (single-threaded)        (file I/O, crypto, DNS)    │
        └─────────────────────────────────────────────────────────┘
```

**One-line interview definition:**
> Node.js is a JavaScript runtime built on Chrome's V8 engine that uses an event-driven, non-blocking I/O model, making it lightweight and efficient for I/O-heavy, real-time, and networked applications.

---

## 1. What is Node.js

### Definition
Node.js is a **server-side JavaScript runtime environment**. It is **not** a language, **not** a framework — it is a runtime that lets you execute JavaScript **outside the browser**.

It bundles:
1. **V8** — Google's JS engine (compiles JS → machine code).
2. **libuv** — C library providing the event loop + async I/O + thread pool.
3. **Node bindings + Core APIs** — C++/JS modules (`fs`, `http`, `net`, etc.) that JS can't do alone (file system, networking, OS access).

### Why It Exists
Before Node, JavaScript lived only in the browser. To build a server you needed PHP, Java, Python, Ruby. Node's insight: **the browser already runs JS extremely fast (V8); bring that to the server** so developers use **one language across the full stack** and handle massive concurrent connections cheaply.

### How It Works Internally
- You write JS → V8 parses and JIT-compiles it to native code.
- When your code calls something the OS must do (read a file, open a socket), V8 alone can't — Node's **C++ bindings** hand it to **libuv**.
- libuv either uses **OS-level async primitives** (epoll/kqueue/IOCP) for network I/O, or its **thread pool** for things that have no async OS API (file system, DNS, crypto).
- When the work finishes, libuv pushes your **callback** into a queue, and the **event loop** runs it on the single main thread.

### Real-World Examples
- **Netflix** — moved UI server layer to Node; startup time dropped from minutes to seconds.
- **PayPal** — rewrote account app in Node: 2x faster, fewer lines of code, more requests/sec.
- **LinkedIn** — mobile backend on Node: 10x fewer servers.
- **Uber** — real-time matching system; Node chosen for its non-blocking I/O.

### Interview Questions
- *Is Node.js a language or a framework?* → Neither — it's a runtime.
- *What are the three core components of Node?* → V8, libuv, core bindings/libraries.
- *Why is Node single-threaded but can handle thousands of connections?* → Event loop + non-blocking I/O; the OS/thread pool does the waiting, not the main thread.

### Common Mistakes
- Calling Node "a framework" (Express is a framework, Node is the runtime).
- Believing Node is "fully single-threaded" — libuv has a thread pool; modern Node has `worker_threads`.
- Thinking Node is good for CPU-heavy work — it's optimized for **I/O-bound**, not **CPU-bound**.

### Best Practices
- Use Node for **I/O-bound, real-time, microservices, APIs, streaming**.
- Offload CPU-heavy tasks to `worker_threads`, a queue, or another service.

### Production Use Cases
APIs / BFF layers, real-time (chat, notifications, sockets), streaming, microservices, serverless functions, build tooling.

---

## 2. History of Node.js

| Year | Milestone |
|------|-----------|
| 2009 | **Ryan Dahl** creates Node.js; presented at JSConf EU. Built on V8 + libev. |
| 2010 | **npm** released — package manager that fueled adoption. |
| 2011 | Windows support (joins with Microsoft); libuv introduced to abstract OS I/O. |
| 2014 | Community fork **io.js** (frustration over governance + slow V8 updates). |
| 2015 | **Node Foundation** formed; io.js merged back → Node 4.0. ES Modules spec begins. |
| 2018 | Node 10 — N-API stable, experimental ESM. |
| 2019 | Node 12 — better startup, TLS 1.3, worker_threads stable. |
| 2020 | Node 14 — Optional chaining, AsyncLocalStorage stable. |
| 2021 | Node 16 — Apple Silicon, stable Timers Promises API. |
| 2022 | Node 18 — **global `fetch`**, native test runner, watch mode. |
| 2023 | Node 20 — **Permission Model**, stable test runner. |
| 2024 | Node 22 — `require()` of ESM (experimental), WebSocket client. |
| 2025+ | Node 23/24 — Continued ESM/require convergence, V8 upgrades. |

**Why know history in interviews?** It explains *why* CommonJS and ESM coexist, *why* libuv exists, and *why* the io.js fork happened (release cadence + V8 versions) — common follow-up questions.

---

## 3. Why Node.js Was Created

### The Problem It Solved
Traditional servers (e.g., classic Apache + PHP) used a **thread-per-request** model:
- Each connection → one OS thread.
- Each thread consumes memory (~MBs) and the CPU spends time **context-switching**.
- 10,000 concurrent connections → 10,000 threads → memory explosion + scheduling overhead. This is the famous **C10K problem**.

Worse, most server time is spent **waiting** on I/O (DB, disk, network). In a blocking model, a thread sits **idle but allocated** while waiting.

### Node's Answer
Use **one thread** + an **event loop** + **non-blocking I/O**:
- Start an I/O operation, register a callback, and **immediately move on** to the next request.
- When I/O completes, run the callback.
- No idle threads. Memory per connection is tiny (just a closure/callback).

```
Thread-per-request (Apache-style)        Event loop (Node)
─────────────────────────────────        ─────────────────
Req1 → Thread1 ─ wait DB... ─ reply       Req1 ─ start DB ┐
Req2 → Thread2 ─ wait DB... ─ reply       Req2 ─ start DB ┤ all on
Req3 → Thread3 ─ wait DB... ─ reply       Req3 ─ start DB ┘ 1 thread
(N threads = N×memory, idle waiting)      (callbacks fire when DB returns)
```

### Interview Question
*Why was Node.js created?* → To solve the C10K problem and inefficient thread-per-request blocking I/O, by giving JS a non-blocking, event-driven server runtime.

---

## 4. V8 Engine

### Definition
**V8** is Google's open-source, high-performance JavaScript and WebAssembly engine, written in C++. It powers Chrome and Node.js. It **compiles JS directly to native machine code** (not interpreted line-by-line at runtime forever).

### Why It Exists
JS was historically slow (interpreted). V8 made it fast enough for real apps via **JIT (Just-In-Time) compilation**.

### How It Works Internally (The Pipeline)
```
JS Source
   │
   ▼
[Parser] ──► Abstract Syntax Tree (AST)
   │
   ▼
[Ignition] ──► Bytecode (interpreter runs it immediately = fast startup)
   │
   ▼  (profiling: which code is "hot"?)
[TurboFan] ──► Optimized machine code (for hot functions)
   │
   ▼  (if assumptions break)
[Deoptimization] ──► fall back to bytecode
```

- **Parser** → builds the **AST**.
- **Ignition** (interpreter) → produces **bytecode**, executes it fast (low startup cost).
- **TurboFan** (optimizing compiler) → recompiles **hot** (frequently run) functions into highly optimized machine code, making **assumptions** (e.g., "this variable is always a number").
- **Deoptimization** → if assumptions break (e.g., the number becomes a string), V8 throws away optimized code and falls back.

### Key Concepts
- **Hidden Classes (Shapes/Maps):** V8 assigns objects an internal "shape." Objects with the same property order share a hidden class → fast property access. Changing shape (adding props in different orders) creates new hidden classes → slower.
- **Inline Caching:** V8 caches where a property lives so repeated access is fast.
- **Garbage Collection:** V8 manages memory via a generational GC (covered in Module 7).

### Real-World Example
```js
// GOOD: consistent shape → same hidden class
function Point(x, y) { this.x = x; this.y = y; }
const a = new Point(1, 2);
const b = new Point(3, 4); // same hidden class as a

// BAD: shape divergence → deopt risk
const p1 = { x: 1, y: 2 };
const p2 = { y: 2, x: 1 }; // different property order → different hidden class
p1.z = 9;                  // adding props later mutates the shape
```

### Interview Questions
- *What is V8?* → Google's C++ JS engine that JIT-compiles JS to machine code.
- *What is JIT compilation?* → Compiling code at runtime, combining interpreter speed-to-start with compiler runtime speed.
- *What are Ignition and TurboFan?* → Interpreter (bytecode) and optimizing compiler.
- *What are hidden classes?* → Internal structures V8 uses to optimize property access.

### Common Mistakes
- Confusing V8 with Node (V8 only runs JS; it has **no** `fs`, `http`, `setTimeout` — those come from Node/browser).
- Writing "megamorphic" code (objects with constantly changing shapes) that defeats optimization.

### Performance Considerations
- Keep object shapes consistent; initialize all properties in the constructor.
- Avoid `delete` on hot objects (changes shape).
- Monomorphic functions (always same argument types) optimize better than polymorphic.

### Production Note
You can tune V8 in Node via flags: `--max-old-space-size=4096` (heap MB), `--max-semi-space-size`, etc. Used in containers to align Node's heap with the memory limit.

---

## 5. JavaScript Runtime

### Definition
A **runtime** is the environment that provides everything needed to **execute** code: the engine **plus** the APIs and infrastructure the language alone doesn't include.

```
JavaScript Engine (V8)  =  parse + compile + execute JS, manage memory
JavaScript Runtime      =  Engine  +  APIs  +  Event Loop  +  Queues
```

### Why It Exists
V8 by itself knows nothing about timers, files, HTTP, or the DOM. Those are **host-provided**. The **browser** provides DOM, `fetch`, `localStorage`. **Node** provides `fs`, `http`, `process`, `Buffer`.

### How It Works
The runtime = **V8 + Event Loop + libuv + Node APIs + Queues (micro/macro)**. When your code runs, V8 executes pure JS; anything external is delegated to host APIs which schedule callbacks back through the event loop.

### Interview Questions
- *Difference between engine and runtime?* → Engine runs JS; runtime adds host APIs + event loop + queues.
- *Is `setTimeout` part of JavaScript?* → No. It's provided by the runtime (Node/browser), not the ECMAScript spec.
- *Name JS runtimes.* → Node.js, Deno, Bun, browser runtimes, Cloudflare Workers.

### Common Mistake
Thinking `setTimeout`, `console`, `fetch` are "JavaScript." They are **runtime APIs**.

---

## 6. Single-Threaded Architecture

### Definition
Node executes **your JavaScript on a single main thread** — one call stack, one piece of JS running at a time. There is **no parallel execution of your JS code** by default.

### Why It Exists
Single-threaded JS avoids the classic concurrency nightmares: **race conditions, deadlocks, locks, and complex thread synchronization**. The model is simpler and, combined with non-blocking I/O, scales well for I/O-bound workloads.

### How It Works Internally (Critical Nuance)
"Single-threaded" applies to **your JS execution**. Node itself is **multi-threaded under the hood**:
- **1 main thread** runs the event loop + your JS.
- **libuv thread pool** (default **4** threads) handles file I/O, DNS (`getaddrinfo`), `crypto` (e.g., `pbkdf2`), and `zlib`.
- **OS kernel** handles network I/O asynchronously (no thread pool needed).
- **worker_threads** can run additional JS in parallel (opt-in, since Node 12).

```
            ┌──────────────────────────────┐
   Your JS  │  MAIN THREAD (Event Loop)    │  ← only ONE runs your JS
            └──────────────┬───────────────┘
                           │ delegates
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  Thread Pool        OS async (epoll)   worker_threads
 (fs, dns, crypto)   (sockets, TCP)     (opt-in parallel JS)
```

### Real-World Example
```js
// This BLOCKS the single thread — bad in a server
const data = fs.readFileSync('big.txt'); // entire process frozen while reading

// This frees the thread — good
fs.readFile('big.txt', (err, data) => { /* runs later */ });
// Meanwhile, the event loop serves other requests
```

### Interview Questions
- *Is Node truly single-threaded?* → Your JS runs single-threaded; Node uses libuv's thread pool + OS async + optional worker_threads.
- *What is the default thread pool size? Can you change it?* → 4; set `UV_THREADPOOL_SIZE` (max 1024).
- *What happens if you run a CPU-heavy loop?* → It blocks the event loop; all other requests stall.

### Common Mistakes
- Running heavy synchronous CPU work (big loops, sync crypto, `JSON.parse` of huge payloads) on the main thread → blocks everyone.
- Assuming thread pool size scales automatically.

### Best Practices
- Never block the event loop. Offload CPU work to `worker_threads` / queues.
- Tune `UV_THREADPOOL_SIZE` if you do heavy file/crypto/zlib work.

### Performance Consideration
A single blocking operation harms **all** concurrent users because there's one thread for JS. "Don't block the event loop" is Node's #1 rule.

---

## 7. Event-Driven Architecture

### Definition
Node's architecture is built around **events and callbacks**: instead of asking "is the data ready yet?" repeatedly (polling), you **register a handler** ("when data arrives, call this"), and the runtime **emits an event** when it happens.

### Why It Exists
It's the natural fit for non-blocking I/O. You can't block waiting, so you **subscribe** to completion. This decouples producers from consumers and enables high concurrency.

### How It Works Internally
- Core is the **`EventEmitter`** class. Objects (HTTP server, streams, sockets) **emit** named events; you attach listeners with `.on()`.
- libuv detects I/O completion and pushes the associated callback into a queue; the event loop dispatches it.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('order', (id) => console.log('Processing order', id)); // subscribe
emitter.emit('order', 42); // publish → "Processing order 42"
```

HTTP server is event-driven under the hood:
```js
const server = http.createServer();
server.on('request', (req, res) => res.end('Hi')); // 'request' event per incoming req
server.listen(3000);
```

### Interview Questions
- *What is event-driven programming?* → Flow controlled by events; handlers run when events fire.
- *What is `EventEmitter`?* → Core class implementing publish/subscribe; backbone of streams, sockets, servers.
- *Difference between `.on` and `.once`?* → `.on` listens every time; `.once` fires a single time then removes itself.

### Common Mistakes
- Forgetting to handle the `error` event on emitters/streams → **unhandled `error` event crashes the process**.
- Adding listeners in a loop → memory leak + `MaxListenersExceededWarning`.

### Best Practices
- Always attach an `error` listener.
- Remove listeners you no longer need (`.off`/`removeListener`).

### Production Use Case
Event buses, real-time pipelines, streaming responses, websocket events, internal app events (metrics, audit logs).

---

## 8. Non-Blocking I/O

### Definition
**Non-blocking I/O** means an I/O operation **returns immediately** instead of waiting for completion. The result is delivered later via a callback/promise/event. The thread is **never paused** waiting on disk/network.

### Why It Exists
I/O (disk, network, DB) is **thousands of times slower** than CPU. Blocking the thread during I/O wastes the most valuable resource. Non-blocking I/O keeps the single thread busy doing useful work.

### How It Works Internally
- For **network** I/O, libuv uses OS event notification: **epoll** (Linux), **kqueue** (macOS/BSD), **IOCP** (Windows). The OS tells Node when a socket is readable/writable — no thread waits.
- For **file** I/O and DNS/crypto (no portable async OS API), libuv uses its **thread pool**: a pool thread does the blocking call, then signals completion.

```
fs.readFile('a.txt', cb)
   │
   ▼
Node binding → libuv → thread pool thread reads file (blocks THAT thread)
   │
   ▼ when done
push cb into event loop queue → main thread runs cb(err, data)
```

### Real-World Example
```js
console.log('1');
fs.readFile('a.txt', () => console.log('3 (file done)'));
console.log('2');
// Output: 1, 2, 3  — main thread didn't wait for the file
```

### Interview Questions
- *How does Node achieve non-blocking I/O on a single thread?* → libuv: OS async for network + thread pool for file/dns/crypto.
- *Which operations use the thread pool?* → `fs`, `dns.lookup`, `crypto` (pbkdf2/scrypt), `zlib`. (Network sockets do **not**.)

### Common Mistakes
- Using the `...Sync` versions (`readFileSync`) in request handlers — blocks the loop.
- Assuming **all** async work uses the thread pool (network doesn't).

---

## 9. Blocking vs Non-Blocking

| Aspect | Blocking (Synchronous) | Non-Blocking (Asynchronous) |
|--------|------------------------|-----------------------------|
| Thread behavior | Waits until done | Returns immediately |
| Concurrency | One thing at a time | Many in flight |
| API style | `fs.readFileSync()` | `fs.readFile(cb)` / `fs.promises.readFile()` |
| Result delivery | Return value | Callback / Promise / Event |
| Effect on event loop | **Freezes** it | Keeps it free |
| Use case | Startup config, CLI scripts | Servers, request handling |

```js
// Blocking — process can do NOTHING else meanwhile
const d = fs.readFileSync('f.txt');
console.log(d);

// Non-blocking — process keeps serving other work
fs.readFile('f.txt', (e, d) => console.log(d));
```

**Interview gold answer:** "Blocking calls hold the single thread until they finish, stalling all other requests. Non-blocking calls delegate the wait to libuv/OS and continue, which is why Node scales for I/O. The only safe place for `Sync` calls is one-time startup code or scripts."

### Common Mistakes
- `JSON.parse`/`JSON.stringify` on huge objects, `bcrypt` sync, big `for` loops — all "blocking" even without an `fs`.
- Synchronous logging to disk in hot paths.

---

## 10. Why Node.js Is Fast

### The Five Reasons
1. **V8 JIT compilation** — JS runs as optimized native machine code.
2. **Non-blocking I/O** — the thread never sits idle waiting.
3. **Event loop concurrency** — thousands of connections multiplexed on one thread with tiny per-connection cost.
4. **libuv + OS async primitives** — epoll/kqueue/IOCP scale to many sockets efficiently.
5. **No per-request thread overhead** — no thread creation, no context-switch storms, low memory per connection.

```
Apache (threads):  memory & CPU grow with connection count → fewer scale
Node (event loop): cost per idle connection ≈ a callback → many scale
```

### Important Caveat (interviewers love this)
Node is fast for **I/O-bound** work, **not CPU-bound** work. A single CPU-heavy task blocks the loop and kills throughput. "Fast" ≠ "good at number crunching."

### Interview Question
*Why is Node fast and when is it NOT a good choice?* → Fast for I/O-bound/real-time due to event loop + non-blocking I/O + V8. Poor for CPU-heavy (image/video processing, ML inference, big computations) unless offloaded to workers/services.

---

## 11. How Node Executes JavaScript

### Step-by-Step Lifecycle
```
1. node app.js
2. Node initializes: V8 instance, libuv, event loop, process object
3. Reads app.js → wraps it in a module function (CommonJS):
      (function(exports, require, module, __filename, __dirname){ ...your code... })
4. V8 parses → Ignition bytecode → executes top-to-bottom (SYNCHRONOUS phase)
5. During this run, async ops (timers, fs, http) are REGISTERED with libuv
6. After the top-level (synchronous) script finishes:
      → drain microtask queue (process.nextTick, Promises)
7. Enter the EVENT LOOP:
      → run timers, pending callbacks, poll I/O, setImmediate, close callbacks
      → after EACH macrotask, drain microtasks again
8. When no more work (no timers, no pending I/O, no refs) → process exits
```

### Diagram
```
   ┌─ Run main module (sync) ─┐
   │  register async ops      │
   └────────────┬─────────────┘
                ▼
        Drain microtasks
                ▼
        ┌──────────────────────────────┐
        │          EVENT LOOP          │ ◄── repeats while work remains
        │  timers → pending → poll →   │
        │  check(setImmediate) → close │
        │  (drain microtasks between)  │
        └──────────────────────────────┘
                ▼
            Exit when idle
```

### Interview Questions
- *Walk me through what happens when you run `node app.js`.* → (Use the 8 steps above.)
- *What is the module wrapper function?* → Node wraps each CommonJS module to inject `exports, require, module, __filename, __dirname` and give each file its own scope.
- *When does a Node process exit?* → When the event loop has no more pending callbacks/timers/handles to process.

*(Deep event-loop phase mechanics are in Module 2.)*

---

## 12. Node.js Architecture

### The Full Stack
```
┌──────────────────────────────────────────────────────┐
│                  YOUR APPLICATION (JS)                │
├──────────────────────────────────────────────────────┤
│        Node.js Core API / Standard Library            │
│     (fs, http, net, stream, crypto, events ... )      │
├──────────────────────────────────────────────────────┤
│              Node Bindings (C++ glue)                 │
│        connects JS world ↔ C/C++ libraries            │
├───────────────────────────┬──────────────────────────┤
│          V8 Engine        │          libuv           │
│   (executes JS, memory,   │  (event loop, thread     │
│    GC, JIT compilation)   │   pool, async I/O)       │
├───────────────────────────┴──────────────────────────┤
│   Other C libs: c-ares (DNS), OpenSSL (crypto/TLS),   │
│                 zlib (compression), llhttp (HTTP)     │
├──────────────────────────────────────────────────────┤
│                  OPERATING SYSTEM                     │
│         epoll / kqueue / IOCP, file system            │
└──────────────────────────────────────────────────────┘
```

### Component Responsibilities
| Component | Role |
|-----------|------|
| **V8** | Compile & execute JS, manage heap & GC |
| **libuv** | Event loop, async I/O, thread pool, timers |
| **Bindings** | Bridge JS ↔ C/C++ |
| **Core modules** | Built-in JS/C++ APIs (`fs`, `http`, etc.) |
| **c-ares** | Async DNS (`dns.resolve`) |
| **OpenSSL** | TLS/SSL + `crypto` |
| **zlib** | gzip/deflate compression |
| **llhttp** | Fast HTTP parser |

### Interview Questions
- *What is libuv and what does it do?* → C library providing the event loop, async I/O abstraction over OS, and the thread pool.
- *Which library handles DNS / TLS / compression / HTTP parsing?* → c-ares / OpenSSL / zlib / llhttp.
- *How does JS talk to C++ in Node?* → Through Node bindings (N-API/native addons).

### Common Mistake
Saying "Node = V8." V8 is only the JS engine; **libuv** provides the async superpower.

---

## 13. Browser vs Node.js

Both run JS on V8, but the **runtime environments differ fundamentally**.

| Aspect | Browser | Node.js |
|--------|---------|---------|
| Engine | V8 (Chrome), SpiderMonkey (FF), etc. | V8 |
| Global object | `window` / `self` | `global` / `globalThis` |
| Module system | ES Modules (`import`) native | CommonJS + ESM |
| DOM / BOM | ✅ `document`, `window` | ❌ none |
| File system | ❌ (sandboxed) | ✅ `fs` |
| Network | `fetch`, `XMLHttpRequest` (restricted by CORS) | `http`, `net`, `fetch` (no CORS) |
| Threads | Web Workers | `worker_threads` |
| Timers | `setTimeout`, `setInterval` | + `setImmediate`, `process.nextTick` |
| Buffers/binary | `ArrayBuffer`, `Blob` | `Buffer` (+ typed arrays) |
| Process/env access | ❌ | ✅ `process`, `process.env` |
| Security model | Sandboxed, untrusted code | Full OS access (trusted) |
| Event loop | Browser's (HTML spec) | libuv's (phases differ) |
| Use case | UI / client | Server / tooling / CLI |

### Key Interview Points
- **Same language, different host objects.** `window` vs `global`; no DOM in Node; no `fs` in browser.
- **Different event loops.** Browser follows the HTML spec event loop; Node follows libuv's phase model (timers/poll/check). This is why micro/macro task ordering can subtly differ and why `setImmediate`/`process.nextTick` exist only in Node.
- **Security.** Browser sandboxes untrusted code; Node assumes you trust the code and grants full system access (hence the new **Permission Model** in Node 20+).

### Interview Questions
- *Differences between running JS in browser vs Node?* → (host APIs, modules, security, event loop — use the table).
- *Is the event loop the same in both?* → No; same concept, different implementations (libuv vs HTML spec).
- *What is `globalThis`?* → A standardized global reference that works in both environments.

### Common Mistakes
- Using `window`/`document` in Node code.
- Assuming `fetch` always existed in Node — it became global only in **Node 18**.

---

## MODULE 1 — PRACTICE QUESTIONS

### 🟢 Beginner
1. What is Node.js in one sentence?
2. Is Node.js a programming language? Explain.
3. What engine does Node.js use to run JavaScript?
4. What does "single-threaded" mean in Node?
5. Name three things the browser can do that Node cannot, and vice versa.
6. What is non-blocking I/O?
7. Who created Node.js and in what year?
8. What is the difference between `global` and `window`?
9. Is `setTimeout` part of JavaScript or the runtime?
10. Give two real companies using Node and why.

### 🟡 Intermediate
1. Explain V8's compilation pipeline (Ignition, TurboFan, deopt).
2. What is libuv and what four C libraries support Node's core modules?
3. Difference between a JS **engine** and a JS **runtime**.
4. Which Node operations use the libuv thread pool? Which don't?
5. What is the default thread pool size and how do you change it?
6. Explain blocking vs non-blocking with a code example.
7. What is the C10K problem and how does Node address it?
8. Why is Node fast for I/O but slow for CPU-bound tasks?
9. What is the module wrapper function?
10. Walk through what happens when you run `node app.js`.

### 🔴 Advanced
1. What are V8 hidden classes and inline caches? How do they affect performance?
2. Explain how non-blocking network I/O avoids the thread pool entirely (epoll/kqueue/IOCP).
3. Why did io.js fork from Node, and what changed after the merge?
4. How does Node bridge JavaScript and C++ (N-API/bindings)?
5. What causes a V8 deoptimization and how do you avoid it?
6. How would you tune V8 heap size in a memory-limited container?
7. Compare Node's event loop to the browser's HTML-spec event loop.
8. Why is `process.nextTick` Node-specific and not in browsers?

### 🧩 Scenario-Based
1. **A single API endpoint slows down the entire service under load.** What's likely wrong and how do you diagnose it? *(Hint: blocking the event loop — sync crypto, big JSON, sync fs.)*
2. **Your app does heavy image resizing and throughput collapses.** Redesign it. *(worker_threads / separate service / queue.)*
3. **File reads are slow and you have 4 cores.** You notice exactly 4 concurrent file ops max out. Why, and what do you tune? *(`UV_THREADPOOL_SIZE`.)*
4. **A teammate says "Node can't do parallelism, so we must rewrite in Go."** How do you respond? *(worker_threads, cluster, offloading; clarify I/O vs CPU.)*
5. **Code using `window` works in the browser but crashes in Node.** Explain and fix. *(No DOM/window in Node; use `globalThis`/Node APIs.)*

---

## ⚡ MODULE 1 — 30-SECOND REVISION

- **Node = V8 + libuv + core libs.** A runtime, not a language/framework.
- **Single-threaded JS**, but **libuv thread pool (4)** + **OS async** + **worker_threads** under the hood.
- **Non-blocking I/O** via epoll/kqueue/IOCP (network) and thread pool (fs/dns/crypto/zlib).
- **V8 pipeline:** Parser → Ignition (bytecode) → TurboFan (optimize) → deopt fallback.
- **Fast for I/O-bound**, **bad for CPU-bound** (don't block the loop).
- **Created 2009 by Ryan Dahl** to solve C10K / thread-per-request waste.
- **Browser vs Node:** same V8, different host (no DOM in Node, no `fs` in browser, different event loops, `global` vs `window`).
- **Golden rule:** *Never block the event loop.*

---

✅ **Module 1 complete.**
Reply **"Continue Module 2"** to proceed to **Node.js Internals** (Call Stack, Event Loop, micro/macrotasks, `nextTick` vs `setImmediate`, output-prediction questions).
