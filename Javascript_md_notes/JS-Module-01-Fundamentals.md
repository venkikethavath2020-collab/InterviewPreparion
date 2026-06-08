# JS MODULE 1: JAVASCRIPT FUNDAMENTALS
> Senior Engineer Interview Notes — First Principles → Advanced

---

## 0. Mental Model
```
   Your JS ──► Engine (V8/SpiderMonkey) ──► parse → compile → execute
                     │
   Runtime = Engine + APIs (DOM/Node) + Event Loop + Queues
```
**One-line:** JavaScript is a **single-threaded, dynamically-typed, JIT-compiled** language that runs in a host environment (browser/Node) which provides APIs and an event loop for async behavior.

---

## 1. What is JavaScript
**Definition:** A high-level, interpreted-then-JIT-compiled, dynamically-typed, multi-paradigm (functional + OOP + event-driven) programming language conforming to the **ECMAScript** spec.
**Why it exists:** Created (1995) to add **interactivity to web pages** in the browser. Now runs everywhere (servers via Node, mobile, desktop, edge).
**Key traits:** single-threaded, non-blocking via event loop, prototype-based OOP, first-class functions, dynamic typing.

---

## 2. History
| Year | Milestone |
|------|-----------|
| 1995 | **Brendan Eich** creates JS in 10 days at Netscape ("Mocha"→"LiveScript"→"JavaScript"). |
| 1997 | **ECMAScript** standard (ECMA-262) — JS standardized. |
| 2009 | **ES5** — strict mode, JSON, array methods. **Node.js** launches (JS on server). |
| 2015 | **ES6/ES2015** — let/const, arrow fns, classes, modules, promises, generators, destructuring. (Huge release.) |
| 2016+ | Yearly releases: ES2017 async/await, ES2018 rest/spread, ES2020 optional chaining/BigInt, ES2021 `??=`, ES2022 top-level await/private fields, ES2023+ array methods. |

> "JavaScript" ≠ "Java" — named for marketing; they're unrelated.

---

## 3. ECMAScript
**Definition:** The **standardized specification** (ECMA-262) that defines the JS language (syntax, types, semantics). JavaScript is an **implementation** of ECMAScript.
- **TC39** committee governs it; proposals go through **stages 0→4**; stage 4 = shipped.
- "ES6" = ECMAScript 2015. Browsers/engines implement the spec.
**Interview Q:** *Difference between JavaScript and ECMAScript?* → ECMAScript is the spec; JS is an implementation + host APIs (DOM etc.) the spec doesn't define.

---

## 4. JavaScript Engines
**Definition:** A program that parses, compiles, and executes JS.
| Engine | Used by |
|--------|---------|
| **V8** | Chrome, Node.js, Edge, Deno |
| **SpiderMonkey** | Firefox (first-ever JS engine) |
| **JavaScriptCore (Nitro)** | Safari |
| **Chakra** | (legacy Edge) |
The engine ≠ the runtime — it only runs JS (no DOM, no `fetch`, no `fs`).

---

## 5. V8 Engine
**Definition:** Google's open-source, high-performance C++ JS engine. JIT-compiles JS to native machine code.
**Pipeline (detailed in Module 22):**
```
Source → Parser → AST → Ignition (bytecode interpreter) → TurboFan (optimizing compiler)
                                          │ profiling: hot code
                                          └─ deopt if assumptions break
```
- **Ignition:** fast-start bytecode interpreter.
- **TurboFan:** optimizes hot functions to machine code.
- **Hidden classes + inline caches** for fast property access.

---

## 6. SpiderMonkey
**Definition:** Mozilla's JS engine (the **first** ever, by Brendan Eich), powers Firefox. Has its own JIT tiers (Baseline, Warp/IonMonkey). Conceptually similar to V8 (interpreter + optimizing JIT).
**Interview point:** Different engines, same ECMAScript spec → JS behaves consistently; perf characteristics differ.

---

## 7. JavaScript Runtime
**Definition:** Engine **+** host APIs **+** event loop **+** task queues.
```
Runtime = V8  +  (Browser: DOM, fetch, setTimeout, localStorage)
                 (Node: fs, http, process, Buffer)
              +  Event Loop + Microtask/Macrotask Queues
```
`setTimeout`, `console`, `fetch` are **runtime APIs**, NOT part of the ECMAScript language.

---

