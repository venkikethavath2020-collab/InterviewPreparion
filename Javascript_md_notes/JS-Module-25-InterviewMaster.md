# JS MODULE 25: JAVASCRIPT INTERVIEW MASTER SECTION
> Format: **Q — concise answer.** Drill these. Cross-reference modules for depth.

---

## PART A — CORE JAVASCRIPT (1–120)

### Types & Coercion (1–20)
1. **Primitive types?** number, string, boolean, null, undefined, symbol, bigint (+ object is non-primitive).
2. **typeof null?** `'object'` (historic bug).
3. **null vs undefined?** Intentional absence vs uninitialized.
4. **== vs ===?** Loose (coerces) vs strict (no coercion). Use ===.
5. **NaN === NaN?** false; use `Number.isNaN`.
6. **'5' + 3 vs '5' - 3?** '53' vs 2 (coercion).
7. **Truthy/falsy?** Falsy: 0, '', null, undefined, NaN, false, 0n.
8. **typeof function?** 'function'.
9. **0.1 + 0.2?** 0.30000000000000004 (float). Use epsilon/toFixed.
10. **Pass by value or reference?** Primitives by value, objects by reference.
11. **Symbol use?** Unique keys, protocols.
12. **BigInt?** Integers beyond 2^53-1.
13. **Number vs parseInt?** Number strict, parseInt parses prefix.
14. **String immutable?** Yes.
15. **Boxing?** Primitives temporarily wrapped to access methods.
16. **`[] == ![]`?** true (tricky coercion).
17. **null == undefined?** true; null === undefined false.
18. **void 0?** undefined.
19. **Optional chaining/nullish?** `?.` / `??`.
20. **structuredClone?** Deep clone.

### Scope/Closures/Hoisting (21–45)
21. **Hoisting?** Declarations registered in creation phase.
22. **var vs let vs const?** Function vs block scope; TDZ; const no reassign.
23. **TDZ?** let/const exist but unusable until declared.
24. **Closure?** Function + captured lexical env.
25. **Closure use cases?** Privacy, memo, debounce, currying.
26. **Lexical scope?** Decided by where defined.
27. **Scope chain?** Outer-env references for lookup.
28. **var loop trap?** Shared binding → use let.
29. **IIFE?** Immediately invoked → private scope.
30. **Function decl vs expr hoisting?** Decl callable before; expr not.
31. **Shadowing?** Inner var hides outer.
32. **Block scope?** let/const in `{}`.
33. **Accidental globals?** Undeclared assignment (non-strict).
34. **Module scope?** Per-file in ESM.
35. **Currying?** f(a)(b)(c).
36. **Memoize via closure?** Private cache.
37. **Why closures cause leaks?** Captured vars retained.
38. **`this` in closure?** Lexical for arrows; dynamic for regular.
39. **Static vs dynamic scope?** JS = static/lexical.
40. **eval scope?** Avoid; creates eval EC.
41. **Function length?** Params before defaults/rest.
42. **arguments object?** Array-like (regular fns).
43. **Rest vs arguments?** Real array vs array-like.
44. **Default params?** `f(a=1)`.
45. **Named fn expr?** Name scoped to itself (stack traces).

### this/OOP/Prototypes (46–75)
46. **What sets `this`?** Call site (new>bind>method>default).
47. **call/apply/bind?** Comma-now/array-now/returns-fn.
48. **Arrow this?** Lexical (no own).
49. **Lost this?** Extracted method → bind/arrow.
50. **new internals?** Create obj, link prototype, run ctor, return.
51. **Prototype vs __proto__?** Fn property vs object's link.
52. **Prototype chain?** Lookup up to Object.prototype→null.
53. **hasOwnProperty vs in?** Own vs whole chain.
54. **Inheritance pre-ES6?** Object.create + call.
55. **class = sugar?** Yes, over prototypes.
56. **super?** Parent ctor/method; before this.
57. **static?** On class, not instances.
58. **#private?** True privacy (ES2022).
59. **instanceof?** Walks prototype chain.
60. **Object.create(null)?** No prototype (pure dict).
61. **Prototype pollution?** Mutating Object.prototype.
62. **getter/setter?** Accessor properties.
63. **freeze vs seal?** No-change vs edit-only (shallow).
64. **Object.assign/spread?** Shallow copy.
65. **Deep clone?** structuredClone.
66. **Property descriptors?** writable/enumerable/configurable.
67. **Mixins?** Object.assign multiple behaviors.
68. **Symbol.iterator?** Makes object iterable.
69. **Composition vs inheritance?** Prefer composition.
70. **Class field arrow?** Auto-binds this (per-instance).
71. **Object key order?** Integer keys ascending, then insertion.
72. **Map vs Object?** Any keys, ordered, size, no prototype keys.
73. **Set?** Unique values.
74. **WeakMap?** Object keys, GC-able.
75. **JSON limitations?** No functions/undefined/dates/cycles.

