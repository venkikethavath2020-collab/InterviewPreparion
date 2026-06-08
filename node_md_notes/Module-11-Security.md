# MODULE 11: SECURITY

---

## 1. Authentication vs Authorization
- **Authentication (AuthN):** *Who are you?* Verify identity (password, token, OAuth). Failure → **401**.
- **Authorization (AuthZ):** *What can you do?* Check permissions/roles. Failure → **403**.

**Password storage:** NEVER plaintext or fast hashes (sha256/md5). Use **bcrypt / scrypt / argon2** (slow, salted, adaptive).
```js
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);        // cost factor 12
const ok   = await bcrypt.compare(password, hash);
```

---

## 2. JWT (Recap + Security)
`header.payload.signature` — stateless. **Security rules:**
- Strong secret / RS256 keypair; rotate keys.
- Short expiry (15m access) + refresh token rotation.
- Payload is **base64, not encrypted** → never store secrets in it.
- Validate `alg` (reject `alg: none`), `exp`, `iss`, `aud`.
- Store in **httpOnly Secure cookie** (XSS-safe) over localStorage.
- Revocation: maintain a blocklist or use short TTL + refresh tokens.

---

## 3. OAuth 2.0
**Definition:** Delegated authorization — let an app access resources on a user's behalf **without sharing the password** (Login with Google/GitHub).
```
User → App → Auth Server (Google) → consent → authorization code
App → exchanges code + secret → access token → calls resource API
```
**Grant types:** Authorization Code (+ PKCE for SPAs/mobile) ✅ recommended, Client Credentials (server-to-server), (Implicit — deprecated). **OIDC** adds an identity layer (ID token) on top of OAuth.
Use **Passport.js** in Node for many providers.

---

## 4. CSRF (Cross-Site Request Forgery)
**Definition:** A malicious site tricks a logged-in user's browser into making an unwanted authenticated request (cookies auto-sent).
```
victim logged into bank.com (cookie) → visits evil.com →
evil.com auto-submits POST bank.com/transfer → browser sends bank cookie → transfer!
```
**Defenses:** **SameSite cookies** (`Strict`/`Lax`), **CSRF tokens** (synchronizer token in form/header validated server-side), check `Origin`/`Referer`, use `Authorization` header (not cookies) for APIs.
**Key:** CSRF exploits **cookie-based** auth; token-in-header APIs are largely immune.

---

## 5. XSS (Cross-Site Scripting)
**Definition:** Injecting malicious JS into a page that runs in other users' browsers (steal cookies/tokens, act as user). Types: Stored, Reflected, DOM-based.
**Defenses:**
- **Output encoding / escaping** (escape HTML when rendering user data).
- **Content-Security-Policy** header (restrict script sources).
- `HttpOnly` cookies (JS can't read them).
- Sanitize input (DOMPurify); frameworks auto-escape (React).
- Avoid `innerHTML`/`eval`/`dangerouslySetInnerHTML`.

---

## 6. SQL Injection
**Definition:** Injecting SQL via unsanitized input (`'; DROP TABLE users; --`).
```js
// ❌ VULNERABLE
db.query(`SELECT * FROM users WHERE name = '${input}'`);
// ✅ Parameterized (driver escapes)
db.query('SELECT * FROM users WHERE name = $1', [input]);
```
**Defenses:** Parameterized queries / prepared statements (primary), ORMs (still parameterize), least-privilege DB user, input validation. NoSQL injection exists too (`{ $gt: '' }`) — validate/cast types.

---

## 7. Rate Limiting
**Definition:** Cap requests per client/time to prevent abuse, brute force, DoS.
```js
import rateLimit from 'express-rate-limit';
app.use(rateLimit({ windowMs: 60_000, max: 100 }));  // 100 req/min/IP → 429
```
**Algorithms:** Fixed window, **Sliding window**, **Token bucket** (allows bursts), Leaky bucket. **Distributed** rate limiting needs **Redis** (shared counter across instances). Return **429 Too Many Requests** + `Retry-After`.

---

## 8. Helmet
**Definition:** Express middleware setting **secure HTTP headers** by default.
```js
import helmet from 'helmet';
app.use(helmet());
```
Sets: `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options` (clickjacking), `X-DNS-Prefetch-Control`, removes `X-Powered-By`, etc.

---

## 9. CORS (Cross-Origin Resource Sharing)
**Definition:** Browser security mechanism controlling which **origins** can call your API. The server declares allowed origins via `Access-Control-Allow-*` headers; the browser enforces.
```js
import cors from 'cors';
app.use(cors({ origin: ['https://app.com'], credentials: true }));
```
**Preflight:** For non-simple requests, browser sends `OPTIONS` first; server must respond with allowed methods/headers. **Mistake:** `origin: '*'` with `credentials: true` (disallowed/insecure) — be explicit.
**Note:** CORS is a **browser** restriction; server-to-server calls ignore it.

---

## 10. Other Essentials (OWASP-flavored)
- **HTTPS/TLS everywhere**; HSTS.
- **Input validation** (Joi/Zod/express-validator) — validate type, length, format.
- **Secrets management** — env vars / vault, never in code/repo.
- **Dependency security** — `npm audit`, Snyk, lockfiles; supply-chain risk.
- **Avoid `eval`, `child_process` with user input** (command injection).
- **Limit body size** (`express.json({limit})`) — DoS protection.
- **Error handling** — don't leak stack traces/SQL to clients in prod.
- **Logging & monitoring** — detect attacks; don't log secrets/PII.

---

## PRACTICE QUESTIONS
**🟢:** AuthN vs AuthZ? · How to store passwords? · What is XSS/CSRF/SQLi? · What is CORS?
**🟡:** JWT security pitfalls? · CSRF defenses (SameSite, tokens)? · XSS defenses (CSP, escaping, HttpOnly)? · What does Helmet do? · Rate-limiting algorithms?
**🔴:** OAuth Authorization Code + PKCE flow. · Why is `alg: none` dangerous? · Distributed rate limiting design (Redis). · 401 vs 403. · NoSQL injection.
**🧩:** Design secure login (bcrypt + JWT/refresh + rate limit + CSRF). · API leaks stack traces in prod — fix. · Prevent brute-force on /login (rate limit + lockout). · Harden an Express app (helmet, cors, validation, limits).

## ⚡ REVISION
- AuthN(401) vs AuthZ(403); bcrypt/argon2 for passwords.
- JWT: short TTL + refresh, httpOnly cookie, validate alg/exp.
- CSRF→SameSite+tokens; XSS→escape+CSP+HttpOnly; SQLi→parameterize.
- Rate limit (Redis for distributed)→429; Helmet headers; CORS explicit origins.
- Validate input, manage secrets, `npm audit`, limit body size, hide errors.

➡️ Next: **Module 12 — Scalability.**
