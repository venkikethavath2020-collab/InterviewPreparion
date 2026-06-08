# ESSENTIAL JS — SECTION 13: JSON

---

## 1. Definition
**JSON** (JavaScript Object Notation) = a lightweight, language-agnostic **text format** for data interchange. JS provides `JSON.stringify` (serialize: value → JSON string) and `JSON.parse` (deserialize: JSON string → value).
**Why:** standard format for APIs, config, storage — text that any language can parse.

## 2. `JSON.stringify` (Serialization)
```js
JSON.stringify({ a: 1, b: [2, 3] });          // '{"a":1,"b":[2,3]}'
JSON.stringify(obj, replacer, space);
JSON.stringify(obj, null, 2);                  // pretty-print (2-space indent)
JSON.stringify(obj, ['a', 'b']);               // only include keys a, b (array replacer)
JSON.stringify(obj, (k, v) => typeof v === 'function' ? undefined : v);  // fn replacer
```
**`toJSON` hook:** if a value has a `toJSON()` method, it's called first (Dates use this → ISO string).

## 3. `JSON.parse` (Deserialization)
```js
JSON.parse('{"a":1}');                          // { a: 1 }
JSON.parse('[1,2,3]');                          // [1,2,3]
JSON.parse('{"d":"2024-01-01"}', (k, v) =>      // reviver function
  k === 'd' ? new Date(v) : v);
JSON.parse('invalid');                          // ❌ SyntaxError (must try/catch)
```

## 4. Limitations (what JSON.stringify drops/changes)
```js
JSON.stringify({
  fn: () => {},            // ❌ omitted (functions)
  u: undefined,            // ❌ omitted (undefined)
  s: Symbol('x'),          // ❌ omitted (symbols)
  n: NaN,                  // → null
  i: Infinity,             // → null
  d: new Date(),           // → ISO string (via toJSON)
  big: 10n,                // ❌ THROWS (BigInt not serializable)
});
// → '{"n":null,"i":null,"d":"2024-...Z"}'

// In ARRAYS, undefined/functions become null (to preserve indices):
JSON.stringify([undefined, () => {}, 1]);      // '[null,null,1]'

// Other losses:
// - Map/Set → '{}' (not serialized)
// - non-enumerable props skipped
// - prototype/class info lost (becomes plain object)
// - -0 → 0
```
| Value | stringify result |
|-------|------------------|
| function / undefined / symbol (in object) | omitted |
| function / undefined (in array) | `null` |
| NaN / Infinity | `null` |
| Date | ISO string |
| BigInt | **throws** |
| Map / Set | `{}` |

## 5. Handling Circular References
`JSON.stringify` **throws** on circular references (`TypeError: Converting circular structure to JSON`).
```js
const obj = { name: 'A' };
obj.self = obj;                  // circular
// JSON.stringify(obj);          // ❌ TypeError

// Fix 1: replacer that tracks seen objects
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}
// Fix 2: structuredClone handles cycles (but returns object, not string)
// Fix 3: libraries (flatted, json-stringify-safe)
```

## 6. Deep Clone via JSON (common but flawed)
```js
const clone = JSON.parse(JSON.stringify(obj));
// ❌ loses: functions, undefined, symbols, Dates (→ string), Map/Set, class type
// ❌ throws on: circular refs, BigInt
// ✅ works for: plain nested objects/arrays of JSON-safe primitives
// Prefer: structuredClone(obj) (modern, handles Dates/Map/Set/cycles)
```

## 7. Common Mistakes
- Not wrapping `JSON.parse` in try/catch (throws on invalid JSON).
- Using JSON clone for objects with Dates/functions/Map (data loss).
- Forgetting Dates become strings (need a reviver to restore).
- Stringifying circular structures (throws).
- BigInt serialization (throws) — convert to string first.

## 8. Best Practices
- Always `try/catch` around `JSON.parse`.
- Use a **reviver** to restore Dates/types on parse.
- Use `structuredClone` for deep clone (not JSON round-trip).
- Validate parsed data (schema: Zod/Joi) — never trust external JSON.
- Use `replacer`/`toJSON` to control serialization (e.g., omit secrets).

