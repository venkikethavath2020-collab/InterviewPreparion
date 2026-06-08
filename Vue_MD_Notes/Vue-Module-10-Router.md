# VUE MODULE 10: VUE ROUTER

---

## 1. Routing Internals
**Definition:** Vue Router maps **URLs → components**, enabling SPA navigation without page reloads.
**How it works:**
```
URL change → router matches route → resolves component → renders in <router-view>
```
- **History modes:**
  - `createWebHistory()` — HTML5 History API (clean URLs `/users/1`); needs server fallback to `index.html`.
  - `createWebHashHistory()` — hash URLs (`/#/users/1`); no server config; worse SEO.
  - `createMemoryHistory()` — no URL (SSR/testing).
- Router listens to `popstate`/link clicks, computes the matched route record, updates a **reactive** `currentRoute`, and `<router-view>` (a dynamic component) renders the matched component.
```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/users/:id', component: User }]
})
```
```vue
<router-link to="/users/1">User</router-link>
<router-view />   <!-- renders matched component -->
```

---

## 2. Dynamic Routes
```js
{ path: '/users/:id', component: User }              // params
{ path: '/files/:path(.*)*', component: Files }      // catch-all/repeatable
{ path: '/:pathMatch(.*)*', component: NotFound }    // 404
```
Access: `route.params.id`, `route.query.q`, `route.hash`. **Reactive** — use `watch(() => route.params.id, ...)` because the component is **reused** when only params change (not remounted). Pass params as props: `props: true`.

---

## 3. Nested Routes
**Definition:** Routes within routes → nested `<router-view>` for layouts (e.g., dashboard with sub-pages).
```js
{
  path: '/dashboard', component: DashboardLayout,
  children: [
    { path: '', component: Overview },
    { path: 'settings', component: Settings },   // /dashboard/settings
    { path: 'users/:id', component: UserDetail }
  ]
}
```
Parent renders `<router-view>` where children appear.

---

## 4. Lazy Loading (Code Splitting)
**Definition:** Load route components **on demand** → smaller initial bundle.
```js
{ path: '/admin', component: () => import('./views/Admin.vue') }   // dynamic import = separate chunk
```
Vite/Webpack split each into its own chunk; loaded when the route is visited. **Best practice:** lazy-load all non-critical routes; group related chunks with magic comments / route grouping.

---

## 5. Navigation Guards
**Definition:** Hooks to intercept navigation (auth, confirmation, data prefetch). Each can `return false` (cancel), a route (redirect), or nothing (proceed).
| Guard | Scope | Use |
|-------|-------|-----|
| `router.beforeEach` | Global | Auth checks, redirects |
| `router.beforeResolve` | Global | After component resolved, before nav confirmed |
| `router.afterEach` | Global | Analytics, title (no cancel) |
| `beforeEnter` | Per-route | Route-specific guard |
| `onBeforeRouteUpdate` | In-component | Same component, param change |
| `onBeforeRouteLeave` | In-component | Prevent leaving (unsaved changes) |
```js
router.beforeEach((to, from) => {
  const auth = useAuth()
  if (to.meta.requiresAuth && !auth.isLoggedIn)
    return { path: '/login', query: { redirect: to.fullPath } }
})
// in-component
onBeforeRouteLeave(() => { if (hasUnsavedChanges) return confirm('Leave?') })
```
**Order:** beforeEach → route beforeEnter → component beforeRouteUpdate/Enter → beforeResolve → afterEach.

---

## 6. Route Meta
**Definition:** Custom metadata attached to routes (`meta`), read in guards/components.
```js
{ path: '/admin', component: Admin, meta: { requiresAuth: true, roles: ['admin'], title: 'Admin' } }
// guard
if (to.meta.roles && !to.meta.roles.includes(user.role)) return '/403'
```
Use for: auth flags, role-based access, page titles, layouts, transitions, breadcrumbs.

---

## 7. Large-Scale Routing Strategies
```
router/
  index.ts            (createRouter + global guards)
  routes/
    auth.routes.ts
    admin.routes.ts   (lazy-loaded, meta.requiresAuth, role guards)
    public.routes.ts
  guards/
    auth.guard.ts
    role.guard.ts
```
- **Modular route files** per feature, merged in index.
- **Lazy-load** every feature route.
- **Centralized guards** (auth, roles, title, progress bar).
- **Layout routes** via nested routes (`AuthLayout`, `AppLayout`).
- **Scroll behavior**, **transitions**, **error/404** routes.
- Pass `redirect` query for post-login return.

---

## INTERVIEW QUESTIONS
**🟢:** What does Vue Router do? · History vs hash mode? · How to define a dynamic route / read params?
**🟡:** Navigation guards types & order? · How to protect routes (auth + meta)? · Lazy load routes? · Why watch route params (component reuse)?
**🔴:** Router internals (currentRoute reactivity, router-view as dynamic component). · Guard execution order in full. · Nested routes + layouts architecture. · SSR/history fallback config.
**🧩:** Auth redirect with return URL — beforeEach + query. · Param change doesn't refetch — component reused, watch params. · Unsaved-changes prompt — onBeforeRouteLeave. · Huge initial bundle — lazy load routes. · Role-based access — meta + guard.

## ⚡ REVISION
- URL→component; `createWebHistory` (clean, needs fallback) vs hash.
- Dynamic `:param` (reactive, component reused → watch params); nested routes for layouts.
- Lazy load: `() => import()` per route.
- Guards: beforeEach (auth) → beforeEnter → component guards → afterEach (analytics); `meta` for auth/roles/title.

➡️ Next: **Module 11 — Performance Optimization.**
