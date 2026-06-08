# ESSENTIAL JS — SECTION 2: OPERATORS

---

## 1. Arithmetic Operators
`+ - * / % ** ++ --`
```js
5 % 2     // 1 (remainder)
2 ** 10   // 1024 (exponent)
'5' * 2   // 10 (string coerced to number)
'5' + 2   // '52' (+ with string = concatenation!)
5 / 0     // Infinity
0 / 0     // NaN
```
**Key:** `+` is overloaded — string concatenation if either operand is a string; numeric otherwise. All other arithmetic ops coerce to number.

## 2. Comparison Operators
`== === != !== > < >= <=`
- **`==`** loose (coerces types), **`===`** strict (no coercion).
- Relational (`<`, `>`) coerce to number (or compare strings lexicographically if both strings).
```js
'10' > '9'   // false (string compare: '1' < '9')
'10' > 9     // true  (number compare)
null >= 0    // true  (relational coerces null→0)
null == 0    // false (== has special null/undefined rule)
```

## 3. Logical Operators
`&& || !`
- **Short-circuit + return operands (not booleans):**
```js
a && b   // returns a if falsy, else b
a || b   // returns a if truthy, else b
'x' && 'y'  // 'y'
0 || 'default'  // 'default'
null && fn()    // null (fn NOT called — short-circuit)
```
**Use:** guards (`user && user.name`), defaults (`x || fallback`), conditional execution (`isValid && submit()`).

## 4. Ternary Operator
`condition ? a : b` — the only ternary operator; an expression (returns a value).
```js
const status = age >= 18 ? 'adult' : 'minor';
// chainable but avoid deep nesting (readability)
```

## 5. Optional Chaining `?.`
Short-circuits to `undefined` if the value before it is `null`/`undefined` (instead of throwing).
```js
user?.address?.city           // undefined if user/address null
user?.getName?.()             // call only if exists
arr?.[0]                      // optional index
obj?.prop ?? 'default'        // common combo
```
**Why:** avoids verbose `user && user.address && user.address.city`.

## 6. Nullish Coalescing `??`
Returns the right side **only if left is `null` or `undefined`** (NOT other falsy values like `0`/`''`).
```js
0 ?? 5        // 0   (0 is not null/undefined)
0 || 5        // 5   (0 is falsy)
'' ?? 'x'     // ''
null ?? 'x'   // 'x'
```
**Why it exists:** `||` treats `0`, `''`, `false` as "missing" — bug for valid falsy values. `??` only checks null/undefined.

## 7. Logical Assignment Operators (ES2021)
```js
a ||= b   // a = a || b   (assign if a falsy)
a &&= b   // a = a && b   (assign if a truthy)
a ??= b   // a = a ?? b   (assign if a null/undefined)
```
```js
config.timeout ??= 3000;       // set default only if missing
user.name ||= 'Anonymous';     // set if empty
obj.cache &&= refresh(obj.cache);  // update only if exists
```

---

## Comparisons

### `==` vs `===`
| | `==` (loose) | `===` (strict) |
|---|-------------|----------------|
| Coercion | Yes | No |
| Compares | After type conversion | Type + value |
| `1 == '1'` | true | false |
| `null == undefined` | true | false |
**Best practice:** always `===` (except the idiomatic `x == null` to check null OR undefined in one shot).

### `||` vs `??`
| | `\|\|` | `??` |
|---|------|------|
| Triggers on | any falsy (0, '', false, null, undefined, NaN) | only null/undefined |
| Use | generic fallback | default for valid-falsy values |
```js
const count = userCount || 10;   // ❌ 0 becomes 10
const count2 = userCount ?? 10;  // ✅ 0 stays 0
```

### Falsy vs Nullish
- **Falsy (8):** `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`.
- **Nullish (2):** `null`, `undefined` only.
```js
Boolean(0)   // false (falsy)
0 ?? 1       // 0 (not nullish)
```

---

## Tricky Edge Cases
```js
NaN === NaN          // false
[] == ![]            // true  ([]→'' , ![]→false→0, ''→0)
null == 0            // false (special)
null >= 0            // true  (relational coerces)
1 < 2 < 3            // true  ((1<2)=true→1, 1<3=true)
3 > 2 > 1            // false ((3>2)=true→1, 1>1=false)
'' || '0' || 0       // '0'
0 ?? false ?? 'x'    // 0
typeof NaN           // 'number'
+true                // 1
'' + null            // 'null'
```

## Output Prediction
```js
console.log(1 + 2 + '3');     // '33'
console.log('1' + 2 + 3);     // '123'
console.log(5 + null);        // 5
console.log('5' - 2);         // 3
console.log(0 || '' || 'x');  // 'x'
console.log(0 ?? 'x');        // 0
console.log(false ?? true);   // false
console.log([1,2] + [3,4]);   // '1,23,4'
console.log(null ?? undefined ?? 'last');  // 'last'
```

## Interview Questions
**🟢:** `==` vs `===`? · `||` vs `??`? · Optional chaining purpose? · What does `&&`/`||` return?
**🟡:** Falsy vs nullish? · Why `0 || 5` vs `0 ?? 5`? · Logical assignment operators? · Short-circuit evaluation?
**🔴:** Why `[] == ![]` is true (step by step). · Why can't you mix `??` with `||`/`&&` without parens? · Relational coercion (`null >= 0` vs `null == 0`).
**🧩:** A default `count || 10` breaks when count is 0 — fix (`??`). · Safe deep property access (optional chaining). · Conditional method call without errors.

## ⚡ REVISION
- `+` concatenates if any string; other arithmetic coerces to number.
- `===` no coercion (use it); `==` coerces (only `x == null` idiom).
- `&&`/`||` short-circuit + return operands (not booleans).
- `??` = fallback only for null/undefined (use over `||` when 0/''/false are valid).
- `?.` safe access; `||=`/`&&=`/`??=` logical assignment.
- Falsy = 8 values; Nullish = null/undefined only.

➡️ Next: **Type Conversion.**
