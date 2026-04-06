Here is a **clean, interview-oriented version** of your notes. I removed long explanations and focused on **what interviewers expect you to say quickly and clearly**.

---

# Vue 3 Lifecycle Hooks — Interview Focused Guide

---

# 1. Vue 3 Component Lifecycle Order

## Interview Question

**Explain the lifecycle of a Vue 3 component and where each hook is used.**

---

## Short Interview Answer (30-second answer)

The Vue 3 component lifecycle follows this order:

```
setup()
↓
onBeforeMount()
↓
onMounted()
↓
onBeforeUpdate()
↓
onUpdated()
↓
onBeforeUnmount()
↓
onUnmounted()
```

* **setup()** → Initialize reactive state, props, composables.
* **onMounted()** → DOM is ready, safe for DOM access and API calls.
* **onUpdated()** → Runs after reactive state updates and DOM re-renders.
* **onUnmounted()** → Cleanup listeners, timers, subscriptions.

---

## Lifecycle Flow (Important for Interviews)

| Stage          | Hook                | When it runs             | Use Case                  |
| -------------- | ------------------- | ------------------------ | ------------------------- |
| Initialization | `setup()`           | Component creation       | create refs, composables  |
| Before Mount   | `onBeforeMount()`   | Before DOM inserted      | rarely used               |
| Mounted        | `onMounted()`       | After DOM render         | API calls, DOM operations |
| Before Update  | `onBeforeUpdate()`  | Before DOM update        | debugging                 |
| Updated        | `onUpdated()`       | After DOM update         | measure DOM               |
| Before Unmount | `onBeforeUnmount()` | Before component destroy | prepare cleanup           |
| Unmounted      | `onUnmounted()`     | After destroy            | remove listeners          |

---

## Typical Interview Code Example

```ts
import { onMounted, onUnmounted } from "vue"

onMounted(() => {
  window.addEventListener("resize", handleResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", handleResize)
})
```

---

## Real Project Example

Fetching API data when component loads:

```ts
import { onMounted } from "vue"

onMounted(async () => {
  await fetchUsers()
})
```

---

## Common Interview Follow-ups

### 1️⃣ Why can't we access DOM inside `setup()`?

Because the **component is not mounted yet**, so the DOM is not created.

---

### 2️⃣ Difference between `onBeforeUnmount` and `onUnmounted`

| Hook              | Timing                               |
| ----------------- | ------------------------------------ |
| `onBeforeUnmount` | before component removal             |
| `onUnmounted`     | after component completely destroyed |

---

### 3️⃣ Can we use multiple lifecycle hooks?

Yes.

```ts
onMounted(() => console.log("first"))
onMounted(() => console.log("second"))
```

Both run.

---

## Common Mistakes (Interviewers Love This)

❌ Access DOM in `setup()`

❌ Mutate reactive state in `onUpdated()` causing infinite loops

❌ Forget cleanup of:

* timers
* event listeners
* sockets

---

# 2. Vue Lifecycle with `<KeepAlive>`

## Interview Question

**How does lifecycle change when using `<KeepAlive>` in Vue?**

---

## Short Interview Answer

When a component is wrapped with `<KeepAlive>`, it is **not destroyed when removed from the DOM**.
Instead Vue pauses it.

New lifecycle hooks are used:

```
onActivated()
onDeactivated()
```

---

## Lifecycle Comparison

| Normal Component | KeepAlive Component |
| ---------------- | ------------------- |
| Mounted          | Mounted             |
| Unmounted        | Deactivated         |
| Recreated        | Activated           |

---

## Hooks Explanation

| Hook              | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `onActivated()`   | runs when component becomes active again |
| `onDeactivated()` | runs when component is cached            |

---

## Interview Code Example

```ts
import { onActivated, onDeactivated } from "vue"

onActivated(() => {
  refreshData()
})

onDeactivated(() => {
  pausePolling()
})
```

---

## Example with Vue Router

```vue
<KeepAlive>
  <router-view />
</KeepAlive>
```

Used in:

* dashboards
* tab systems
* wizard forms

---

## Common Interview Questions

### 1️⃣ Does `KeepAlive` destroy the component?

❌ No.

Component instance **stays in memory**.

---

### 2️⃣ Why use KeepAlive?

* faster navigation
* preserve state
* avoid re-fetching data

---

### 3️⃣ Problems with KeepAlive

* stale data
* memory usage

Solution:

```js
onActivated(() => {
  fetchData()
})
```

---

# Senior Interview Tip

Many companies ask this:

**"What are the three most commonly used lifecycle hooks?"**

Best answer:

```
setup()
onMounted()
onUnmounted()
```

These cover **initialization, DOM interaction, and cleanup**.

---
