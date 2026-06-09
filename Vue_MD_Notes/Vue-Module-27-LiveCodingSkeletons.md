# VUE MODULE 27: LIVE-CODING SKELETONS (Build a Component From Scratch)

> **Goal:** when the interviewer says *"build a component that displays this data"* or *"build a dynamic form,"* you should already have the **skeleton in your head** and only fill in the logic. This module is the muscle-memory layer on top of Modules 3 (Composition API), 6 (Components), 7 (Lifecycle), and 15 (Forms).

---

## 1. The Universal Mental Model (memorize this order)

Every `<script setup>` component is written **top-to-bottom in the same order**. Recall it as a checklist:

```
┌─────────────────────────────────────────────────────────┐
│  1. imports        ref, reactive, computed, watch, hooks │
│  2. props          defineProps                           │
│  3. emits          defineEmits                           │
│  4. STATE          ref() / reactive()      ← the data    │
│  5. DERIVED        computed()               ← from state │
│  6. METHODS        functions that change state           │
│  7. WATCHERS       watch / watchEffect      ← side effects│
│  8. LIFECYCLE      onMounted / onUnmounted               │
│  9. expose/return  (script setup auto-exposes)           │
└─────────────────────────────────────────────────────────┘
       ▲ template uses 4,5,6  ▲ async/DOM/3rd-party in 8
```

**Mnemonic: "I Pray Every Saturday, Don't Make Work Late"**
**I**mports → **P**rops → **E**mits → **S**tate → **D**erived → **M**ethods → **W**atchers → **L**ifecycle.

> You rarely need all 8. For "display info" you need 1,2,(5),template. For a form you need 1,4,6,template. Start with the skeleton, delete what you don't use.

---

## 2. The Blank Skeleton (type this first, every time)

```vue
<template>
  <!-- 1. structure here -->
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 2. props
const props = defineProps({ /* name: { type, required, default } */ })

// 3. emits
const emit = defineEmits(['update', 'submit'])

// 4. state
const state = reactive({})

// 5. derived
// const fullName = computed(() => …)

// 6. methods
function handle() {}

// 7. watchers
// watch(() => props.id, (id) => { … })

// 8. lifecycle
onMounted(() => { /* fetch / DOM / listeners */ })
</script>

<style scoped></style>
```

> **Interview move:** narrate it — *"I'll start with the script-setup skeleton: props, state, computed, methods, then lifecycle for the fetch."* Shows structure before you write a single line of logic.

---

## 3. The Decision Table (which tool for which job)

This is what interviewers are really testing. Know the **trigger phrase → tool** mapping cold:

| You hear / need… | Use | Why |
|---|---|---|
| "store a single value" (number, string, boolean) | `ref()` | primitives need `.value` wrapping |
| "store an object/form with many fields" | `reactive()` | groups related state; no `.value` |
| "a value **derived** from other state" (total, filtered list, fullName) | `computed()` | **cached**, auto-updates, read-only |
| "do something **when** X changes" (fetch on id change, log, sync) | `watch()` | side effect on specific source |
| "run a side effect using whatever I read" | `watchEffect()` | auto-tracks its deps |
| "fetch data / access DOM / init a chart lib / add listeners" | `onMounted()` | DOM exists, runs once |
| "clean up timers / listeners / sockets" | `onUnmounted()` | prevent memory leaks |
| "two-way bind an input" | `v-model` | `:value` + `@input` sugar |
| "read a child's DOM element or method" | `ref` + `useTemplateRef` / `ref="el"` | template ref |

**Golden rules:**
- `computed` **caches**, `watch` **reacts**. If you're returning a value → `computed`. If you're *doing* something (fetch, log, navigate) → `watch`.
- Never mutate state inside a `computed`. Never put derived-value logic in `watch` if `computed` can do it.
- `ref` by default; reach for `reactive` for grouped form/object state.

---

## 4. `ref` vs `reactive` — the 10-second answer

```js
// ref → wraps ANY value, access with .value (auto-unwrapped in template)
const count = ref(0)
count.value++              // in JS
// {{ count }}             // in template (no .value)

// reactive → for objects only, no .value, but can't be destructured/reassigned
const form = reactive({ name: '', age: 0 })
form.name = 'Venki'        // ✅
// const { name } = form   // ❌ loses reactivity → use toRefs(form)
// form = {}               // ❌ reassign breaks reactivity → mutate instead
```
> Rule of thumb: **`ref` for primitives & single values, `reactive` for a bundle of related fields.** Both are valid for objects — pick `reactive` when it reads cleaner (no `.value` everywhere).

---

## 5. Lifecycle — when does my code run? (the 3 you actually use)

```
setup() runs ──► onBeforeMount ──► [render → real DOM] ──► onMounted
                                                              │
   reactive change ──► onBeforeUpdate ──► [re-render] ──► onUpdated
                                                              │
                              onBeforeUnmount ──► [teardown] ──► onUnmounted
```

