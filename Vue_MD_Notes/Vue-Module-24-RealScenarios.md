# VUE MODULE 24: REAL PROJECT SCENARIOS (Debugging)
> The "why did X happen" questions senior interviewers love. Each: symptom → root causes → debug approach → fix.

---

## 1. Why Did a Component Re-render Unexpectedly?
**Root causes:**
- A reactive dep used in render changed (even indirectly).
- **New object/array identity** passed as prop each render (parent recreates inline object/function) → child sees "changed."
- Missing/index `:key` causing remount.
- Watcher/computed side-effect mutating state used in render.
- Whole reactive object replaced instead of mutating fields.
**Debug:**
```js
import { onRenderTriggered } from 'vue'
onRenderTriggered((e) => console.log('re-render by', e.key, e.type, e.target))
```
+ Vue DevTools "Highlight updates" / component render timings.
**Fix:** pass stable references (hoist objects/handlers, `computed`), correct keys, memoize subtrees (`v-memo`), mutate fields not whole objects, narrow reactive scope.

---

## 2. Why Did `watch` Trigger Multiple Times?
**Root causes:**
- **`deep: true`** on a large object → fires on any nested change.
- Watching a **source that gets a new identity** each render (inline object/array).
- **Multiple sources** array → fires when any changes.
- Watcher itself mutates the watched source → re-trigger.
- Component re-created (remount) re-registers watcher.
**Debug:** log old/new values; check if source is a getter vs object; check `flush` timing.
**Fix:** watch a **specific primitive/getter** (`watch(() => obj.id, ...)`) instead of the whole object; avoid `deep` unless needed; ensure stable source; use `watchEffect` only with intended deps; debounce.

---

## 3. Why Is `computed` Not Updating?
**Root causes:**
- Getter doesn't **read a reactive source** (reads a plain variable / destructured value → no track).
- Depends on a **non-reactive** value (raw object, prop destructured without toRefs).
- **Side-effects** / async inside computed (computeds must be pure & sync).
- Mutating a reactive array/object in a way Vue can't track (rare in Vue 3) or replacing the reference incorrectly.
**Debug:** log inside getter; verify each dep is reactive (ref/reactive/prop via toRefs); check it's not async.
**Fix:** ensure deps are reactive; use `toRefs`/`storeToRefs`; move async/side-effects to `watch`; return derived value purely.

---

## 4. Why Was an API Called Multiple Times?
**Root causes:**
- `watch`/`watchEffect` re-firing (deep/identity issues — see #2).
- Component **mounted multiple times** (route reuse, list without keys, KeepAlive misuse).
- **No request dedup** — multiple components fetch same data.
- `immediate: true` watcher + initial render both fetch.
- Reactive dep in fetch effect changes spuriously.
**Debug:** log fetch calls with stack/trace; Network tab; check watcher source; check mount count.
**Fix:** dedup/cache (TanStack Query), centralize fetch in store/composable, cancel stale (AbortController), watch specific source, guard with loading flag.

---

## 5. Why Was Pinia State Lost After Refresh?
**Root cause:** Pinia state lives **in memory** → a full page refresh reinitializes the app → state resets. (SPAs lose all JS memory on reload.)
**Fix:**
- **Persistence plugin** (`pinia-plugin-persistedstate`) → localStorage/sessionStorage.
- Rehydrate from storage on init; or refetch from server on load.
- For auth: keep refresh token in **httpOnly cookie**, re-fetch user on app start (`/me`).
```js
pinia.use(piniaPluginPersistedstate)
defineStore('cart', { state: ..., persist: true })
```
**Caveat:** don't persist sensitive data in localStorage; persist selectively.

---

## 6. Why Do Memory Leaks Happen?
**Root causes:**
- **Event listeners** added (window/document/3rd-party) but not removed in `onUnmounted`.
- **Timers/intervals** not cleared.
- **Watchers/effects** created outside component scope (no auto-dispose) → use `effectScope`.
- **WebSocket/subscriptions** not closed.
- **Global event bus** listeners never off.
- Detached DOM held by closures; large data in module-scope refs.
- Pinia subscriptions / store references retained.
**Debug:** Chrome DevTools **Memory** → heap snapshots over navigation; detached DOM nodes; growing listener counts.
**Fix:** pair every add with cleanup in `onBeforeUnmount`/`onUnmounted`; use `effectScope` for manual effects; close sockets; remove bus listeners; VueUse auto-cleanup composables (`useEventListener`).
```js
onMounted(() => window.addEventListener('resize', fn))
onUnmounted(() => window.removeEventListener('resize', fn))  // ✅
```

---

## 7. Bonus Scenarios
- **Reactivity lost after destructuring props/store** → `toRefs(props)` / `storeToRefs(store)`.
- **List inputs show wrong values after reorder** → using `index` as key; use stable id.
- **Tab/form state lost on switch** → wrap in `<KeepAlive>`.
- **`window is not defined` in SSR** → move browser code to `onMounted` / `import.meta.client`.
- **Hydration mismatch warning** → non-deterministic render (`Date.now`, random, locale) — make deterministic or client-only.
- **Modal clipped by parent overflow** → `<Teleport to="body">`.
- **Stale data flashes (race)** → cancel previous request on new input.

---

## General Debugging Methodology
```
1. Reproduce reliably (minimal case)
2. Vue DevTools: inspect component state, props, render timings, events, Pinia
3. onRenderTracked/Triggered → what caused render
4. Network tab → duplicate/racing requests
5. Memory snapshots → leaks
6. Console-log reactive sources / add temporary watchers
7. Bisect: remove parts until symptom disappears
8. Verify fix + add a regression test
```

---

## INTERVIEW QUESTIONS
**🧩 (all scenario-based — the point of this module):**
- Component re-renders too often — walk your diagnosis.
- watch fires 3× per change — why + fix.
- computed shows stale value — causes.
- Same API hit 5 times on load — debug.
- User loses cart on refresh — explain + fix.
- App memory climbs over navigation — find the leak.
- Destructured store value won't update — why.
- Reordered list keeps wrong input text — key bug.

## ⚡ REVISION
- Re-render: stable prop identity, keys, narrow reactive scope, onRenderTriggered.
- watch ×N: specific getter source, avoid deep, stable identity.
- computed stale: must read reactive deps, be pure/sync, toRefs.
- API ×N: dedup/cache/cancel, watch specific source, mount count.
- Pinia lost on refresh: in-memory → persist plugin / refetch.
- Leaks: always clean up listeners/timers/watchers/sockets (onUnmounted/effectScope).

➡️ Next: **Module 25 — Revision Sheets.**
