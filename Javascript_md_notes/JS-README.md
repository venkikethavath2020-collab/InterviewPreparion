# 🟨 JavaScript Interview Master Notes
> Complete beginner → advanced notes for Senior Software Engineer interviews.
> First-principles · V8/engine internals · browser internals · build-from-scratch · diagrams · output prediction · interview Q&A · cheat sheets.

## 📚 Modules

| # | Module | Covers |
|---|--------|--------|
| 1 | [Fundamentals](JS-Module-01-Fundamentals.md) | What/why JS, ECMAScript, engines, V8, JIT, dynamic/weak typing, vs TS/Java |
| 2 | [Execution Context](JS-Module-02-ExecutionContext.md) | Creation/execution phases, lexical/variable env, scope chain, this |
| 3 | [Hoisting](JS-Module-03-Hoisting.md) | var/let/const/function/class, TDZ, output prediction |
| 4 | [Scope](JS-Module-04-Scope.md) | Global/function/block/lexical scope, resolution algorithm |
| 5 | [Closures](JS-Module-05-Closures.md) | **Internals, privacy, memoize, debounce, throttle, module pattern** |
| 6 | [this Keyword](JS-Module-06-This.md) | Binding rules, call/apply/bind, arrows, output prediction |
| 7 | [Objects](JS-Module-07-Objects.md) | Creation, descriptors, freeze/seal/assign, hidden classes |
| 8 | [Prototypes](JS-Module-08-Prototypes.md) | **Chain, lookup algorithm, inheritance, new internals** |
| 9 | [Classes](JS-Module-09-Classes.md) | ES6 classes, super, static, #private, vs prototypes |
| 10 | [Functions](JS-Module-10-Functions.md) | Declaration/expression/arrow, HOF, callbacks, pure, currying |
| 11 | [Event Loop](JS-Module-11-EventLoop.md) | **Stack, queues, micro/macrotask, output prediction (MOST IMPORTANT)** |
| 12 | [Promises](JS-Module-12-Promises.md) | States, chaining, combinators, **build from scratch** |
| 13 | [Async/Await](JS-Module-13-AsyncAwait.md) | async/await internals, error handling, parallel vs sequential |
| 14 | [Memory Management](JS-Module-14-Memory.md) | Stack/heap, GC, mark-sweep, leaks, optimization |
| 15 | [Arrays](JS-Module-15-Arrays.md) | map/filter/reduce/etc, **implement from scratch**, complexity |
| 16 | [DOM](JS-Module-16-DOM.md) | Manipulation, reflow/repaint, delegation, performance |
| 17 | [Browser Internals](JS-Module-17-BrowserInternals.md) | Rendering pipeline, CRP, parse/layout/paint/composite |
| 18 | [Modules](JS-Module-18-Modules.md) | CJS/ESM, dynamic imports, resolution, tree shaking |
| 19 | [Design Patterns](JS-Module-19-DesignPatterns.md) | Module, factory, singleton, observer, strategy, decorator |
| 20 | [Performance](JS-Module-20-Performance.md) | Debounce, throttle, memoize, lazy load, code split, V8 tips |
| 21 | [Advanced JS](JS-Module-21-Advanced.md) | WeakMap/Set, Symbol, generators, iterators, **Proxy, Reflect** |
| 22 | [Engine Internals](JS-Module-22-EngineInternals.md) | **Parse/AST/Ignition/TurboFan, hidden classes, inline caching** |
| 23 | [Security](JS-Module-23-Security.md) | XSS, CSRF, CORS, SOP, CSP, prototype pollution |
| 24 | [System Design](JS-Module-24-SystemDesign.md) | Dashboard, chat, real-time tracking, e-commerce |
| 25 | [Interview Master](JS-Module-25-InterviewMaster.md) | 120 core + event-loop/closure/prototype/async/scenario/debug Qs |
| 26 | [Revision Sheets](JS-Module-26-RevisionSheets.md) | 1-day/3-hr/30-min + event-loop/closures/prototype/async cheat sheets |

## 🎯 How to Use
- **Learning:** Modules 1→26 in order.
- **1 week out:** prioritize 2, 3, 5, 6, 8, 11, 12, 13, 22 (highest-yield internals).
- **1 day out:** Module 26 (1-day notes) + Module 25 (120 core Qs).
- **30 min out:** Module 26 → 30-minute revision + 4 cheat sheets.

## 🔑 The Golden Rules
1. Event loop: drain ALL microtasks → 1 macrotask → repeat. `setTimeout(0)` isn't immediate.
2. Closure = function + its captured lexical environment.
3. `this` = call site; arrows capture it lexically.
4. Inheritance is prototype-based; `class` is sugar.
5. Use `===`; `==` coerces.
6. Stack = primitives, heap = objects (GC by reachability, handles cycles).
7. Keep object shapes stable → V8 hidden classes + inline caches stay fast.
8. Parallelize independent awaits with `Promise.all`. Measure before optimizing.
