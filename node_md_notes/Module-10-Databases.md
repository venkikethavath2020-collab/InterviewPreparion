# MODULE 10: DATABASES (Node Integration)

---

## 1. SQL vs NoSQL (Foundation)
| | SQL (Postgres/MySQL) | NoSQL (MongoDB) |
|---|----------------------|-----------------|
| Schema | Fixed, relational | Flexible, document |
| Joins | Native | App-side / `$lookup` |
| Transactions | Strong ACID | ACID per-doc (multi-doc since 4.0) |
| Scaling | Vertical + read replicas | Horizontal (sharding) |
| Best for | Structured, relational, financial | Flexible, high-write, hierarchical |

---

## 2. PostgreSQL with Node (`pg`)
```js
import pg from 'pg';
const pool = new pg.Pool({
  host, user, password, database,
  max: 20,                 // pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
// ALWAYS parameterize → prevents SQL injection
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```
**Internals:** `pg` speaks the Postgres wire protocol over TCP (non-blocking, uses OS async — not the thread pool).

---

## 3. MySQL with Node (`mysql2`)
```js
import mysql from 'mysql2/promise';
const pool = mysql.createPool({ host, user, password, database, connectionLimit: 20 });
const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);  // ? placeholders
```
Use `mysql2` (Promise support, prepared statements, faster) over the old `mysql`.

---

## 4. MongoDB with Node (`mongodb` / Mongoose)
```js
// Native driver
import { MongoClient } from 'mongodb';
const client = new MongoClient(uri, { maxPoolSize: 20 });
await client.connect();
const users = client.db('app').collection('users');
await users.findOne({ _id });

// Mongoose ODM (schema + validation)
import mongoose from 'mongoose';
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: { type:String, unique:true } }));
await User.findById(id);
```

---

## 5. Connection Pooling (Critical Interview Topic)
**Definition:** Reuse a fixed set of open DB connections instead of opening/closing one per query.
**Why:** Opening a connection is expensive (TCP + auth handshake, ~ms each). A pool keeps N warm connections; queries borrow + return them.
```
Without pool:  query → open conn → run → close   (slow, exhausts DB)
With pool:     query → borrow from pool → run → return   (fast, bounded)
```
**Sizing:** Too small → queries queue/wait. Too large → DB runs out of connections (each costs memory). Rule of thumb: `pool size ≈ (core_count × 2)` per app instance, **× number of instances ≤ DB max_connections**. Account for cluster workers/pods!
**Mistake:** Creating a new pool per request, or pool-per-cluster-worker overrunning DB `max_connections`.

---

## 6. Transactions
**Definition:** A group of operations that all succeed or all fail (**ACID**: Atomicity, Consistency, Isolation, Durability).
```js
// Postgres
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET bal = bal - $1 WHERE id=$2', [100, from]);
  await client.query('UPDATE accounts SET bal = bal + $1 WHERE id=$2', [100, to]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();          // return connection to pool — ALWAYS
}
```
**Isolation levels:** Read Uncommitted → Read Committed (PG default) → Repeatable Read → Serializable (strongest, slowest). Higher = fewer anomalies (dirty/non-repeatable/phantom reads) but more locking.

---

## 7. Indexes
**Definition:** Data structure (usually **B-tree**) that speeds up lookups by avoiding full table scans — at the cost of slower writes + more storage.
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX ... ;
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);  -- composite
```
- **B-tree:** range + equality (default).
- **Hash:** equality only.
- **GIN/GiST:** full-text, JSONB, geo.
**`EXPLAIN ANALYZE`** to see if an index is used (Seq Scan = bad for large tables). **Composite index column order matters** (leftmost-prefix rule).
**Mistakes:** Over-indexing (slow writes); index not used due to function on column (`WHERE lower(email)=...` needs an expression index); ignoring selectivity.

---

## 8. ORM vs Query Builder vs Raw
| | Raw SQL (`pg`) | Query Builder (Knex) | ORM (Prisma, TypeORM, Sequelize) |
|---|----------------|----------------------|----------------------------------|
| Control | Full | High | Abstracted |
| Boilerplate | High | Medium | Low |
| Type safety | Manual | Some | Strong (Prisma) |
| Learning curve | Low | Low | Medium |
| Risk | Injection if not parameterized | Low | **N+1 queries**, hidden cost |
**ORM pros:** productivity, migrations, validation, relations. **Cons:** N+1 query problem, leaky abstraction, harder to optimize complex queries.
**N+1 problem:** fetching a list then a query per item. Fix: eager loading / `JOIN` / `IN (...)` / DataLoader (batching).

---

## 9. Production Best Practices
- **Always** parameterize queries (never string-concat user input).
- One pool per app instance; size against DB `max_connections`.
- Use transactions for multi-step writes; always `release()` in `finally`.
- Add indexes from real query patterns; verify with `EXPLAIN ANALYZE`.
- Read replicas for read scaling; primary for writes.
- Migrations in version control (Prisma Migrate, Knex, Flyway).
- Timeouts + retries with backoff; circuit breaker for DB outages.
- Don't run heavy queries on the event loop's critical path; paginate.

---

## PRACTICE QUESTIONS
**🟢:** SQL vs NoSQL? · What is connection pooling? · What is a transaction (ACID)? · What is an index?
**🟡:** Why pool connections, how to size? · Isolation levels? · ORM vs query builder vs raw? · How to prevent SQL injection?
**🔴:** N+1 problem & fixes? · Composite index leftmost-prefix? · When does an index NOT get used? · Pooling across cluster workers vs DB max_connections. · ACID vs BASE.
**🧩:** Money transfer must be atomic — implement (transaction + rollback). · API slow under load, DB connections exhausted — diagnose (pool too small / leaked connections). · List endpoint fires 100 queries — fix N+1. · Choose SQL vs Mongo for a given schema.

## ⚡ REVISION
- Pool connections (size vs DB max, account for workers/pods); `release()` always.
- Parameterize everything (injection).
- Transactions = BEGIN/COMMIT/ROLLBACK, ACID, isolation levels.
- Indexes = B-tree speed reads / slow writes; verify with EXPLAIN; composite order matters.
- ORM = productivity but watch N+1.

➡️ Next: **Module 11 — Security.**
