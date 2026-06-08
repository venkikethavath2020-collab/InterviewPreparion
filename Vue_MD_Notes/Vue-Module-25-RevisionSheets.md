# VUE MODULE 25: VUE REVISION SHEET

---

# 🗓️ 1-DAY REVISION NOTES

### Core
- Vue = progressive reactive framework: **reactivity (Proxy) + VDOM + compiler**.
- Vue 3 over 2: Proxy (detects add/delete/array, lazy), Composition API, fragments, Teleport/Suspense, TS-first.
- Pipeline: Template → AST → render fn → VNode → diff/patch → DOM.

### Reactivity
- **track** on read (Proxy get), **trigger** on write (set); deps in `targetMap` (WeakMap→Map→Set).
- **ref** = box `.value` (any type, destructure-safe); **reactive** = deep proxy (loses reactivity on destructure → `toRefs`).
- **computed** = lazy + cached (dirty flag); **watch** = explicit source + old/new (lazy); **watchEffect** = auto-deps + immediate.
- shallowRef/shallowReactive (top-level), markRaw (opt out), customRef (debounce), triggerRef (force), effectScope (dispose group).
- Updates **batched async** (microtask); `nextTick` after DOM.

### Components
- props down / emits up; provide/inject (deep DI, readonly); slots (markup) / scoped slots (child→parent data).
- Component v-model = modelValue + update:modelValue.
- Dynamic `<component :is>` + KeepAlive; async components for code split.
- Children mount **before** parent's `mounted`; setup replaces created (no `this`); clean up in onUnmounted.

### Templates
- v-if (add/remove, lazy) vs v-show (display, frequent); stable unique `:key` (not index).
- Compiler: static hoisting + patch flags + block tree → fast diff.

### Composition vs Options
- Options = by type + mixins; Composition = by feature + composables + TS. Migrate incrementally.

### Pinia
- state + getters(cached) + actions(async), no mutations, flat modular; `storeToRefs` to destructure; stores compose; persist via plugin.

### Router
- URL→component; web vs hash history; dynamic `:param` (component reused → watch params); nested routes; lazy `() => import()`; guards (beforeEach auth, meta roles).

### Performance
- Fine-grained reactivity + compiler + batching; keys → minimal diff (LIS); computed/v-memo/v-once/KeepAlive; lazy/code-split; virtualize huge lists; shallowRef/markRaw for big/external.

### Rendering
- VNode (type/props/children/shapeFlag/patchFlag/el); diff: sync ends → key map → LIS; block tree diffs only dynamic; render effect ties reactivity→patch.

### SSR/Nuxt
- CSR/SSR/SSG/ISR; hydration attaches reactivity to server HTML (mismatch = non-deterministic render); Nuxt = file routing + useFetch + Nitro; per-request app/store isolation.

### Security
- {{ }} auto-escapes; v-html = XSS → sanitize; JWT in httpOnly/in-memory; client authz = UX only (enforce server); CSP + runtime-only build.

### Testing
- Vitest + Vue Test Utils; mount/shallowMount; await interactions; mock API at boundary (MSW); test behavior not internals.

---

# ⏳ 3-HOUR REVISION

1. **Reactivity:** Proxy track/trigger → targetMap; ref(.value) vs reactive(deep); computed(cached) vs watch vs watchEffect.
2. **Why Vue 3:** Proxy fixes Vue 2 caveats + lazy; Composition API + TS.
3. **Composition API:** setup (no this), `<script setup>`, composables (useX, return refs, cleanup).
4. **Components:** props/emits/slots/provide-inject; v-model(modelValue); async + KeepAlive; lifecycle order (children first).
5. **Templates:** directives; v-if vs v-show; keys (LIS diff); scoped slots.
6. **Pinia:** state/getters/actions, storeToRefs, compose, persist.
7. **Router:** history modes, dynamic/nested, lazy, guards + meta.
8. **Performance:** keys, computed, v-memo, lazy, virtualize, shallowRef/markRaw, batching.
9. **Rendering:** template→AST→render→VNode→patch; block tree + patch flags.
10. **SSR/Nuxt:** CSR/SSR/SSG, hydration, useFetch, per-request isolation.
11. **Security:** v-html XSS, JWT storage, server authz, CSP.
12. **Testing:** Vitest + VTU; composables/stores; await + MSW.
13. **Debug scenarios:** re-render, watch ×N, computed stale, API ×N, state lost, leaks.

---

# ⚡ 30-MINUTE REVISION (last-minute)

- **Vue** = reactivity(Proxy) + VDOM + compiler; progressive.
- **ref** (.value, any, destructure-safe) vs **reactive** (deep, destructure→toRefs).
- **track** on read / **trigger** on write; deps in targetMap.
- **computed** cached+lazy; **watch** source+old/new; **watchEffect** auto+immediate.
- shallowRef/markRaw/customRef/effectScope for advanced reactivity.
- **props down, emits up**; provide/inject deep; slots vs scoped slots.
- **v-if** (add/remove) vs **v-show** (display); **stable keys** (not index).
- Children mount before parent; setup = no this; clean up onUnmounted.
- **Pinia**: state/getters(cached)/actions(async), no mutations, storeToRefs.
- **Router**: dynamic params (component reused→watch), lazy import, guards+meta.
- **Perf**: keys+LIS diff, computed, v-memo/v-once, lazy, virtualize, shallowRef.
- **Compiler**: static hoist + patch flags + block tree → fast diff.
- **SSR**: hydration (mismatch=non-deterministic); Nuxt useFetch; per-request store.
- **Security**: v-html=XSS (sanitize); JWT httpOnly/in-memory; authz on server.
- **Updates batched async** → nextTick after DOM.

