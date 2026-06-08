# ESSENTIAL JS — SECTION 15: ERROR HANDLING

---

## 1. try / catch / finally / throw
```js
try {
  riskyOperation();
} catch (err) {           // err can be optional: catch {} (ES2019)
  console.error(err.message);
} finally {
  cleanup();              // ALWAYS runs (success, error, even return)
}
throw new Error('Something broke');   // throw any value (prefer Error objects)
```
- **`try`:** wrap code that may throw.
- **`catch`:** handle the thrown error (gets the error object).
- **`finally`:** always executes — cleanup (close file, hide spinner) — runs even if `try`/`catch` returns or rethrows.
- **`throw`:** raise an error (can throw any value, but **throw `Error` objects** for stack traces).

## 2. The Error Object & Built-in Types
```js
const e = new Error('msg');
e.message;   // 'msg'
e.name;      // 'Error'
e.stack;     // stack trace (V8)
e.cause;     // ES2022: new Error('x', { cause: originalErr })
```
| Type | When |
|------|------|
| `Error` | generic |
| `TypeError` | wrong type / null access (`null.x`) |
| `ReferenceError` | undefined variable / TDZ |
| `SyntaxError` | invalid syntax / JSON.parse |
| `RangeError` | out of range (stack overflow, invalid array length) |
| `URIError` | bad encodeURI/decodeURI |
| `AggregateError` | Promise.any all-reject |

## 3. Custom Errors
```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';   // for instanceof + logging
    this.field = field;
    Error.captureStackTrace?.(this, ValidationError);  // clean stack (V8)
  }
}
try { throw new ValidationError('Invalid email', 'email'); }
catch (e) {
  if (e instanceof ValidationError) console.log(e.field);  // discriminate by type
}
```
**Why:** typed errors → handle differently (validation vs network vs auth), attach metadata, cleaner logging/monitoring.

## 4. finally Gotchas
```js
function f() {
  try { return 1; }
  finally { console.log('finally'); }   // runs BEFORE the return completes
}
f();   // logs 'finally', returns 1

function g() {
  try { return 1; }
  finally { return 2; }   // ⚠️ finally return OVERRIDES try return → 2
}
g();   // 2
```

## 5. Async Error Handling

### async/await → try/catch
```js
async function load() {
  try {
    const data = await fetch(url).then(r => r.json());
    return data;
  } catch (err) {
    handle(err);        // catches network + parse errors
  } finally {
    setLoading(false);
  }
}
```

### Promise → .catch
```js
fetch(url)
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
  .catch(err => handle(err))      // catches anything in the chain
  .finally(() => setLoading(false));
```
**⚠️ fetch only rejects on network failure** — a 404/500 still resolves! Check `response.ok` and throw manually.

## 6. Promise Error Handling Patterns
```js
// un-awaited rejection isn't caught by surrounding try/catch:
async function bad() {
  try { doAsync(); }            // ❌ no await → rejection escapes
  catch (e) {}                  // never runs
}

// parallel with partial failure:
const results = await Promise.allSettled(tasks);
results.filter(r => r.status === 'rejected').forEach(r => log(r.reason));

// error-as-value pattern (avoid try nesting):
const [err, data] = await fetch(url).then(r => [null, r]).catch(e => [e]);
if (err) handle(err);
```

## 7. Global Error Handling
```js
// Browser
window.addEventListener('error', e => report(e.error));           // sync errors
window.addEventListener('unhandledrejection', e => report(e.reason)); // promise rejections
// Node
process.on('uncaughtException', err => { log(err); process.exit(1); }); // don't keep running
process.on('unhandledRejection', reason => log(reason));
// Frameworks: React error boundaries, Vue app.config.errorHandler, Express error middleware
```
**Best practice:** global handlers are a **last-resort safety net** (report to Sentry, exit gracefully) — not primary handling.

