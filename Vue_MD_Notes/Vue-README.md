# 🟩 Vue.js Interview Master Notes
> Complete beginner → advanced notes for Senior Frontend Engineer interviews.
> First-principles · deep internals · reactivity from scratch · diagrams · interview Q&A · cheat sheets. **Vue 3 + Composition API focused.**

## 📚 Modules

| # | Module | Covers |
|---|--------|--------|
| 1 | [Introduction](Vue-Module-01-Introduction.md) | What/why Vue, history, ecosystem, Vue 2 vs 3, SPA, VDOM, vs React/Angular |
| 2 | [Reactivity System](Vue-Module-02-Reactivity.md) | **track/trigger, Proxy/Reflect, targetMap, build reactivity from scratch**, all reactive APIs |
| 3 | [Composition API](Vue-Module-03-CompositionAPI.md) | setup, script setup, composables, patterns |
| 4 | [Options vs Composition](Vue-Module-04-OptionsVsComposition.md) | Comparison, mixins problems, migration |
| 5 | [Template System](Vue-Module-05-Templates.md) | Directives, conditional/list, events, forms, slots, compilation |
| 6 | [Components](Vue-Module-06-Components.md) | Props/emits/slots, provide-inject, async, render lifecycle |
| 7 | [Lifecycle](Vue-Module-07-Lifecycle.md) | All hooks, Composition equivalents, exact order |
| 8 | [Advanced Reactivity](Vue-Module-08-AdvancedReactivity.md) | customRef, markRaw, toRef(s), triggerRef, effectScope |
| 9 | [Pinia](Vue-Module-09-Pinia.md) | Stores, internals, vs Vuex, migration, enterprise |
| 10 | [Router](Vue-Module-10-Router.md) | Internals, guards, meta, dynamic/nested, lazy |
| 11 | [Performance](Vue-Module-11-Performance.md) | Diffing/LIS, patch flags, memoization, virtualization |
| 12 | [Rendering Internals](Vue-Module-12-RenderingInternals.md) | Template→AST→render→VNode→DOM, block tree, diff |
| 13 | [Composables](Vue-Module-13-Composables.md) | Reusable logic, patterns, testing, production examples |
| 14 | [State Architecture](Vue-Module-14-StateArchitecture.md) | Local/shared/global, modular stores, server vs client state |
| 15 | [Forms & Validation](Vue-Module-15-Forms.md) | VeeValidate, Zod/Yup, async, dynamic forms |
| 16 | [API Integration](Vue-Module-16-APIIntegration.md) | Axios/fetch, service layer, retry, cache, query libs |
| 17 | [Micro Frontends](Vue-Module-17-MicroFrontends.md) | Module Federation, Vite federation, internals |
| 18 | [Testing](Vue-Module-18-Testing.md) | Vitest, Vue Test Utils, composables/stores, E2E |
| 19 | [SSR & Nuxt](Vue-Module-19-SSR-Nuxt.md) | CSR/SSR/SSG/ISR, hydration, Nuxt architecture |
| 20 | [Security](Vue-Module-20-Security.md) | XSS, CSRF, CSP, auth, JWT (Vue-specific) |
| 21 | [Design Patterns](Vue-Module-21-DesignPatterns.md) | Container/presentational, composables, factory, DI |
| 22 | [Large-Scale Architecture](Vue-Module-22-LargeScaleArchitecture.md) | Admin, CMS, e-commerce, trading, SaaS designs |
| 23 | [Interview Master](Vue-Module-23-InterviewMaster.md) | 100 core + reactivity/composition/pinia/perf/scenario/debug Qs |
| 24 | [Real Scenarios](Vue-Module-24-RealScenarios.md) | Why re-render / watch ×N / computed stale / leaks — debugging |
| 25 | [Revision Sheets](Vue-Module-25-RevisionSheets.md) | 1-day/3-hr/30-min + reactivity/composition/pinia/router/perf cheat sheets |

## 🎯 How to Use
- **Learning:** Modules 1→25 in order.
- **1 week out:** prioritize 2, 3, 8, 9, 11, 12, 24 (highest-yield internals + debugging).
- **1 day out:** Module 25 (1-day notes) + Module 23 (Top 100).
- **30 min out:** Module 25 → 30-minute revision + cheat sheets.

## 🔑 The Golden Rules
1. Reactivity = track on read, trigger on write (Proxy + targetMap).
2. `ref` by default; `toRefs`/`storeToRefs` when destructuring.
3. `computed` caches, `watch` reacts, `watchEffect` auto-tracks.
4. Stable unique keys → correct + minimal DOM diff (LIS).
5. Children mount before parent; always clean up in `onUnmounted`.
6. Pinia: no mutations, compose stores, `storeToRefs` to destructure.
7. Client-side authz is UX only — enforce on the server.
8. Updates are async — `nextTick` after DOM changes.
