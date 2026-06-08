# 🟧 Essential JavaScript Interview Topics
> Practical, hands-on companion to the JS-Module deep-dive notes.
> Full 13-point treatment per topic · comparisons · tricky edge cases · output prediction · implement-from-scratch.

## 📚 Sections

| # | Section | Covers |
|---|---------|--------|
| 1 | [Variables & Data Types](JS-Essential-01-VariablesDataTypes.md) | var/let/const, TDZ, global attachment, primitives vs references, pass-by-value |
| 2 | [Operators](JS-Essential-02-Operators.md) | arithmetic/comparison/logical, ternary, `?.`, `??`, logical assignment, `==` vs `===`, falsy vs nullish |
| 3 | [Type Conversion](JS-Essential-03-TypeConversion.md) | implicit/explicit, coercion, `[]+[]`/`[]+{}`/`{}+[]` explained |
| 4 | [Loops](JS-Essential-04-Loops.md) | for/while/for-of/for-in/forEach, break/continue, **async loop behavior** |
| 5 | [Arrays](JS-Essential-05-Arrays.md) | internals, sparse, all methods, complexity, **implement map/filter/reduce** |
| 6 | [Strings](JS-Essential-06-Strings.md) | immutability, UTF-16, methods, reverse/palindrome/anagram |
| 7 | [Objects](JS-Essential-07-Objects.md) | descriptors, enumerability, freeze/seal, prototype lookup |
| 8 | [Destructuring](JS-Essential-08-Destructuring.md) | array/object/nested, defaults, param destructuring |
| 9 | [Spread Operator](JS-Essential-09-Spread.md) | array/object/function, shallow copy, vs assign/deep clone |
| 10 | [Rest Parameters](JS-Essential-10-Rest.md) | function/array/object rest, vs spread, vs arguments |
| 11 | [Template Literals](JS-Essential-11-TemplateLiterals.md) | interpolation, multiline, tagged templates |
| 12 | [Sets & Maps](JS-Essential-12-SetsMaps.md) | Set/WeakSet/Map/WeakMap, GC, Object vs Map, Set vs Array |
| 13 | [JSON](JS-Essential-13-JSON.md) | parse/stringify, limitations, circular refs, deep clone |
| 14 | [Date & Time](JS-Essential-14-DateTime.md) | Date object, UTC/timezones, common problems |
| 15 | [Error Handling](JS-Essential-15-ErrorHandling.md) | try/catch/finally, custom/async/global errors |
| 16 | [Browser Storage](JS-Essential-16-BrowserStorage.md) | cookies/local/session/IndexedDB, **where to store JWT** |
| 17 | [Browser APIs](JS-Essential-17-BrowserAPIs.md) | fetch, XHR, AbortController, WebSocket, Service/Web Workers |
| 18 | [Coding Patterns](JS-Essential-18-CodingPatterns.md) | **implement debounce/throttle/memoize/deepClone/polyfills/Promise.all** line-by-line |
| 19 | [Interview Master](JS-Essential-19-InterviewMaster.md) | Top 100 + array/object/browser/storage/async/output-prediction Qs |

## 🎯 How to Use
- **Hands-on prep:** read 1→19; do every "implement from scratch" + "output prediction" by hand first, then check.
- **1 day out:** Sections 2, 3, 4, 12, 16, 18 + Section 19 (Top 100 + output prediction).
- **30 min out:** the ⚡ REVISION block at the bottom of each section.

## 🔗 Relationship to the JS-Module notes
- **JS-Module-XX** = first-principles + engine/internals deep dives (event loop, prototypes, closures, V8).
- **JS-Essential-XX** (these) = practical, syntax-level, hands-on interview topics + coding patterns.
Use both: Modules for the "why/internals," Essentials for the "how/edge-cases/code."

## 🔑 Golden Rules
1. `==` coerces, use `===`; `+` concatenates if any operand is a string.
2. Objects by reference; spread/assign/freeze are **shallow** → `structuredClone` for deep.
3. Event loop: drain ALL microtasks → 1 macrotask → repeat; `setTimeout(0)` isn't immediate.
4. `forEach` doesn't await; `fetch` doesn't reject on 4xx/5xx (check `res.ok`).
5. JWT → httpOnly cookie / in-memory, not localStorage (XSS).
6. Set.has O(1) > Array.includes O(n); Map for dynamic/non-string keys.
7. Rest gathers (params/LHS); spread expands (calls/RHS).