---

# 🔄 REACTIVITY CHEAT SHEET
```
ref(v)            box {.value}; any type; auto-unwrap in template; destructure-safe
reactive(obj)     deep Proxy; objects only; destructure LOSES reactivity → toRefs
computed(fn)      lazy + CACHED; recompute on dep change; pure/sync only
computed({g,s})   writable computed
watch(src, cb)    explicit source; old+new; lazy (immediate/deep/flush/once)
watchEffect(fn)   auto-track deps; runs immediately; no old value
shallowRef(v)     reactive only on .value reassign
shallowReactive   only top-level keys reactive
readonly(o)       deep read-only
toRef(o,'k')      linked ref to one prop
toRefs(o)         all props → linked refs (destructure reactive/store)
customRef         control track()/trigger() (debounce)
markRaw(o)        never reactive
triggerRef(r)     force shallowRef update
effectScope()     group + scope.stop() to dispose effects
storeToRefs(s)    Pinia state+getters → refs (destructure-safe)
nextTick()        after DOM patch
INTERNALS: track on Proxy GET, trigger on Proxy SET; targetMap = WeakMap<obj,Map<key,Set<effect>>>
```

---

# 🧩 COMPOSITION API CHEAT SHEET
```
<script setup>            recommended; top-level bindings auto-exposed; no this
setup(props, ctx)         ctx = {emit, slots, attrs, expose}; runs before create
defineProps / defineEmits compile macros; defineProps<{x:T}>()
defineExpose              expose to template ref
Lifecycle: onMounted onUpdated onUnmounted onBeforeMount/Update/Unmount
           onActivated onDeactivated onErrorCaptured onRenderTracked/Triggered
Composable: useX() → return refs; accept refs/getters; clean up (onUnmounted/effectScope)
Props reactivity: toRefs(props) / props via getter; don't destructure raw
```

---

# 🏪 PINIA CHEAT SHEET
```
defineStore('id', { state:()=>({}), getters:{}, actions:{} })   // option
defineStore('id', () => { const x=ref(); ...; return {x} })     // setup (flexible)
const s = useStore()
const { a, b } = storeToRefs(s)   // state+getters reactive
const { act } = s                 // actions direct
s.$patch({...}) / s.$patch(fn)    // batched
s.$reset()  s.$subscribe()  s.$onAction()
Compose: const auth = useAuth() inside another store
Persist: pinia.use(persistedstate) / persist:true
Internals: singleton per id, effectScope, getters=computed; per-request in SSR
Vuex→Pinia: drop mutations (mutate in actions), modules→stores, mapX→storeToRefs
```

---

# 🧭 ROUTER CHEAT SHEET
```
createRouter({ history: createWebHistory(), routes })
routes: { path:'/u/:id', component, children:[...], meta:{requiresAuth, roles}, beforeEnter }
Lazy: component: () => import('./V.vue')
<router-link to>  <router-view/>
useRoute() params/query/hash (reactive)   useRouter() push/replace/back
Guards: router.beforeEach((to,from)=> false|route|void)  // auth
        beforeResolve, afterEach (analytics), onBeforeRouteUpdate/Leave
Param change reuses component → watch(()=>route.params.id, fn)
History fallback (web mode) → server rewrites to index.html
```

---

# 🚀 PERFORMANCE CHEAT SHEET
```
KEYS        stable unique :key → minimal diff (LIS); never index for dynamic lists
v-if/v-show add-remove (rare toggle) vs display (frequent)
computed    cache derived (not methods/inline)
v-once      render once; v-memo="[deps]" memoize subtree (huge lists)
KeepAlive   cache component instances (tabs/wizards)
async/lazy  defineAsyncComponent / route () => import()  (code split)
virtualize  vue-virtual-scroller for 1000s of rows
shallowRef  large/immutable/streaming data; markRaw external/class instances
debounce    customRef / VueUse for inputs
batching    updates coalesced async → nextTick
compiler    static hoist + patch flags + block tree (auto)
diagnose    DevTools render timings, onRenderTriggered, Lighthouse/Web Vitals
```

---

# 🎯 FINAL ONE-LINERS
- "Reactivity = track on read, trigger on write, via Proxy."
- "ref for everything by default; toRefs when you destructure reactive/store."
- "computed caches; watch reacts; watchEffect auto-tracks."
- "Stable keys = correct + minimal DOM diff (LIS)."
- "Children mount before parent; always clean up in onUnmounted."
- "Pinia: no mutations, storeToRefs to destructure, compose stores."
- "Client-side authz is UX; the server enforces."
- "v-html is the XSS hole — sanitize."
- "Updates are async — use nextTick after DOM changes."

---

✅ **ALL 25 VUE MODULES COMPLETE.**
