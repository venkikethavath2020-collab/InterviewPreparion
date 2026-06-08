# ESSENTIAL JS — SECTION 19: INTERVIEW MASTER SECTION
> Format per Q: **Answer · Explanation · Interviewer's Intention · Follow-ups.** Condensed for drilling.

---

## PART 1 — TOP 100 PRACTICAL JAVASCRIPT QUESTIONS

### Variables/Types (1–15)
1. **var vs let vs const?** — *A:* function vs block scope; TDZ; const no reassign. *Intent:* scope/hoisting basics. *FU:* loop+setTimeout output? window attachment?
2. **TDZ?** — exists-but-unusable until declared (ReferenceError). *Intent:* ES6 depth. *FU:* typeof in TDZ?
3. **Primitive types?** — string/number/boolean/null/undefined/symbol/bigint. *FU:* typeof null?
4. **Pass by value or reference?** — value of the reference (mutation visible, reassign not). *Intent:* memory model. *FU:* clone to isolate?
5. **null vs undefined?** — intentional empty vs unassigned. *FU:* `==` between them?
6. **== vs ===?** — coercion vs strict. *FU:* `[]==![]`?
7. **Why `0.1+0.2≠0.3`?** — IEEE-754. *FU:* fix (epsilon)?
8. **typeof null?** — 'object' (bug). *FU:* detect null properly?
9. **NaN check?** — `Number.isNaN`. *FU:* NaN===NaN?
10. **Falsy values?** — false,0,-0,0n,'',null,undefined,NaN. *FU:* `||` vs `??`?
11. **Symbol use?** — unique keys/protocols. *FU:* Symbol.iterator?
12. **BigInt?** — huge ints. *FU:* mix with Number?
13. **Copy object deeply?** — structuredClone. *FU:* JSON clone losses?
14. **Object equality?** — by reference. *FU:* deep equal?
15. **Coercion `'5'+1` vs `'5'-1`?** — '51' vs 4. *Intent:* `+` overload.

### Functions/Scope/Closures/this (16–35)
16. **Closure?** — fn + captured lexical env. *Intent:* core concept. *FU:* memory leak?
17. **var-loop trap?** — shared binding→3 3 3; let fixes. *FU:* IIFE fix?
18. **What sets `this`?** — call site (new>bind>method>default). *FU:* arrow?
19. **Arrow vs regular fn?** — lexical this, no arguments/new/prototype. *FU:* when not to use arrow?
20. **call/apply/bind?** — comma-now/array-now/returns-fn. *FU:* implement bind?
21. **Declaration vs expression?** — hoisting differs. *FU:* TDZ for const fn?
22. **Lexical scope?** — by definition site. *FU:* dynamic scope?
23. **IIFE?** — private scope. *FU:* module pattern?
24. **Currying?** — f(a)(b)(c). *FU:* implement?
25. **Pure function?** — same in→out, no side effects. *FU:* why memoizable?
26. **HOF?** — takes/returns function. *FU:* examples?
27. **Hoisting?** — declarations registered in creation phase. *FU:* fn vs var precedence?
28. **Debounce vs throttle?** — after-stop vs per-interval. *FU:* implement?
29. **Memoization?** — cache by args. *FU:* WeakMap variant?
30. **Lost `this` in callback?** — bind/arrow. *FU:* React reason?
31. **Default params?** — `f(a=1)`. *FU:* applies on undefined only?
32. **Rest params vs arguments?** — real array vs array-like. *FU:* arrow arguments?
33. **Scope chain?** — outer-env lookup. *FU:* resolution algorithm?
34. **Module pattern?** — closure privacy. *FU:* singleton?
35. **Recursion risk?** — stack overflow. *FU:* iterate?

### Objects/Prototypes/Classes (36–50)
36. **prototype vs __proto__?** — fn property vs object link. *Intent:* OOP depth.
37. **Prototype chain?** — lookup → Object.prototype → null. *FU:* hasOwnProperty vs in?
38. **class = sugar?** — yes over prototypes. *FU:* desugar?
39. **freeze vs seal?** — no-change vs edit-only (shallow). *FU:* deep freeze?
40. **Object.assign vs spread?** — mutate target vs new (both shallow). *FU:* deep clone?
41. **new internals?** — create/link/run/return. *FU:* implement?
42. **Private fields?** — `#x`. *FU:* vs closures?
43. **super?** — parent ctor/method (before this). *FU:* why before?
44. **Descriptors?** — writable/enumerable/configurable. *FU:* getters?
45. **Inheritance pre-ES6?** — Object.create+call. *FU:* constructor fix?
46. **Mixin?** — Object.assign behaviors. *FU:* composition vs inheritance?
47. **Property lookup?** — own→chain. *FU:* SET behavior?
48. **instanceof?** — walks chain. *FU:* Symbol.hasInstance?
49. **Object.create(null)?** — no prototype dict. *FU:* prototype pollution?
50. **Static method?** — on class. *FU:* use case?

