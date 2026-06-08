# VUE MODULE 15: FORMS & VALIDATION

---

## 1. Form Basics (v-model recap)
```vue
<input v-model="form.email">
<input v-model.number="form.age">
<input v-model.trim="form.name">
<textarea v-model="form.bio"></textarea>
<select v-model="form.country">...</select>
<input type="checkbox" v-model="form.agree">
```
`v-model` = `:value` + `@input`. For components: `modelValue` + `update:modelValue`.

---

## 2. Custom Validation (from scratch)
```vue
<script setup>
const form = reactive({ email: '', password: '' })
const errors = reactive({})
const rules = {
  email: v => /\S+@\S+\.\S+/.test(v) || 'Invalid email',
  password: v => v.length >= 8 || 'Min 8 chars'
}
function validate() {
  Object.keys(rules).forEach(k => {
    const res = rules[k](form[k])
    errors[k] = res === true ? '' : res
  })
  return Object.values(errors).every(e => !e)
}
function submit() { if (validate()) api.save(form) }
</script>
<template>
  <input v-model="form.email"><span>{{ errors.email }}</span>
  <button @click="submit">Submit</button>
</template>
```
Reactive errors + rule functions. Good for simple forms; gets unwieldy at scale → use a library.

---

## 3. VeeValidate (recommended)
**Definition:** Popular validation library; integrates with **Yup/Zod** schemas; handles touched/dirty/errors, async, arrays.
```vue
<script setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required().email(),
  age: yup.number().min(18)
})
const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: email } = useField('email')
const onSubmit = handleSubmit(values => api.save(values))
</script>
<template>
  <form @submit="onSubmit">
    <input v-model="email"><span>{{ errors.email }}</span>
    <button>Submit</button>
  </form>
</template>
```
Or component API: `<Form :validation-schema>`, `<Field>`, `<ErrorMessage>`.

---

## 4. Schema Validation (Zod/Yup)
**Why:** Declarative, reusable, type-safe (Zod infers TS types), shareable with backend.
```js
import { z } from 'zod'
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
  password: z.string().min(8)
})
const result = schema.safeParse(form)   // { success, data | error }
```
Pair with VeeValidate (`@vee-validate/zod`) or validate manually.

---

## 5. Async Validation
**Definition:** Rules requiring a server check (unique email/username). **Debounce** to avoid spamming the API.
```js
const checkEmail = async (value) => {
  const taken = await api.emailExists(value)
  return taken ? 'Email already registered' : true
}
// vee-validate supports async rules directly; debounce the field
```
**Best practice:** debounce (300ms), show pending state, cancel stale requests (AbortController), validate on blur not every keystroke.

---

## 6. Dynamic Forms
**Definition:** Forms generated from a config/schema (add/remove fields, repeatable groups). Used in CMS, surveys, admin builders.
```vue
<script setup>
const fields = ref([{ type: 'text', name: 'title' }, { type: 'number', name: 'qty' }])
const model = reactive({})
</script>
<template>
  <component :is="resolve(f.type)" v-for="f in fields" :key="f.name"
             v-model="model[f.name]" :field="f" />
</template>
```
**Field arrays** (repeatable rows): VeeValidate `useFieldArray`, or manage an array of reactive objects with stable keys.

---

## 7. Production Patterns
- **Schema-driven** validation (Zod/Yup) shared across forms + API.
- **Composable wrapper**: `useFormValidation(schema)` returning `{ values, errors, validate, isValid }`.
- **UX:** validate on blur + submit; show errors after touched; disable submit while invalid/pending; preserve scroll to first error.
- **Accessibility:** `aria-invalid`, label association, error announcements.
- **Large forms:** split into steps (wizard) with per-step validation; KeepAlive to preserve state.
- **Server errors:** map API 422 field errors back onto the form.

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** schema validation, debounce async, validate-on-blur, type-safe (Zod), reusable composable, handle server-side errors.
**Mistakes:** validating on every keystroke (jank/API spam), no debounce on async, mutating props in form components, losing reactivity destructuring form state, not resetting form after submit.
**Performance:** debounce/throttle, validate lazily, avoid deep watchers on huge forms, lazy-load heavy field components.

---

## INTERVIEW QUESTIONS
**🟢:** How does v-model work on forms? · v-model modifiers (.number/.trim/.lazy)? · Component v-model?
**🟡:** VeeValidate vs custom validation? · Why schema validation (Zod/Yup)? · How to debounce async validation?
**🔴:** Build a reusable validation composable. · Dynamic/schema-driven forms + field arrays. · Map server 422 errors to fields. · Multi-step wizard with per-step validation + state preservation.
**🧩:** Async unique-email check spams API — debounce + cancel. · Huge form janks on input — lazy validate/throttle. · Dynamic survey builder — config-driven components. · Form state lost between wizard steps — KeepAlive/store.

## ⚡ REVISION
- v-model = value + input; modifiers .number/.trim/.lazy; components use modelValue/update:modelValue.
- Use VeeValidate + Zod/Yup schema (type-safe, reusable).
- Async validation: debounce + cancel + pending state; validate on blur/submit.
- Dynamic forms via config + `<component :is>`; field arrays with stable keys.

➡️ Next: **Module 16 — API Integration.**
