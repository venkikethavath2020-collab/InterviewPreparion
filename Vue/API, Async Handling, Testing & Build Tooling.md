# Vue API, Async Handling, Testing, and Build Tooling - Interview Questions

## Question 1
### 1. Question
How should API calls be structured in Vue 3 applications for maintainability and testability?

### 2. Why this question is asked in interviews
Interviewers evaluate separation of concerns, async reliability, and scalability under production load.

### 3. Short Answer (for quick revision)
Keep API logic in service/composable layers, not inside templates. Components orchestrate UI states (`loading`, `error`, `data`). Use cancellation for in-flight requests, and keep side effects explicit via `watch`/`onMounted`.

### 4. Detailed Explanation
- Core concept:
  - UI and transport concerns should be separate.
- How it works internally:
  - Reactive state changes schedule render updates via Vue effect scheduler.
- Reactivity / rendering impact:
  - Explicit async states prevent flicker and stale render states.
- Vue 2 vs Vue 3 differences:
  - Vue 3 composables make extraction/reuse cleaner than mixins.
- Real project usage:
  - `useUsersQuery`, `useMutation`, retry and caching wrappers.

### 5. Code Examples
Basic example:
```ts
const data = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  data.value = await api.list()
  loading.value = false
})
```

Real-world example:
```ts
export function useUser(id: Ref<string>) {
  const user = ref(null)
  const error = ref<unknown>(null)

  watch(id, async (next, _prev, onCleanup) => {
    const ctrl = new AbortController()
    onCleanup(() => ctrl.abort())
    try {
      user.value = await api.getUser(next, ctrl.signal)
      error.value = null
    } catch (e) {
      error.value = e
    }
  }, { immediate: true })

  return { user, error }
}
```

Composition API version:
```ts
const state = reactive({ loading: false, error: null as unknown })
```

### 6. Common Follow-up Questions
- `onMounted` vs `async setup` for initial fetch?
- How do you prevent stale response overwrite?
- Where do retries and backoff belong?

### 7. Common Mistakes
- API calls directly in render-driven expressions.
- Missing cancellation/cleanup.
- No explicit error state.

### 8. Performance / Best Practices
- Deduplicate requests.
- Cache idempotent GET data.
- Debounce high-frequency query inputs.

### 9. When NOT to use this
- For static compile-time content, avoid runtime fetch entirely.

---

## Question 2
### 1. Question
How do you test Vue 3 apps effectively with Vitest and Vue Test Utils?

### 2. Why this question is asked in interviews
This checks engineering discipline: confidence in refactoring and prevention of regressions.

### 3. Short Answer (for quick revision)
Use unit tests for pure logic/composables, component tests for rendering and emits, and E2E for critical user flows. With Vitest + Vue Test Utils, mock API boundaries and assert behavior, not internal implementation details.

### 4. Detailed Explanation
- Core concept:
  - Test pyramid with fast feedback at lower levels.
- How it works internally:
  - VTU mounts component instances and drives reactive updates in jsdom.
- Reactivity / rendering impact:
  - Await `nextTick`/`flushPromises` to align with scheduler and async queue.
- Vue 2 vs Vue 3 differences:
  - Vue 3 ecosystem uses Vitest naturally with Vite.
- Real project usage:
  - Test emits contracts, loading/error states, route guards, and store interactions.

### 5. Code Examples
Basic example:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

it('emits submit', async () => {
  const wrapper = mount(FormButton)
  await wrapper.get('button').trigger('click')
  expect(wrapper.emitted('submit')).toBeTruthy()
})
```

Real-world example:
```ts
vi.mock('@/services/users', () => ({
  listUsers: vi.fn().mockResolvedValue([{ id: 1, name: 'A' }])
}))
```

Composition API version:
```ts
await flushPromises()
expect(wrapper.text()).toContain('A')
```

### 6. Common Follow-up Questions
- Snapshot tests: when useful vs noisy?
- How do you test composables with lifecycle hooks?
- What should be mocked vs real in component tests?

### 7. Common Mistakes
- Over-mocking everything.
- Asserting private implementation details.
- Forgetting async flush before assertions.

### 8. Performance / Best Practices
- Keep tests deterministic and isolated.
- Prefer behavior-driven assertions.
- Run unit tests in CI on every PR.

### 9. When NOT to use this
- Do not replace all E2E scenarios with unit tests; keep critical flows covered.
