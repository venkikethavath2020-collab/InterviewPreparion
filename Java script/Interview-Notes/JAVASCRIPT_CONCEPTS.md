# 🧠 JavaScript Concepts

> Theory and internals, each as a self-contained guide with interview answers, common mistakes, and a senior-level discussion. This is your one-stop revision sheet for conceptual rounds.

[← Back to Master Guide](./MASTER_INTERVIEW_GUIDE.md)

## Table of Contents
1. [Language Fundamentals](#language-fundamentals)
2. [Scope, Hoisting & Execution](#scope-hoisting--execution)
3. [Functions & `this`](#functions--this)
4. [Objects & Prototypes](#objects--prototypes)
5. [Asynchronous JavaScript](#asynchronous-javascript)
6. [ES6+ & Modern Syntax](#es6-modern-syntax)
7. [Browser & Performance](#browser--performance)

---

## Language Fundamentals

| Concept | One-liner |
|---|---|
| [Variables & Data Types](./concepts/variables-and-datatypes.md) | 7 primitives vs reference types; `var`/`let`/`const`; `typeof null` quirk |
| [Type Coercion](./concepts/type-coercion.md) | implicit vs explicit; `==` vs `===`; falsy values; `+` overloading |
| [Strict Mode](./concepts/strict-mode.md) | turns silent failures into errors; `this` → `undefined` |

## Scope, Hoisting & Execution

| Concept | One-liner |
|---|---|
| [Scope](./concepts/scope.md) | lexical scope; function vs block; scope chain |
| [Hoisting](./concepts/hoisting.md) | declarations move up; TDZ for `let`/`const` |
| [Execution Context](./concepts/execution-context.md) | creation vs execution phase; call stack |
| [Closures](./concepts/closures.md) | function + retained lexical environment |

## Functions & `this`

| Concept | One-liner |
|---|---|
| [Functions](./concepts/functions.md) | first-class, declarations vs expressions, arrow, HOF, pure |
| [`this` Keyword](./concepts/this-keyword.md) | call-site binding: new > explicit > implicit > default |
| [call / apply / bind](./concepts/call-apply-bind.md) | set `this`; immediate (args/array) vs deferred |
| [Currying](./concepts/currying.md) | `f(a,b,c)` → `f(a)(b)(c)`; partial application |
| [Rest & Spread](./concepts/rest-and-spread.md) | collect vs expand; shallow copies |

## Objects & Prototypes

| Concept | One-liner |
|---|---|
| [Objects](./concepts/objects.md) | creation, methods, freeze vs seal, shallow/deep copy |
| [Prototype & Chain](./concepts/prototype.md) | shared methods; lookup up the chain |
| [Classes](./concepts/classes.md) | sugar over prototypes; `extends`/`super`/static |

## Asynchronous JavaScript

| Concept | One-liner |
|---|---|
| [Callbacks](./concepts/callbacks.md) | functions invoked later; callback hell |
| [Promises](./concepts/promises.md) | pending → settled; `all`/`allSettled`/`race`/`any` |
| [Async / Await](./concepts/async-await.md) | sugar over promises; parallel vs sequential |
| [Event Loop](./concepts/event-loop.md) | call stack + microtask/macrotask queues |

## ES6+ & Modern Syntax

| Concept | One-liner |
|---|---|
| [ES6+ Features](./concepts/es6-features.md) | let/const, arrow, destructuring, generators, Map/Set, Symbol, Proxy |
| [Loops & Iteration](./concepts/loops.md) | for / for-of / for-in / forEach / map; when to use each |

## Browser & Performance

| Concept | One-liner |
|---|---|
| [Web Storage](./concepts/web-storage.md) | localStorage vs sessionStorage vs cookies vs IndexedDB |
| [Memory Leaks & GC](./concepts/memory-leaks.md) | mark-and-sweep; leak sources; WeakMap |
| [Debounce](./functions-performance/debounce.md) | wait until activity stops |
| [Throttle](./functions-performance/throttle.md) | at most once per interval |
| [Memoization](./functions-performance/memoize.md) | cache pure-function results |
| [Polyfills](./functions-performance/polyfills.md) | implement call/apply/bind/map/filter/reduce |

---

## 🎤 Most-Asked Conceptual Questions (rapid revision)

1. **Closures** — what & a use case → [closures](./concepts/closures.md)
2. **`this` rules** → [this-keyword](./concepts/this-keyword.md)
3. **Event loop output prediction** → [event-loop](./concepts/event-loop.md)
4. **`var` vs `let` vs `const`** → [variables](./concepts/variables-and-datatypes.md)
5. **Hoisting & TDZ** → [hoisting](./concepts/hoisting.md)
6. **Promise combinators** → [promises](./concepts/promises.md)
7. **Prototype chain** → [prototype](./concepts/prototype.md)
8. **Debounce vs throttle** → [debounce](./functions-performance/debounce.md) / [throttle](./functions-performance/throttle.md)
9. **`==` vs `===` & coercion** → [type-coercion](./concepts/type-coercion.md)
10. **call/apply/bind difference** → [call-apply-bind](./concepts/call-apply-bind.md)

---

**Back to:** [Master Guide](./MASTER_INTERVIEW_GUIDE.md) · [Top 100](./TOP_100_INTERVIEW_QUESTIONS.md)
