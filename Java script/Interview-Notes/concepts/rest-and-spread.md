# Rest & Spread Operators (`...`)

## Definition

Both use the three-dot `...` syntax but do opposite things:
- **Rest** — *collects* multiple elements into a single array/object.
- **Spread** — *expands* an array/object/iterable into individual elements/properties.

Context determines which one you get.

## Rest Operator

**In function parameters** — gather remaining arguments:
```js
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10  — numbers is [1,2,3,4]
```

**In array destructuring:**
```js
const [first, ...rest] = [1, 2, 3, 4];
first; // 1
rest;  // [2, 3, 4]
```

**In object destructuring:**
```js
const { name, ...details } = { name: "John", age: 30, job: "dev" };
name;    // "John"
details; // { age: 30, job: "dev" }
```

## Spread Operator

**In function calls** — pass array elements as individual args:
```js
Math.max(...[1, 2, 3, 4]); // 4
```

**In array literals** — merge / copy:
```js
const combined = [...[1, 2, 3], ...[4, 5]]; // [1,2,3,4,5]
const copy = [...original];                 // shallow copy
```

**In object literals** — merge / copy (later keys win):
```js
const merged = { ...{ a: 1, b: 2 }, ...{ b: 3, c: 4 } }; // { a:1, b:3, c:4 }
```

## Interview Explanation

> "Same syntax, opposite jobs. In a function signature or destructuring target, `...` is **rest** — it collects. Everywhere else (calls, array/object literals), it's **spread** — it expands. Rest must be the last parameter."

## Real-world Use Cases

* Variadic functions (`sum(...args)`).
* Immutable updates (`{ ...state, key: value }`) — core to React/Redux.
* Cloning and merging arrays/objects.
* Converting iterables/array-likes to arrays (`[...nodeList]`, `[...str]`).

## Common Mistakes

* **Shallow copy only** — nested objects/arrays are still shared by reference.
* Rest must be the **last** parameter (`function f(...a, b)` is a syntax error).
* Spreading a non-iterable into an array throws.

## Interview Questions

1. Difference between rest and spread.
2. How do you shallow-copy an object/array with spread? What's the caveat?
3. Convert `arguments` (array-like) to a real array.
4. How does spread help with immutable state updates?

## Key Takeaways

* Rest collects (params/destructuring); spread expands (calls/literals).
* Spread produces **shallow** copies — deep structures stay shared.
* Backbone of immutable updates in modern frameworks.

Related: [es6-features](./es6-features.md), [functions](./functions.md).
