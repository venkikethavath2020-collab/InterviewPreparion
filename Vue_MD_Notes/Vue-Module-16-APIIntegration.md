# VUE MODULE 16: API INTEGRATION

---

## 1. Fetch vs Axios
| | `fetch` (native) | `axios` |
|---|------------------|---------|
| Built-in | ✅ | ❌ (dep) |
| JSON | Manual `res.json()` | Auto |
| Errors on 4xx/5xx | ❌ (only network) | ✅ throws |
| Interceptors | ❌ | ✅ |
| Timeout/cancel | AbortController | Built-in + AbortController |
| Upload progress | ❌ | ✅ |
**Use:** Axios for app-wide concerns (interceptors, auth, errors); fetch for lightweight/edge/SSR.

```js
// fetch
const res = await fetch('/api/users')
if (!res.ok) throw new Error(res.statusText)  // must check manually
const data = await res.json()
// axios
const { data } = await axios.get('/api/users')  // throws on error, auto-JSON
```

---

## 2. API Layer (Architecture)
**Never call axios/fetch directly in components.** Wrap in a **service layer**.
```
components → composables/stores → services (API layer) → http client (axios instance)
```
```js
// http.js — configured client
const http = axios.create({ baseURL: '/api', timeout: 10000 })
http.interceptors.request.use(cfg => {
  cfg.headers.Authorization = `Bearer ${useAuth().token}`
  return cfg
})
http.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) useAuth().logout()
    return Promise.reject(normalizeError(err))
  }
)
// services/user.service.js
export const userService = {
  list: (params) => http.get('/users', { params }).then(r => r.data),
  get:  (id) => http.get(`/users/${id}`).then(r => r.data),
  create: (body) => http.post('/users', body).then(r => r.data),
}
```
**Benefits:** centralized auth/errors/base URL, swappable transport, testable (mock service), typed responses.

---

## 3. Error Handling
- **Centralize** in response interceptor (401→logout, 403→forbidden, 5xx→toast).
- **Normalize** errors to a consistent shape `{ message, code, fields }`.
- Map **422 validation** → form errors.
- Surface user-friendly messages (toast/inline), log technical details.
- Distinguish network vs HTTP vs app errors.
```js
function normalizeError(err) {
  return {
    message: err.response?.data?.message || 'Something went wrong',
    status: err.response?.status,
    fields: err.response?.data?.errors
  }
}
```

---

## 4. Retry Mechanisms
**Definition:** Auto-retry transient failures (network blips, 502/503, timeouts) with **exponential backoff + jitter**. Don't retry 4xx (client errors) or non-idempotent unsafe ops blindly.
```js
async function withRetry(fn, retries = 3, base = 300) {
  for (let i = 0; i <= retries; i++) {
    try { return await fn() }
    catch (e) {
      if (i === retries || !isRetryable(e)) throw e
      await sleep(base * 2 ** i + Math.random() * 100)   // backoff + jitter
    }
  }
}
// axios: axios-retry library; or interceptor
```

---

## 5. Caching
**Definition:** Avoid redundant requests; serve cached data, revalidate in background.
- **Manual:** store responses in Pinia/Map keyed by request; check before fetching.
- **HTTP caching:** ETag/Cache-Control (browser handles).
- **Query libraries (recommended):** **TanStack Query (Vue Query)** — caching, dedup, stale-while-revalidate, retries, background refetch, pagination, mutations.
```js
import { useQuery } from '@tanstack/vue-query'
const { data, isLoading, error } = useQuery({
  queryKey: ['users', page],
  queryFn: () => userService.list({ page: page.value }),
  staleTime: 60_000
})
```
**Why a query lib:** eliminates manual loading/error/refetch/cache boilerplate; dedupes concurrent identical requests; keeps server state separate from client state.

---

## 6. Request Cancellation & Dedup
```js
const controller = new AbortController()
http.get('/search', { signal: controller.signal, params: { q } })
controller.abort()   // cancel stale (e.g., fast-typing search)
```
Cancel stale requests on new input / unmount → prevents race conditions (old response overwriting new). Query libs dedupe automatically.

---

## 7. Enterprise Architecture
```
services/
  http.ts            axios instance + interceptors (auth, error, retry)
  user.service.ts
  order.service.ts
composables/
  useUsers.ts        wraps service + vue-query (cache/loading/error)
stores/
  auth.store.ts      token, refresh logic
```
- **http client** = one configured instance (interceptors).
- **services** = endpoint functions (no UI).
- **composables/query** = caching, loading, error states for components.
- **stores** = auth tokens, refresh-token rotation.
- **Token refresh:** interceptor catches 401 → refresh → retry original request (queue concurrent 401s).

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** service layer, interceptors, normalized errors, retry+backoff, cache/dedup (query lib), cancel stale, typed responses, env-based base URL.
**Mistakes:** axios in components, no error handling, race conditions (no cancel), refetch storms (no cache/dedup), exposing secrets, retrying 4xx.
**Performance:** cache + dedup, pagination/infinite scroll, debounce search, parallel independent requests (`Promise.all`), prefetch on hover/route.

---

## INTERVIEW QUESTIONS
**🟢:** fetch vs axios? · Why an API/service layer? · How to handle errors centrally?
**🟡:** Interceptors use cases? · Retry with backoff — when/when not? · How to cancel stale requests? · Why a query library?
**🔴:** Token refresh on 401 (queue concurrent requests). · Client vs server state + cache invalidation. · Race condition fix (cancel/dedup). · Normalized error architecture.
**🧩:** Search fires per keystroke + old results flash — debounce + cancel. · 401 logs user out mid-session — refresh-token interceptor. · Same data fetched by 5 components — dedup/cache (query lib). · Map server validation errors to form (422).

## ⚡ REVISION
- Axios instance + interceptors (auth, errors, retry); never call HTTP in components → service layer.
- Normalize errors; retry transient with backoff+jitter (not 4xx).
- Cancel stale requests (AbortController); cache + dedup via TanStack Query.
- Token refresh on 401 (queue concurrent); separate server state from client state.

➡️ Next: **Module 17 — Micro Frontends.**
