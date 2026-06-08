# VUE MODULE 22: LARGE-SCALE APPLICATION ARCHITECTURE

> For each: Folder Structure · State · API · Performance · Testing.

---

## Universal Enterprise Structure (Feature-Sliced)
```
src/
  app/             app setup, providers, router, pinia
  pages/ (or views/)   route-level components
  features/        feature-sliced (each: components, composables, store, api, types)
    auth/  cart/  catalog/  ...
  shared/          ui kit, utils, composables, http client
  entities/        domain models (normalized)
  router/          route modules + guards
  stores/          (or per-feature)
  services/        api layer
  assets/  styles/
```
**Principles:** feature folders own their slice; shared/ for cross-cutting; thin components; logic in composables; state in Pinia; API in services.

---

## 1. Admin Dashboard
**Requirements:** Many CRUD modules, RBAC, tables/charts, lazy modules.
```
Folder: features/{users,roles,reports}/ + shared/ui (DataTable, Chart)
State:  Pinia per domain (users, roles, ui); local UI state in components
API:    service layer + vue-query for cached lists; CRUD store factory
Perf:   lazy-load route modules, virtual-scroll tables, v-memo rows,
        KeepAlive tabs, code-split charts (async components)
Test:   unit (composables/stores), component (DataTable), E2E (critical CRUD flows)
Security: route guards (meta.roles), server-enforced authz
```

## 2. CMS Platform
**Requirements:** Dynamic content, rich editors, dynamic forms, SEO (public side).
```
Folder: features/{content,media,forms-builder}, shared/editor
State:  content store (normalized byId), draft/publish workflow; ui store
API:    services + optimistic updates; media upload (progress)
Perf:   async-load heavy editor, SSG/ISR for public pages (Nuxt), image lazy-load
Test:   form-builder unit, editor integration, content publish E2E
Special: dynamic forms (schema-driven), scoped-slot renderless blocks
```

## 3. E-Commerce Frontend
**Requirements:** SEO, fast LCP, cart, checkout, search, high traffic.
```
Folder: features/{catalog,cart,checkout,auth,search}
State:  catalog (normalized + vue-query cache), cart (persisted), auth (token), checkout (composes cart+auth)
API:    service layer + query cache + retry; dedup; prefetch on hover
Perf:   SSR/ISR (Nuxt) for SEO+LCP, route code-split, image lazy-load,
        virtual product grid, debounced search, CDN
Test:   unit (cart totals), component (product card), E2E (add-to-cart→checkout)
Security: server authz, sanitize reviews (XSS), CSP, token handling
```

## 4. Trading Dashboard (real-time)
**Requirements:** High-frequency streaming data, low latency, dense UI.
```
Folder: features/{markets,orderbook,charts,portfolio}, shared/ws
State:  shallowRef + markRaw for streaming feeds (avoid deep reactivity cost);
        Pinia for portfolio/orders
API:    WebSocket service (subscribe/throttle); REST for history
Perf:   shallowRef/triggerRef for ticks, throttle/batch updates (requestAnimationFrame),
        virtual scroll order book, v-memo rows, Web Workers for heavy calc,
        avoid re-render storms (fine-grained refs)
Test:   unit (calc/formatters), integration (ws mock), perf budgets
Special: backpressure on socket, reconnection, deterministic render
```

## 5. SaaS Application (multi-tenant)
**Requirements:** Auth/roles/tenancy, billing, settings, dashboards, scale teams.
```
Folder: feature-sliced + per-tenant theming (provide/inject)
State:  auth/tenant store, feature stores, ui store; query cache for server state
API:    service layer + interceptors (tenant header, auth refresh), error normalization
Perf:   lazy feature modules, micro-frontends per team (Module Federation) if needed,
        SSR for marketing, CSR for app, code-split by route/permission
Test:   unit + component + E2E per critical flow; contract tests (MFE)
Security: RBAC guards (server-enforced), CSP, token rotation, tenant isolation
Scale:   modular stores, feature ownership, design system package, CI per feature
```

---

## Cross-Cutting Decisions (say these in interviews)
| Concern | Recommendation |
|---------|----------------|
| Architecture | Feature-sliced; thin components; logic in composables |
| State | Local first → Pinia for global; query lib for server state |
| API | Service layer + interceptors + retry + cache/dedup |
| Routing | Lazy modules + guards + meta (roles/title) |
| Performance | Code-split, virtualize, memoize, shallow reactivity, SSR/SSG where SEO matters |
| Testing | Pyramid: unit (composables/stores), component (VTU), E2E (Cypress) |
| Security | Server-enforced authz, sanitize, CSP, careful token storage |
| Consistency | Design system, lint/format, conventions, code review |

---

## INTERVIEW QUESTIONS
**🟡:** How do you structure a large Vue app? · Where does state/API/logic live? · Feature-sliced vs layer-based folders?
**🔴:** State strategy for a trading dashboard (shallowRef/markRaw/throttle). · SEO-critical e-commerce architecture (SSR/ISR/cache). · Multi-team SaaS (micro-frontends, feature ownership). · Testing strategy across the pyramid.
**🧩:** App grew to 300 components, unmaintainable — feature-slice refactor. · Real-time dashboard janks — shallow reactivity + throttle + virtualize. · E-commerce SEO + LCP poor — Nuxt SSR/ISR. · Teams block each other — MFE + modular stores.

## ⚡ REVISION
- Feature-sliced structure; thin components; composables for logic; Pinia for global state; query lib for server state.
- Admin: lazy modules + virtual tables. CMS: dynamic forms + SSG public. E-commerce: SSR/ISR + cache + code-split. Trading: shallowRef/markRaw + throttle + virtualize. SaaS: RBAC + modular + maybe MFE.
- Cross-cutting: service-layer API, route guards, perf (split/memo/virtualize), testing pyramid, server-enforced security.

➡️ Next: **Module 23 — Interview Master Section.**
