# Scope & Lexical Scope

## Definition

**Scope** is the region of code where a binding (variable/function) is accessible. JavaScript uses **lexical (static) scope** — accessibility is determined by where code is *written*, not where it is called.

## Why It Exists

Scope provides isolation and predictability: it controls visibility, prevents naming collisions, and underpins closures.

## Internal Working

Scopes nest. A lookup for an identifier checks the current scope, then each enclosing scope, up to the global scope (the **scope chain**). The first match wins.

- **Global scope** — accessible everywhere.
- **Function scope** — `var` and function declarations are scoped to the enclosing function.
- **Block scope** — `let`/`const` are scoped to the nearest `{ }` block.

## Example

```js
{
  let x = 1;       // block-scoped
  const y = 2;
  console.log(x, y);
}
// console.log(x); // ReferenceError — x not visible here

function outer() {
  let a = "outer";
  function inner() {
    console.log(a); // lexical access to outer's scope
  }
  inner();
}
```

## var vs let vs const

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block | block |
| Hoisting | `undefined` | TDZ | TDZ |
| Re-declare | yes | no | no |
| Re-assign | yes | yes | no |

```js
for (var i = 0; i < 3; i++) {}
console.log(i); // 3 — var leaks out of the block

for (let j = 0; j < 3; j++) {}
// console.log(j); // ReferenceError — block-scoped
```

## Interview Explanation

> "JavaScript is lexically scoped — a function can access variables from where it was defined. `var` is function-scoped; `let`/`const` are block-scoped. Identifier resolution walks the scope chain outward to global."

## Real-world Use Cases

* Encapsulating helpers inside functions/modules.
* Avoiding global pollution.
* Per-iteration bindings with `let` in loops (fixes the closure-in-loop bug).

## Common Mistakes

* Relying on `var` leaking out of blocks.
* Accidental globals (assigning without `var`/`let`/`const` in non-strict mode).
* Shadowing variables and confusing which binding is used.

## Interview Questions

1. Lexical vs dynamic scope.
2. Difference between function scope and block scope.
3. Why does `var` in a `for` loop leak, and how does `let` fix the closure problem?
4. What is the scope chain?

## Senior-Level Discussion

* Lexical scope is the foundation of closures — see [closures](./closures.md).
* Modules introduce module scope (top-level `let`/`const`/`function` are not global).
* The TDZ is a scope-entry phenomenon (see [hoisting](./hoisting.md)).

## Key Takeaways

* Lexical scope = defined-where, not called-where.
* `var` → function scope; `let`/`const` → block scope.
* The scope chain resolves identifiers outward to global.

Related: [closures](./closures.md), [hoisting](./hoisting.md), [execution-context](./execution-context.md).
