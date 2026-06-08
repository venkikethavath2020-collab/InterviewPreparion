# MODULE 16: SYSTEM DESIGN USING NODE.JS

> Framework for each: Requirements → API → Data Model → Architecture → Scaling → Security → Trade-offs.

---

## Universal Approach (say this in every system design interview)
1. **Clarify** functional + non-functional requirements (scale, latency, consistency).
2. **Estimate** load (QPS, storage, bandwidth).
3. **API design** (endpoints / events).
4. **Data model** (SQL vs NoSQL, schema, indexes).
5. **High-level architecture** (LB, services, cache, queue, DB).
6. **Deep dive** on the hard part.
7. **Scale** (horizontal, cache, shard, replicate).
8. **Security, monitoring, failure handling, trade-offs.**

---

## 1. Chat Application (WhatsApp-lite)
**Requirements:** Real-time 1:1 + group messaging, online presence, delivery/read receipts, message history, scale to millions concurrent.

**Why Node?** Excellent for many concurrent **WebSocket** connections (I/O-bound, event-driven).

**Architecture:**
```
Clients ──WebSocket──► LB (sticky/L7) ──► Node WS servers (N instances)
                                              │
                          Redis Pub/Sub (fan-out across instances)
                                              │
   ┌──────────────┬──────────────┬────────────┴───────────┐
   ▼              ▼              ▼                          ▼
Presence       Message        Message Queue            Cassandra/Mongo
(Redis)        Store          (Kafka — durability)     (message history,
                                                         write-heavy)
```
- **WebSocket** (Socket.IO/ws) for bidirectional real-time.
- **Redis Pub/Sub** so a message from a user on server A reaches a recipient connected to server B.
- **Presence** in Redis (TTL heartbeats).
- **Message store:** write-heavy, time-ordered → Cassandra/ScyllaDB or Mongo, partition by conversation_id.
- **Queue (Kafka)** for durability, offline delivery, fan-out to push notifications.

**Data model (messages):** `conversation_id (PK) | message_id (sort, snowflake/ULID) | sender | body | ts | status`.

**Scaling:** Stateless WS servers + Redis adapter; shard message store by conversation; connection limits per node; horizontal autoscale.
**Security:** TLS/WSS, auth on connect (JWT), authz per conversation, rate limit messages, E2E encryption (optional).
**Discussion points:** sticky sessions vs Redis adapter, at-least-once delivery + dedup, ordering (per-conversation sequence), read receipts fan-out, backpressure on slow clients.

---

## 2. URL Shortener (bit.ly)
**Requirements:** Shorten long URL → short code; redirect; analytics; very **read-heavy** (100:1 read:write); low latency.

