# JS MODULE 8: PROTOTYPES & PROTOTYPAL INHERITANCE (Deep Dive)

---

## 1. What is a Prototype
**Definition:** Every JS object has an internal hidden link `[[Prototype]]` to another object — its **prototype**. When you access a property that doesn't exist on the object, JS looks it up the **prototype chain**.
**Why it exists:** JS inheritance is **prototype-based** (not class-based). Objects inherit directly from other objects → shared behavior without copying.

---

## 2. The Three Confusing Terms
| Term | What it is |
|------|-----------|
| `[[Prototype]]` / `__proto__` | The **internal link** every object has to its prototype |
| `prototype` | A **property on functions** — the object that becomes the `[[Prototype]]` of instances created with `new` |
| `Object.getPrototypeOf(obj)` | The standard way to read `[[Prototype]]` (`__proto__` is legacy) |
```js
function Dog(name) { this.name = name; }
Dog.prototype.bark = () => 'woof';   // shared method

const d = new Dog('Rex');
d.__proto__ === Dog.prototype;              // true
Object.getPrototypeOf(d) === Dog.prototype; // true
Dog.prototype.constructor === Dog;          // true
d.bark();                                    // 'woof' (found on prototype)
```

---

## 3. The Prototype Chain
```
d ──[[Prototype]]──► Dog.prototype ──[[Prototype]]──► Object.prototype ──► null
{name:'Rex'}          {bark, constructor}              {toString, hasOwnProperty...}

Property lookup for d.toString:
  d? no → Dog.prototype? no → Object.prototype? YES ✅
```
**Top of chain:** `Object.prototype` (whose `[[Prototype]]` is `null`).

---

## 4. Internal Property Lookup (Resolution Algorithm)
```
GET(obj, key):
  1. Does obj have OWN property key? → return it
  2. No → go to obj.[[Prototype]]
  3. Repeat up the chain
  4. Reach null → return undefined

SET(obj, key, value):
  - Creates/updates an OWN property on obj (does NOT modify the prototype)
    (unless prototype has a setter)
```
```js
d.hasOwnProperty('name');  // true (own)
d.hasOwnProperty('bark');  // false (inherited)
'bark' in d;               // true (in checks the whole chain)
```

---

## 5. How JS Inheritance Works
```js
// Parent
function Animal(name) { this.name = name; }
Animal.prototype.eat = function () { return `${this.name} eats`; };

// Child
function Dog(name, breed) {
  Animal.call(this, name);          // inherit instance props
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype);  // inherit methods
Dog.prototype.constructor = Dog;                  // fix constructor
Dog.prototype.bark = function () { return 'woof'; };

const d = new Dog('Rex', 'Lab');
d.eat();   // 'Rex eats' (inherited via chain)
d.bark();  // 'woof'
```
Chain: `d → Dog.prototype → Animal.prototype → Object.prototype → null`. ES6 `class extends` is sugar over exactly this.

---

## 6. `new` Keyword Internals
```js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);  // 1. new obj, link prototype
  const result = Constructor.apply(obj, args);        // 2. run ctor with this=obj
  return result instanceof Object ? result : obj;     // 3. return obj (or returned object)
}
```

---

## 7. Why Methods Go on the Prototype
```js
// ❌ method per instance (wastes memory)
function Bad(n){ this.n = n; this.greet = function(){}; }
// ✅ shared method (one copy on prototype)
function Good(n){ this.n = n; }
Good.prototype.greet = function(){};
```
Prototype methods are **shared** across all instances → memory efficient.

---

## 8. Common Patterns & Gotchas
```js
// Check own vs inherited
for (const k in d) if (d.hasOwnProperty(k)) {}   // skip inherited
Object.keys(d);   // own enumerable only (safer)

// Don't extend Object.prototype (pollutes everything)
Object.prototype.evil = 1;   // ❌ shows up in every object's for-in

// Object.create(null) → no prototype (pure dictionary, no inherited keys)
const dict = Object.create(null);
```

---

## 9. Best Practices / Mistakes / Performance
**Best practices:** put shared methods on prototype/class; use `class` syntax for clarity; `Object.create(null)` for pure maps; `Object.keys`/`hasOwnProperty` to avoid inherited props.
**Mistakes:** forgetting `Dog.prototype.constructor` after reassignment; extending built-in prototypes; confusing `prototype` vs `__proto__`; long prototype chains (slow lookups).
**Performance:** shallow prototype chains resolve faster; V8 inline-caches prototype lookups; deep chains + dynamic shape changes = deopt.

---

## INTERVIEW QUESTIONS
**🟢:** What is a prototype? · `prototype` vs `__proto__`? · What is the prototype chain?
**🟡:** How does property lookup work? · hasOwnProperty vs `in`? · How does inheritance work pre-ES6? · Why methods on prototype?
**🔴:** Implement `new`/inheritance from scratch. · Prototype resolution algorithm. · `Object.create(null)` use case. · class vs prototype (it's sugar — show desugaring). · Why is extending Object.prototype bad?
**🧩:** Method shared vs per-instance memory. · A property "leaks" into all objects (prototype pollution) — diagnose. · Build inheritance without `class`. · `instanceof` internals (walks chain).

**Output prediction:**
```js
function A(){}
A.prototype.x = 1;
const a = new A();
console.log(a.x);            // 1 (inherited)
a.x = 2;
console.log(a.x, A.prototype.x);  // 2 1 (own shadows proto; proto unchanged)

console.log(a.hasOwnProperty('x'));  // true now
console.log({}.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);          // null
```

## ⚡ REVISION
- Every object has `[[Prototype]]` (`__proto__`); functions have `.prototype` (template for `new` instances).
- Lookup walks chain: obj → prototype → ... → Object.prototype → null.
- `new` = create obj, link prototype, run ctor with `this`, return obj.
- Shared methods on prototype (memory); SET creates own prop (doesn't touch prototype).
- `class extends` = sugar over prototypes; `instanceof` walks the chain.

➡️ Next: **Module 9 — Classes.**
