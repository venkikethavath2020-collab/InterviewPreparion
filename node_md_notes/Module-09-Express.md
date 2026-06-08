# MODULE 9: EXPRESS.JS

---

## 1. Express Architecture
**Definition:** A minimal, unopinionated web framework on top of Node's `http`. Core idea: a **request flows through a pipeline of middleware functions**, each able to modify req/res or pass control.
```
Request ─► MW1 ─► MW2 ─► Route Handler ─► MW (response) ─► Response
              (each calls next() to continue)
                       │ error thrown / next(err)
                       ▼
              Error-handling middleware (err, req, res, next)
```
Internally Express maintains a **stack** of layers (middleware + routes). On each request it walks the stack in order, matching paths/methods, calling each layer's handler with a `next` function.

---

## 2. Middleware
**Definition:** A function `(req, res, next)` with access to the request/response and the `next` middleware. Types:
- **Application-level:** `app.use(fn)`
- **Router-level:** `router.use(fn)`
- **Built-in:** `express.json()`, `express.urlencoded()`, `express.static()`
- **Third-party:** `cors`, `helmet`, `morgan`
- **Error-handling:** `(err, req, res, next)` — 4 args

```js
// logging middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  console.log(req.method, req.url);
  next();                 // MUST call next() or send a response, else hangs
});
app.use(express.json()); // body parsing
```
**Order matters** — middleware runs top-to-bottom. Body parser must come before routes that read `req.body`.

---

## 3. Request Lifecycle in Express
```
1. Request hits Express app
2. Matching middleware run in order (app.use)
3. Router matches method + path
4. Route-specific middleware run
5. Route handler runs → res.send/json/end
6. If error/next(err) → skip to error middleware
7. If no route matches → 404 handler
```

---

## 4. Route Handlers
```js
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
app.post('/users', express.json(), (req, res) => {
  res.status(201).json(req.body);
});
// Chained / multiple handlers:
app.get('/admin', authenticate, authorize('admin'), (req, res) => res.send('ok'));
// Router module:
const router = express.Router();
router.get('/', list); router.post('/', create);
app.use('/api/users', router);
```
`req.params` (URL), `req.query` (?a=1), `req.body` (parsed), `req.headers`, `req.cookies`.

---

## 5. Error-Handling Middleware
**Defined with 4 args** `(err, req, res, next)` — Express identifies it by arity. Must be registered **last**.
```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});
```
**Critical:** In **async** handlers, errors are NOT auto-caught (pre Express 5). You must:
```js
// Wrap (Express 4):
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.get('/x', wrap(async (req, res) => { throw new Error('boom'); }));
// Express 5: async errors auto-forwarded to error middleware ✅
```
**Mistake:** Throwing in an async route in Express 4 without `.catch(next)` → unhandled rejection, request hangs.

---

## 6. Authentication (Who are you?)
```js
// JWT auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```
Strategies: session-cookie, JWT, OAuth (Passport.js for many providers).

---

## 7. Authorization (What can you do?)
```js
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
app.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```
RBAC (role-based) or ABAC (attribute-based). 401 = auth fail, 403 = authz fail.

---

## 8. Complete Example Skeleton
```js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());                 // security headers
app.use(cors());                   // CORS
app.use(express.json({ limit: '1mb' }));  // body + size limit
app.use(morgan('combined'));       // logging

app.use('/api/users', authenticate, usersRouter);  // protected routes

app.use((req, res) => res.status(404).json({ error: 'Not found' }));  // 404
app.use((err, req, res, next) => {                                    // errors LAST
  res.status(err.status || 500).json({ error: err.message });
});
app.listen(3000);
```

## Express vs Fastify vs Koa (interview aside)
| | Express | Fastify | Koa |
|---|---------|---------|-----|
| Style | Callback middleware | Schema + plugins | async/await, minimal |
| Speed | Good | Fastest (JSON schema serialization) | Good |
| Async errors | Manual (v4) / auto (v5) | Built-in | Built-in (try/catch) |

---

## PRACTICE QUESTIONS
**🟢:** What is Express / middleware? · What does `next()` do? · req.params vs query vs body?
**🟡:** Middleware types & order? · How is error middleware identified (4 args)? · How to handle async errors in Express 4? · app.use vs router.use?
**🔴:** How does Express match routes internally (layer stack)? · Auth vs authz middleware design. · Why is body-parser order important? · Express 4 vs 5 async handling.
**🧩:** Async route throws but client hangs — fix (wrap/catch next). · Add RBAC to an API. · Build a request-timing + error-logging middleware chain. · Migrate callbacks to async/await safely.

## ⚡ REVISION
- Express = middleware pipeline on top of `http`; `next()` passes control.
- Order matters; body parser before routes; error MW `(err,req,res,next)` last.
- Express 4: wrap async with `.catch(next)`; Express 5: auto.
- authenticate (401) → authorize (403) → handler.

➡️ Next: **Module 10 — Databases.**
