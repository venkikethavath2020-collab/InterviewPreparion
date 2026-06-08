# VUE MODULE 23: VUE INTERVIEW MASTER SECTION
> Format: **Q — concise answer.** Drill these. Cross-reference modules for depth.

---

## PART A — CORE VUE QUESTIONS (1–100)

### Basics & Reactivity (1–30)
1. **What is Vue?** Progressive reactive framework; reactivity + VDOM + compiler.
2. **Vue 2 vs 3 reactivity?** defineProperty vs **Proxy** (detects add/delete/array, lazy).
3. **ref vs reactive?** Box `.value` (any type, destructure-safe) vs deep proxy (objects).
4. **Why does destructuring reactive break?** You get raw values; use `toRefs`.
5. **computed vs method?** Computed cached (recompute on dep change); method runs every render.
6. **watch vs watchEffect?** Explicit source + old/new + lazy vs auto-deps + immediate.
7. **How does reactivity work?** track on read (Proxy get), trigger on write (set), deps in targetMap.
8. **What is an effect?** Function that subscribes to reactive reads (render fn is one).
9. **computed caching mechanism?** Lazy + dirty flag; recomputes on access after dep change.
10. **shallowRef/shallowReactive?** Top-level-only reactivity (perf for large/external).
11. **readonly?** Deep read-only proxy.
12. **toRef vs toRefs?** One prop vs all props → linked refs.
13. **customRef?** Custom track/trigger (debounce).
14. **markRaw?** Opt object out of reactivity.
15. **triggerRef?** Force shallowRef update after deep mutation.
16. **effectScope?** Group + dispose effects together.
17. **Is `.value` needed in templates?** No — auto-unwrapped.
18. **Are updates sync?** No — batched async (microtask). `nextTick` after DOM.
19. **Why ref over reactive default?** Consistent, reassignable, destructure-safe.
20. **Reactivity for Map/Set?** Yes in Vue 3 (collection handlers).
21. **What is nextTick?** Run code after DOM patch.
22. **watch deep/immediate/flush?** Options: deep tracking, run on init, timing pre/post/sync.
23. **Watcher cleanup?** `onCleanup`/return; stops on unmount.
24. **Why is computed not updating?** No reactive dep / wrong source / side-effect inside.
25. **Writable computed?** `computed({ get, set })`.
26. **reactive lost on reassign?** Yes (replaces proxy ref) — use ref for reassignable.
27. **Proxy vs Reflect roles?** Proxy intercepts; Reflect does default op with correct receiver.
28. **targetMap structure?** WeakMap<target, Map<key, Set<effect>>>.
29. **Why WeakMap?** GC unreferenced targets (no leak).
30. **Lazy reactivity meaning?** Nested objects proxied on access, not upfront.

### Components & Templates (31–60)
31. **Props down, events up?** One-way data flow; mutate via emit/computed copy.
32. **Component v-model?** modelValue + update:modelValue; named v-model:x.
33. **Slots vs scoped slots?** Inject markup vs child exposes data to slot.
34. **provide/inject?** DI across tree (avoid prop drilling); provide readonly.
35. **Dynamic components?** `<component :is>`; KeepAlive to preserve state.
36. **Async components?** `defineAsyncComponent(() => import())` for code splitting.
37. **v-if vs v-show?** Add/remove (lazy) vs display toggle (frequent).
38. **Why :key in v-for?** Stable identity → correct reuse + minimal diff moves.
39. **Why is index a bad key?** Breaks on reorder/filter (state attaches wrong).
40. **v-if + v-for same element?** Avoid; v-if higher priority → ambiguous.
41. **Event modifiers?** .prevent/.stop/.self/.once/key modifiers.
42. **v-model modifiers?** .number/.trim/.lazy.
43. **defineProps/defineEmits?** Compile-time macros in `<script setup>`.
44. **Attribute fallthrough?** Non-prop attrs pass to root; control with `inheritAttrs`/`$attrs`.
45. **Functional components?** Stateless render functions (rare in Vue 3).
46. **Teleport?** Render content elsewhere in DOM (modals).
47. **Suspense?** Handle async setup with fallback.
48. **KeepAlive?** Cache inactive component instances.
49. **Recursive components?** Component referencing itself (trees) — needs name.
50. **v-once / v-memo?** Render once / memoize subtree by deps.
51. **Lifecycle order parent/child?** Children mount before parent's mounted.
52. **created vs mounted?** State ready (no DOM) vs DOM ready.
53. **Composition lifecycle hooks?** onMounted etc.; setup replaces created.
54. **Why no DOM in created?** Not mounted yet.
55. **Cleanup hook?** onBeforeUnmount/onUnmounted (avoid leaks).
56. **Multiple root nodes?** Fragments (Vue 3).
57. **Global vs local registration?** app.component vs import in component.
58. **Render function / h()?** Programmatic VNodes.
59. **JSX in Vue?** Optional via plugin → compiles to h().
60. **Scoped CSS?** `<style scoped>` adds data attrs for isolation.

