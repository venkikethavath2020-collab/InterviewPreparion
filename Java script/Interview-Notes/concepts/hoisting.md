# Hoisting

## Definition

**Hoisting** is JavaScript's behavior of moving declarations (not initializations) to the top of their containing scope during the compilation phase, before code executes. You can reference some identifiers before their textual declaration.

## Why It Exists

During the **creation phase** of an execution context, the engine scans the scope and allocates memory for declarations. Function declarations get their full body; `var` gets `undefined`; `let`/`const` are registered but left uninitialized (the Temporal Dead Zone).

## Internal Working

| Declaration | Hoisted? | Initial value before the line runs |
|---|---|---|
| `function foo(){}` | Yes (fully) | the function |
| `var x` | Yes | `undefined` |
| `let x` / `const x` | Yes (registered) | uninitialized → TDZ → `ReferenceError` |
| `class X {}` | Yes (registered) | uninitialized → TDZ |
| Function expression / arrow | Only the variable | follows `var`/`let`/`const` rules |

## Example

**Variable hoisting (`var`):**
```js
console.log(x); // undefined  (declaration hoisted, assignment not)
var x = 5;
console.log(x); // 5
```

**Temporal Dead Zone (`let`/`const`):**
```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

**Function declaration vs expression:**
```js
greet();              // "Hello"  ✅ fully hoisted
function greet() { console.log("Hello"); }

greet2();             // TypeError: greet2 is not a function
var greet2 = function () { console.log("Hi"); }; // var → undefined at call time
```

## Interview Explanation

> "Hoisting means declarations are processed before execution. Function declarations are hoisted with their body, so they're callable early. `var` is hoisted and initialized to `undefined`. `let` and `const` are hoisted but stay in the Temporal Dead Zone until their declaration runs, so accessing them early throws a ReferenceError."

## Temporal Dead Zone (TDZ)

The span from entering the scope until a `let`/`const` declaration is evaluated. The binding exists but cannot be read or written — enforcing declare-before-use and catching bugs early.

## Real-world Use Cases

* Understanding why function declarations can be called before their definition (helper-first code style).
* Diagnosing `ReferenceError` / `undefined` bugs from declaration order.

## Common Mistakes

* Assuming `let`/`const` are *not* hoisted — they are, just not initialized.
* Relying on `var` hoisting for readability — prefer `let`/`const`.
* Calling a function **expression** before its assignment line.

## Interview Questions

1. What is hoisting? What exactly gets hoisted?
2. Difference between hoisting of `var`, `let`, `const`, and function declarations.
3. What is the Temporal Dead Zone?
4. Why does calling a function expression early throw, but a declaration doesn't?

## Senior-Level Discussion

* Hoisting is an artifact of the two-phase (creation → execution) model of execution contexts.
* TDZ exists specifically to make `const` meaningful and to surface use-before-init errors.
* Block-scoped function declarations have implementation-specific hoisting behavior across strict/non-strict mode.

## Key Takeaways

* Declarations are hoisted; initializations are not.
* `var` → `undefined`; `let`/`const`/`class` → TDZ → `ReferenceError`.
* Function declarations are fully hoisted; expressions are not.

Related: [scope](./scope.md), [closures](./closures.md), [execution-context](./execution-context.md), [variables-and-datatypes](./variables-and-datatypes.md).
