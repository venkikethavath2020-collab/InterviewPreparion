# JS MODULE 18: MODULES

---

## 1. Why Modules
Before modules: everything in global scope → collisions, no encapsulation, unclear dependencies, manual `<script>` ordering. Modules give **encapsulation, reusability, explicit dependencies, maintainability**.

---

## 2. CommonJS (CJS)
**Definition:** Node's original module system. **Synchronous**, runtime-evaluated. `require()` / `module.exports`.
```js
// math.js
module.exports = { add: (a, b) => a + b };
const helper = require('./helper');   // sync load, cached
```
- **Synchronous** (fine on server, not for browser network loading).
- **Value copy** at require time; **cached** (runs once → Singleton).
- `module.exports` is the real export; `exports` is a reference (don't reassign).

---

## 3. ES Modules (ESM)
**Definition:** The standard module system (ES2015). **Asynchronous**, statically analyzable. `import` / `export`.
```js
// math.mjs
export const add = (a, b) => a + b;     // named
export default function () {};           // default
// app.mjs
import multiply, { add } from './math.mjs';
import * as math from './math.mjs';
```
- **Static** structure (imports at top, resolved before execution) → enables **tree shaking**.
- **Live bindings**: imports are read-only references to the export (see updated value), unlike CJS value copies.
- **Strict mode** always; top-level `this` is `undefined`; supports **top-level await**.
- Enable: `.mjs`, or `"type": "module"` in package.json, or `<script type="module">`.

---

## 4. CJS vs ESM
| | CommonJS | ES Modules |
|---|----------|------------|
| Syntax | require / module.exports | import / export |
| Loading | Synchronous | Asynchronous |
| Binding | Value copy | **Live binding** |
| Analysis | Dynamic (runtime) | Static (compile-time) |
| Tree-shaking | ❌ | ✅ |
| Top-level await | ❌ | ✅ |
| Browser | ❌ (needs bundler) | ✅ native (`type="module"`) |
| `this` (top) | module.exports | undefined |

---

## 5. Dynamic Imports
**Definition:** `import()` returns a **Promise** → load modules **conditionally/lazily** at runtime. Works in both ESM and (modern) CJS.
```js
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart.js');   // loaded only on demand
  new Chart();
});
```
**Use:** code splitting, route-based lazy loading, conditional features, reducing initial bundle.

---

## 6. Module Resolution
```
import './x'      → relative path (file)
import 'lodash'   → node_modules lookup (walk up dirs), uses package.json "main"/"exports"
import '/abs'     → absolute
```
- ESM honors package.json `"exports"` (subpath exports, conditional `import`/`require`), requires **file extensions** in relative paths.
- Bundlers (Vite/Webpack) resolve + bundle for the browser.

---

## 7. Tree Shaking
**Definition:** Dead-code elimination — bundlers remove **unused exports** from the final bundle. Relies on **ESM's static structure** (imports known at build time).
```js
// utils.js exports a, b, c
import { a } from './utils';   // only `a` is bundled; b, c shaken out
```
**Requirements:** ESM syntax, no side-effects in unused modules (`"sideEffects": false` in package.json helps), pure functions. CJS can't be reliably tree-shaken (dynamic `require`).

---

## 8. Circular Dependencies
- **CJS:** returns a **partial** (incomplete) exports object of the module still executing → may get `undefined`.
- **ESM:** live bindings handle cycles better, but accessing before evaluation → TDZ-style error.
**Fix:** restructure, extract shared code, lazy import.

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** prefer ESM; named exports for tree-shaking; dynamic import for code splitting; mark `sideEffects: false`; avoid circular deps.
**Mistakes:** reassigning `exports` (CJS); mixing CJS/ESM incorrectly; default-exporting everything (worse tree-shaking/refactoring); missing file extensions in ESM.
**Performance:** code splitting + lazy load reduces initial bundle; tree shaking trims unused code; barrel files (`index.js` re-exports) can hurt tree-shaking.

---

## INTERVIEW QUESTIONS
**🟢:** CJS vs ESM? · What is dynamic import? · Named vs default export?
**🟡:** Why is ESM tree-shakeable but CJS not? · Live bindings vs value copy? · How does module resolution work? · `module.exports` vs `exports`?
**🔴:** Circular deps in CJS vs ESM. · How tree shaking works (static analysis + side effects). · Conditional `exports` field. · Top-level await implications.
**🧩:** Big bundle — code split with dynamic import. · Unused code shipped — enable tree shaking. · Circular dep returns undefined — fix. · Mixing CJS/ESM in a project — strategy.

## ⚡ REVISION
- CJS: sync, value-copy, cached, dynamic (Node). ESM: async, live bindings, static, tree-shakeable, TLA (standard).
- `import()` (dynamic) returns a Promise → lazy/code-split.
- Tree shaking removes unused exports — needs ESM + no side effects.
- Resolution: relative path / node_modules walk-up / exports field.
- Circular: CJS partial exports; ESM live bindings (TDZ risk).

➡️ Next: **Module 19 — Design Patterns.**
