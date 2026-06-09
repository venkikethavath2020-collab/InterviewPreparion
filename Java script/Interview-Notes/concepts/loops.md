# Loops & Iteration

## Definition

JavaScript provides several looping constructs plus functional iteration helpers. Choosing the right one depends on **what** you iterate (indices, keys, values, async), whether you need **early exit**, and prototype/performance concerns.

## The Loops

| Construct | Iterates | break/continue | Notes |
|---|---|---|---|
| `for` | index-controlled | ✅ | fastest for numeric arrays; full control |
| `while` | condition | ✅ | unknown iteration count |
| `do...while` | condition | ✅ | runs body **at least once** |
| `for...in` | enumerable **keys** (incl. inherited) | ✅ | **avoid for arrays** |
| `for...of` | **values** of any iterable | ✅ | preferred for arrays/Set/Map/strings |
| `forEach` | array values | ❌ | callback; cannot break |
| `for await...of` | async iterables | ✅ | awaits each value |

## Examples

```js
// for — index access, partial ranges, reverse
for (let i = 0; i < arr.length; i++) console.log(i, arr[i]);

// while
while (condition) { /* ... */ }

// do...while — guaranteed one run
do { /* ... */ } while (condition);

// for...of — values
for (const v of [10, 20, 30]) console.log(v);

// for...in — keys (use with caution; guard own props)
for (const key in obj) {
  if (Object.hasOwn(obj, key)) console.log(key, obj[key]);
}

// for await...of — async iteration
for await (const chunk of asyncStream) console.log(chunk);
```

## `for...in` vs `for...of`

- `for...in` → **keys** (strings), including inherited enumerable properties. Order for numeric keys is not guaranteed. **Don't use for arrays.**
- `for...of` → **values** via the iterator protocol. Use for arrays, strings, Maps, Sets, generators.

## Array Helpers

```js
arr.forEach((v, i) => {});      // side effects, no return, no break
arr.map((v) => v * 2);          // returns a NEW transformed array
arr.filter((v) => v > 1);       // returns elements passing a predicate
arr.reduce((acc, v) => acc + v, 0); // folds to a single value
```

### map vs forEach
| | `map` | `forEach` |
|---|---|---|
| Returns | new array | `undefined` |
| Purpose | transform | side effects |
| Chainable | ✅ | ❌ |

> Use `some`/`every` (which can short-circuit) or a plain `for` loop when you need to break.

## Pitfalls

* **Mutating while iterating** can skip/repeat elements — iterate a snapshot if needed.
* `for...in` on arrays surfaces prototype properties and unreliable order.
* `forEach` can't `break`/`return` out of the loop (only the current callback).

## Performance

* Classic `for` is usually fastest for numeric arrays in hot paths.
* `for...of` is clean and competitive.
* `map`/`filter` allocate new arrays — prefer readability, optimize when profiling demands it.

## Interview Questions

1. `for...in` vs `for...of` — when to use each.
2. `map` vs `forEach`.
3. How do you break out of a `forEach`? (You can't — use a different loop.)
4. Why avoid `for...in` for arrays?

## Key Takeaways

* `for...of` for values, classic `for` for index control, `for...in` only for object keys (guard own properties).
* `map` transforms and is chainable; `forEach` is for side effects.
* `for await...of` handles async iterables.

Related: [es6-features](./es6-features.md), [functions](./functions.md).
