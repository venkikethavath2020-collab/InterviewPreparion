# Vue Forms and Validation - Interview Questions

## Question 1
### 1. Question
How does `v-model` work in Vue 3, including custom component bindings?

### 2. Why this question is asked in interviews
Interviewers check whether you understand controlled inputs and component contracts, not just syntax.

### 3. Short Answer (for quick revision)
`v-model` is syntax sugar for prop binding plus update event. Native input maps to `value` and `input` events. In components, default is `modelValue` and `update:modelValue`, and Vue 3 supports multiple named models.

### 4. Detailed Explanation
- Core concept:
  - Two-way sync with single source of truth in parent state.
- How it works internally:
  - Compiler rewrites `v-model` into prop + event listeners.
- Reactivity / rendering impact:
  - Each input change triggers reactive updates; optimize high-frequency validations.
- Vue 2 vs Vue 3 differences:
  - Vue 3 standardizes `modelValue` and supports multiple `v-model:*`.
- Real project usage:
  - Build reusable form controls with explicit event contracts.

### 5. Code Examples
Basic example:
```vue
<input v-model="email" />
```

Real-world example:
```vue
<MyDateRange
  v-model:start="startDate"
  v-model:end="endDate"
/>
```

Composition API version:
```vue
<script setup>
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
```

### 6. Common Follow-up Questions
- How do `.trim`, `.number`, `.lazy` modifiers work?
- How do you implement custom modifiers?
- When should you avoid two-way binding?

### 7. Common Mistakes
- Mutating props directly in child controls.
- Overusing v-model where one-way prop is enough.
- No emit validation in shared design-system components.

### 8. Performance / Best Practices
- Validate on blur for expensive checks.
- Debounce async validators.
- Keep form state local unless globally needed.

### 9. When NOT to use this
- Avoid v-model on highly specialized inputs where explicit change handlers are clearer.

---

## Question 2
### 1. Question
How do you design scalable form validation in Vue for enterprise apps?

### 2. Why this question is asked in interviews
This tests ability to handle complex forms, async checks, and maintainability over time.

### 3. Short Answer (for quick revision)
Use layered validation: HTML constraints for basics, schema validation for business rules, and async checks for server-dependent constraints. Model `dirty/touched/error` states explicitly and keep submission flow deterministic.

### 4. Detailed Explanation
- Core concept:
  - Validation must be predictable, composable, and testable.
- How it works internally:
  - Reactive form state triggers field-level and form-level computed validity.
- Reactivity / rendering impact:
  - Per-keystroke validation can cause excess updates if not throttled.
- Vue 2 vs Vue 3 differences:
  - Composition API makes reusable validation composables cleaner.
- Real project usage:
  - Use Vee-Validate + Zod/Yup for schema-driven forms.

### 5. Code Examples
Basic example:
```ts
const form = reactive({ email: '' })
const errors = reactive({ email: '' })

function validateEmail() {
  errors.email = /.+@.+\..+/.test(form.email) ? '' : 'Invalid email'
}
```

Real-world example:
```ts
const submitting = ref(false)

async function submit() {
  if (!isValid.value) return
  submitting.value = true
  try {
    await api.save(form)
  } finally {
    submitting.value = false
  }
}
```

Composition API version:
```ts
const isValid = computed(() => !errors.email && !!form.email)
```

### 6. Common Follow-up Questions
- Client validation vs server validation responsibilities?
- How do you prevent duplicate submit requests?
- Where should form normalization happen?

### 7. Common Mistakes
- One `ref` per field in very large forms without structure.
- Validating everything on every keypress.
- Storing temporary form drafts globally without need.

### 8. Performance / Best Practices
- Split very large forms into logical sections.
- Prefer field-level updates over deep watchers.
- Cancel stale async validations.

### 9. When NOT to use this
- For tiny forms, heavy validation frameworks can be unnecessary overhead.
