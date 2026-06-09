# Variables & Data Types

## Definition

A **variable** is a named binding to a value in memory. JavaScript has **primitive** types (immutable, copied by value) and **object/reference** types (copied by reference).

## Variable Declarations

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block | block |
| Hoisting | `undefined` | TDZ | TDZ |
| Re-assign | yes | yes | no |
| Re-declare | yes | no | no |

```js
const accountId = 1223344;        // cannot be reassigned
let email = "venki@gmail.com";    // reassignable
var password = "12345";           // avoid — function-scoped, hoisting quirks

let state;                        // undefined (declared, not assigned)
```
> **Prefer `const` by default, `let` when reassigning, avoid `var`.** In non-strict mode, assigning to an undeclared name creates an accidental global.

## Primitive Data Types (7)

| Type | Example | Notes |
|---|---|---|
| `string` | `"hello"` | immutable |
| `number` | `42`, `3.14` | IEEE-754 double; safe up to `2^53 − 1` |
| `bigint` | `123n` | arbitrary-precision integers |
| `boolean` | `true` / `false` | |
| `undefined` | `let x;` | uninitialized |
| `null` | `let y = null` | intentional absence |
| `symbol` | `Symbol("id")` | unique keys |

Primitives are **immutable** and **copied by value**.

## Object / Reference Types

`Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`, `WeakMap`, `WeakSet` — **copied by reference**.

```js
const a = { x: 1 };
const b = a;     // same reference
b.x = 9;
a.x;             // 9 — both point to the same object
```

## typeof Quirks

```js
typeof "hi";        // "string"
typeof 42;          // "number"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof null;        // "object"   ← historical bug
typeof Symbol();    // "symbol"
typeof {};          // "object"
typeof [];          // "object"   (use Array.isArray)
typeof function(){};// "function"
```

## null vs undefined

- `undefined` — a variable declared but not assigned; a missing property; a function with no return.
- `null` — an intentional "no value" you assign yourself.
- `null == undefined` → `true`; `null === undefined` → `false`.

## Map / Set / Weak Collections

- **Map** — keyed collection, any key type, insertion-ordered.
- **Set** — unique values.
- **WeakMap / WeakSet** — keys held weakly (garbage-collectable), not enumerable.

## Interview Questions

1. Difference between `var`, `let`, `const`.
2. Why is `typeof null === "object"`?
3. Primitive vs reference types — copy semantics.
4. `null` vs `undefined`.
5. When would you use a `Map` over a plain object?

## Key Takeaways

* 7 primitives (value-copied, immutable) vs objects (reference-copied).
* `typeof null === "object"` is a known quirk; use `Array.isArray` for arrays.
* Prefer `const` > `let` > (avoid) `var`.

Related: [type-coercion](./type-coercion.md), [hoisting](./hoisting.md), [scope](./scope.md).
