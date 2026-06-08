# MODULE 3: MODULE SYSTEM

---

## 1. Why Modules Exist
Before modules, all JS shared one global scope → name collisions, no encapsulation, unclear dependencies. Modules give: **encapsulation** (private scope), **reusability**, **explicit dependencies**, **maintainability**.

Node has **two** systems: **CommonJS (CJS)** — the original, and **ES Modules (ESM)** — the standard.

---

## 2. CommonJS (CJS)

**Definition:** Node's original synchronous module system. Each file is a module with its own scope. Uses `require()` to import and `module.exports`/`exports` to export.

**How it works internally — the module wrapper:**
Node wraps every file:
```js
(function (exports, require, module, __filename, __dirname) {
  // your module code
});
```
This gives each file private scope + injects 5 variables. That's why `exports`, `require`, `module`, `__filename`, `__dirname` "just exist."

**`require()` internal steps:**
```
1. Resolve   → find the file path (Module Resolution Algorithm)
2. Load      → read file contents
3. Wrap      → wrap in the function above
4. Evaluate  → run it; populate module.exports
5. Cache     → store in require.cache (keyed by resolved path)
6. Return    → module.exports
```
**Caching:** A module runs **once**; subsequent `require`s return the **cached** `module.exports`. (Basis of the Singleton pattern.)

```js
// math.js
module.exports = { add: (a,b) => a+b };
// app.js
const math = require('./math');  // synchronous, cached
```

---

## 3. `module.exports` vs `exports`

- `module.exports` is the **real** exported object.
- `exports` is just a **reference** to `module.exports` (`exports = module.exports` at start).
- Adding properties works on both: `exports.foo = 1` ≡ `module.exports.foo = 1`.
- **Reassigning `exports` breaks the link** — only `module.exports` is returned.

```js
exports.a = 1;              // ✅ works (mutates shared object)
exports = { b: 2 };        // ❌ ignored — reassigns local ref only
module.exports = { b: 2 }; // ✅ works — replaces the real export
```

**#1 mistake:** `exports = {...}` and expecting it to export.

---

## 4. ES Modules (ESM)

**Definition:** The official ECMAScript standard module system. Uses `import`/`export`. **Asynchronous**, statically analyzable (enables tree-shaking).

**How to enable:**
- `.mjs` extension, OR
- `"type": "module"` in `package.json`, OR
- `--input-type=module`.

```js
// math.mjs
export const add = (a,b) => a+b;        // named export
export default function() {}            // default export
// app.mjs
import multiply, { add } from './math.mjs';
import * as math from './math.mjs';
```

**Internals — 3 phases:**
```
1. CONSTRUCTION — find, fetch, parse all modules into Module Records (build dependency graph)
2. INSTANTIATION — allocate memory, link imports↔exports via LIVE BINDINGS (not copies)
3. EVALUATION    — run module code, fill the bindings
```
**Live bindings:** ESM imports are read-only **references** to the export. If the exporter changes the value later, the importer sees the new value. (CJS copies the value at require time.)

---

## 5. Dynamic Imports

`import()` returns a **Promise** — works in both ESM and CJS, lets you load modules **conditionally/lazily** and load ESM from CJS.

```js
const { add } = await import('./math.mjs');     // async
if (heavyFeatureNeeded) {
  const mod = await import('./heavy.js');        // lazy load
}
```
**Use cases:** code splitting, conditional loading, loading ESM inside CJS, reducing startup time.

---

## 6. Module Resolution Algorithm

When you `require('x')` / `import 'x'`, Node resolves in this order:

```
1. Core module?            require('fs')  → built-in, returned immediately
2. Path (./ ../ /)?        → relative/absolute file:
                              try exact → .js → .json → .node
                              then as directory: package.json "main"/"exports" → index.js
3. node_modules lookup:    → ./node_modules → ../node_modules → ... up to root
                              (uses package.json "exports"/"main")
```
- ESM additionally honors the `"exports"` field, `"imports"` (`#` subpaths), and conditional exports (`import`/`require`/`node`/`default`).
- ESM requires **file extensions** in relative paths; CJS does not.

---

## 7. Circular Dependencies

**Definition:** A requires B, and B requires A.

**CJS behavior:** Returns a **partial (incomplete) `module.exports`** of the module still executing. No crash, but you may get `undefined` for not-yet-assigned exports.

```js
// a.js
exports.loaded = false;
const b = require('./b');   // b runs, requires a back → gets partial a
exports.loaded = true;
// b.js
const a = require('./a');   // a.loaded is FALSE here (a not finished)
console.log(a.loaded);      // false
```
**ESM behavior:** Hoisted live bindings tolerate cycles better — a binding may be in the **TDZ** (ReferenceError) if accessed before evaluation, but resolves correctly afterward.

**Fixes:** Restructure to remove the cycle; move shared code to a third module; `require` lazily inside the function instead of at top.

---

## 8. CJS vs ESM — Comparison

| Aspect | CommonJS | ES Modules |
|--------|----------|------------|
| Syntax | `require` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous |
| Binding | **Value copy** at require | **Live binding** (reference) |
| `this` at top | `module.exports` | `undefined` |
| `__dirname`/`__filename` | ✅ | ❌ (use `import.meta.url`) |
| `require`/`module` | ✅ | ❌ (use `import`) |
| Tree-shaking | ❌ (dynamic) | ✅ (static) |
| Top-level await | ❌ | ✅ |
| Load ESM? | only via `import()` | ✅ |
| Load CJS? | ✅ | ✅ (default import) |
| When evaluated | runtime | parse-time graph, then eval |
| Strict mode | opt-in | always |

**`import.meta.url` → __dirname in ESM:**
```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
```

**Node version note:** Node 22+ can `require()` ESM (experimental → stabilizing); historically a hard error. ESM has been stable since Node 14+.

---

## PRACTICE QUESTIONS

**🟢 Beginner:** What is a module? · CJS vs ESM syntax? · `module.exports` vs `exports`? · How to enable ESM?

**🟡 Intermediate:** Walk through `require()` steps. · What is the module wrapper? · What is module caching and how does it enable Singletons? · How do you get `__dirname` in ESM? · Sync vs async loading impact.

**🔴 Advanced:** Explain ESM's 3 phases + live bindings. · Why can `exports = {}` fail? · Module resolution algorithm in full. · How do circular deps behave in CJS vs ESM? · What is the `exports` field / conditional exports?

**🧩 Scenario:** A required module returns `undefined` mid-cycle — diagnose. · You need to lazy-load a heavy module — how? · Mixing CJS and ESM in one project — strategy?

---

## ⚡ REVISION
- **CJS:** sync, value copy, cached, wrapper fn injects 5 vars. **ESM:** async, live bindings, static, tree-shakeable, TLA.
- `module.exports` is real; `exports` is a ref — never reassign `exports`.
- Resolution: core → path → node_modules (walk up).
- Circular: CJS gives partial exports; ESM uses live bindings (TDZ risk).

➡️ Next: **Module 4 — Core Modules.**
