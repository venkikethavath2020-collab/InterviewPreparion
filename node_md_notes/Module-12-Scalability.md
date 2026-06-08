# MODULE 12: SCALABILITY

---

## 1. Vertical vs Horizontal Scaling
| | Vertical (Scale Up) | Horizontal (Scale Out) |
|---|---------------------|------------------------|
| Method | Bigger machine (CPU/RAM) | More machines/instances |
| Limit | Hardware ceiling | ~Unlimited |
| Cost | Expensive at top | Linear-ish |
| Complexity | Simple | Needs LB, statelessness |
| Failure | Single point | Resilient |
**Node specific:** A single Node process uses **one core**. Vertical scaling alone wastes extra cores → use **cluster**/**multiple instances** to use them.

---

## 2. Clustering
**Definition:** Run **N Node processes** (one per core) sharing the same port, load-balanced by the OS/master → uses all CPU cores.
```js
import cluster from 'node:cluster';
import os from 'node:os';
if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) cluster.fork();
  cluster.on('exit', () => cluster.fork());     // self-heal
} else {
  http.createServer(handler).listen(3000);
}
```
**Internals:** Master creates worker processes (`child_process.fork`). The server handle is shared; on Linux the kernel/round-robin distributes connections. Workers are **isolated** (separate memory, V8, event loop) — no shared state.
**Modern:** Use a process manager (**PM2** `pm2 start app.js -i max`) or container orchestration (K8s replicas) instead of hand-rolling cluster.

---

## 3. Load Balancing
**Definition:** Distribute traffic across instances. Layers:
- **L4 (transport):** by IP/port (fast, dumb).
- **L7 (application):** by URL/headers (smart routing).
**Algorithms:** Round-robin, least-connections, IP-hash (sticky), weighted.
```
        ┌─────────────┐
Client ─►│Load Balancer│─► Node instance 1
         │ (Nginx/ALB) │─► Node instance 2
         └─────────────┘─► Node instance 3
```
**Stateless requirement:** Instances must not hold per-user state in memory (use Redis/DB) so any instance can serve any request. Sticky sessions are a workaround, not ideal.

---

## 4. Worker Threads (CPU Scaling within a Process)
For **CPU-bound** tasks — offload to threads so the main event loop stays free.
```js
import { Worker } from 'node:worker_threads';
function runHeavy(data) {
  return new Promise((res, rej) => {
    const w = new Worker('./heavy.js', { workerData: data });
    w.on('message', res); w.on('error', rej);
  });
}
```
Use a **worker pool** (Piscina) to avoid thread creation cost. **cluster** = scale connections across cores (multi-process); **worker_threads** = parallelize CPU work (multi-thread, shared memory).

---

## 5. Caching
**Definition:** Store frequently-accessed data in fast storage to reduce latency and backend load.
**Layers:**
```
Browser cache → CDN → Reverse proxy (Nginx) → App in-memory (LRU)
→ Distributed cache (Redis) → Database
```
**Patterns:**
- **Cache-aside (lazy):** app checks cache; miss → DB → populate cache. Most common.
- **Write-through:** write to cache + DB together.
- **Write-behind:** write cache, async flush to DB.
**TTL + invalidation** are the hard parts ("there are only two hard things…"). Eviction policies: **LRU**, LFU, FIFO.
```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  const user = await db.getUser(id);
  await redis.set(`user:${id}`, JSON.stringify(user), 'EX', 300); // 5min TTL
  return user;
}
```

---

## 6. Redis
**Definition:** In-memory key-value data store — caching, sessions, pub/sub, queues, rate limiting, leaderboards. Single-threaded (mostly), extremely fast (~100k+ ops/sec).
**Use cases in Node:**
- **Cache** (cache-aside).
- **Session store** (shared across instances → enables horizontal scaling).
- **Pub/Sub** for real-time fan-out across instances (e.g., websockets across pods).
- **Rate limiting** (distributed counters).
- **Queues** (BullMQ) for background jobs.
- **Distributed locks** (Redlock).
**Gotchas:** It's a cache — handle misses, evictions, and Redis downtime (don't let cache failure take down the app); avoid huge keys; set TTLs.

---

## 7. Other Scaling Techniques
- **Message queues** (RabbitMQ, Kafka, SQS, BullMQ): decouple, smooth spikes, async processing. Offload email/notifications/heavy work.
- **CDN** for static assets.
- **Database scaling:** read replicas, sharding, connection pooling (Module 10).
- **Microservices:** independent scaling per service.
- **Autoscaling** (K8s HPA) on CPU/RPS/queue depth.
- **Statelessness** is the enabler for all horizontal scaling.

---

## 8. Production Architecture Example
```
            ┌─── CDN (static) ───┐
Users ──► Load Balancer (ALB/Nginx, L7, TLS termination)
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
 Node     Node     Node      (stateless, cluster/PM2, K8s replicas)
   │        │        │
   └────────┼────────┘
   ┌────────┴─────────────┐
   ▼          ▼           ▼
 Redis    PostgreSQL    Message Queue
 (cache,  (primary +    (BullMQ → workers
 sessions) replicas)     for async jobs)
```
- TLS terminated at LB; Node speaks HTTP internally.
- Sessions/cache in Redis → any instance serves any user.
- Heavy/async work → queue → worker pool.
- DB: primary for writes, replicas for reads, pooled connections.

---

## PRACTICE QUESTIONS
**🟢:** Vertical vs horizontal scaling? · What is clustering? · What is caching/Redis?
**🟡:** cluster vs worker_threads? · Why must instances be stateless? · Cache-aside pattern? · Load balancing algorithms?
**🔴:** How does cluster share a port? · Distributed sessions/rate-limiting with Redis. · Cache invalidation strategies + thundering herd. · When to add a message queue.
**🧩:** App uses 1 of 16 cores — fix (cluster/PM2). · Sessions break after adding a 2nd instance — fix (Redis store). · Sudden traffic spike crashes DB — protect (cache + queue + rate limit). · Design a scalable architecture for 1M users.

## ⚡ REVISION
- 1 Node process = 1 core → cluster/PM2/replicas for cores.
- Horizontal scaling needs **statelessness** → state in Redis/DB.
- LB distributes; cache (LRU→Redis) cuts DB load (cache-aside + TTL).
- cluster = multi-process connections; worker_threads = CPU parallelism.
- Queues decouple + absorb spikes; CDN for static; DB replicas + pooling.

➡️ Next: **Module 13 — Testing.**
