# ESSENTIAL JS — SECTION 5: ARRAYS

---

## 1. Array Internals & Memory Model
**Definition:** An array is a special **object** with integer-like keys + a `length` property. Ordered, dynamic, heterogeneous, heap-stored.
**V8 internals:**
- **Packed (fast) elements:** dense arrays with contiguous indices + uniform-ish types → backed by a real contiguous array (C-like) → fast.
- **Holey / dictionary (slow) elements:** sparse arrays ("holes") or huge sparse ranges → switch to **dictionary (hash) mode** → slow access, more memory.
- V8 tracks **elements kinds**: `PACKED_SMI` (small ints) → `PACKED_DOUBLE` → `PACKED_ELEMENTS` (objects) → and HOLEY variants. Kind can only "degrade," never upgrade → keep arrays **dense + monomorphic**.

## 2. Sparse Arrays
```js
const a = [1, , 3];        // hole at index 1
a.length;                  // 3
a[1];                      // undefined (but it's a HOLE, not a stored undefined)
1 in a;                    // false (hole) vs true if explicitly undefined
a.forEach(x => {});        // SKIPS holes
new Array(3);              // [ <3 empty> ] — length 3, all holes
```
**Why avoid:** holes force dictionary mode (slow) + iteration methods skip them inconsistently. Prefer `Array.from({length:n})` / `.fill()`.

## 3. Mutating Methods (change the array)
| Method | Action | Returns | Complexity |
|--------|--------|---------|-----------|
| `push(x)` | add to end | new length | O(1) amortized |
| `pop()` | remove last | element | O(1) |
| `shift()` | remove first | element | **O(n)** (reindex) |
| `unshift(x)` | add to front | new length | **O(n)** (reindex) |
| `splice(i, del, ...add)` | add/remove anywhere | removed array | O(n) |
| `sort(cmp)` | sort in place | same array | O(n log n) |
| `reverse()` | reverse in place | same array | O(n) |
| `fill(v)` | fill range | same array | O(n) |

## 4. Non-Mutating Methods (return new)
| Method | Action | Complexity |
|--------|--------|-----------|
| `slice(s, e)` | copy a range | O(n) |
| `concat(...)` | merge into new array | O(n) |
| `join(sep)` | array → string | O(n) |
| `includes(x)` | boolean search | O(n) |
| `indexOf(x)` | index or -1 | O(n) |
| `flat(depth)` | flatten | O(n) |

## 5. Iteration Methods (non-mutating, callback `(el, i, arr)`)
| Method | Returns | Short-circuits | Complexity |
|--------|---------|----------------|-----------|
| `map` | new array (transform) | ❌ | O(n) |
| `filter` | new array (subset) | ❌ | O(n) |
| `reduce` | accumulated value | ❌ | O(n) |
| `find` | first element / undefined | ✅ | O(n) |
| `findIndex` | first index / -1 | ✅ | O(n) |
| `some` | boolean (any) | ✅ | O(n) |
| `every` | boolean (all) | ✅ | O(n) |
| `flatMap` | map + flatten 1 level | ❌ | O(n) |
```js
[1,2,3].map(x=>x*2);            // [2,4,6]
[1,2,3,4].filter(x=>x%2===0);  // [2,4]
[1,2,3].reduce((a,c)=>a+c,0);  // 6
[1,2,3].find(x=>x>1);          // 2
[1,2,3].some(x=>x>2);          // true
[1,2,3].every(x=>x>0);         // true
[1,[2,[3]]].flat(Infinity);    // [1,2,3]
[1,2].flatMap(x=>[x,x*2]);     // [1,2,2,4]
```

## 6. Comparisons

### `map` vs `forEach`
| map | forEach |
|-----|---------|
| returns new array | undefined |
| transform | side effects |
| chainable | not |

### `find` vs `filter`
| find | filter |
|------|--------|
| first match (or undefined) | ALL matches (array) |
| stops early | scans all |
| O(n) but short-circuits | always O(n) |

### `slice` vs `splice`
| slice | splice |
|-------|--------|
| **non-mutating** (copy) | **mutating** (in place) |
| returns sub-array | returns removed elements |
| `slice(1,3)` | `splice(1,2,'x')` |

### `some` vs `every`
| some | every |
|------|-------|
| true if **any** passes | true if **all** pass |
| stops on first true | stops on first false |
| `[].some()` → false | `[].every()` → **true** (vacuous) |

