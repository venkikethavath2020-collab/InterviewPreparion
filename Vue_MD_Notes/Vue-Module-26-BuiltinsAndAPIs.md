# VUE MODULE 26: BUILT-IN COMPONENTS & APIs (The Missing Pieces)
> Teleport · Suspense · KeepAlive · Transition/TransitionGroup · Custom Directives · Plugins · defineModel · defineExpose · Template Refs · Provide/Inject deep. Full treatment.

---

## 1. `<Teleport>`
**Definition:** Built-in component that renders its slot content to a **different place in the DOM** (specified by `to`), while keeping it logically inside the component (props/state/events stay connected).
**Why it exists:** Modals, tooltips, dropdowns, toasts need to escape a parent's `overflow:hidden`, `z-index` stacking context, or `transform` — but you still want to author them inside the relevant component.
```vue
<template>
  <button @click="open = true">Open</button>
  <Teleport to="body">                  <!-- CSS selector or element -->
    <div v-if="open" class="modal">
      <slot /> <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>
```
- `to` = CSS selector / element. `disabled` prop renders in place (e.g., responsive).
- Multiple teleports to the same target append in order.
- Reactivity/events work normally (it's only a DOM move, not a logical one).

**Internal:** During patch, the renderer mounts the teleported VNodes into the target container instead of the current parent, but keeps the component subtree relationship for updates/unmount.
**Mistakes:** target doesn't exist yet (mount order); forgetting it's still reactive; SSR target rendering.
**Best practices:** teleport modals/overlays to `body`; use `disabled` for conditional teleport; ensure target exists.
**Interview Qs:** What problem does Teleport solve (overflow/z-index)? · Does state/events still work? · `disabled` use? · SSR considerations?

---

## 2. `<Suspense>` (experimental)
**Definition:** Built-in that coordinates **async dependencies** in its subtree — shows a `#fallback` slot until all async setup()/async components resolve, then swaps to `#default`.
**Why it exists:** Declarative loading states for async components / `async setup()` without manual `loading` flags everywhere.
```vue
<Suspense>
  <template #default>
    <AsyncDashboard />            <!-- async component / async setup -->
  </template>
  <template #fallback>
    <Spinner />                   <!-- shown until resolved -->
  </template>
</Suspense>

<!-- async setup that Suspense awaits -->
<script setup>
const data = await fetchData()   // top-level await in setup → component is "async"
</script>
```
- Emits `pending` / `resolve` / `fallback` events; works with `<Transition>` + error boundaries (`onErrorCaptured`).
- **Experimental** — API may change; test before heavy production use.
**Mistakes:** expecting it to catch errors (pair with errorCaptured); nesting confusion; relying on stable API.
**Best practices:** combine with async components + error boundary; keep fallback lightweight.
**Interview Qs:** What does Suspense do? · How does a component become "async" (async setup)? · Error handling? · Still experimental?

---

## 3. `<KeepAlive>`
**Definition:** Wraps dynamic/conditional components to **cache their instances** when inactive (preserving state + avoiding re-mount), instead of destroying them.
**Why it exists:** Tabs, wizards, list↔detail navigation where re-rendering/re-fetching on every switch is wasteful and loses form/scroll state.
```vue
<KeepAlive :include="['TabA','TabB']" :max="10">
  <component :is="currentTab" />
</KeepAlive>
```
- Props: `include` / `exclude` (by component name) / `max` (LRU cache size).
- Adds **`onActivated`** / **`onDeactivated`** lifecycle hooks (instead of mounted/unmounted on switch).
```js
onActivated(() => resumePolling());     // component shown again
onDeactivated(() => pausePolling());    // component hidden (still alive)
```
**Internal:** caches the VNode + component instance keyed by component; on re-activation, re-inserts the cached subtree (no setup re-run).
**Mistakes:** expecting `mounted` to re-run on switch (it's `activated`); unbounded cache (set `max`); components needing fresh state each time (don't KeepAlive them).
**Best practices:** `max` to bound memory; pause/resume side-effects in activated/deactivated; name components for include/exclude.
**Interview Qs:** What does KeepAlive cache? · activated vs mounted? · include/exclude/max? · When NOT to use it?

---

## 4. `<Transition>` & `<TransitionGroup>`
**Definition:** Built-ins that apply **enter/leave animations** to a single element/component (`<Transition>`) or to a list (`<TransitionGroup>`).
**Why it exists:** Declarative CSS/JS animations on insert/remove/reorder without manual class juggling.
```vue
<Transition name="fade">
  <div v-if="show">Hello</div>
</Transition>
<style>
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```
**Transition classes (the lifecycle):**
```
enter: enter-from → enter-active → enter-to
leave: leave-from → leave-active → leave-to
```
- Triggers on `v-if`/`v-show`/dynamic component/route change (one element at a time).
- JS hooks: `@before-enter`, `@enter`, `@after-enter`, `@leave`, etc. (use with libraries like GSAP).
- `mode="out-in"` / `"in-out"` for swapping elements.

**`<TransitionGroup>`** animates **lists** (multiple elements), supports **move transitions** (FLIP) for reordering:
```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
<style>.list-move { transition: transform .3s; }</style>
```
**Internal:** adds/removes transition classes at the right phase; TransitionGroup uses the FLIP technique (records positions, applies transforms) for smooth reordering.
**Mistakes:** missing `:key` in TransitionGroup; animating layout props (use transform); forgetting `*-active` for the transition duration; mode confusion.
**Best practices:** animate `transform`/`opacity` (composite-only, smooth); `mode="out-in"` for swaps; stable keys; respect `prefers-reduced-motion`.
**Interview Qs:** Transition class lifecycle? · Transition vs TransitionGroup? · How does list move animation work (FLIP)? · JS hooks for libraries?

---

## 5. Custom Directives
**Definition:** Reusable **low-level DOM behavior** attached via `v-name`, defined with lifecycle hooks. For logic that's fundamentally about direct DOM access (focus, scroll, intersection, click-outside, permissions).
**Why it exists:** Components encapsulate UI; directives encapsulate **DOM-level reuse** that doesn't warrant a component.
```js
// global
app.directive('focus', {
  mounted(el) { el.focus(); }
})
// local in <script setup>: a const named vXxx is auto-available as v-xxx
const vFocus = { mounted: (el) => el.focus() }
```
```vue
<input v-focus />
<div v-permission="'admin'">...</div>
```
**Hooks (mirror component lifecycle):** `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`. Each receives `(el, binding, vnode, prevVnode)`; `binding` has `value`, `oldValue`, `arg`, `modifiers`.
```js
const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e); };
    document.addEventListener('click', el._handler);
  },
  unmounted(el) { document.removeEventListener('click', el._handler); }  // cleanup!
}
```
**Directive vs Component:** directive = enhance an existing element's DOM behavior (no template/state); component = encapsulated UI + logic + template.
**Mistakes:** not cleaning up listeners in `unmounted` (leaks); putting business logic in directives; overusing where a composable/component fits.
**Best practices:** keep directives DOM-focused; always clean up; name clearly; prefer composables for non-DOM logic.
**Interview Qs:** When use a directive vs component? · Directive hooks + arguments? · Build v-click-outside / v-focus. · How to clean up?

---

## 6. Plugins
**Definition:** Reusable packages that add **app-level functionality** — registered via `app.use(plugin, options)`. A plugin is an object with an `install(app, options)` method (or a function).
**Why it exists:** Distribute global components, directives, provides, config, and behavior (router, Pinia, i18n, UI libraries) cleanly.
```js
// my-plugin.js
export default {
  install(app, options) {
    app.component('MyButton', MyButton);          // global component
    app.directive('focus', focusDirective);       // global directive
    app.provide('config', options);               // app-level inject
    app.config.globalProperties.$translate = (k) => i18n.t(k);  // (use sparingly)
  }
}
// main.js
app.use(myPlugin, { locale: 'en' });
app.use(router).use(pinia);                        // chainable
```
**Internal:** `app.use` calls `install(app, options)` once (deduped by reference) before mounting.
**Real plugins:** Vue Router, Pinia, vue-i18n, Vuetify/PrimeVue, vue-query.
**Mistakes:** overusing `globalProperties` (hidden deps, hard to test/tree-shake) — prefer provide/inject or composables; registering plugins after mount.
**Best practices:** provide a composable interface (`useX`) over globalProperties; accept options; register before mount; idempotent install.
**Interview Qs:** What is a Vue plugin / how to write one? · app.use vs app.component? · provide in a plugin? · globalProperties downsides?

---

## 7. `defineModel` (Vue 3.4+)
**Definition:** A compiler macro that simplifies **component v-model** — declares a two-way-bound ref without manually wiring `modelValue` prop + `update:modelValue` emit.
**Why it exists:** Removes v-model boilerplate in `<script setup>`.
```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()              // ref bound to parent's v-model
const title = defineModel('title')       // named v-model:title
const [count, mods] = defineModel('count', { default: 0 })  // with modifiers
</script>
<template>
  <input v-model="model" />              <!-- mutating model updates parent -->
</template>

<!-- Parent -->
<Child v-model="text" v-model:title="t" />
```
**Before defineModel (still valid):**
```js
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
// <input :value="modelValue" @input="emit('update:modelValue', $event.target.value)">
```
**Mistakes:** using on Vue < 3.4; expecting it without `<script setup>`; modifier handling confusion.
**Interview Qs:** How does component v-model work under the hood (modelValue/update)? · What does defineModel simplify? · Multiple/named v-models? · Modifiers?

---

## 8. `defineExpose`
**Definition:** In `<script setup>`, components are **closed by default** (parent template refs can't access internals). `defineExpose({...})` selectively exposes properties/methods to a parent `ref`.
**Why it exists:** Controlled imperative access (e.g., parent calls `child.validate()` or `child.focus()`).
```vue
<!-- Child -->
<script setup>
const reset = () => {}
const validate = () => true
defineExpose({ reset, validate })       // only these are accessible
</script>
<!-- Parent -->
<Child ref="childRef" />
<script setup>
const childRef = ref(null)
onMounted(() => childRef.value.validate())
</script>
```
**Best practice:** prefer props/emits; use expose only for genuine imperative needs (forms, media players). **Interview Qs:** Why are setup components closed? · How to expose methods? · When over emits?

---

## 9. Template Refs
**Definition:** Direct references to DOM elements or child component instances via `ref` attribute.
```vue
<script setup>
const inputEl = ref(null)
onMounted(() => inputEl.value.focus())   // available only AFTER mount
</script>
<template><input ref="inputEl" /></template>
```
- `ref` on an element → the DOM node; on a component → its instance (only exposed members in `<script setup>`).
- **`null` before mount** → access in `onMounted`/after `nextTick`.
- **Function refs:** `:ref="(el) => {}"` for dynamic collection.
- In `v-for`, ref collects an array (3.5+) or use function refs.
**Mistakes:** accessing before mount (null); expecting full child internals (closed → defineExpose).
**Interview Qs:** When is a template ref available? · Element vs component ref? · Refs in v-for?

---

## 10. Provide / Inject (Deep)
**Definition:** Dependency injection across the component tree — an ancestor `provide`s a value; any descendant `inject`s it (no prop drilling).
```js
// ancestor
import { provide, readonly, ref } from 'vue'
const theme = ref('dark')
provide('theme', readonly(theme))            // provide READONLY ref → reactive + safe
provide(themeKey, { theme, toggle })         // Symbol key + composable wrapper

// descendant (any depth)
const theme = inject('theme', 'light')        // 2nd arg = default
const theme2 = inject('theme', () => compute(), true)  // factory default
```
**Reactivity:** provide a **ref/reactive** (not a raw primitive) to keep injections reactive. Provide `readonly` so descendants can't mutate the source (mutations go through provided methods).
**Type-safe pattern:**
```ts
const themeKey = Symbol() as InjectionKey<Theme>
provide(themeKey, theme); const t = inject(themeKey)   // typed, no string collisions
```
**App-level provide:** `app.provide('config', cfg)` (available everywhere; great for plugins).
**Mistakes:** providing raw primitives (not reactive); descendants mutating provided state directly; string-key collisions (use Symbols); injecting without a default → undefined.
**Best practices:** readonly refs + provided mutators; Symbol keys + composable wrapper (`useTheme()`); defaults for optional injects.
**Interview Qs:** provide/inject vs props vs Pinia? · How to keep it reactive? · Symbol keys why? · App-level provide?

---

## ⚡ REVISION
- **Teleport** → render content elsewhere in DOM (modals/overlays), state/events intact.
- **Suspense** (experimental) → fallback until async setup/components resolve.
- **KeepAlive** → cache inactive components (state preserved); activated/deactivated hooks; include/exclude/max.
- **Transition** (single) / **TransitionGroup** (lists, FLIP move) → enter/leave/move animations via classes; animate transform/opacity.
- **Custom directives** → DOM-level reuse (v-focus, v-click-outside); lifecycle hooks + cleanup in unmounted.
- **Plugins** → `install(app, options)` + `app.use()`; add components/directives/provides; prefer composables over globalProperties.
- **defineModel** (3.4+) → simplifies component v-model (was modelValue + update:modelValue).
- **defineExpose** → open a closed setup component to parent refs.
- **Template refs** → DOM/instance access, null before mount (use onMounted).
- **provide/inject** → DI across tree; provide readonly reactive refs + Symbol keys; defaults.

✅ **Built-ins & APIs module complete.** This closes the gaps in the Vue track.
