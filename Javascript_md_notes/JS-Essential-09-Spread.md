# ESSENTIAL JS — SECTION 9: SPREAD OPERATOR (`...`)

---

## 1. Definition
**Spread (`...`)** expands an iterable (array/string) or object's own enumerable properties into individual elements/properties. (Same token as rest, opposite job — see Section 10.)
**Why:** concise copying, merging, passing args, immutable updates.

## 2. Array Spread
```js
const a = [1, 2], b = [3, 4];
const merged = [...a, ...b];         // [1,2,3,4]
const copy = [...a];                 // shallow copy
const withExtra = [0, ...a, 5];      // [0,1,2,5]
Math.max(...[3, 1, 2]);              // 3 (spread as args)
[...'abc'];                          // ['a','b','c'] (string iterable)
[...new Set([1,1,2])];               // [1,2] (Set iterable)
[...document.querySelectorAll('li')];// NodeList → array
```

## 3. Object Spread (ES2018)
```js
const base = { a: 1, b: 2 };
const copy = { ...base };                    // shallow copy
const merged = { ...base, ...{ b: 9, c: 3 } };// {a:1, b:9, c:3} (later wins)
const updated = { ...state, name: 'new' };   // immutable update
const withDefault = { role: 'guest', ...user };// user overrides default
```

## 4. Function Spread (as arguments)
```js
const nums = [1, 2, 3];
Math.max(...nums);                   // 3
fn(...args);                         // pass array as separate args
new Date(...[2024, 0, 1]);           // spread into constructor
console.log(...['a', 'b']);          // 'a' 'b'
```

## 5. Internal Working
- **Array/string spread** uses the **iterator protocol** (`[Symbol.iterator]`) — works on any iterable.
- **Object spread** copies **own enumerable** properties (string + symbol keys), running getters (copies the resulting value, not the getter). Prototype/non-enumerable not copied.
- Creates a **new** array/object (allocation).

## 6. Copying Behavior (SHALLOW)
```js
const orig = { a: 1, nested: { x: 1 } };
const copy = { ...orig };
copy.a = 9;          // independent ✅
copy.nested.x = 9;   // ⚠️ SHARED — orig.nested.x is now 9
console.log(orig.nested.x);   // 9 (nested object shared by reference!)
```
**Top-level primitives are copied; nested objects are shared by reference.** Same for array spread.

## 7. Nested Object Problems & Deep Clone
```js
// ❌ spread is shallow
const bad = { ...state, user: state.user };  // user still shared
// ✅ manual deep update (immutable pattern)
const good = { ...state, user: { ...state.user, name: 'new' } };
// ✅ true deep clone
const deep = structuredClone(orig);          // modern (handles cycles, Dates, Maps)
const deep2 = JSON.parse(JSON.stringify(orig)); // loses fns/undefined/Dates; fails cycles
```

## 8. Comparisons

### Spread vs `Object.assign`
| | `{ ...src }` | `Object.assign(t, src)` |
|---|-------------|-------------------------|
| Result | new object | mutates target |
| Setters on target | ❌ (defines own props) | ✅ triggers them |
| Depth | shallow | shallow |
| Symbols/enumerable | copies own enumerable + symbols | same |
```js
const merged = { ...a, ...b };        // new object
Object.assign(existing, a, b);        // mutate existing
```

### Spread vs Deep Clone
| Spread | Deep Clone |
|--------|-----------|
| Shallow (nested shared) | Fully independent |
| Fast, cheap | Slower (recursive) |
| `{...o}` / `[...a]` | `structuredClone(o)` |

## 9. Common Mistakes
- Assuming spread is deep (nested mutation leaks).
- Spreading non-iterables in array context (`[...{}]` → TypeError; objects aren't iterable).
- Property order in merge (later spread wins — order matters).
- Spreading huge arrays as args → call stack limits (`fn(...hugeArray)` can throw "Maximum call stack").
- Spreading `null`/`undefined` in object context is fine (`{...null}` → `{}`), but in array context throws.

## 10. Best Practices
- Use spread for shallow copies/merges + immutable updates.
- `structuredClone` for deep clones.
- Put overriding values **last** in merges.
- For huge arrays prefer `.concat`/`.apply` over spreading as args (stack safety).

## 11. Performance / Memory
- Each spread **allocates** a new array/object → avoid in hot loops (repeated allocations, GC pressure).
- Shallow copy is O(n) over top-level keys.
- Deep clone is O(total nodes) — expensive for large structures.

## 12. Production Use Cases
- Redux/Vuex immutable state updates (`{...state, ...changes}`).
- Merging config/defaults, cloning props, converting NodeList/Set/arguments to arrays, passing dynamic args.

## 13. Tricky Edge Cases
```js
const o = { a: 1, b: 2 };
console.log({ ...o, a: 9 });        // {a:9, b:2}  (override after)
console.log({ a: 9, ...o });        // {a:1, b:2}  (spread after → o wins)

console.log([...'hi']);             // ['h','i']
// console.log([...{a:1}]);         // ❌ TypeError (object not iterable)
console.log({ ...null });           // {} (object spread tolerates null)
console.log({ ...123 });            // {} (primitives → no own enumerable props)
console.log({ ...'ab' });           // {0:'a', 1:'b'} (string indices!)
console.log([...[1,2], ...[3]]);    // [1,2,3]

const nested = { x: { y: 1 } };
const c = { ...nested }; c.x.y = 9;
console.log(nested.x.y);            // 9 (shared)
```

## Output Prediction
```js
const a = [1,2]; const b = [...a]; b.push(3);
console.log(a, b);                  // [1,2] [1,2,3]

const o = { x: 1 }; const c = { ...o }; c.x = 2;
console.log(o.x, c.x);              // 1 2

const s = { a: { n: 1 } }; const d = { ...s }; d.a.n = 9;
console.log(s.a.n);                 // 9 (shallow!)

console.log({ ...{ a: 1 }, ...{ a: 2 } });  // {a:2}
console.log(Math.max(...[5, 1, 9]));        // 9
console.log([..."🎉"].length);              // 1 (code point)
```

## Interview Questions
**🟢:** What does spread do? · Spread vs Object.assign? · How to copy an array/object?
**🟡:** Is spread deep or shallow? · Spread vs deep clone? · Why does nested mutation leak? · Convert NodeList/Set to array.
**🔴:** Iterator protocol behind array spread. · Object spread + getters/symbols/non-enumerable. · Why `[...hugeArray]` as args can overflow the stack. · Immutable nested updates without a clone lib.
**🧩:** Redux state nested update breaks (shallow) — fix. · Merge configs with correct precedence. · Dedup with spread+Set. · Deep clone an object (structuredClone).

## ⚡ REVISION
- `...` expands iterables (array/string/Set) & object own-enumerable props into a NEW array/object.
- **Shallow** — nested objects shared by reference (mutation leaks).
- Spread (new object, no setters) vs Object.assign (mutates target, triggers setters); both shallow.
- Deep clone → `structuredClone`. Merge: later wins.
- Array spread uses iterator protocol; object spread tolerates null/primitives (`{...null}→{}`).

➡️ Next: **Rest Parameters.**
