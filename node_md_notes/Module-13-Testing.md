# MODULE 13: TESTING

---

## 1. The Testing Pyramid
```
        ▲  E2E (few, slow, full system)
       ╱ ╲
      ╱   ╲  Integration (some — modules + DB/API together)
     ╱─────╲
    ╱       ╲ Unit (many, fast, isolated functions)
   ╱─────────╲
```
**Principle:** Many fast unit tests, fewer integration, fewest E2E. Cheap & fast at the bottom.

---

## 2. Unit Testing
**Definition:** Test a single unit (function/module) **in isolation**, mocking its dependencies. Fast, deterministic.
```js
// sum.js
export const sum = (a, b) => a + b;
// sum.test.js (Jest)
import { sum } from './sum.js';
test('adds numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
describe('sum', () => {
  it('handles negatives', () => expect(sum(-1, -1)).toBe(-2));
});
```
**AAA pattern:** Arrange → Act → Assert.

---

## 3. Integration Testing
**Definition:** Test multiple units together, often with **real dependencies** (DB, HTTP) or test containers — verify they work in combination.
```js
import request from 'supertest';
import app from '../app.js';
describe('POST /users', () => {
  it('creates a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Ana' })
      .expect(201);
    expect(res.body.name).toBe('Ana');
  });
});
```
Use a **test database** (or in-memory like mongodb-memory-server / testcontainers); reset state between tests.

---

## 4. Jest
**Definition:** Popular all-in-one test framework (runner + assertions + mocking + coverage).
```js
// Matchers
expect(x).toBe(5);              // strict ===
expect(obj).toEqual({a:1});    // deep equality
expect(fn).toThrow();
expect(arr).toContain(3);
expect(promise).resolves.toBe(...);
expect(mock).toHaveBeenCalledWith(1, 2);

// Lifecycle hooks
beforeAll(() => {}); afterAll(() => {});
beforeEach(() => {}); afterEach(() => {});

// Async
test('async', async () => { await expect(fetchData()).resolves.toEqual(...); });
```
**Node's built-in test runner** (`node:test` + `node --test`, stable in Node 20+) is a zero-dependency alternative. Vitest is a fast modern option.

---

## 5. Supertest
**Definition:** Library to test HTTP endpoints by making requests against your Express/HTTP app **without** starting a real server (or against an ephemeral port).
```js
await request(app).get('/health').expect(200).expect('Content-Type', /json/);
await request(app).post('/login').send({ user, pass }).expect(200);
```
Chains assertions on status, headers, body. Pairs with Jest/Mocha.

---

## 6. Mocking
**Definition:** Replace real dependencies (DB, network, time) with controllable fakes so tests are fast, isolated, deterministic.
| Type | Purpose |
|------|---------|
| **Stub** | Returns canned values |
| **Mock** | Stub + records/asserts calls |
| **Spy** | Wraps real fn, records calls |
| **Fake** | Lightweight working impl (in-memory DB) |
```js
// Mock a module
jest.mock('../db.js');
import { getUser } from '../db.js';
getUser.mockResolvedValue({ id: 1, name: 'Ana' });

// Spy
const spy = jest.spyOn(console, 'log');
expect(spy).toHaveBeenCalledTimes(1);

// Fake timers
jest.useFakeTimers();
jest.advanceTimersByTime(1000);

// Mock fetch/HTTP → nock or msw
```
**Mistake:** Over-mocking → tests pass but real integration breaks. Mock external boundaries, not the thing under test.

---

## 7. Coverage & CI
```bash
jest --coverage      # statements / branches / functions / lines
```
- Aim for meaningful coverage (~80%), not 100% vanity.
- Run tests in **CI** (GitHub Actions) on every PR; fail the build on regressions.
- **Flaky tests** (timing, shared state, order dependence) erode trust — isolate state, avoid real time/network, make deterministic.

---

## 8. Best Practices
- One assertion concept per test; descriptive names.
- Isolate tests (no shared mutable state; reset DB/mocks in `beforeEach`).
- Test behavior, not implementation.
- Cover edge cases + error paths, not just happy path.
- Keep unit tests fast (<ms); push slow stuff to integration/E2E.
- Don't test framework/library internals.

---

## PRACTICE QUESTIONS
**🟢:** Unit vs integration vs E2E? · What is Jest/Supertest? · What is mocking?
**🟡:** Testing pyramid & why? · Stub vs mock vs spy? · How to test async code? · How to test an Express endpoint (supertest)?
**🔴:** How to test code with DB/time/network (fakes, fake timers, testcontainers)? · Causes & fixes for flaky tests. · Over-mocking risks. · Coverage metrics meaning.
**🧩:** Test a payment flow with external API (mock boundary). · Endpoint passes unit tests but fails in prod — why (missing integration). · Make a time-dependent test deterministic. · Design a CI test strategy.

## ⚡ REVISION
- Pyramid: many unit, some integration, few E2E.
- AAA: Arrange-Act-Assert. Jest matchers + lifecycle hooks.
- Supertest for HTTP endpoints; mock external boundaries only.
- Reset state per test; use fake timers; avoid flakiness; run in CI.

➡️ Next: **Module 14 — Design Patterns.**
