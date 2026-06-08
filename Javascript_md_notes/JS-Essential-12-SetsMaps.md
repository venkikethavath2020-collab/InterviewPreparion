# ESSENTIAL JS — SECTION 12: SETS & MAPS

---

## 1. Set
**Definition:** A collection of **unique values** (any type). Maintains insertion order; no duplicates.
```js
const s = new Set([1, 2, 2, 3]);   // {1,2,3}
s.add(4); s.has(2); s.delete(1); s.size;   // 4 → true → → 3
[...s];                            // array
s.forEach(v => {});
for (const v of s) {}
// dedup an array
[...new Set([1,1,2,3,3])];         // [1,2,3]
```
- Uniqueness uses **SameValueZero** (like `===` but `NaN` equals `NaN`).
- Objects compared by **reference** (`{}` ≠ `{}`).
```js
new Set([NaN, NaN]).size;          // 1 (NaN dedup'd)
new Set([{}, {}]).size;            // 2 (different references)
```

## 2. WeakSet
**Definition:** Set of **objects only**, held **weakly** (GC-able). Not iterable, no `size`.
```js
const ws = new WeakSet();
let obj = {};
ws.add(obj); ws.has(obj);
obj = null;   // entry auto-removed by GC
```
**Use:** tag/track objects (e.g., "seen"/"processed") without preventing garbage collection.

## 3. Map
**Definition:** Key-value collection where **keys can be ANY type** (objects, functions, NaN), maintains **insertion order**, has `size`.
```js
const m = new Map([['a', 1], ['b', 2]]);
m.set('c', 3); m.get('a'); m.has('b'); m.delete('a'); m.size;
for (const [k, v] of m) {}
m.forEach((v, k) => {});
[...m.keys()]; [...m.values()]; [...m.entries()];
// object keys!
const objKey = {};
m.set(objKey, 'data');  m.get(objKey);   // works (reference)
```