**Architecture:**
```
Create:  Client → Node API → generate code → store → return short URL
Redirect: Client → LB → Node → Cache(Redis) → [miss] DB → 301 redirect
                                   └── async analytics → queue → store
```
**Code generation strategies:**
- **Base62 of an auto-increment ID** (counter) → short, no collisions. (Distributed counter: Redis INCR or range-allocated ID service / Snowflake.)
- **Random + collision check** (hash, retry on dup).
**Data model:** `short_code (PK) | long_url | created_at | user_id | expiry`. Index on `short_code`.
**Why Base62?** 62^7 ≈ 3.5 trillion combos in 7 chars.
**Scaling:** Cache hot URLs in Redis (read-heavy → huge cache hit rate); read replicas; CDN at edge; DB sharded by code. Redirect path must be ultra-fast (cache-first).
**Security:** Validate/normalize URLs, block malicious domains, rate limit creation, prevent open-redirect abuse.
**Discussion:** 301 (cached, loses analytics) vs 302 (every hit counts); custom aliases; expiry; analytics pipeline (async via queue, don't block redirect).

---

## 3. Notification Service
**Requirements:** Send Email/SMS/Push/In-app; multi-channel; templating; retries; scheduling; high throughput; idempotency.

**Architecture:**
```
Producers (services) → API → Message Queue (Kafka/SQS) → Worker pool (Node)
                                                              │
        ┌──────────────┬──────────────┬─────────────────────┘
        ▼              ▼              ▼
   Email (SES)    SMS (Twilio)    Push (FCM/APNs)   → each via provider adapter
        │
   Status store (sent/failed/retry) + Dead Letter Queue
```
- **Queue-based** → decouples, absorbs spikes, enables retries/backoff.
- **Worker pool** consumes, renders template, calls provider (Strategy/Adapter pattern per channel).
- **Idempotency keys** to avoid duplicate sends on retry.
- **Rate limiting** per provider; **DLQ** for poison messages; **scheduling** via delayed queue.
**Data model:** `notification_id | user_id | channel | template | payload | status | attempts | scheduled_at`.
**Scaling:** Partition queue by channel/priority; autoscale workers on queue depth; per-provider rate limits; batching.
**Security:** Authz (who can notify whom), PII handling, opt-out/preferences, provider secrets in vault.
**Discussion:** at-least-once + idempotency, exponential backoff, priority lanes, fan-out to multiple channels, observability (delivery rates).

---

## 4. Payment Service
**Requirements:** Process payments, **strong consistency** (money!), idempotency, integrate gateways (Stripe), refunds, audit, PCI compliance.

**Architecture:**
```
Client → API (Node) → Payment Service
   1. Create payment intent (idempotency key)
   2. Call gateway (Stripe) — handle async webhooks
   3. Transaction in DB (ACID, Postgres)
   4. Emit event (payment.succeeded) → ledger, notifications, fulfillment
```
- **SQL (Postgres) + ACID transactions** — never lose/double-charge money.
- **Idempotency keys** on every create (client-supplied) → safe retries, no double charge.
- **Webhooks** from gateway (async confirmation) — verify signatures, idempotent processing.
- **Saga / outbox pattern** for distributed consistency across services (avoid 2PC).
- **Double-entry ledger** (immutable append-only) for auditability.
**Data model:** `payment_id | idempotency_key (unique) | amount | currency | status | gateway_ref | created_at`; `ledger_entries (immutable)`.
**Scaling:** Mostly consistency over raw scale; partition by account; read replicas for reporting.
**Security:** PCI-DSS (don't store card data — tokenize via gateway), TLS, signed webhooks, fraud checks, least privilege, full audit log.
**Discussion:** idempotency design, exactly-once illusion (at-least-once + dedup), webhook reliability, reconciliation jobs, eventual consistency across services via outbox.

---

## 5. E-commerce Backend
**Requirements:** Catalog, search, cart, checkout, orders, inventory, payments; high traffic + spikes (sales); consistency for inventory/orders.

**Architecture (microservices):**
```
                   API Gateway (Node) + Auth
   ┌──────┬─────────┬────────┬─────────┬──────────┬─────────┐
   ▼      ▼         ▼        ▼         ▼          ▼         ▼
 Catalog Search   Cart    Order    Inventory   Payment   Notification
 (Mongo) (Elastic)(Redis) (Postgres)(Postgres) (Module 4)  (Module 3)
                                  │
                          Event bus (Kafka): order.placed →
                          reserve inventory, charge payment, notify, ship
```
- **Catalog:** Mongo/Postgres + Redis cache + CDN images.
- **Search:** Elasticsearch.
- **Cart:** Redis (fast, TTL).
- **Inventory:** strong consistency, reservation pattern (avoid overselling — atomic decrement / optimistic locking).
- **Orders/Payment:** SQL + transactions + **Saga** across services.
- **Async** via Kafka: order placed → reserve stock → charge → notify → fulfill.
**Scaling:** Each service scales independently; cache catalog heavily; CDN; read replicas; queue for spikes; idempotent order creation.
**Security:** Auth/JWT, rate limiting, payment isolation (PCI), input validation, inventory race protection.
**Discussion:** preventing oversell (atomic/optimistic locking, reservations), eventual consistency, Saga vs 2PC, flash-sale spike handling (queue + cache + rate limit), CQRS for read/write split.

---

## Cross-Cutting Concepts (mention in any design)
- **Stateless services** → horizontal scaling.
- **Caching** (Redis/CDN) for reads.
- **Message queues** (Kafka/SQS) for decoupling + spikes + async.
- **Idempotency** for safe retries (payments, notifications).
- **Consistency:** SQL+ACID for money/inventory; eventual for the rest.
- **Saga/Outbox** for distributed transactions (not 2PC).
- **Observability:** logs, metrics, traces, alerts.
- **Resilience:** retries+backoff, circuit breakers, DLQ, timeouts, bulkheads.
- **CAP:** pick consistency vs availability per service.

---

## PRACTICE QUESTIONS
**🧩 Scenario (per design):**
- Chat: how to deliver to a user on another server? (Redis pub/sub). How to guarantee order? (per-conversation seq).
- URL shortener: 301 vs 302 trade-off? Collision handling? Read scaling? (cache + replicas).
- Notifications: ensure no duplicate sends? (idempotency keys). Handle provider outage? (retry/DLQ).
- Payments: prevent double charge? (idempotency key + ACID). Webhook reliability? (signed + idempotent).
- E-commerce: prevent overselling under flash sale? (atomic decrement / reservation + queue).

## ⚡ REVISION
- Real-time/chat → WebSocket + Redis pub/sub + stateless WS nodes.
- Read-heavy (URL) → cache-first + Base62 IDs + replicas/CDN.
- Async work (notifications) → queue + worker pool + idempotency + DLQ.
- Money (payments) → SQL/ACID + idempotency + webhooks + ledger + Saga.
- E-commerce → microservices + Kafka + reservation pattern + heavy caching.

➡️ Next: **Module 17 — Interview Master Section.**
