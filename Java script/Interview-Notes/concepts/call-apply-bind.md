# call, apply & bind

## Definition

`call`, `apply`, and `bind` are methods on `Function.prototype` that let you set a function's `this` explicitly and supply arguments.

- **`call`** — invokes immediately; args passed individually: `fn.call(thisArg, a, b)`
- **`apply`** — invokes immediately; args passed as an array: `fn.apply(thisArg, [a, b])`
- **`bind`** — returns a **new function** with `this` (and optional leading args) fixed, to be called later: `const g = fn.bind(thisArg, a)`

## Why It Exists

To **share/reuse** a function across objects and to control `this` — borrowing methods, partial application, and fixing context for callbacks.

## Internal Working

All three set the `this` reference for the invocation. `call`/`apply` execute right away; `bind` produces a bound copy that, when later called, applies the stored context and pre-filled arguments (partial application).

## Example

```js
function printFullName(hometown, state) {
  console.log(`${this.firstName} ${this.lastName} from ${hometown}, ${state}`);
}

const person = { firstName: "Venkatesh", lastName: "Kethavath" };

printFullName.call(person, "Hyderabad", "Telangana");          // immediate, comma args
printFullName.apply(person, ["NagarKurnool", "Telangana"]);    // immediate, array args

const bound = printFullName.bind(person, "Hyderabad", "Telangana");
bound();                                                        // deferred
```

## The Only Difference: call vs apply

> The single difference is **how arguments are passed**: `call` takes them individually; `apply` takes an array. Mnemonic: **a**pply = **a**rray.

## bind for Partial Application

```js
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2);
double(5); // 10  (a is fixed to 2)
```

## Interview Explanation

> "All three control `this`. `call` and `apply` invoke immediately — `call` with comma-separated args, `apply` with an array. `bind` returns a new function with `this` permanently set, useful for callbacks and partial application."

## Real-world Use Cases

* **Method borrowing**: `Array.prototype.slice.call(arguments)` to arrayify array-likes.
* `Math.max.apply(null, arr)` (pre-spread) to find a max from an array.
* Fixing `this` for event handlers / `setTimeout` callbacks via `bind`.
* Partial application of configuration.

## Common Mistakes

* Expecting `bind` to invoke the function — it returns a new one.
* Re-binding an already-bound function (the first bind wins).
* Forgetting that arrow functions ignore `call`/`apply`/`bind` for `this`.

## Polyfills

See [polyfills](../functions-performance/polyfills.md) for `myCall`, `myApply`, `myBind` implementations — a very common interview ask.

## Interview Questions

1. Difference between `call`, `apply`, and `bind`.
2. Implement `Function.prototype.bind` from scratch.
3. How does `bind` enable partial application?
4. Why doesn't `call` change `this` for an arrow function?

## Senior-Level Discussion

* `bind` also supports `new`-ability nuances: the bound `this` is ignored when the bound function is used as a constructor.
* Spread syntax (`fn(...args)`) has largely replaced `apply` for argument spreading.
* Binding in hot paths allocates a new function each time — cache bound functions.

## Key Takeaways

* `call`/`apply` invoke now (individual vs array args); `bind` defers with a fixed `this`.
* `bind` is the tool for partial application and stable callback context.

Related: [this-keyword](./this-keyword.md), [polyfills](../functions-performance/polyfills.md), [currying](./currying.md).
