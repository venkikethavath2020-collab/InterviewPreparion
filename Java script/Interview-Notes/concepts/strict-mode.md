# Strict Mode

## Definition

**Strict mode** (`"use strict";`) opts code into a restricted, safer variant of JavaScript that throws on common silent errors and disables error-prone features.

## Why It Exists

To catch mistakes early, prevent accidental globals, make code easier to optimize, and reserve syntax for future language versions.

## How to Enable

```js
"use strict";          // whole script (top of file)

function f() {
  "use strict";        // single function
}
```
> ES modules and class bodies are **always** strict.

## Internal Working — Key Differences

| Behavior | Non-strict | Strict |
|---|---|---|
| Undeclared assignment (`x = 1`) | creates a global | `ReferenceError` |
| Assign to read-only property | silently fails | `TypeError` |
| Delete a variable/function | no-op | `SyntaxError` |
| Duplicate parameter names | allowed | `SyntaxError` |
| Octal literal `0123` | allowed | `SyntaxError` |
| `this` in a plain function call | global object | `undefined` |
| Reserved words (`let`, `static`, …) | usable | `SyntaxError` |

## Example

```js
"use strict";

myVar = 10;            // ReferenceError: myVar is not defined

function showThis() {
  console.log(this);   // undefined (not the global object)
}
showThis();

const obj = {};
Object.defineProperty(obj, "p", { value: 1, writable: false });
obj.p = 2;             // TypeError (silent fail in non-strict)
```

## Interview Explanation

> "Strict mode turns silent failures into thrown errors — undeclared assignments, writing read-only props, duplicate params — and makes `this` `undefined` in plain function calls instead of the global object. Modules and classes are strict by default."

## Real-world Use Cases

* Defensive coding to surface bugs at development time.
* Standard in modern codebases (bundlers/ESM emit strict code).

## Common Mistakes

* Putting `"use strict"` after other statements (it must be the **first** statement to take effect).
* Being surprised that `this` is `undefined` in standalone functions under strict mode.

## Interview Questions

1. What does strict mode change?
2. How is `this` different in strict vs non-strict mode?
3. Where is strict mode applied automatically?
4. Give examples of errors strict mode throws that non-strict mode ignores.

## Senior-Level Discussion

* Strict mode enables certain engine optimizations by removing dynamic, hard-to-analyze behaviors (e.g. `with`, `arguments` aliasing).
* "This substitution" (default-binding to global) is disabled — relevant to `this` output questions.

## Key Takeaways

* Strict mode = fewer silent bugs, safer `this`, reserved future syntax.
* Always the first statement; modules/classes are strict automatically.

Related: [this-keyword](./this-keyword.md), [variables-and-datatypes](./variables-and-datatypes.md), [scope](./scope.md).
