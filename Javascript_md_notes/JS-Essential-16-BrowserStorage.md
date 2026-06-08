# ESSENTIAL JS — SECTION 16: BROWSER STORAGE

---

## 1. The Storage Options
| | Cookies | localStorage | sessionStorage | IndexedDB |
|---|---------|--------------|----------------|-----------|
| Capacity | ~4 KB | ~5–10 MB | ~5–10 MB | Large (GBs, %disk) |
| Lifetime | Set expiry | Until cleared | Until tab closes | Until cleared |
| Sent to server | ✅ every request | ❌ | ❌ | ❌ |
| Scope | domain + path | origin | origin + tab | origin |
| API | `document.cookie` (string) | sync key-value | sync key-value | async, transactional |
| Data type | strings | strings | strings | structured (objects, blobs) |
| Accessible by JS | yes (unless HttpOnly) | yes | yes | yes |

## 2. Cookies
**Definition:** Small key-value strings stored by the browser, **automatically sent to the server** with every matching request.
```js
document.cookie = 'token=abc; Max-Age=3600; Secure; SameSite=Strict; path=/';
document.cookie;   // 'token=abc; other=x' (all readable cookies, string)
```
**Flags:** `HttpOnly` (JS can't read → XSS-safe), `Secure` (HTTPS only), `SameSite` (Strict/Lax/None → CSRF protection), `Max-Age`/`Expires`, `Domain`/`Path`.
**Use:** auth/session tokens (server-set, HttpOnly), server-readable preferences. **Downside:** sent on every request (bandwidth), tiny size.

## 3. localStorage
**Definition:** Synchronous key-value store (strings), persists **until explicitly cleared** (survives restarts), scoped to origin.
```js
localStorage.setItem('user', JSON.stringify(user));   // must serialize objects
JSON.parse(localStorage.getItem('user'));
localStorage.removeItem('user');
localStorage.clear();
// 'storage' event fires in OTHER tabs of same origin (cross-tab sync)
window.addEventListener('storage', e => console.log(e.key, e.newValue));
```
**Use:** non-sensitive persistent prefs (theme, language), client cache, feature flags.

## 4. sessionStorage
Same API as localStorage but data lives **only for the tab session** (cleared when tab closes; not shared across tabs).
```js
sessionStorage.setItem('step', '2');
```
**Use:** per-tab state (multi-step form progress, one-time flows).

## 5. IndexedDB
**Definition:** A low-level **asynchronous, transactional, object database** in the browser — stores large amounts of **structured data** (objects, blobs, files), supports indexes & queries.
```js
const req = indexedDB.open('myDB', 1);
req.onupgradeneeded = e => e.target.result.createObjectStore('users', { keyPath: 'id' });
req.onsuccess = e => {
  const db = e.target.result;
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').put({ id: 1, name: 'Ana' });
};
// Verbose → use wrappers (idb, Dexie.js)
```
**Use:** offline apps (PWA), caching large datasets, file/blob storage, complex client-side data. **Async** → won't block the main thread.

## 6. Storage Limits, Lifecycle, Security, Performance
**Limits:** Cookies ~4KB (per cookie, ~50 cookies/domain); localStorage/sessionStorage ~5–10MB; IndexedDB very large (browser/disk-dependent).
**Lifecycle:** Cookies (expiry-based) → localStorage (manual clear) → sessionStorage (tab close) → IndexedDB (manual clear). All can be wiped by the user / privacy mode / eviction under storage pressure.
**Security:**
- localStorage/sessionStorage are **JS-readable → vulnerable to XSS** (any injected script can read them).
- Cookies with **HttpOnly** can't be read by JS → safer for tokens, but exposed to **CSRF** (mitigate with SameSite + tokens).
- All client storage is **visible/editable by the user** → never trust it for security decisions; never store secrets unencrypted.
**Performance:**
- localStorage/sessionStorage are **synchronous** → large reads/writes **block the main thread** (jank). Keep small.
- IndexedDB is **async** → good for large data.
- Cookies add overhead to **every request** → keep minimal.

## 7. Comparisons

### Cookie vs localStorage
| Cookie | localStorage |
|--------|--------------|
| Sent to server | Client-only |
| ~4KB | ~5–10MB |
| Expiry control | Manual clear |
| HttpOnly option | Always JS-readable |
| Use: auth/session | Use: client prefs/cache |

### Cookie vs sessionStorage
| Cookie | sessionStorage |
|--------|----------------|
| Server-sent, persistent | Tab-only, ephemeral |
| Shared across tabs | Per-tab |
| Auth | Per-tab transient state |

### localStorage vs IndexedDB
| localStorage | IndexedDB |
|--------------|-----------|
| Sync, strings, ~5–10MB | Async, structured, large |
| Simple key-value | DB with indexes/transactions |
| Blocks main thread | Non-blocking |
| Small prefs/cache | Offline apps, big data |

## 8. INTERVIEW QUESTION: Where Should JWT Tokens Be Stored?
**Short answer:** **httpOnly, Secure, SameSite cookie** (or in-memory) — **NOT localStorage** for sensitive tokens.

| Option | Pros | Cons |
|--------|------|------|
| **localStorage** | Simple, persists, easy to send in header | **XSS-readable** (any injected script steals it); no auto-expiry |
| **httpOnly cookie** | **JS can't read → XSS-safe**; auto-sent | **CSRF risk** (mitigate: SameSite + CSRF token); sent every request |
| **In-memory (JS variable / store)** | Not persisted, XSS exposure minimal, lost on refresh | Lost on reload → need refresh-token flow |
| **sessionStorage** | Tab-scoped | Still XSS-readable |

**Recommended production pattern:**
- **Access token** in **memory** (short-lived, ~15 min) — minimal XSS window, not persisted.
- **Refresh token** in **httpOnly + Secure + SameSite cookie** — JS can't read it; used to silently mint new access tokens.
- This balances XSS (no readable token) and CSRF (SameSite + refresh rotation).
**Never:** store long-lived sensitive JWTs in localStorage in XSS-exposed apps. If you must, ensure strong CSP + sanitization.

**Risks recap:** localStorage → **XSS**; cookies → **CSRF**. Defense: httpOnly/Secure/SameSite cookies + CSP + short token lifetimes + refresh rotation.

## 9. Common Mistakes
- Storing JWT/sensitive data in localStorage (XSS theft).
- Forgetting to `JSON.stringify`/`parse` (localStorage only stores strings).
- Large synchronous localStorage operations (jank).
- Trusting client storage for authz (user can edit it).
- Not handling quota-exceeded errors.

## 10. Best Practices
- Tokens: httpOnly cookie / in-memory + refresh; not localStorage.
- Serialize objects (`JSON.stringify`); wrap parse in try/catch.
- Keep cookies tiny (sent every request); set Secure + SameSite + HttpOnly.
- Use IndexedDB (via idb/Dexie) for large/offline data.
- Handle storage quota errors; never store secrets unencrypted.

## 11. Coding Examples
```js
// safe localStorage wrapper
const store = {
  get: (k, def = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* quota */ } },
};
// cross-tab sync
window.addEventListener('storage', e => { if (e.key === 'theme') applyTheme(e.newValue); });
```

## 12. Tricky Edge Cases
```js
localStorage.setItem('x', 123);
typeof localStorage.getItem('x');     // 'string' ('123' — coerced)
localStorage.getItem('missing');      // null
localStorage.setItem('o', { a: 1 });
localStorage.getItem('o');            // '[object Object]' (forgot stringify!)
// quota exceeded → throws QuotaExceededError
// private/incognito → may throw or have 0 quota
// 'storage' event does NOT fire in the tab that made the change
```

## 13. Output Prediction
```js
localStorage.setItem('n', 5);
console.log(localStorage.getItem('n'), typeof localStorage.getItem('n')); // '5' 'string'
console.log(localStorage.getItem('nope'));        // null
sessionStorage.setItem('a', JSON.stringify({x:1}));
console.log(JSON.parse(sessionStorage.getItem('a')).x);  // 1
console.log(document.cookie);                     // 'k=v; ...' (string)
```

## Interview Questions
**🟢:** Cookie vs localStorage vs sessionStorage? · What's IndexedDB for? · Does localStorage persist after closing the tab?
**🟡:** Storage limits/lifecycle each? · Why is localStorage sync a problem? · Cross-tab sync (storage event)? · Cookie security flags?
**🔴:** **Where to store JWT + why (XSS vs CSRF trade-off)?** · IndexedDB transactions. · Quota/eviction handling. · Why client storage can't be trusted for authz.
**🧩:** Token stolen via XSS — was in localStorage; fix (httpOnly/in-memory). · Large dataset offline — IndexedDB. · Sync theme across tabs — storage event. · Per-tab form state — sessionStorage.

## ⚡ REVISION
- Cookie (~4KB, sent to server, HttpOnly/Secure/SameSite, auth) | localStorage (~5–10MB, persistent, sync, client prefs) | sessionStorage (tab-only) | IndexedDB (large, async, structured, offline).
- localStorage/sessionStorage = JS-readable → **XSS risk**; cookies HttpOnly → **CSRF risk** (SameSite + token).
- **JWT:** access token in-memory (short) + refresh token in httpOnly Secure SameSite cookie; NOT localStorage.
- localStorage is strings only (JSON.stringify/parse) + synchronous (don't block). Never trust client storage for security.

➡️ Next: **Browser APIs.**
