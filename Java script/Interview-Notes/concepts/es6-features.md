# ES6+ Features

## Definition

**ES6 (ES2015)** introduced the modern JavaScript feature set. This is a quick-reference of the features most asked about in interviews, with examples.

---

## 1. `let` / `const` — Block Scoping
```js
{ let x = 1; const y = 2; } // x, y not visible outside the block
```
See [scope](./scope.md).

## 2. Arrow Functions — Concise + Lexical `this`
```js
const doubled = [1, 2, 3].map((n) => n * 2); // [2, 4, 6]
```
See [functions](./functions.md), [this-keyword](./this-keyword.md).

## 3. Template Literals
```js
const name = "Alice";
`Hello, ${name}!\nMulti-line supported`;
```

## 4. Destructuring
```js
const [a, b] = [1, 2];
const { id, username } = { id: 1, username: "bob" };
const { length: len } = [1, 2, 3]; // rename
```

## 5. Default Parameters
```js
const say = (msg = "hi") => msg;
```

## 6. Rest & Spread (`...`)
```js
const sum = (...vals) => vals.reduce((s, v) => s + v, 0); // rest
const merged = [...[1, 2], 3, 4];                          // spread
const obj = { ...{ x: 1 }, y: 2 };
```
See [rest-and-spread](./rest-and-spread.md).

## 7. Classes
```js
class Dog extends Animal { speak() { return `${this.name} barks`; } }
```
See [classes](./classes.md).

## 8. Promises
```js
new Promise((resolve) => resolve("done")).then(console.log);
```
See [promises](./promises.md).

## 9. Generators (lazy sequences)
```js
function* gen() { yield 1; yield 2; return 3; }
const g = gen();
g.next(); // { value: 1, done: false }
```

## 10. `for...of` — Iterate Iterables
```js
for (const n of [10, 20, 30]) console.log(n);
```
See [loops](./loops.md).

## 11. Map & Set
```js
const s = new Set([1, 2, 2]); // {1, 2}
const m = new Map([["k", "v"]]); m.get("k"); // "v"
```

## 12. Symbol — Unique Keys
```js
const sym = Symbol("id");
const obj = { [sym]: 123 };
```

## 13. Proxy & Reflect — Meta-programming
```js
const proxy = new Proxy({ a: 1 }, {
  get(t, p, r) { console.log("get", p); return Reflect.get(t, p, r); },
});
proxy.a;
```

## 14. Property Shorthand & Computed Keys
```js
const key = "score";
const player = { key, [key + "_bonus"]: 1 }; // { key: "score", score_bonus: 1 }
```

## 15. Enhanced Object Literals (methods & getters)
```js
const lib = { multiply(x, y) { return x * y; }, get pi() { return 3.14159; } };
```

## 16. Modules (ESM)
```js
// math.js
export function add(a, b) { return a + b; }
// app.js
import { add } from "./math.js";
```

## Later Additions (good to mention)
- ES2017: `async/await`, `Object.entries/values`
- ES2020: optional chaining `?.`, nullish coalescing `??`, `Promise.allSettled`, `BigInt`
- ES2021: `String.replaceAll`, logical assignment `||=`, `&&=`, `??=`
- ES2022: top-level `await`, class private fields `#`, `Object.hasOwn`
- ES2023/2024: `Array.findLast`, `Object.groupBy`, immutable array methods (`toSorted`, `toReversed`)

## Interview Questions

1. Difference between `var` and `let`/`const`.
2. What problems do arrow functions solve (and cause)?
3. Rest vs spread.
4. What are generators used for?
5. When would you use a `Symbol`?

## Key Takeaways

* ES6 modernized scoping, functions, async, collections, and modules.
* Know optional chaining, nullish coalescing, and logical assignment — heavily used today.

Related: [rest-and-spread](./rest-and-spread.md), [classes](./classes.md), [promises](./promises.md), [loops](./loops.md).
