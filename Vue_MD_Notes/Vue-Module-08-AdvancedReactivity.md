# VUE MODULE 8: ADVANCED REACTIVITY

---

## 1. `toRef`
**Definition:** Creates a **ref that stays linked** to a single property of a reactive object (two-way sync). Preserves reactivity when you need one property out of a reactive source.
```js
const state = reactive({ count: 0 })
const countRef = toRef(state, 'count')
countRef.value++          // also updates state.count, and vice-versa
// Vue 3.3+: toRef(() => state.count) (getter, readonly normalization)
```
**Use:** Pass a single reactive prop into a composable without losing reactivity.

---

## 2. `toRefs`
**Definition:** Converts **all** properties of a reactive object into refs, each linked back. Enables **destructuring without losing reactivity**.
```js
const state = reactive({ x: 1, y: 2 })
const { x, y } = toRefs(state)   // x, y are linked refs
// classic composable return:
function useFeature() {
  const state = reactive({ loading: false, data: null })
  return { ...toRefs(state) }    // consumer can destructure & stay reactive
}
```
**Mistake it solves:** `const { x } = reactive(...)` → `x` is a plain value (dead). `toRefs` fixes it.

---

## 3. `toRef` vs `toRefs`
| | `toRef` | `toRefs` |
|---|--------|----------|
| Scope | One property | All properties |
| Returns | A ref | Object of refs |
| Use | Single prop into composable | Destructure a reactive/store |

---

## 4. `customRef`
**Definition:** Create a ref with **custom get/set logic** and control over **when to track and trigger**. Classic use: **debounced** input.
```js
function useDebouncedRef(value, delay = 300) {
  let timeout
  return customRef((track, trigger) => ({
    get() { track(); return value },
    set(newVal) {
      clearTimeout(timeout)
      timeout = setTimeout(() => { value = newVal; trigger() }, delay)
    }
  }))
}
const search = useDebouncedRef('')   // updates (and triggers) only after 300ms idle
```
You explicitly call `track()` on read and `trigger()` on write — full control of the reactivity timing.

---

## 5. `markRaw`
**Definition:** Marks an object so Vue **never makes it reactive** (skips proxying it, even inside reactive). Perf/correctness for large or external objects.
```js
const state = reactive({ chart: markRaw(new ThirdPartyChart()) })
// chart instance won't be deeply proxied (avoids breaking the lib + saves overhead)
```
**Use:** Map/chart/editor instances, big immutable data, class instances that dislike proxying.

---

## 6. `shallowRef` / `shallowReactive` (recap + advanced)
- `shallowRef`: reactive only on `.value` reassignment, not nested mutation.
- `shallowReactive`: only top-level keys reactive.
- **Advanced use:** integrate large external state, then call **`triggerRef`** to force update after a manual deep mutation.

## 7. `triggerRef`
**Definition:** Manually force a `shallowRef`'s effects to re-run after you mutated its nested value (which wouldn't trigger on its own).
```js
const state = shallowRef({ list: [] })
state.value.list.push(1)   // no trigger (shallow)
triggerRef(state)          // force dependents to update
```
**Pattern:** Batch many deep mutations on a shallowRef, then `triggerRef` once → one update instead of many.

---

## 8. `effectScope`
**Definition:** Groups multiple reactive effects (watchers, computeds) so they can be **disposed together** with one `scope.stop()`. Essential for composables that create effects outside a component, or for manual lifecycle control.
```js
import { effectScope } from 'vue'
const scope = effectScope()
scope.run(() => {
  watch(a, ...)              // these effects belong to the scope
  watchEffect(...)
  const c = computed(...)
})
// later — clean up ALL of them at once:
scope.stop()
```
**Use:** Shared composable state used by many components but created once; libraries managing reactive resources; preventing watcher leaks when not inside a component's auto-scope.

---

## 9. Summary Table
| API | Purpose | When |
|-----|---------|------|
| `toRef` | Link one reactive prop → ref | Pass single prop to composable |
| `toRefs` | All props → refs | Destructure reactive/store safely |
| `customRef` | Custom track/trigger timing | Debounce, async, validation refs |
| `markRaw` | Opt out of reactivity | Big/external/class objects |
| `shallowRef` | Top-level-only reactive box | Large/immutable, replace wholesale |
| `triggerRef` | Force shallowRef update | After manual deep mutation |
| `effectScope` | Group + dispose effects | Composables/libs lifecycle control |

---

## INTERVIEW QUESTIONS
**🟢:** toRef vs toRefs? · What is markRaw? · What is shallowRef?
**🟡:** Why does destructuring reactive break, and how does toRefs fix it? · When use customRef (debounce)? · shallowRef + triggerRef pattern.
**🔴:** Implement a debounced ref with customRef (track/trigger). · What problem does effectScope solve (effect leaks outside components)? · markRaw vs shallowReactive for a chart instance. · How triggerRef forces shallow updates.
**🧩:** Composable's watchers leak across uses — effectScope. · Search input re-fetches on every keystroke — customRef debounce. · Third-party map breaks under reactivity — markRaw. · Destructured store props are non-reactive — storeToRefs/toRefs.

## ⚡ REVISION
- toRef (one) / toRefs (all) → keep reactivity on destructure.
- customRef → control track/trigger (debounce).
- markRaw → never reactive; shallowRef/shallowReactive → top-level only; triggerRef → force shallow update.
- effectScope → dispose grouped effects together (no watcher leaks).

➡️ Next: **Module 9 — Pinia.**
