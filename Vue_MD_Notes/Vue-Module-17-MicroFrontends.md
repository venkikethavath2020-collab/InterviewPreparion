# VUE MODULE 17: MICRO FRONTENDS

---

## 1. What & Why
**Definition:** An architectural style where a frontend is split into **independently developed, deployed, and owned** applications ("micro frontends"), composed at runtime into one app.
**Why:** Large orgs with many teams → independent release cycles, tech autonomy, smaller deploys, fault isolation, scaling teams without a monolith bottleneck.
**Trade-offs:** complexity, shared-dependency duplication, cross-app consistency, performance overhead, harder debugging.

```
        ┌──────────── Host (Shell) ────────────┐
        │  Layout, routing, auth, shared libs   │
        │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
        │  │ Remote A│ │ Remote B│ │ Remote C│  │
        │  │ (Cart)  │ │(Catalog)│ │(Profile)│  │ ← independently deployed
        │  └─────────┘ └─────────┘ └─────────┘  │
        └────────────────────────────────────────┘
```

---

## 2. Module Federation (Webpack 5)
**Definition:** A Webpack feature letting a JS app **load code from another independently-built app at runtime**. Each app **exposes** modules and **consumes** remotes; **shared** deps loaded once.
```js
// HOST webpack config
new ModuleFederationPlugin({
  name: 'host',
  remotes: { catalog: 'catalog@https://cdn/catalog/remoteEntry.js' },
  shared: ['vue', 'pinia']
})
// REMOTE (catalog) config
new ModuleFederationPlugin({
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: { './ProductList': './src/ProductList.vue' },
  shared: ['vue', 'pinia']
})
// HOST usage
const ProductList = defineAsyncComponent(() => import('catalog/ProductList'))
```

---

## 3. Vite Federation
**Definition:** `@originjs/vite-plugin-federation` brings Module Federation to **Vite** builds.
```js
// vite.config — remote
federation({
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: { './ProductList': './src/ProductList.vue' },
  shared: ['vue']
})
// host
federation({
  remotes: { catalog: 'https://cdn/catalog/assets/remoteEntry.js' },
  shared: ['vue']
})
```
**Vite caveat:** federation needs build mode (uses Rollup output); dev experience differs from Webpack.

---

## 4. Host (Shell) Application
**Responsibilities:**
- App shell: layout, top-level routing, navigation.
- **Authentication/session** (shared, passed to remotes).
- **Shared dependencies** (Vue, router, design system) — singletons to avoid duplication.
- Loading/error boundaries for remotes; orchestration.

## 5. Remote Applications
- Own a **feature/domain** (cart, catalog, profile).
- Built & deployed independently; expose components/routes.
- Should be **self-contained** but consume shared contracts (auth token, event bus, design tokens).

---

## 6. How It Works Internally
```
1. Remote builds → emits remoteEntry.js (a manifest of exposed modules + shared deps)
2. Host loads remoteEntry.js at runtime
3. Host requests an exposed module → federation negotiates SHARED deps:
     - if host already has compatible vue → reuse (singleton)
     - else load remote's copy
4. Module returned → rendered as a normal async component
```
**Shared singletons** (`shared: { vue: { singleton: true } }`) are critical — two Vue instances break reactivity/context.

---

## 7. Integration Approaches (beyond MF)
| Approach | How |
|----------|-----|
| **Module Federation** | Runtime JS sharing (most common for Vue/React) |
| **Web Components** | Wrap each MFE as a custom element (framework-agnostic) |
| **iframes** | Strong isolation, poor UX/integration |
| **Build-time (monorepo)** | npm packages (not truly independent deploy) |
| **Edge/Server composition** | Compose fragments server-side |

---

## 8. Cross-App Concerns
- **Shared state/auth:** pass token via host; event bus / `window` custom events / shared store package.
- **Routing:** host owns top-level routes; remotes own sub-routes (nested).
- **Design consistency:** shared design system (versioned package).
- **Versioning:** semver shared deps; contract testing between host/remotes.
- **Communication:** custom events / message bus (loose coupling), not tight imports.

---

## 9. Best Practices / Mistakes
**Best practices:** share core deps as singletons, loose coupling (events/contracts), independent CI/CD, error boundaries around remotes, shared design system, version contracts.
**Mistakes:** duplicate Vue instances (reactivity breaks), tight coupling between remotes, shared mutable global state, inconsistent dep versions, no fallback when a remote fails to load.
**Performance:** dedupe shared deps, lazy-load remotes, prefetch on idle, monitor bundle/network overhead.

---

## INTERVIEW QUESTIONS
**🟢:** What are micro frontends / why? · Host vs remote? · What is Module Federation?
**🟡:** How does shared dep negotiation work (singletons)? · MF in Webpack vs Vite? · Cross-MFE communication options?
**🔴:** Internal flow of loading a remote (remoteEntry, shared scope). · Why duplicate Vue breaks reactivity. · Versioning/contract strategy. · Web Components vs MF trade-offs.
**🧩:** Reactivity breaks across MFEs — duplicate Vue (share singleton). · A remote is down — error boundary + fallback. · Two teams ship cart independently — MF architecture. · Bundle bloat from duplicated libs — shared config.

## ⚡ REVISION
- MFE = independently built/deployed frontends composed at runtime (team autonomy).
- Module Federation (Webpack) / vite-plugin-federation: host consumes remoteEntry.js; remotes expose modules; shared deps as singletons.
- Host = shell/routing/auth/shared; remotes = feature domains.
- Share Vue as singleton (else reactivity breaks); loose coupling via events/contracts.

➡️ Next: **Module 18 — Testing.**
