# Web Storage (localStorage, sessionStorage, Cookies, IndexedDB)

## Definition

Browser client-side storage mechanisms for persisting data without a server: **localStorage**, **sessionStorage**, **cookies**, **IndexedDB**, and the **Cache API**.

## localStorage

- Persists with **no expiration** — survives browser restarts.
- ~5–10 MB; stores **strings only**.
```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");   // "dark"
localStorage.removeItem("theme");
localStorage.clear();
```

## sessionStorage

- Same API, but cleared when the **tab/window closes**. Scoped per tab.
```js
sessionStorage.setItem("cart", JSON.stringify({ item: "Book", qty: 1 }));
JSON.parse(sessionStorage.getItem("cart")); // { item: "Book", qty: 1 }
```

## localStorage vs sessionStorage

| | localStorage | sessionStorage |
|---|---|---|
| Lifetime | until cleared | until tab closes |
| Scope | all tabs (same origin) | single tab |
| Capacity | ~5–10 MB | ~5 MB |
| Sent to server | no | no |

> Both store **strings only** — use `JSON.stringify`/`JSON.parse` for objects.

## Cookies

- Small (~4 KB), **sent with every HTTP request** to the same origin.
- Used for sessions, auth tokens, tracking.
```js
document.cookie = "username=JohnDoe; path=/; max-age=3600";
document.cookie;                                  // read all
document.cookie = "username=; path=/; max-age=0"; // delete
```
> Use `HttpOnly`, `Secure`, and `SameSite` flags for security-sensitive cookies (set server-side).

## IndexedDB

- Low-level, **asynchronous**, transactional DB for large structured data and blobs.
```js
const req = indexedDB.open("MyDatabase", 1);
req.onupgradeneeded = (e) => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains("MyStore"))
    db.createObjectStore("MyStore", { keyPath: "id" });
};
req.onsuccess = (e) => {
  const db = e.target.result;
  const store = db.transaction("MyStore", "readwrite").objectStore("MyStore");
  store.add({ id: 1, name: "Item 1" });
};
```

## Cache API & Service Workers

- Cache HTML/CSS/JS/images for offline use — core to **PWAs**.
```js
caches.open("my-cache").then((cache) => cache.add("/index.html"));
```

## Choosing the Right Storage

| Need | Use |
|---|---|
| User prefs, persists across sessions | localStorage |
| Per-tab temporary state | sessionStorage |
| Auth token sent to server | Cookie (HttpOnly) |
| Large structured / offline data | IndexedDB |
| Cached assets / offline app | Cache API |

## Limitations & Security

* Web Storage stores **strings only** and is synchronous (can block on large data).
* Accessible via JS → vulnerable to **XSS**; never store secrets/JWTs in localStorage if avoidable.
* Cookies travel with every request → keep them small; protect with flags.
* WebSQL is **deprecated** — use IndexedDB.

## Interview Questions

1. localStorage vs sessionStorage vs cookies.
2. How do you store an object in localStorage?
3. Why are cookies sent on every request and Web Storage isn't?
4. When would you reach for IndexedDB?
5. Security risks of storing tokens in localStorage.

## Key Takeaways

* localStorage persists; sessionStorage is per-tab; both are string-only.
* Cookies are small and travel with requests; IndexedDB handles large async data.
* Mind XSS — don't store sensitive data client-side carelessly.
