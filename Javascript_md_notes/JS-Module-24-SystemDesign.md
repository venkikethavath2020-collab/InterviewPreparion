# JS MODULE 24: FRONTEND SYSTEM DESIGN

> Framework: Requirements → Architecture → Data flow/State → Performance → Real-time → Scaling → Trade-offs.

---

## Universal Frontend Design Approach (say this)
1. **Clarify** functional + non-functional requirements (scale, devices, latency, offline, SEO).
2. **Component architecture** (tree, reusable units, design system).
3. **State management** (local vs global, server cache).
4. **Data fetching** (REST/GraphQL, caching, pagination, real-time).
5. **Performance** (code splitting, virtualization, lazy load, CRP).
6. **Resilience** (error/empty/loading states, retries, offline).
7. **Accessibility, security, testing, observability.**

---

## 1. Dashboard (Analytics/Admin)
**Requirements:** Many widgets/charts, filters, large tables, periodic refresh, role-based.
```
App Shell (layout, nav, auth)
 ├─ Filter bar (global state)
 ├─ Widget grid (lazy-loaded charts — async/code-split)
 └─ Data table (virtualized, paginated, sortable)
State: server cache (React Query/SWR) + UI state (local)
Data:  REST/GraphQL + polling/websocket for live metrics
```
- **Performance:** code-split charts, **virtualize** large tables, memoize derived data, debounce filters, cache queries (stale-while-revalidate).
- **Real-time:** polling (simple) or WebSocket (live).
- **Trade-offs:** polling simplicity vs WS efficiency; SSR if SEO/first-paint matters (usually not for admin).

## 2. Chat Application
**Requirements:** Real-time messaging, presence, history, typing indicators, scale.
```
Client ──WebSocket──► Gateway ──► message service
State: messages by conversation (normalized), optimistic send
UI:    virtualized message list, infinite scroll (load older)
```
- **Real-time:** **WebSocket** (bidirectional); fallback long-polling. Reconnection + backoff.
- **Optimistic UI:** show message immediately, reconcile on ack.
- **Performance:** virtualize long lists, paginate history, debounce typing events, image lazy-load.
- **Offline:** queue outgoing messages, sync on reconnect (service worker).
- **Trade-offs:** ordering/dedup (message IDs), delivery guarantees, presence cost.

## 3. Real-Time Tracking App (e.g., ride/delivery)
**Requirements:** Live location on a map, low latency, smooth animation, many updates/sec.
```
Server ──WebSocket/SSE──► Client → map render (throttled)
State: current positions (shallow/fast updates), route
```
- **Real-time:** WebSocket/SSE; **throttle** position updates to render rate; interpolate between points for smooth movement.
- **Performance:** `requestAnimationFrame` for map updates, throttle/coalesce updates, Web Worker for heavy geo calc, avoid re-rendering whole map.
- **Resilience:** reconnect, buffer, handle GPS gaps.
- **Trade-offs:** update frequency vs battery/bandwidth; SSE (one-way, simpler) vs WS (two-way).

## 4. E-Commerce Frontend
**Requirements:** SEO, fast LCP, catalog/search, cart, checkout, high traffic, conversions.
```
SSR/SSG (Next/Nuxt) for product pages (SEO + LCP)
 ├─ Catalog (cached, paginated, faceted search)
 ├─ Cart (persisted localStorage/state)
 └─ Checkout (forms + validation + payment)
State: server cache (products) + client state (cart) + auth
```
- **Performance:** **SSR/SSG/ISR** for SEO + first paint, route code-splitting, image optimization (lazy + responsive), CDN, virtual product grids, prefetch on hover.
- **Resilience:** optimistic cart, retry payments, error boundaries.
- **Security:** sanitize reviews (XSS), secure checkout, CSP, token handling.
- **Trade-offs:** SSR cost vs SEO benefit; client cart vs server cart (logged-in sync).

---

## Cross-Cutting Concepts (mention in any design)
| Concern | Approach |
|---------|----------|
| State | Local first → global (store) → server cache (React Query/SWR) |
| Data | REST/GraphQL; cache + dedup + pagination; real-time via WS/SSE |
| Performance | Code split, lazy load, virtualize, memoize, optimize CRP, CDN |
| Rendering | CSR (apps) / SSR/SSG (SEO + LCP) per page |
| Resilience | Loading/error/empty states, retries, optimistic UI, offline |
| Real-time | WebSocket (2-way), SSE (1-way), polling (simple) |
| A11y/Sec | Semantic HTML, ARIA, sanitize, CSP, server-enforced authz |
| Observability | Error tracking (Sentry), Web Vitals, analytics |

---

## INTERVIEW QUESTIONS
**🟡:** How to structure a large frontend app? · State strategy (client vs server state)? · WebSocket vs SSE vs polling?
**🔴:** Design a real-time dashboard (live data + perf). · SEO-critical e-commerce (SSR/SSG/cache). · Chat with optimistic UI + offline. · Virtualization for huge lists.
**🧩:** 10k-row table janks — virtualize + memo. · Live tracking drains battery — throttle + interpolate. · Cart lost on refresh — persist. · Product pages don't rank — SSR/SSG.

## ⚡ REVISION
- Approach: requirements → components → state → data/caching → performance → resilience → a11y/security.
- Dashboard: cache + virtualize + code-split + poll/WS.
- Chat: WebSocket + optimistic UI + virtualized list + offline queue.
- Tracking: WS/SSE + throttle + rAF + interpolation.
- E-commerce: SSR/SSG (SEO/LCP) + cache + code-split + CDN + persisted cart.
- Real-time: WS (2-way) / SSE (1-way) / polling (simple).

➡️ Next: **Module 25 — Interview Master Section.**