| Hook | Fill it with |
|---|---|
| `onMounted` | **fetch data**, DOM access (`el.focus()`), init 3rd-party (charts, maps), `addEventListener` |
| `onUnmounted` | `clearInterval`, `removeEventListener`, close sockets — **always pair with what you set up** |
| `onUpdated` | rarely — post-DOM-patch work (careful: can loop) |

> 90% of the time you only write `onMounted` (fetch) and `onUnmounted` (cleanup). Children mount **before** parents.

---

## 6. TASK SKELETON A — Display Information (read-only)

> *"Here's a user object / list — display it."* The simplest ask. State (or prop) → template.

```vue
<template>
  <div class="card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <span :class="statusClass">{{ user.active ? 'Active' : 'Inactive' }}</span>

    <!-- list of things -->
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.label }}</li>
    </ul>

    <!-- conditional + empty state -->
    <p v-if="items.length === 0">No items found.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const user = ref({ name: 'Venki', email: 'v@x.com', active: true })
const items = ref([{ id: 1, label: 'A' }, { id: 2, label: 'B' }])

// derived value → computed
const statusClass = computed(() => (user.value.active ? 'green' : 'red'))
</script>
```
**Checklist:** `v-for` always has `:key`. Add an **empty state** (`v-if length===0`) — interviewers love that. Use `computed` for any derived label/class.

---

## 7. TASK SKELETON B — Dynamic Form (the most common ask)

> *"Build a form with validation"* / *"render fields from a config."* Two flavours — know both.

### B1. Standard form (fixed fields)
```vue
<template>
  <form @submit.prevent="onSubmit">
    <div>
      <input v-model.trim="form.name" placeholder="Name" />
      <small v-if="errors.name">{{ errors.name }}</small>
    </div>
    <div>
      <input v-model.number="form.age" type="number" placeholder="Age" />
      <small v-if="errors.age">{{ errors.age }}</small>
    </div>
    <button :disabled="!isValid">Submit</button>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue'

const form = reactive({ name: '', age: null })       // 4. state
const errors = reactive({})

const rules = {                                       // validation rules
  name: v => (v ? '' : 'Name is required'),
  age:  v => (v >= 18 ? '' : 'Must be 18+'),
}

function validate() {                                 // 6. method
  Object.keys(rules).forEach(k => { errors[k] = rules[k](form[k]) })
}

const isValid = computed(() =>                        // 5. derived
  Object.values(errors).every(e => !e) && form.name && form.age
)

function onSubmit() {
  validate()
  if (Object.values(errors).some(Boolean)) return
  emit('submit', { ...form })                         // emit a COPY
}
const emit = defineEmits(['submit'])
</script>
```

### B2. Config-driven dynamic form (render fields from an array)
> *"The fields come from an API / config — render them dynamically."*
```vue
<template>
  <form @submit.prevent="onSubmit">
    <div v-for="field in fields" :key="field.name">
      <label>{{ field.label }}</label>

      <input
        v-if="field.type === 'text' || field.type === 'number'"
        :type="field.type"
        v-model="formData[field.name]"
      />
      <select v-else-if="field.type === 'select'" v-model="formData[field.name]">
        <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <input v-else-if="field.type === 'checkbox'" type="checkbox" v-model="formData[field.name]" />

      <small v-if="errors[field.name]">{{ errors[field.name] }}</small>
    </div>
    <button>Submit</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({ fields: { type: Array, required: true } })
const emit = defineEmits(['submit'])

// build reactive state from the config dynamically
const formData = reactive(
  Object.fromEntries(props.fields.map(f => [f.name, f.type === 'checkbox' ? false : '']))
)
const errors = reactive({})

function validate() {
  props.fields.forEach(f => {
    errors[f.name] = f.required && !formData[f.name] ? `${f.label} is required` : ''
  })
}
function onSubmit() {
  validate()
  if (Object.values(errors).some(Boolean)) return
  emit('submit', { ...formData })
}
</script>
```
**Checklist:** `@submit.prevent`. Build state from config with `Object.fromEntries`. `v-model` on `formData[field.name]`. Emit a **copy** (`{ ...formData }`), never the reactive object.

---

## 8. TASK SKELETON C — Editable List / CRUD (add, edit, delete, filter)

> *"Build a todo / contact list with add and delete."* Tests `v-for` keys, array mutation, and computed filtering.

```vue
<template>
  <div>
    <input v-model="newItem" @keyup.enter="add" placeholder="Add…" />
    <input v-model="search" placeholder="Search…" />

    <ul>
      <li v-for="item in filtered" :key="item.id">
        {{ item.text }}
        <button @click="remove(item.id)">✕</button>
      </li>
    </ul>
    <p v-if="filtered.length === 0">Nothing here.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([])                 // 4. state
const newItem = ref('')
const search = ref('')
let nextId = 1

const filtered = computed(() =>       // 5. derived (filter in computed, NOT watch)
  items.value.filter(i => i.text.toLowerCase().includes(search.value.toLowerCase()))
)

function add() {                      // 6. methods
  if (!newItem.value.trim()) return
  items.value.push({ id: nextId++, text: newItem.value.trim() })
  newItem.value = ''
}
function remove(id) {
  items.value = items.value.filter(i => i.id !== id)
}
</script>
```
**Checklist:** stable `:key` (use an id, not the array index). Filtering/sorting/searching → **`computed`**, never `watch`. Reset the input after adding.

