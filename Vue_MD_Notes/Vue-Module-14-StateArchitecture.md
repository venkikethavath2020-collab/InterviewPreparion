# VUE MODULE 14: STATE MANAGEMENT ARCHITECTURE

---

## 1. The State Spectrum (choose the right scope)
```
Local (component)  →  Shared (subtree)  →  Global (app-wide)
   ref/reactive        provide/inject         Pinia store
                       composable (module)
```
**Golden rule:** Keep state as **local as possible**; promote to shared/global only when multiple distant components truly need it. Over-globalizing creates coupling, re-render breadth, and harder testing.

---

## 2. Local State
**Definition:** State owned by one component (UI toggles, form fields, hover).
```vue
<script setup>
const isOpen = ref(false)
const form = reactive({ name: '', email: '' })
</script>
```
**Use for:** anything not needed elsewhere. Cheapest, most isolated. **Don't** put modal-open or input values in Pinia.

---

## 3. Shared State (between related components)
**Options:**
- **Props/emits** — parent ↔ child.
- **provide/inject** — ancestor → deep descendants (theme, config). Provide `readonly` refs.
- **Module-scope composable** — lightweight shared state without Pinia:
```js
// useSelection.js
const selected = ref(new Set())     // module scope = shared singleton
export function useSelection() { return { selected } }
```
**Use for:** feature-local sharing, layout context, lightweight cross-component state.

---

## 4. Global State (Pinia)
**Definition:** App-wide state needed by many unrelated components — auth/user, cart, settings, notifications.
```js
export const useAuth = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  async function login(creds) { user.value = await api.login(creds) }
  function logout() { user.value = null }
  return { user, isLoggedIn, login, logout }
})
```
**Use for:** cross-cutting domain state, persisted state, side-effect coordination.

---

## 5. Decision Table
| State | Scope | Tool |
|-------|-------|------|
| Input value, toggle, hover | One component | `ref`/`reactive` |
| Theme, locale, config | Subtree | `provide/inject` |
| Feature-local shared | Few components | composable (module scope) |
| Auth, cart, user, settings | App-wide | **Pinia** |
| Server cache (queries) | App-wide | TanStack Query / custom + Pinia |

---

## 6. Modular Stores (Enterprise)
```
stores/
  auth.store.ts        user, tokens, login/logout, roles
  cart.store.ts        items, totals (composes auth)
  catalog.store.ts     products, filters, pagination
  ui.store.ts          modals, toasts, theme, sidebar
  notifications.store.ts
  index.ts             createPinia + plugins (persist, logger)
```
- **One store per domain**; small & focused.
- Stores **compose** (`cart` calls `useAuth()`).
- **Actions** hold side-effects (API); components stay thin.
- **Persist** selectively (tokens, cart) via plugin.
- **Reset on logout** (clear sensitive stores).
- **Server state** (lists, entities) often better in a **query cache** (TanStack Query) than hand-rolled Pinia — separates client UI state from server cache.

---

## 7. Patterns for Scale
- **Client state vs Server state:** keep UI/client state in Pinia; cache server data with a query lib (dedupe, retry, stale-while-revalidate) — avoids manual loading/error/refetch boilerplate.
- **Normalized state:** store entities by id (`{ byId, allIds }`) to avoid duplication and ease updates.
- **Feature-sliced architecture:** each feature folder owns its store slice + composables + components.
- **Selectors via getters/computed:** derive, don't duplicate.

---

## 8. Enterprise Example — E-commerce
```
auth.store      → user, JWT, roles
cart.store      → items, qty, totals (getter), addItem/remove (actions)
catalog.store   → products (normalized byId), filters, fetchProducts
checkout.store  → address, payment, placeOrder (composes cart+auth)
ui.store        → toasts, modal, theme
```
- Components dispatch actions, read getters via `storeToRefs`.
- Catalog data cached; cart persisted to localStorage; auth reset on logout.

---

## INTERVIEW QUESTIONS
**🟢:** Local vs global state? · When use Pinia vs ref? · provide/inject use?
**🟡:** When does shared state need Pinia vs composable vs provide? · Why keep state local? · How to share state without Pinia?
**🔴:** Client vs server state separation (why a query lib). · Normalized state design. · Modular store architecture + composition. · Over-globalization pitfalls (coupling, re-renders).
**🧩:** Everything's in one giant store — refactor to domains. · Server data refetch/loading boilerplate everywhere — query cache. · Modal state in Pinia causing app-wide renders — move local. · Cart must survive refresh + reset on logout — persist + reset.

## ⚡ REVISION
- Keep state local; promote only when needed (local → provide/inject/composable → Pinia).
- Pinia = app-wide domain state; one store per domain; compose stores; persist selectively.
- Separate client state (Pinia) from server cache (query lib); normalize entities.
- Over-globalizing = coupling + broad re-renders.

➡️ Next: **Module 15 — Forms & Validation.**
