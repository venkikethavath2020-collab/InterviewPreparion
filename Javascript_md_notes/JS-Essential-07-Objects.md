# ESSENTIAL JS — SECTION 7: OBJECTS

> (Complements JS-Module-07-Objects.md — this is the practical/essential cut.)

---

## 1. Object Creation
```js
// literal
const a = { name: 'Ana', greet() {} };
// constructor
const b = new Object();
// Object.create (explicit prototype)
const c = Object.create(protoObj);
// factory
const make = (n) => ({ name: n });
// class
class User { constructor(n){ this.name = n; } }
// computed keys
const key = 'id'; const d = { [key]: 1 };
```

## 2. Property Descriptors & Enumerability
Every property has attributes:
| Attribute | Meaning | Default (literal) |
|-----------|---------|-------------------|
| `value` | the value | — |
| `writable` | reassignable? | true |
| `enumerable` | appears in for-in / Object.keys / spread? | true |
| `configurable` | deletable / redefinable? | true |
```js
const o = {};
Object.defineProperty(o, 'id', { value: 1, enumerable: false, writable: false });
Object.keys(o);        // []  (not enumerable)
o.id = 9;              // ignored (not writable; strict → throws)
Object.getOwnPropertyDescriptor(o, 'id');
// getters/setters
Object.defineProperty(o, 'full', { get() { return this.id + '!'; }, enumerable: true });
```
**Enumerability** controls visibility in `for...in`, `Object.keys/values/entries`, spread, `JSON.stringify`. Non-enumerable props are "hidden" from these.

## 3. The Methods
```js
Object.keys(obj);       // own enumerable keys (string)
Object.values(obj);     // own enumerable values
Object.entries(obj);    // [[k,v], ...]
Object.fromEntries(arr);// reverse of entries
Object.assign(t, ...s); // shallow merge into target (mutates t)
Object.freeze(obj);     // shallow immutable
Object.seal(obj);       // no add/delete, edit allowed
Object.preventExtensions(obj);  // no add (delete/edit allowed)
Object.getOwnPropertyNames(obj);// incl. non-enumerable
Object.getPrototypeOf(obj);
structuredClone(obj);   // deep clone (modern)
```

## 4. Property Lookup & Prototype Chain Lookup
```
GET obj.x:
  1. own property x? → return
  2. else → obj.[[Prototype]] → check there
  3. repeat up chain → Object.prototype → null
  4. not found → undefined

SET obj.x = v:
  creates/updates OWN property (does NOT write to prototype)
  unless a setter exists on the chain
```
```js
const proto = { greet(){ return 'hi'; } };
const o = Object.create(proto);
o.greet();                    // 'hi' (found on proto)
o.hasOwnProperty('greet');    // false
'greet' in o;                 // true (chain)
Object.keys(o);               // [] (inherited not own)
```

## 5. Comparisons

### `freeze` vs `seal` vs `preventExtensions`
| | freeze | seal | preventExtensions |
|---|--------|------|-------------------|
| Add props | ❌ | ❌ | ❌ |
| Delete props | ❌ | ❌ | ✅ |
| Modify existing | ❌ | ✅ | ✅ |
**All SHALLOW** — nested objects stay mutable:
```js
const o = Object.freeze({ n: { x: 1 } });
o.n.x = 9;   // ✅ works (shallow)! deepFreeze recurses.
```

### `Object.assign` vs spread
| | `Object.assign(t, s)` | `{ ...s }` |
|---|----------------------|-----------|
| Target | mutates existing | new object |
| Depth | shallow | shallow |
| Triggers setters on target | ✅ | ❌ (defines own props) |
| Symbols/enumerable | copies own enumerable + symbols | same |
```js
const merged = Object.assign({}, defaults, overrides);  // shallow
const copy = { ...original };                           // shallow
// deep: structuredClone(obj)
```

