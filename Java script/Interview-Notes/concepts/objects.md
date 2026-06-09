# Objects (Creation, Methods, Freeze/Seal)

## Definition

An **object** is a collection of key–value pairs (properties). Objects are reference types, copied and compared by reference.

## Ways to Create Objects

```js
// 1. Object literal (most common)
const obj = { name: "suni", age: 28 };

// 2. Constructor
const obj2 = new Object();
obj2.name = "venki";

// 3. Object.create — set the prototype explicitly
const obj3 = Object.create(null); // no prototype → clean dictionary
obj3.name = "chinnu";

// 4. Class / constructor function (see classes.md, prototype.md)
```

## Core Object Methods

```js
Object.keys(obj);    // ["name", "age"]
Object.values(obj);  // ["suni", 28]
Object.entries(obj); // [["name","suni"], ["age",28]]
Object.fromEntries([["a", 1]]); // { a: 1 }
```

## Merging / Copying

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

Object.assign(target, source);   // mutates target → { a:1, b:4, c:5 }
const merged = { ...target, ...source }; // spread (shallow copy)
```
> Both are **shallow** — nested objects are shared by reference.

## Object.freeze vs Object.seal

| | `Object.freeze` | `Object.seal` |
|---|---|---|
| Add properties | ❌ | ❌ |
| Delete properties | ❌ | ❌ |
| Modify existing values | ❌ | ✅ |
| Check | `Object.isFrozen` | `Object.isSealed` |

```js
const a = { x: 1 };
Object.freeze(a);
a.x = 2;          // silently ignored (TypeError in strict mode)

const b = { y: 1 };
Object.seal(b);
b.y = 9;          // ✅ allowed
b.z = 3;          // ❌ cannot add
```
> **freeze** = fully immutable (shallow). **seal** = no add/remove, but values can change.

## Shallow vs Deep Copy

```js
const shallow = { ...obj };                 // nested refs shared
const deep = structuredClone(obj);          // true deep copy (modern)
const deepJSON = JSON.parse(JSON.stringify(obj)); // loses functions/Dates/undefined
```

## Property Iteration

```js
for (const key in obj) {
  if (Object.hasOwn(obj, key)) console.log(key); // guard inherited keys
}
```

## Interview Questions

1. Difference between `Object.freeze` and `Object.seal`.
2. `Object.assign` vs spread — any difference? (assign mutates target; both shallow.)
3. How do you deep-clone an object? Caveats of `JSON.parse(JSON.stringify(...))`?
4. What does `Object.create(null)` give you and why use it?
5. Shallow vs deep copy.

## Key Takeaways

* `freeze` = immutable (shallow); `seal` = no structural change but mutable values.
* Spread/`Object.assign` are shallow; use `structuredClone` for deep copies.
* `Object.create(null)` makes a prototype-less dictionary.

Related: [prototype](./prototype.md), [classes](./classes.md), [variables-and-datatypes](./variables-and-datatypes.md).
