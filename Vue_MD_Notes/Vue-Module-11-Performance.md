# VUE MODULE 11: PERFORMANCE OPTIMIZATION

---

## 1. How Vue Optimizes Rendering (Overview)
Vue is fast by default because of:
1. **Fine-grained reactivity** — only components whose deps changed re-render.
2. **Compiler-informed virtual DOM** — patch flags + static hoisting skip static content.
3. **Async batched updates** — many state changes → one DOM update per tick.
4. **Block tree** — diff only tracks dynamic nodes, not the whole tree.

---

## 2. Virtual DOM Diffing & Patch Algorithm
**On re-render:** new VNode tree vs old → `patch()` reconciles.
- **Same type** → patch props + recurse children.
- **Different type** → unmount old, mount new.
- **Children diff:** For keyed lists, Vue uses an optimized algorithm:
  - Sync from **start** and **end** (common prefixes/suffixes).
  - For the middle, build a **key→index map**, compute the **Longest Increasing Subsequence (LIS)** to **minimize DOM moves**.
```
old: [A B C D E]   new: [A C D B E]
→ A,E match ends; middle [B C D] vs [C D B]
→ LIS keeps C,D in place, moves only B  (minimal moves)
```
**Why keys matter:** stable keys let this map work; index keys break it on reorder (state attaches to wrong node).

---

## 3. Compiler Optimizations (Vue 3's edge)
- **Static hoisting:** static VNodes hoisted out of render → created once, reused.
- **Patch flags:** each dynamic VNode tagged with what can change (`TEXT`, `CLASS`, `PROPS`…) → diff only checks those.
- **Block tree / `openBlock`:** a "block" collects only its **dynamic** descendants into a flat array → diff skips static structure entirely.
- **`cacheHandlers`:** inline handlers cached so they don't cause re-renders.
- **`v-once`:** render subtree once, never diff again.
- **`v-memo="[deps]"`:** skip re-render of a subtree unless deps change (great for huge lists).

---

## 4. Key Usage
```vue
<li v-for="item in items" :key="item.id">   <!-- ✅ stable unique -->
```
- Unique + stable id → correct reuse + minimal moves.
- ❌ `:key="index"` for reorderable/filterable lists → state bugs + worse diff.
- No key → Vue uses in-place patch (fine only for static, never-reordered lists).

---

## 5. Lazy Loading & Async Components
- **Route-level:** `() => import('./View.vue')`.
- **Component-level:** `defineAsyncComponent(() => import('./Heavy.vue'))`.
- Defer heavy/below-the-fold components (charts, editors, modals).

## 6. Code Splitting & Tree Shaking
- **Code splitting:** dynamic imports → separate chunks loaded on demand (Vite/Rollup).
- **Tree shaking:** Vue 3 is modular (ESM) → unused APIs dropped from bundle. Import only what you use; avoid side-effectful barrels.
- **Bundle analysis:** `rollup-plugin-visualizer` to find bloat; lazy-load offenders.

---

