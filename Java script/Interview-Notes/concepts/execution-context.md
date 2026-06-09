# Execution Context

## Definition

An **execution context** is the environment in which JavaScript code is evaluated and executed. It holds the variables, functions, `this` binding, and scope information available to the running code.

## Why It Exists

The execution context model explains *how* the engine runs code — it underpins hoisting, scope, the scope chain, closures, and `this`.

## Types

1. **Global Execution Context (GEC)** — created once when the script starts; sets up the global object and global `this`.
2. **Function Execution Context (FEC)** — created on every function call.
3. **Eval context** — rarely used.

## Two Phases

Each context is created in two phases:

**1. Creation (Memory) Phase**
- Allocate memory for variables and functions (**hoisting**).
- `var` → `undefined`; `let`/`const` → uninitialized (TDZ).
- Function declarations → stored with full body.
- Determine `this` binding and the outer (lexical) environment reference.

**2. Execution Phase**
- Run code line by line, assigning values and invoking functions.
- Each function call pushes a new context onto the **call stack**.

## The Call Stack

```js
function a() { b(); }
function b() { console.log("in b"); }
a();
```
```text
push GEC → push a() → push b() → (log) → pop b() → pop a() → pop GEC
```
The call stack is LIFO; when it overflows you get a `RangeError: Maximum call stack size exceeded` (e.g. infinite recursion).

## Components of a Context

- **Variable Environment** — `var` bindings, function declarations.
- **Lexical Environment** — `let`/`const` bindings + reference to the outer environment (enables the scope chain & closures).
- **`this` binding** — determined by the call site (see [this-keyword](./this-keyword.md)).

## Interview Explanation

> "When code runs, the engine creates an execution context with two phases: creation (hoisting, set up scope and `this`) and execution (run line by line). Each function call adds a context to the call stack. The lexical environment's outer reference is what makes the scope chain and closures work."

## Common Mistakes

* Confusing the creation phase (hoisting) with execution.
* Assuming `let`/`const` aren't set up during creation — they are, but uninitialized (TDZ).
* Deep/infinite recursion overflowing the stack.

## Interview Questions

1. What are the two phases of an execution context?
2. What happens during the creation phase?
3. How does the call stack work?
4. How do execution contexts relate to closures and scope?

## Key Takeaways

* Context = variables + scope + `this`, built in creation then execution phases.
* Hoisting happens in the creation phase; the call stack tracks nested contexts.

Related: [hoisting](./hoisting.md), [scope](./scope.md), [closures](./closures.md), [event-loop](./event-loop.md).
