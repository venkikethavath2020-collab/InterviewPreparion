# VUE MODULE 23B: FULL INTERVIEW Q&A BANK
> The enumerated sets your spec asked for. Format per question:
> **Q — Answer · Why interviewer asks · Follow-ups.**
> Drill these out loud. Cross-reference the deep-dive modules for internals.

---

# 🔵 TOP 100 VUE 3 QUESTIONS

### Core / Reactivity (1–25)
1. **What makes Vue 3 different from Vue 2?**
   *A:* Proxy-based reactivity (vs Object.defineProperty), Composition API, fragments/multiple roots, Teleport/Suspense, smaller tree-shakeable core, TypeScript rewrite, faster compiler.
   *Why:* baseline version awareness. *FU:* Which caveats did Proxy fix? Is Vue 2 still supported?

2. **How does Vue 3 reactivity work?**
   *A:* `reactive()` wraps objects in a Proxy; reads call `track()` (record dependency in targetMap), writes call `trigger()` (re-run dependent effects).
   *Why:* the #1 senior topic. *FU:* What's in targetMap? How does an effect subscribe?

3. **ref vs reactive?**
   *A:* `ref` = box with `.value`, works on any type, destructure-safe, reassignable; `reactive` = deep Proxy, objects only, loses reactivity on destructure.
   *Why:* daily API choice. *FU:* Why prefer ref by default? How to destructure reactive safely (toRefs)?

4. **Why does destructuring a reactive object break reactivity?**
   *A:* Destructuring reads the property → returns the raw value, severing the Proxy link. Use `toRefs`.
   *Why:* extremely common bug. *FU:* Does it break for refs too? storeToRefs?

5. **computed vs method vs watch?**
   *A:* computed = cached derived value (recomputes on dep change); method = runs every render; watch = side-effect on specific change.
   *Why:* tests caching understanding. *FU:* When is computed NOT cached? Can computed be async?

6. **How is computed cached/invalidated?**
   *A:* It's a lazy effect with a `dirty` flag; on dep change it marks dirty; recomputes only on next `.value` access; caches result; is itself trackable.
   *Why:* internals depth. *FU:* What if the getter has no reactive deps?

7. **watch vs watchEffect?**
   *A:* watch = explicit source, gives old+new, lazy; watchEffect = auto-tracks deps read inside, runs immediately, no old value.
   *Why:* side-effect API choice. *FU:* flush timing (pre/post/sync)? deep/immediate?

8. **What is `<script setup>`?**
   *A:* Compile-time sugar for Composition API: top-level bindings auto-exposed, less boilerplate, better perf/TS, compiler macros (defineProps/Emits).
   *Why:* modern syntax. *FU:* Difference from setup()? Is there a return?

9. **When does setup() run? Is `this` available?**
   *A:* Before the component instance is created (before beforeCreate); `this` is NOT available.
   *Why:* lifecycle understanding. *FU:* Where do props/emit come from then?

10. **shallowRef / shallowReactive — why?**
    *A:* Reactivity only at the top level (`.value` / top keys); nested mutations don't trigger. Perf for large/immutable/external objects.
    *Why:* perf optimization awareness. *FU:* triggerRef? markRaw?

11. **markRaw — when?**
    *A:* Marks an object to never be made reactive (skipped by Proxy). For large data, class instances, third-party objects (chart/map).
    *Why:* perf/interop. *FU:* vs shallowReactive?

12. **toRef vs toRefs?**
    *A:* toRef = link one property to a ref; toRefs = convert all properties to linked refs (destructure-safe).
    *Why:* prop/store reactivity. *FU:* Use case in composables?

13. **What is a ref unwrapped in templates?**
    *A:* In templates, top-level refs auto-unwrap (no `.value`); in `<script>` you need `.value`.
    *Why:* common confusion. *FU:* Does unwrapping work for nested refs in objects?

14. **Are Vue updates synchronous?**
    *A:* No — they're batched and flushed asynchronously in a microtask; use `nextTick()` to run after DOM update.
    *Why:* render timing. *FU:* Why batch? What does nextTick return?

15. **What is nextTick?**
    *A:* A function returning a Promise that resolves after Vue flushes the DOM update queue.
    *Why:* DOM-after-update access. *FU:* Why needed (async updates)?

