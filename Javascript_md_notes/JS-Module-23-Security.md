# JS MODULE 23: SECURITY (Frontend/JS)

---

## 1. XSS (Cross-Site Scripting)
**Definition:** Injecting malicious JS that runs in other users' browsers → steal cookies/tokens, hijack sessions, deface.
**Types:** **Stored** (persisted in DB), **Reflected** (in URL/response), **DOM-based** (client-side sink).
```js
// ❌ vulnerable
el.innerHTML = userInput;              // <img src=x onerror=alert(1)>
location.href = userInput;             // javascript: URLs
document.write(userInput);
// ✅ safe
el.textContent = userInput;            // escaped
el.innerHTML = DOMPurify.sanitize(userInput);
```
**Defenses:** output encoding/escaping; **`textContent`** over `innerHTML`; **sanitize** (DOMPurify); **CSP** header; `HttpOnly` cookies (JS can't read); avoid `eval`/`innerHTML`/`document.write`; validate URLs (block `javascript:`).

---

## 2. CSRF (Cross-Site Request Forgery)
**Definition:** A malicious site triggers an authenticated request using the victim's cookies (auto-sent).
```
victim logged into bank.com (cookie) → visits evil.com →
evil.com auto-submits POST bank.com/transfer → browser attaches cookie → executes
```
**Defenses:** **SameSite cookies** (`Strict`/`Lax`); **CSRF tokens** (synchronizer token validated server-side); check `Origin`/`Referer`; use `Authorization` header tokens (not cookies) for APIs → CSRF-immune.

---

## 3. CORS (Cross-Origin Resource Sharing)
**Definition:** A browser mechanism that **relaxes** the Same-Origin Policy in a controlled way — the server declares which origins may read its responses via `Access-Control-Allow-*` headers; the **browser enforces**.
```
Access-Control-Allow-Origin: https://app.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Credentials: true
```
- **Preflight:** for non-simple requests, browser sends `OPTIONS` first; server must approve methods/headers.
- **Common confusion:** CORS is a **browser** restriction (server-to-server ignores it); `Allow-Origin: *` can't combine with credentials.
- A CORS error means the **server didn't permit** the cross-origin read — fix on the server, not the client.

---

## 4. Same-Origin Policy (SOP)
**Definition:** The foundational browser security model: scripts can only access resources from the **same origin** (scheme + host + port). Blocks reading cross-origin responses, cross-origin DOM access, etc.
```
https://app.com:443  vs  https://app.com       → same origin
https://app.com      vs  http://app.com        → different (scheme)
https://app.com      vs  https://api.app.com    → different (host)
```
CORS, postMessage, JSONP are controlled ways to cross origins.

---

## 5. Other JS Security Concerns
- **Prototype pollution:** attacker sets `__proto__`/`constructor.prototype` via merged user input → affects all objects. Defense: validate keys, `Object.create(null)`, freeze prototypes, safe merge libs.
- **Clickjacking:** site embedded in iframe to trick clicks. Defense: `X-Frame-Options`/CSP `frame-ancestors`.
- **Dependency/supply-chain:** malicious npm packages. Defense: `npm audit`, lockfiles, vet deps, SRI for CDN scripts.
- **Sensitive data exposure:** secrets in client bundle are public — never ship secrets; tokens in `localStorage` are XSS-readable.
- **`eval`/`Function`** with user input = code injection — avoid.
- **Open redirects:** validate redirect URLs.

---

## 6. CSP (Content Security Policy)
**Definition:** HTTP header restricting allowed sources for scripts/styles/etc. → strong defense-in-depth against XSS.
```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```
Disallows inline scripts/`eval` (unless explicitly allowed) → blocks most injected scripts.

---

## 7. Best Practices Summary
- Escape/sanitize all user-rendered content; prefer `textContent`.
- CSP + HttpOnly + Secure + SameSite cookies.
- Tokens: httpOnly cookie or in-memory (not localStorage for sensitive).
- Validate + sanitize input client AND server (server is the real boundary).
- `npm audit`, SRI, vet dependencies.
- Never trust the client; enforce authz on the server.
- Avoid `eval`, dynamic HTML, prototype-polluting merges.

---

## INTERVIEW QUESTIONS
**🟢:** What is XSS/CSRF/CORS/SOP? · textContent vs innerHTML? · Where to store JWT?
**🟡:** XSS defenses (escape/CSP/HttpOnly)? · CSRF defenses (SameSite/token)? · Why does a CORS error happen + fix? · What is the Same-Origin Policy?
**🔴:** Stored vs reflected vs DOM XSS. · Prototype pollution attack + defense. · CORS preflight flow. · CSP design. · Token storage trade-offs (XSS vs CSRF).
**🧩:** Comment with `<script>` runs — XSS, sanitize. · Frontend can't call API (CORS) — fix on server. · Token stolen via XSS — move off localStorage. · Merging user JSON breaks all objects — prototype pollution.

## ⚡ REVISION
- **XSS** = injected JS → escape/textContent/sanitize/CSP/HttpOnly.
- **CSRF** = cookie-based forged requests → SameSite + tokens; header-token APIs immune.
- **CORS** = browser-enforced cross-origin permission (fix on server); SOP is the base model (scheme+host+port).
- Also: prototype pollution, clickjacking, supply-chain, no secrets in bundle, no eval.
- Never trust the client; enforce security server-side.

➡️ Next: **Module 24 — Frontend System Design.**
