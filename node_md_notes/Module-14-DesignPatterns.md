# MODULE 14: NODE.JS DESIGN PATTERNS

---

## 1. Singleton
**Definition:** Ensure a class has **one instance** shared everywhere.
**Why:** Shared resources — DB pool, config, logger, cache client.
**Node twist:** Node's **module caching** gives Singletons for free — a module is evaluated once, so its exports are shared.
```js
// db.js — singleton via module cache
import pg from 'pg';
const pool = new pg.Pool(config);
export default pool;          // every importer gets the SAME pool
```
```js
// Classic class form
class Config {
  static #instance;
  static get() { return (Config.#instance ??= new Config()); }
}
```
**Mistakes:** Caveat — cache is keyed by resolved path; different paths/casing or multiple package copies → multiple "singletons". Avoid global mutable state where it hurts testability.

---

## 2. Factory
**Definition:** A function/method that creates objects **without exposing instantiation logic**; decide which type to build at runtime.
```js
function createLogger(type) {
  switch (type) {
    case 'file':    return new FileLogger();
    case 'console': return new ConsoleLogger();
    case 'cloud':   return new CloudLogger();
    default: throw new Error('unknown');
  }
}
const log = createLogger(process.env.LOG_TYPE);
```
**Why:** Decouple creation from use; easy to add new types; centralizes construction. Common for DB drivers, transports, strategies.

---

## 3. Observer (Pub/Sub)
**Definition:** Subject maintains a list of observers, notifies them on state change. **Node's `EventEmitter` IS this pattern.**
```js
import { EventEmitter } from 'node:events';
class OrderService extends EventEmitter {
  place(order) {
    /* ...save... */
    this.emit('orderPlaced', order);   // notify all observers
  }
}
const orders = new OrderService();
orders.on('orderPlaced', o => sendEmail(o));      // observer 1
orders.on('orderPlaced', o => updateInventory(o)); // observer 2
```
**Why:** Decouple producer from consumers; add behavior without modifying the subject. Basis of streams, sockets, event-driven architecture.

---

## 4. Strategy
**Definition:** Define a family of interchangeable algorithms; select one at runtime.
```js
const paymentStrategies = {
  card:   amount => chargeCard(amount),
  paypal: amount => chargePaypal(amount),
  crypto: amount => chargeCrypto(amount),
};
function pay(method, amount) {
  return paymentStrategies[method](amount);   // pick strategy
}
```
**Why:** Replace big `if/switch` chains; open/closed principle (add strategies without changing callers). Used for payment, compression, auth, sorting.

---

## 5. Repository
**Definition:** Abstract data access behind an interface so business logic doesn't depend on the DB/ORM.
```js
class UserRepository {
  constructor(db) { this.db = db; }
  findById(id) { return this.db.query('SELECT * FROM users WHERE id=$1', [id]); }
  create(user) { /* ... */ }
}
// Service depends on repo interface, not on pg/Mongo directly
class UserService {
  constructor(userRepo) { this.repo = userRepo; }
  async getProfile(id) { return this.repo.findById(id); }
}
```
**Why:** Swap data sources, mock easily in tests, centralize queries, keep domain logic DB-agnostic.

---

## 6. Dependency Injection (DI)
**Definition:** Pass a component's dependencies **in** (constructor/params) instead of creating them inside → loose coupling, testability.
```js
// ❌ tight coupling
class Service { constructor() { this.db = new Postgres(); } }
// ✅ DI
class Service { constructor(db, logger) { this.db = db; this.logger = logger; } }
const svc = new Service(realDb, realLogger);   // prod
const svc = new Service(mockDb, mockLogger);   // test
```
**Why:** Test in isolation (inject mocks), swap implementations, follow Inversion of Control. Frameworks: NestJS (built-in DI container), Awilix, InversifyJS.

---

## 7. Other Useful Patterns (mention-worthy)
- **Middleware/Chain of Responsibility:** Express middleware pipeline.
- **Adapter:** wrap a 3rd-party API behind your interface.
- **Decorator:** wrap functions to add behavior (logging, caching, retry).
- **Module pattern / Revealing module:** encapsulate private state, expose API.
- **Async patterns:** queue/worker, circuit breaker, retry-with-backoff, bulkhead.

---

## 8. SOLID (quick reference — interviewers love linking patterns to SOLID)
- **S**ingle Responsibility · **O**pen/Closed · **L**iskov Substitution · **I**nterface Segregation · **D**ependency Inversion (→ DI).

---

## PRACTICE QUESTIONS
**🟢:** What is Singleton/Factory/Observer? · Which Node class is the Observer pattern?
**🟡:** How does module caching create singletons? · Strategy vs Factory? · Why Repository pattern? · What is DI and why test-friendly?
**🔴:** Singleton pitfalls with module cache (multiple package copies). · Implement Strategy to remove a switch. · Repository + DI for testability. · Map patterns to SOLID.
**🧩:** Refactor a giant if/else payment block (Strategy). · Make a tightly-coupled service testable (DI + Repository). · Build an event-driven order pipeline (Observer). · Design a pluggable logger (Factory).

## ⚡ REVISION
- Singleton ← module cache (one DB pool/config/logger).
- Factory ← centralize object creation.
- Observer ← `EventEmitter` (decouple producer/consumers).
- Strategy ← swap algorithms, kill switch-statements.
- Repository ← DB-agnostic data access.
- DI ← inject deps for loose coupling + testability (→ NestJS).

➡️ Next: **Module 15 — Advanced Node.js.**
