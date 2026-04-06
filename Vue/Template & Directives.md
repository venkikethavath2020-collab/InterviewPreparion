# Vue Template and Directives - Interview Questions

## Question 1
### 1. Question
How do Vue directives (`v-if`, `v-show`, `v-for`, `v-bind`, `v-on`) affect rendering and performance?

### 2. Why this question is asked in interviews
Interviewers test whether you can reason about template decisions as runtime trade-offs.

### 3. Short Answer (for quick revision)
Directives are compile-time hints that generate render logic. `v-if` mounts/unmounts nodes, `v-show` toggles CSS display, `v-for` requires stable keys, `v-bind` binds dynamic props/attrs, and `v-on` wires event handlers and modifiers.

### 4. Detailed Explanation
- Core concept:
  - Declarative template instructions compiled into render branches.
- How it works internally:
  - Compiler turns directives into VNode props/branch blocks with patch flags.
- Reactivity / rendering impact:
  - Wrong directive choice can increase DOM churn or patch complexity.
- Vue 2 vs Vue 3 differences:
  - Vue 3 compiler has better static analysis and update optimization.
- Real project usage:
  - `v-if` for rare toggles, `v-show` for frequent visibility switches.

### 5. Code Examples
Basic example:
```vue
<div v-if="isReady">Loaded</div>
<div v-show="isPanelOpen">Panel</div>
```

Real-world example:
```vue
<li v-for="item in items" :key="item.id" @click="select(item.id)">
  {{ item.label }}
</li>
```

Composition API version:
```ts
const isReady = ref(false)
const items = ref([{ id: 1, label: 'A' }])
```

### 6. Common Follow-up Questions
- Why avoid `:key="index"`?
- `v-if` with `v-for`: why discouraged on same element?
- Which event modifiers help prevent propagation bugs?

### 7. Common Mistakes
- Heavy logic inside template expressions.
- Missing keys in mutable lists.
- Using `v-if` for frequent toggles.

### 8. Performance / Best Practices
- Move expensive expressions to computed values.
- Keep keys stable and semantic.
- Use event modifiers intentionally (`.prevent`, `.stop`, `.once`).

### 9. When NOT to use this
- Avoid custom directives when component/composable abstraction is clearer.

---

## Question 2
### 1. Question
How do slots and `v-model` in templates support reusable component APIs?

### 2. Why this question is asked in interviews
This checks API design skill for design systems and shared component libraries.

### 3. Short Answer (for quick revision)
Slots let parents inject UI into child layout while preserving parent scope. `v-model` standardizes controlled component contracts (`modelValue` + `update:modelValue`) and supports multiple bindings in Vue 3.

### 4. Detailed Explanation
- Core concept:
  - Slots for structure customization, props/emits (or `v-model`) for state flow.
- How it works internally:
  - Slots compile to functions returning VNodes.
  - `v-model` compiles to prop/event pair.
- Reactivity / rendering impact:
  - Scoped slots can rerender often if slot props are unstable.
- Vue 2 vs Vue 3 differences:
  - Vue 3 unifies slot syntax and expands `v-model` API.
- Real project usage:
  - Data tables, form controls, modal layouts.

### 5. Code Examples
Basic example:
```vue
<Modal>
  <template #header>Confirm Delete</template>
  <p>Are you sure?</p>
</Modal>
```

Real-world example:
```vue
<UserSearchInput v-model:query="query" v-model:filters="filters" />
```

Composition API version:
```ts
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
```

### 6. Common Follow-up Questions
- Slots vs props: when to prefer each?
- How do you type slot props in TS?
- How do you avoid excessive rerenders with scoped slots?

### 7. Common Mistakes
- Using slots where simple props suffice.
- Creating ambiguous multi-model component contracts.
- Forgetting emit declarations.

### 8. Performance / Best Practices
- Keep slot contracts small and explicit.
- Document `v-model` events clearly in shared components.
- Prefer pure render output from slot functions.

### 9. When NOT to use this
- Avoid slot-heavy APIs for simple presentational components.
