# Highest Frequency Element (Mode)

## Difficulty
Easy

## Category
Arrays / Hash Map

## Problem Statement

Find the element that occurs most frequently in an array. On ties, return the first one to reach the max count.

## Example

```text
Input:  [1, 3, 1, 3, 2, 1]
Output: 1   (appears 3 times)
```

---

## Approach 1 — Frequency Map, Track Max While Counting

### Explanation

Build a frequency map; update the running max and result element as you go, so a single pass yields the answer.

### Time Complexity
O(n)

### Space Complexity
O(n)

### Solution

```js
const highestFrequencyElement = (arr = []) => {
  const map = new Map();
  let maxCount = 0;
  let result = null;
  for (const num of arr) {
    const count = (map.get(num) || 0) + 1;
    map.set(num, count);
    if (count > maxCount) {
      maxCount = count;
      result = num;
    }
  }
  return result;
};
```

---

## Approach 2 — Count Then Scan

### Explanation

Two passes: build the map, then find the key with the largest value. Functionally identical, sometimes clearer.

### Solution

```js
const mostFrequent = (arr = []) => {
  const freq = {};
  for (const x of arr) freq[x] = (freq[x] || 0) + 1;
  let best = null,
    max = 0;
  for (const key in freq) {
    if (freq[key] > max) {
      max = freq[key];
      best = key;
    }
  }
  return best; // object keys are strings — cast with Number(best) if needed
};
```

---

## Common Interview Follow-up Questions

1. Return **all** modes when there is a tie.
2. Return the top-k most frequent elements. (Bucket sort or a heap → LeetCode 347.)
3. Note: the object approach coerces numeric keys to strings.

## Edge Cases

* Empty array → `null`
* All unique → first element wins (every count is 1)
* Ties — first to reach max wins with the `>` comparison
* Mixed types — `Map` preserves type, object does not

## Key Takeaways

* `Map` preserves the original key types; plain objects stringify keys.
* Tracking the max during counting avoids a second pass.
