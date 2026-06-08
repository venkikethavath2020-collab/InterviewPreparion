# JS MODULE 19: JAVASCRIPT DESIGN PATTERNS

---

## 1. Module Pattern
**Definition:** Encapsulate private state + expose a public API using closures (IIFE) or ES modules.
```js
const Counter = (function () {
  let count = 0;                      // private
  return {
    inc: () => ++count,
    get: () => count
  };
})();
Counter.inc(); Counter.get();        // count is inaccessible directly
```
**Use:** namespacing, privacy, singletons. ES modules are the modern form (file = module).

---

## 2. Factory Pattern
**Definition:** A function that creates and returns objects **without `new`**, deciding the type at runtime.
```js
function createUser(type) {
  const base = { login: () => {} };
  if (type === 'admin') return { ...base, permissions: ['all'] };
  if (type === 'guest') return { ...base, permissions: ['read'] };
}
const admin = createUser('admin');
```
**Use:** decouple creation from usage; centralize object construction; build different shapes from one interface.

---

## 3. Singleton Pattern
**Definition:** Ensure only **one instance** exists, shared globally.
```js
const Config = (function () {
  let instance;
  function create() { return { apiUrl: '/api', env: 'prod' }; }
  return { get: () => (instance ??= create()) };
})();
Config.get() === Config.get();   // true (same instance)
// Modern: an ES module's exported object is a de-facto singleton (cached once)
export const db = createConnection();
```
**Use:** config, DB connection, logger, cache. **Caution:** global mutable state hurts testability.

---

## 4. Observer Pattern (Pub/Sub)
**Definition:** A subject maintains subscribers and notifies them on state change. Basis of event systems, reactivity.
```js
class EventEmitter {
  #listeners = {};
  on(event, fn) { (this.#listeners[event] ||= []).push(fn); return this; }
  off(event, fn) { this.#listeners[event] = (this.#listeners[event]||[]).filter(f => f !== fn); }
  emit(event, ...args) { (this.#listeners[event]||[]).forEach(fn => fn(...args)); }
}
const bus = new EventEmitter();
bus.on('login', user => console.log(user));
bus.emit('login', { id: 1 });
```
**Use:** event buses, DOM events, state management, decoupled communication. (Vue/RxJS/Node EventEmitter are this pattern.)

---

## 5. Strategy Pattern
**Definition:** Define interchangeable algorithms; select one at runtime (replaces big if/switch).
```js
const strategies = {
  card:   amt => `card ${amt}`,
  paypal: amt => `paypal ${amt}`,
  crypto: amt => `crypto ${amt}`,
};
function pay(method, amount) { return strategies[method](amount); }
pay('paypal', 100);
```
**Use:** payments, validation, sorting, compression — any "family of algorithms."

---

## 6. Decorator Pattern
**Definition:** Wrap a function/object to **add behavior** without modifying it (logging, caching, retry, timing).
```js
function withLogging(fn) {
  return function (...args) {
    console.log('calling', fn.name, args);
    const result = fn.apply(this, args);
    console.log('result', result);
    return result;
  };
}
const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
// Memoize decorator, retry decorator, debounce — all decorators
```
**Use:** cross-cutting concerns (logging, auth, caching), higher-order functions, ES decorators (`@`).

---

## 7. Other Patterns (mention-worthy)
- **Proxy:** intercept operations (validation, lazy load) — Module 21.
- **Iterator/Generator:** custom iteration — Module 21.
- **Command:** encapsulate actions as objects (undo/redo).
- **Adapter:** wrap incompatible interface.
- **Dependency Injection:** pass dependencies in (testability).
- **Prototype:** clone objects (Object.create).

---

## 8. Best Practices / Mistakes
**Best practices:** use patterns to solve real problems (not for their own sake); prefer simple functions/closures; ES modules for module/singleton; observer for decoupling.
**Mistakes:** over-engineering; singletons as hidden global state (testing pain); observer leaks (forgetting to unsubscribe); tight coupling via event buses.

---

## INTERVIEW QUESTIONS
**🟢:** What is the module/singleton/observer pattern? · Factory vs constructor?
**🟡:** Implement an EventEmitter (observer). · Strategy to remove a switch. · Decorator for logging/memoization. · Singleton via ES module.
**🔴:** Observer leak prevention (unsubscribe). · Factory vs Strategy vs Decorator differences. · When NOT to use a singleton. · DI for testability.
**🧩:** Refactor a giant payment switch (strategy). · Build a pub/sub event bus. · Add caching to a function without changing it (decorator). · Ensure one DB connection (singleton/module).

## ⚡ REVISION
- **Module** = privacy via closure/ES module. **Factory** = create objects without new. **Singleton** = one shared instance (ES module).
- **Observer** = subject notifies subscribers (EventEmitter/events). **Strategy** = swap algorithms (kill switches). **Decorator** = wrap to add behavior (HOF).
- Use patterns for real decoupling/reuse; avoid over-engineering + hidden global state.

➡️ Next: **Module 20 — Performance Optimization.**
