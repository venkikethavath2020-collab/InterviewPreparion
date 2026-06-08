# MODULE 8: HTTP & WEB SERVERS

---

## 1. HTTP Lifecycle (How Node Handles a Request Internally)
```
1. Client opens TCP connection (3-way handshake) → Node's `net` layer
2. Bytes arrive → llhttp parser parses request line + headers
3. http module emits 'request' event with (req, res)
4. req = IncomingMessage (Readable stream: body chunks)
   res = ServerResponse (Writable stream)
5. Your handler runs (event loop), does async I/O (DB, etc.)
6. You write headers + body to res; res.end() flushes & finishes
7. Keep-alive: connection reused for next request, or closed
```
```
TCP socket → llhttp parse → 'request' event → handler → res stream → client
   (net)       (parser)      (http module)    (your JS)   (write)
```

---

## 2. Request Lifecycle
`req` (IncomingMessage, a **Readable stream**):
```js
req.method;            // GET/POST...
req.url;               // '/path?q=1'
req.headers;           // lowercased object
// body is a STREAM — must be collected:
let body = '';
req.on('data', c => body += c);
req.on('end', () => { const json = JSON.parse(body); });
```
**Key:** Body isn't auto-parsed in core `http` — you stream it (Express's `body-parser`/`express.json()` does this for you). Watch backpressure & size limits (DoS).

---

## 3. Response Lifecycle
`res` (ServerResponse, a **Writable stream**):
```js
res.statusCode = 200;
res.setHeader('Content-Type', 'application/json');
res.writeHead(200, { 'Content-Type': 'application/json' }); // status + headers together
res.write(chunk);      // optional streaming
res.end(JSON.stringify(data));   // finish (headers must be set before first write)
```
**Rule:** Headers must be sent **before** the body. `Cannot set headers after they are sent` = you wrote then tried to set headers / sent response twice.

---

## 4. REST APIs
**Definition:** Architectural style: resources identified by URLs, manipulated via HTTP methods, **stateless**, uniform interface.
| Method | Action | Idempotent? | Safe? |
|--------|--------|-------------|-------|
| GET | Read | ✅ | ✅ |
| POST | Create | ❌ | ❌ |
| PUT | Replace | ✅ | ❌ |
| PATCH | Partial update | ❌ (usually) | ❌ |
| DELETE | Remove | ✅ | ❌ |
**Idempotent** = same effect if repeated. **Safe** = no state change. **REST principles:** statelessness, client-server, cacheability, uniform interface, layered system.

---

## 5. Status Codes
| Range | Class | Examples |
|-------|-------|----------|
| 1xx | Informational | 100 Continue, 101 Switching |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Moved, 302 Found, 304 Not Modified |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests |
| 5xx | Server error | 500 Internal, 502 Bad Gateway, 503 Unavailable, 504 Gateway Timeout |
**401 vs 403:** 401 = not authenticated (who are you?); 403 = authenticated but not allowed.

---

## 6. Headers
Metadata key-value pairs. Important ones:
- `Content-Type`, `Content-Length`, `Accept`
- `Authorization: Bearer <token>`
- `Cache-Control`, `ETag`, `If-None-Match` (caching)
- `Set-Cookie` / `Cookie`
- CORS: `Access-Control-Allow-Origin`, etc.
- Security: `Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy` (Helmet sets these).

---

## 7. Cookies
**Definition:** Small data the server stores in the browser via `Set-Cookie`; the browser returns it via `Cookie` on each request → enables state over stateless HTTP.
```
res.setHeader('Set-Cookie', 'sid=abc; HttpOnly; Secure; SameSite=Strict; Max-Age=3600')
```
**Flags:** `HttpOnly` (no JS access → XSS protection), `Secure` (HTTPS only), `SameSite` (CSRF protection), `Max-Age`/`Expires`, `Domain`/`Path`.

---

## 8. Sessions
**Definition:** Server-side state keyed by a session ID stored in a cookie.
```
Login → server creates session (in memory/Redis) → sends sid cookie
Next req → cookie sid → server looks up session → identifies user
```
**Stateful** → needs shared store (Redis) when scaling horizontally (can't keep sessions in one process's memory across many pods). Sticky sessions or central store required.

---

## 9. JWT (JSON Web Token)
**Definition:** A self-contained, **stateless** token: `header.payload.signature` (base64url). Server signs it; later verifies the signature — no server-side session lookup.
```
header:    { "alg": "HS256", "typ": "JWT" }
payload:   { "sub": "userId", "role": "admin", "exp": 1699999999 }
signature: HMACSHA256(base64(header)+'.'+base64(payload), secret)
```
```js
import jwt from 'jsonwebtoken';
const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: '15m' });
const decoded = jwt.verify(token, SECRET);   // throws if invalid/expired
```
**Sessions vs JWT:**
| | Session (cookie) | JWT |
|---|------------------|-----|
| State | Server-side store | Stateless (in token) |
| Revoke | Easy (delete session) | Hard (need blocklist/short TTL) |
| Scaling | Needs shared store | Scales freely |
| Size | Tiny cookie | Larger token every request |
| Best for | Web apps | APIs, microservices, mobile |
**Best practice:** short-lived access token (15m) + refresh token (httpOnly cookie) rotation. Never put secrets in the payload (it's only base64, readable). Store JWT in httpOnly cookie (XSS-safe) rather than localStorage when possible.

---

## PRACTICE QUESTIONS
**🟢:** HTTP methods? · 401 vs 403? · What is a cookie? · Status code classes?
**🟡:** How does Node handle a request internally (TCP→llhttp→event→handler→res)? · Is req/res a stream? · Sessions vs JWT? · Cookie security flags?
**🔴:** Walk the full request lifecycle in core http. · How to handle request body backpressure & size limits? · JWT structure & verification; how to revoke? · Idempotency & why PUT vs POST matters for retries.
**🧩:** Design auth for a horizontally-scaled API (JWT vs Redis sessions). · "Cannot set headers after sent" error — cause. · Stream a large file response with proper headers. · Implement rate limiting + 429.

## ⚡ REVISION
- Node: TCP → llhttp parse → 'request' event → handler → res (Writable).
- req = Readable (stream body), res = Writable (headers before body).
- 2xx ok, 4xx client, 5xx server; 401 auth vs 403 authz.
- Cookies: HttpOnly+Secure+SameSite. Sessions = stateful (Redis to scale); JWT = stateless (short TTL + refresh).

➡️ Next: **Module 9 — Express.js.**