16. **customRef use case?**
    *A:* Create a ref with custom track/trigger timing — classic debounced input.
    *Why:* advanced reactivity. *FU:* Implement a debounced ref.

17. **effectScope — what problem?**
    *A:* Groups effects (watchers/computeds) so they can be disposed together (`scope.stop()`) — needed for effects created outside components / in shared composables.
    *Why:* leak prevention. *FU:* Why do composables need it sometimes?

18. **readonly — purpose?**
    *A:* Deep read-only Proxy; writes warn and are ignored. For props passed down / shared config.
    *Why:* immutability. *FU:* shallowReadonly?

19. **How does Vue know which component to re-render?**
    *A:* Each component's render function runs as a reactive effect; only components whose tracked deps changed re-run (fine-grained).
    *Why:* vs React re-render model. *FU:* Why fewer re-renders than React?

20. **Proxy vs Object.defineProperty (Vue 2)?**
    *A:* Proxy intercepts property add/delete, array index/length, Map/Set, and is lazy (proxy on access); defineProperty couldn't detect add/delete or array index and walked recursively upfront.
    *Why:* version internals. *FU:* What was Vue.set for?

21. **What is the targetMap?**
    *A:* `WeakMap<rawObject, Map<key, Dep(Set of effects)>>` — the global dependency graph.
    *Why:* internals. *FU:* Why WeakMap?

22. **triggerRef — when?**
    *A:* Force a shallowRef's effects to re-run after a manual deep mutation that wouldn't trigger on its own.
    *Why:* shallow reactivity control. *FU:* Batching many mutations then one trigger?

23. **Can you use Composition API in Vue 2?**
    *A:* Yes via `@vue/composition-api` plugin (Vue 2.7 has it built-in).
    *Why:* migration awareness. *FU:* Limitations?

24. **What is `defineExpose`?**
    *A:* In `<script setup>`, exposes selected properties/methods to a parent template ref (since setup components are closed by default).
    *Why:* parent-child access. *FU:* Why are setup components closed?

25. **What is the reactivity "effect"?**
    *A:* A wrapper around a function that registers itself as the active effect while running, so reactive reads track it.
    *Why:* core mechanism. *FU:* Effect stack for nested effects?

### Components / Templates (26–50)
26. **Props down, events up — why one-way?**
    *A:* Predictable data flow; mutating a prop breaks the source of truth. Use emit or a local copy/computed.
    *Why:* fundamentals. *FU:* How to two-way bind (v-model)?

27. **How does component v-model work in Vue 3?**
    *A:* `v-model` ⇄ `modelValue` prop + `update:modelValue` event; named `v-model:title` for multiple. Vue 3.4+ has `defineModel()`.
    *Why:* form components. *FU:* Multiple v-models? defineModel?

28. **Slots vs scoped slots?**
    *A:* Slots inject markup parent→child; scoped slots let the child expose data to the slot content (`<slot :item="x"/>` → `#default="{item}"`).
    *Why:* reusable components. *FU:* Renderless component pattern?

29. **provide / inject — when over props?**
    *A:* For deeply nested dependencies (theme, config, i18n) to avoid prop drilling; provide readonly refs.
    *Why:* architecture. *FU:* Reactivity through provide/inject? Symbol keys?

30. **Dynamic components?**
    *A:* `<component :is="...">` renders by name/component; wrap in `<KeepAlive>` to preserve state.
    *Why:* tabs/wizards. *FU:* What does KeepAlive cache?

31. **Async components?**
    *A:* `defineAsyncComponent(() => import('./X.vue'))` for lazy loading + code splitting; supports loading/error components + Suspense.
    *Why:* perf. *FU:* Route-level vs component-level?

32. **v-if vs v-show?**
    *A:* v-if adds/removes from DOM (lazy, higher toggle cost); v-show toggles `display` (always rendered, cheap toggle).
    *Why:* perf choice. *FU:* When each?

33. **Why is :key important in v-for?**
    *A:* Stable identity lets the diff reuse/move nodes correctly; index keys cause state bugs on reorder.
    *Why:* perf + correctness. *FU:* Why is index a bad key?