## 9. Performance
- `stringify`/`parse` are synchronous + **O(n)** over the data — **blocks the event loop** for huge payloads (stream/chunk for very large data).
- Reviver/replacer functions add per-node cost.
- For massive JSON, consider streaming parsers (e.g., `stream-json`).

## 10. Production Use Cases
- API request/response bodies, localStorage/sessionStorage (must serialize), config files, message queues, logging, deep-clone (small JSON-safe objects).

## 11. Coding Examples
```js
// pretty print
JSON.stringify(data, null, 2);
// omit sensitive fields
JSON.stringify(user, (k, v) => k === 'password' ? undefined : v);
// restore dates
const data = JSON.parse(json, (k, v) =>
  /\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v);
// safe parse
const safeParse = (s, fallback = null) => { try { return JSON.parse(s); } catch { return fallback; } };
// serialize Map
JSON.stringify([...map]);   // '[["k","v"]]'
```

## 12. Tricky Edge Cases
```js
JSON.stringify(undefined);         // undefined (not a string!)
JSON.stringify(() => {});          // undefined
JSON.stringify(NaN);               // 'null'
JSON.stringify([undefined, 1]);    // '[null,1]'
JSON.stringify({ a: undefined });  // '{}'
JSON.stringify({ a: NaN });        // '{"a":null}'
JSON.parse('{"a":1,}');            // ❌ SyntaxError (trailing comma)
JSON.parse("'a'");                 // ❌ SyntaxError (single quotes invalid)
JSON.stringify({ d: new Date(0) });// '{"d":"1970-01-01T00:00:00.000Z"}'
JSON.stringify(10n);               // ❌ TypeError (BigInt)
JSON.stringify({ [Symbol('s')]: 1, a: 1 });  // '{"a":1}' (symbol skipped)
JSON.parse('null');                // null
```

## 13. Output Prediction
```js
console.log(JSON.stringify({ a: undefined, b: null, c: 1 })); // '{"b":null,"c":1}'
console.log(JSON.stringify([undefined, null, 1]));            // '[null,null,1]'
console.log(JSON.stringify({ a: NaN, b: Infinity }));         // '{"a":null,"b":null}'
console.log(JSON.stringify({ fn() {}, x: 1 }));               // '{"x":1}'
console.log(typeof JSON.stringify(undefined));                // 'undefined'
console.log(JSON.parse('"hello"'));                           // 'hello'
console.log(JSON.stringify(new Date(0)));                     // '"1970-01-01T00:00:00.000Z"'
console.log(JSON.stringify({ a: 1 }, null, 2));               // pretty 2-space
```

## Interview Questions
**🟢:** What is JSON.stringify/parse? · What types does JSON support? · Pretty-print JSON?
**🟡:** What does stringify drop (functions/undefined/symbols)? · Why does JSON clone lose Dates? · How to handle circular refs? · What is a reviver/replacer?
**🔴:** JSON deep-clone limitations vs structuredClone. · Serialize a Map/Set. · Restore typed data on parse (reviver). · Why huge JSON.parse blocks the event loop.
**🧩:** Clone an object with a Date — JSON loses it, fix (structuredClone/reviver). · Stringify circular structure — safe replacer. · Omit password before sending. · Parse untrusted JSON safely.

## ⚡ REVISION
- `JSON.stringify` (value→string) drops functions/undefined/symbols (→omit; in arrays→null), NaN/Infinity→null, Date→ISO, BigInt→throws, Map/Set→{}.
- `JSON.parse` throws on invalid → try/catch; use **reviver** to restore Dates/types.
- Circular refs throw → WeakSet-tracking replacer / structuredClone.
- JSON deep-clone is lossy → prefer `structuredClone`.
- stringify/parse are sync O(n) → blocks loop for huge data.

➡️ Next: **Date & Time.**