---

## 9. TASK SKELETON D — Fetch & Display (async data)

> *"Fetch from an API and show it."* Tests `onMounted`, loading/error states, and the async pattern.

```vue
<template>
  <div>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error">{{ error }}</p>
    <ul v-else>
      <li v-for="u in users" :key="u.id">{{ u.name }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!res.ok) throw new Error('Request failed')
    users.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false      // always reset in finally
  }
}

onMounted(load)                // fetch in onMounted

// re-fetch when a prop changes:
// watch(() => props.id, load)
</script>
```
**Checklist (the "3 states"):** `loading`, `error`, `data` — interviewers expect all three. `try/catch/finally`, reset `loading` in `finally`. Fetch in `onMounted`; re-fetch on prop change with `watch`.

---

## 10. TASK SKELETON E — Reusable Input with Custom `v-model`

> *"Make a custom input component the parent can `v-model`."* Tests props/emits contract.

```vue
<!-- BaseInput.vue -->
<template>
  <input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
</template>

<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```
```vue
<!-- Parent -->
<BaseInput v-model="name" />
```
**Rule:** `v-model` on a component = prop **`modelValue`** + event **`update:modelValue`**. (Vue 3.4+: `const model = defineModel()` does this in one line.)

---

## 11. Parent ↔ Child Cheat (props down, events up)

```
Parent ──:title="x"──────────►  Child   (defineProps)
Parent ◄──@save="handle"──────  Child   (defineEmits → emit('save', payload))
Cross-tree: provide/inject  or  Pinia store
```
```vue
<!-- Child -->
<script setup>
const props = defineProps({ title: String })
const emit  = defineEmits(['save'])
function done() { emit('save', { id: 1 }) }   // payload travels up
</script>
```

---

## 12. 60-Second Pre-Code Ritual (say this out loud)

When given any component task, walk the interviewer through this **before** coding:

1. **"What's the state?"** → pick `ref` (single) or `reactive` (object/form).
2. **"What's derived?"** → `computed` (filters, totals, validity, labels).
3. **"What actions change state?"** → methods (`add`, `submit`, `remove`).
4. **"Any side effects?"** → `onMounted` (fetch), `watch` (react to change), `onUnmounted` (cleanup).
5. **"What does the template need?"** → loop (`v-for`+`:key`), conditionals (`v-if`/empty state), bindings (`v-model`, `:class`).
6. **"Parent communication?"** → props in, `emit` out.

> Saying this maps every task onto the **I-P-E-S-D-M-W-L** skeleton — you never face a blank file.

---

## 13. Common Interview Traps (lose-points list)

| Trap | Fix |
|---|---|
| Forgetting `.value` in `<script>` (have it in template) | `ref` → `.value` in JS, bare in template |
| `:key="index"` on a mutable list | use a stable **id** |
| Filtering/sorting inside `watch` | use **`computed`** |
| Emitting/returning the reactive object directly | emit a **copy** `{ ...form }` |
| Destructuring `reactive` (loses reactivity) | `toRefs(obj)` or keep `obj.field` |
| No loading/error states on fetch | always show the **3 states** |
| Set a timer/listener but never clean up | pair with `onUnmounted` |
| Mutating a prop in the child | emit up; props are read-only |
| Expecting DOM to be updated synchronously | `await nextTick()` |

---

## 14. One-Glance Recall Card

```
SKELETON ORDER:  imports → props → emits → state → computed → methods → watch → lifecycle
PICK STATE:      ref(primitive)   reactive(object/form)
DERIVED:         computed (cached, returns a value)
REACT:           watch (side effect on change)   watchEffect (auto-deps)
ASYNC/DOM:       onMounted (fetch/DOM/listeners)   onUnmounted (cleanup)
TEMPLATE:        v-for+:key   v-if/empty-state   v-model   :class/:style   @click
COMMS:           defineProps (down)   defineEmits (up)   provide/inject | Pinia (cross)
FETCH:           loading / error / data  +  try/catch/finally
FORM:            @submit.prevent  +  rules{}  +  errors{}  +  emit({...copy})
```

---

**Related modules:** [3 Composition API](Vue-Module-03-CompositionAPI.md) · [6 Components](Vue-Module-06-Components.md) · [7 Lifecycle](Vue-Module-07-Lifecycle.md) · [13 Composables](Vue-Module-13-Composables.md) · [15 Forms](Vue-Module-15-Forms.md) · [25 Revision Sheets](Vue-Module-25-RevisionSheets.md)
