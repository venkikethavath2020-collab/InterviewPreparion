# Vue.js Interview Quick Revision - Q&A

## Core Fundamentals

### 1. What is Vue 3?
Vue 3 is a progressive JavaScript framework for building component-based UIs with a reactive data model and optimized rendering.

### 2. Key Vue 2 vs Vue 3 differences?
Vue 3 uses Proxy-based reactivity, Composition API, better TypeScript support, improved performance, and built-ins like Teleport and Suspense.

### 3. What is the Virtual DOM in Vue?
It is a lightweight JS representation of DOM. Vue diffs old/new VNodes and patches only changed parts.

## Composition API

### 4. What is Composition API?
A function-based API to organize logic by feature (`ref`, `reactive`, `computed`, `watch`) instead of Options blocks.

### 5. What is `setup()`?
Entry point of Composition API. Runs once per component instance before mount and has no `this` access.

### 6. `setup()` vs `<script setup>`?
`<script setup>` is compile-time sugar over `setup()`: less boilerplate, cleaner code, better TS inference.

### 7. Why is `this` undefined in `setup()`?
Because Composition API avoids instance-bound logic and uses plain functions with explicit imports.

## Reactivity

### 8. `ref` vs `reactive`?
Use `ref` for primitives and replacement-heavy values; use `reactive` for deep object state.

### 9. Why `.value` is needed with `ref`?
`ref` wraps value in a reactive container; JS access requires `.value` (templates auto-unwrap).

### 10. Why does destructuring `reactive` break reactivity?
Destructuring extracts raw values and disconnects from Proxy tracking. Use `toRefs`/`toRef`.

### 11. What is `nextTick()`?
Waits for Vue’s async DOM update flush, useful before reading updated DOM measurements/focus.

### 12. What are `shallowRef` and `markRaw`?
`shallowRef` tracks only top-level assignment. `markRaw` excludes objects from reactivity (good for heavy 3rd-party instances).

## Computed and Watchers

### 13. `computed` vs `watch`?
`computed` is cached derived state. `watch` is for side effects (API calls, logging, imperative reactions).

### 14. `watch` vs `watchEffect`?
`watch` uses explicit source and is more controlled. `watchEffect` auto-tracks dependencies and runs immediately.

### 15. Why is deep watch expensive?
Vue traverses nested object graph; this increases overhead on large structures.

## Template and Directives

### 16. `v-if` vs `v-show`?
`v-if` mounts/unmounts DOM (better for rare toggles). `v-show` toggles CSS display (better for frequent toggles).

### 17. Why is `key` important in `v-for`?
It gives stable identity for diffing, prevents UI bugs, and improves patch performance.

### 18. How does `v-model` work internally?
It compiles to prop binding + update event. For custom components: `modelValue` + `update:modelValue`.

## Props, Emits, Slots

### 19. Why are props read-only?
To enforce one-way data flow (`parent -> child`) and keep state ownership predictable.

### 20. How should child update parent state?
Emit events (`emit('update:modelValue', value)`) instead of mutating props.

### 21. Props vs emits vs slots?
Props pass data down, emits send actions up, slots customize child UI structure from parent.

### 22. Why object/array prop defaults must be functions?
To avoid shared reference across component instances.

## Lifecycle

### 23. Most important lifecycle order in Vue 3?
`setup -> onBeforeMount -> onMounted -> onBeforeUpdate -> onUpdated -> onBeforeUnmount -> onUnmounted`.

### 24. When is DOM available?
In `onMounted` (not in `setup`/`onBeforeMount`).

### 25. `onActivated` and `onDeactivated` are used when?
With `<KeepAlive>` cached components.

## Router

### 26. Params vs query params?
Params identify resource (`/users/42`), query modifies view state (`/users?page=2`).

### 27. `router.push` vs `router.replace`?
`push` adds history entry; `replace` overwrites current history entry.

### 28. Are route guards a security feature?
No. Guards are UX/navigation control. Backend authorization is the real security boundary.

## Pinia / State Management

### 29. Why Pinia over Vuex (common answer)?
Less boilerplate, better TS support, Composition API alignment, no mutation ceremony.

### 30. When should you avoid global store?
For local, temporary, or component-scoped UI state (forms, toggles, transient filters).

## Performance

### 31. Why Vue 3 is faster than Vue 2?
Proxy-based reactivity + compiler optimizations (static hoisting, patch flags) + efficient scheduler.

### 32. `v-once` vs `v-memo`?
`v-once` renders once forever; `v-memo` skips rerender until listed dependencies change.

### 33. Top Vue performance wins in production?
Route/component lazy loading, computed over methods for derived values, stable list keys, scoped state ownership.

## Built-in Components

### 34. What does `<Teleport>` do?
Renders DOM in another target (e.g., `body`) while preserving component logic/reactivity.

### 35. What does `<Suspense>` do?
Coordinates async dependencies and shows fallback until async setup/components resolve.

### 36. What does `<KeepAlive>` do?
Caches component instances to preserve state across view switches.

## Security

### 37. Why is `v-html` risky?
It bypasses Vue’s HTML escaping and can introduce XSS if content is unsanitized.

### 38. Can frontend env vars be secret?
No. Anything shipped to browser is public. Keep secrets on backend.

### 39. Best token storage answer in interviews?
Prefer backend-managed HttpOnly cookies; discuss XSS/CSRF trade-offs clearly.

## Rapid Senior One-Liners

### 40. Senior summary line for Vue interviews?
Vue 3 scales well when you keep one-way data flow, design clear component/store boundaries, and optimize reactive updates with measured performance patterns.
