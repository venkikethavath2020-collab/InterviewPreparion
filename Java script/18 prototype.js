/**
 * prototype.js
 * Short guide and examples about JavaScript prototypes, how to use them, and typical use-cases.
 *
 * Put this file in /Users/apple/Desktop/Interview/Interview-Preparation/Java script/prototype.js
 */

/* 1) Basic idea
 * - Every object has an internal link to another object called its prototype.
 * - When you access obj.prop and prop is not on obj, JS looks up the prototype chain.
 * - Functions (when used as constructors with `new`) get a `.prototype` object whose properties become
 *   the prototype for instances created by that constructor.
 */

/* Constructor + prototype: methods shared between instances (memory efficient) */
function Person(name) {
    this.name = name; // instance property
}
Person.prototype.greet = function () {
    return `Hi, I'm ${this.name}`;
};

const alice = new Person('Alice');
const bob = new Person('Bob');

console.log(alice.greet()); // "Hi, I'm Alice"
console.log(bob.greet());   // "Hi, I'm Bob"

// Methods are shared (same function reference)
console.log(alice.greet === bob.greet); // true

/* 2) Inspecting prototype links */
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true

// Distinguish own properties vs prototype properties
console.log(alice.hasOwnProperty('name')); // true
console.log(alice.hasOwnProperty('greet')); // false (greet is on prototype)

/* 3) Object.create: create objects with a specified prototype (good for simple inheritance) */
const vehicleProto = {
    init(type) {
        this.type = type;
    },
    describe() {
        return `This is a ${this.type}`;
    }
};

const car = Object.create(vehicleProto);
car.init('car');
console.log(car.describe()); // "This is a car"

/* 4) Prototype-based inheritance (constructor style) */
function Vehicle(type) {
    this.type = type;
}
Vehicle.prototype.describe = function () {
    return `Vehicle: ${this.type}`;
};

function Truck(type, capacity) {
    Vehicle.call(this, type); // inherit properties
    this.capacity = capacity;
}
/* Set up prototype chain so Truck instances inherit Vehicle.prototype */
Truck.prototype = Object.create(Vehicle.prototype);
Truck.prototype.constructor = Truck;

Truck.prototype.loadInfo = function () {
    return `Capacity: ${this.capacity}`;
};

const t = new Truck('truck', '5 tons');
console.log(t.describe());  // "Vehicle: truck"
console.log(t.loadInfo());  // "Capacity: 5 tons"

/* 5) ES6 classes are syntactic sugar over prototypes */
class Animal {
    constructor(kind) {
        this.kind = kind;
    }
    speak() {
        return `${this.kind} makes a sound`;
    }
}

const a = new Animal('dog');
console.log(a.speak()); // "dog makes a sound"
console.log(Object.getPrototypeOf(a) === Animal.prototype); // true

/* 6) Extending built-ins: possible but use with caution (global impact) */
Array.prototype.last = function () {
    return this[this.length - 1];
};
console.log([1, 2, 3].last()); // 3
// Warning: altering built-ins can break other code or future standards.

/* 7) When to use prototypes / prototype patterns
 * - Share behavior (methods) between many instances to save memory.
 * - Implement inheritance and polymorphism for related object types.
 * - When building libraries/frameworks where objects need overridable default behavior.
 * - Use Object.create for simple prototype-based objects without constructors.
 * - Prefer ES6 classes for clearer syntax; they still use prototypes under the hood.
 *
 * When not to change prototypes:
 * - Avoid modifying Object.prototype or other global built-ins in app code.
 * - For small one-off objects, composition (plain objects with closures) can be simpler.
 */

/* 8) Quick checklist for debugging prototype problems:
 * - Use Object.getPrototypeOf(obj) to see prototype.
 * - hasOwnProperty tells if property is own vs inherited.
 * - Use console.dir(obj) in devtools to inspect prototype chain.
 */
