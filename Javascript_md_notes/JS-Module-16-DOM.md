# JS MODULE 16: DOM

---

## 1. What is the DOM
**Definition:** **Document Object Model** — a tree representation of the HTML document as objects (nodes) that JS can read and manipulate. It's a **browser API**, not part of JS.
```
document
 └─ html
    ├─ head
    └─ body
       ├─ div#app
       │   └─ p (text node)
       └─ button
```

---

## 2. DOM Manipulation
```js
// Select
document.getElementById('app');
document.querySelector('.item');           // first match (CSS selector)
document.querySelectorAll('li');           // NodeList (static)
// Create / insert
const el = document.createElement('div');
el.textContent = 'Hi';                     // safe (no XSS)
el.innerHTML = '<b>Hi</b>';                // parses HTML (XSS risk!)
parent.appendChild(el);
parent.append(el, 'text');                 // modern, multiple
el.insertAdjacentHTML('beforeend', '<p>x</p>');
// Modify
el.classList.add('active'); el.setAttribute('id','x'); el.style.color='red';
// Remove
el.remove();
```

---

## 3. Reflow (Layout) vs Repaint
| | Reflow (Layout) | Repaint |
|---|-----------------|---------|
| What | Recalculate **geometry/position** of elements | Redraw **pixels** (color, visibility) |
| Cost | Expensive (can cascade to whole subtree) | Cheaper |
| Triggers | size/position/DOM changes, reading layout props (`offsetWidth`), font, window resize | color, background, visibility (no layout change) |
```
DOM/style change → Reflow (if geometry) → Repaint → Composite
```
**Reflow triggers:** adding/removing elements, changing width/height/margin/position, reading `offsetTop/offsetHeight/getBoundingClientRect()`, etc.

---

## 4. Layout Thrashing (the classic perf bug)
**Definition:** Interleaving **reads** (force layout) and **writes** (invalidate layout) in a loop → forces repeated synchronous reflows.
```js
// ❌ thrashing — read forces reflow each iteration
for (const el of els) { el.style.width = el.offsetWidth + 10 + 'px'; }
// ✅ batch reads then writes
const widths = els.map(el => el.offsetWidth);   // read all
els.forEach((el, i) => el.style.width = widths[i] + 10 + 'px');  // write all
```

---

## 5. Performance Optimization
- **Batch DOM updates:** build offline (DocumentFragment), insert once.
- **Minimize reflows:** change classes (not many inline styles), read-then-write (avoid thrashing), use `transform`/`opacity` (composite-only, skip layout).
- **Debounce/throttle** scroll/resize/input handlers.
- **Event delegation:** one listener on a parent vs many on children.
- **Virtualize** long lists (render only visible).
- **`requestAnimationFrame`** for visual updates (aligns with paint).
- Avoid `innerHTML` in loops; minimize forced synchronous layout.
```js
// DocumentFragment — one reflow
const frag = document.createDocumentFragment();
items.forEach(i => { const li = document.createElement('li'); li.textContent = i; frag.append(li); });
list.append(frag);   // single insertion

// Event delegation
list.addEventListener('click', e => {
  if (e.target.matches('li')) handle(e.target);   // handles all current+future li
});
```

---

## 6. Event Handling
- **Bubbling** (default): event propagates child → ancestors.
- **Capturing**: ancestors → child (`addEventListener(type, fn, true)`).
- **Delegation**: leverage bubbling to handle many elements with one listener (perf + dynamic elements).
- `e.stopPropagation()`, `e.preventDefault()`, `e.target` vs `e.currentTarget`.

---

## 7. Best Practices / Mistakes / Performance
**Best practices:** batch updates (fragment), delegate events, debounce/throttle, prefer `textContent` (XSS-safe) over `innerHTML`, use `transform/opacity` for animation.
**Mistakes:** layout thrashing, many individual DOM ops, `innerHTML` with user data (XSS), forgetting to remove listeners (leaks), querying DOM in loops.
**Performance:** reflow > repaint > composite in cost; minimize reflows; composite-only props (transform/opacity) are GPU-accelerated and cheap.

---

## INTERVIEW QUESTIONS
**🟢:** What is the DOM? · getElementById vs querySelector? · textContent vs innerHTML?
**🟡:** Reflow vs repaint? · What triggers reflow? · Event bubbling vs capturing? · What is event delegation?
**🔴:** Layout thrashing — cause & fix. · How to optimize 1000 DOM insertions (fragment). · Why are transform/opacity cheap (composite). · NodeList (live vs static).
**🧩:** Scroll handler janks page — throttle + rAF. · Adding 10k rows freezes UI — virtualize + fragment. · Clicks on dynamic items not handled — delegation. · Animation stutters — use transform not top/left.

## ⚡ REVISION
- DOM = tree of node objects (browser API, not JS).
- Reflow (geometry, expensive, cascades) vs Repaint (pixels) vs Composite (cheap, GPU: transform/opacity).
- Avoid layout thrashing: batch reads then writes; use DocumentFragment; rAF for visuals.
- Event delegation (one parent listener) + debounce/throttle for perf.
- textContent (safe) vs innerHTML (XSS).

➡️ Next: **Module 17 — Browser Internals.**
