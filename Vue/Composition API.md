# Vue Composition API - Interview Questions

## Question 1
### 1. Question
What problem does the Composition API solve compared to the Options API?

### 2. Why this question is asked in interviews
This checks whether you can design scalable component architecture and avoid logic fragmentation in large codebases.

### 3. Short Answer (for quick revision)
Composition API organizes code by feature, not by option blocks (`data`, `methods`, `computed`). It improves reuse via composables, removes `this` pitfalls, and provides stronger TypeScript inference. Options API is still valid, but Composition API scales better in complex modules.

### 4. Detailed Explanation
- Core concept:
  - Group related state, effects, and methods in one place.
- How it works internally:
  - `setup()` creates reactive graph (`ref`, `reactive`, `computed`, `watch`) and returns bindings to template.
- Reactivity / rendering impact:
  - Smaller reactive surfaces and feature-based organization reduce accidental rerenders.
- Vue 2 vs Vue 3 differences:
  - Vue 2 mostly used Options API; Vue 3 adds first-class Composition API.
- Real project usage:
  - Extract reusable business logic (`useAuth`, `usePagination`, `usePermissions`) into composables.

### 5. Code Examples
Basic example:
```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
const inc = () => count.value++
</script>

<template>
  <button @click="inc">{{ count }}</button>
</template>
```

Real-world example:
```ts
// composables/useUsers.ts
import { ref, onMounted } from 'vue'

export function useUsers(api: { list: () => Promise<any[]> }) {
  const users = ref<any[]>([])
  const loading = ref(false)

  onMounted(async () => {
    loading.value = true
    users.value = await api.list()
    loading.value = false
  })

  return { users, loading }
}
```

Composition API version:
```ts
import { computed, ref } from 'vue'
const price = ref(10)
const qty = ref(2)
const total = computed(() => price.value * qty.value)
```

### 6. Common Follow-up Questions
- When is Options API still acceptable?
- How do composables differ from mixins?
- How do you avoid shared-state bugs in composables?

### 7. Common Mistakes
- Creating composables that hide too much behavior.
- Destructuring reactive objects without `toRefs`.
- Mixing unrelated features inside one giant composable.

### 8. Performance / Best Practices
- Keep composables focused and side-effect boundaries explicit.
- Use `computed` for derived data, not `watch`.
- Prefer dependency injection (params/provide-inject) over implicit globals.

### 9. When NOT to use this
- For tiny, static components, Options API can be simpler.

---

## Question 2
### 1. Question
`setup()` vs `<script setup>`: what is the difference and when should you prefer each?

### 2. Why this question is asked in interviews
Interviewers test whether you understand compile-time ergonomics, not just syntax memorization.

### 3. Short Answer (for quick revision)
`<script setup>` is compile-time sugar over `setup()`: less boilerplate, auto-exposed bindings, and better TS ergonomics. Traditional `setup()` is still useful when you need explicit component options composition.

### 4. Detailed Explanation
- Core concept:
  - Both generate setup logic; `<script setup>` reduces ceremony.
- How it works internally:
  - Compiler transforms top-level declarations into component setup return context.
- Reactivity / rendering impact:
  - No inherent runtime reactivity difference; mostly DX and bundle cleanliness.
- Vue 2 vs Vue 3 differences:
  - `<script setup>` is Vue 3 SFC compiler feature.
- Real project usage:
  - Use `<script setup>` by default; fallback to classic syntax for special interop cases.

### 5. Code Examples
Basic example:
```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
```

Real-world example:
```vue
<script setup lang="ts">
const props = defineProps<{ userId: string }>()
const emit = defineEmits<{ save: [id: string] }>()

function onSave() {
  emit('save', props.userId)
}
</script>
```

Composition API version:
```ts
export default {
  setup() {
    const open = ref(false)
    return { open }
  }
}
```

### 6. Common Follow-up Questions
- Why is `this` unavailable in `setup()`?
- What does `defineProps` compile to?
- Can `<script setup>` be used with TypeScript generics?

### 7. Common Mistakes
- Assuming `<script setup>` changes runtime lifecycle order.
- Mutating props directly.
- Overusing `defineExpose` and creating tight coupling.

### 8. Performance / Best Practices
- Keep top-level declarations deterministic.
- Co-locate feature logic and extract composables when duplicated.
- Validate emits and props for API clarity.

### 9. When NOT to use this
- Avoid excessive macro usage if team readability drops.
