# VUE MODULE 21: VUE DESIGN PATTERNS

---

## 1. Container / Presentational (Smart / Dumb)
**Definition:** Split components into **Container** (logic, data, state) and **Presentational** (props in, events out, pure UI).
```
Container (UserListContainer)        Presentational (UserList)
- fetches data (composable/store)    - receives users via props
- handles events                     - emits 'select'
- passes props down                  - no data fetching, pure render
```
**Why:** reusable/dumb UI, testable (presentational = pure), clear separation.
```vue
<!-- Container -->
<script setup>
const { users, loading } = useUsers()
</script>
<template><UserList :users="users" :loading="loading" @select="open" /></template>
```
**Note:** With composables, the boundary blurs — logic lives in composables, so many components are "smart" cheaply. Still useful for shared presentational components / design systems.

---

## 2. Composables (Logic Reuse) — the dominant Vue pattern
Already covered (Module 13). The idiomatic replacement for mixins/HOCs. Encapsulate stateful logic in `useX()`.
```js
const { data, error, loading } = useFetch(url)
```

---

## 3. Factory Pattern
**Definition:** A function that creates configured objects/components/composables.
```js
// store factory for reusable CRUD stores
function createCrudStore(name, api) {
  return defineStore(name, () => {
    const items = ref([])
    const fetchAll = async () => (items.value = await api.list())
    const create = async (b) => items.value.push(await api.create(b))
    return { items, fetchAll, create }
  })
}
export const useUsers = createCrudStore('users', userApi)
export const useOrders = createCrudStore('orders', orderApi)
```
**Use:** DRY stores/services, configurable composables, dynamic component creation.

---

## 4. Observer Pattern
**Definition:** Subjects notify subscribers on change. Vue's **reactivity IS the observer pattern** (effects observe reactive deps). Also a manual **event bus** (mitt) for decoupled cross-component events (use sparingly).
```js
import mitt from 'mitt'
export const bus = mitt()
bus.on('user:updated', handler)   // observer
bus.emit('user:updated', payload)
```
**Best practice:** prefer props/emits/store over global buses; buses cause hidden coupling.

---

## 5. Dependency Injection
**Definition:** `provide/inject` is Vue's built-in DI — supply dependencies (services, config, theme) to descendants without prop drilling.
```js
// provide a service (testable, swappable)
provide(ApiKey, apiService)
// inject
const api = inject(ApiKey)
```
**Use:** plugin APIs, theming, i18n, injecting services for testability. Use **Symbol keys** + composable wrappers for type safety.

---

## 6. Other Useful Patterns
- **Renderless components / scoped slots:** logic component exposes data, parent owns markup (headless UI). VueUse-style.
- **Higher-Order Component (rare in Vue):** wrap a component to add behavior — composables usually preferred.
- **Strategy:** map of interchangeable functions (e.g., per-type formatters/validators).
- **Adapter:** wrap a 3rd-party lib behind a composable interface.
- **Singleton:** module-scope state in a composable / Pinia store.
- **State machine:** XState for complex flows (wizards, async states).

---

## 7. Enterprise Examples
- **Design system:** presentational components + scoped slots + provide/inject theme.
- **CRUD-heavy admin:** store/service factories (DRY).
- **Feature modules:** composables (logic) + Pinia slice (state) + container components.
- **Cross-cutting:** DI for api/logger/config; renderless components for tables/forms.

---

## INTERVIEW QUESTIONS
**🟢:** Container vs presentational? · What's Vue's main reuse pattern (composables)? · What is provide/inject (DI)?
**🟡:** Why composables over mixins/HOCs? · When use a factory? · Event bus pros/cons? · Renderless components?
**🔴:** How is reactivity the observer pattern? · DI with Symbols + type safety. · Store/service factory design. · When a state machine over refs.
**🧩:** Repeated CRUD store code — factory. · Prop drilling theme 6 levels — provide/inject. · Need flexible table where parent controls row markup — scoped slots/renderless. · Decouple two distant components — store vs bus trade-off.

## ⚡ REVISION
- Composables = primary logic-reuse pattern (replaces mixins/HOCs).
- Container/presentational for UI separation; factories for DRY stores/services.
- provide/inject = DI (Symbols + readonly); reactivity = observer pattern.
- Renderless/scoped slots = headless flexibility; avoid global event buses.

➡️ Next: **Module 22 — Large-Scale Architecture.**
