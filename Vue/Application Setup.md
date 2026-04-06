# Vue Application Setup - Interview Questions

## Question 1
### 1. Question
How do you bootstrap a Vue 3 application, and what belongs in `main.ts` versus feature modules?

### 2. Why this question is asked in interviews
Interviewers test whether you can design startup code that stays maintainable as the app scales, instead of turning `main.ts` into a dumping ground.

### 3. Short Answer (for quick revision)
Vue 3 bootstraps with `createApp(App)`. `main.ts` should register app-wide plugins (`router`, `pinia`), global directives/components only when truly shared, and then `mount('#app')`. Keep domain logic out of bootstrap. Treat app initialization as composition root.

### 4. Detailed Explanation
- Core concept:
  - `createApp` creates an isolated app instance with its own config and plugin container.
- How it works internally:
  - Vue creates a root component instance, sets up effect scope, then renderer patches into target DOM on `mount`.
- Reactivity / rendering impact:
  - Heavy global registration increases startup work and memory.
- Vue 2 vs Vue 3 differences:
  - Vue 2 used `new Vue(...)`; Vue 3 uses app instance APIs (`app.use`, `app.component`, `app.directive`).
- Real project usage:
  - Keep `main.ts` thin and move setup to dedicated files (`plugins/router.ts`, `plugins/pinia.ts`, `plugins/i18n.ts`).

### 5. Code Examples
Basic example:
```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

Real-world example:
```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

Composition API version (plugin access in composable):
```ts
import { getCurrentInstance } from 'vue'

export function useAppConfig() {
  const vm = getCurrentInstance()
  return vm?.appContext.config
}
```

### 6. Common Follow-up Questions
- When should a component be global vs locally imported?
- How do you structure plugin initialization for enterprise apps?
- Why can multiple Vue apps coexist on one page in Vue 3?

### 7. Common Mistakes
- Registering feature-only components globally.
- Putting API/business logic in `main.ts`.
- Relying on `globalProperties` for everything instead of composables.

### 8. Performance / Best Practices
- Keep bootstrap synchronous work minimal.
- Prefer route-level and component-level code splitting.
- Register only truly cross-cutting plugins globally.

### 9. When NOT to use this
- Do not use `globalProperties` as a dependency-injection replacement for all services.

---

## Question 2
### 1. Question
Why is `create-vue` + Vite the default setup for modern Vue 3 projects?

### 2. Why this question is asked in interviews
Interviewers want to see if you understand build-system trade-offs and developer-experience impact in large teams.

### 3. Short Answer (for quick revision)
`create-vue` scaffolds opinionated Vue 3 projects with optional Router, Pinia, TypeScript, and testing setup. It uses Vite, which serves native ESM in dev and bundles for production. Result: faster startup, better HMR, and simpler configuration.

### 4. Detailed Explanation
- Core concept:
  - Scaffolding tool + modern dev server/bundler.
- How it works internally:
  - Dev: Vite transforms modules on demand.
  - Build: Rollup creates optimized production chunks.
- Reactivity / rendering impact:
  - Faster HMR shortens feedback loop and reduces rendering-debug friction.
- Vue 2 vs Vue 3 differences:
  - Vue CLI/Webpack was default before; Vue 3 ecosystem centers on Vite.
- Real project usage:
  - Add strict linting, Vitest, and E2E from day one to reduce regressions.

### 5. Code Examples
Basic example:
```bash
npm create vue@latest
npm run dev
```

Real-world example:
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': '/src' } }
})
```

Composition API version:
```vue
<script setup lang="ts">
import { ref } from 'vue'
const ready = ref(true)
</script>
```

### 6. Common Follow-up Questions
- How does Vite HMR differ from Webpack HMR?
- What is tree-shaking and how does it help bundle size?
- How do mode-specific `.env` files work in Vite?

### 7. Common Mistakes
- Expecting non-`VITE_` env vars in browser code.
- Disabling sourcemaps and linting too early.
- Over-customizing build config before measuring.

### 8. Performance / Best Practices
- Use dynamic imports for route/component splitting.
- Audit bundle size and remove unused dependencies.
- Keep aliases and tsconfig paths consistent.

### 9. When NOT to use this
- For legacy mono-repos tightly coupled to older build pipelines, migrate incrementally.
