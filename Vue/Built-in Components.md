# Vue Built-in Components - Interview Questions

## Question 1
### 1. Question
What problem does `<Teleport>` solve, and what does it not solve?

### 2. Why this question is asked in interviews
Interviewers test whether you understand DOM placement vs component ownership.

### 3. Short Answer (for quick revision)
`<Teleport>` renders part of a component template into another DOM target (for modals, drawers, tooltips). It fixes stacking and overflow constraints, but component state and reactivity still belong to the original component tree.

### 4. Detailed Explanation
- Core concept:
  - Decouple logical component tree from physical DOM placement.
- How it works internally:
  - Renderer mounts teleported VNodes into target while preserving parent effect scope.
- Reactivity / rendering impact:
  - No reactivity penalty by itself; updates still tracked in source component.
- Vue 2 vs Vue 3 differences:
  - Teleport is native in Vue 3; Vue 2 relied on portal libraries.
- Real project usage:
  - Global modal roots, command palettes, contextual overlays.

### 5. Code Examples
Basic example:
```vue
<Teleport to="body">
  <div class="modal">Confirm delete?</div>
</Teleport>
```

Real-world example:
```vue
<Teleport to="#overlay-root">
  <Modal v-if="open" @close="open = false" />
</Teleport>
```

Composition API version:
```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
```

### 6. Common Follow-up Questions
- Does Teleport break provide/inject?
- Can you disable Teleport conditionally?
- How do you manage focus trapping in modals?

### 7. Common Mistakes
- Using Teleport for general layout composition.
- Ignoring accessibility (`aria-modal`, focus return).
- Assuming teleported nodes are outside component lifecycle.

### 8. Performance / Best Practices
- Use one stable teleport target.
- Keep overlay mounts lazy.
- Centralize modal stack management.

### 9. When NOT to use this
- Do not use Teleport for ordinary in-flow content.

---

## Question 2
### 1. Question
How do `<Suspense>` and `<KeepAlive>` help performance and UX in complex Vue apps?

### 2. Why this question is asked in interviews
This checks async orchestration and caching decisions under real product constraints.

### 3. Short Answer (for quick revision)
`<Suspense>` coordinates async dependencies with fallback UI. `<KeepAlive>` caches inactive component instances to preserve state between switches. Together they improve perceived performance but can increase memory usage if unmanaged.

### 4. Detailed Explanation
- Core concept:
  - Suspense handles loading boundaries.
  - KeepAlive handles instance lifecycle caching.
- How it works internally:
  - Suspense blocks subtree resolution until async deps settle.
  - KeepAlive stores component instances and toggles activation hooks.
- Reactivity / rendering impact:
  - Fewer remounts with KeepAlive; fewer loading flickers with Suspense.
- Vue 2 vs Vue 3 differences:
  - KeepAlive existed in Vue 2; Suspense is formalized in Vue 3.
- Real project usage:
  - Multi-tab dashboards, expensive form routes, analytics pages.

### 5. Code Examples
Basic example:
```vue
<Suspense>
  <AsyncPanel />
  <template #fallback>Loading...</template>
</Suspense>
```

Real-world example:
```vue
<KeepAlive include="UsersView,ReportsView">
  <component :is="activeView" />
</KeepAlive>
```

Composition API version:
```ts
onActivated(() => refreshIfStale())
onDeactivated(() => pausePolling())
```

### 6. Common Follow-up Questions
- `onMounted` vs `onActivated`?
- How do `include` and `exclude` control cache scope?
- What are memory risks of KeepAlive?

### 7. Common Mistakes
- Caching every route by default.
- Ignoring stale data after reactivation.
- Treating Suspense as replacement for error handling.

### 8. Performance / Best Practices
- Cache only high-cost views.
- Define explicit staleness/revalidation policy.
- Keep fallback UI lightweight and deterministic.

### 9. When NOT to use this
- Avoid KeepAlive for rarely visited heavy pages with large in-memory state.
