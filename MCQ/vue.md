# Vue.js Interview Questions & Answers

---

# Difference Between Vue 2 and Vue 3

Vue 3 introduced major improvements in **performance, architecture, and developer experience** compared to Vue 2.

---

# 1. Reactivity System

| Vue 2                                           | Vue 3                       |
| ----------------------------------------------- | --------------------------- |
| Uses `Object.defineProperty()`                  | Uses `Proxy`                |
| Cannot detect property addition/deletion easily | Fully reactive for objects  |
| Needs `Vue.set()`                               | No need for special methods |

**Example**

Vue 2

```javascript
Vue.set(obj, 'name', 'Venki')
```

Vue 3

```javascript
obj.name = 'Venki'
```

Vue 3 tracks changes automatically using **Proxy**.

---

# 2. API Style

| Vue 2                       | Vue 3                         |
| --------------------------- | ----------------------------- |
| Options API                 | Options API + Composition API |
| Logic spread across options | Logic grouped by feature      |

Vue 2 example:

```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

Vue 3 Composition API:

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    const increment = () => {
      count.value++
    }

    return { count, increment }
  }
}
```

---

# 3. Performance

| Vue 2                      | Vue 3               |
| -------------------------- | ------------------- |
| Slower virtual DOM diffing | Faster rendering    |
| Larger bundle size         | Smaller bundle size |
| Less optimized updates     | Optimized rendering |

Vue 3 is **around 2x faster** due to improved rendering engine.

---

# 4. Fragment Support

Vue 2 requires a **single root element**.

Vue 2

```html
<div>
  <h1>Hello</h1>
  <p>World</p>
</div>
```

Vue 3 allows **multiple root elements**.

Vue 3

```html
<h1>Hello</h1>
<p>World</p>
```

This is called **Fragments**.

---

# 5. Teleport Feature

Vue 2: Not available.

Vue 3 introduces **Teleport** to render components outside the DOM hierarchy.

Example:

```html
<teleport to="#modal">
  <div>Modal Content</div>
</teleport>
```

Used for **modals, tooltips, overlays**.

---

# 6. Suspense

Vue 2: Not supported.

Vue 3 supports **Suspense** for async components.

Example:

```html
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>

  <template #fallback>
    Loading...
  </template>
</Suspense>
```

---

# 7. TypeScript Support

| Vue 2                      | Vue 3                 |
| -------------------------- | --------------------- |
| Limited TypeScript support | Built with TypeScript |
| Hard to type components    | Better type inference |

Vue 3 was rewritten in **TypeScript**.

---

# 8. Global API Changes

Vue 2

```javascript
Vue.component()
Vue.directive()
Vue.mixin()
```

Vue 3

```javascript
app.component()
app.directive()
app.mixin()
```

Vue 3 uses **app instance instead of global Vue object**.

---

# 9. Lifecycle Hooks

Vue 3 renamed some lifecycle hooks.

| Vue 2         | Vue 3         |
| ------------- | ------------- |
| beforeDestroy | beforeUnmount |
| destroyed     | unmounted     |

Example:

Vue 2

```javascript
beforeDestroy() {}
```

Vue 3

```javascript
beforeUnmount() {}
```

---

# 10. State Management

| Vue 2              | Vue 3               |
| ------------------ | ------------------- |
| Vuex               | Pinia (recommended) |
| Mutations required | No mutations        |

Pinia is simpler and fully compatible with Vue 3.

---

# 11. Multiple v-model

Vue 2 supports **only one v-model**.

Vue 3 supports **multiple v-model bindings**.

Example:

```html
<MyComponent
  v-model:title="title"
  v-model:content="content"
/>
```

---

# 12. Emits Option

Vue 3 introduces `emits` option.

```javascript
export default {
  emits: ['submit']
}
```

This improves **event validation and readability**.

---

# Quick Summary

| Feature          | Vue 2                 | Vue 3                 |
| ---------------- | --------------------- | --------------------- |
| Reactivity       | Object.defineProperty | Proxy                 |
| API              | Options API           | Options + Composition |
| Performance      | Moderate              | Faster                |
| TypeScript       | Limited               | Native support        |
| Fragments        | No                    | Yes                   |
| Teleport         | No                    | Yes                   |
| Suspense         | No                    | Yes                   |
| State Management | Vuex                  | Pinia                 |

---

If you want, I can also show you the **10 hardest Vue interview questions asked for senior developers (5+ years experience)** including:

* Vue reactivity internals
* Virtual DOM patching
* Watch vs WatchEffect
* Composition API design patterns
* Vue rendering optimization
* Dependency tracking algorithm

These are **very commonly asked in senior frontend interviews.**


## 1. What is Vue.js?

**Answer:** Progressive JavaScript framework
**Explanation:** Vue is designed to be incrementally adoptable and is widely used for building Single Page Applications (SPAs).

---

## 2. Vue follows which architecture?

**Answer:** MVVM
**Explanation:** Model–View–ViewModel separates application logic from the UI for better maintainability.

---

## 3. Which directive is used for conditional rendering?

**Answer:** `v-if`
**Explanation:** `v-if` renders the element only when the condition evaluates to true.

---

## 4. Difference between `v-if` and `v-show`?

**Answer:** `v-if` removes DOM, `v-show` hides via CSS
**Explanation:** `v-if` creates/destroys elements, while `v-show` toggles `display: none`.

---

## 5. Which directive is used for looping?

**Answer:** `v-for`
**Explanation:** `v-for` iterates through arrays or objects.

