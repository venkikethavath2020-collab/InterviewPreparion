# ESSENTIAL JS — SECTION 10: REST PARAMETERS (`...`)

---

## 1. Definition
**Rest (`...`)** **collects** multiple elements/properties into a single array/object. Same `...` token as spread, **opposite job**: spread *expands*, rest *gathers*.
**Why:** variadic functions, capturing "the rest," cleaner than the old `arguments` object.

## 2. Function Rest Parameters
```js
function sum(...nums) {            // gathers all args into a real array
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);                  // 10

function log(level, ...messages) { // rest must be LAST
  console.log(level, messages);   // messages = array of remaining args
}
log('INFO', 'a', 'b');            // 'INFO' ['a','b']
```
**Rules:** must be the **last** parameter; only **one** rest param; gives a **real Array** (unlike array-like `arguments`).

## 3. Array Rest (in destructuring)
```js
const [first, ...rest] = [1, 2, 3, 4];   // first=1, rest=[2,3,4]
const [a, , ...others] = [1, 2, 3, 4];   // a=1, others=[3,4]
const [head, ...tail] = 'abc';           // head='a', tail=['b','c']
```

## 4. Object Rest (in destructuring, ES2018)
```js
const { id, ...rest } = { id: 1, name: 'A', age: 30 };
// id=1, rest={name:'A', age:30}
// common: remove a key immutably
const { password, ...safeUser } = user;   // safeUser without password
```

## 5. Rest vs Spread (the key distinction)
| | Rest `...` | Spread `...` |
|---|-----------|--------------|
| Job | **collects** into array/object | **expands** into elements/props |
| Where | function params, destructuring LHS | function calls, array/object literals (RHS) |
| Example | `function f(...args)` / `const [a,...r]=x` | `f(...args)` / `[...arr]` / `{...obj}` |
```js
function f(...args) {}    // REST — gathers
f(...[1, 2, 3]);          // SPREAD — expands
const [x, ...rest] = arr; // REST
const copy = [...arr];    // SPREAD
```
**Mnemonic:** Rest on the **left/parameter** side (gather); Spread on the **right/call** side (scatter).

## 6. `arguments` vs Rest Parameters
| | `arguments` | rest `...args` |
|---|-------------|----------------|
| Type | array-like (not real array) | **real Array** |
| Array methods | ❌ (need Array.from) | ✅ map/reduce/etc |
| Arrow functions | ❌ not available | ✅ works |
| Includes all args | yes | only the "rest" |
| Modern | legacy | preferred |
```js
function old() { return Array.from(arguments).map(x => x*2); }  // verbose
const modern = (...args) => args.map(x => x*2);                 // clean, arrow-ok
```

## 7. Real-World Examples
```js
// variadic utilities
const max = (...nums) => Math.max(...nums);     // rest gathers, spread expands
// wrapper / decorator forwarding args
const logged = (fn) => (...args) => { console.log(args); return fn(...args); };
// omit a property immutably
const { internalFlag, ...publicData } = record;
// curry / partial
const partial = (fn, ...preset) => (...later) => fn(...preset, ...later);
// React: forward props
function Button({ variant, ...domProps }) { return <button {...domProps} />; }
```

## 8. Common Mistakes
- Rest not last (`function f(...rest, last)` → SyntaxError).
- Multiple rest params.
- Confusing rest with spread (direction).
- Using `arguments` in arrow functions (undefined → use rest).
- Expecting `arguments` to be a real array.

## 9. Best Practices
- Prefer rest over `arguments` (real array, arrow-compatible).
- Use object rest to omit keys immutably.
- Combine rest (gather) + spread (forward) for wrappers/decorators.
- Keep rest last; name it descriptively.

## 10. Performance / Memory
- Rest creates a **new array/object** holding the collected items (allocation) — fine generally; avoid in extremely hot variadic calls.
- Real arrays are more optimizable than `arguments` (which can deopt functions historically).

## 11. Production Use Cases
- Logging/utility libs (variadic), middleware/decorator wrappers (forward args), prop forwarding in React/Vue, omitting sensitive fields (`{password, ...safe}`), event emitters (`emit(event, ...args)`).

## 12. Tricky Edge Cases
```js
function f(a, b, ...rest) { return rest; }
f(1, 2, 3, 4);                    // [3,4]
f(1);                             // [] (empty, not undefined)

const [a, ...rest] = [1];
console.log(rest);                // [] (always an array)

// arguments vs rest in arrow
const arrow = (...args) => args;
arrow(1, 2);                      // [1,2]
// const bad = () => arguments;   // ReferenceError in module / refers to outer

const { x, ...y } = { x: 1 };
console.log(y);                   // {} (empty object)

function g(...args) { return args.length; }
g();                              // 0
```

## 13. Output Prediction
```js
function sum(...n) { return n.reduce((a,b)=>a+b, 0); }
console.log(sum(1,2,3));          // 6
console.log(sum());               // 0

const [first, ...others] = [10, 20, 30];
console.log(first, others);       // 10 [20,30]

const { id, ...rest } = { id: 1, a: 2, b: 3 };
console.log(rest);                // {a:2, b:3}

const f = (...args) => args.length;
console.log(f(1, 2, 3, 4));       // 4

function combine(a, ...b) { return [a, b]; }
console.log(combine(1, 2, 3));    // [1, [2,3]]
```

## Interview Questions
**🟢:** What are rest parameters? · Rest vs spread? · rest vs arguments?
**🟡:** Why must rest be last? · Why prefer rest over arguments? · Object rest use case (omit key)? · Does rest work in arrows?
**🔴:** Rest + spread together in a decorator. · Why `arguments` isn't a real array. · Implement variadic curry/partial. · Memory of rest collection.
**🧩:** Omit `password` before sending user data — object rest. · Forward all args to a wrapped function — rest+spread. · Variadic sum/max. · Replace `arguments` in an arrow function.

## ⚡ REVISION
- Rest `...` **gathers** into a real array/object (params LHS / destructuring); Spread `...` **expands** (calls/literals RHS).
- Rest must be **last**, only one, gives a real Array (vs array-like `arguments`).
- Object rest omits keys immutably (`{password, ...safe}`).
- Rest (gather) + spread (forward) = wrappers/decorators/partials.
- Prefer rest over `arguments` (arrow-compatible, real array).

➡️ Next: **Template Literals.**
