# ESSENTIAL JS — SECTION 17: BROWSER APIs

---

## 1. fetch
**Definition:** Promise-based API for HTTP requests (modern replacement for XMLHttpRequest).
```js
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(data),
  signal: controller.signal,         // for cancellation
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);   // ⚠️ fetch doesn't reject on 4xx/5xx!
const json = await res.json();         // also .text() .blob() .arrayBuffer() .formData()
```
**Internal working:** returns a Promise resolving to a `Response` (streamable body). **Only rejects on network failure / CORS / abort** — HTTP error statuses still resolve (must check `res.ok`). Body is a **stream**, read once.
**Gotchas:** no timeout built-in (use AbortController), doesn't send cookies cross-origin unless `credentials: 'include'`, no upload progress.

## 2. XMLHttpRequest (XHR)
**Definition:** The legacy event-based HTTP API (pre-fetch). Verbose, callback/event-driven.
```js
const xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onload = () => { if (xhr.status === 200) handle(xhr.responseText); };
xhr.onerror = handleError;
xhr.upload.onprogress = e => {};   // upload progress (fetch lacks this)
xhr.send();
```
**vs fetch:** XHR supports **upload progress** + sync mode (deprecated); fetch is cleaner, promise-based, streamable. Use fetch unless you need progress (or use it via a library).

## 3. AbortController
**Definition:** Standard mechanism to **cancel** async operations (fetch, event listeners, streams).
```js
const controller = new AbortController();
fetch(url, { signal: controller.signal })
  .catch(e => { if (e.name === 'AbortError') console.log('cancelled'); });
controller.abort();                  // cancels the request

// timeout pattern
const timeout = (ms) => { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; };
fetch(url, { signal: timeout(5000) });
// or: AbortSignal.timeout(5000)
```
**Use:** cancel stale requests (fast-typing search), timeouts, cleanup on unmount → prevents race conditions + wasted work.

## 4. WebSocket
**Definition:** Full-duplex, persistent TCP connection between client & server over a single connection → **real-time bidirectional** communication.
```js
const ws = new WebSocket('wss://example.com/socket');
ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe' }));
ws.onmessage = e => handle(JSON.parse(e.data));
ws.onerror = handleError;
ws.onclose = () => reconnect();      // implement reconnection + backoff
ws.send(data);
ws.close();
```
**Internal working:** starts as HTTP, **upgrades** (`Upgrade: websocket` handshake) to a persistent connection → no per-message HTTP overhead, server can **push** anytime.
**Use:** chat, live feeds, notifications, collaborative editing, trading. **vs polling/SSE:** WS = bidirectional; SSE = server→client only (simpler, auto-reconnect); polling = simplest but inefficient.

## 5. Service Workers
**Definition:** A script that runs in the **background, separate from the page** (own thread), acting as a **network proxy** between the app and the network → enables offline, caching, push notifications, background sync. Core of **PWAs**.
```js
// register
navigator.serviceWorker.register('/sw.js');
// sw.js — intercept requests
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));  // cache-first
});
self.addEventListener('install', e => e.waitUntil(caches.open('v1').then(c => c.addAll(ASSETS))));
```
**Internal working:** event-driven, no DOM access, runs even when page is closed (for push/sync), HTTPS-only, lifecycle (install→activate→fetch). **Use:** offline support, asset caching, push notifications, background sync.

## 6. Web Workers
**Definition:** Run JS in a **background thread** → offload CPU-heavy work without blocking the main (UI) thread.
```js
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ cmd: 'compute', data });   // structured clone (copies data)
worker.onmessage = e => console.log(e.data);
worker.terminate();
// worker.js
self.onmessage = e => { const result = heavyCompute(e.data); self.postMessage(result); };
```
**Internal working:** separate thread + own event loop/global scope (`self`), **no DOM access**, communicate via `postMessage` (structured clone) or `SharedArrayBuffer` (shared memory). **Use:** image/video processing, parsing, encryption, large computations, keeping 60fps.
**vs Service Worker:** Web Worker = parallel computation; Service Worker = network proxy/offline (different purpose).

## 7. Comparison: Real-Time & Threading
| API | Purpose | Direction | Thread |
|-----|---------|-----------|--------|
| fetch/XHR | Request/response | client↔server (per request) | main |
| WebSocket | Persistent real-time | bidirectional | main |
| SSE (EventSource) | Server push | server→client | main |
| Service Worker | Network proxy/offline | intercepts requests | separate (bg) |
| Web Worker | CPU offload | postMessage | separate |

