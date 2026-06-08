# MODULE 4: CORE NODE MODULES

> For each: Purpose · Internals · Examples · Interview Qs. Core modules are built-in (no npm install) and prefixed `node:` (recommended: `require('node:fs')`).

---

## 1. `fs` — File System
**Purpose:** Interact with the file system (read/write/watch files & dirs).
**Internals:** File ops have no async OS API → use the **libuv thread pool** (4 threads). Three flavors:
- **Sync:** `fs.readFileSync` — blocks the event loop ❌ (only for startup/CLI).
- **Callback:** `fs.readFile(path, cb)` — non-blocking ✅.
- **Promise:** `fs.promises.readFile` / `import {readFile} from 'fs/promises'` ✅ (preferred).

```js
import { readFile, writeFile } from 'node:fs/promises';
const data = await readFile('a.txt', 'utf8');
await writeFile('b.txt', data);

// Large files → use STREAMS, not readFile (avoids loading whole file in memory)
import { createReadStream } from 'node:fs';
createReadStream('huge.log').pipe(process.stdout);
```
**Interview Qs:** Sync vs async vs promise APIs? · Why does fs use the thread pool? · How to read a 10GB file? (streams). · `fs.watch` vs `fs.watchFile`? (event-based vs polling).
**Mistakes:** `readFileSync` in request handlers; loading huge files into memory.

---

