# VUE MODULE 19: SSR & NUXT

---

## 1. Rendering Strategies
| Strategy | Where HTML built | Pros | Cons |
|----------|------------------|------|------|
| **CSR** (Client-Side) | Browser (JS) | Simple, app-like | Slow first paint, poor SEO |
| **SSR** (Server-Side) | Server per request | Fast FCP, SEO, dynamic | Server cost, complexity |
| **SSG** (Static Gen) | Build time | Fastest, cacheable/CDN, SEO | Stale until rebuild, not for dynamic |
| **ISR** (Incremental) | Build + on-demand revalidate | SSG speed + freshness | Infra support needed |

```
CSR:  empty HTML → download JS → render        (blank → content)
SSR:  full HTML from server → hydrate            (content fast → interactive)
SSG:  prebuilt HTML from CDN → hydrate           (instant → interactive)
```

---

## 2. SSR (Server-Side Rendering)
**Definition:** Vue renders the component tree to an **HTML string on the server** per request; browser displays it immediately, then **hydrates**.
**Why:** Faster First Contentful Paint, SEO (crawlers see content), better social previews, good for content/dynamic pages.
```js
import { renderToString } from 'vue/server-renderer'
const app = createSSRApp(App)
const html = await renderToString(app)   // server
```
**Challenges:** no `window`/DOM on server (guard browser code in `onMounted`); per-request state isolation (fresh app + Pinia per request → no cross-user leakage); double data fetching; larger server cost.

---

## 3. CSR (Client-Side Rendering)
Default SPA: server sends a shell; JS renders everything. Fine for **auth-gated dashboards** (SEO irrelevant), internal tools. Worse first load + SEO.

---

## 4. SSG (Static Site Generation)
Pre-render pages to static HTML at **build time** → serve from CDN. Best for **marketing, docs, blogs** (content known at build). Combine with client hydration for interactivity. **ISR** revalidates stale pages on demand.

---

## 5. Hydration
**Definition:** The client-side process where Vue **attaches reactivity + event listeners** to the **server-rendered HTML** (instead of re-creating the DOM). Vue "adopts" existing DOM nodes.
```
Server HTML (static, visible) → JS loads → hydrate (attach listeners/reactivity) → interactive
```
**Hydration mismatch:** if client render ≠ server HTML (e.g., `Date.now()`, random, browser-only branches) → warning + re-render. Avoid non-deterministic render output.
**Cost:** Hydration still parses/executes JS over the whole tree → **TTI** can lag FCP. Mitigations:
- **Lazy/partial hydration** (hydrate components on visible/idle/interaction — `vue3-lazy-hydration`, Nuxt islands).
- **Server Components / Islands** (ship less JS).

---

## 6. Nuxt Architecture
**Definition:** The meta-framework for Vue — SSR/SSG/CSR, file-based routing, auto-imports, data fetching, SEO, modules.
```
nuxt-app/
  pages/            file-based routes (pages/users/[id].vue → /users/:id)
  components/       auto-imported
  composables/      auto-imported
  layouts/          shared layouts
  server/           Nitro API routes (server/api/*)
  middleware/       route middleware (auth)
  plugins/          app plugins
  nuxt.config.ts
```
**Key features:**
- **File-based routing** (no manual router config).
- **Auto-imports** (components, composables, Vue APIs).
- **Rendering modes per route** (`routeRules`: ssr/ssg/swr/isr).
- **Data fetching:** `useFetch`, `useAsyncData` (SSR-aware, dedup, no double fetch).
- **Nitro server** (universal server engine, deploy anywhere — node/edge/serverless).
- **SEO**: `useHead`, `useSeoMeta`.
- **State:** `useState` (SSR-safe shared state) + Pinia.

```vue
<script setup>
const { data, pending, error } = await useFetch('/api/users')  // SSR-safe, dedup
useSeoMeta({ title: 'Users' })
</script>
```

---

## 7. Performance Implications
- **SSR/SSG → better LCP/FCP + SEO**, but TTI bounded by hydration → minimize/shipped JS, lazy hydrate, code-split.
- **SSG/ISR → CDN-cacheable** (cheapest, fastest) where content allows.
- **`useFetch`/`useAsyncData`** prevent double-fetch (server payload reused on client).
- **Avoid hydration mismatches** (deterministic render).
- **Streaming SSR** sends HTML progressively (faster TTFB).

---

## 8. When to Use What
| App | Strategy |
|-----|----------|
| Marketing/blog/docs | SSG/ISR |
| E-commerce (SEO + dynamic) | SSR/ISR + Nuxt |
| Dashboard/internal tool (auth) | CSR (SPA) |
| Mixed | Per-route rules (Nuxt routeRules) |

---

## INTERVIEW QUESTIONS
**🟢:** CSR vs SSR vs SSG? · What is hydration? · What is Nuxt?
**🟡:** Why SSR (SEO/FCP)? · What is a hydration mismatch + causes? · useFetch vs fetch (double-fetch)? · When SSG vs SSR?
**🔴:** SSR state isolation per request (why fresh Pinia). · Hydration cost & partial/lazy hydration / islands. · Nitro + per-route rendering rules. · Streaming SSR.
**🧩:** SEO is poor on SPA — SSR/SSG/Nuxt. · Hydration warning from Date.now() — deterministic render. · Cross-user data leak in SSR — per-request app/store. · Slow TTI despite fast paint — reduce/lazy hydrate JS.

## ⚡ REVISION
- CSR (browser), SSR (server per request, SEO/FCP), SSG (build-time, CDN), ISR (revalidate).
- Hydration = attach reactivity/listeners to server HTML; mismatches from non-deterministic render.
- SSR needs per-request app+Pinia (isolation); guard browser code in onMounted.
- Nuxt = file routing, auto-imports, useFetch/useAsyncData (no double fetch), Nitro server, per-route rendering.

➡️ Next: **Module 20 — Security.**
