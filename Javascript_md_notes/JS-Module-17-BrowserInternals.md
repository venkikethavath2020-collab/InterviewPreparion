# JS MODULE 17: BROWSER INTERNALS

---

## 1. Browser Architecture
```
┌─────────────────────────────────────────────┐
│  User Interface (address bar, tabs)          │
├─────────────────────────────────────────────┤
│  Browser Engine  ── coordinates              │
├─────────────────────────────────────────────┤
│  Rendering Engine (Blink/WebKit/Gecko)       │
│   - HTML parser, CSS parser, layout, paint   │
├──────────────┬──────────────┬─────────────────┤
│ JS Engine    │ Networking   │ UI Backend     │
│ (V8)         │ (HTTP)       │ (draw widgets) │
├──────────────┴──────────────┴─────────────────┤
│  Data Storage (cookies, localStorage, cache) │
└─────────────────────────────────────────────┘
```
Modern browsers are **multi-process** (Chrome): browser process + renderer process per site (sandboxed) + GPU + network + utility processes → security + stability.

---

## 2. The Rendering Pipeline (Critical Rendering Path)
```
HTML ──parse──► DOM ──┐
                       ├──► Render Tree ──► Layout ──► Paint ──► Composite
CSS  ──parse──► CSSOM ─┘
JS ──may modify DOM/CSSOM (can block parsing)
```
Steps:
1. **Parse HTML → DOM tree.**
2. **Parse CSS → CSSOM tree.**
3. **Render Tree** = DOM + CSSOM (only visible nodes; `display:none` excluded).
4. **Layout (Reflow):** compute geometry (position/size) of each node.
5. **Paint:** fill pixels (text, colors, borders) into layers.
6. **Composite:** combine layers (GPU) → final screen image.

---

## 3. Parsing
- **HTML parser** builds the DOM incrementally (streaming).
- **`<script>` blocks parsing** by default (synchronous): the parser stops, fetches + executes JS, then resumes → can delay rendering.
  - **`async`**: download in parallel, execute ASAP (order not guaranteed) — for independent scripts.
  - **`defer`**: download in parallel, execute in order **after** HTML parsed — recommended for app scripts.
- **CSS is render-blocking**: the browser won't paint until CSSOM is ready (avoid FOUC).

```html
<script src="a.js"></script>          <!-- blocks parsing -->
<script src="a.js" async></script>    <!-- parallel, runs ASAP -->
<script src="a.js" defer></script>    <!-- parallel, runs after parse, in order -->
```

---

## 4. Layout (Reflow)
Computes the **box model** geometry for every render-tree node (x, y, width, height). Expensive; changes cascade. Triggered by DOM/style changes affecting geometry and by reading layout properties (forced synchronous layout). (See DOM module.)

## 5. Paint
Converts layout into actual pixels — draws text, colors, images, shadows, borders onto layers. Split into layers for efficient updates.

## 6. Composite
The compositor combines painted layers (possibly on the **GPU**) and handles transforms/opacity/scroll **without re-layout or re-paint** → why `transform`/`opacity` animations are smooth (60fps).
```
Cheapest path:  change transform/opacity → Composite only (skip Layout & Paint) ✅
Expensive:      change width/top → Layout → Paint → Composite ❌
```

---

## 7. Optimizing the Critical Rendering Path
- **Minimize render-blocking resources:** inline critical CSS, defer non-critical CSS, `defer` JS.
- **Reduce CSSOM/DOM size & depth.**
- **Lazy-load** below-the-fold images/components.
- **Preload/preconnect** critical resources.
- **Avoid large synchronous JS** during load.
- **Animate with transform/opacity** (composite-only).
- **Code-split** to ship less JS.
- Measure **Core Web Vitals**: **LCP** (load), **CLS** (layout stability), **INP/FID** (interactivity).

---

## 8. Where JS Fits + Event Loop
- The renderer's main thread runs **JS + layout + paint** — long JS **blocks rendering** (jank). Offload CPU work to **Web Workers**.
- The **event loop** coordinates tasks, microtasks, and rendering: after microtasks drain, the browser may **render** before the next macrotask (Module 11). `requestAnimationFrame` runs just before paint.

---

## INTERVIEW QUESTIONS
**🟢:** What is the critical rendering path? · async vs defer? · DOM vs CSSOM?
**🟡:** Steps DOM→pixels (layout/paint/composite)? · Why does `<script>` block parsing? · Why is CSS render-blocking? · transform vs top for animation?
**🔴:** Browser multi-process architecture. · Composite-only properties + GPU. · How JS blocks rendering (main thread) + Web Workers. · Core Web Vitals + how to optimize each.
**🧩:** Slow first paint — diagnose (render-blocking CSS/JS). · Janky animation — use transform/composite. · Heavy computation freezes UI — Web Worker. · Layout shift (CLS) — reserve space / dimensions.

## ⚡ REVISION
- Pipeline: HTML→DOM + CSS→CSSOM → Render Tree → Layout → Paint → Composite.
- `<script>` blocks parsing (use `defer`/`async`); CSS is render-blocking.
- Layout (geometry) & Paint (pixels) expensive; Composite (transform/opacity, GPU) cheap.
- JS shares the main thread with rendering → don't block it (Web Workers for CPU).
- Optimize CRP: critical CSS, defer JS, lazy-load, code-split; measure LCP/CLS/INP.

➡️ Next: **Module 18 — Modules.**