### Composition/Options/Misc (61–100)
61. **Composition vs Options API?** By feature + composables vs by type + mixins.
62. **Why mixins bad?** Name clashes, implicit sources.
63. **setup() timing/this?** Before create; no `this`.
64. **`<script setup>` benefits?** Less boilerplate, auto-expose, better perf/TS.
65. **What is a composable?** `useX()` reusing Composition logic.
66. **Composable vs store?** Logic (per-instance) vs global state (singleton).
67. **Pinia vs Vuex?** No mutations, TS-first, flat modular, smaller.
68. **storeToRefs?** Destructure state/getters reactively.
69. **Pinia getters?** Cached (computed).
70. **Pinia actions async?** Yes; hold side-effects.
71. **Store composition?** useOtherStore() inside.
72. **Persist Pinia?** Plugin (localStorage / persistedstate).
73. **Vue Router history modes?** web (clean, fallback) vs hash.
74. **Navigation guards?** beforeEach/beforeEnter/component guards/afterEach.
75. **Route meta?** Custom data (auth/roles/title).
76. **Lazy routes?** `() => import()`.
77. **Why watch route params?** Component reused on param change.
78. **Nested routes?** children + nested router-view (layouts).
79. **VDOM diff?** Sync ends → key map → LIS → minimal moves.
80. **Patch flags / static hoisting?** Compiler hints to skip static content.
81. **Block tree?** Diff only dynamic descendants.
82. **How Vue batches updates?** Scheduler dedupes → microtask flush.
83. **Performance techniques?** keys, computed, v-memo, lazy, virtualize, shallowRef.
84. **SSR vs CSR vs SSG?** Server/client/build-time HTML.
85. **Hydration?** Attach reactivity to server HTML.
86. **Hydration mismatch?** Client≠server render (non-deterministic).
87. **Nuxt?** Meta-framework: file routing, SSR/SSG, useFetch, Nitro.
88. **XSS in Vue?** v-html with user input → sanitize.
89. **JWT storage?** httpOnly/in-memory; not localStorage for sensitive.
90. **Client-side authz?** UX only; enforce server.
91. **Vitest vs Jest?** Vite-native, faster (Vue 3 default).
92. **Vue Test Utils?** mount + assert; await interactions.
93. **Test composables?** Pure directly; lifecycle via host.
94. **Micro frontends?** Module Federation; share Vue as singleton.
95. **Teleport use case?** Modals/tooltips outside parent overflow.
96. **errorCaptured?** Catch descendant errors.
97. **app.config.errorHandler?** Global error handling.
98. **Directives custom?** `app.directive`/`vMyDir` (mounted/updated hooks).
99. **Plugins?** `app.use()` to install global features.
100. **Vapor mode?** Compile-away VDOM for perf (in progress).

---

