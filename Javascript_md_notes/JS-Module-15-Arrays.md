# JS MODULE 15: ARRAYS (Methods + Implement From Scratch)

---

## 1. Array Basics
**Definition:** Ordered, indexed collection (object with integer keys + `length`). Dynamic size, heterogeneous values, heap-stored.
**V8 internals:** arrays with contiguous integer indices use **fast (packed) elements** (backed by a real array); "holes" (sparse) or mixed types → **dictionary mode** (slower). Keep arrays dense + monomorphic.

---

## 2. The Key Methods (with complexity)
| Method | Returns | Mutates? | Complexity | Purpose |
|--------|---------|----------|-----------|---------|
| `map` | new array | ❌ | O(n) | transform each |
| `filter` | new array | ❌ | O(n) | keep matching |
| `reduce` | single value | ❌ | O(n) | accumulate |
| `forEach` | undefined | ❌ | O(n) | side effects |
| `some` | boolean | ❌ | O(n) | any match? (short-circuits) |
| `every` | boolean | ❌ | O(n) | all match? (short-circuits) |
| `find` | element/undefined | ❌ | O(n) | first match |
| `findIndex` | index/-1 | ❌ | O(n) | first match index |
| `flatMap` | new array | ❌ | O(n) | map + flatten 1 level |
| `flat` | new array | ❌ | O(n) | flatten |
| `includes/indexOf` | bool/index | ❌ | O(n) | search |
| `sort` | same array | ✅ | O(n log n) | sort (mutates!) |
| `push/pop` | length/elem | ✅ | O(1) | end ops |
| `shift/unshift` | elem/length | ✅ | O(n) | start ops (reindex) |
| `splice` | removed array | ✅ | O(n) | add/remove |
| `slice` | new array | ❌ | O(n) | copy range |

---

## 3. Examples
```js
[1,2,3].map(x => x*2);              // [2,4,6]
[1,2,3,4].filter(x => x%2===0);    // [2,4]
[1,2,3].reduce((a,c) => a+c, 0);   // 6
[1,2,3].some(x => x>2);            // true
[1,2,3].every(x => x>0);           // true
[{id:1},{id:2}].find(u => u.id===2);  // {id:2}
[1,[2,[3]]].flat(Infinity);        // [1,2,3]
[1,2,3].flatMap(x => [x, x*2]);    // [1,2,2,4,3,6]
```

---

## 4. IMPLEMENT FROM SCRATCH (interview gold)
```js
// map
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++)
    if (i in this) out.push(cb(this[i], i, this));   // skip holes
  return out;
};

// filter
Array.prototype.myFilter = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++)
    if (i in this && cb(this[i], i, this)) out.push(this[i]);
  return out;
};

// reduce (handles missing initialValue)
Array.prototype.myReduce = function (cb, init) {
  let acc = init, start = 0;
  if (arguments.length < 2) {                // no initial value
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[0]; start = 1;
  }
  for (let i = start; i < this.length; i++)
    acc = cb(acc, this[i], i, this);
  return acc;
};

// some / every (short-circuit)
Array.prototype.mySome = function (cb) {
  for (let i = 0; i < this.length; i++) if (cb(this[i], i, this)) return true;
  return false;
};
Array.prototype.myEvery = function (cb) {
  for (let i = 0; i < this.length; i++) if (!cb(this[i], i, this)) return false;
  return true;
};

// find / flatMap
Array.prototype.myFind = function (cb) {
  for (let i = 0; i < this.length; i++) if (cb(this[i], i, this)) return this[i];
  return undefined;
};
Array.prototype.myFlatMap = function (cb) {
  return this.myReduce((acc, x, i) => acc.concat(cb(x, i, this)), []);
};
```
**Talking points:** callback signature `(element, index, array)`, skipping holes (`i in this`), reduce's no-initial-value edge case, short-circuit for some/every.

---

## 5. Building map via reduce (composition question)
```js
const map = (arr, fn) => arr.reduce((acc, x, i) => (acc.push(fn(x, i)), acc), []);
const filter = (arr, fn) => arr.reduce((acc, x, i) => (fn(x,i) && acc.push(x), acc), []);
```

---

## 6. Common Patterns
```js
// unique
[...new Set(arr)];
// group by
arr.reduce((g, x) => ((g[x.key] ||= []).push(x), g), {});
// flatten deep
arr.flat(Infinity);
// sum/max
arr.reduce((a,b)=>a+b,0); Math.max(...arr);
// chaining
data.filter(x => x.active).map(x => x.name).sort();
```

---

## 7. Best Practices / Mistakes / Performance
**Best practices:** prefer immutable methods (map/filter/reduce) over loops for clarity; chain transformations; use `for` loops for perf-critical hot paths.
**Mistakes:** `sort` mutates + sorts as strings by default (`[10,2,1].sort()` → `[1,10,2]`); `map` for side effects (use forEach); forgetting reduce's initial value; sparse arrays; `forEach` can't break.
**Performance:** method chaining creates intermediate arrays (multiple passes) — combine into one reduce for huge data; keep arrays dense + same type (V8 fast elements); `for`/`for...of` faster than functional in hot loops.

---

## INTERVIEW QUESTIONS
**🟢:** map vs filter vs reduce? · Which methods mutate? · find vs filter?
**🟡:** Implement map/filter/reduce. · some vs every (short-circuit)? · Why does `sort()` give weird order? · flat/flatMap?
**🔴:** Implement reduce with no-initial-value handling. · Build map/filter via reduce. · Time complexity of chained methods (multiple passes). · V8 packed vs dictionary arrays.
**🧩:** Group/dedupe/flatten with reduce. · Optimize a 5-method chain on 1M items (single reduce). · sort numbers correctly. · Polyfill a missing method.

**Output prediction:**
```js
console.log([10, 2, 1].sort());          // [1, 10, 2] (string sort!)
console.log([10, 2, 1].sort((a,b)=>a-b)); // [1, 2, 10]
console.log([1,2,3].map(x => x*2).filter(x => x>2)); // [4, 6]
console.log(['a','b'].reduce((a,c)=>a+c)); // 'ab'
console.log([1,2,3,4].reduce((a,c)=>a+c)); // 10
console.log([,,1].map(x => 5));            // [<2 empty>, 5] (holes skipped)
```

## ⚡ REVISION
- map/filter/reduce/find/some/every — all O(n), non-mutating, callback `(el, i, arr)`.
- Mutating: sort, push/pop/shift/unshift, splice, reverse, fill.
- `sort()` is string-based by default → pass comparator; sort & splice mutate.
- Implement: loop + callback; reduce handles no-initial-value edge; some/every short-circuit.
- Chains = multiple passes; combine into reduce for huge data; keep arrays dense (V8).

➡️ Next: **Module 16 — DOM.**
