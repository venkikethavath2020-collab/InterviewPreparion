# VUE MODULE 2: REACTIVITY SYSTEM (MOST IMPORTANT)
> The #1 deep-dive topic in senior Vue interviews. Understand track/trigger from first principles.

---

## 1. What is Reactivity
**Definition:** A system where **state changes automatically propagate** to anything that depends on them (the DOM, computeds, watchers) — without you manually wiring updates.

**Why it exists:** Manual DOM updates (`el.textContent = ...`) are error-prone and don't scale. Reactivity lets you write `count++` and the UI updates itself.

**Core idea (mental model):**
```
"When this STATE changes, re-run these EFFECTS that used it."
```
Two operations make this work:
- **track** — when an effect *reads* a reactive property, record "this effect depends on this property."
- **trigger** — when a property *changes*, re-run all effects that tracked it.

---

## 2. The Building Blocks
| Term | Meaning |
|------|---------|
| **Reactive object** | Proxy-wrapped object whose reads are tracked, writes trigger |
| **Effect** | A function whose execution depends on reactive state (render fn, computed, watcher) |
| **Dependency (dep)** | The set of effects subscribed to one property |
| **track()** | Records the currently-running effect as a dependency of a property |
| **trigger()** | Re-runs all effects in a property's dep set |
| **targetMap** | `WeakMap<target, Map<key, Dep>>` — the global dependency graph |

---

## 3. Proxy & Reflect (Vue 3's foundation)
**Proxy:** Wraps an object to **intercept** operations (`get`, `set`, `deleteProperty`, `has`…). Vue uses `get` to **track** and `set` to **trigger**.
**Reflect:** Performs the default operation correctly, preserving the right `this` (receiver) for getters — used inside Proxy traps.

```js
const obj = { count: 0 }
const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    track(target, key)                       // record dependency
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)                     // re-run effects
    return result
  }
})
```

**Why Proxy over Vue 2's `Object.defineProperty`?**
| | Vue 2 (defineProperty) | Vue 3 (Proxy) |
|---|------------------------|---------------|
| New property add | ❌ undetected (`Vue.set`) | ✅ |
| Property delete | ❌ | ✅ |
| Array index set / length | ❌ | ✅ |
| Nested objects | Walk & convert upfront (slow) | **Lazy** — proxy on access |
| Maps/Sets | ❌ | ✅ |

---

## 4. The Dependency Graph (targetMap)
```
targetMap (WeakMap)
  └─ target object ──► depsMap (Map)
                          └─ key 'count' ──► Dep (Set of effects)
                                                ├─ renderEffect
                                                ├─ computedEffect
                                                └─ watcherEffect
```
- **WeakMap** keyed by the raw object → so unreferenced objects get GC'd (no leak).
- Each key maps to a **Dep** (a Set of effects).
- On read → add active effect to that Set. On write → re-run every effect in the Set.

---

## 5. Effect (the heart)
**Definition:** A wrapper around a function that, while running, registers itself as the "active effect" so any reactive read can track it.
```js
let activeEffect = null
class ReactiveEffect {
  constructor(fn) { this.fn = fn }
  run() {
    activeEffect = this
    const result = this.fn()   // reads inside here get tracked to `this`
    activeEffect = null
    return result
  }
}
function effect(fn) { const e = new ReactiveEffect(fn); e.run(); return e }
```
The component's **render function is wrapped in an effect** → reading reactive state during render subscribes the component to that state.

---

## 6. track & trigger (implementation)
```js
const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)               // subscribe current effect
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) dep.forEach(effect => effect.run())   // re-run subscribers
}
```

---

## 7. BUILD SIMPLIFIED VUE REACTIVITY FROM SCRATCH
```js
let activeEffect = null
const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target) ?? targetMap.set(target, new Map()).get(target)
  let dep = depsMap.get(key) ?? depsMap.set(key, new Set()).get(key)
  dep.add(activeEffect)
}
function trigger(target, key) {
  targetMap.get(target)?.get(key)?.forEach(fn => fn())
}
function reactive(obj) {
  return new Proxy(obj, {
    get(t, k, r) { track(t, k); return Reflect.get(t, k, r) },
    set(t, k, v, r) { const ok = Reflect.set(t, k, v, r); trigger(t, k); return ok }
  })
}
function effect(fn) { activeEffect = fn; fn(); activeEffect = null }

// ---- DEMO ----
const state = reactive({ price: 10, qty: 2 })
let total = 0
effect(() => { total = state.price * state.qty })  // tracks price & qty
console.log(total)        // 20
state.price = 20          // triggers effect
console.log(total)        // 40  ✅ automatic
```
**This 25-line core is conceptually what Vue 3 does** (real version adds: effect stack for nesting, cleanup of stale deps, scheduling/batching, ref/computed, deep proxies, collection handlers).

---

## 8. The Reactivity APIs (Internals)

### `reactive(obj)`
Deep reactive **Proxy** of an object. Lazy: nested objects become reactive **when accessed**. Only works on objects/arrays/Maps/Sets — **not primitives**. Destructuring **loses reactivity** (you get the raw value).
```js
const state = reactive({ user: { name: 'A' } })
state.user.name  // accessing user → returns reactive proxy of user
```

