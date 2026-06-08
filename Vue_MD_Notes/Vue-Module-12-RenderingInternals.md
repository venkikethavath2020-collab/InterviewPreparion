# VUE MODULE 12: VUE RENDERING INTERNALS

---

## 1. The Full Pipeline
```
Template ──compile──► AST ──transform──► Optimized AST ──codegen──► Render Function
                                                                       │ run
                                                                       ▼
                                                                   VNode tree
                                                                       │ patch (mount/diff)
                                                                       ▼
                                                                   Real DOM
```
**Two stages:** **Compile-time** (template → render fn, done at build for SFCs) and **Runtime** (render fn → VNodes → DOM, reactive re-renders).

---

## 2. Template Compilation
1. **Parse:** template string → **AST** (tree of element/text/directive nodes).
2. **Transform:** apply optimizations — mark static nodes (hoisting), attach **patch flags** to dynamic nodes, create **blocks**, resolve directives.
3. **Generate (codegen):** emit a `render()` function string using runtime helpers (`createElementVNode`, `toDisplayString`, `openBlock`, `createBlock`).
```js
// <div class="a">{{ msg }}</div> roughly compiles to:
function render(_ctx) {
  return (openBlock(), createElementBlock('div', { class: 'a' },
    toDisplayString(_ctx.msg), 1 /* TEXT patch flag */))
}
```

---

## 3. Render Functions
**Definition:** A function returning VNodes — what templates compile to; you can also write them directly for dynamic/programmatic rendering.
```js
import { h } from 'vue'
export default {
  setup() {
    return () => h('div', { class: 'box' }, [h('span', count.value)])
  }
}
```
`h(type, props, children)` = hyperscript = `createVNode`. Use render functions when logic is too dynamic for templates (e.g., a component that renders an arbitrary level/tag).

---

## 4. JSX
**Definition:** Optional syntax (via `@vitejs/plugin-vue-jsx`) for render functions — JSX compiles to `h()` calls.
```jsx
setup() {
  return () => <div class="box">{count.value}</div>
}
```
Use when you want JS expressiveness in markup (rare in Vue; templates are idiomatic + more optimizable since the compiler can analyze them better than JSX).

---

## 5. VNode (Virtual Node)
**Definition:** A plain JS object describing a DOM node (or component).
```js
{
  type: 'div' | Component,      // tag or component
  props: { id, class, onClick },
  children: [...] | 'text',
  key, ref,
  shapeFlag,                    // bitflag: element? component? text? children type?
  patchFlag,                    // what's dynamic (compiler hint)
  el                            // linked real DOM node (after mount)
}
```
- **shapeFlag:** classifies the VNode (element/component/text/...) for fast branching in patch.
- **patchFlag:** compiler-set hint of dynamic parts → diff fast path.

---

## 6. Patch Process (Mount & Update)
**Mount (no old VNode):** create real DOM from VNode recursively, insert, run mounted hooks.
**Update (old + new VNode):**
```
patch(n1, n2):
  if n1.type !== n2.type → unmount n1, mount n2
  else:
    - patchProps (using patchFlag to check only dynamic props)
    - patchChildren:
        text vs text → set text
        array vs array → keyed diff (LIS)
        handle add/remove/move
```

---

## 7. Diffing Algorithm (Keyed Children)
```
1. Sync from START while keys match (patch in place)
2. Sync from END while keys match
3. If only additions remain → mount new nodes
4. If only removals remain → unmount
5. Else (unknown middle):
   - build key → newIndex map
   - walk old middle, patch matched / unmount unmatched
   - compute Longest Increasing Subsequence of newIndexes
   - nodes in LIS stay; others are MOVED (minimal DOM moves)
```
This is why **stable keys** are essential and why Vue's list updates are efficient.

---

## 8. Block Tree (Vue 3 innovation)
- The compiler groups a template into **blocks**. A block collects references to **only its dynamic descendants** in a flat array (`dynamicChildren`).
- On update, Vue diffs the **dynamicChildren array directly**, skipping all static structure — turning a tree diff into a flat-list diff.
```
<div>                     block root
  <p>static</p>           (skipped on update)
  <p>{{ msg }}</p>        (in dynamicChildren — only this is diffed)
</div>
```

---

## 9. The Renderer & Reactivity Tie-in
- Each component's render is wrapped in a **render effect** (`ReactiveEffect`).
- Render reads reactive state → tracked. State change → effect scheduled (async, deduped) → re-run render → new VNode → patch.
- The **scheduler** flushes the queue in a microtask, deduping components so each renders at most once per tick; child order is parent→child.
- **`nextTick()`** lets you run code after the DOM is patched.

---

## INTERVIEW QUESTIONS
**🟢:** Template → DOM pipeline? · What is a VNode? · What is a render function / h()?
**🟡:** Compile stages (parse/transform/codegen)? · What are shapeFlag & patchFlag? · When use render functions/JSX over templates?
**🔴:** Explain keyed children diff + LIS. · What is the block tree and why is it faster? · How does the render effect connect reactivity to patching? · Scheduler + nextTick.
**🧩:** Need to render arbitrary dynamic structure — render function. · List reorder is slow/buggy — keys + diff explanation. · Access DOM after update — nextTick. · Why static parts aren't re-diffed — block tree.

## ⚡ REVISION
- Pipeline: Template → AST → transform (hoist/patch flags/blocks) → render fn → VNode → patch → DOM.
- VNode = JS object (type/props/children/shapeFlag/patchFlag/el).
- Diff: sync ends → key map → LIS → minimal moves (keys essential).
- Block tree diffs only dynamic descendants; render effect ties reactivity → patch; nextTick after DOM update.

➡️ Next: **Module 13 — Composables.**
