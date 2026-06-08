# VUE MODULE 6: COMPONENTS

---

## 1. Component Architecture
**Definition:** Components are **self-contained, reusable units** (template + logic + style) that compose into a tree. The app is a tree with one root (`App.vue`).
```
App
├─ Header
├─ Sidebar
│   └─ NavItem (×n)
└─ Content
    ├─ UserCard
    └─ DataTable
        └─ TableRow (×n)
```
**Principles:** single responsibility, props down / events up, presentational vs container split, keep components small & composable.

---

## 2. Parent ↔ Child Communication
```
Parent ──props (data down)──►  Child
Parent ◄──emits (events up)──  Child
Sibling↔Sibling: via shared parent state / Pinia / provide-inject
```
| Direction | Mechanism |
|-----------|-----------|
| Parent → Child | **props** |
| Child → Parent | **emits** (`$emit` / `defineEmits`) |
| Deep ancestor → descendant | **provide / inject** |
| Anywhere ↔ anywhere | **Pinia** store |
| Parent → Child (markup) | **slots** |

---

## 3. Props
**Definition:** Read-only inputs passed from parent to child. **One-way down** (mutating a prop is an anti-pattern).
```vue
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  user:  { type: Object, default: () => ({}) },   // factory for objects/arrays
  status:{ type: String, validator: v => ['on','off'].includes(v) }
})
</script>
```
- TS: `defineProps<{ title: string; count?: number }>()`.
- **Don't mutate props** → use a local `ref(props.x)` copy or `computed`, or emit to ask parent to change.
- Props are **reactive**; destructuring loses reactivity (use `toRefs(props)` or Vue 3.5+ reactive props destructure).

---

## 4. Emits
**Definition:** Child notifies parent of events; parent listens with `@event`.
```vue
<!-- child -->
<script setup>
const emit = defineEmits(['save', 'update:modelValue'])
function onClick() { emit('save', payload) }
</script>
<!-- parent -->
<Child @save="handleSave" />
```
Declaring `emits` documents the API, validates payloads, and stops the event from falling through as a native attribute.

---

## 5. Slots & Scoped Slots (recap)
- **Slots:** parent injects markup into child (`<slot/>`, named `#header`).
- **Scoped slots:** child exposes data to slot content (`<slot :item="x"/>` → `#default="{ item }"`).
- Use for layout components, lists/tables, renderless components. (Details in Module 5.)

---

## 6. Provide / Inject
**Definition:** Dependency injection across the component tree — ancestor `provide`s, any descendant `inject`s — avoiding prop drilling.
```js
// ancestor
provide('theme', readonly(themeRef))
// descendant (any depth)
const theme = inject('theme', 'light')   // 2nd arg = default
```
**Best practice:** provide **readonly** refs; use a Symbol key + a composable wrapper for type safety. Great for theme, i18n, config, plugin APIs.

---

## 7. Dynamic Components
`<component :is="cmp">` swaps components at runtime; wrap with `<KeepAlive>` to preserve state. (Module 5.)

---

## 8. Async Components
**Definition:** Load a component **lazily** (on demand) → smaller initial bundle, faster first load. Vue handles loading/error states + Suspense.
```js
import { defineAsyncComponent } from 'vue'
const Chart = defineAsyncComponent(() => import('./Chart.vue'))
// with states:
const Chart = defineAsyncComponent({
  loader: () => import('./Chart.vue'),
  loadingComponent: Spinner,
  errorComponent: ErrorView,
  delay: 200, timeout: 5000
})
```
**Production use:** route-level + heavy-component code splitting (charts, editors, modals). Pairs with `<Suspense>` for async setup.

---

## 9. Component Rendering Lifecycle (Internals)
```
1. createApp / parent render encounters child VNode
2. Component instance created (props resolved, setup() runs)
3. setup() returns render context; render function compiled/bound
4. RENDER EFFECT created: runs render() → VNode tree (tracks reactive reads)
5. Renderer PATCHES VNodes → real DOM (mount) → onMounted
6. Reactive dep changes → render effect re-queued (scheduler)
7. Re-run render() → new VNode tree → DIFF vs old → patch only changes → onUpdated
8. Component removed → effects stopped, listeners cleaned → onUnmounted
```
Key: each component has **its own render effect**; only components whose reactive deps changed re-render (fine-grained, unlike React re-running whole subtrees).

---

## 10. Best Practices / Mistakes / Performance
**Best practices:** Props down/events up; small focused components; `defineProps`/`defineEmits` with types; readonly provide; async + KeepAlive for heavy/tab UIs.
**Mistakes:** Mutating props; over-using provide/inject (hidden coupling); huge "god" components; missing `:key`; not declaring emits (attribute fallthrough surprises).
**Performance:** Code-split with async components; `v-once`/`v-memo` for static/expensive subtrees; avoid unnecessary deep props; keep reactive scope tight so fewer components re-render.

---

## INTERVIEW QUESTIONS
**🟢:** Props vs emits? · What are slots? · How do siblings communicate? · What is an async component?
**🟡:** Why are props one-way / why not mutate? · provide/inject vs props vs Pinia? · defineProps with TS? · KeepAlive purpose?
**🔴:** Component render lifecycle internally (instance→setup→render effect→patch). · How does each component get its own render effect (fine-grained updates)? · Async component + Suspense flow. · Attribute fallthrough & `inheritAttrs`.
**🧩:** Prop drilling 5 levels deep — refactor (provide/inject or store). · Heavy chart bloats initial bundle — async component + route split. · Child mutates prop, parent breaks — fix. · Tabs lose state on switch — KeepAlive.

## ⚡ REVISION
- Communication: props down, emits up, provide/inject deep, Pinia global, slots for markup.
- Props read-only; don't mutate (copy/computed/emit).
- Async components (`defineAsyncComponent` + `import()`) for code splitting.
- Each component = own render effect → only changed components re-render.

➡️ Next: **Module 7 — Lifecycle.**