### `ref(value)`
A reactive **box** `{ value }` — works for **primitives and objects**. `.value` getter calls `track`, setter calls `trigger`. In templates, refs are **auto-unwrapped** (no `.value`). Objects inside a ref are made reactive via `reactive` internally.
```js
const count = ref(0)
count.value++          // trigger
// internally ≈ class RefImpl { get value(){track(); return _val} set value(v){_val=...; trigger()} }
```

### `reactive` vs `ref`
| | `reactive` | `ref` |
|---|-----------|-------|
| Works on | objects/collections | any (primitive + object) |
| Access | direct `state.x` | `.value` (auto in template) |
| Destructure-safe | ❌ loses reactivity | ✅ ref stays reactive |
| Reassign whole value | ❌ replaces proxy ref | ✅ `ref.value = newObj` |
**Best practice:** Prefer **`ref`** as the default (consistent, destructure-friendly, can reassign); use `reactive` for grouped related state.

### `shallowRef(value)`
Reactive only at `.value` (top level). Mutating nested props does **not** trigger. Use for large/immutable objects you replace wholesale (perf), or non-Vue class instances.
```js
const data = shallowRef({ big: 'object' })
data.value.big = 'x'      // ❌ no trigger
data.value = { big: 'y' } // ✅ triggers
```

### `shallowReactive(obj)`
Only top-level properties reactive; nested objects stay raw. Perf optimization for large structures where deep tracking is wasteful.

### `readonly(obj)`
Returns a deeply read-only proxy; writes warn and are ignored. Use for props you pass down that must not be mutated, or shared config.

### `computed(getter)`
A **lazy, cached** reactive value. It's an effect that:
- Runs the getter, **tracking its deps**.
- Caches the result; returns cache until a dep changes (sets a `dirty` flag).
- Re-evaluates **only on access after a dep changed** (lazy).
- Is itself trackable (other effects depend on it).
```js
const fullName = computed(() => `${first.value} ${last.value}`)
// dep changes → mark dirty → next .value access recomputes → caches
```
Writable computed: `computed({ get, set })`.

### `watch(source, cb)`
Runs a callback when a **specific source** changes; gives **old & new** values; **lazy** (doesn't run on setup unless `immediate: true`).
```js
watch(count, (val, old) => fetchData(val))
watch(() => state.id, cb)            // getter source
watch([a, b], cb)                    // multiple
watch(obj, cb, { deep: true })       // deep watch
```
Options: `immediate`, `deep`, `flush: 'pre'|'post'|'sync'`, `once`.

### `watchEffect(fn)`
Runs **immediately**, auto-tracks any reactive deps read inside, re-runs when any change. No old/new values. Great for side effects with multiple deps.
```js
watchEffect(() => { console.log(count.value, state.name) })  // tracks both
```

### `watch` vs `watchEffect`
| | `watch` | `watchEffect` |
|---|---------|---------------|
| Deps | Explicit source | Auto-collected |
| Runs initially | No (unless immediate) | Yes |
| Old value | ✅ | ❌ |
| Use | React to specific change | Sync side-effects of many deps |

---

## 9. How Vue Knows What Changed / Collects Deps / Triggers
```
RENDER (read):  component render runs as an EFFECT
                → reads state.x → Proxy get → track(state, 'x')
                → effect added to dep set of state.x
UPDATE (write): state.x = newVal → Proxy set → trigger(state, 'x')
                → re-run all effects in dep set → render effect re-runs
                → new VNode tree → diff → patch DOM
SCHEDULING:     triggers are queued + deduped → flushed async in a microtask
                (one update per tick even if you change x 100 times)
```

---

## 10. Best Practices / Mistakes / Performance
**Best practices:** Prefer `ref`; group related state in `reactive`; use `computed` for derived values (cached) instead of methods; `shallowRef`/`shallowReactive`/`markRaw` for large/external objects; clean up watchers.
**Common mistakes:**
- Destructuring `reactive` → loses reactivity (use `toRefs`).
- Reassigning a `reactive` variable expecting reactivity.
- Forgetting `.value` outside templates.
- Deep-watching huge objects (expensive) when a getter source suffices.
- Using a method where a `computed` (cached) belongs.
**Performance:** Computeds cache; shallow APIs skip deep proxies; batching coalesces updates; `markRaw` opts huge/third-party objects out of reactivity.

---

## INTERVIEW QUESTIONS
**🟢:** What is reactivity? · ref vs reactive? · What is computed (lazy+cached)? · watch vs watchEffect?
**🟡:** How does track/trigger work? · Why Proxy over defineProperty? · Why does destructuring reactive break it? · How is computed cached/invalidated?
**🔴:** Build a mini reactivity system. · Explain targetMap/Dep/effect. · How does Vue batch updates (scheduler/microtask)? · How does computed track its own subscribers? · shallowRef internals.
**🧩:** Computed not updating — why (no reactive dep / wrong source). · Watch fires too often — fix (specific source, no deep). · Nested mutation not reactive — shallowRef gotcha. · Reactivity lost after passing prop — toRefs/readonly.

## ⚡ REVISION
- track on read (Proxy get) → trigger on write (Proxy set); deps stored in targetMap (WeakMap→Map→Set).
- Effect = function that subscribes to reads it makes (render fn is one).
- ref = box `.value` (any type, destructure-safe); reactive = deep proxy (objects, loses reactivity on destructure → toRefs).
- computed = lazy + cached; watch = explicit source + old/new; watchEffect = auto-deps + runs immediately.
- Updates are batched async (microtask).

➡️ Next: **Module 3 — Composition API.**