## 2. `path` — Path Utilities
**Purpose:** Cross-platform path manipulation (handles `/` vs `\`).
```js
import path from 'node:path';
path.join('a', 'b', 'c.txt');       // 'a/b/c.txt'
path.resolve('a', 'b');             // absolute from cwd
path.basename('/x/y.txt');          // 'y.txt'
path.extname('y.txt');              // '.txt'
path.dirname('/x/y.txt');           // '/x'
path.parse('/x/y.txt');             // {root,dir,base,name,ext}
```
**`join` vs `resolve`:** `join` concatenates+normalizes; `resolve` produces an **absolute** path (processes right-to-left until absolute).
**Interview Q:** join vs resolve? · Why use path instead of string concat? (Windows compatibility, normalization, security against `../` traversal).

---

## 3. `os` — Operating System
**Purpose:** OS info & system resources.
```js
os.cpus();            // [{model, speed, times}, ...]  → length = core count
os.totalmem(); os.freemem();
os.platform();        // 'darwin' | 'linux' | 'win32'
os.hostname(); os.uptime(); os.networkInterfaces();
os.loadavg();         // [1,5,15] min load (unix)
```
**Production use:** Size a `cluster` to `os.cpus().length`; health checks; resource monitoring.

---

## 4. `http` — HTTP Server/Client
**Purpose:** Build HTTP servers & clients without frameworks.
**Internals:** Uses **llhttp** parser; built on `net` (TCP). Server is an `EventEmitter` (`'request'`, `'connection'`, `'close'`). `req`=ReadableStream, `res`=WritableStream.
```js
import http from 'node:http';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});
server.listen(3000);
```
**Interview Qs:** How does Node handle an HTTP request internally? (TCP→llhttp parse→'request' event→your handler→res stream). · Is `req` a stream? (yes, Readable). · Keep-alive?

---

## 5. `https` — Secure HTTP
**Purpose:** HTTP over TLS/SSL (via **OpenSSL**).
```js
https.createServer({ key, cert }, handler).listen(443);
```
**In production** TLS is usually terminated at a **load balancer / reverse proxy** (Nginx, ALB), and Node speaks plain HTTP internally.

---

## 6. `events` — EventEmitter
**Purpose:** Implement the pub/sub pattern; backbone of streams, HTTP, sockets.
**Internals:** Maintains a map of `eventName → [listeners]`. `emit` calls them **synchronously** in registration order.
```js
import { EventEmitter } from 'node:events';
class Bus extends EventEmitter {}
const bus = new Bus();
bus.on('data', d => console.log(d));
bus.once('init', () => {});       // fires once
bus.emit('data', 42);
```
**Key:** Default max **10** listeners per event (`MaxListenersExceededWarning`) → `setMaxListeners(n)`. Always handle `'error'` — an unhandled `'error'` **crashes** the process.
**Interview Qs:** on vs once? · Sync or async emit? (sync). · How to avoid listener leaks?

---

## 7. `stream` — Streams
**Purpose:** Process data in **chunks** instead of all at once (memory-efficient). See Module 6 for the deep dive.
Types: **Readable, Writable, Duplex, Transform**.
```js
readable.pipe(transform).pipe(writable);
import { pipeline } from 'node:stream/promises';
await pipeline(src, gzip, dst);   // preferred: handles errors + cleanup
```

---

## 8. `buffer` — Binary Data
**Purpose:** Handle raw binary outside V8's heap (fixed-size byte arrays). Pre-dates `Uint8Array`; `Buffer` extends it.
**Internals:** Allocated **outside V8 heap** (so not limited by `--max-old-space-size`), managed by Node.
```js
const b = Buffer.from('héllo', 'utf8');
b.length;                          // byte length (not char length!)
b.toString('hex'); b.toString('base64');
Buffer.alloc(10);                  // zero-filled (safe)
Buffer.allocUnsafe(10);            // faster, may contain old memory ❌ security
```
**Interview Qs:** Buffer vs string? · alloc vs allocUnsafe? (allocUnsafe may leak old memory — security risk). · Where are buffers stored? (off-heap). · String vs byte length for multibyte chars?

---

## 9. `crypto` — Cryptography
**Purpose:** Hashing, HMAC, encryption, random bytes, key derivation (via **OpenSSL**).
**Internals:** Heavy ops (`pbkdf2`, `scrypt`, `randomBytes` async) use the **thread pool**.
```js
import crypto from 'node:crypto';
crypto.createHash('sha256').update('data').digest('hex');   // hashing
crypto.randomBytes(16).toString('hex');                     // tokens
crypto.randomUUID();                                        // UUID v4
// password hashing → use bcrypt/argon2, NOT plain sha256
crypto.scrypt(password, salt, 64, (err, key) => {});        // async, thread pool
```
**Interview Qs:** Hashing vs encryption? (one-way vs reversible). · Why not sha256 for passwords? (too fast, no salt → use bcrypt/scrypt/argon2). · sync vs async crypto impact? (sync blocks loop).

---

## 10. `cluster` — Multi-Process Scaling
**Purpose:** Fork multiple Node processes (one per CPU core) sharing a port → use all cores. See Module 12/15.
**Internals:** Master forks workers; OS/master load-balances incoming connections (round-robin on non-Windows). Each worker = separate V8 + event loop + memory (no shared memory).
```js
import cluster from 'node:cluster';
import os from 'node:os';
if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on('exit', () => cluster.fork());   // auto-restart
} else {
  http.createServer(handler).listen(3000);
}
```
**Interview Q:** cluster vs worker_threads? (separate processes/no shared memory/IPC vs threads/shared ArrayBuffer/same process).

---

## 11. `worker_threads` — Multi-Thread Parallelism
**Purpose:** Run JS in **parallel threads** for CPU-bound work, **sharing memory** via `SharedArrayBuffer`.
**Internals:** Each worker = own V8 isolate + event loop, but same process. Communicate via `postMessage` (structured clone) or shared memory.
```js
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
if (isMainThread) {
  const w = new Worker(new URL(import.meta.url), { workerData: 100 });
  w.on('message', r => console.log('result', r));
} else {
  parentPort.postMessage(heavyCompute(workerData));
}
```
**Use:** Image processing, encryption, parsing, ML — anything CPU-heavy. Use a **worker pool** (e.g., Piscina) in production.

---

## 12. `child_process` — Spawn Processes
**Purpose:** Run other programs / Node scripts as separate OS processes.
**4 methods:**
| Method | Returns | Use |
|--------|---------|-----|
| `spawn` | stream | Long-running, large output (streams) |
| `exec` | buffer | Shell command, small output (buffered, has shell → injection risk) |
| `execFile` | buffer | Run a file without a shell (safer) |
| `fork` | + IPC channel | Spawn a **Node** script with messaging |
```js
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', d => console.log(`${d}`));
```
**Interview Qs:** spawn vs exec vs fork? · Security risk of exec? (shell injection — never interpolate user input). · child_process vs worker_threads vs cluster?

---

## 13. `readline` — Line-by-Line Input
**Purpose:** Read a stream line by line (stdin, files) — great for CLIs & big files.
```js
import readline from 'node:readline';
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', l => console.log('Got:', l));
// async iterator over a huge file without loading it
for await (const line of readline.createInterface({ input: createReadStream('big.log') })) {}
```

---

## 14. `url` — URL Parsing
**Purpose:** Parse/format URLs. Modern API = WHATWG `URL` (global, no import needed).
```js
const u = new URL('https://x.com/p?a=1&b=2');
u.hostname;          // 'x.com'
u.pathname;          // '/p'
u.searchParams.get('a');   // '1'
```
Legacy `url.parse()` is deprecated — prefer `new URL()`.

---

## 15. `util` — Utilities
**Purpose:** Helper functions.
```js
import util from 'node:util';
const readFile = util.promisify(fs.readFile);   // callback → promise
util.inspect(obj, { depth: null, colors: true });
util.types.isPromise(x);
util.deprecate(fn, 'msg');
```
**`promisify`** is a classic interview topic — converts callback-style (error-first) to Promise.

---

## CORE MODULE QUICK MAP
```
fs, dns, crypto, zlib   → libuv THREAD POOL
http, https, net, tcp   → OS async (epoll/kqueue/IOCP) — NO thread pool
events                  → sync EventEmitter
buffer                  → off-heap binary
cluster                 → multi-PROCESS (no shared mem, IPC)
worker_threads          → multi-THREAD (shared mem)
child_process           → spawn external programs
```

## PRACTICE QUESTIONS
**🟢:** What are core modules? · fs sync vs async? · Buffer vs string? · spawn vs exec?
**🟡:** Which modules use the thread pool? · cluster vs worker_threads? · path.join vs resolve? · promisify a callback fn.
**🔴:** Where are Buffers stored & why? · How does http parse requests (llhttp)? · alloc vs allocUnsafe security. · Build a worker pool.
**🧩:** Read a 50GB file without OOM (streams + readline). · CPU-bound endpoint stalls server — fix (worker_threads). · Use all 16 cores (cluster). · Run a Python script from Node (child_process).

➡️ Next: **Module 5 — Asynchronous Programming.**
