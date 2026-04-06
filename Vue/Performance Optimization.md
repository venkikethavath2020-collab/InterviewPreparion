# Vue Performance Optimization - Interview Questions

## Question 1
### 1. Question
What are the most effective Vue 3 strategies to reduce unnecessary rerenders?

### 2. Why this question is asked in interviews
Interviewers assess whether you can diagnose real bottlenecks in large component trees.

### 3. Short Answer (for quick revision)
Reduce reactive surface area, prefer `computed` over expensive template expressions, use stable keys, and split code via async components/routes. Apply `v-once` and `v-memo` only where measured benefit exists.

### 4. Detailed Explanation
- Core concept:
  - Optimize what updates, when it updates, and how much DOM diffing is needed.
- How it works internally:
  - Vue compiler emits patch flags and hoists static nodes to reduce runtime work.
- Reactivity / rendering impact:
  - Broad dependencies trigger larger effect cascades.
- Vue 2 vs Vue 3 differences:
  - Vue 3 compiler/runtime perform more granular update optimization.
- Real project usage:
  - Dashboard pages with large lists, filters, and charts.

### 5. Code Examples
Basic example:
```vue
<h1 v-once>{{ staticTitle }}</h1>
```

Real-world example:
```vue
<div v-for="item in items" :key="item.id" v-memo="[item.id, item.status]">
  <CardRow :item="item" />
</div>
```

Composition API version:
```ts
const visibleUsers = computed(() => users.value.filter(u => u.active))
```

### 6. Common Follow-up Questions
- `v-once` vs `v-memo`?
- Why is `:key="index"` risky?
- How do patch flags improve performance?

### 7. Common Mistakes
- Deep watchers on large objects.
- Heavy computations in templates.
- Overusing global state for local UI concerns.

### 8. Performance / Best Practices
- Measure first with Vue Devtools and browser profiler.
- Memoize derived data.
- Prefer localized state ownership.

### 9. When NOT to use this
- Avoid premature micro-optimizations before identifying real hotspots.

---

## Question 2
### 1. Question
How do code splitting and async boundaries improve Vue app performance?

### 2. Why this question is asked in interviews
This tests architecture decisions that directly impact first-load and interaction metrics.

### 3. Short Answer (for quick revision)
Use lazy-loaded routes and async components to reduce initial bundle size. Pair with meaningful loading fallbacks (`Suspense`) and caching decisions (`KeepAlive`) based on usage frequency.

### 4. Detailed Explanation
- Core concept:
  - Shift non-critical JS out of initial path.
- How it works internally:
  - Dynamic imports create separate chunks during build.
- Reactivity / rendering impact:
  - Smaller startup work means faster hydration/mount and faster first interaction.
- Vue 2 vs Vue 3 differences:
  - Vue 3 + Vite makes route/component splitting simpler and faster.
- Real project usage:
  - Admin modules loaded only for authorized roles.

### 5. Code Examples
Basic example:
```ts
const ReportsView = defineAsyncComponent(() => import('./ReportsView.vue'))
```

Real-world example:
```ts
const routes = [
  { path: '/analytics', component: () => import('@/views/AnalyticsView.vue') }
]
```

Composition API version:
```vue
<Suspense>
  <ReportsView />
  <template #fallback>Loading report...</template>
</Suspense>
```

### 6. Common Follow-up Questions
- How do you handle loading and error chunk states?
- What is prefetching and when should you use it?
- How do you avoid too many tiny chunks?

### 7. Common Mistakes
- Lazy-loading critical above-the-fold components.
- No fallback/error UX for async chunks.
- Splitting without bundle analysis.

### 8. Performance / Best Practices
- Split by route and feature boundaries.
- Use bundle analyzer in CI.
- Keep fallback skeletons lightweight.

### 9. When NOT to use this
- For tiny apps, aggressive splitting can add overhead without benefit.
