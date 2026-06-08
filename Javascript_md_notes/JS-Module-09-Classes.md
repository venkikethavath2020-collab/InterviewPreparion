# JS MODULE 9: CLASSES

---

## 1. What & Why
**Definition:** ES6 `class` is **syntactic sugar over prototypal inheritance** — a cleaner syntax for constructor functions + prototype methods.
**Why:** Familiar OOP syntax, clearer inheritance, encapsulation (private fields), less boilerplate. Under the hood: still prototypes.
```js
class User {
  constructor(name) { this.name = name; }   // runs on `new`
  greet() { return `Hi ${this.name}`; }     // → User.prototype.greet
}
// desugars to: function User(){...}; User.prototype.greet = ...
```

---

## 2. Constructors
- `constructor()` runs when `new` is called; initializes instance properties.
- Only **one** constructor per class. Default if omitted.
- Class fields (`count = 0`) initialize per instance.
```js
class Counter {
  count = 0;                 // class field (instance property)
  static instances = 0;      // static field (on class)
  constructor() { Counter.instances++; }
}
```

---

## 3. Inheritance (`extends` + `super`)
```js
class Animal {
  constructor(name) { this.name = name; }
  eat() { return `${this.name} eats`; }
}
class Dog extends Animal {
  constructor(name, breed) {
    super(name);             // MUST call before using `this`
    this.breed = breed;
  }
  eat() { return super.eat() + ' kibble'; }   // call parent method
}
```
- `extends` sets up the prototype chain (`Dog.prototype.__proto__ === Animal.prototype`).
- `super(...)` calls parent constructor; **required** in subclass constructor before `this`.
- `super.method()` calls parent method.

---

## 4. Static Methods & Fields
**Definition:** Belong to the **class itself**, not instances (utilities, factories, counters).
```js
class MathUtil {
  static PI = 3.14159;
  static square(n) { return n * n; }   // MathUtil.square(5), not instance
}
MathUtil.square(5);   // 25
// instance.square → undefined
```

---

## 5. Private Fields (`#`)
**Definition:** True privacy (ES2022) — `#field` accessible only inside the class. Enforced by the engine (not convention).
```js
class BankAccount {
  #balance = 0;                          // private
  deposit(n) { this.#balance += n; }
  get balance() { return this.#balance; }
  #log() {}                              // private method
}
const acc = new BankAccount();
acc.#balance;   // ❌ SyntaxError (truly private)
```
Before `#`: convention `_balance` (not enforced) or closures (Module 5).

---

## 6. Getters / Setters
```js
class Temp {
  #c = 0;
  get celsius() { return this.#c; }
  set celsius(v) { this.#c = v; }
  get fahrenheit() { return this.#c * 1.8 + 32; }
}
const t = new Temp();
t.celsius = 25;        // setter
t.fahrenheit;          // 77 (getter)
```

---

## 7. Classes vs Prototype Inheritance
| | Class | Prototype (function) |
|---|-------|----------------------|
| Syntax | `class`/`extends`/`super` | function + `prototype` + `Object.create` |
| Under the hood | Same prototypes | — |
| Hoisting | TDZ (not hoisted usable) | Function declaration hoisted |
| `new` required | ✅ (throws without) | optional (bug-prone) |
| Strict mode | Always | Opt-in |
| Private fields | `#` native | closures only |
| Readability | High | Lower for inheritance |
**Key interview line:** "Classes are sugar — `class` compiles to constructor functions + prototype methods; behavior is identical, syntax is cleaner and safer (TDZ, strict, `new` enforced, real privates)."

---

## 8. Best Practices / Mistakes / Performance
**Best practices:** use classes for clear OOP; `#private` for encapsulation; static for utilities/factories; keep hierarchies shallow (favor composition).
**Mistakes:** forgetting `super()` before `this`; calling class without `new` (throws); arrow methods losing prototype sharing (per-instance memory — but auto-bind `this`); deep inheritance trees.
**Performance:** methods on prototype = shared (efficient); class field arrows create per-instance functions (more memory, but bound `this`); stable shapes optimize.

---

## INTERVIEW QUESTIONS
**🟢:** Is `class` real OOP or sugar? · What does `super` do? · Static vs instance methods?
**🟡:** How does `extends` set up inheritance? · Private fields vs `_` convention? · Why must `super()` come first? · Getters/setters?
**🔴:** Desugar a class to prototype form. · Class field arrow vs prototype method (memory + `this`). · Private fields enforcement (engine-level). · Mixins with classes.
**🧩:** Subclass breaks ("this before super"). · Need true privacy — `#` vs closure. · Build an EventEmitter class. · Why does calling a class without `new` throw (unlike functions)?

**Output prediction:**
```js
class A { constructor(){ this.x = 1; } }
class B extends A { constructor(){ super(); this.y = 2; } }
const b = new B();
console.log(b.x, b.y);                 // 1 2
console.log(b instanceof A);           // true
console.log(Object.getPrototypeOf(B.prototype) === A.prototype);  // true

class C { #p = 1; getP(){ return this.#p; } }
console.log(new C().getP());           // 1
```

## ⚡ REVISION
- `class` = sugar over constructor fn + prototype methods (same behavior, safer).
- constructor inits instance; `extends` + `super()` (before `this`) for inheritance; `super.m()` for parent methods.
- static = on class; `#field` = true private (ES2022); get/set accessors.
- Differences from prototypes: TDZ, strict mode, `new` required, native privates.
- Prefer composition over deep inheritance.

➡️ Next: **Module 10 — Functions.**
