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
**🟢:** Why are keys important? · v-if vs v-show for perf? · computed vs method (caching)? · What is lazy loading?
**🟡:** How does Vue's diff minimize DOM ops (LIS)? · What are patch flags / static hoisting? · v-once vs v-memo? · When shallowRef/markRaw?
**🔴:** Explain block tree & how it speeds diffing. · How does Vue batch updates? · Optimize a 10k-row table (virtual scroll + v-memo + shallowRef). · Tree shaking & bundle analysis.
**🧩:** Component re-renders too often — diagnose (DevTools, renderTriggered) (see Module 24). · Big initial load — code split + lazy. · Laggy huge list — virtualize + memo. · Streaming data janks UI — shallowRef + throttle.

## ⚡ REVISION
- Fine-grained reactivity + compiler (patch flags, static hoist, block tree) + batched async updates.
- Stable keys → minimal DOM moves (LIS diff).
- computed/v-memo/v-once/KeepAlive = memoization; shallowRef/markRaw = avoid deep reactivity.
- Lazy load routes/components; virtual-scroll huge lists; debounce inputs.

➡️ Next: **Module 12 — Rendering Internals.**
