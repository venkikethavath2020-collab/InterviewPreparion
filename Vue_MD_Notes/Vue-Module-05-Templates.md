# VUE MODULE 5: TEMPLATE SYSTEM

---

## 1. Interpolation
**Definition:** Embed reactive data into the DOM with `{{ }}` (text) — "mustache" syntax. Supports JS expressions (not statements).
```vue
<p>{{ user.name }}</p>
<p>{{ count * 2 }}</p>
<p>{{ ok ? 'Yes' : 'No' }}</p>
<p v-html="rawHtml"></p>   <!-- raw HTML — XSS risk, sanitize! -->
```
**Mistake:** `v-html` with user input → XSS. **Use `{{ }}`** (auto-escaped) for user data.

---

## 2. Directives
**Definition:** Special `v-` attributes that apply reactive behavior to the DOM.
| Directive | Purpose |
|-----------|---------|
| `v-bind` (`:`) | Bind attribute/prop to expression |
| `v-on` (`@`) | Event listener |
| `v-model` | Two-way binding |
| `v-if/v-else-if/v-else` | Conditional render (add/remove) |
| `v-show` | Toggle `display` (stays in DOM) |
| `v-for` | List render |
| `v-html` / `v-text` | Inner HTML / text |
| `v-once` | Render once, never update (static) |
| `v-memo` | Memoize subtree (Vue 3.2+) |
| `v-pre` | Skip compilation |
| `v-cloak` | Hide until compiled |
```vue
<a :href="url">link</a>
<button @click="save">Save</button>
<input :class="{ active: isActive }" :style="{ color }">
```

---

## 3. Conditional Rendering: `v-if` vs `v-show`
| | `v-if` | `v-show` |
|---|--------|----------|
| Mechanism | Adds/removes from DOM | Toggles `display:none` |
| Initial cost | Lazy (no render if false) | Always rendered |
| Toggle cost | Higher (mount/unmount) | Lower (CSS only) |
| Use when | Rarely toggles / condition often false | Toggles frequently |
```vue
<div v-if="role === 'admin'">Admin panel</div>
<div v-else>Guest</div>
<div v-show="isOpen">Frequently toggled</div>
```
**Mistake:** `v-if` + `v-for` on the **same element** (avoid — `v-if` has higher priority in Vue 3, ambiguous). Wrap or filter via computed.

---

## 4. List Rendering (`v-for`) & Keys
```vue
<li v-for="(item, index) in items" :key="item.id">{{ item.name }}</li>
<div v-for="(val, key) in obj" :key="key">{{ key }}: {{ val }}</div>
```
**`:key` is critical:** It gives each node a stable identity so the diff algorithm can **reuse/move** nodes instead of re-creating them. Without stable keys (or using `index` on reorderable lists) → wrong state reuse, input bugs, perf loss.
**Best practice:** Use a **unique, stable id** as key (not array index for dynamic lists).

---

## 5. Event Handling
```vue
<button @click="count++">+</button>
<button @click="handle">handler</button>
<button @click="handle($event, id)">with args</button>
<!-- Modifiers -->
<form @submit.prevent="onSubmit">          <!-- preventDefault -->
<input @keyup.enter="search">               <!-- key modifier -->
<div @click.stop="...">                      <!-- stopPropagation -->
<div @click.self="...">                      <!-- only if target is self -->
<button @click.once="...">                   <!-- once -->
```
Modifiers (`.prevent .stop .self .once .capture .passive` + key/mouse) keep handlers declarative.

---

## 6. Form Handling (`v-model`)
**Definition:** Two-way binding sugar. On an input: `:value` + `@input` combined.
```vue
<input v-model="text">                <!-- = :value + @input -->
<input v-model.number="age">          <!-- cast to number -->
<input v-model.trim="name">           <!-- trim whitespace -->
<input v-model.lazy="x">              <!-- sync on change not input -->
<input type="checkbox" v-model="checked">
<select v-model="selected">...</select>
```
**Component v-model (Vue 3):** `v-model` ⇄ `modelValue` prop + `update:modelValue` event. Multiple: `v-model:title`, `v-model:content`.
```vue
<!-- parent --> <Child v-model:title="t" />
<!-- child --> defineProps(['title']); defineEmits(['update:title'])
```

---

## 7. Slots
**Definition:** Content distribution — let a parent inject markup into a child's template (`<slot>` = placeholder).
```vue
<!-- Child (Card.vue) -->
<div class="card"><slot>fallback</slot></div>
<!-- Named slots -->
<header><slot name="header"/></header>
<main><slot/></main>
<!-- Parent -->
<Card>
  <template #header>Title</template>
  Default content
</Card>
```

---

## 8. Scoped Slots
**Definition:** Child **passes data up to the slot content** so the parent can render using the child's internal state. Enables flexible, reusable "renderless" components.
```vue
<!-- Child (List.vue) -->
<li v-for="item in items"><slot :item="item" :index="i"/></li>
<!-- Parent decides how to render each item -->
<List :items="users">
  <template #default="{ item, index }">
    {{ index }} — {{ item.name }}
  </template>
</List>
```
**Production use:** Table/list/datagrid components, "renderless" components (logic-only, parent owns markup), VueUse-style headless UI.

---

## 9. Dynamic Components
**Definition:** Render different components by name with `<component :is="...">`.
```vue
<component :is="currentTab" />
<!-- keep state alive when switching -->
<KeepAlive><component :is="currentTab" /></KeepAlive>
```
`is` can be a component name, an imported component, or an HTML tag. `<KeepAlive>` caches inactive components (preserves state, avoids re-mount).

---

## 10. Compilation Process
```
Template string
   │  @vue/compiler-dom (parse)
   ▼
AST (Abstract Syntax Tree)
   │  transform (apply optimizations: static hoisting, patch flags, …)
   ▼
Optimized AST
   │  generate (codegen)
   ▼
Render Function  (returns VNodes via h()/createElementVNode)
```
**Compiler optimizations (why Vue's VDOM is fast):**
- **Static hoisting:** static VNodes created once, reused across renders.
- **Patch flags:** mark dynamic bindings (e.g., "only class changes") → diff skips static parts (**block tree**).
- **Tree flattening / block tree:** track only dynamic descendants.
- **Cache event handlers** (`cacheHandlers`).
With `.vue` SFCs this happens **at build time** (runtime-only build). With in-browser templates, at runtime.

---

## INTERVIEW QUESTIONS
**🟢:** Interpolation vs v-html (XSS)? · v-if vs v-show? · Why :key in v-for? · What is v-model?
**🟡:** Slots vs scoped slots? · Component v-model mechanism (modelValue/update)? · Event modifiers? · Dynamic components + KeepAlive?
**🔴:** Template → render function pipeline. · What are patch flags / static hoisting / block tree? · Why is index a bad key? · Renderless component pattern via scoped slots.
**🧩:** List inputs show wrong values after reorder — key bug. · Build a reusable headless data-table (scoped slots). · Tab UI loses form state on switch — KeepAlive. · v-if+v-for on same element — fix.

## ⚡ REVISION
- Directives (`v-bind/:`, `v-on/@`, `v-model`, `v-if/v-show`, `v-for`).
- v-if = add/remove (lazy); v-show = display toggle (frequent).
- Always use stable unique `:key`; not index for dynamic lists.
- Slots = inject content; scoped slots = child exposes data to parent's markup.
- Compile: Template → AST → transform (hoist/patch flags) → render fn → VNodes.

➡️ Next: **Module 6 — Components.**
