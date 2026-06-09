# Debounce

## Difficulty
Medium

## Category
Functions / Performance / Closures

## Definition

**Debouncing** delays invoking a function until a specified time has elapsed **since the last call**. Rapid-fire calls reset the timer; the function runs only once activity stops.

## Why It Exists

To rate-limit expensive work triggered by frequent events — search-as-you-type, window resize, autosave, form validation — so it fires once after the burst instead of on every event.

## Internal Working

A closure holds a `timer`. Each call clears the pending timer and schedules a fresh one. Only the last call within the quiet window survives to execute.

## Example

```js
const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const onSearch = debounce((q) => console.log("Searching:", q), 500);
onSearch("h");
onSearch("he");
onSearch("hello"); // only this fires, 500ms after the last keystroke
```

### Behavior Example

```text
Calls at: 0ms, 100ms, 200ms, 700ms   delay = 500ms
- 0,100,200 each reset the timer
- last of the burst is at 200ms → fires at 200+500 = 700ms
- the 700ms call fires at 700+500 = 1200ms
Executes at: 700ms and 1200ms
```

---

## Approach with Leading Edge + Cancel (Interview-Optimized)

```js
const debounce = (fn, delay = 300, immediate = false) => {
  let timer;
  const debounced = (...args) => {
    const callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);
    }, delay);
    if (callNow) fn.apply(this, args);
  };
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
};
```

---

## Real-world Use Cases

* Search input / autocomplete API calls
* Window `resize` / `scroll` handlers
* Auto-saving a draft
* Validating a form field after the user stops typing

## Common Mistakes

* Forgetting to `clearTimeout` — defeats the purpose.
* Losing `this`/arguments — forward both with `apply(this, args)`.
* Recreating the debounced function on every React render (wrap in `useCallback`/`useRef`).

## Debounce vs Throttle

| | Debounce | Throttle |
|---|---|---|
| Fires | once **after** activity stops | at most once **per interval** during activity |
| Use for | search input, resize-end | scroll position, drag, mousemove |

See [throttle](./throttle.md).

## Interview Questions

1. Implement debounce from scratch.
2. Add leading-edge (`immediate`) invocation and a `cancel` method.
3. Difference between debounce and throttle.

## Key Takeaways

* Debounce = "wait until quiet". Built on a closure over a timer id.
* Always forward `this` and arguments; expose `cancel` for cleanup.
