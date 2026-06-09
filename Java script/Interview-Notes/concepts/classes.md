# Classes (ES6)

## Definition

ES6 `class` is **syntactic sugar** over JavaScript's prototype-based inheritance. It provides a cleaner syntax for constructors, methods, inheritance, and static members.

## Why It Exists

To express object-oriented patterns (encapsulation, inheritance, polymorphism) with familiar, readable syntax — while still using prototypes under the hood.

## Internal Working

- Class methods live on `Class.prototype` (shared across instances).
- The `constructor` initializes instance properties.
- `extends` sets up the prototype chain; `super` calls the parent constructor/methods.
- Class bodies are always in **strict mode** and are **not hoisted** (TDZ).

## Example — Basic Class

```js
class MyCar {
  constructor(name, brand) {
    this.name = name;
    this.brand = brand;
  }
  carName() { return this.name; }
  carBrand() { return this.brand; }
}

const c = new MyCar("audi", "brand1");
c.carName(); // "audi"
```

**Equivalent with a constructor function + prototype:**
```js
function MyCar2(name, brand) { this.name = name; this.brand = brand; }
MyCar2.prototype.carName = function () { return this.name; };
// ⚠️ never use an arrow function for prototype methods — it won't bind `this`
```

## Inheritance with extends / super

```js
class User {
  constructor(username) { this.username = username; }
  logMe() { console.log(`USERNAME is ${this.username}`); }
}

class Teacher extends User {
  constructor(username, email, password) {
    super(username);          // must call before using `this`
    this.email = email;
    this.password = password;
  }
  addCourse() { console.log("Course added by", this.username); }
}

const t = new Teacher("venki", "a@b.com", "123");
t.addCourse(); // inherits username from User
t.logMe();     // inherited method
```

## Static Properties & Methods

```js
class User {
  static count = 0;
  static create(name) { User.count++; return new User(name); }
  constructor(name) { this.name = name; }
}
```
Static members belong to the **class**, not instances (`User.create`, not `instance.create`).

## Common Mistakes

* Forgetting `super()` in a subclass constructor before using `this` → ReferenceError.
* Using arrow functions for prototype methods (lose instance `this`).
* Calling a class without `new` → TypeError.
* Calling a static method on an instance.

## Interview Questions

1. Are classes hoisted? (Registered but in TDZ — effectively no.)
2. How does `extends`/`super` map to prototypes?
3. Difference between static and instance methods.
4. Why must `super()` come first in a subclass constructor?
5. How do classes relate to prototypes?

## Senior-Level Discussion

* Private fields (`#field`) provide true encapsulation (not just convention).
* `class` methods are non-enumerable (unlike object-literal methods).
* Mixins via factory functions extend behavior without single-inheritance limits.

## Key Takeaways

* Classes are prototype sugar; methods sit on the prototype.
* `super()` first, `new` required, statics on the class.

Related: [prototype](./prototype.md), [this-keyword](./this-keyword.md).
