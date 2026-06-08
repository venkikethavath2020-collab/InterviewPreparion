# MODULE 6: STREAMS & BUFFERS

---

## 1. What Are Streams
**Definition:** Abstract interfaces for working with **streaming data** — processing data **piece by piece (chunks)** as it arrives, instead of loading it all into memory. Streams are `EventEmitter` instances.

**Why streams exist:**
- **Memory efficiency** — process a 50GB file using a few MB of RAM.
- **Time efficiency** — start processing the first chunk before the last arrives (lower latency).
- **Composability** — pipe small transforms together (Unix philosophy).

```
Without streams:  [████████ load entire 1GB file into RAM ████████] → process
With streams:     chunk→process→chunk→process→chunk→process  (constant memory)
```

---

## 2. Types of Streams
| Type | Direction | Examples |
|------|-----------|----------|
| **Readable** | source → you | `fs.createReadStream`, `http req`, `process.stdin` |
| **Writable** | you → sink | `fs.createWriteStream`, `http res`, `process.stdout` |
| **Duplex** | both, independent | TCP socket (`net.Socket`) |
| **Transform** | Duplex that modifies | `zlib.createGzip`, crypto cipher |

---

## 3. Readable Stream
**Definition:** Source you read chunks from. Two modes:
- **Flowing mode:** data pushed via `'data'` events automatically.
- **Paused mode:** you pull with `.read()` (default until you add a `'data'` listener / pipe).

```js
const rs = fs.createReadStream('big.txt', { highWaterMark: 64 * 1024 }); // 64KB chunks
rs.on('data', chunk => console.log('got', chunk.length));
rs.on('end',  () => console.log('done'));
rs.on('error', err => console.error(err));

// Modern: async iteration (paused, backpressure-friendly)
for await (const chunk of rs) { process(chunk); }
```
**`highWaterMark`** = internal buffer size threshold (default 64KB for fs, 16KB for object mode counts).

---

## 4. Writable Stream
**Definition:** Destination you write chunks to.
```js
const ws = fs.createWriteStream('out.txt');
const ok = ws.write('chunk');   // returns false when internal buffer is full → BACKPRESSURE
if (!ok) ws.once('drain', () => { /* resume writing */ });
ws.end('last chunk');           // signals completion
ws.on('finish', () => console.log('flushed'));
```
`.write()` returns **`false`** when the buffer exceeds `highWaterMark` — your signal to **stop writing** until `'drain'`.

---

## 5. Duplex Stream
Readable **and** Writable with **independent** channels (read side ≠ write side). Example: a TCP socket — you read what the peer sends and write what you send.
```js
net.createServer(socket => {
  socket.on('data', d => socket.write('echo: ' + d)); // duplex
});
```

---

## 6. Transform Stream
A Duplex where **output is computed from input** (read side derived from write side). Implement `_transform(chunk, enc, cb)`.
```js
import { Transform } from 'node:stream';
const upper = new Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk.toString().toUpperCase());  // push transformed chunk
  }
});
process.stdin.pipe(upper).pipe(process.stdout);
// Built-ins: zlib.createGzip(), crypto.createCipheriv()
```

---

## 7. Piping
**`.pipe()`** connects a Readable to a Writable, **automatically handling data flow + backpressure** (but NOT error propagation/cleanup).
```js
readable.pipe(transform).pipe(writable);

// ❌ pipe doesn't forward errors or destroy streams on failure → leaks
// ✅ Prefer pipeline (handles errors + cleanup):
import { pipeline } from 'node:stream/promises';
await pipeline(
  fs.createReadStream('in.txt'),
  zlib.createGzip(),
  fs.createWriteStream('out.gz')
);
```
**Real example — gzip a file with constant memory:** the pipeline above compresses any-size file using ~64KB buffers.

---

## 8. Backpressure (Most-Asked Stream Topic)
**Definition:** A flow-control mechanism preventing a **fast producer** from overwhelming a **slow consumer**. When the writable's buffer fills (`highWaterMark` exceeded), `.write()` returns `false`; a well-behaved producer **pauses** until `'drain'`.

```
Fast Readable ──chunks──► [Writable buffer]
                              │
              buffer full? → write() returns false
                              │
              Readable PAUSES until 'drain' event
                              │
              buffer drains → 'drain' fires → Readable RESUMES
```
**`.pipe()` and `pipeline()` handle backpressure automatically.** Manual `'data'`→`'write'` loops do **not** — you must check `write()`'s return and pause.

```js
// Manual backpressure handling:
rs.on('data', chunk => {
  if (!ws.write(chunk)) {
    rs.pause();
    ws.once('drain', () => rs.resume());
  }
});
```
**Why it matters:** Ignoring backpressure → unbounded memory growth → **OOM crash**. Classic production bug.

---

## 9. Internal Implementation
- Each stream keeps an **internal buffer** (array of Buffers / strings).
- **Readable:** `_read()` is called by Node when it wants more; you `push()` data; pushing past `highWaterMark` makes `push()` return `false` (stop reading source).
- **Writable:** `_write(chunk, enc, cb)` does the actual write; call `cb()` when done; buffering tracks `highWaterMark`.
- **Object mode** (`{ objectMode: true }`): chunks are arbitrary JS objects, not Buffers; `highWaterMark` counts objects.
- Streams emit: Readable → `data, end, error, close`; Writable → `drain, finish, error, close`.

```js
import { Readable } from 'node:stream';
const nums = new Readable({
  objectMode: true,
  read() {
    this.push(this.i ??= 0);
    if (this.i++ >= 5) this.push(null);  // null = EOF
  }
});
```

---

## 10. Buffers (Recap from Module 4)
- Raw binary, **off the V8 heap**, fixed size. Streams chunk data as Buffers (unless object mode).
- `Buffer.alloc(n)` (safe, zero-filled) vs `Buffer.allocUnsafe(n)` (fast, may expose old memory).
- Concatenation: `Buffer.concat([b1, b2])`. Always think **byte length**, not char length.

---

## PRACTICE QUESTIONS
**🟢:** What is a stream / why use one? · 4 stream types? · What is piping?
**🟡:** highWaterMark? · flowing vs paused mode? · pipe vs pipeline (why pipeline)? · Transform stream use case?
**🔴:** Explain backpressure end-to-end. · How does Readable.push return value signal flow control? · Implement a Transform/Readable. · Object mode?
**🧩:** Stream a 50GB file to a client with constant memory. · Fast producer crashes app with OOM — diagnose (no backpressure). · Compress + encrypt + upload a file as a pipeline. · CSV→JSON line transform of a huge file (readline + Transform).

## ⚡ REVISION
- Streams = chunked processing → constant memory, lower latency.
- Types: Readable, Writable, Duplex, Transform.
- `.write()` returns false ⇒ backpressure ⇒ wait for `'drain'`.
- Use **`pipeline()`** over `.pipe()` (errors + cleanup).
- `highWaterMark` = buffer threshold; `push(null)`/`end()` = EOF.

➡️ Next: **Module 7 — Memory Management.**
