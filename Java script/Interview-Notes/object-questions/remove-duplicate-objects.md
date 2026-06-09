# Remove Duplicate Objects by Key

## Difficulty
Easy / Medium

## Category
Objects / Hash Set

## Problem Statement

Given an array of objects, remove duplicates based on a key (e.g. `id`), keeping the first occurrence.

## Example

```text
Input:
[
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 1, name: "A" }
]

Output:
[
  { id: 1, name: "A" },
  { id: 2, name: "B" }
]
```

---

## Approach 1 — Seen Set on the Key

### Explanation

Track which key values have appeared. Push an object only the first time its key is seen.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const removeDuplicateObjects = (arr = [], key = "id") => {
  const seen = new Set();
  const result = [];
  for (const obj of arr) {
    if (!seen.has(obj[key])) {
      seen.add(obj[key]);
      result.push(obj);
    }
  }
  return result;
};
```

---

## Approach 2 — Map Keyed by Property (Last Wins)

### Explanation

A `Map` keyed by the property naturally keeps one entry per key. Iterating normally keeps the **last** occurrence; reverse first to keep the first.

### Solution

```js
const dedupeByKey = (arr, key = "id") =>
  [...new Map(arr.map((obj) => [obj[key], obj])).values()];
```

---

## Find the Student with Highest Marks (Related Pattern)

```js
const studentWithHighestMarks = (arr = []) =>
  arr.reduce((best, s) => (s.marks > (best?.marks ?? -Infinity) ? s : best), null);
```

---

## Common Interview Follow-up Questions

1. De-duplicate by a **composite** key (multiple properties).
2. Keep the last occurrence instead of the first.
3. Deep-compare entire objects (`JSON.stringify` as a key — beware key order).

## Edge Cases

* Empty array → `[]`
* No duplicates → unchanged
* Missing key on some objects → all treated as `undefined` key
* Deep equality vs key equality

## Key Takeaways

* A `Set`/`Map` on the dedupe key is O(n).
* The `Map(arr.map(...))` trick keeps the **last** occurrence — reverse to keep the first.
