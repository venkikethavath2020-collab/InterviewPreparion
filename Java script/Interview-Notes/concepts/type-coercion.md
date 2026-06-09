# Type Conversion & Coercion

## Definition

- **Type conversion (explicit)**: you deliberately convert, e.g. `Number("42")`.
- **Type coercion (implicit)**: the engine converts automatically during an operation, e.g. `"5" - 3 → 2`.

## Why It Exists

JavaScript is dynamically and weakly typed; operators define rules for mixing types so expressions still produce a value rather than erroring.

## Internal Working

Operators coerce operands toward a primitive via `ToNumber`, `ToString`, `ToBoolean`, or `ToPrimitive` (which calls `valueOf`/`toString`).

## Explicit Conversion

```js
// To string
String(123);        // "123"
(3.14159).toString();

// To number
Number("456");      // 456
+"42";              // 42  (unary plus)
parseInt("3.14px", 10); // 3
parseFloat("3.14px");   // 3.14
parseInt("101", 2);     // 5  (binary)

// To boolean
Boolean(1);   // true
!!"text";     // true (double-bang idiom)
```

## Conversion Tables

**To Number:**
```text
"33"   → 33      ""        → 0
"33ab" → NaN     true      → 1
true   → 1       false     → 0
null   → 0       undefined → NaN
```

**To Boolean — falsy values:** `false, 0, -0, 0n, "", null, undefined, NaN`. Everything else is truthy.

## Implicit Coercion (the tricky part)

```js
"5" + 3;    // "53"  (+ with a string → concatenation)
"5" - 3;    // 2     (- forces numbers)
"5" * "2";  // 10
true + 1;   // 2     (true → 1)
1 + 2 + "2";   // "32" (left-to-right: 3, then "32")
"1" + 2 + 3;   // "123"
```

**Objects/arrays to primitives:**
```js
+[];        // 0    ([] → "" → 0)
+[1];       // 1    ([1] → "1" → 1)
+[1, 2];    // NaN  ("1,2" → NaN)
+{ valueOf: () => 10 }; // 10
+new Date(); // milliseconds since epoch
```

## NaN Checks

```js
Number.isNaN(NaN);  // true  (reliable — no coercion)
isNaN("foo");       // true  (global isNaN coerces first — avoid)
NaN === NaN;        // false (NaN is never equal to itself)
```

## == vs ===

```js
0 == "";     // true  (loose, coerces)
0 == "0";    // true
null == undefined; // true
NaN == NaN;  // false
0 === "";    // false (strict, no coercion)
```
> Prefer `===` to avoid surprising coercions.

## Interview Explanation

> "`+` means concatenation if either operand is a string, otherwise addition. Other arithmetic operators coerce to numbers. `==` coerces; `===` doesn't. Use `Number.isNaN` over global `isNaN`."

## Common Mistakes

* Expecting `"5" + 3` to be `8`.
* Using `==` and hitting coercion surprises.
* Trusting global `isNaN` (coerces) instead of `Number.isNaN`.
* Pre-increment vs post-increment confusion (`++x` returns new value, `x++` returns old).

## Pre/Post Increment

```js
let x = 5;
let y = ++x; // x=6, y=6 (pre: increment then return)
let a = 5;
let b = a++; // a=6, b=5 (post: return then increment)
```

## Interview Questions

1. Output of `"5" + 3`, `"5" - 3`, `[] + []`, `[] + {}`.
2. List all falsy values.
3. `==` vs `===`.
4. Why is `NaN === NaN` false? How do you test for `NaN`?

## Key Takeaways

* `+` is overloaded (concat vs add); other math operators coerce to number.
* Memorize the falsy list and the `==` pitfalls.
* Use `===` and `Number.isNaN`.

Related: [variables-and-datatypes](./variables-and-datatypes.md), [strict-mode](./strict-mode.md).
