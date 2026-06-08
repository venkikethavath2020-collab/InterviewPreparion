# VUE MODULE 13: COMPOSABLES

---

## 1. What & Why
**Definition:** A composable is a **function that uses Composition API** (`ref`, `computed`, `watch`, lifecycle) to encapsulate and **reuse stateful logic**. Convention: named `useX`.
**Why:** Replace mixins (clashes, implicit deps) and `data/methods` duplication with explicit, testable, tree-shakeable logic units. "Custom hooks for Vue."
```js
// useCounter.js
import { ref, computed } from 'vue'
export function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  const inc = () => count.value++
  const reset = () => (count.value = initial)
  return { count, double, inc, reset }
}
// usage
const { count, inc } = useCounter(10)
```

---

## 2. Design Patterns / Rules
- **Name `useX`**, return an **object of refs** (destructure-friendly).
- **Accept refs/getters** for reactive inputs (so the composable reacts to changes):
```js
export function useFetch(url) {       // url is a ref or getter
  const data = ref(null)
  watchEffect(() => fetch(unref(url)).then(...))   // reacts to url changes
  return { data }
}
```
- **Side-effect cleanup** inside the composable (lifecycle hooks / watch stop handles) → caller doesn't manage it.
- **Composables can call composables** (compose logic).
- **Pure where possible**; isolate effects.
- Can be used **outside components** if you manage `effectScope`.

---

## 3. Production-Ready Composables

**(a) useFetch (with abort + states):**
```js
export function useFetch(url) {
  const data = ref(null), error = ref(null), loading = ref(false)
  let controller
  const run = async () => {
    controller?.abort()
    controller = new AbortController()
    loading.value = true; error.value = null
    try {
      const res = await fetch(unref(url), { signal: controller.signal })
      data.value = await res.json()
    } catch (e) { if (e.name !== 'AbortError') error.value = e }
    finally { loading.value = false }
  }
  watchEffect(run)                       // refetch when url changes
  onUnmounted(() => controller?.abort()) // cleanup
  return { data, error, loading, refetch: run }
}
```

**(b) useLocalStorage:**
```js
export function useLocalStorage(key, initial) {
  const stored = localStorage.getItem(key)
  const state = ref(stored ? JSON.parse(stored) : initial)
  watch(state, v => localStorage.setItem(key, JSON.stringify(v)), { deep: true })
  return state
}
```

**(c) usePagination:**
```js
export function usePagination(total, pageSize = 10) {
  const page = ref(1)
  const pages = computed(() => Math.ceil(unref(total) / pageSize))
  const next = () => page.value < pages.value && page.value++
  const prev = () => page.value > 1 && page.value--
  return { page, pages, next, prev }
}
```

**(d) useEventListener (auto-cleanup):**
```js
export function useEventListener(target, event, handler) {
  onMounted(() => target.addEventListener(event, handler))
  onUnmounted(() => target.removeEventListener(event, handler))
}
```

---

## 4. Enterprise Architecture
```
composables/
  core/        useFetch, useEventListener, useDebounce, useAsync
  features/    useCart, useAuth, useCheckout (domain logic)
  ui/          useModal, useToast, useTheme
```
- **Core** = generic utilities (often from VueUse).
- **Feature** = domain logic, may use Pinia stores inside.
- Keep composables **small, single-purpose, composed**.
- **VueUse** library = 200+ ready composables (don't reinvent).

---

## 5. Testing Composables
Composables that use only refs/computed/watch can be tested **in isolation**; those using lifecycle hooks need a host component.
```js
// pure composable — test directly
import { useCounter } from './useCounter'
test('counter', () => {
  const { count, inc } = useCounter()
  inc()
  expect(count.value).toBe(1)
})
// lifecycle composable — mount a test component
import { withSetup } from './test-utils'   // helper that runs setup in a component
```
**Pattern:** wrap in a minimal component (`@vue/test-utils mount`) when `onMounted`/effects are involved; assert reactive outputs after `nextTick`.

---

## 6. Best Practices / Mistakes
**Best practices:** accept refs/getters, return refs, clean up, name `useX`, compose, prefer VueUse for generic needs.
**Mistakes:** returning plain values (non-reactive), not cleaning up (leaks), side-effects in a getter, sharing module-scope state unintentionally (singleton when you wanted per-instance — or vice versa), heavy logic in a composable that should be a store.
**Composable vs Store:** composable = reusable **logic** (often per-component instance); Pinia store = shared **global state** (singleton). Module-scope state in a composable = de-facto singleton (use deliberately).

---

## INTERVIEW QUESTIONS
**🟢:** What is a composable / why? · Naming convention? · Composable vs mixin?
**🟡:** How to keep inputs reactive (refs/getters)? · Cleanup in composables? · Composable vs Pinia store? · What is VueUse?
**🔴:** Singleton vs per-instance composable state (module scope). · Test a lifecycle composable. · Build useFetch with abort + reactivity. · effectScope for composables outside components.
**🧩:** Composable doesn't react to prop changes — accept a ref/getter. · Memory leak from composable — missing cleanup. · Shared state unexpectedly global — module-scope ref. · Reuse fetch+cache logic across 20 components — design composable.

## ⚡ REVISION
- Composable = `useX()` reusing Composition API logic; returns refs.
- Accept refs/getters for reactivity; always clean up effects.
- Composable = logic (per-instance), Pinia = global state (singleton).
- Test pure ones directly; mount a host for lifecycle ones; use VueUse for generics.

➡️ Next: **Module 14 — State Management Architecture.**