34. **Can you use v-if and v-for on the same element?**
    *A:* Avoid — in Vue 3 v-if has higher priority (can't access the v-for variable); wrap or filter via computed.
    *Why:* common mistake. *FU:* Fix it?

35. **What is attribute fallthrough?**
    *A:* Non-prop attributes/listeners passed to a component fall through to its root element; control with `inheritAttrs: false` + `$attrs`.
    *Why:* wrapper components. *FU:* Multiple root nodes + $attrs?

36. **Lifecycle hook order parent vs child?**
    *A:* Parent beforeMount → child mounts fully (child mounted) → parent mounted. Children mount before parent's `mounted`.
    *Why:* timing. *FU:* Update/unmount order?

37. **created vs mounted (Composition equivalents)?**
    *A:* created = state ready, no DOM (≈ code in setup); mounted = DOM available (`onMounted`).
    *Why:* where to fetch / access DOM. *FU:* SSR + onMounted?

38. **Where to fetch initial data?**
    *A:* setup()/created (earlier, SSR-friendly) unless you need the DOM → onMounted.
    *Why:* practical. *FU:* Avoiding double-fetch in SSR?

39. **What is Teleport?**
    *A:* Renders child content to a different DOM location (e.g., modal to `<body>`) while keeping it logically in the component.
    *Why:* modals/tooltips. *FU:* Why needed (overflow/z-index)?

40. **What is Suspense?**
    *A:* Built-in for handling async setup/async components with a fallback slot until resolved.
    *Why:* async UX. *FU:* Still experimental?

41. **What is KeepAlive?**
    *A:* Caches inactive component instances (preserves state, avoids re-mount); adds activated/deactivated hooks.
    *Why:* tabs/perf. *FU:* include/exclude/max props?

42. **Custom directives — when?**
    *A:* Low-level DOM access reusable across elements (autofocus, click-outside, permissions); hooks: mounted/updated/etc.
    *Why:* DOM logic reuse. *FU:* directive vs component?

43. **Functional components in Vue 3?**
    *A:* Just plain functions returning VNodes; stateless, no instance. Rare now (SFCs are cheap).
    *Why:* perf nuance. *FU:* When useful?

44. **Recursive components?**
    *A:* A component that renders itself (trees/menus); needs a `name` (or self-reference in SFC).
    *Why:* tree UIs. *FU:* Termination condition?

45. **Scoped CSS — how?**
    *A:* `<style scoped>` adds a unique data-attribute to elements + scopes selectors via attribute; `:deep()` to pierce child.
    *Why:* style isolation. *FU:* :deep / :slotted / :global?

46. **What is a Vue plugin?**
    *A:* An object/function with `install(app, options)` registered via `app.use()` to add global features (components, directives, provide, config).
    *Why:* extensibility. *FU:* Examples (router, pinia)?

47. **v-once / v-memo?**
    *A:* v-once renders a subtree once (never updates); v-memo skips re-render unless deps change (huge lists).
    *Why:* perf. *FU:* Difference?

48. **How do you pass methods/data to a parent?**
    *A:* emit events; or `defineExpose` + template ref for imperative access.
    *Why:* communication. *FU:* Anti-patterns?

49. **Difference between watchEffect flush timings?**
    *A:* `pre` (default, before render), `post` (after DOM update — to read DOM), `sync` (immediate, synchronous).
    *Why:* DOM-dependent watchers. *FU:* When use post?

50. **What is `defineModel` (3.4+)?**
    *A:* Macro that simplifies component v-model — declares a two-way bound ref without manually wiring modelValue + update event.
    *Why:* latest API. *FU:* Modifiers with defineModel?

### Pinia / Router / Tooling (51–75)
51. **Why Pinia over Vuex?** — no mutations, TS-first, flat modular stores, Composition-style, smaller. *FU:* migration?
52. **Option vs setup store?** — options object vs composable function returning state/getters/actions. *FU:* which is more flexible?
53. **storeToRefs — why?** — destructure state+getters reactively (not actions). *FU:* why not plain destructure?
54. **Pinia getters cached?** — yes, like computed. *FU:* parameterized getters?
55. **Pinia actions async?** — yes, hold side-effects. *FU:* error handling?
56. **Store composition?** — call `useOtherStore()` inside a store. *FU:* circular store deps?
57. **Persist Pinia state?** — plugin (pinia-plugin-persistedstate) → localStorage. *FU:* what to persist?
58. **Pinia in SSR?** — fresh instance per request (avoid cross-request leakage). *FU:* hydration?
59. **Vue Router history modes?** — web (clean URLs, needs server fallback) vs hash. *FU:* SSR?
60. **Navigation guards + order?** — beforeEach → beforeEnter → component guards → beforeResolve → afterEach. *FU:* async guards?
61. **Route meta?** — custom data (requiresAuth/roles/title) read in guards. *FU:* RBAC?
62. **Lazy route loading?** — `component: () => import('./V.vue')`. *FU:* chunk grouping?
63. **Why watch route params?** — component is reused on param change (not remounted). *FU:* alternative (key on router-view)?
64. **Nested routes?** — children + nested `<router-view>` for layouts. *FU:* default child?
65. **Programmatic navigation?** — `router.push/replace`. *FU:* push vs replace?
66. **Protecting routes?** — beforeEach + meta.requiresAuth + redirect. *FU:* return URL?
67. **What is Vite?** — fast dev server (native ESM, instant HMR) + Rollup build; Vue's default tooling. *FU:* vs Webpack?
68. **What is Volar?** — VS Code tooling for SFC + TS. *FU:* takeover mode?
69. **defineProps with TypeScript?** — `defineProps<{title: string}>()` (type-based, compile-time). *FU:* defaults with withDefaults?
70. **defineEmits with TS?** — typed emit signatures. *FU:* validate payloads?
71. **What is VueUse?** — large collection of ready composables. *FU:* examples (useEventListener, useLocalStorage)?
72. **Global state without Pinia?** — module-scope ref in a composable (singleton). *FU:* when insufficient?
73. **Pinia $patch / $reset / $subscribe?** — batch update / reset state / listen to mutations. *FU:* $onAction?
74. **How does Pinia get devtools support?** — built-in integration; time-travel, state inspection. *FU:* plugins?
75. **Pinia plugin — write one?** — function `({store}) => {...}` registered via `pinia.use()`. *FU:* persistence example?

### Performance / Rendering / SSR (76–100)
76. **How does Vue's compiler optimize?** — static hoisting, patch flags, block tree, cached handlers. *FU:* what's a patch flag?
77. **What is the block tree?** — compiler collects only dynamic descendants in a flat array so diff skips static structure. *FU:* why faster?
78. **What are patch flags?** — bitflags marking what's dynamic on a VNode (TEXT/CLASS/PROPS) so diff checks only those. *FU:* static hoisting?
79. **How does keyed diff work?** — sync from both ends → key→index map → LIS to minimize moves. *FU:* why keys?
80. **Template → DOM pipeline?** — template → AST → transform (optimize) → render fn → VNode → patch → DOM. *FU:* compile time vs runtime?
81. **What is a VNode?** — JS object describing a node (type/props/children/shapeFlag/patchFlag/el). *FU:* shapeFlag?
82. **Render function / h()?** — programmatic VNodes; templates compile to these. *FU:* when use directly?
83. **JSX in Vue?** — optional via plugin → compiles to h(). *FU:* vs templates (optimizability)?
84. **How to virtualize a huge list?** — vue-virtual-scroller (render only visible) + v-memo + stable keys. *FU:* shallowRef for data?
85. **v-memo use case?** — memoize expensive list subtrees by dependency array. *FU:* with v-for?
86. **CSR vs SSR vs SSG?** — browser vs server-per-request vs build-time HTML. *FU:* when each?
87. **What is hydration?** — client attaches reactivity/listeners to server-rendered HTML. *FU:* mismatch causes?
88. **Hydration mismatch — cause?** — non-deterministic render (Date.now/random/locale) → client ≠ server HTML. *FU:* fix?
89. **What is Nuxt?** — Vue meta-framework: file routing, auto-imports, SSR/SSG, useFetch, Nitro server. *FU:* useFetch vs fetch?
90. **useFetch vs useAsyncData (Nuxt)?** — SSR-aware data fetching that dedupes + transfers server payload to client (no double-fetch). *FU:* useState?
91. **SSR state isolation?** — new app + Pinia per request to avoid cross-user leakage. *FU:* why critical?
92. **How does Vue batch updates?** — scheduler queues + dedupes effects → flushes once per tick (microtask). *FU:* nextTick?
93. **Why fewer re-renders than React?** — fine-grained dependency tracking re-renders only affected components; no manual memo needed. *FU:* React memo equivalent?
94. **Reduce reactivity overhead for large data?** — shallowRef/shallowReactive/markRaw. *FU:* triggerRef?
95. **Tree-shaking in Vue 3?** — modular ESM core; unused APIs dropped. *FU:* import what you use?
96. **What is Vapor Mode?** — compile-away the virtual DOM for direct DOM updates (in progress) → less runtime/memory. *FU:* status?
97. **onRenderTracked / onRenderTriggered?** — debug hooks showing which dep caused a render. *FU:* use in perf debugging?
98. **Code splitting strategy?** — lazy routes + async components + dynamic imports. *FU:* prefetch?
99. **Streaming SSR?** — send HTML progressively for faster TTFB. *FU:* Nuxt support?
100. **How to measure Vue performance?** — Vue DevTools render timings, onRenderTriggered, Lighthouse/Web Vitals. *FU:* what to look for?

---

# 🟣 TOP 50 REACTIVITY QUESTIONS

**Conceptual (1–15):**
1. What is reactivity? — auto-propagation of state changes to dependents.
2. track vs trigger? — record dep on read / re-run effects on write.
3. What is an effect? — function subscribing to its reactive reads (render fn is one).
4. ref vs reactive? — box `.value` (any type) vs deep proxy (objects).
5. Why ref by default? — destructure-safe, reassignable, consistent.
6. computed caching? — lazy + dirty flag.
7. watch vs watchEffect? — explicit+old/new vs auto+immediate.
8. shallowRef vs shallowReactive? — `.value`-only vs top-keys-only reactivity.
9. readonly vs shallowReadonly? — deep vs top-level read-only.
10. markRaw purpose? — opt out of reactivity entirely.
11. toRef vs toRefs? — one vs all linked refs.
12. customRef? — control track/trigger (debounce).
13. triggerRef? — force shallowRef update.
14. effectScope? — group/dispose effects.
15. Is reactivity deep by default? — yes for reactive/ref-of-object (lazy).

**Internals (16–35):**
16. targetMap structure? — WeakMap→Map→Set(effects).
17. Why WeakMap? — GC unreferenced targets (no leak).
18. How does Proxy track? — get trap → track(target, key).
19. How does trigger work? — set trap → re-run effects in dep set.
20. Effect stack / nesting? — supports nested effects (render within render).
21. Cleanup of stale deps? — effects re-collect deps each run; stale ones removed.
22. How does computed track its own subscribers? — it's both an effect (tracks deps) and a trackable dep (others subscribe).
23. Lazy reactivity? — nested objects proxied on access, not upfront.
24. Collection handlers (Map/Set)? — Vue 3 supports reactive Maps/Sets via special handlers.
25. Reflect's role? — performs default op with correct receiver inside traps.
26. Why does reactive lose reactivity on destructure? — read returns raw value.
27. Does ref lose reactivity on destructure? — no, the ref object is passed.
28. Array reactivity in Vue 3? — index/length changes tracked (Proxy).
29. How are template refs reactive? — they're refs assigned after mount.
30. Scheduler / batching? — triggers queued+deduped, flushed in microtask.
31. nextTick mechanism? — resolves after flush queue runs.
32. flush: pre/post/sync? — before render / after DOM / synchronous.
33. Why can computed be "stale"? — getter reads no reactive dep / wrong source.
34. How does watch deep work? — recursively traverses to track nested.
35. Cost of deep watching? — traverses whole structure each change (expensive).

**Practical/scenario (36–50):**
36. Build a mini reactivity system (track/trigger/effect/reactive).
37. Why isn't my computed updating? — no reactive dep / impure getter.
38. Why does my watch fire multiple times? — deep / unstable source identity.
39. Reactivity lost after passing a prop — fix (toRefs/toRef/getter).
40. Nested object change not reactive — shallowRef gotcha → triggerRef.
41. Large array kills perf — shallowRef + markRaw + virtualize.
42. Debounced input with reactivity — customRef.
43. Watcher leaks across composable uses — effectScope.
44. storeToRefs vs toRefs? — same idea; storeToRefs skips actions.
45. Why batch updates? — coalesce many changes into one render.
46. Reactivity across module boundaries (shared composable singleton)?
47. Why markRaw a chart instance? — avoid proxying + breaking the lib.
48. ref of ref? — auto-unwrapped in templates/reactive, manual otherwise.
49. Performance: reactive vs shallowReactive for a 10k-item object?
50. How does Vapor Mode change reactivity? — compiles to direct DOM ops, still tracks deps.

---

# 🟢 TOP 50 COMPOSITION API QUESTIONS

**(1–25)** setup timing/no-this · `<script setup>` benefits/macros · ref vs reactive choice · computed/watch/watchEffect in practice · toRefs for props · composables (useX, return refs, accept refs/getters, cleanup) · lifecycle in setup · defineProps/defineEmits/defineExpose/defineModel · shared state via module scope · provide/inject in setup · `useSlots`/`useAttrs` · async setup + Suspense.
**(26–50)** Composition vs Options trade-offs · why mixins are bad (clashes/implicit) · migrating Options→Composition · TS inference advantages · composable testing (pure vs lifecycle host) · effectScope in composables · singleton vs per-instance composable state · VueUse · feature-folder architecture · composable that reacts to prop changes (getter/ref arg) · memory leaks from missing cleanup · `getCurrentInstance` (and why to avoid) · composable returning reactive vs refs · naming/return conventions · error handling in composables · injecting dependencies into composables · composable vs Pinia store decision · code organization for large setups · reusing watchers safely.

*Each: Answer + Why-asked + Follow-up — see Modules 2, 3, 4, 8, 13 for full content.*

---

# 🟡 TOP 50 PINIA QUESTIONS

**(1–25)** why Pinia / vs Vuex · state/getters/actions · option vs setup store · storeToRefs · getters caching/parameterized · async actions · $patch/$reset/$subscribe/$onAction · store composition · plugins/persistence · SSR isolation · devtools · typing stores · accessing store outside components · resetting on logout · normalized state in stores.
**(26–50)** internals (singleton per id, effectScope, computed getters) · why no mutations · migrating Vuex modules → stores · mapState/mapActions equivalents · hot module replacement · circular store dependencies · subscribing to changes · testing stores (setActivePinia/createTestingPinia) · stubbing actions · initial state in tests · enterprise store architecture (one per domain) · client vs server state (query lib boundary) · persisting selectively · security (don't persist sensitive) · performance of large stores · getters returning functions · using router inside a store (plugin inject) · dynamic stores · store lifecycle/disposal · when NOT to use Pinia (keep local state local).

*See Modules 9 and 14 for full content.*

---

# 🔴 TOP 50 PERFORMANCE QUESTIONS

**(1–25)** stable keys / LIS diff · patch flags / static hoisting / block tree · v-if vs v-show · computed caching · v-memo / v-once / KeepAlive · async/lazy components · code splitting / tree shaking · virtual scrolling · shallowRef/shallowReactive/markRaw · batching/nextTick · reduce re-renders · fine-grained reactivity advantage · template vs render fn vs JSX optimizability · prop stability/identity.
**(26–50)** diagnose unexpected re-render (onRenderTriggered/DevTools) · streaming data perf (shallowRef + throttle) · huge form perf (lazy validate) · SSR/hydration cost + partial hydration · LCP/CLS/INP optimization · CDN/image lazy-load · prefetch on hover · bundle analysis · barrel-file tree-shaking pitfalls · KeepAlive include/exclude/max · debounce/throttle inputs · avoid heavy work in updated · transform/opacity for animation · deferring non-critical components · Web Workers for CPU · memoizing derived data · normalizing list data · stable refs for handlers/objects · Vapor Mode benefits · measuring before optimizing.

*See Modules 11 and 12 for full content.*

---

# 🟠 TOP 50 SCENARIO QUESTIONS (diagnose → root cause → fix)
1. Component re-renders unexpectedly → unstable prop identity / wrong key / broad reactive scope.
2. watch fires multiple times → deep watch / new source identity each render.
3. computed not updating → no reactive dep / impure getter / wrong source.
4. API called multiple times → watcher re-trigger / remount / no dedup → cache+cancel.
5. Pinia state lost on refresh → in-memory; persist plugin / refetch.
6. Memory leak after route change → missing onUnmounted cleanup / effectScope.
7. Reactivity lost after destructuring → toRefs / storeToRefs.
8. List inputs show wrong values after reorder → index key → stable id.
9. Tab/form state lost on switch → KeepAlive.
10. Modal clipped by parent overflow → Teleport.
11. Hydration mismatch warning → non-deterministic render → deterministic/client-only.
12. Prop drilling 5 levels → provide/inject or store.
13. Heavy chart bloats bundle → async component + route split.
14. Slow huge list → virtualize + v-memo + shallowRef.
15. Search spams API → debounce (customRef/VueUse) + cancel.
16. 401 logs user out mid-session → refresh-token interceptor.
17. Child mutates prop, parent breaks → emit / local copy.
18. SSR cross-user data leak → per-request app/store.
19. `window is not defined` in SSR → move to onMounted / client guard.
20. Two-way binding on component not working → modelValue/update wiring.
21. Composable doesn't react to prop changes → accept a ref/getter.
22. Global event bus leak → off listeners / use store.
23. Slow form on every keystroke → lazy/debounced validation.
24. Deep nested reactive mutation not detected → shallowRef + triggerRef.
25. Route param change doesn't refetch → component reused → watch params.
26–50: streaming dashboard jank, KeepAlive activated hook misuse, transition not firing, scoped style not applied (`:deep`), provide value not reactive, injected default missing, async setup error (Suspense), v-for with object losing order, dynamic component state loss, large Pinia store re-render breadth, circular store deps, optimistic UI rollback, infinite watch loop, watchEffect over-triggering, computed with side-effect, props mutation warning, attrs fallthrough surprise, multiple root + $attrs, recursive component infinite loop, slot content not updating, ref null before mount, nextTick needed for DOM read, transition-group key issues, i18n not reactive, theme provide not propagating.

---

# 🟤 TOP 50 DEBUGGING QUESTIONS
1. Why did this re-render? → Vue DevTools "highlight updates" + `onRenderTriggered`.
2. Which dep triggered render? → onRenderTracked/Triggered event info.
3. Why is computed stale? → log getter; verify deps are reactive.
4. Why does watch loop? → check source identity / it mutates its own source.
5. Memory leak detection? → DevTools Memory timeline over navigation; check listeners/timers/watchers.
6. State not reactive in component? → storeToRefs / toRefs.
7. Props not updating child? → mutation / wrong key / identity.
8. Event not firing? → emits declared? listener name? modifier?
9. Slot content missing? → name mismatch / fallback.
10. Route param stale? → component reused → watch params.
11. Hydration warning? → diff server vs client render output.
12. Async race (old data flashes)? → cancel/dedup (AbortController/query lib).
13. Infinite update loop? → state change in updated / computed side-effect.
14. Scoped style not applying to child? → use `:deep()`.
15. Reactivity lost on destructure? → toRefs/storeToRefs.
16. `nextTick` needed? → reading DOM right after a state change.
17. KeepAlive component not refreshing? → use activated hook / key.
18. Provide value not reactive? → provide a ref, not a raw value.
19. Inject undefined? → not provided / wrong key / provided after inject.
20. Transition not animating? → missing key / v-if / CSS class names.
21. v-model on component broken? → modelValue/update:modelValue mismatch.
22. defineExpose needed? → parent ref accessing closed setup component.
23. Template ref null? → accessed before onMounted.
24. Watcher not cleaning up? → use effectScope / onUnmounted / watch stop handle.
25. Pinia action not reflecting? → storeToRefs for reactivity; check mutation.
26–50: SSR window errors, double data fetch, dynamic import chunk errors, circular component imports, attrs not inherited (inheritAttrs), $refs timing, emit payload wrong, deep watch missing changes (shallow), computed dependency on non-reactive, watchEffect tracking too much, prop default factory needed, key collisions in v-for, transition-group reorder glitches, KeepAlive max eviction, Suspense fallback stuck, async component error component, provide/inject across async boundary, reactive Map not updating UI, markRaw accidentally applied, shallowRef nested change ignored, store reset not clearing, router guard infinite redirect, lazy route flash, hydration text mismatch, i18n key reactivity.

---

## How To Use This Bank
- Say the **Answer** in one sentence first, then offer **internals** if asked.
- Anticipate the **Follow-up** (interviewers always go "how does it work internally?" / "predict output" / "how would you debug/optimize at scale?").
- For Reactivity/Composition/Pinia/Performance, be ready to **whiteboard** (mini reactivity, a composable, a store, a diff explanation).

✅ **Full Q&A Bank complete.** (Pairs with Vue-Module-23 core questions.)