## 7. Memoization
- **`computed`** — cache derived values (don't recompute in template/methods).
- **`v-memo`** — memoize template subtrees by dependency array.
- **`shallowRef`/`shallowReactive`/`markRaw`** — avoid deep reactivity overhead on large data.
- **`KeepAlive`** — cache component instances (avoid re-mount cost) for tabs/wizards.

---

## 8. Common Performance Techniques (Production Checklist)
| Technique | Fixes |
|-----------|-------|
| Stable `:key` | Correct & fast list diff |
| `v-show` vs `v-if` | Frequent toggles |
| `computed` over methods/inline | Cache derivations |
| `v-once` / `v-memo` | Static / huge lists |
| Lazy routes + async components | Initial bundle size |
| **Virtual scrolling** (vue-virtual-scroller) | Huge lists (render only visible) |
| `shallowRef`/`markRaw` | Large/external objects |
| Debounce/throttle inputs (customRef/VueUse) | Excessive updates |
| `KeepAlive` | Re-mount cost |
| Avoid heavy work in `updated`/render | Jank |
| Pagination / windowing | Large datasets |
| Defer non-critical (`<Suspense>`, idle) | TTI |

---

## 9. Diagnosing Performance
- **Vue DevTools** → component render timings, why re-rendered.
- **`onRenderTracked` / `onRenderTriggered`** → which dep caused a render.
- **Chrome Performance panel** → flame charts, long tasks.
- **Bundle visualizer** → chunk sizes.
- **Lighthouse / Web Vitals** (LCP, CLS, INP).

---

## 10. Production Use Cases (large companies)
- **Data grids/trading dashboards:** `shallowRef` + `markRaw` for streaming data, virtual scrolling, `v-memo` per row, throttled updates.
- **E-commerce:** route-based code splitting, image lazy-load, SSR/SSG for SEO+LCP.
- **Admin/CMS:** lazy feature modules, KeepAlive tabs, computed-heavy tables.

---

## INTERVIEW QUESTIONS

### 🟢 Basic

**Q1. Why are keys important in Vue lists?**  
Answer: Keys give Vue a stable identity for each item, so it can reuse and move DOM nodes correctly.  
Interview line: Use unique, stable ids; avoid index keys when lists can reorder, filter, insert, or delete.

**Q2. `v-if` vs `v-show`: which is better for performance?**  
Answer: `v-if` mounts/unmounts elements, while `v-show` keeps the element mounted and toggles CSS display.  
Interview line: Use `v-if` for rarely shown content and `v-show` for frequently toggled UI like tabs/dropdowns.

**Q3. Why is `computed` usually better than a method for derived template data?**  
Answer: `computed` values are cached based on reactive dependencies, while methods run again on every render.  
Interview line: Use `computed` for expensive or repeated derived values; use methods for actions or non-cached logic.

**Q4. What is lazy loading in Vue?**  
Answer: Lazy loading delays downloading code until it is actually needed, usually with dynamic imports.  
Interview line: Use route-level or async component lazy loading to reduce the initial bundle and improve first load.

### 🟡 Intermediate

**Q5. How does Vue's diff algorithm minimize DOM operations?**  
Answer: Vue compares old and new VNodes, uses keys to match nodes, and computes the LIS to reduce moves in keyed lists.  
Interview line: Stable keys let Vue keep unchanged nodes in place and move only the minimum required elements.

**Q6. What are patch flags and static hoisting?**  
Answer: Patch flags tell Vue exactly what part of a node is dynamic, and static hoisting reuses static VNodes across renders.  
Interview line: These compiler optimizations let Vue skip unnecessary checks and focus diffing only on dynamic content.

**Q7. What is the difference between `v-once` and `v-memo`?**  
Answer: `v-once` renders a subtree once forever, while `v-memo` skips re-rendering until its dependency array changes.  
Interview line: Use `v-once` for permanently static content and `v-memo` for large subtrees that change only by specific deps.

**Q8. When should you use `shallowRef`, `shallowReactive`, or `markRaw`?**  
Answer: Use them when large objects, external libraries, or immutable data should not be deeply reactive.  
Interview line: They reduce proxy overhead for big datasets, chart instances, maps, editors, and streaming records.

### 🔴 Advanced

**Q9. What is Vue's block tree and how does it speed up rendering?**  
Answer: A block tracks only dynamic child nodes inside a subtree, so Vue can skip static structure during patching.  
Interview line: Instead of diffing every node, Vue jumps directly to dynamic nodes collected by the compiler.

**Q10. How does Vue batch updates?**  
Answer: Vue queues reactive state changes and flushes DOM updates asynchronously on the next tick.  
Interview line: Multiple state mutations in the same tick produce one render cycle, reducing duplicate DOM work.

**Q11. How would you optimize a 10k-row table in Vue?**  
Answer: Use virtual scrolling, stable row keys, `v-memo` for rows, computed filtering, and shallow data refs.  
Interview line: Render only visible rows, avoid deep reactivity on huge data, and throttle expensive user interactions.

**Q12. How do tree shaking and bundle analysis help performance?**  
Answer: Tree shaking removes unused ESM exports, and bundle analysis shows which dependencies/chunks are large.  
Interview line: Import only what you need, split heavy features, and inspect bundle reports before optimizing blindly.

### 🧩 Scenario Based

**Q13. A component re-renders too often. How do you diagnose it?**  
Answer: Use Vue DevTools render timings plus `onRenderTracked` and `onRenderTriggered` to find reactive dependencies.  
Interview line: Identify what state triggers the render, then narrow props, use computed/memoization, or split components.

**Q14. The app has a big initial load. What would you do?**  
Answer: Add route-level code splitting, lazy-load heavy components, analyze the bundle, and defer non-critical work.  
Interview line: Optimize the first route first; ship less JavaScript before tuning smaller runtime details.

**Q15. A huge list feels laggy. How do you fix it?**  
Answer: Use virtual scrolling, stable keys, memoized rows, pagination/windowing, and avoid inline expensive calculations.  
Interview line: The biggest win is rendering fewer DOM nodes, then preventing unnecessary row updates.

**Q16. Streaming data causes UI jank. How do you optimize it?**  
Answer: Store large incoming data in `shallowRef`, batch updates, throttle rendering, and update only visible UI regions.  
Interview line: Control update frequency and avoid deep reactivity so real-time data does not overwhelm the main thread.

## ⚡ REVISION
- Fine-grained reactivity + compiler (patch flags, static hoist, block tree) + batched async updates.
- Stable keys → minimal DOM moves (LIS diff).
- computed/v-memo/v-once/KeepAlive = memoization; shallowRef/markRaw = avoid deep reactivity.
- Lazy load routes/components; virtual-scroll huge lists; debounce inputs.

➡️ Next: **Module 12 — Rendering Internals.**
