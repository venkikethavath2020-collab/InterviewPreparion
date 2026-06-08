# VUE MODULE 18: TESTING

---

## 1. Testing Pyramid (Vue context)
```
      E2E (Cypress/Playwright) — full app in browser
    Component/Integration (Vue Test Utils + Vitest)
  Unit (composables, utils, stores) — pure functions
```
Many unit (fast), some component, few E2E.

---

## 2. Vitest vs Jest
| | Vitest | Jest |
|---|--------|------|
| Speed | Very fast (Vite, ESM) | Slower (needs Babel/transform) |
| Config | Reuses vite.config | Separate setup |
| ESM/TS | Native | Extra config |
| API | Jest-compatible (`describe/it/expect`) | Standard |
| Vue 3 | **Recommended** | Works (more setup) |
**Recommendation:** **Vitest** for Vue 3 (shares Vite config, instant, ESM-native). Jest is fine for legacy.

---

## 3. Vue Test Utils (VTU)
**Definition:** Official library to mount components and assert on rendered output/behavior.
```js
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

test('increments', async () => {
  const wrapper = mount(Counter, { props: { start: 5 } })
  expect(wrapper.text()).toContain('5')
  await wrapper.find('button').trigger('click')   // await for DOM update
  expect(wrapper.text()).toContain('6')
})
```
- `mount` (full render) vs `shallowMount` (stub children).
- Key APIs: `find`, `findAll`, `get`, `trigger`, `setValue`, `props`, `emitted`, `html`, `text`, `setProps`.
- **`await`** interactions (Vue updates async — DOM reflects after a tick).

---

## 4. Component Testing Patterns
```js
// props & rendering
mount(Comp, { props: { title: 'Hi' } })
// events
await wrapper.find('button').trigger('click')
expect(wrapper.emitted('save')).toBeTruthy()
expect(wrapper.emitted('save')[0]).toEqual([payload])
// v-model / inputs
await wrapper.find('input').setValue('text')
// slots
mount(Comp, { slots: { default: 'content', header: '<h1>H</h1>' } })
// stubs & global plugins
mount(Comp, { global: { plugins: [pinia, router], stubs: { ChildHeavy: true } } })
```
**Best practice:** test **behavior/output**, not internals; query by **role/text** (Testing Library style) over CSS classes for resilient tests.

---

## 5. Testing Composables
```js
// pure composable — call directly
const { count, inc } = useCounter()
inc(); expect(count.value).toBe(1)
// lifecycle composable — mount a host component
function withSetup(composable) {
  let result
  const app = mount({ setup() { result = composable(); return () => {} } })
  return [result, app]
}
```

## 6. Testing Pinia Stores
```js
import { setActivePinia, createPinia } from 'pinia'
beforeEach(() => setActivePinia(createPinia()))
test('login', async () => {
  const store = useAuth()
  await store.login(creds)
  expect(store.isLoggedIn).toBe(true)
})
// in component tests:
mount(Comp, { global: { plugins: [createTestingPinia({ initialState: {...} })] } })
```
`@pinia/testing` `createTestingPinia` stubs actions by default → assert dispatched actions.

---

## 7. Integration & E2E
- **Integration:** mount a feature (component + store + router) together; mock API (MSW).
- **E2E (Cypress/Playwright):** drive the real app in a browser — login flows, critical paths. Slowest; use for high-value journeys.
- **MSW (Mock Service Worker):** intercept network at the boundary → realistic API mocking for component/integration tests.

---

## 8. Mocking
- **Modules:** `vi.mock('./api')`.
- **Functions/spies:** `vi.fn()`, `vi.spyOn()`.
- **Timers:** `vi.useFakeTimers()` + `vi.advanceTimersByTime()`.
- **Network:** MSW (preferred) or mock the service layer.
- **Router/Pinia:** inject test instances via `global.plugins`.

---

## 9. Best Practices / Mistakes
**Best practices:** test behavior not implementation; query by text/role; `await` interactions; mock at boundaries (API); reset Pinia per test; cover edge/error paths; keep unit tests fast.
**Mistakes:** asserting internal state/methods; not awaiting DOM updates; over-mocking (tests pass, app breaks); brittle CSS-class selectors; testing framework internals; shared state between tests.

---

## INTERVIEW QUESTIONS
**🟢:** Vitest vs Jest? · What is Vue Test Utils? · mount vs shallowMount?
**🟡:** How to test props/events/v-model/slots? · Why await trigger? · How to test a composable / Pinia store?
**🔴:** Behavior vs implementation testing; resilient queries. · Mock API with MSW vs mocking service. · createTestingPinia action stubbing. · Integration vs E2E strategy.
**🧩:** Test fails intermittently — missing await / shared state. · Test passes but prod breaks — missing integration/MSW. · Test a debounced search composable (fake timers). · Test auth-guarded route flow (router + pinia).

## ⚡ REVISION
- Vitest (Vue 3 default) + Vue Test Utils; mount/shallowMount; await interactions.
- Assert text/emitted/props; query by role/text (not classes); test behavior.
- Composables: call pure ones, mount host for lifecycle; Pinia: setActivePinia / createTestingPinia.
- Mock API at boundary (MSW); reset state per test; E2E for critical journeys.

➡️ Next: **Module 19 — SSR & Nuxt.**
