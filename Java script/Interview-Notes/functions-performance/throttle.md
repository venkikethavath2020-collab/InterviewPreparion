# Throttle

## Difficulty
Medium

## Category
Functions / Performance / Closures

## Definition

**Throttling** ensures a function runs at most **once per fixed interval**, no matter how many times it is called. Unlike debounce (which waits for quiet), throttle fires periodically *during* continuous activity.

## Why It Exists

To cap the execution rate of handlers attached to high-frequency events (scroll, mousemove, drag, resize) so the UI stays responsive.

## Internal Working

A closure stores the timestamp of the last execution. On each call, if enough time has passed since `last`, run the function and update `last`; otherwise ignore the call.

## Example

```js
const throttle = (fn, delay = 300) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};

const onScroll = throttle(() => console.log("scroll", window.scrollY), 200);
window.addEventListener("scroll", onScroll);
```

### Behavior Example

```text
Calls at: 0ms, 100ms, 200ms, 700ms   delay = 500ms
- 0ms   → fires (last = 0)
- 100ms → ignored (only 100ms passed)
- 200ms → ignored
- 700ms → fires (700 - 0 >= 500)
Executes at: 0ms and 700ms
```

---

## Approach with Trailing Call (Interview-Optimized)

### Explanation

The timestamp version drops the final event. A `setTimeout`-based version can guarantee a trailing call so the last event is not lost.

```js
const throttle = (fn, delay = 300) => {
  let timer = null;
  let lastArgs = null;
  return (...args) => {
    lastArgs = args;
    if (timer) return;
    fn.apply(this, args);
    timer = setTimeout(() => {
      timer = null;
      // optional trailing invocation:
      // fn.apply(this, lastArgs);
    }, delay);
  };
};
```

---

## Real-world Use Cases

* `scroll` position tracking / infinite scroll
* `mousemove` / drag handlers
* Window `resize` (continuous) 
* Rate-limiting button clicks or API polling

## Common Mistakes

* Confusing it with debounce — throttle fires *during* the burst.
* Forgetting the trailing call, dropping the final state.
* Using `Date.now()` mocking issues in tests.

## Throttle vs Debounce

| | Throttle | Debounce |
|---|---|---|
| Cadence | steady, every N ms | once after silence |
| Example | scroll position | search input |

See [debounce](./debounce.md).

## Interview Questions

1. Implement throttle with leading and trailing edges.
2. Difference between throttle and debounce — when to use each.
3. Implement throttle using `requestAnimationFrame` for rendering.

## Key Takeaways

* Throttle = "at most once per interval". Debounce = "once after it stops".
* Timestamp version is simplest; `setTimeout` version supports a trailing call.