## 8. Common Mistakes
- Not checking `res.ok` (fetch resolves on 404/500).
- No request cancellation → race conditions (old response overwrites new).
- Reading a fetch body twice (stream consumed once).
- Blocking main thread with heavy compute (should use Web Worker).
- Accessing DOM in a Web/Service Worker (not available).
- No WebSocket reconnection logic.
- Service Worker caching stale assets (versioning/cache invalidation).

## 9. Best Practices
- Always check `res.ok`; handle errors; use AbortController (timeout + cancel stale).
- Offload CPU work to Web Workers (keep UI responsive).
- WebSocket: reconnect with backoff, heartbeat/ping, handle close.
- Service Worker: cache versioning, cache strategies (cache-first/network-first/SWR).
- Use `credentials`/CORS correctly; never expose secrets client-side.

## 10. Performance
- fetch/WS run on main thread but I/O is async (non-blocking).
- Web Workers prevent main-thread jank for CPU work; postMessage **copies** data (structured clone cost) — use Transferables/SharedArrayBuffer for large buffers.
- Service Workers + caching dramatically improve repeat-load performance (offline-first).
- WebSocket avoids HTTP overhead per message (efficient real-time).

## 11. Production Use Cases
- fetch + AbortController: API layer, search-as-you-type (cancel stale), timeouts.
- WebSocket: chat, live dashboards, notifications, multiplayer.
- Service Worker: PWAs, offline mode, push notifications, asset caching.
- Web Worker: image editors, data viz, crypto, CSV parsing, ML inference.

## 12. Coding Examples
```js
// fetch with timeout + retry
async function get(url, { timeout = 5000 } = {}) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
// cancel previous search
let controller;
function search(q) {
  controller?.abort();
  controller = new AbortController();
  return fetch(`/search?q=${q}`, { signal: controller.signal });
}
// worker pool sketch
const worker = new Worker('w.js');
const result = await new Promise(res => { worker.onmessage = e => res(e.data); worker.postMessage(input); });
```

## 13. Tricky Edge Cases
```js
fetch('/404').then(r => console.log(r.ok));   // false, but NOT rejected
const r = await fetch(url); await r.json(); await r.json();  // ❌ 2nd throws (body used)
controller.abort(); // fetch rejects with AbortError (name === 'AbortError')
new Worker('w.js').postMessage(document);      // ❌ DOM not cloneable / no DOM in worker
// Service worker only controls pages loaded AFTER it activates (scope rules)
```

## Output Prediction
```js
fetch('/api/missing')
  .then(r => console.log('ok?', r.ok))     // 'ok? false' (resolves!)
  .catch(() => console.log('network err')); // not hit for 404

const c = new AbortController();
fetch('/slow', { signal: c.signal }).catch(e => console.log(e.name)); // 'AbortError'
c.abort();
```

## Interview Questions
**🟢:** fetch vs XHR? · What is a Web Worker / Service Worker? · What is WebSocket for?
**🟡:** Why doesn't fetch reject on 404? · AbortController use cases? · Web Worker vs Service Worker? · WebSocket vs polling vs SSE?
**🔴:** Service Worker lifecycle + caching strategies. · Web Worker communication (structured clone vs SharedArrayBuffer). · WebSocket reconnection/backpressure. · Cancel stale requests (race condition fix).
**🧩:** Search box old results flash — AbortController cancel. · Heavy computation freezes UI — Web Worker. · App must work offline — Service Worker + cache. · Real-time chat — WebSocket + reconnect.

## ⚡ REVISION
- **fetch:** promise-based, doesn't reject on 4xx/5xx (check `res.ok`), body read once; AbortController for cancel/timeout.
- **XHR:** legacy, has upload progress; fetch otherwise preferred.
- **WebSocket:** persistent bidirectional real-time (HTTP upgrade); reconnect + heartbeat.
- **Service Worker:** bg network proxy → offline/caching/push (PWA), no DOM, HTTPS.
- **Web Worker:** bg thread for CPU work, no DOM, postMessage (structured clone) / SharedArrayBuffer.

➡️ Next: **Coding Interview Patterns (implement from scratch).**