## 8. Interpreted vs Compiled
| | Interpreted | Compiled |
|---|-------------|----------|
| Execution | Line-by-line at runtime | Translated to machine code ahead of time |
| Startup | Fast | Slower (compile first) |
| Runtime speed | Slower | Faster |
| Example | Classic JS, Python | C, Rust |
**JS today is BOTH:** it starts interpreting (Ignition bytecode) then **JIT-compiles** hot code (TurboFan) → best of both.

---

## 9. JIT Compilation
**Definition:** **Just-In-Time** — compile code to machine code **during execution**, using runtime profiling to optimize **hot** (frequently-run) code.
```
Run bytecode (interpret) → profile → "this fn is hot & x is always a number"
→ TurboFan compiles optimized machine code → if assumption breaks → DEOPT → bytecode
```
**Why:** combines interpreter's fast startup with compiler's fast execution.

---

## 10. Dynamic Typing
**Definition:** Variable types are determined **at runtime**, not declared. A variable can hold any type and change type.
```js
let x = 5;       // number
x = 'hello';     // now string — legal
x = [1,2];       // now array
```
**Pros:** flexible, fast to write. **Cons:** type errors surface at runtime; harder to optimize (→ TypeScript adds static types).

---

## 11. Weakly Typed Language
**Definition:** JS performs **implicit type coercion** — it auto-converts types in operations.
```js
'5' + 3      // '53'  (number → string)
'5' - 3      // 2     (string → number)
true + 1     // 2
[] + {}      // '[object Object]'
null == undefined  // true (loose equality coerces)
```
**Best practice:** use `===` (strict, no coercion); be explicit (`Number(x)`, `String(x)`). Coercion is a top source of bugs + tricky interview questions.

---

## 12. JavaScript vs TypeScript
| | JavaScript | TypeScript |
|---|-----------|------------|
| Typing | Dynamic | Static (optional) |
| Errors caught | Runtime | Compile-time |
| Compilation | None needed | Transpiles to JS |
| Tooling/IntelliSense | Basic | Rich |
| Runs in browser | Directly | After compile |
| Best for | Quick scripts, small apps | Large/team codebases |
**Key:** TS is a **superset** — all JS is valid TS; TS adds types erased at compile time (no runtime type info).

---

## 13. JavaScript vs Java
| | JavaScript | Java |
|---|-----------|------|
| Type | Dynamic, interpreted/JIT | Static, compiled (JVM bytecode) |
| OOP | Prototype-based | Class-based |
| Threading | Single-threaded + event loop | Multi-threaded |
| Typing | Weak/dynamic | Strong/static |
| Runs on | Engine (V8) / runtime | JVM |
| Relation | **None** (similar name only) | — |

---

## INTERVIEW QUESTIONS
**🟢 Beginner:** What is JS / single-threaded? · JS vs ECMAScript? · Interpreted or compiled? · Dynamic vs weak typing? · Is `setTimeout` part of JS?
**🟡 Intermediate:** What is JIT and why? · Engine vs runtime? · Name engines + what uses them. · JS vs TS (compile vs runtime errors)? · Why `'5' + 3` vs `'5' - 3`?
**🔴 Advanced:** V8 pipeline (Ignition/TurboFan/deopt)? · Why is JS both interpreted and compiled? · How does dynamic typing hurt optimization (hidden classes)? · TC39 stages?
**🧩 Scenario:** A function got slow after handling mixed types — why (deopt/megamorphic)? · Coercion bug in production (`==`) — diagnose. · Choosing JS vs TS for a 50-person team.

**Output prediction:**
```js
console.log(1 + '2' + 3);     // '123'
console.log(1 + 2 + '3');     // '33'
console.log('5' - '2');       // 3
console.log([] + []);         // ''
console.log([] + {});         // '[object Object]'
console.log(null == 0);       // false (special case!)
console.log(null >= 0);       // true (relational coerces differently)
```

## ⚡ REVISION
- JS = single-threaded, dynamic, weakly-typed, JIT-compiled, prototype-based; implements **ECMAScript**.
- Engine (V8/SpiderMonkey) runs JS; **runtime** = engine + host APIs + event loop.
- JIT: interpret (Ignition) → optimize hot code (TurboFan) → deopt on broken assumptions.
- Weak typing → implicit coercion → use `===`.
- TS = static types, compile-time errors, erased at runtime.

➡️ Next: **Module 2 — Execution Context.**
