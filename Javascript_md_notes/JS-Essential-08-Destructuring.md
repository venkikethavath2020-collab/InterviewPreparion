# ESSENTIAL JS — SECTION 8: DESTRUCTURING

---

## 1. Definition
**Destructuring** = syntax to **unpack** values from arrays or properties from objects into distinct variables.
**Why:** concise extraction, cleaner function params, swapping, default values, working with API responses.

## 2. Array Destructuring (by position)
```js
const [a, b] = [1, 2];              // a=1, b=2
const [, , third] = [1, 2, 3];      // skip with commas → third=3
const [x, ...rest] = [1, 2, 3, 4];  // x=1, rest=[2,3,4] (rest element)
const [p = 10, q = 20] = [1];       // p=1, q=20 (default)
[a, b] = [b, a];                    // swap (no temp var!)
const [first] = 'hi';               // 'h' (strings are iterable)
const [m, n] = new Map([['a',1]])[0]; // works on iterables
```

## 3. Object Destructuring (by key)
```js
const { name, age } = user;
const { name: userName } = user;        // rename → userName
const { role = 'guest' } = user;        // default
const { name: n = 'NA' } = user;        // rename + default
const { a, ...others } = obj;            // rest properties → others
const { x: { y } } = obj;                // nested (see below)
({ a, b } = source);                     // assignment (needs parens)
```

## 4. Nested Destructuring
```js
const user = { id: 1, address: { city: 'NYC', geo: { lat: 1 } } };
const { address: { city, geo: { lat } } } = user;
console.log(city, lat);   // 'NYC' 1
// ⚠️ address itself is NOT a variable here — only city & lat are
const { address: { zip = '00000' } = {} } = {};  // default for missing nested object
```

## 5. Default Values
- Apply when the value is **`undefined`** (NOT for `null` or other falsy).
```js
const { a = 5 } = { a: undefined };  // 5
const { b = 5 } = { b: null };       // null (null is not undefined!)
const [c = 1] = [];                  // 1
const [d = 1] = [0];                 // 0 (0 is defined)
```

## 6. Function Parameter Destructuring
```js
// object params (named args pattern)
function createUser({ name, age = 18, role = 'user' } = {}) {
  return { name, age, role };
}
createUser({ name: 'Ana' });        // {name:'Ana', age:18, role:'user'}
createUser();                       // works (default {} prevents crash)

// array params
const distance = ([x1, y1], [x2, y2]) => Math.hypot(x2-x1, y2-y1);

// React/Vue style
function Component({ title, items = [], onClick }) {}
```
**`= {}` default** is crucial — without it, calling with no arg throws (can't destructure `undefined`).

## 7. Real-World Examples
```js
// API response
const { data: { user, token }, status } = await api.login(creds);
// swap
[a, b] = [b, a];
// extract from array methods
const [min, max] = [Math.min(...nums), Math.max(...nums)];
// loop with destructuring
for (const { id, name } of users) {}
for (const [key, value] of Object.entries(obj)) {}
// import (similar syntax, not destructuring)
const { useState } = React;
// default + rename combos in config
const { timeout: ms = 3000 } = options;
```

## 8. Common Mistakes
- Destructuring `undefined`/`null` → TypeError (`const {a} = null`).
- Forgetting `= {}` default in function params.
- Expecting default to apply for `null` (only `undefined`).
- Nested destructuring of a missing object (`{a:{b}} = {}` throws) → add `= {}`.
- Needing parens for object destructuring assignment: `({a} = obj)`.

## 9. Best Practices
- Use object destructuring for function params (named, order-independent, defaults).
- Provide `= {}` / `= []` defaults to avoid crashes.
- Rename to avoid collisions; default for optional values.
- Don't over-nest (readability) — destructure one level, then again.

## 10. Performance
- Negligible; it's syntactic sugar over property access / iterator calls.
- Array destructuring uses the **iterator protocol** (works on any iterable, slight overhead vs index access in hot loops).

## 11. Production Use Cases
- React props/hooks (`const [state, setState] = useState()`), Vue composables, config objects, API response unpacking, Node `const { readFile } = require('fs')`.

## 12. Tricky Edge Cases
```js
const { a = 1 } = { a: undefined };   // 1
const { a = 1 } = { a: null };        // null
const [x = 1, y = x] = [];            // x=1, y=1 (later default uses earlier)
let a, b;
// { a, b } = obj;                    // ❌ SyntaxError (treated as block)
({ a, b } = { a: 1, b: 2 });          // ✅ parens
const { length } = 'hello';           // 5 (strings have length)
const [, , c = 'def'] = [1, 2];       // 'def'
const { x: { y } = {} } = {};         // y=undefined (default {} prevents crash)
function f({ a } = {}) {}             // f() ok; without `= {}` → throws
```

## 13. Output Prediction
```js
const [a, b, c] = [1, 2];
console.log(a, b, c);                 // 1 2 undefined

const { x = 10, y = 20 } = { x: 5 };
console.log(x, y);                    // 5 20

const { p = 1 } = { p: null };
console.log(p);                       // null

const [first, ...rest] = [1, 2, 3, 4];
console.log(first, rest);             // 1 [2,3,4]

const { a: { b } = {} } = {};
console.log(b);                       // undefined (no crash)

let m = 1, n = 2; [m, n] = [n, m];
console.log(m, n);                    // 2 1

const { name = 'guest' } = {};
console.log(name);                    // 'guest'
```

## Interview Questions
**🟢:** What is destructuring? · Array vs object destructuring? · Default values?
**🟡:** When does a default apply (undefined vs null)? · How to rename while destructuring? · Why `= {}` in function params? · Swap variables without temp.
**🔴:** Nested destructuring + defaults for missing objects. · Why does object destructuring assignment need parens? · Rest in destructuring vs rest params. · Iterator protocol behind array destructuring.
**🧩:** Function crashes when called with no args — add `= {}`. · Extract nested API fields safely. · Default for null value (handle separately). · Destructure Object.entries in a loop.

## ⚡ REVISION
- Array = by position (skip with commas, `...rest`, defaults, swap). Object = by key (rename `:`, default `=`, `...rest`).
- Defaults apply only for **undefined** (not null/falsy).
- Function params: `function f({a, b = 1} = {})` — the outer `= {}` prevents crash on no-arg call.
- Nested needs `= {}` defaults to avoid TypeError on missing objects.
- Object destructuring assignment needs parens: `({a} = obj)`.

➡️ Next: **Spread Operator.**
