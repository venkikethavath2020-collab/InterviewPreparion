# Vue Advanced Concepts - Deep Interview Questions

## Question 1
### 1. Question
How do templates, render functions, and JSX relate in Vue 3, and when should render functions be used?

### 2. Why this question is asked in interviews
Interviewers test framework internals understanding and your ability to choose the right abstraction.

### 3. Short Answer (for quick revision)
Vue templates are compiled into render functions. JSX also compiles to render functions. Use templates by default for readability; use render functions/JSX for highly dynamic UI composition, renderless patterns, or library-level components.

### 4. Detailed Explanation
- Core concept:
  - Render functions are the runtime source of virtual DOM nodes.
- How it works internally:
  - SFC compiler transforms template AST to optimized render function with patch flags.
- Reactivity / rendering impact:
  - Dynamic branching in render functions can improve flexibility but reduce readability.
- Vue 2 vs Vue 3 differences:
  - Vue 3 compiler emits more granular optimization hints.
- Real project usage:
  - Table/grid libraries, dynamic schema renderers, headless UI primitives.

### 5. Code Examples
Basic example:
```ts
import { h } from 'vue'
export default { render: () => h('div', 'Hello') }
```

Real-world example:
```ts
setup(props, { slots }) {
  return () => h('section', { class: 'card' }, slots.default ? slots.default() : 'Fallback')
}
```

Composition API version (JSX):
```tsx
setup() {
  return () => <button class="btn">Save</button>
}
```

### 6. Common Follow-up Questions
- What does `h()` return?
- Template compiler optimizations in Vue 3?
- Render function vs slot-based composition trade-offs?

### 7. Common Mistakes
- Using render functions for simple templates.
- Ignoring accessibility when generating dynamic trees.
- Mixing rendering and heavy business logic.

### 8. Performance / Best Practices
- Prefer templates for maintainability.
- Use render functions for real dynamic gains only.
- Keep dynamic node count predictable.

### 9. When NOT to use this
- Do not use JSX/render functions by default in product teams without clear benefit.

---

## Question 2
### 1. Question
How do slots, provide/inject, and dependency boundaries work internally in Vue 3?

### 2. Why this question is asked in interviews
This checks architectural maturity in reusable component systems.

### 3. Short Answer (for quick revision)
Slots are functions passed from parent to child that return VNodes. `provide/inject` passes dependencies down tree without prop drilling. Use props/emits for explicit data flow; use provide/inject for cross-cutting context (theme, form context, i18n adapters).

### 4. Detailed Explanation
- Core concept:
  - Composition boundaries: explicit API vs contextual dependency.
- How it works internally:
  - Slot functions execute in parent scope; inject resolves nearest provider key.
- Reactivity / rendering impact:
  - Injected refs stay reactive; plain primitive copies do not auto-sync unless wrapped.
- Vue 2 vs Vue 3 differences:
  - Same concept, cleaner Composition API ergonomics in Vue 3.
- Real project usage:
  - Form groups, design systems, plugin configuration.

### 5. Code Examples
Basic example:
```vue
<Child>
  <template #default="{ item }">{{ item.name }}</template>
</Child>
```

Real-world example:
```ts
// provider
provide('theme', readonly(themeRef))

// consumer
const theme = inject<Ref<string>>('theme')
```

Composition API version:
```ts
const slots = useSlots()
```

### 6. Common Follow-up Questions
- When is provide/inject better than Pinia?
- How do scoped slots impact rendering cost?
- How do you type injection keys in TS?

### 7. Common Mistakes
- Using provide/inject for core business state indiscriminately.
- Forgetting default values in `inject`.
- Leaking mutable internals via provided objects.

### 8. Performance / Best Practices
- Provide readonly interfaces where possible.
- Use symbols for injection keys in large apps.
- Keep slot props minimal and stable.

### 9. When NOT to use this
- Avoid provide/inject when explicit props/emits are clearer and traceable.
