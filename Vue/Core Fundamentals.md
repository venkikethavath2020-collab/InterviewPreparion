Here is a **clean, interview-focused rewrite** of your Vue Core Fundamentals notes so you can **answer confidently in interviews**.

---

# Vue 3 Core Fundamentals — Interview Guide

---

# 1. Vue 3 Core Architecture

## Interview Question

**Explain Vue 3 core architecture: reactivity system, component model, and rendering pipeline.**

---

## Short Interview Answer (30–40 seconds)

Vue 3 architecture has **three main parts**:

1. **Reactivity System** → Tracks state changes using **Proxy**, `track()` and `trigger()`.
2. **Component Model** → Applications are built as **component trees** with one-way data flow.
3. **Rendering Pipeline** → State changes trigger **virtual DOM updates**, which Vue patches efficiently using compiler optimizations.

Flow:

```text
Reactive State Change
        ↓
track() / trigger()
        ↓
Reactive effect scheduled
        ↓
Virtual DOM diff
        ↓
DOM patch update
```

---

# Core Vue Architecture Layers

| Layer             | Responsibility              |
| ----------------- | --------------------------- |
| Reactivity System | track reactive dependencies |
| Component System  | UI organization             |
| Compiler          | template → render function  |
| Renderer          | virtual DOM → real DOM      |

---

# 1️⃣ Reactivity System

Vue uses **ES6 Proxy** to track dependencies.

Example:

```ts
import { reactive, computed } from "vue"

const state = reactive({ count: 0 })

const doubled = computed(() => state.count * 2)
```

How it works internally:

```text
state.count accessed
↓
track()

state.count changed
↓
trigger()

component re-renders
```

---

# 2️⃣ Component Model

Vue applications are **trees of reusable components**.

Example:

```text
App
 ├── Navbar
 ├── Sidebar
 └── Dashboard
        ├── UserCard
        └── Charts
```

Each component has:

* **state**
* **template**
* **logic**

---

# 3️⃣ Rendering Pipeline

Vue converts templates to **render functions**.

Example template:

```vue
<li v-for="u in users" :key="u.id">{{ u.name }}</li>
```

Compilation result (conceptually):

```js
render() {
  return h("li", user.name)
}
```

Rendering flow:

```text
template
↓
compiler
↓
render function
↓
virtual DOM
↓
diff algorithm
↓
real DOM patch
```

---

# Vue Compiler Optimizations

Vue 3 compiler improves performance using:

| Optimization    | Purpose                          |
| --------------- | -------------------------------- |
| Static Hoisting | move static nodes outside render |
| Patch Flags     | update only dynamic parts        |
| Tree Flattening | faster diffing                   |

Example:

```vue
<div>
  <h1>Static Title</h1>
  <p>{{ message }}</p>
</div>
```

Only `<p>` updates.

---

# Real Project Example

Filtering users:

```vue
<script setup>
import { computed } from "vue"

const props = defineProps({
  users: Array
})

const activeUsers = computed(() =>
  props.users.filter(u => u.active)
)
</script>
```

---

# Common Interview Follow-ups

### Why are keys required in `v-for`?

Keys help Vue **identify nodes during diffing**.

Without keys:

```text
Vue may reuse wrong DOM nodes
```

Correct usage:

```vue
<li v-for="user in users" :key="user.id">
```

---

### How does Vue batch updates?

Vue uses a **scheduler queue**.

Multiple state updates:

```text
state change
state change
state change
```

Result:

```text
1 DOM update
```

---

# Common Mistakes

❌ Missing keys in lists
❌ Putting heavy logic inside templates
❌ Using watchers instead of computed

---

# Best Practices

✔ Use **computed for derived data**

✔ Keep components **small and focused**

✔ Lazy load heavy modules

---

# 2. Options API vs Composition API

---

## Interview Question

**When should you use Options API vs Composition API in Vue 3?**

---

## Short Interview Answer

Use:

* **Composition API** for **large or complex applications**
* **Options API** for **simple components**

Most modern Vue 3 projects prefer **Composition API** because it provides:

* better **logic reuse**
* better **TypeScript support**
* better **scalability**

---

# Options API Example

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

Logic organized by **option type**.

---

# Composition API Example

```vue
<script setup>
import { ref } from "vue"

const count = ref(0)

function increment() {
  count.value++
}
</script>
```

Logic organized by **feature**.

---

# Major Differences

| Feature            | Options API    | Composition API |
| ------------------ | -------------- | --------------- |
| Code organization  | by option type | by feature      |
| TypeScript support | weaker         | strong          |
| Logic reuse        | mixins         | composables     |
| scalability        | medium         | high            |

---

# Mixins vs Composables

Old Vue approach:

```js
mixins: [paginationMixin]
```

Problem:

* naming conflicts
* implicit dependencies

Better approach:

```ts
export function usePagination() {
  const page = ref(1)
  const size = ref(10)

  return { page, size }
}
```

Used as:

```ts
const { page } = usePagination()
```

---

# Real Project Strategy

Most companies use:

```text
Vue 2 project
↓
incremental migration
↓
Composition API for new modules
```

---

# Common Interview Questions

### Can Options API and Composition API coexist?

Yes.

Vue supports **hybrid components**.

---

### Which API has better performance?

Almost **no difference**.

The difference is mainly **code organization and maintainability**.

---

# Best Practices

✔ Choose **one style per project**

✔ Prefer **composables over mixins**

✔ Use **Composition API for complex features**

---

# Senior Vue Interview Tip

One **very common senior Vue question** is:

**“Explain the complete Vue rendering pipeline.”**

Expected explanation:

```text
Template
↓
Compiler
↓
Render Function
↓
Virtual DOM
↓
Diff Algorithm
↓
DOM Patch
```

Understanding this helps debug **performance issues and rendering bugs**.

---

If you'd like, I can also show you **the 7 hardest Vue interview questions senior developers struggle with**, including:

* Vue scheduler queue
* effectScope
* async component rendering
* patch flags
* hydration in SSR

These are **frequently asked in senior frontend interviews.**
