# 🚀 Node.js Backend – Interview Notes

---

## 🧠 Event Loop
- Core of Node.js async architecture.
- Handles non-blocking operations.
- Runs in phases (timers → pending → poll → check → close).
- Enables handling thousands of concurrent requests.

**Interview line:**  
Node.js uses an event-driven, non-blocking I/O model powered by the event loop.

---

## 🧵 libuv
- C library used by Node.js.
- Provides:
  - Event loop
  - Thread pool
  - Async I/O
- Offloads heavy tasks (fs, crypto, DNS).

---

## ⚡ Non-blocking I/O
- Async execution without stopping main thread.
- Improves scalability.

**Example:** DB calls, file reads.

---

## 🧵 Thread Pool
- Default size: 4
- Used for:
  - fs
  - crypto
  - DNS
- Can scale via:
UV_THREADPOOL_SIZE=8


---

## 📦 Middleware
- Functions executed before controller.
- Used for:
- Auth
- Logging
- Validation
- Error handling

---

## 🎮 Controller
- Handles request & response.
- Calls service layer.
- No business logic.

---

## 🧠 Service Layer
- Contains business logic.
- Orchestrates multiple operations.
- Calls repository.

---

## 🛢 Repository Layer
- DB access only.
- No business logic.
- Uses ORM/ODM.

---

## 🧬 ORM / ODM
- ORM → SQL (Prisma, Sequelize, TypeORM)
- ODM → MongoDB (Mongoose)

**Benefits:**
- Abstraction
- Migrations
- Relations

---

## 🧾 Schema / Model
- Defines DB structure.
- Used for validation & queries.

---

## 🔄 Migration
- Version control for database.
- Tracks schema changes.

---

## 🔐 JWT (Authentication)
- Stateless authentication.
- Contains:
- Header
- Payload
- Signature

**Flow:**
Login → Generate token → Send in headers.

---

## 🔑 Refresh Token
- Used to generate new access tokens.
- Stored securely.

---

## 🧂 Hashing (bcrypt)
- Encrypt passwords before storing.
- Uses salting.

---

## 🌍 REST API
- Resource-based architecture.
- Uses HTTP methods:
- GET
- POST
- PUT
- DELETE

---

## 🔢 HTTP Status Codes
- 200 → OK
- 201 → Created
- 400 → Bad request
- 401 → Unauthorized
- 404 → Not found
- 500 → Server error

---

## 🧪 Validation
- Validate request before processing.
- Libraries:
- Joi
- Zod
- Yup

---

## 💾 Caching (Redis)
- Stores frequently accessed data.
- Reduces DB load.
- Improves performance.

---

## 📬 Queue System
Used for background jobs:

- Email
- Notifications
- Invoice generation

Tools:
- BullMQ
- RabbitMQ
- Kafka

---

## 🧵 process.nextTick vs Promise
Priority:
1. process.nextTick
2. Promise

Executed before next event loop cycle.

---

## ⚙️ Environment Variables
- Stored in `.env`
- Accessed via:
process.env


---

## 🐳 Docker
- Containerizes application.
- Ensures consistent environment.

---

## 📊 Logging
Libraries:
- Winston
- Pino

Log levels:
- info
- warn
- error

---

## 🚨 Error Handling
- Centralized error middleware.
- Avoid try/catch in every controller.

---

## 🔗 Connection Pooling
- Reuses DB connections.
- Improves performance.

---

## 💳 Transactions
- Ensures atomic DB operations.
- Rollback on failure.

---

## 📡 Rate Limiting
- Prevents API abuse.
- Protects from DDoS.

---

## 🧠 Horizontal vs Vertical Scaling

### Horizontal
- Multiple instances
- Load balancer

### Vertical
- Increase CPU/RAM

---

## 🧰 PM2
- Process manager for Node.js
- Features:
- Clustering
- Auto restart
- Monitoring

---

## 🧾 Request Lifecycle (Must Explain in Interviews)

Client  
→ Middleware  
→ Route  
→ Controller  
→ Service  
→ Repository  
→ DB  
→ Response

---

# ⭐ Most Asked Interview Topics

- Event loop
- Async vs sync
- JWT flow
- Middleware
- MVC architecture
- Caching strategy
- Transactions
- Queue usage
- Error handling

---

# 🏁 One-Line Architecture Summary

Node.js backend follows:

Route → Middleware → Controller → Service → Repository → Database

with caching, queues, and proper error handling for scalability.
