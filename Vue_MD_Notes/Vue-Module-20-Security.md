# VUE MODULE 20: SECURITY (Vue-specific)

---

## 1. XSS (Cross-Site Scripting)
**Definition:** Injecting malicious scripts that run in users' browsers.
**Vue's protection:** `{{ }}` interpolation and `v-bind` **auto-escape** content → safe by default.
**Vue's risk areas:**
- **`v-html`** — renders raw HTML → **XSS if user-controlled**. Sanitize (DOMPurify) or avoid.
- **Dynamic `:href`/`:src`** with `javascript:` URLs → validate/whitelist protocols.
- **Render functions / `innerHTML`** in custom code.
- **`v-bind` to dangerous attrs** (e.g., binding user data into `<script>`/`<style>`).
```vue
<div v-html="userContent"></div>            <!-- ❌ XSS -->
<div v-html="sanitize(userContent)"></div>  <!-- ✅ DOMPurify -->
{{ userContent }}                            <!-- ✅ escaped -->
```
**Best practice:** never `v-html` untrusted input; sanitize; validate URLs; use CSP.

---

## 2. CSRF (Cross-Site Request Forgery)
**Definition:** Malicious site triggers authenticated requests using the victim's cookies.
**Vue/SPA context:** mostly a **backend** concern, but the frontend cooperates:
- Prefer **token in `Authorization` header** (not cookies) for APIs → immune to CSRF.
- If using cookies: **SameSite=Strict/Lax** + **CSRF token** (server issues, axios sends in header).
- Configure axios to attach the CSRF token (`xsrfCookieName`/`xsrfHeaderName`).

---

## 3. Content Security Policy (CSP)
**Definition:** HTTP header restricting which scripts/styles/sources can load → defense-in-depth against XSS.
```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```
**Vue note:** Avoid `eval`/inline scripts; Vue's **runtime-only build** (precompiled templates) is CSP-friendly. The **full build compiles templates with `new Function`** → needs `unsafe-eval` (avoid in prod). Use SFCs + build step.

---

## 4. Authentication
**Definition:** Verify identity. In SPAs, typically token-based (JWT) or cookie-session.
- **Token storage:**
  - **httpOnly Secure cookie** — safest (JS can't read → XSS-safe), but CSRF considerations.
  - **localStorage** — convenient but **readable by XSS** (avoid for sensitive tokens).
  - **In-memory** (Pinia) + refresh via httpOnly cookie — good balance.
- **Refresh tokens:** short-lived access token + httpOnly refresh; rotate; refresh via interceptor on 401.
```js
// in-memory access token + httpOnly refresh cookie pattern
const auth = useAuth()   // token in memory; lost on refresh → re-fetch via /refresh
```

---

## 5. Authorization (Vue-side)
**Definition:** Control what authenticated users can access. **Client checks are UX only — enforce on the server.**
- **Route guards:** `meta.roles` + `beforeEach` → redirect unauthorized.
- **Conditional UI:** `v-if="can('edit')"` to hide controls.
- **Directive:** custom `v-permission` directive.
```js
router.beforeEach((to) => {
  const auth = useAuth()
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) return '/403'
})
```
**Critical:** hiding a button ≠ security — the API must authorize every request.

---

## 6. JWT (Vue context)
- Store carefully (see Auth above); **never** store secrets — payload is base64, readable.
- Validate `exp` client-side for UX (refresh proactively); server always verifies.
- Attach via axios interceptor `Authorization: Bearer`.
- Logout = clear in-memory token + invalidate refresh server-side.

---

## 7. Other Vue/SPA Security
- **Dependency security:** `npm audit`, lockfiles, vet plugins (supply chain).
- **Env/secrets:** never ship secrets in client bundle (everything client-side is public — only `VITE_`-public config).
- **Source maps:** disable/private in prod.
- **Open redirects:** validate `redirect` query params.
- **Clickjacking:** `X-Frame-Options`/CSP `frame-ancestors`.
- **Sensitive data:** don't cache PII in localStorage/Pinia persistently.
- **Input validation:** validate client-side (UX) **and** server-side (security).

---

## 8. Best Practices / Mistakes
**Best practices:** escape by default ({{ }}), sanitize v-html, token in httpOnly/in-memory, server-enforced authz, CSP, runtime-only build, audit deps, no secrets in bundle.
**Mistakes:** `v-html` with user input, JWT in localStorage, trusting client-side authz, secrets in `VITE_` vars exposed to bundle, `javascript:` URLs, full build + unsafe-eval CSP.

---

## INTERVIEW QUESTIONS
**🟢:** How does Vue prevent XSS by default? · v-html risk? · Where to store JWT?
**🟡:** CSRF in SPAs — header token vs cookie? · CSP + Vue builds (unsafe-eval)? · Client vs server authorization?
**🔴:** Secure token strategy (in-memory + httpOnly refresh + rotation). · Why client-side authz is UX-only. · Sanitizing dynamic HTML/URLs. · Supply-chain & bundle secret exposure.
**🧩:** User comment with `<script>` executes — v-html XSS, sanitize. · Token stolen via XSS — move off localStorage. · Hidden admin button still callable — server authz. · CSP blocks app — full build unsafe-eval → switch to SFC build.

## ⚡ REVISION
- Vue auto-escapes {{ }}/binds; `v-html` = XSS → sanitize (DOMPurify).
- JWT: httpOnly cookie or in-memory + refresh; never localStorage for sensitive tokens; never secrets in payload/bundle.
- Authz on client = UX only; enforce on server; route guards + meta.roles.
- CSP + runtime-only build (avoid unsafe-eval); audit deps; validate URLs/redirects.

➡️ Next: **Module 21 — Design Patterns.**