## 8. Common Mistakes
- `fetch` not checking `response.ok` (404/500 don't reject).
- Un-awaited promises escaping try/catch.
- Swallowing errors (empty `catch {}`) → silent failures.
- `return` inside `finally` overriding/masking errors.
- Throwing non-Error values (no stack trace).
- Catching too broadly (hiding bugs).
- Not cleaning up in `finally` (leaks on error path).

## 9. Best Practices
- Throw `Error` (or subclasses), never strings.
- Custom error classes for typed handling.
- `try/catch` with `await`; check `response.ok`.
- Use `finally` for cleanup; `Promise.allSettled` for partial-failure tolerance.
- Global handlers for reporting/graceful shutdown.
- Don't leak sensitive details to users; log full details internally.
- Use `cause` (ES2022) to chain errors.

## 10. Performance
- `try/catch` is essentially free on the happy path in modern V8 (historic deopt concerns are largely gone, but keep hot loops simple).
- Throwing is expensive (stack capture) → don't use exceptions for normal control flow.
- `Error.captureStackTrace` controls stack cost.

## 11. Production Use Cases
- API error normalization (map HTTP status → typed errors), retry/circuit-breaker logic, form validation errors, graceful degradation, Sentry/observability reporting, Express/Vue/React error boundaries.

## 12. Coding Examples
```js
// retry with backoff
async function withRetry(fn, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (e) { if (i === retries) throw e; await sleep(2 ** i * 100); }
  }
}
// normalize errors
function normalize(err) {
  if (err instanceof ValidationError) return { code: 400, msg: err.message };
  if (err.name === 'AbortError') return { code: 499, msg: 'cancelled' };
  return { code: 500, msg: 'Internal error' };
}
// error with cause (ES2022)
try { await db.query(); }
catch (e) { throw new Error('Failed to load user', { cause: e }); }
```

## 13. Tricky Edge Cases
```js
try { return 1; } finally { return 2; }     // returns 2
try { throw 'x'; } catch (e) { typeof e; }  // 'string' (can throw anything)
async function f(){ try { Promise.reject('x'); } catch(e){ /* never */ } }  // un-awaited escapes
fetch('/404').then(r => r.ok);              // false but NO reject (resolves)
try {} catch {}                             // optional catch binding (ES2019)
JSON.parse('{bad}');                        // SyntaxError
[].reduce((a,b)=>a+b);                      // TypeError (empty, no init)
null.x;                                      // TypeError
undefinedVar;                                // ReferenceError
```

## Output Prediction
```js
function f() { try { return 'try'; } finally { console.log('fin'); } }
console.log(f());        // 'fin' then 'try'

function g() { try { return 1; } finally { return 2; } }
console.log(g());        // 2

(async () => {
  try { await Promise.reject(new Error('boom')); }
  catch (e) { console.log('caught', e.message); }   // 'caught boom'
})();

try { throw 42; } catch (e) { console.log(typeof e); }  // 'number'

console.log(typeof null.x);   // ❌ TypeError (not 'undefined')
```

## Interview Questions
**🟢:** try/catch/finally purpose? · What does finally do? · How to handle async errors?
**🟡:** Why doesn't fetch reject on 404? · Custom error classes — why? · finally + return behavior? · Promise vs async error handling?
**🔴:** Un-awaited rejection escaping try/catch. · Global error handlers (window/process). · Error `cause` chaining. · allSettled for partial failures. · Performance of throwing.
**🧩:** API returns 500 but no error thrown — check response.ok. · Form validation with typed errors. · Retry transient failures (backoff). · Catch all unhandled rejections (global handler).

## ⚡ REVISION
- try/catch/finally; finally always runs (and `return` in finally overrides). throw Error objects (stack traces).
- async errors → try/catch with await; Promises → .catch. **fetch doesn't reject on 4xx/5xx → check `response.ok`.**
- Un-awaited promise rejections escape surrounding try/catch.
- Custom Error subclasses for typed handling; `cause` (ES2022) to chain.
- Global handlers (window 'error'/'unhandledrejection', process 'uncaughtException') = last-resort reporting.

➡️ Next: **Browser Storage.**
