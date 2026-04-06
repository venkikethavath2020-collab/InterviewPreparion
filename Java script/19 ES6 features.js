
// 1) let / const - block scoping
{
    let x = 1;
    const y = 2;
    // y = 3; // TypeError
    console.log('let/const:', x, y);
}

// 2) Arrow functions - concise syntax, lexical this
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log('arrow:', doubled);

// 3) Template literals - interpolation and multi-line
const name = 'Alice';
const greeting = `Hello, ${name}!
Count: ${nums.length}`;
console.log('template:', greeting);

// 4) Destructuring - arrays and objects
const [a, b] = nums;
const { length: len } = nums;
console.log('destructure:', a, b, len);

const user = { id: 1, username: 'bob' };
const { id, username } = user;
console.log('object destructure:', id, username);

// 5) Default parameters
function say(msg = 'hi') {
    return msg;
}
console.log('default param:', say(), say('hello'));

// 6) Rest and spread
// Rest collects remaining args into an array or object and spread expands an array or object into individual elements or properties
function sum(...values) {
    return values.reduce((s, v) => s + v, 0);
}
console.log('rest:', sum(1, 2, 3));

const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log('spread:', arr2);

const objA = { x: 1 }, objB = { ...objA, y: 2 };
console.log('object spread:', objB);

// 7) Classes and inheritance (syntactic sugar over prototypes)
class Animal {
    constructor(name) { this.name = name; }
    speak() { return `${this.name} makes a noise`; }
}
class Dog extends Animal {
    speak() { return `${this.name} barks`; }
}
console.log('class:', new Dog('Rex').speak());

// 8) Promises - async flow control
const p = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), 10);
});
p.then(res => console.log('promise:', res));

// 9) Generators - lazy sequences, control flow
function* gen() {
    yield 1;
    yield 2;
    return 3;
}
const g = gen();
console.log('generator:', g.next(), g.next(), g.next());

// 10) for...of - iterate iterables
for (const n of [10, 20, 30]) {
    console.log('for...of item', n);
}

// 11) Map and Set - improved collections
// Map is a key-value store, Set is a collection of unique values
const s = new Set([1, 2, 2]);
const m = new Map([['k', 'v']]);
console.log('Set:', [...s], 'Map.get:', m.get('k'));

// 12) Symbol - unique property keys
//` Symbol creates a unique identifier, often used for object properties to avoid name collisions
const sym = Symbol('id');
const obj = { [sym]: 123 };
console.log('symbol:', obj[sym]);

// 13) Proxy / Reflect - meta-programming hooks
const target = { a: 1 };
const proxy = new Proxy(target, {
    get(t, p, r) {
        console.log('proxy get', p);
        return Reflect.get(t, p, r);
    }
});
console.log('proxy value:', proxy.a);

// 14) Property shorthand & computed property names
const key = 'score';
const value = 99;
const player = { key, [key + '_bonus']: 1 };
console.log('shorthand/computed:', player);

// 15) Enhanced object literals (methods)
const lib = {
    multiply(x, y) { return x * y; },
    get pi() { return 3.14159; }
};
console.log('enhanced object:', lib.multiply(2,3), lib.pi);

// 16) Modules (ESM) - example exports (use in separate files)
// export function add(a, b) { return a + b; }
// import { add } from './module.js';

// Notes:
// - ES6 (ES2015) introduced these core features; later editions added more.
// - Use const for values that shouldn't rebind; prefer let over var.
// - Modules require a bundler or Node/Electron/Esm-supporting environment.
