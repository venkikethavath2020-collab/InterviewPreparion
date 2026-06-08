# JS MODULE 2: EXECUTION CONTEXT

---

## 1. What is an Execution Context (EC)
**Definition:** The **environment** in which JS code is evaluated and executed. It holds everything the code needs: variables, functions, `this`, scope.
**Why it exists:** JS needs to track *where* it is, *what variables are accessible*, and *what `this` refers to* at every point of execution.

**Types:**
| EC | When created |
|----|--------------|
| **Global EC** | Once, when script starts (`window`/`global`, `this`) |
| **Function EC** | Each time a function is **called** |
| **Eval EC** | Inside `eval()` (rare, avoid) |

---

## 2. The Call Stack (manages ECs)
ECs are managed on a **stack** (LIFO). The Global EC sits at the bottom; each function call pushes a new EC; returning pops it.
```
function a(){ b(); }
function b(){ c(); }
a();

Stack:   │ c() EC │
         │ b() EC │
         │ a() EC │
         │ Global │
         └────────┘
```

---

## 3. Two Phases of Every EC
Each EC is created in **two phases**:

### Phase 1 — Creation (Memory) Phase
- Set up the **Lexical Environment** + **Variable Environment**.
- **Hoisting happens here:**
  - `var` → allocated, initialized to **`undefined`**.
  - `let`/`const` → allocated but **uninitialized** (Temporal Dead Zone).
  - **Function declarations** → fully hoisted (entire function stored).
  - `this` → bound.
- Determine the **scope chain** (outer environment reference).

### Phase 2 — Execution Phase
- Code runs **line by line**.
- Assignments happen, functions invoked (each call creates a new EC).

```js
console.log(x);     // undefined  (creation phase hoisted var x)
var x = 10;         // execution phase assigns 10
console.log(x);     // 10
```

---

## 4. Lexical Environment vs Variable Environment
| | Lexical Environment | Variable Environment |
|---|--------------------|----------------------|
| Holds | `let`/`const` bindings + function declarations + reference to outer env | `var` bindings |
| Structure | Environment Record + outer reference | A type of Lexical Environment |
**Both** are part of every EC. The **outer reference** forms the **scope chain**.
```
Lexical Environment = {
  EnvironmentRecord: { /* local vars/functions */ },
  outer: <reference to parent lexical environment>
}
```

---

## 5. Scope Chain
**Definition:** The chain of lexical environments used to **resolve variables** — if a variable isn't found locally, JS looks in the outer environment, and so on, up to global.
```
inner EC ──outer──► middle EC ──outer──► Global EC ──outer──► null
```
Determined by **where functions are defined** (lexical/static scope), NOT where they're called.

---

## 6. `this` Binding (per EC)
`this` is set during the **creation phase** based on **how the function is called**:
| Call style | `this` |
|------------|--------|
| Global (non-strict) | `window`/`global` |
| Global (strict) | `undefined` |
| Object method `obj.fn()` | `obj` |
| Plain function call (strict) | `undefined` |
| `new Fn()` | the new instance |
| `fn.call/apply/bind(x)` | `x` |
| Arrow function | inherits `this` from enclosing scope (lexical) |
(Deep dive in Module 6.)

---

## 7. Full Internal Workflow Example
```js
var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var sq = square(n);
```
```
1. GLOBAL EC — Creation phase:
   n: undefined
   square: <function>
   sq: undefined
   this: window

2. GLOBAL EC — Execution phase:
   n = 2
   call square(2) → push NEW Function EC:
       Creation:  num: undefined, ans: undefined
       Execution: num = 2, ans = 4, return 4 → pop EC
   sq = 4
```

```
CALL STACK over time:
[Global] → [Global, square] → [Global]   (square popped after return)
```

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** declare before use; prefer `let`/`const` (block scope, TDZ catches bugs); understand `this` per call site.
**Common mistakes:** assuming `var` is block-scoped; expecting `let` to hoist as `undefined` (it's TDZ); confusing lexical scope (definition) with call site (`this`).
**Performance:** deep scope chains add minor lookup cost; avoid unnecessary nesting; engines optimize variable resolution via the lexical structure.

---

## INTERVIEW QUESTIONS
**🟢:** What is an execution context? · Types of EC? · What are the two phases?
**🟡:** Lexical vs Variable Environment? · How is the scope chain formed? · When is `this` decided? · What happens in the creation phase?
**🔴:** Walk the internal workflow of a function call (creation→execution, stack). · How does hoisting tie to the creation phase? · Lexical scope vs dynamic scope. · How does the engine resolve a variable (scope chain lookup)?
**🧩:** Predict output with var hoisting across ECs. · Explain why a closure variable persists (EC + lexical env). · Why does `this` differ between method and standalone call?

**Output prediction:**
```js
var a = 1;
function outer() {
  console.log(a);   // undefined? → No: prints 1 (a is global, not redeclared)
  var b = 2;
  function inner() { console.log(a, b); }  // 1, 2 (scope chain)
  inner();
}
outer();
```

## ⚡ REVISION
- EC = environment (variables, `this`, scope). Global / Function / Eval.
- Two phases: **Creation** (hoist: var→undefined, let/const→TDZ, fn→full; bind `this`; set scope chain) → **Execution** (run line by line).
- Lexical Env (let/const + outer ref) + Variable Env (var) per EC.
- Scope chain = outer-environment references → variable resolution.
- Managed on the **call stack** (LIFO).

➡️ Next: **Module 3 — Hoisting.**
