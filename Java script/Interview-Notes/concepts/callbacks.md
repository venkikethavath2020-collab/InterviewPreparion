# Callbacks

## Definition

A **callback** is a function passed as an argument to another function, to be invoked later — after an event or the completion of a task. Callbacks are the foundation of asynchronous JavaScript.

## Why It Exists

Before promises, callbacks were the primary way to run code *after* an async operation (timer, network, I/O) finished, without blocking.

## Internal Working

The receiving function stores the callback and calls it when appropriate — synchronously (e.g. `Array.forEach`) or asynchronously (e.g. `setTimeout`, event handlers).

## Example

```js
function greeting(name) {
  console.log("Hello " + name);
}
function processUserInput(callback) {
  const name = "Alice";
  callback(name);          // invoke the passed-in function
}
processUserInput(greeting); // "Hello Alice"
```

**Asynchronous callback:**
```js
setTimeout(() => console.log("runs later"), 1000);
button.addEventListener("click", () => console.log("clicked"));
```

## Drawbacks

**Callback Hell (Pyramid of Doom)** — nested callbacks become unreadable:
```js
getUser(id, (user) => {
  getOrders(user, (orders) => {
    getDetails(orders, (details) => {
      // deeply nested, hard to follow and error-handle
    });
  });
});
```

**Error handling** is awkward — every level must propagate errors manually (the "error-first callback" convention in Node: `(err, data) => {}`).

## Solution: Promises & async/await

Promises flatten the nesting; `async/await` makes it read synchronously.
```js
const user = await getUser(id);
const orders = await getOrders(user);
const details = await getDetails(orders);
```

## Interview Explanation

> "A callback is a function passed to another function to run later. They power async code but nesting them leads to callback hell and messy error handling — which promises and async/await were created to solve."

## Real-world Use Cases

* Event listeners (`addEventListener`).
* Array iteration (`map`, `filter`, `forEach`).
* Timers (`setTimeout`, `setInterval`).
* Node-style async APIs (error-first callbacks).

## Common Mistakes

* Deep nesting → callback hell.
* Forgetting to handle the error argument (Node convention).
* "Inversion of control" — handing your callback to code you don't trust to call it correctly (once, on time).

## Interview Questions

1. What is a callback? Sync vs async callback examples.
2. What is callback hell and how do you avoid it?
3. What is the error-first callback convention?
4. How do promises improve on callbacks?

## Key Takeaways

* Callbacks are functions invoked later — the basis of async JS.
* Nesting causes callback hell; promises/async-await are the modern remedy.

Related: [promises](./promises.md), [async-await](./async-await.md), [event-loop](./event-loop.md).