### Async/Event Loop (51–70)
51. **Event loop?** — drain micro→1 macro→repeat. *Intent:* THE topic. *FU:* setTimeout(0)?
52. **Micro vs macro?** — Promise/await vs setTimeout/IO. *FU:* order example?
53. **Promise states?** — pending→fulfilled/rejected once. *FU:* build?
54. **async returns?** — promise. *FU:* await=microtask?
55. **all/allSettled/race/any?** — fail-fast/all/first-settle/first-fulfill. *FU:* implement all?
56. **await blocks thread?** — no, pauses fn. *FU:* parallel awaits?
57. **forEach+async bug?** — doesn't await. *FU:* fix (for...of/map+all)?
58. **fetch reject on 404?** — no, check res.ok. *FU:* why?
59. **unhandled rejection?** — Node crashes. *FU:* global handler?
60. **Callback hell fix?** — promises/async. *FU:* promisify?
61. **Sequential vs parallel?** — Promise.all for independent. *FU:* concurrency limit?
62. **queueMicrotask?** — schedule microtask. *FU:* vs setTimeout?
63. **setTimeout min delay?** — clamped ~4ms nested. *FU:* drift?
64. **Promise chaining?** — each then→new promise. *FU:* return value?
65. **try/catch async?** — with await. *FU:* un-awaited escapes?
66. **AbortController?** — cancel fetch. *FU:* race condition?
67. **Generators + async?** — pause/resume basis. *FU:* yield?
68. **finally + return?** — overrides try return. *FU:* gotcha?
69. **Web Worker?** — parallel thread, no DOM. *FU:* postMessage?
70. **Node vs browser loop?** — phases+nextTick vs micro/macro. *FU:* nextTick priority?

### Arrays/Strings/Objects practical (71–85)
71. **map vs forEach?** — returns array vs undefined. *FU:* side effects?
72. **slice vs splice?** — copy vs mutate. *FU:* which return?
73. **reduce use?** — accumulate. *FU:* implement?
74. **sort() weird?** — string sort default. *FU:* comparator?
75. **find vs filter?** — first vs all. *FU:* short-circuit?
76. **Dedup array?** — [...new Set()]. *FU:* objects?
77. **Flatten?** — flat(Infinity)/reduce. *FU:* iterative?
78. **String immutable?** — yes. *FU:* reverse with emoji?
79. **Reverse string?** — [...s].reverse().join. *FU:* surrogate pairs?
80. **Group by?** — reduce. *FU:* implement?
81. **map(parseInt) trap?** — [1,NaN,NaN]. *FU:* why?
82. **some vs every empty?** — false vs true. *FU:* short-circuit?
83. **Object.keys/values/entries?** — own enumerable. *FU:* symbols?
84. **Set vs Array?** — O(1) has vs O(n). *FU:* membership?
85. **Map vs Object?** — any keys, order, size. *FU:* perf?

### Browser/DOM/Storage/Modules (86–100)
86. **Reflow vs repaint?** — geometry vs pixels. *FU:* composite?
87. **Event delegation?** — one parent listener. *FU:* bubbling?
88. **localStorage vs cookie?** — client vs server-sent. *FU:* JWT storage?
89. **Where store JWT?** — httpOnly cookie/in-memory. *FU:* XSS vs CSRF?
90. **localStorage vs IndexedDB?** — sync small vs async large. *FU:* offline?
91. **CJS vs ESM?** — sync/value vs async/live/tree-shake. *FU:* dynamic import?
92. **Tree shaking?** — remove unused (ESM). *FU:* side effects?
93. **fetch vs XHR?** — promise vs event. *FU:* progress?
94. **WebSocket vs polling?** — bidirectional persistent. *FU:* SSE?
95. **Service vs Web Worker?** — proxy/offline vs CPU. *FU:* DOM access?
96. **XSS?** — injected JS. *FU:* defenses?
97. **CSRF?** — cookie-forged requests. *FU:* SameSite?
98. **CORS?** — browser cross-origin perm. *FU:* fix where?
99. **Debounce search?** — wait until stop. *FU:* cancel stale?
100. **Memory leaks?** — globals/timers/listeners/closures/detached DOM. *FU:* detect?

---

## PART 2 — TOP 50 ARRAY QUESTIONS (themes)
map/filter/reduce internals + implement · mutating vs non-mutating · slice vs splice · sort comparator + `map(parseInt)` · some/every/find/findIndex · flat/flatMap · dedup/group/flatten · time complexity + chaining passes · sparse arrays/holes · V8 packed vs dictionary · shift/unshift O(n) · Set for membership · spread copy (shallow) · immutable updates · reduce no-initial edge. *(See Essential-05.)*

## PART 3 — TOP 50 OBJECT QUESTIONS (themes)
creation ways · descriptors/enumerability · keys/values/entries/fromEntries · assign vs spread (shallow) · freeze/seal/preventExtensions · deep clone/freeze · prototype chain lookup · reference equality · hidden classes/property order · getters/setters · pick/omit/invert · optional chaining · Map vs Object · merge precedence. *(See Essential-07, Module-07/08.)*

