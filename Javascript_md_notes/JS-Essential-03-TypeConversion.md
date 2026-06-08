# ESSENTIAL JS — SECTION 3: TYPE CONVERSION

---

## 1. Definition
**Type conversion** = changing a value from one type to another. Two kinds:
- **Explicit (type casting):** you convert deliberately — `Number(x)`, `String(x)`, `Boolean(x)`.
- **Implicit (type coercion):** JS auto-converts during operations — `'5' * 2`, `1 + '2'`, `if (x)`.

## 2. Why It Exists
JS is **weakly typed** — operators must work across types, so the engine coerces operands using defined rules. Convenient but a major bug + interview source.

## 3. Internal Working (The Abstract Operations)
JS uses internal algorithms:
- **ToNumber(x):** `'' → 0`, `'5' → 5`, `'5a' → NaN`, `true → 1`, `false → 0`, `null → 0`, `undefined → NaN`, `[] → 0`, `[5] → 5`, `[1,2] → NaN`, `{} → NaN`.
- **ToString(x):** `5 → '5'`, `null → 'null'`, `undefined → 'undefined'`, `[1,2] → '1,2'`, `{} → '[object Object]'`.
- **ToBoolean(x):** falsy (`false, 0, -0, 0n, '', null, undefined, NaN`) → `false`; everything else → `true`.
- **ToPrimitive(obj, hint):** objects converted via `Symbol.toPrimitive` → `valueOf()` → `toString()` (order depends on hint: `'number'` vs `'string'` vs `'default'`).

```
The `+` operator:
  if either operand becomes a string (after ToPrimitive) → STRING concat
  else → numeric addition
Other arithmetic / comparison → ToNumber
```

## 4. Explicit Conversion
```js
Number('42');   // 42       Number('');   // 0     Number('x'); // NaN
String(42);     // '42'     String(null); // 'null'
Boolean(0);     // false    Boolean('0'); // true (non-empty string)
parseInt('42px', 10);   // 42  (parses prefix)
parseFloat('3.14m');    // 3.14
+'5';           // 5  (unary + → Number)
!!'x';          // true (double-negation → Boolean)
(42).toString(2);  // '101010' (binary)
```

## 5. Implicit Coercion (Type Coercion)
```js
'5' * 2     // 10   (* → ToNumber)
'5' + 2     // '52' (+ with string → concat)
1 + '2'     // '12'
1 - '2'     // -1
if ('text') // truthy
[] == false // true (both → 0)
```

## 6. STRANGE CASES EXPLAINED (must-know)
```js
[] + []        // ''
// [].toString() = '' ; '' + '' = ''

[] + {}        // '[object Object]'
// [] → '' ; {} → '[object Object]' ; '' + '[object Object]'

{} + []        // 0  (in some contexts) OR '[object Object]'
// As a STATEMENT, leading {} is a BLOCK, then +[] → +'' → 0
// As an EXPRESSION ({} + []) → '[object Object]'

null + 1       // 1      (null → 0, 0 + 1)
undefined + 1  // NaN    (undefined → NaN)
true + true    // 2      (true → 1, 1 + 1)
'5' - 1        // 4      (- → ToNumber: 5 - 1)
'5' + 1        // '51'   (+ with string → concat)
```

**`{} + []` deep dive (the famous one):**
```js
{} + []        // 0  — at statement start, {} is an empty block; +[] evaluates → +'' → 0
({} + [])      // '[object Object]' — forced as expression
console.log({} + []);  // '[object Object]' (it's an argument → expression)
```

## 7. More Output Prediction
```js
console.log(1 + '1');        // '11'
console.log('1' - 1);        // 0
console.log(2 + true);       // 3
console.log('a' - 1);        // NaN
console.log([1] + [2]);      // '12'
console.log([1,2] + [3]);    // '1,23'
console.log(+[]);            // 0
console.log(+[1]);           // 1
console.log(+[1,2]);         // NaN
console.log(+{});            // NaN
console.log(null + undefined); // NaN
console.log('' == 0);        // true
console.log('' == false);    // true
console.log(' \t\n ' == 0);  // true (whitespace string → 0)
console.log([] == 0);        // true
console.log([0] == false);   // true
console.log(NaN == NaN);     // false
```

## 8. Comparison Coercion Rules (== algorithm, simplified)
```
x == y:
  same type        → ===
  null == undefined → true (and vice versa)
  number == string  → string→Number
  boolean == any    → boolean→Number
  object == primitive → object→ToPrimitive, retry
  NaN involved      → false
```

## 9. Common Mistakes
- Using `+` for math when an operand is a string.
- `==` surprises (`[] == ![]`, `'' == 0`).
- `parseInt` without radix (`parseInt('08')` historically octal-ish — always pass `10`).
- Assuming `Number('')` is `NaN` (it's `0`).
- Relying on object coercion (`{}`/`[]` arithmetic).

## 10. Best Practices
- Convert explicitly: `Number(x)`, `String(x)`, `Boolean(x)`, `parseInt(x, 10)`.
- Use `===`; avoid relying on coercion.
- Validate/parse user input deliberately.
- Use `Number.isNaN` to check NaN.

## 11. Performance
- Coercion is cheap individually but repeated coercion in hot loops / string concatenation can add up.
- Stable types help V8 (mixed-type operations can deopt).

## 12. Production Use Cases
- Parsing form inputs (`Number(input.value)`), query params.
- Boolean flags from env/strings (`Boolean(process.env.FLAG)` is tricky — `'false'` is truthy! parse explicitly).
- Building display strings via template literals (explicit ToString).

## 13. Interview Questions
**🟢:** Implicit vs explicit conversion? · What does `'5' + 1` vs `'5' - 1` give? · Falsy values?
**🟡:** Explain `[] + []`, `[] + {}`, `null + 1`. · ToNumber/ToString/ToBoolean rules? · Why `Number('') === 0`?
**🔴:** `{} + []` = 0 vs '[object Object]' — explain. · `[] == ![]` step by step. · ToPrimitive (valueOf vs toString, hints). · `==` algorithm.
**🧩:** A form value `'0'` is treated as falsy incorrectly — fix. · `'false'` env var is truthy — handle. · Sum breaks because input is a string — coerce.

**Follow-ups:** "Why does `+` differ from other operators?" · "How does the engine decide string vs number for `+`?" (ToPrimitive both, if either is string → concat) · "How to safely parse?" (Number/parseInt + validation).

## ⚡ REVISION
- Explicit: `Number/String/Boolean/parseInt(,10)/+x/!!x`. Implicit: operators auto-coerce.
- `+` → string if any operand is string; else number. Others → ToNumber.
- ToNumber: ''→0, '5'→5, true→1, null→0, undefined→NaN, []→0, [n]→n, [a,b]/{}→NaN.
- Famous: `[]+[]→''`, `[]+{}→'[object Object]'`, `{}+[]→0` (block) or '[object Object]' (expr), `null+1→1`, `undefined+1→NaN`, `true+true→2`, `'5'-1→4`, `'5'+1→'51'`.
- Use `===` + explicit conversion.

➡️ Next: **Loops.**
