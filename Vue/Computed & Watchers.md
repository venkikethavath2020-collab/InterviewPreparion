Here is a **clean interview-oriented rewrite** of your notes focused on **how to answer quickly in Vue interviews**.

---

# Vue Computed & Watchers — Interview Focused Guide

---

# 1. `computed` vs `watch`

## Interview Question

**What is the difference between `computed` and `watch` in Vue? When should each be used?**

---

## Short Interview Answer (30 seconds)

* **`computed`** → used for **derived state** from reactive data.
* **`watch`** → used for **side effects** when reactive data changes.

Key rule:

```
Derived value → computed
Side effect → watch
```

Examples:

* full name → `computed`
* API call when filter changes → `watch`

---

## Basic Example

### Computed

```ts
import { ref, computed } from "vue"

const first = ref("Ada")
const last = ref("Lovelace")

const fullName = computed(() => {
  return `${first.value} ${last.value}`
})
```

Computed automatically updates when dependencies change.

---

### Watch

```ts
import { watch } from "vue"

watch(fullName, (newVal, oldVal) => {
  console.log("Name changed:", newVal)
})
```

---

## Key Differences

| Feature         | computed       | watch         |
| --------------- | -------------- | ------------- |
| Purpose         | derived state  | side effects  |
| Caching         | yes            | no            |
| Lazy evaluation | yes            | no            |
| Return value    | reactive value | runs callback |

---

## Real Project Example

### Computed (Cart Total)

```ts
const cart = ref([
  { price: 10 },
  { price: 20 }
])

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price, 0)
)
```

---

### Watch (API Call)

```ts
const filters = reactive({
  page: 1,
  search: ""
})

watch(
  () => [filters.page, filters.search],
  async () => {
    results.value = await api.search(filters)
  }
)
```

---

## Common Interview Follow-ups

### 1️⃣ Can computed be async?

❌ No.

Computed must be **synchronous**.

Use `watch` for async work.

---

### 2️⃣ What happens internally in computed?

Vue creates a **lazy reactive effect**.

```
dependency change
↓
mark computed as dirty
↓
recalculate only when accessed
```

This makes computed **very efficient**.

---

### 3️⃣ Can computed have setters?

Yes.

```ts
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => {
    const parts = val.split(" ")
    first.value = parts[0]
    last.value = parts[1]
  }
})
```

---

## Common Interview Mistakes

❌ Using `watch` to compute values

```js
watch(a, () => {
  b.value = a.value * 2
})
```

Correct:

```js
const b = computed(() => a.value * 2)
```

---

❌ Putting side effects in computed

```js
computed(() => {
  api.fetch()
})
```

Bad practice.

---

## Best Practices

✔ Use **computed for derived state**

✔ Keep computed **pure**

✔ Watch **small reactive sources**

---

# 2. `watch` vs `watchEffect`

## Interview Question

**What is the difference between `watch` and `watchEffect`?**

---

## Short Interview Answer

* **`watch`** → explicit dependencies
* **`watchEffect`** → automatically tracks dependencies

---

## Example

### watch

```ts
watch(
  () => filters.search,
  () => {
    fetchData()
  }
)
```

Explicit dependency.

---

### watchEffect

```ts
watchEffect(() => {
  console.log(filters.search)
})
```

Vue automatically tracks dependencies.

---

## Differences

| Feature             | watch  | watchEffect |
| ------------------- | ------ | ----------- |
| dependency tracking | manual | automatic   |
| old value access    | yes    | no          |
| control             | more   | less        |

---

## When to Use

| Scenario                   | Use         |
| -------------------------- | ----------- |
| API calls                  | watch       |
| debugging reactive changes | watchEffect |
| complex conditions         | watch       |

---

# 3. Async Watchers & Race Conditions

## Interview Question

**How do you prevent race conditions in async watchers?**

---

## Problem

User types quickly:

```
query = "v"
query = "vu"
query = "vue"
```

Three API requests start.

Older response may overwrite latest result.

---

## Solution: Cleanup Function

```ts
watch(query, async (q, old, onCleanup) => {
  const controller = new AbortController()

  onCleanup(() => controller.abort())

  const res = await fetch(`/api?q=${q}`, {
    signal: controller.signal
  })

  results.value = await res.json()
})
```

Old request gets **cancelled automatically**.

---

## Route Example

```ts
watch(
  () => route.params.id,
  async (id, old, onCleanup) => {

    let active = true

    onCleanup(() => {
      active = false
    })

    const user = await api.getUser(id)

    if (active) {
      form.value = user
    }

  },
  { immediate: true }
)
```

---

## Common Interview Questions

### 1️⃣ What does `immediate: true` do?

Runs watcher **immediately when created**.

---

### 2️⃣ What does `deep: true` do?

Watches **nested properties**.

```ts
watch(obj, callback, { deep: true })
```

But deep watch is **expensive**.

---

### 3️⃣ What does `flush: 'post'` mean?

Watcher runs **after DOM updates**.

Useful for **DOM measurements**.

---

## Performance Best Practices

✔ Watch **specific properties**

✔ Avoid deep watch on large objects

✔ Debounce high-frequency inputs

---

## Debounce Watch Example

```ts
watch(search, debounce(fetchData, 300))
```

