# JS MODULE 20: PERFORMANCE OPTIMIZATION

---

## 1. Debounce
**Definition:** Delay running a function until **N ms after the last call** — collapses bursts into one execution. For "wait until user stops" events (search input, resize).
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
const onSearch = debounce(q => api(q), 300);   // fires 300ms after typing stops
```

## 2. Throttle
**Definition:** Run a function **at most once per N ms**, regardless of call frequency. For continuous events (scroll, mousemove, drag).
```js
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
const onScroll = throttle(handler, 200);   // max 5×/sec
```
**Debounce vs Throttle:**
| | Debounce | Throttle |
|---|----------|----------|
| Fires | After calls **stop** | **Regularly** during calls |
| Use | Search, autosave, resize-end | Scroll, mousemove, rate-limit |

---

## 3. Memoization
**Definition:** Cache function results by arguments → avoid recomputation. For **pure, expensive** functions.
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
const fib = memoize(n => n < 2 ? n : fib(n-1) + fib(n-2));   // O(n) instead of O(2^n)
```
**Caution:** unbounded cache → memory leak; use LRU/size limit for hot caches; only for pure functions.

---

## 4. Lazy Loading
**Definition:** Defer loading resources/code until needed → faster initial load.
```js
// images
<img loading="lazy" src="...">
// IntersectionObserver for custom lazy load
const io = new IntersectionObserver(entries => { /* load when visible */ });
// dynamic import (code)
const mod = await import('./heavy.js');
```
**Use:** below-the-fold images, off-route components, heavy libs (charts/editors).

## 5. Code Splitting
**Definition:** Break the bundle into smaller chunks loaded on demand (per route/feature) → smaller initial download.
```js
// dynamic import = automatic chunk (Vite/Webpack)
const Admin = () => import('./Admin.js');
```
Combine with lazy loading + tree shaking for minimal initial payload.

---

## 6. V8 / JS Optimization Tips
- **Stable object shapes** (hidden classes): init all props in constructor, same order; avoid `delete`.
- **Monomorphic functions:** consistent argument types → TurboFan optimizes; mixed types → megamorphic → deopt.
- **Avoid** `try/catch` in hot loops (historically deopt), `arguments` leaking, `eval`/`with`.
- **Prefer** `for`/`for...of` in hot paths over chained functional methods (multiple passes).
- **Reuse** objects/arrays; avoid allocations in hot loops (GC pressure).
- **Typed arrays** for large numeric data.
- **Batch DOM** updates; use `transform/opacity` for animation; `requestAnimationFrame`.
- **Web Workers** for CPU-heavy work (keep main thread free).

---

## 7. Measuring (don't guess)
- **`performance.now()`**, `console.time()`.
- **Chrome DevTools Performance** panel → flame charts, long tasks.
- **Lighthouse** + **Core Web Vitals** (LCP, CLS, INP).
- **Memory** panel for leaks.
- "**Measure → optimize → measure**" — never optimize blind.

---

## 8. Best Practices / Mistakes
**Best practices:** debounce/throttle event handlers; memoize pure expensive fns (bounded); lazy-load + code-split; keep shapes stable; offload CPU to workers; measure first.
**Mistakes:** premature optimization; unbounded memoization (leak); throttling where debounce fits (or vice versa); micro-optimizing cold paths; blocking the main thread.

---

## INTERVIEW QUESTIONS
**🟢:** Debounce vs throttle? · What is memoization? · What is lazy loading / code splitting?
**🟡:** Implement debounce/throttle/memoize. · When debounce vs throttle (concrete events)? · How does code splitting reduce load?
**🔴:** V8 optimization (hidden classes, monomorphism, deopt). · Bounded memoization (LRU). · Web Workers for CPU work. · Measuring + Core Web Vitals.
**🧩:** Search input spams API — debounce. · Scroll handler janks — throttle + rAF. · Expensive recompute on every render — memoize. · Huge initial bundle — split + lazy. · Heavy computation freezes UI — worker.

## ⚡ REVISION
- **Debounce** = after calls stop (search/resize); **Throttle** = max once/interval (scroll/mousemove).
- **Memoize** = cache pure fn results (bound the cache).
- **Lazy load + code split** = load on demand (dynamic import) → smaller initial bundle.
- V8: stable shapes, monomorphic fns, avoid deopt; offload CPU to Web Workers.
- Measure with DevTools/Lighthouse; optimize hot paths only.

➡️ Next: **Module 21 — Advanced JavaScript.**
