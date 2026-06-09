# Promises

## Definition

A **Promise** is an object representing the eventual completion (**fulfilled**) or failure (**rejected**) of an asynchronous operation, along with its resulting value.

## Why It Exists

To escape **callback hell** — deeply nested callbacks with tangled error handling — by giving async work a flat, chainable, composable API.

## Internal Working

A promise has three states:
- **pending** → initial
- **fulfilled** → `resolve(value)` was called
- **rejected** → `reject(reason)` was called

Once settled (fulfilled or rejected) it is **immutable**. `.then` / `.catch` / `.finally` register reactions, which run as **microtasks** (see [event-loop](./event-loop.md)).

## Example

```js
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Resolved value");
  else reject("Rejected reason");
});

promise
  .then((value) => console.log(value))   // on fulfill
  .catch((err) => console.error(err))    // on reject
  .finally(() => console.log("done"));   // always
```

## Combinators

| Method | Resolves when | Rejects when | Returns |
|---|---|---|---|
| `Promise.all` | **all** fulfill | **any** rejects (fail-fast) | array of values |
| `Promise.allSettled` | **all** settle | never | array of `{status, value/reason}` |
| `Promise.race` | first **settles** (fulfill or reject) | first rejects | first settled result |
| `Promise.any` | first **fulfills** | **all** reject | first fulfilled value (`AggregateError` if all fail) |

```js
// Parallel API calls — fail fast:
Promise.all([fetchA(), fetchB()]).then(([a, b]) => { /* ... */ });

// Tolerate failures, get every outcome:
Promise.allSettled([p1, p2, p3]).then((results) => { /* ... */ });

// First to succeed:
Promise.any([p1, p2, p3])
  .then((first) => console.log(first))
  .catch((err) => console.log(err.errors)); // AggregateError.errors
```

## Interview Explanation

> "A promise represents a future value. It's pending until it settles to fulfilled or rejected, then it's immutable. `.then`/`.catch` chain transformations and run as microtasks. Combinators like `all`, `allSettled`, `race`, and `any` coordinate multiple promises."

## Real-world Use Cases

* `fetch` and any network/IO API.
* Running independent requests in parallel with `Promise.all`.
* Graceful aggregation with `allSettled`.
* Timeouts via `Promise.race([work, timeout])`.

## Common Mistakes

* Forgetting to `return` a promise inside `.then` — breaks the chain.
* Not handling rejections → **unhandled promise rejection**.
* Using `Promise.all` when one failure shouldn't abort the rest (use `allSettled`).
* Mixing `.then` and `await` confusingly.

## Interview Questions

1. What are the promise states? Are they reversible?
2. Difference between `all`, `allSettled`, `race`, and `any`.
3. Why do `.then` callbacks run before `setTimeout`?
4. Convert a callback-based API into a promise.

## Senior-Level Discussion

* Promise reactions are **microtasks**, so they run before macrotasks — key to output-prediction questions.
* `Promise.all` is fail-fast; the others give you finer control over partial failure.
* Promisifying callbacks (`util.promisify` in Node) bridges legacy APIs.

## Key Takeaways

* A promise settles once and is then immutable; reactions are microtasks.
* Pick the combinator by failure semantics: `all` (fail-fast), `allSettled` (tolerant), `race` (first settled), `any` (first success).

Related: [async-await](./async-await.md), [callbacks](./callbacks.md), [event-loop](./event-loop.md).