Used in **search bars**.

---

# Senior Vue Interview Tip

Senior interviews often ask:

**“Explain how Vue schedules updates with computed and watchers.”**

Best short answer:

```
Vue tracks dependencies using reactive effects.

When reactive data changes:
1. Dependencies are tracked
2. Effects are scheduled
3. Vue batches updates in a queue
4. DOM updates are applied
```

This prevents **multiple unnecessary renders**.

---

This is a **very common senior Vue interview question** because it tests whether you understand **Vue 3 reactivity internals**.

Below is the **best way to explain it in an interview**.

---

# Vue Reactivity Internals

## “Explain how `track()` and `trigger()` work internally”

---

# Short Interview Answer (30–40 seconds)

Vue 3 uses **ES6 Proxy** to intercept property access.

When a reactive property is **read**, Vue calls **`track()`** to record the dependency.

When that property is **modified**, Vue calls **`trigger()`** to notify all dependent effects and update the UI.

Flow:

```
reactive object accessed
↓
track() → store dependency

reactive object modified
↓
trigger() → re-run dependent effects
```

This is how Vue knows **which components should re-render**.

---

# Core Concept

Vue implements **Dependency Tracking** using two main functions:

```
track()   → collect dependencies
trigger() → notify dependencies
```

These functions power:

* `computed`
* `watch`
* component rendering
* reactive effects

---

# Internal Data Structure

Vue stores dependencies using a **WeakMap-based structure**.

```
WeakMap
   ↓
target (reactive object)
   ↓
Map
   ↓
key (property)
   ↓
Set
   ↓
effects (functions that depend on it)
```

Representation:

```
targetMap
  ↓
userObject
  ↓
name
  ↓
[effect1, effect2]
```

---

# Step 1 — `track()` (Dependency Collection)

`track()` runs when a **reactive property is accessed**.

Example:

```js
const user = reactive({ name: "Ada" })

console.log(user.name)
```

Here Vue intercepts the **GET operation**.

Internally:

```
Proxy.get()
↓
track(target, key)
```

Pseudo implementation:

```js
function track(target, key) {

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)

}
```

What happens:

```
targetMap
   ↓
user object
   ↓
"name"
   ↓
Set(effect)
```

Vue now knows:

> This effect depends on `user.name`.

---

# Step 2 — `trigger()` (Dependency Notification)

`trigger()` runs when a **reactive property changes**.

Example:

```js
user.name = "John"
```

Vue intercepts the **SET operation**.

```
Proxy.set()
↓
trigger(target, key)
```

Pseudo implementation:

```js
function trigger(target, key) {

  const depsMap = targetMap.get(target)

  if (!depsMap) return

  const effects = depsMap.get(key)

  effects.forEach(effect => effect())

}
```

Now Vue re-runs all effects depending on that property.

---

# Complete Reactivity Flow

```
reactive state accessed
↓
track() records dependency
↓
state changes
↓
trigger() finds dependent effects
↓
effects re-run
↓
component re-renders
```

---

# Example With Rendering Effect

Example:

```js
const count = ref(0)

effect(() => {
  console.log(count.value)
})
```

Flow:

```
effect runs
↓
count.value accessed
↓
track()
↓
dependency stored

count.value++
↓
trigger()
↓
effect re-runs
↓
UI updates
```

---

# Why Vue Uses WeakMap

Vue uses **WeakMap** because:

* keys are **objects**
* garbage collection works automatically
* prevents **memory leaks**

Structure again:

```
WeakMap
  target → Map
            key → Set(effects)
```

---

# How `computed` Uses `track()` and `trigger()`

Computed internally creates a **lazy effect**.

```
dependency change
↓
trigger()
↓
mark computed as dirty
↓
recalculate when accessed
```

This makes computed **cached and efficient**.

---

# How `watch` Uses `track()` and `trigger()`

`watch()` creates an **effect that listens to sources**.

When dependencies change:

```
trigger()
↓
watch callback runs
```

Example:

```js
watch(count, () => {
  console.log("count changed")
})
```

---

# Why This Design Is Powerful

Vue’s system gives:

✔ fine-grained reactivity
✔ minimal DOM updates
✔ efficient dependency tracking

Only components **that depend on changed data re-render**.

---

# Common Interview Follow-ups

### 1️⃣ Why did Vue move from `Object.defineProperty` to Proxy?

Vue 2 problems:

* cannot detect property addition
* cannot track array index changes
* performance issues

Vue 3 Proxy solves all of these.

---

### 2️⃣ What is `activeEffect`?

It is the **currently executing reactive effect**.

Example:

```
component render
computed
watch
```

All of these are **effects**.

---

### 3️⃣ What is an effect?

An **effect is a reactive function that should re-run when dependencies change**.

Examples:

```
component render function
computed getter
watch callback
```

---

# Perfect Senior Interview Answer (One Paragraph)

If they ask quickly:

> Vue 3 reactivity is built on ES6 Proxy. When a reactive property is accessed, Vue calls `track()` to record the dependency between the property and the active effect. When the property changes, Vue calls `trigger()` which finds all stored effects and re-runs them. Vue stores dependencies in a WeakMap → Map → Set structure so updates are efficient and only components depending on the changed state re-render.

---

