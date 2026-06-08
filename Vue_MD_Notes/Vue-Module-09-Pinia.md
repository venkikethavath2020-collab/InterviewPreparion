# VUE MODULE 9: PINIA (State Management)

---

## 1. Why Pinia
**Definition:** The official Vue state management library (replaced Vuex). Built on the Composition API + reactivity.
**Why it exists / why over Vuex:**
- **No mutations** — change state directly in actions (less boilerplate).
- **TypeScript-first** — full inference, no clunky typing.
- **Modular by design** — each store is independent (no nested modules namespace mess).
- **Composition API native** — define stores like composables.
- **Devtools + plugins + SSR** support; tiny (~1KB).
**When you need it:** shared/global state across many components (auth, cart, user, settings) — beyond what props/provide handle.

---

## 2. Store Architecture
A store has **State** (data), **Getters** (derived/cached), **Actions** (methods, sync+async). Two syntaxes:

**Option Stores (Vuex-like):**
```js
import { defineStore } from 'pinia'
export const useCounter = defineStore('counter', {
  state: () => ({ count: 0, name: 'A' }),
  getters: { double: (s) => s.count * 2 },
  actions: {
    inc() { this.count++ },
    async load() { this.name = await api.get() }
  }
})
```
**Setup Stores (Composition-style, recommended for flexibility):**
```js
export const useCounter = defineStore('counter', () => {
  const count = ref(0)                       // state
  const double = computed(() => count.value * 2)  // getter
  function inc() { count.value++ }           // action
  async function load() { /* ... */ }
  return { count, double, inc, load }
})
```

**Usage:**
```js
const store = useCounter()
store.inc()
store.count            // reactive
// destructure with reactivity preserved:
const { count, double } = storeToRefs(store)   // state+getters → refs
const { inc } = store                          // actions can destructure directly
```

---

## 3. State
- Defined via `state: () => ({...})` or refs in setup store.
- Directly mutable: `store.count++` (no mutations needed).
- Reset: `store.$reset()` (option stores). Patch: `store.$patch({...})` or `store.$patch(s => {...})` (batched).
- Subscribe: `store.$subscribe((mutation, state) => {})`.

## 4. Getters
- Derived, **cached** (like `computed`). `(state) => ...` or `this` in option stores.
- Can use other getters; can return functions for parameterized getters.
```js
getters: {
  activeUsers: (s) => s.users.filter(u => u.active),
  userById: (s) => (id) => s.users.find(u => u.id === id)  // parameterized
}
```

## 5. Actions
- Methods that mutate state; can be **async** (API calls). Access via `this` (option) or closures (setup).
- Can call other actions/stores. Subscribe: `store.$onAction(...)` for logging/error handling.

---

## 6. Plugins
**Definition:** Extend every store (add properties, persist state, log, etc.).
```js
function persistPlugin({ store }) {
  const saved = localStorage.getItem(store.$id)
  if (saved) store.$patch(JSON.parse(saved))
  store.$subscribe((_, state) => localStorage.setItem(store.$id, JSON.stringify(state)))
}
pinia.use(persistPlugin)
// Common: pinia-plugin-persistedstate
```
**Use:** persistence (localStorage), logging, undo/redo, injecting router/api into stores.

---

## 7. Store Composition
Stores can **use other stores** (just call `useOtherStore()` inside) — clean cross-store logic without modules.
```js
export const useCart = defineStore('cart', () => {
  const auth = useAuth()                 // compose
  const items = ref([])
  const canCheckout = computed(() => auth.isLoggedIn && items.value.length > 0)
  return { items, canCheckout }
})
```

---

## 8. Pinia Internals
- A Pinia instance holds a **reactive registry** of stores.
- `defineStore(id, ...)` returns a `useStore` function; first call **instantiates** the store (within an `effectScope`), caches it by `id` (singleton per app/pinia instance).
- State is a `reactive`/`ref` object; getters are `computed`; actions are plain functions bound to the store.
- Each store runs in its own `effectScope` → cleaned up on `dispose`.
- `storeToRefs` uses `toRefs` semantics (only state+getters, not actions) to keep destructured reactivity.
- SSR: a fresh Pinia per request (avoids cross-request state leakage).

---

## 9. Pinia vs Vuex
| | Vuex | Pinia |
|---|------|-------|
| Mutations | Required (boilerplate) | ❌ none |
| TypeScript | Painful | First-class |
| Modules | Nested, namespaced | Flat independent stores |
| API | Options only | Option + Setup |
| Size | Larger | ~1KB |
| Devtools | Yes | Yes (better) |
| Official (Vue 3) | Legacy | ✅ Recommended |

---

## 10. Migration from Vuex
```
Vuex module        → Pinia store (defineStore)
state              → state () / refs
getters            → getters / computed
mutations          → DELETE (merge into actions — direct mutation)
actions            → actions / functions
mapState/mapGetters→ storeToRefs(store)
mapActions         → destructure actions
namespaced modules → separate stores (compose with useX())
```
**Strategy:** Migrate store-by-store; Pinia + Vuex can coexist during transition; remove mutations by mutating state directly inside actions.

---

## 11. Enterprise Store Architecture
```
stores/
  auth.store.ts        (user, tokens, login/logout)
  cart.store.ts        (items, totals, checkout)
  catalog.store.ts     (products, filters)
  ui.store.ts          (modals, theme, toasts)
  index.ts             (pinia setup + plugins)
```
- One store per **domain**; keep stores focused.
- Stores compose (cart uses auth).
- Side-effects (API) in actions; components stay thin.
- Persist only what's needed (tokens/cart) — plugin.
- Reset stores on logout.
**Local vs store:** Keep **local UI state in components** (`ref`); only **shared cross-component** state in Pinia (avoid over-globalizing).

---

## INTERVIEW QUESTIONS
**🟢:** What is Pinia / why over Vuex? · State/getters/actions? · How to use a store?
**🟡:** Option vs setup store? · Why storeToRefs (destructure reactivity)? · Getters caching? · How do stores compose?
**🔴:** Pinia internals (effectScope, singleton per id, computed getters). · Write a persistence plugin. · SSR state isolation. · Migration plan from Vuex (drop mutations).
**🧩:** Destructured store values not reactive — storeToRefs. · State lost on refresh — persistence plugin/localStorage (see Module 24). · Cart needs auth state — store composition. · Cross-request state leak in SSR — per-request pinia.

## ⚡ REVISION
- Pinia = official store: state + getters(cached) + actions(async), NO mutations, TS-first, flat modular.
- `storeToRefs` to destructure state/getters reactively; actions destructure directly.
- Setup stores = composable-style; stores compose via useX().
- Internals: singleton per id, effectScope, computed getters; per-request instance in SSR.
- One store per domain; persist via plugin; keep local UI state local.

➡️ Next: **Module 10 — Router.**