## 6. Common Mistakes
- Assuming freeze/spread are deep (nested still mutable/shared).
- `===` on objects expecting value equality (it's reference).
- Mutating shared references unintentionally.
- `for...in` picking up inherited keys (use `Object.keys`/`hasOwnProperty`).
- `JSON.parse(JSON.stringify())` for deep clone — drops functions/undefined/Dates, fails on cycles.

## 7. Best Practices
- Initialize all props together (stable V8 shape).
- `Object.freeze` config; `structuredClone` for deep copy.
- `Object.keys/entries` over `for...in`.
- Use `Map` for dynamic/large key-value collections (Section: Sets & Maps).
- `??`/optional chaining for safe access.

## 8. Performance
- Stable shapes → V8 hidden classes + inline caches (fast). `delete` / late property additions / inconsistent order → deopt/dictionary mode.
- Large object spread/clone is O(n) (allocations).
- Object key access ~O(1) (hidden class) vs dictionary mode (slower).

## 9. Production Use Cases
- Config objects (frozen), DTOs, normalized state (`byId`), merging defaults+overrides (spread), immutable updates in Redux/Vuex.

## 10. Coding Examples
```js
// merge with override
const settings = { ...defaults, ...userPrefs };
// pick/omit
const pick = (o, keys) => Object.fromEntries(keys.map(k => [k, o[k]]));
const omit = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));
// deep freeze
function deepFreeze(o){
  Object.keys(o).forEach(k => { if (typeof o[k] === 'object' && o[k]) deepFreeze(o[k]); });
  return Object.freeze(o);
}
// invert
const invert = o => Object.fromEntries(Object.entries(o).map(([k,v]) => [v,k]));
```

## 11. Tricky Edge Cases
```js
const o = Object.freeze({ a: 1, n: { b: 2 } });
o.a = 9; o.n.b = 9;
console.log(o.a, o.n.b);            // 1 9 (shallow freeze)

console.log({} === {});            // false
console.log({a:1}.a === {a:1}.a);  // true (1===1, values)

const obj = { a: 1 };
const copy = { ...obj, ...{ a: 2 } };
console.log(copy.a);               // 2 (later wins)

console.log(Object.keys({ [Symbol('s')]: 1 }));  // [] (symbols not in keys)

const key = 1;  const m = { [key]: 'a' };
console.log(m['1'], m[1]);         // 'a' 'a'  (object keys are strings)
```

## 12. Output Prediction
```js
const o = Object.freeze({ x: 1 });
o.x = 5; console.log(o.x);                 // 1

console.log(Object.keys({ a: 1, b: 2 }));  // ['a','b']
console.log(Object.entries({ a: 1 }));     // [['a',1]]

const a = { n: 1 }; const b = { ...a }; b.n = 2;
console.log(a.n, b.n);                     // 1 2

const p = { greet(){ return 'hi'; } };
const c = Object.create(p);
console.log(c.greet(), Object.keys(c));    // 'hi' []

console.log(JSON.stringify({ a: undefined, b: ()=>{}, c: 1 }));  // '{"c":1}'
```

## Interview Questions
**🟢:** Ways to create objects? · freeze vs seal? · Object.keys/values/entries? · Shallow vs deep copy?
**🟡:** Property descriptors (writable/enumerable/configurable)? · Object.assign vs spread? · Why `{} === {}` is false? · How does property lookup use the prototype chain?
**🔴:** Enumerability effects (for-in/keys/spread/JSON). · Implement deep clone/deep freeze. · V8 hidden classes + why property order matters. · getters/setters via defineProperty.
**🧩:** Frozen object's nested value changes — fix (deepFreeze). · Merge configs with overrides (spread). · Pick/omit keys. · Compare two objects (deep equal).

## ⚡ REVISION
- Create: literal/new/Object.create/factory/class. Descriptors: writable/enumerable/configurable + get/set.
- Lookup: own → prototype chain → Object.prototype → null → undefined. SET creates own prop.
- freeze (no change) / seal (edit only) / preventExtensions — all shallow.
- Object.assign (mutate target) vs spread (new obj) — both shallow; structuredClone for deep.
- Object.keys/values/entries = own enumerable; symbols excluded; reference equality only.

➡️ Next: **Destructuring.**