### Async/Event Loop (76–105)
76. **Event loop?** Drain microtasks → 1 macrotask → repeat.
77. **Micro vs macrotask?** Promise/await vs setTimeout/IO.
78. **setTimeout(0) immediate?** No (after sync+micro).
79. **Promise states?** pending→fulfilled/rejected (once).
80. **then/catch/finally?** Success/error/always (microtasks).
81. **all/allSettled/race/any?** fail-fast/all-results/first-settle/first-fulfill.
82. **async returns?** A promise.
83. **await blocks thread?** No, pauses the function.
84. **await = microtask?** Continuation yes.
85. **Sequential vs parallel awaits?** Promise.all for independent.
86. **forEach + async bug?** Doesn't await → for...of/map+all.
87. **Unhandled rejection?** Node crashes (15+).
88. **queueMicrotask?** Schedule a microtask.
89. **Callback hell fix?** Promises/async-await.
90. **Promisify?** Callback → promise.
91. **Build promise?** settle-once + queueMicrotask + new promise.
92. **Top-level await?** ESM only.
93. **Promise chaining return?** Pass value / await promise.
94. **race for timeout?** Promise.race([fetch, timeout]).
95. **AbortController?** Cancel fetch.
96. **Debounce vs throttle?** After-stop vs per-interval.
97. **requestAnimationFrame?** Before paint.
98. **MutationObserver?** Microtask on DOM change.
99. **setInterval drift?** Use recursive setTimeout.
100. **Generators + async?** Pause/resume basis.
101. **Web Worker?** Parallel thread (no DOM).
102. **Why single-threaded works?** Event loop + async APIs.
103. **Microtask starvation?** Floods block rendering.
104. **Node vs browser loop?** Phases + nextTick vs micro/macro.
105. **Promise.resolve(thenable)?** Adopts it.

### Engine/Modules/Perf/Advanced (106–120)
106. **JIT?** Interpret then optimize hot code.
107. **Ignition/TurboFan?** Interpreter/optimizer.
108. **Hidden classes?** Object shapes for fast access.
109. **Inline caching?** Cache property lookups (mono>poly>mega).
110. **Deopt cause?** Type/shape changes.
111. **CJS vs ESM?** Sync/value vs async/live-binding/tree-shake.
112. **Tree shaking?** Remove unused exports (ESM).
113. **Dynamic import?** Lazy code-split (Promise).
114. **GC algorithm?** Mark-and-sweep (reachability).
115. **Memory leaks?** Globals/timers/detached DOM/listeners/closures.
116. **Proxy?** Intercept ops (Vue reactivity).
117. **Reflect?** Default ops (pair with Proxy).
118. **Iterator protocol?** next()→{value,done}.
119. **Symbol.for?** Global registry.
120. **Reflow vs repaint?** Geometry vs pixels.

---

## PART B — TOP EVENT LOOP QUESTIONS (50)
Output prediction (sync/micro/macro ordering) · why setTimeout(0) isn't immediate · micro fully drained per tick · await continuation timing · nested promise+timer · microtasks added during drain · queueMicrotask vs setTimeout · requestAnimationFrame timing · setInterval pitfalls · Node phases vs browser · process.nextTick · starvation · Promise.resolve().then ordering · how async/await maps to queues. *(Module 11, 12, 13.)*

## PART C — TOP CLOSURE QUESTIONS (50)
Definition + internals ([[Environment]]/heap) · var-loop trap (+3 fixes) · implement debounce/throttle/memoize/once/curry · data privacy/module pattern · each closure own env · memory leaks via closures · closures + event loop · private counter · partial application · closures vs classes for privacy. *(Module 5.)*

## PART D — TOP PROTOTYPE QUESTIONS (50)
prototype vs __proto__ · chain lookup · implement new/inheritance · class desugaring · hasOwnProperty vs in · Object.create(null) · prototype pollution · instanceof internals · shared methods/memory · constructor property fix · mixins · extending built-ins (bad) · property shadowing. *(Module 8, 9.)*

## PART E — TOP ASYNC QUESTIONS (50)
Promise states/lifecycle · build promise · all/allSettled/race/any · async/await desugar · error handling patterns · sequential vs parallel · forEach async bug · timeout/cancellation · retry+backoff · concurrency limit · unhandled rejection · top-level await · promisify · thenables · chaining returns. *(Module 12, 13.)*

## PART F — TOP SCENARIO QUESTIONS (50)
- API spammed on input → debounce + cancel.
- 3 independent awaits slow → Promise.all.
- Memory grows over time → leak (listeners/timers/closures).
- this lost in callback → bind/arrow.
- Loop+setTimeout logs wrong values → var/let.
- Frozen object's nested value changes → shallow freeze.
- Function slow after mixed types → deopt.
- Huge list janks → virtualize.
- Token stolen → localStorage XSS.
- CORS error → fix server headers.
- Circular dep undefined → restructure.
- JSON clone drops Date → structuredClone.
- forEach async doesn't wait → for...of.
- Scroll handler janks → throttle + rAF.
- Big bundle → code split.
*(Each: diagnose → root cause → fix.)*

## PART G — TOP DEBUGGING QUESTIONS (50)
1. Memory leak? → heap snapshots, check listeners/timers/detached DOM.
2. Why undefined? → hoisting/TDZ/scope.
3. this wrong? → call site / arrow.
4. Async order surprising? → micro/macro.
5. Promise never resolves? → missing resolve / unhandled.
6. Infinite loop/freeze? → blocking main thread.
7. Stale closure value? → captured binding.
8. NaN result? → coercion / parse.
9. Off-by-one in loop? → var leak.
10. Event fires multiple times? → duplicate listeners.
11. CORS blocked? → server headers.
12. Reflow jank? → layout thrashing.
13. Deopt slowness? → --trace-deopt, shapes.
14. Unhandled rejection? → add catch.
15–50: race conditions, double fetch, setTimeout drift, prototype pollution, detached nodes, `==` bugs, floating point, KeepAlive/state, source maps, etc.

---

## How To Answer (interviewer expectations)
- **Why asked:** depth of mental model (event loop, closures, prototypes, `this`, engine), not memorization.
- **Structure:** definition → internal why → trade-off → example → predict output → follow-up.
- **Common follow-ups:** "How does it work internally?" "Predict the output." "What breaks it?" "How would you optimize/debug at scale?"

➡️ Next: **Module 26 — Revision Sheets.**
