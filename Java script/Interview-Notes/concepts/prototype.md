# Prototype & Prototype Chain

## Definition

Every JavaScript object has an internal link (`[[Prototype]]`, exposed via `Object.getPrototypeOf` / `__proto__`) to another object — its **prototype**. Property lookups that miss on the object walk up this **prototype chain** until found or until `null`.

## Why It Exists

Prototypes enable **shared behavior** (methods defined once, reused by all instances → memory-efficient) and **inheritance** without classical classes. ES6 `class` is syntactic sugar over this mechanism.

## Internal Working

- A constructor function `Fn` has a `Fn.prototype` object.
- `new Fn()` creates an instance whose `[[Prototype]]` points to `Fn.prototype`.
- Accessing `instance.method` finds it on `Fn.prototype` (shared), while instance data lives on the instance itself.

## Example

```js
function Person(name) {
  this.name = name;             // instance (own) property
}
Person.prototype.greet = function () {
  return `Hi, I'm ${this.name}`; // shared method
};

const alice = new Person("Alice");
const bob = new Person("Bob");

alice.greet();                 // "Hi, I'm Alice"
alice.greet === bob.greet;     // true — same function reference (shared)

Object.getPrototypeOf(alice) === Person.prototype; // true
alice.hasOwnProperty("name");  // true
alice.hasOwnProperty("greet"); // false — on the prototype
```

## The Prototype Chain

```text
alice → Person.prototype → Object.prototype → null
```
Lookup for `alice.toString` walks until it finds it on `Object.prototype`.

## Inheritance (Constructor Style)

```js
function Vehicle(type) { this.type = type; }
Vehicle.prototype.describe = function () { return `Vehicle: ${this.type}`; };

function Truck(type, capacity) {
  Vehicle.call(this, type);            // inherit instance props
  this.capacity = capacity;
}
Truck.prototype = Object.create(Vehicle.prototype); // link the chain
Truck.prototype.constructor = Truck;                // restore constructor
Truck.prototype.loadInfo = function () { return `Capacity: ${this.capacity}`; };

const t = new Truck("truck", "5 tons");
t.describe();  // "Vehicle: truck"
t.loadInfo();  // "Capacity: 5 tons"
```

## Object.create

```js
const proto = { describe() { return `a ${this.type}`; } };
const car = Object.create(proto); // car's prototype IS proto
car.type = "car";
car.describe(); // "a car"
```

## ES6 Classes Are Sugar

```js
class Animal {
  constructor(kind) { this.kind = kind; }
  speak() { return `${this.kind} makes a sound`; }
}
Object.getPrototypeOf(new Animal("dog")) === Animal.prototype; // true
```

## Interview Explanation

> "Objects link to a prototype. Missing-property lookups traverse the prototype chain up to `Object.prototype` then `null`. Methods placed on a constructor's `prototype` are shared by all instances, which is memory-efficient. Classes are sugar over this."

## Real-world Use Cases

* Sharing methods across many instances (memory efficiency).
* Inheritance / polymorphism for related types.
* Library defaults that consumers can override.

## Common Mistakes

* Modifying `Object.prototype` or other built-ins in app code (global breakage).
* Using arrow functions for prototype methods (they don't bind `this` to the instance).
* Forgetting to reset `.constructor` after re-assigning `prototype`.

## Interview Questions

1. What is the prototype chain? How does lookup work?
2. Difference between `__proto__` and `prototype`.
3. `hasOwnProperty` vs `in`.
4. How does classical inheritance work via constructors?
5. How are ES6 classes related to prototypes?

## Senior-Level Discussion

* `Object.create(null)` makes a dictionary with no prototype (no inherited `toString`, safe key storage).
* Extending built-ins (`Array.prototype.last = ...`) is risky — future spec collisions, broken `for...in`.
* Prototype lookups are fast in modern engines via hidden classes/inline caches.

## Key Takeaways

* Property lookup walks the prototype chain to `null`.
* Shared methods belong on the prototype; instance data on the instance.
* Classes are sugar; `Object.create` is the low-level inheritance primitive.

Related: [classes](./classes.md), [this-keyword](./this-keyword.md), [closures](./closures.md).