## 7. IMPLEMENT FROM SCRATCH
```js
// map
Array.prototype.myMap = function (cb, thisArg) {
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++)
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this);  // skip holes
  return out;
};

// filter
Array.prototype.myFilter = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++)
    if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  return out;
};

// reduce (handles no initial value)
Array.prototype.myReduce = function (cb, initial) {
  let acc = initial, i = 0;
  if (arguments.length < 2) {                       // no initial value
    while (i < this.length && !(i in this)) i++;    // skip leading holes
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++)
    if (i in this) acc = cb(acc, this[i], i, this);
  return acc;
};
```
**Talking points:** callback `(el, i, arr)`, `thisArg`, skip holes (`i in this`), reduce's no-initial-value edge case + empty-array TypeError.

## 8. Common Mistakes
- `sort()` sorts as **strings** by default (`[10,2,1].sort()` → `[1,10,2]`) → pass comparator.
- `slice` vs `splice` confusion (copy vs mutate).
- `map` for side effects (wasted array).
- mutating array during iteration.
- `forEach`/`map` skip holes — sparse array surprises.
- `indexOf(NaN)` returns -1 (use `includes` which finds NaN).

## 9. Best Practices
- Prefer immutable methods (map/filter/reduce) for clarity; spread to copy.
- Pass a comparator to `sort`.
- Keep arrays **dense + same type** (V8 fast elements).
- Combine multi-pass chains into one `reduce` for huge data.
- Use `for` for hot perf-critical loops.

## 10. Performance Considerations
- `shift`/`unshift` are O(n) (reindex) → for queues use a structure or index pointers.
- Chained methods = multiple passes + intermediate arrays.
- Pre-size with `new Array(n)` cautiously (creates holes); `Array.from({length:n})` is dense.
- `includes`/`indexOf` are O(n) → use a `Set` for repeated membership checks (O(1)).

## 11. Production Use Cases
- Data transforms (map/filter/reduce) in UI/API layers.
- Dedup (`[...new Set(arr)]`), group-by (reduce), pagination (slice).
- Membership checks via Set; immutable updates in Redux/Vuex (spread/map).

## 12. Tricky Edge Cases
```js
[10,2,1].sort();              // [1,10,2] (string sort!)
[10,2,1].sort((a,b)=>a-b);    // [1,2,10]
['b','a'].sort();             // ['a','b']
[1,2,3].map(parseInt);        // [1, NaN, NaN]  (parseInt(2,1)→NaN, parseInt(3,2)→NaN)
new Array(3).fill(0);         // [0,0,0]
[1,,3].map(x=>x*2);           // [2, <empty>, 6] (hole preserved)
[].reduce((a,b)=>a+b);        // TypeError (empty, no initial)
Array(3);                     // [<3 empty>]  length 3
[1,2,3].indexOf(NaN);         // -1
[1,NaN].includes(NaN);        // true
```

## 13. Output Prediction
```js
console.log([1,2,3].map(x=>x*2).filter(x=>x>2)); // [4,6]
console.log(['1','2','3'].map(Number));          // [1,2,3]
console.log([1,2,3].map(parseInt));              // [1, NaN, NaN]
console.log([3,1,2].sort());                     // [1,2,3] (single digits ok)
console.log([10,9,100].sort());                  // [10,100,9] (string!)
console.log([1,2,3,4].reduce((a,c)=>a+c));       // 10
console.log([1,2].concat([3,4]));                // [1,2,3,4]
console.log([1,2,3].slice(1));                   // [2,3]
const a=[1,2,3]; a.splice(1,1); console.log(a);  // [1,3] (mutated)
console.log([...new Set([1,1,2,3,3])]);          // [1,2,3]
```

## Interview Questions
**🟢:** map vs forEach? · slice vs splice? · Which methods mutate? · find vs filter?
**🟡:** Implement map/filter/reduce. · Why `[10,2,1].sort()` weird? · some vs every (empty array)? · `[1,2,3].map(parseInt)` output?
**🔴:** V8 packed vs dictionary arrays / elements kinds. · reduce with no initial value. · Sparse array behavior across methods. · Time complexity of chained methods.
**🧩:** Dedup an array (Set). · Group objects by key (reduce). · Flatten deep (flat(Infinity)). · Optimize a 5-method chain on 1M items (single reduce). · Fast membership checks (Set).

## ⚡ REVISION
- Array = object with integer keys + length; keep dense+monomorphic (V8 fast elements). Avoid holes.
- Mutating: push/pop O(1), shift/unshift O(n), splice/sort/reverse/fill. Non-mutating: slice/concat/map/filter/reduce/find/some/every.
- sort() = string sort → pass comparator. `map(parseInt)` trap.
- some=any (empty→false), every=all (empty→true). find=first, filter=all.
- Implement: loop + callback `(el,i,arr)`, skip holes, reduce no-initial edge.

➡️ Next: **Strings.**