## PART 4 — TOP 50 BROWSER QUESTIONS (themes)
DOM/reflow/repaint/composite · event delegation/bubbling/capturing · CRP (parse→layout→paint→composite) · defer/async scripts · fetch/XHR/AbortController · WebSocket/SSE/polling · Service/Web Workers · requestAnimationFrame · CORS/SOP/CSP · XSS/CSRF · layout thrashing · Web Vitals (LCP/CLS/INP). *(See Essential-17, Module-16/17/23.)*

## PART 5 — TOP 50 STORAGE QUESTIONS (themes)
cookie/localStorage/sessionStorage/IndexedDB diffs · limits/lifecycle · sync vs async (jank) · cross-tab (storage event) · cookie flags (HttpOnly/Secure/SameSite) · **JWT storage (XSS vs CSRF)** · serialize objects · quota errors · client storage not trustworthy for authz · IndexedDB transactions. *(See Essential-16.)*

## PART 6 — TOP 50 ASYNC QUESTIONS (themes)
event loop micro/macro ordering · promise states/build · all/allSettled/race/any + implement · async/await desugar + microtask · sequential vs parallel · forEach async bug · fetch res.ok · unhandled rejection · AbortController/cancellation · retry/backoff · concurrency limit · finally/return · top-level await · generators. *(See Essential-04/17, Module-11/12/13.)*

## PART 7 — TOP 50 OUTPUT PREDICTION QUESTIONS
```js
// 1
console.log(1 + '2' + 3);              // '123'
// 2
console.log('5' - 1, '5' + 1);         // 4 '51'
// 3
console.log([] + [], [] + {});         // '' '[object Object]'
// 4
console.log(null + 1, undefined + 1, true + true);  // 1 NaN 2
// 5
for (var i=0;i<3;i++) setTimeout(()=>console.log(i));  // 3 3 3
for (let i=0;i<3;i++) setTimeout(()=>console.log(i));  // 0 1 2
// 6
console.log(typeof null, typeof NaN, typeof []);  // object number object
// 7
console.log(0.1+0.2===0.3, NaN===NaN);  // false false
// 8
console.log([10,2,1].sort());          // [1,10,2]
// 9
console.log([1,2,3].map(parseInt));    // [1,NaN,NaN]
// 10
console.log('1'); setTimeout(()=>console.log('2')); Promise.resolve().then(()=>console.log('3')); console.log('4');
//  1 4 3 2
// 11
console.log({}==={}, {a:1}.a==={a:1}.a);  // false true
// 12
const o=Object.freeze({n:{x:1}}); o.n.x=9; console.log(o.n.x);  // 9
// 13
console.log([...'😀'].length, '😀'.length);  // 1 2
// 14
(async()=>{console.log('a'); await null; console.log('b');})(); console.log('c');  // a c b
// 15
console.log(JSON.stringify({a:undefined,b:()=>{},c:1}));  // '{"c":1}'
// 16
let a={x:1},b=a; b.x=2; console.log(a.x);  // 2
// 17
console.log('5'*2, '5px'*2);            // 10 NaN
// 18
console.log(0||'d', 0??'d');            // 'd' 0
// 19
function f(){try{return 1}finally{return 2}} console.log(f());  // 2
// 20
console.log([1,2,3].reduce((a,c)=>a+c));  // 6
// 21
console.log(true+1, 'a'+1, []+1);       // 2 'a1' '1'
// 22
const s=new Set([NaN,NaN,{},{}]); console.log(s.size);  // 3
// 23
console.log(void 0, +'', +'a');         // undefined 0 NaN
// 24
console.log(1<2<3, 3>2>1);              // true false
// 25
console.log([..."ab", ...[1,2]]);       // ['a','b',1,2]
```
*(Each: predict → explain coercion/loop-closure/event-loop/reference/shallow rule.)*

---

## How to Use This Section
- **Answer:** state it crisply (1 line).
- **Explanation:** the "why" (mechanism — event loop / closure / coercion / reference / prototype).
- **Interviewer's intention:** what they're really testing (mental model depth).
- **Follow-ups:** be ready for "implement it," "predict output," "what breaks it," "optimize/debug at scale."

## ⚡ FINAL ONE-LINERS
- Event loop: sync → ALL microtasks → 1 macrotask → repeat; `setTimeout(0)` isn't immediate.
- `==` coerces (use `===`); `+` concatenates if any string.
- Closure = fn + captured lexical env; var-loop → use let.
- `this` = call site; arrow = lexical.
- Objects by reference; spread/assign/freeze are shallow; structuredClone for deep.
- fetch doesn't reject on 4xx/5xx (check res.ok); forEach doesn't await.
- JWT: httpOnly cookie / in-memory, not localStorage (XSS).
- Set.has O(1) > Array.includes O(n); Map for non-string/dynamic keys.

✅ **ALL ESSENTIAL SECTIONS COMPLETE.**
