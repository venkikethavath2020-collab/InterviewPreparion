# Async / Await

## Definition

`async`/`await` is syntactic sugar over promises. An **`async`** function always returns a promise; **`await`** pauses the function until the awaited promise settles, yielding its value (or throwing its rejection).

## Why It Exists

To make asynchronous code read like synchronous code — flat control flow, natural `try/catch` error handling, and clear sequencing — without `.then` chains.

## Internal Working

- `async function f()` wraps the return value in a resolved promise (throws become rejections).
- `await p` suspends the function, registers a continuation as a **microtask**, and resumes once `p` settles. The rest of the program keeps running while it waits.

## Example

```js
const promise = new Promise((resolve) =>
  setTimeout(() => resolve("resolved value"), 1000)
);

async function handle() {
  console.log("Hello world");
  const result = await promise; // pauses here, non-blocking
  console.log(result);
  console.log("Namaste");
}

handle();
console.log("Runs before the awaited result"); // sync code continues
```

## Error Handling

```js
async function fetchUser() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Request failed:", error);
  }
}
```

## Sequential vs Parallel

```js
// ❌ Sequential — total time = sum (each await blocks the next)
const a = await taskA(); // 2s
const b = await taskB(); // 2s  → 4s total

// ✅ Parallel — start both, then await
const [x, y] = await Promise.all([taskA(), taskB()]); // ~2s total
```

## Interview Explanation

> "`async` makes a function return a promise; `await` unwraps a promise's value and pauses only that function, not the whole thread. It's promises under the hood — `await p` is `.then` with nicer syntax, and `try/catch` replaces `.catch`."

## Real-world Use Cases

* API calls and data fetching.
* Sequential dependent steps (await A, then use it for B).
* File / DB I/O in Node.
* Wrapping `Promise.all` for parallel independent work.

## Common Mistakes

* **Awaiting in a loop** when calls are independent — serializes them. Use `Promise.all`.
* Forgetting `try/catch` (or a `.catch` on the returned promise) → unhandled rejection.
* `await` only works inside `async` functions (or top-level in ES modules).
* Assuming `await` blocks the whole thread — it only suspends that function.

## Interview Questions

1. What does an `async` function return?
2. How do you handle errors with async/await?
3. Convert a `.then` chain to async/await.
4. How do you run multiple awaits in parallel?
5. Predict the order of logs mixing sync code, `await`, and `setTimeout`.

## Senior-Level Discussion

* `await` continuations are microtasks — they interleave with promise reactions, not macrotasks.
* `for await...of` iterates async iterables (streams, async generators) sequentially.
* Top-level `await` is available in ES modules; mind the impact on module load ordering.

## Key Takeaways

* `async` ⇒ returns a promise; `await` ⇒ pauses only that function until settle.
* Parallelize independent awaits with `Promise.all` — don't await in a loop.

Related: [promises](./promises.md), [event-loop](./event-loop.md), [callbacks](./callbacks.md).
