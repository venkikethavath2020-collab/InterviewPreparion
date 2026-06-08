# JS MODULE 7: OBJECTS

---

## 1. What is an Object
**Definition:** A collection of **key-value pairs** (properties); keys are strings/Symbols, values are any type. The fundamental reference type in JS; everything non-primitive is an object (arrays, functions, dates...).
**Stored:** on the **heap**; variables hold a **reference**.

---

## 2. Object Creation
```js
// 1. Literal (most common)
const a = { name: 'Ana', greet() {} };
// 2. Constructor
const b = new Object(); b.x = 1;
// 3. Object.create (set prototype explicitly)
const proto = { greet() { return 'hi'; } };
const c = Object.create(proto);   // c.__proto__ === proto
// 4. Factory function
function makeUser(name) { return { name }; }
// 5. Class (Module 9)
class User { constructor(n){ this.name = n; } }
```

---

## 3. Property Descriptors
Every property has a **descriptor** with attributes:
| Attribute | Meaning | Default (literal) |
|-----------|---------|-------------------|
| `value` | the value | — |
| `writable` | can reassign? | true |
| `enumerable` | shows in for-in/Object.keys? | true |
| `configurable` | can delete/redefine? | true |
| `get`/`set` | accessor functions | — |
```js
const obj = {};
Object.defineProperty(obj, 'id', {
  value: 1, writable: false, enumerable: false, configurable: false
});
obj.id = 2;             // silently ignored (strict: throws)
Object.keys(obj);       // [] — not enumerable
Object.getOwnPropertyDescriptor(obj, 'id');
```
**Accessors (get/set):**
```js
const temp = {
  _c: 0,
  get celsius() { return this._c; },
  set celsius(v) { this._c = v; },
  get fahrenheit() { return this._c * 1.8 + 32; }
};
```

---

## 4. Object Methods
```js
Object.keys(obj);          // own enumerable keys
Object.values(obj);        // values
Object.entries(obj);       // [[k,v],...]
Object.assign(t, s1, s2);  // shallow merge into t
Object.freeze(obj);        // immutable (shallow)
Object.seal(obj);          // no add/delete, can edit
Object.create(proto);      // new obj with prototype
Object.getPrototypeOf(obj);
Object.defineProperty / defineProperties;
Object.fromEntries(entries);
structuredClone(obj);      // deep clone (modern)
```

---

## 5. `Object.freeze()` vs `Object.seal()` vs `preventExtensions`
| | freeze | seal | preventExtensions |
|---|--------|------|-------------------|
| Add props | ❌ | ❌ | ❌ |
| Delete props | ❌ | ❌ | ✅ |
| Modify existing | ❌ | ✅ | ✅ |
| `Object.isFrozen/isSealed` | true | true | — |
**`freeze` is SHALLOW** — nested objects still mutable:
```js
const o = Object.freeze({ nested: { x: 1 } });
o.nested.x = 99;   // ✅ works! (shallow). Deep freeze = recurse.
```

---

## 6. `Object.assign()` (shallow copy/merge)
```js
const merged = Object.assign({}, defaults, overrides);   // shallow
const copy = { ...original };                            // spread (shallow too)
```
**Shallow:** nested objects are shared by reference. Deep copy → `structuredClone(obj)` (modern) or `JSON.parse(JSON.stringify(obj))` (loses functions/dates/undefined, fails on cycles).

---

## 7. Internal Behavior (V8)
- Objects use **hidden classes (shapes)** — V8 assigns a shape based on property layout; objects with the **same properties in the same order** share a shape → fast property access via **inline caching**.
- Adding properties in different orders, or `delete`, creates new shapes → deoptimization.
```js
function Pt(x, y){ this.x=x; this.y=y; }  // consistent shape ✅
const p = {}; p.x=1; p.y=2;               // different add order → different shape
delete p.x;                                // shape change → slow
```

---

## 8. Reference vs Value & Equality
```js
const a = { x: 1 }, b = { x: 1 };
a === b;          // false (different references)
const c = a; c === a;  // true (same reference)
// Comparison & copies are by reference for objects
```

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** initialize all props together (stable shape), use spread/`structuredClone` appropriately, freeze config objects, use Map for dynamic key-value collections.
**Mistakes:** assuming `freeze`/spread are deep; mutating shared references; using objects as hash maps with many dynamic keys (Map is better); `delete` on hot objects.
**Performance:** keep object shapes monomorphic; avoid `delete` (set to `undefined` or use Map); avoid adding props post-construction in hot paths.

---

## INTERVIEW QUESTIONS
**🟢:** Ways to create objects? · freeze vs seal? · Shallow vs deep copy?
**🟡:** Property descriptors (writable/enumerable/configurable)? · Why is `===` false for two equal-looking objects? · Object.assign vs spread? · Deep clone options + caveats?
**🔴:** Hidden classes & why property order matters. · Implement deep freeze / deep clone. · get/set accessors internals. · Why is `delete` slow?
**🧩:** Frozen object's nested value still changes — why + fix. · JSON clone drops a Date — explain. · Build an immutable config. · Map vs object for a cache.

**Output prediction:**
```js
const o = Object.freeze({ a: 1, nested: { b: 2 } });
o.a = 9; o.nested.b = 9;
console.log(o.a, o.nested.b);   // 1 9  (freeze is shallow)

const x = { a: 1 }; const y = { ...x }; y.a = 2;
console.log(x.a, y.a);          // 1 2  (shallow copy of primitives is independent)
```

## ⚡ REVISION
- Objects = key-value, heap-stored, reference-compared.
- Descriptors: writable/enumerable/configurable + get/set.
- freeze (no change) vs seal (edit only) vs preventExtensions — all **shallow**.
- Object.assign/spread = shallow; deep clone → structuredClone.
- V8 hidden classes: stable shape + property order = fast; delete/reorder = deopt.

➡️ Next: **Module 8 — Prototypes.**