## PART B — TOP REACTIVITY QUESTIONS (50)
1–10 ref/reactive/computed/watch internals (track/trigger, targetMap, dirty flag).
11–20 shallow/markRaw/customRef/toRef/toRefs/triggerRef/effectScope behavior.
21–30 Proxy vs defineProperty; lazy reactivity; collection handlers; effect stack/nesting; cleanup of stale deps.
31–40 Build mini reactivity; computed self-tracking; scheduler/batching; nextTick; watch flush timing.
41–50 Pitfalls: destructure loss, reassign, side-effect in computed, deep watch cost, reactivity across modules/MFE.
*(Drill each: state the answer + why + a follow-up. See Module 2 & 8.)*

## PART C — TOP COMPOSITION API QUESTIONS (50)
setup/this/script-setup · ref vs reactive choices · watch vs watchEffect · composables design/cleanup/testing · toRefs for props · shared state via module scope · lifecycle in setup · TS with defineProps/Emits · migration from Options · composable vs store. *(Module 3, 4, 13.)*

## PART D — TOP PINIA QUESTIONS (50)
Why Pinia · option vs setup store · state/getters/actions · storeToRefs · composition · plugins/persistence · internals (effectScope/singleton) · Vuex migration · SSR isolation · enterprise architecture · reset/patch/subscribe · testing stores. *(Module 9, 14.)*

## PART E — TOP PERFORMANCE QUESTIONS (50)
Keys/diff/LIS · patch flags/hoisting/block tree · v-if vs v-show · computed caching · v-memo/v-once/KeepAlive · lazy/async components · code split/tree shake · virtual scroll · shallowRef/markRaw · batching/nextTick · SSR/hydration cost · debounce/throttle · DevTools diagnosing · streaming data. *(Module 11, 12.)*

## PART F — TOP SCENARIO QUESTIONS (50)
- Component re-renders unexpectedly → reactive dep / prop identity / key (Module 24).
- watch fires multiple times → deep watch / multiple sources / object identity.
- computed not updating → no reactive dep / wrong source.
- API called multiple times → no dedup / watcher re-trigger / mount remount.
- Pinia state lost on refresh → no persistence.
- Memory leak → missing cleanup (listeners/watchers/effectScope).
- List inputs show wrong data → index key.
- Reactivity lost → destructured reactive/props (toRefs/storeToRefs).
- Slow huge list → virtualize + v-memo + shallowRef.
- Hydration warning → non-deterministic render.
- Prop drilling → provide/inject or store.
- Tab state lost → KeepAlive.
- 401 logs out mid-session → refresh interceptor.
- Search spams API → debounce + cancel.
- Big bundle → lazy routes/components.
*(Each: diagnose → root cause → fix.)*

## PART G — TOP DEBUGGING QUESTIONS (50)
1. Why re-render? → Vue DevTools, `onRenderTriggered`.
2. Which dep triggered? → `onRenderTracked/Triggered`.
3. Watch loops? → check source identity/deep.
4. Computed stale? → verify reactive deps.
5. Memory leak? → DevTools timeline, check listeners/intervals/watchers cleanup.
6. State not reactive? → destructure/raw value; toRefs.
7. Props not updating? → mutation / wrong key / identity.
8. Event not firing? → emits declared? modifier? listener name.
9. Slot content missing? → name mismatch / fallback.
10. Router param stale? → component reused; watch params.
11. Pinia not reactive in component? → storeToRefs.
12. Hydration mismatch? → diff server/client output.
13. Async race (old data flashes)? → cancel/dedup.
14. Infinite update? → state change in updated/computed.
15. Style not scoped? → deep selector `:deep()`.
16–50: stale closures, KeepAlive activated hooks, transition issues, v-model custom, provide timing, dynamic import errors, SSR `window` undefined, etc. *(Module 24 for the big ones.)*

---

## How To Answer (interviewer expectations)
- **Why asked:** tests depth of reactivity/render model understanding, not memorization.
- **Structure:** definition → internal why → trade-off → example → follow-up readiness.
- **Follow-ups they'll ask:** "How does it work internally?" "What breaks it?" "How would you debug/optimize it at scale?"

➡️ Next: **Module 24 — Real Project Scenarios.**
