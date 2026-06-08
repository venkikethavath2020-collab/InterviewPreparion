# VUE MODULE 3: COMPOSITION API

---

## 1. What & Why
**Definition:** A set of function-based APIs (`setup`, `ref`, `reactive`, `computed`, `watch`, lifecycle hooks) that let you organize component logic **by feature** instead of by option type.

**Why it exists (problems with Options API at scale):**
- **Logic fragmentation:** one feature's `data`, `methods`, `computed`, `watch` scattered across the file.
- **Hard logic reuse:** mixins cause name clashes, unclear sources, implicit deps.
- **Weaker TypeScript** inference.
Composition API fixes all three: colocate feature logic + extract into **composables** + great TS.

```
Options API: organize by TYPE          Composition API: organize by FEATURE
  data:    [feature A, B, C]             const {…} = useFeatureA()
  methods: [feature A, B, C]             const {…} = useFeatureB()
  computed:[feature A, B, C]             const {…} = useFeatureC()
  → feature A spread across 3 places     → feature A in one block / one file
```

---

## 2. `setup()` (and `<script setup>`)
**Definition:** The entry point for Composition API. Runs **once, before the component is created** (before `beforeCreate`). Returns state/methods exposed to the template.
```js
export default {
  props: ['id'],
  setup(props, { emit, slots, attrs, expose }) {
    const count = ref(0)
    const double = computed(() => count.value * 2)
    function inc() { count.value++ }
    return { count, double, inc }     // exposed to template
  }
}
```
**`<script setup>` (recommended):** compile-time sugar — no `return`, top-level bindings auto-exposed, less boilerplate, better perf & TS.
```vue
<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
function inc() { count.value++ }
</script>
```
**`setup` context:** `props` (reactive, don't destructure without `toRefs`/`storeToRefs`), `emit`, `slots`, `attrs`, `expose`. **No `this`** in setup.

---

## 3. Core APIs (recap — see Module 2 for internals)
- **`ref`** — reactive box for any value (`.value`).
- **`reactive`** — deep reactive object.
- **`computed`** — lazy cached derived value.
- **`watch`** — react to a specific source (old/new, lazy).
- **`watchEffect`** — auto-track deps, run immediately.

---

## 4. When To Use Which
| Need | Use |
|------|-----|
| Primitive state | `ref` |
| Grouped object state | `reactive` (or refs) |
| Derived/cached value | `computed` |
| Side-effect on specific change (old value, async) | `watch` |
| Side-effect tracking many deps, run now | `watchEffect` |
| Reuse logic across components | **composable** (`useX()`) |
**Default:** `ref` + `computed`; reach for `watch` only for side effects (fetching, syncing), not derivations.

---

## 5. Real-World Patterns

**(a) Composable for data fetching:**
```js
// useFetch.js
import { ref, watchEffect } from 'vue'
export function useFetch(url) {
  const data = ref(null), error = ref(null), loading = ref(true)
  watchEffect(async () => {
    loading.value = true
    try { data.value = await (await fetch(url.value)).json() }
    catch (e) { error.value = e }
    finally { loading.value = false }
  })
  return { data, error, loading }
}
// component
const { data, error, loading } = useFetch(toRef(props, 'url'))
```

**(b) Composable with lifecycle + cleanup:**
```js
export function useMouse() {
  const x = ref(0), y = ref(0)
  const update = e => { x.value = e.pageX; y.value = e.pageY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))  // no leak
  return { x, y }
}
```

**(c) Shared state (lightweight store) via module-scope composable:**
```js
// useCounter.js — singleton state (module scope)
const count = ref(0)
export function useCounter() { return { count, inc: () => count.value++ } }
```

---

## 6. Best Practices
- Use `<script setup>` for app code.
- Name composables `useX`, return refs (destructure-friendly).
- Keep composables **pure & focused**; accept refs/getters as args for reactivity.
- Always clean up (listeners, timers, watchers) in `onUnmounted` / via watch return.
- Use `toRefs(props)` / `storeToRefs(store)` to keep destructured reactivity.
- Co-locate related logic; extract when reused or > ~50 lines.

## 7. Common Mistakes
- Destructuring `props`/`reactive` → loses reactivity.
- Forgetting `.value`.
- Creating refs **inside** loops/conditionals expecting persistence (setup runs once).
- Side-effects in `computed` (must be pure) → use `watch`.
- Not cleaning up → memory leaks.

## 8. Large-Scale Architecture
```
src/
  composables/      useAuth, useFetch, usePagination, useFeatureX
  stores/           Pinia stores (global state)
  components/       dumb/presentational
  features/         feature-based folders (composables + components + store slice)
  services/         API layer
```
Enterprise pattern: **feature folders** each export composables; shared cross-cutting logic in `composables/`; global state in Pinia; components stay thin (orchestrate composables).

---

## INTERVIEW QUESTIONS
**🟢:** What is Composition API / why? · What is setup / `<script setup>`? · When ref vs reactive?
**🟡:** Problems with Options API it solves (fragmentation, reuse, TS)? · setup vs lifecycle timing? · watch vs watchEffect in practice? · What is a composable?
**🔴:** Why no `this` in setup? · How does `<script setup>` differ at compile time? · Reactivity-safe prop passing to composables (toRef/toRefs). · Shared state via module-scope composable vs Pinia.
**🧩:** Refactor a 500-line Options component (extract composables). · Composable loses reactivity from props — fix. · Memory leak from a composable — diagnose (missing cleanup). · Design feature-based architecture.

## ⚡ REVISION
- Composition API organizes by feature; enables composables for reuse + great TS.
- `setup` runs before create, no `this`; `<script setup>` = recommended sugar.
- ref/computed default; watch/watchEffect for side-effects; toRefs to keep destructure reactivity.
- Composables = `useX()` returning refs; always clean up.

➡️ Next: **Module 4 — Options vs Composition API.**