## 4. WeakMap
**Definition:** Map with **object-only keys**, held **weakly** (entry GC'd when key has no other refs). Not iterable, no `size`.
```js
const wm = new WeakMap();
let el = document.getElementById('x');
wm.set(el, { clicks: 0 });   // attach private data to a DOM node
el = null;                   // entry auto-removed
```
**Use:** private per-object data, caches/metadata keyed by objects, DOM node → data (no leak).

## 5. Internal Storage & GC Behavior
- **Map/Set:** hash-table-backed → average **O(1)** add/get/has/delete. Hold **strong** references → keys/values live as long as the Map/Set does (leak risk if unbounded).
- **WeakMap/WeakSet:** keys held **weakly** → when a key object becomes otherwise unreachable, the GC reclaims it and removes the entry. **Not iterable** (can't enumerate weak refs; their contents are non-deterministic w.r.t. GC) and no `size`.
```
Map  ──strong──► key/value (kept alive → potential leak if forgotten)
WeakMap ─weak──► key (GC'd when no other refs → auto cleanup)
```

## 6. Performance Benefits
- **Map vs Object for lookups:** Map is optimized for frequent add/delete and **any key type**; Object property add/delete can deopt (dictionary mode). For large dynamic key-value sets, Map is faster + cleaner.
- **Set vs Array for membership:** `set.has(x)` is **O(1)** vs `arr.includes(x)` **O(n)**. Huge win for repeated lookups.
- Map iteration order is guaranteed insertion order; Object key order has quirks (integer keys sorted first).

## 7. Comparisons

### Object vs Map
| | Object | Map |
|---|--------|-----|
| Keys | strings/symbols | **any type** |
| Order | integer keys sorted, then insertion | insertion order |
| Size | `Object.keys().length` | `.size` |
| Iteration | for...in / Object.keys | for...of / .entries (directly iterable) |
| Prototype keys | inherited (pollution risk) | none |
| Perf (frequent add/delete) | can deopt | optimized |
| JSON | native | needs conversion |
| Use | records/structs | dynamic key-value, non-string keys |

### Set vs Array
| | Set | Array |
|---|-----|-------|
| Duplicates | no | yes |
| Membership | O(1) `has` | O(n) `includes` |
| Order | insertion | indexed |
| Index access | ❌ | ✅ |
| Use | unique values, fast lookup | ordered list |

### Map vs WeakMap
| | Map | WeakMap |
|---|-----|---------|
| Keys | any | objects only |
| GC | strong (kept) | weak (auto-clean) |
| Iterable / size | ✅ | ❌ |
| Use | general | private data/metadata, no leak |

## 8. Common Mistakes
- Using Object as a map with arbitrary keys (prototype keys, coercion to strings, `__proto__` issues).
- `arr.includes` in a loop (O(n²)) instead of a Set.
- Expecting WeakMap to be iterable / have size.
- Using object keys in a Map then expecting `JSON.stringify` to work.
- Forgetting Set/Map hold strong refs (memory growth if unbounded).

## 9. Best Practices
- **Map** for dynamic/non-string keys; **Object** for fixed-shape records.
- **Set** for uniqueness + fast membership.
- **WeakMap/WeakSet** for object-keyed metadata that shouldn't prevent GC.
- Bound Map/Set size (LRU/TTL) for caches to avoid leaks.

## 10. Production Use Cases
- **Set:** dedup, visited/seen tracking, tag sets, fast permission checks.
- **Map:** caches keyed by request/object, id→entity lookup, counting (frequency map), insertion-ordered registries.
- **WeakMap:** per-DOM-node state, private class data, memoization keyed by object args.

## 11. Coding Examples
```js
// frequency count
const freq = new Map();
for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);

// fast membership
const allowed = new Set(['admin', 'editor']);
if (allowed.has(role)) {}

// memoize keyed by object (WeakMap)
const cache = new WeakMap();
function compute(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const r = expensive(obj); cache.set(obj, r); return r;
}

// Set operations
const union = (a, b) => new Set([...a, ...b]);
const intersection = (a, b) => new Set([...a].filter(x => b.has(x)));
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
```

## 12. Tricky Edge Cases
```js
new Set([NaN, NaN]).size;        // 1 (NaN dedup'd — SameValueZero)
new Set([0, -0]).size;           // 1 (0 and -0 considered same)
new Set([{}, {}]).size;          // 2 (reference)
new Set('hello');                // {'h','e','l','o'} (string iterable, dedup)

const m = new Map(); m.set(NaN, 1);
m.get(NaN);                      // 1 (NaN works as key!)
m.set('1', 'a').set(1, 'b');
m.get('1'); m.get(1);            // 'a' 'b' (distinct keys, no coercion)

JSON.stringify(new Map([['a',1]]));   // '{}' (Maps don't serialize!)
JSON.stringify([...new Map([['a',1]])]); // '[["a",1]]'
```

## 13. Output Prediction
```js
console.log([...new Set([1,1,2,3,3])]);        // [1,2,3]
console.log(new Set([NaN, NaN]).size);         // 1
console.log(new Set([{},{}]).size);            // 2
const m = new Map([['a',1]]); m.set('a',2);
console.log(m.get('a'), m.size);               // 2 1
console.log(new Set('aab').size);              // 2
console.log(JSON.stringify(new Map([['x',1]])));// '{}'
const wm = new WeakMap(); 
console.log(wm.set({}, 1).size);               // ❌ undefined / no size (TypeError on .size)
```

## Interview Questions
**🟢:** Set vs Array? · Map vs Object? · What is a WeakMap?
**🟡:** Why use Set for membership (O(1))? · When Map over Object? · Map vs WeakMap differences? · Why isn't WeakMap iterable?
**🔴:** GC behavior of WeakMap/WeakSet (weak refs). · SameValueZero (NaN/-0 in Set). · Why Object keys deopt vs Map. · Memoize with WeakMap. · Set algebra (union/intersection).
**🧩:** Dedup an array (Set). · Count character frequency (Map). · Attach private data to DOM nodes without leaks (WeakMap). · Fast permission check (Set).

## ⚡ REVISION
- **Set** = unique values (SameValueZero, NaN dedup'd), O(1) has → dedup + fast membership.
- **Map** = any-type keys, insertion order, .size, directly iterable → dynamic/non-string key-value.
- **WeakMap/WeakSet** = object keys, weak (GC-able), not iterable, no size → private metadata, no leaks.
- Map > Object for frequent add/delete + non-string keys; Set.has O(1) > Array.includes O(n).
- Maps/Sets don't JSON.stringify directly (convert via spread).

➡️ Next: **JSON.**