---

## 6. Why is `key` required in `v-for`?

**Answer:** For efficient DOM updates
**Explanation:** `key` uniquely identifies elements so Vue can track changes efficiently.

---

## 7. Which directive binds input value?

**Answer:** `v-model`
**Explanation:** Enables two-way data binding between input and state.

---

## 8. What are computed properties?

**Answer:** Cached derived state
**Explanation:** Computed properties recalculate only when their dependencies change.

---

## 9. Difference between computed and methods?

**Answer:** Computed is cached, methods are not
**Explanation:** Methods execute every render, computed properties are cached.

---

## 10. What are watchers used for?

**Answer:** Reacting to data changes
**Explanation:** Watchers are useful for side effects like API calls or async operations.

---

## 11. Lifecycle hook called after component mount?

**Answer:** `mounted`
**Explanation:** The DOM is fully available in this hook.

---

## 12. Which hook is used before component destruction?

**Answer:** `beforeUnmount` (Vue 3)
**Explanation:** Used for cleanup tasks like removing listeners.

---

## 13. What is props used for?

**Answer:** Passing data from parent to child
**Explanation:** Props allow parent components to send data down the component tree.

---

## 14. Can a child modify props directly?

**Answer:** No
**Explanation:** Props are read-only to maintain one-way data flow.

---

## 15. How to emit event from child to parent?

**Answer:** `$emit()`
**Explanation:** Sends custom events from child components to parents.

---

## 16. What is Composition API?

**Answer:** Function-based API for logic reuse
**Explanation:** Introduced in Vue 3 to improve scalability and code organization.

---

## 17. What does `ref()` return?

**Answer:** Reactive reference object
**Explanation:** The value is accessed using `.value`.

---

## 18. What does `reactive()` do?

**Answer:** Makes object reactive
**Explanation:** Works only with objects and tracks changes automatically.

---

## 19. What is `<slot>` used for?

**Answer:** Content projection
**Explanation:** Allows passing content into a component.

---

## 20. Difference between scoped and global CSS?

**Answer:** Scoped applies only to component
**Explanation:** Scoped styles prevent CSS from leaking into other components.

---

## 21. What is Vue Router used for?

**Answer:** Navigation between views
**Explanation:** Enables client-side routing for SPAs.

---

## 22. What is lazy loading in Vue?

**Answer:** Load components on demand
**Explanation:** Improves application performance by splitting code.

---

## 23. What is `defineComponent()`?

**Answer:** Helper for TypeScript support
**Explanation:** Provides better type inference in Vue components.

---

## 24. What is Teleport?

**Answer:** Renders component outside DOM hierarchy
**Explanation:** Often used for modals, tooltips, and overlays.

---

## 25. What is Vue reactivity system based on?

**Answer:** Proxies (Vue 3)
**Explanation:** JavaScript Proxies track dependencies automatically.

---

# Pinia Interview Questions & Answers

---

## 1. What is Pinia?

**Answer:** State management library for Vue
**Explanation:** Pinia is the official replacement for Vuex.

---

## 2. Pinia is based on which API?

**Answer:** Composition API
**Explanation:** Uses Vue's reactive primitives.

---

## 3. How to define a store?

**Answer:** `defineStore()`
**Explanation:** Used to create a Pinia store.

---

## 4. Pinia stores are?

**Answer:** Singleton
**Explanation:** A single instance is shared across the application.

---

## 5. Main parts of a Pinia store?

**Answer:** `state`, `getters`, `actions`
**Explanation:** Similar to Vuex but simpler.

---

## 6. State in Pinia should be?

**Answer:** A function returning an object
**Explanation:** Ensures each store instance has a fresh state.

---

## 7. Are mutations required in Pinia?

**Answer:** No
**Explanation:** State can be modified directly in actions.

---

## 8. How to access store in component?

**Answer:** Call the store function
**Explanation:**

```javascript
const store = useStore()
```

---

## 9. Getters in Pinia are similar to?

**Answer:** Computed properties
**Explanation:** They return derived state and are cached.

---

## 10. Can Pinia store be used outside components?

**Answer:** Yes
**Explanation:** Stores can be used in services or utility modules.

---

## 11. How to reset store state?

**Answer:** `$reset()`
**Explanation:** Restores state to initial values.

---

## 12. How to persist Pinia state?

**Answer:** Plugins
**Explanation:** Example: `pinia-plugin-persistedstate`.

---

## 13. Does Pinia support TypeScript well?

**Answer:** Yes
**Explanation:** Pinia has strong TypeScript support.

---

## 14. How to call an action?

**Answer:** `store.actionName()`
**Explanation:** Actions behave like methods.

---

## 15. Can stores communicate with each other?

**Answer:** Yes
**Explanation:** One store can import and use another store.

---

## 16. Difference between Vuex and Pinia?

**Answer:** Pinia is simpler and modular
**Explanation:** Pinia removes mutations and reduces boilerplate.

---

## 17. Are Pinia actions async?

**Answer:** Yes
**Explanation:** Async/await can be used directly inside actions.

---

## 18. How to destructure store safely?

**Answer:** `storeToRefs()`
**Explanation:** Maintains reactivity while destructuring.

---

## 19. Does Pinia work with Vue 2?

**Answer:** Yes (with plugin)
**Explanation:** But it is primarily designed for Vue 3.

---

## 20. Are Pinia stores reactive?

**Answer:** Yes
**Explanation:** Pinia is built on Vue’s reactivity system.



