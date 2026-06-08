# VUE MODULE 7: COMPONENT LIFECYCLE

---

## 1. The Lifecycle Phases
A component goes through **Creation → Mounting → Updating → Unmounting**. Vue calls hooks at each stage so you can run code at the right moment.

```
 CREATE        beforeCreate → (state init) → created
   │
 MOUNT         beforeMount → (render → real DOM) → mounted
   │
 UPDATE (loop) beforeUpdate → (re-render/patch) → updated   (on reactive change)
   │
 UNMOUNT       beforeUnmount → (teardown) → unmounted
```

---

## 2. Options API Hooks
| Hook | When | Use for |
|------|------|---------|
| `beforeCreate` | Before reactivity/events set up | (rarely used) |
| `created` | State ready, **no DOM yet** | Fetch data, init logic |
| `beforeMount` | Before first DOM insert | (rare) |
| `mounted` | DOM exists | DOM access, 3rd-party libs, listeners |
| `beforeUpdate` | After state change, before re-patch | Read old DOM |
| `updated` | After DOM patched | DOM-dependent post-update work (careful: can loop) |
| `beforeUnmount` | Before teardown | Cleanup (timers, listeners) |
| `unmounted` | After removal | Final cleanup |
+ `errorCaptured`, `activated`/`deactivated` (KeepAlive), `renderTracked`/`renderTriggered` (debug).

---

## 3. Composition API Hooks
Registered **inside `setup`** with `onX`. `setup` itself replaces `beforeCreate`/`created` (runs even earlier).
```js
import { onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onBeforeUnmount } from 'vue'
setup() {
  // ≈ created code runs here directly
  onMounted(() => { /* DOM ready */ })
  onUpdated(() => {})
  onBeforeUnmount(() => { /* cleanup */ })
}
```
| Options | Composition |
|---------|-------------|
| beforeCreate / created | **(code in `setup` itself)** |
| beforeMount | `onBeforeMount` |
| mounted | `onMounted` |
| beforeUpdate | `onBeforeUpdate` |
| updated | `onUpdated` |
| beforeUnmount | `onBeforeUnmount` |
| unmounted | `onUnmounted` |
| activated/deactivated | `onActivated`/`onDeactivated` |
| errorCaptured | `onErrorCaptured` |

---

## 4. Exact Execution Order

**Single component mount:**
```
setup() → beforeCreate → created → beforeMount → render → mounted
```

**Parent + Child mount (interview favorite):**
```
Parent setup/beforeCreate/created
Parent beforeMount
   Child setup/beforeCreate/created
   Child beforeMount
   Child mounted          ← children mount BEFORE parent
Parent mounted            ← parent mounts AFTER children
```
**Rule:** Mounting goes **parent-before-mount → children fully mount → parent mounted** (children `mounted` fire before parent's). Updating/unmounting similar nesting.

**Update:**
```
state change → (parent) beforeUpdate → (child) beforeUpdate → child updated → parent updated
```

**Unmount:**
```
parent beforeUnmount → child beforeUnmount → child unmounted → parent unmounted
```

---

## 5. Where to Do What
| Task | Hook |
|------|------|
| Fetch initial data | `setup`/`created` (or `onMounted` if needs DOM/SSR-safe) |
| Access/measure DOM, mount charts/maps | `onMounted` |
| Add global listeners / timers | `onMounted` |
| Remove listeners / clear timers | `onBeforeUnmount` / `onUnmounted` |
| Integrate non-Vue libs | `onMounted` (init) + `onUnmounted` (destroy) |
**SSR note:** `mounted`/`onMounted` runs **only on client** (no DOM on server) — put browser-only code there.

---

## 6. Best Practices / Mistakes / Performance
**Best practices:** Pair every setup with teardown (listener/timer/observer); fetch in `created`/`setup` (earlier, SSR-friendly) unless DOM needed; keep `updated` cheap.
**Common mistakes:**
- Forgetting cleanup in `onUnmounted` → **memory leaks** (listeners, intervals, observers, websocket).
- Mutating state in `updated` → infinite update loop.
- Expecting DOM in `created` (it doesn't exist yet).
- Heavy work in `beforeUpdate`/`updated` every render.
**Performance:** Minimize work in update hooks; debounce expensive `updated` logic; use `watch` for specific reactions instead of broad `updated`.

---

## 7. Production Example (cleanup pattern)
```js
setup() {
  let timer
  const onResize = () => {/*...*/}
  onMounted(() => {
    timer = setInterval(poll, 5000)
    window.addEventListener('resize', onResize)
    chart = initChart(el.value)
  })
  onBeforeUnmount(() => {
    clearInterval(timer)
    window.removeEventListener('resize', onResize)
    chart?.destroy()
  })
}
```

---

## INTERVIEW QUESTIONS
**🟢:** Name the lifecycle hooks in order. · created vs mounted? · Composition equivalents?
**🟡:** Where to fetch data / where to access DOM? · Why no DOM in created? · How does setup map to created/beforeCreate?
**🔴:** Parent/child mount + update + unmount order (children mount first). · Why does mutating state in updated loop? · SSR + onMounted behavior. · activated/deactivated with KeepAlive.
**🧩:** Memory leak after navigating away — missing onUnmounted cleanup. · Chart renders blank — initialized in created (no DOM) → move to mounted. · Infinite re-render — state change in updated. · Need to know when child finished mounting (order).

## ⚡ REVISION
- create → mount → update → unmount; `setup` replaces beforeCreate/created.
- Children mount BEFORE parent's `mounted`.
- DOM available from `onMounted` (client-only in SSR).
- Always clean up in `onBeforeUnmount`/`onUnmounted` (avoid leaks).
- Never mutate state in `updated` (loop).

➡️ Next: **Module 8 — Advanced Reactivity.**
