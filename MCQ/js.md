## JavaScript MCQ Quick Revision Sheet (Clean Version)

### Section 1: Core JavaScript Basics

1. **typeof undefined**

   Answer: `"undefined"`

   ****Explanation****: `typeof` returns the string `"undefined"` for undefined values.

   Deeper: `typeof` is the only operator that never throws on an undeclared variable — `typeof notDeclared` safely returns `"undefined"` instead of a `ReferenceError`.

   Example: `typeof undefined === "undefined"` and `typeof somethingNeverDeclared === "undefined"`.

2. **2 + "2"**

   Answer: `"22"`

   **Explanation**: Number is converted to string and concatenated.

   Deeper: The `+` operator is overloaded — if either operand is a string, it does concatenation; otherwise it does numeric addition. This is why operand order and types matter.

   Example: `2 + "2"` → `"22"`, but `2 + 2 + "2"` → `"42"` (left-to-right: `4` then `"42"`).

3. **Which is NOT a primitive type?**

   Answer: `object`

   **Explanation**: Objects are reference types.

   Deeper: The 7 primitives are `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Primitives are immutable and compared by value; objects are compared by reference.

   Example: `"a" === "a"` is `true`, but `{} === {}` is `false` (different references).

4. ```javascript
   var a;
   console.log(a);
   ```

   Answer: `undefined`

   **Explanation**: `var` is hoisted and initialized with `undefined`.

   Deeper: Declaration and initialization are separate phases — `var a` is moved to the top of the function scope during hoisting and auto-assigned `undefined` until the assignment line runs.

   Example: `console.log(a); var a = 5;` logs `undefined`, not `ReferenceError`.

5. **Block scoped keyword**

   Answer: `let` and `const`

   **Explanation**: `let` and `const` are block scoped.

   Deeper: Block scoping means the variable only lives inside the nearest `{}`. This fixes classic loop-closure bugs that `var` (function scoped) caused.

   Example: `for (let i=0;i<3;i++) setTimeout(()=>console.log(i))` logs `0 1 2`, while `var` logs `3 3 3`.

6. **null == undefined**

   Answer: `true`

   **Explanation**: Loose equality treats `null` and `undefined` as equal.

   Deeper: This is a special-cased rule in the spec — `null` and `undefined` are loosely equal to each other and to nothing else (not even `0` or `""`).

   Example: `null == undefined` → `true`, but `null == 0` → `false`.

7. **typeof []**

   Answer: `"object"`

   **Explanation**: Arrays are a special type of object.

   Deeper: `typeof` can't distinguish arrays from plain objects — always use `Array.isArray()` for reliable detection.

   Example: `typeof [] === "object"` but `Array.isArray([]) === true`.

8. **Default value of a var variable**

   Answer: `undefined`

   **Explanation**: `var` variables are automatically initialized.

   Deeper: `undefined` means "declared but no value assigned"; it's distinct from `null`, which is an intentional "no value" you assign yourself.

   Example: `var x;` gives `x === undefined`, whereas `var y = null;` is a deliberate empty value.

9. **Boolean(0)**

   Answer: `false`

   **Explanation**: `0` is a falsy value.

   Deeper: The 8 falsy values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else (including `"0"`, `[]`, `{}`) is truthy.

   Example: `Boolean(0)` → `false`, but `Boolean("0")` → `true` and `Boolean([])` → `true`.

10. **Convert JSON string to object**

    Answer: `JSON.parse()`

    **Explanation**: Converts JSON text to a JavaScript object.

    Deeper: The inverse is `JSON.stringify()`. `JSON.parse` throws on invalid JSON, so wrap it in try/catch when parsing untrusted input.

    Example: `JSON.parse('{"a":1}')` → `{a: 1}`; `JSON.stringify({a:1})` → `'{"a":1}'`.

---

# Section 2: Hoisting, Closures, Async

11. ```javascript
    console.log(a);
    let a = 5;
    ```

    Answer: `ReferenceError`

    **Explanation**: `let` variables are in Temporal Dead Zone before initialization.

    Deeper: `let`/`const` are hoisted too, but stay uninitialized in the TDZ — the zone between the start of the scope and the declaration line where access throws.

    Example: Accessing `a` before `let a = 5` throws `ReferenceError: Cannot access 'a' before initialization`.

12. ```javascript
    function test(){
      return
      { name: "JS" }
    }
    test()
    ```

    Answer: `undefined`

    **Explanation**: Automatic semicolon insertion ends the return statement.

    Deeper: ASI inserts a `;` right after `return`, so the object literal becomes unreachable dead code. Always keep the opening `{` on the same line as `return`.

    Example: `return {` on one line works; `return` then `{` on the next line returns `undefined`.

13. ```javascript
    for(var i=0;i<3;i++){
      setTimeout(()=>console.log(i),0)
    }
    ```

    Answer: `3 3 3`

    **Explanation**: `var` is function scoped and shares the same variable.

    Deeper: All three callbacks close over the *same* `i`; by the time they run (after the loop), `i` is `3`. Swap `var` for `let` to get a fresh binding per iteration.

    Example: With `let i`, the output becomes `0 1 2`.

14. ```javascript
    const {a = 3} = {};
    ```

    Answer: `3`

    **Explanation**: Default value is used when property does not exist.

    Deeper: Destructuring defaults trigger only when the value is `undefined` (missing), not when it's `null`. Useful for safe option-object parsing.

    Example: `const {a = 3} = {a: null}` gives `a === null`, but `{a: undefined}` gives `a === 3`.

15. ```javascript
    foo();
    function foo(){ console.log("Hello"); }
    ```

    Answer: `"Hello"`

    **Explanation**: Function declarations are fully hoisted.

    Deeper: The entire function body is hoisted, so it's callable before its definition. Function *expressions* (`const foo = () => {}`) are not — only the variable is hoisted.

    Example: `foo(); const foo = () => {}` throws (TDZ), but the declaration form above works.

16. **typeof NaN**

    Answer: `"number"`

    **Explanation**: `NaN` is a special numeric value.

    Deeper: `NaN` is the only value not equal to itself, so use `Number.isNaN(x)` (not `x === NaN`) to test for it.

    Example: `NaN === NaN` → `false`; `Number.isNaN(NaN)` → `true`.

17. ```javascript
    Promise.resolve().then(()=>console.log("A"));
    console.log("B");
    ```

    Answer: `B A`

    **Explanation**: Synchronous code runs before microtasks.

    Deeper: The call stack empties first, then the microtask queue (promises) drains fully before any macrotask (setTimeout). So sync → microtasks → macrotasks.

    Example: Adding `setTimeout(()=>console.log("C"))` prints `B A C`.

18. ```javascript
    let arr=[1,2,3];
    arr.length = 1;
    ```

    Answer: `[1]`

    **Explanation**: Reducing length truncates the array.

    Deeper: `length` is writable — lowering it deletes trailing elements, raising it creates sparse "empty" slots (not `undefined` values).

    Example: `arr.length = 5` on `[1]` gives `[1, <4 empty items>]`.

19. **0 === false**

    Answer: `false`

    **Explanation**: Strict equality checks both type and value.

    Deeper: `===` never coerces — different types are always unequal. Prefer it over `==` to avoid surprising coercion bugs.

    Example: `0 == false` → `true` (coerced), but `0 === false` → `false` (number vs boolean).

20. **Which is NOT a JavaScript loop?**

    Answer: `foreach`

    **Explanation**: `forEach` is an array method, not a loop keyword.

    Deeper: Real loop statements are `for`, `for...of`, `for...in`, `while`, `do...while`. `forEach` can't `break`/`continue` or `await` properly — use `for...of` when you need those.

    Example: You can't `break` out of `arr.forEach(...)`, but you can in `for (const x of arr)`.

---

# Section 3: Practical JavaScript

21. **"5" - 3**

    Answer: `2`

    **Explanation**: `-` converts operands to numbers.

    Deeper: Unlike `+`, the `-`, `*`, `/` operators have no string mode — they always coerce to numbers, yielding `NaN` if conversion fails.

    Example: `"5" - 3` → `2`, but `"abc" - 3` → `NaN`.

22. **[] + {}**

    Answer: `"[object Object]"`

    **Explanation**: Array converts to empty string and object to string.

    Deeper: Both operands are coerced to primitives: `[]` → `""` and `{}` → `"[object Object]"`, then concatenated.

    Example: `[] + {}` → `"[object Object]"`, but `{} + []` at statement start can be `0` (the `{}` parses as a block).

23. **Stop event bubbling**

    Answer: `stopPropagation()`

    **Explanation**: Prevents event propagation to parent elements.

    Deeper: `stopPropagation()` halts the bubble/capture chain but still runs other listeners on the same element; `stopImmediatePropagation()` also blocks those.

    Example: `el.addEventListener('click', e => e.stopPropagation())` keeps a parent's click handler from firing.

24. **Math.max()**

    Answer: `-Infinity`

    **Explanation**: No arguments returns negative infinity.

    Deeper: `-Infinity` is the identity for max (anything beats it); symmetrically `Math.min()` returns `Infinity`. Spread an array to use them: `Math.max(...arr)`.

    Example: `Math.max()` → `-Infinity`; `Math.max(...[1,2,3])` → `3`.

25. ```javascript
    var a = 10;
    (function(){
      a = 20;
    })();
    ```

    Answer: `20`

    **Explanation**: No local declaration modifies global variable.

    Deeper: Without `var`/`let`/`const` inside the IIFE, the assignment walks the scope chain and reassigns the outer `a`. In strict mode an undeclared assignment would throw instead.

    Example: Adding `var a = 20;` inside would shadow the outer `a`, leaving it `10`.

26. **Returns a new array**

    Answer: `map()`

    **Explanation**: `map` creates a new transformed array.

    Deeper: `map`/`filter`/`slice`/`concat` are non-mutating (return new arrays); `push`/`splice`/`sort`/`reverse` mutate in place. Prefer non-mutating ops in state management (React/Vue).

    Example: `[1,2,3].map(x => x*2)` → `[2,4,6]`, original array unchanged.

27. **typeof function(){}**

    Answer: `"function"`

    **Explanation**: Functions have a special `typeof` result.

    Deeper: Functions are callable objects — `typeof` reports `"function"`, but they still inherit from `Object` and can hold properties.

    Example: `const f = () => {}; f.tag = 1; typeof f` → `"function"`, and `f.tag` → `1`.

28. **parseInt("10px")**

    Answer: `10`

    **Explanation**: Parsing stops at the first non-numeric character.

    Deeper: `parseInt` reads leading digits and ignores the rest; always pass the radix (`parseInt("10", 10)`) to avoid legacy octal/hex surprises.

    Example: `parseInt("10px")` → `10`, but `Number("10px")` → `NaN` (strict).

29. **JavaScript threading model**

    Answer: `Single-threaded`

    **Explanation**: JavaScript runs on a single call stack.

    Deeper: Concurrency comes from the event loop offloading async work (timers, I/O) to the host; for true parallelism use Web Workers, which run in separate threads.

    Example: A long `while(true){}` blocks all rendering and events because there's one thread.

30. **!!""**

    Answer: `false`

    **Explanation**: Double negation converts falsy value to boolean.

    Deeper: `!!x` is a concise idiom for `Boolean(x)` — the first `!` negates to a boolean, the second flips it back.

    Example: `!!""` → `false`, `!!"text"` → `true`, `!!0` → `false`.

---

# Top 50 Repeated JavaScript MCQs

## Core JavaScript Basics

1. **typeof undefined**

   Answer: `"undefined"`

   **Explanation**: `typeof` returns a string representing the type.

   Deeper: It's safe on undeclared identifiers, making it handy for feature detection.

   Example: `typeof window !== "undefined"` checks if running in a browser.

2. **typeof null**

   Answer: `"object"`

   **Explanation**: Historical bug in JavaScript.

   Deeper: A legacy artifact of the original type-tag representation that can never be fixed without breaking the web. To detect `null`, compare directly.

   Example: `x === null` is the correct null check, not `typeof x === "object"`.

3. **typeof NaN**

   Answer: `"number"`

   **Explanation**: `NaN` belongs to number type.

   Deeper: `NaN` results from invalid math (`0/0`, `parseInt("x")`); test it with `Number.isNaN`.

   Example: `Number.isNaN(0/0)` → `true`.

4. **Is JavaScript statically typed?**

   Answer: `No`

   **Explanation**: JavaScript is dynamically typed.

   Deeper: Types are bound to values at runtime, so a variable can change type. TypeScript adds static typing at compile time only.

   Example: `let x = 5; x = "now a string";` is legal in JS.

5. **Default value of uninitialized var**

   Answer: `undefined`

   **Explanation**: `var` is initialized during hoisting.

   Deeper: This is why reading a `var` before assignment gives `undefined` rather than throwing.

   Example: `console.log(x); var x = 1;` logs `undefined`.

---

## Equality and Type Coercion

6. **0 == false**

   Answer: `true`

   **Explanation**: Loose equality performs type conversion.

   Deeper: `==` coerces both sides to numbers here (`false` → `0`). This is why `==` is error-prone — prefer `===`.

   Example: `"" == false` → `true` too, since both become `0`.

7. **0 === false**

   Answer: `false`

   **Explanation**: Strict equality compares type and value.

   Deeper: Number vs boolean — no coercion, so unequal. Use `===` as your default comparison.

   Example: `0 === 0` → `true`, `0 === false` → `false`.

8. **null == undefined**

   Answer: `true`

   **Explanation**: Special equality rule.

   Deeper: They're loosely equal only to each other — a common way to null-check both at once is `x == null`.

   Example: `if (x == null)` catches both `null` and `undefined`.

9. **null === undefined**

   Answer: `false`

   **Explanation**: Different types.

   Deeper: `typeof null` is `"object"` and `typeof undefined` is `"undefined"`, so strict equality fails.

   Example: `null === undefined` → `false`, `null == undefined` → `true`.

10. **[] == false**

    Answer: `true`

    **Explanation**: Array converts to empty string then to zero.

    Deeper: Coercion chain: `[]` → `""` (primitive) → `0` (number); `false` → `0`; `0 == 0` is `true`. A great example of why `==` surprises people.

    Example: `[] == false` → `true`, but `[] === false` → `false`.

---

## Hoisting and Scope

11. **Accessing var before assignment**

    Answer: `undefined`

    **Explanation**: `var` is hoisted.

    Deeper: Only the declaration hoists, not the assignment, so the value is `undefined` until the line runs.

    Example: `console.log(a); var a = 2;` → `undefined`.

12. **Accessing let before initialization**

    Answer: `ReferenceError`

    **Explanation**: Temporal Dead Zone.

    Deeper: `let`/`const` exist but are unreachable from scope start until their declaration line.

    Example: `console.log(b); let b = 2;` throws `ReferenceError`.

13. **Are function declarations hoisted?**

    Answer: `Yes`

    **Explanation**: Entire function is hoisted.

    Deeper: Both name and body hoist, so you can call before defining. Arrow/expression functions don't get this.

    Example: `greet(); function greet(){}` works; `greet(); const greet = () => {}` throws.

14. **var scope**

    Answer: `Function scope`

    **Explanation**: Not block scoped.

    Deeper: A `var` inside an `if`/`for` block leaks to the enclosing function, a frequent source of bugs.

    Example: `if(true){ var x = 1 } console.log(x)` → `1`.

15. **let / const scope**

    Answer: `Block scope`

    **Explanation**: Scoped to `{}`.

    Deeper: Each block gets its own binding, which is why `let` fixes loop-closure issues.

    Example: `{ let x = 1 } console.log(x)` → `ReferenceError`.

---

## Arrays

16. **typeof []**

    Answer: `"object"`

    **Explanation**: Arrays are objects.

    Deeper: Arrays are objects with integer keys and a magic `length`; `typeof` can't tell them apart from `{}`.

    Example: `typeof [] === typeof {}` → `true`.

17. **Proper way to check array**

    Answer: `Array.isArray()`

    **Explanation**: Reliable array detection.

    Deeper: It works across iframes/realms where `instanceof Array` can fail due to different global constructors.

    Example: `Array.isArray([1,2])` → `true`, `Array.isArray("ab")` → `false`.

18. **arr.length = 0**

    Answer: `Clears array`

    **Explanation**: Removes all elements.

    Deeper: This truncates in place, keeping the same reference — useful when other code holds the same array.

    Example: `const a=[1,2]; a.length=0;` leaves `a === []` but same object identity.

19. **arr[10] = 5, length?**

    Answer: `11`

    **Explanation**: Length equals highest index plus one.

    Deeper: Skipped indices become sparse "holes" that most iteration methods skip over.

    Example: `const a=[]; a[10]=5; a.length` → `11`, and `a.filter(Boolean)` → `[5]`.

20. **Does map() mutate array?**

    Answer: `No`

    **Explanation**: Returns a new array.

    Deeper: `map` always returns a new same-length array; use it for transforms, not side effects (use `forEach`/`for...of` for those).

    Example: `[1,2].map(x=>x+1)` → `[2,3]`, original intact.

---

## Strings and Numbers

21. **"5" + 1**

    Answer: `"51"`

    **Explanation**: String concatenation.

    Deeper: `+` with any string operand concatenates rather than adds.

    Example: `"5" + 1` → `"51"`, `1 + "5"` → `"15"`.

22. **"5" - 1**

    Answer: `4`

    **Explanation**: Numeric coercion.

    Deeper: `-` forces numeric context, a common trick to coerce a numeric string (`+"5"` does the same).

    Example: `"5" - 1` → `4`, `+"5"` → `5`.

23. **parseInt("10px")**

    Answer: `10`

    **Explanation**: Stops parsing at non-number.

    Deeper: Reads leading digits only; pass a radix to be safe (`parseInt(s, 10)`).

    Example: `parseInt("0x1F", 16)` → `31`.

24. **Number("10px")**

    Answer: `NaN`

    **Explanation**: Full numeric conversion required.

    Deeper: `Number()` is strict — the whole string must be a valid number, unlike `parseInt`.

    Example: `Number("10")` → `10`, `Number("10px")` → `NaN`.

25. **Boolean("")**

    Answer: `false`

    **Explanation**: Empty string is falsy.

    Deeper: Empty string is the only falsy string; whitespace `" "` is truthy.

    Example: `Boolean("")` → `false`, `Boolean(" ")` → `true`.

---

## Objects

26. **Object keys type**

    Answer: `String or Symbol`

    **Explanation**: Keys are converted to strings.

    Deeper: Numeric keys become strings; use a `Map` if you need real non-string keys or insertion order guarantees.

    Example: `const o={}; o[1]="a"; Object.keys(o)` → `["1"]`.

27. **{} == {}**

    Answer: `false`

    **Explanation**: Different object references.

    Deeper: Objects compare by identity, not contents — two literals are always distinct references.

    Example: `const a={}; a === a` → `true`, but `{} === {}` → `false`.

28. **Best structure for object keys**

    Answer: `Map`

    **Explanation**: Supports non-string keys.

    Deeper: `Map` keeps key types (objects, functions), preserves insertion order, and exposes `.size`/iteration directly.

    Example: `new Map([[obj, "v"]]).get(obj)` → `"v"`.

29. **Shallow clone object**

    Answer: `Object.assign()` or spread operator

    **Explanation**: Copies first level properties.

    Deeper: Nested objects are shared by reference — for a true copy use `structuredClone(obj)`.

    Example: `const b = {...a}` copies top level; `b.nested === a.nested` is still `true`.

30. **JSON to object conversion**

    Answer: `JSON.parse()`

    **Explanation**: Converts JSON string to object.

    Deeper: `JSON.parse`/`stringify` can also do a quick deep clone of JSON-safe data, but it drops functions, `undefined`, and `Date` becomes a string.

    Example: `JSON.parse(JSON.stringify({a:{b:1}}))` deep-clones plain data.

---

## Closures

31. **Closure definition**

    Answer: `Function with lexical scope`

    **Explanation**: Access to outer variables.

    Deeper: A closure is a function bundled with the variable environment it was created in, so it remembers outer variables even after that scope returns.

    Example: `function counter(){let n=0; return ()=>++n}` keeps `n` alive across calls.

32. **New function call creates new closure**

    Answer: `Yes`

    **Explanation**: New lexical environment.

    Deeper: Each invocation builds a fresh scope, so two counters from the same factory don't share state.

    Example: `const a=counter(), b=counter(); a(); a(); b();` → `a` at 2, `b` at 1.

33. **Closures used for**

    Answer: `Data hiding`

    **Explanation**: Encapsulation pattern.

    Deeper: Closures power private state, memoization, currying, and the module pattern.

    Example: `const make = () => { let secret = 1; return { get: () => secret } }` hides `secret`.

---

## Async and Event Loop

34. **Is JavaScript single-threaded?**

    Answer: `Yes`

    **Explanation**: Uses one call stack.

    Deeper: The single thread plus the event loop is what makes JS non-blocking via callbacks/promises; CPU-heavy work still freezes the UI.

    Example: Offload heavy computation to a Web Worker to keep the main thread responsive.

35. **Promise callbacks go to**

    Answer: `Microtask queue`

    **Explanation**: Higher priority queue.

    Deeper: The microtask queue drains completely after each task and before rendering/macrotasks, so promises resolve sooner than timers.

    Example: `.then` and `queueMicrotask` callbacks beat `setTimeout(...,0)`.

36. **setTimeout goes to**

    Answer: `Macrotask queue`

    **Explanation**: Runs after microtasks.

    Deeper: Even `setTimeout(fn, 0)` waits for the stack to clear and all microtasks to finish, and is clamped to ~4ms minimum after nesting.

    Example: `setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(1))` → `1 2`.

37. **Execution order**

    Answer: `Sync → Microtask → Macrotask`

    **Explanation**: Event loop priority.

    Deeper: One macrotask runs, then the entire microtask queue drains, then the browser may render, then the next macrotask.

    Example: A flood of `.then` chains can starve `setTimeout` callbacks.

38. **async/await built on**

    Answer: `Promises`

    **Explanation**: Syntactic sugar.

    Deeper: `await` pauses the function and schedules the continuation as a microtask; an `async` function always returns a promise.

    Example: `async function f(){ return 1 }` — `f()` is a `Promise` resolving to `1`.

---

## DOM and Browser

39. **Stop event bubbling**

    Answer: `stopPropagation()`

    **Explanation**: Prevents upward event flow.

    Deeper: It stops the event from reaching ancestors but doesn't prevent the default action — that's `preventDefault()`.

    Example: `e.stopPropagation()` keeps a click from triggering a parent's handler.

40. **Prevent default browser action**

    Answer: `preventDefault()`

    **Explanation**: Stops default behavior.

    Deeper: Cancels the browser's built-in response (form submit, link navigation) while still letting the event bubble.

    Example: `form.addEventListener('submit', e => e.preventDefault())` enables AJAX submission.

---

## Tricky but Common

41. **typeof function(){}**

    Answer: `"function"`

    **Explanation**: Special typeof value.

    Deeper: Functions are the only objects `typeof` labels distinctly; this is the standard way to check "is it callable".

    Example: `if (typeof cb === "function") cb()` guards optional callbacks.

42. **Math.max()**

    Answer: `-Infinity`

    **Explanation**: No arguments returns lowest number.

    Deeper: It's the identity element so any later value wins; `Math.min()` mirrors with `Infinity`.

    Example: `Math.max(-Infinity, 5)` → `5`.

43. **!!value meaning**

    Answer: `Boolean conversion`

    **Explanation**: Converts value to true or false.

    Deeper: Idiomatic shorthand for `Boolean(value)`; commonly used to coerce existence checks to real booleans.

    Example: `const hasName = !!user.name`.

44. **Is JavaScript case-sensitive?**

    Answer: `Yes`

    **Explanation**: Variable names are case-sensitive.

    Deeper: Identifiers, keywords, and property names all differ by case.

    Example: `let a=1, A=2;` are two distinct variables.

45. **Does const mean immutable value?**

    Answer: `No`

    **Explanation**: Reference is immutable.

    Deeper: `const` blocks reassignment of the binding, not mutation of the object it points to — freeze with `Object.freeze()` for shallow immutability.

    Example: `const a=[]; a.push(1)` works, but `a = []` throws.

---

## Output Prediction

46. ```javascript
    console.log(a);
    var a = 10;
    ```

Answer: `undefined`

**Explanation**: `var` hoisting.

Deeper: The declaration hoists to the top with value `undefined`; the assignment stays on line 2.

Example: It behaves like `var a; console.log(a); a = 10;`.

47. ```javascript
    console.log(b);
    let b = 10;
    ```

Answer: `ReferenceError`

**Explanation**: Temporal Dead Zone.

Deeper: `b` is hoisted but uninitialized until its declaration, so access throws.

Example: Moving `console.log(b)` below `let b = 10` fixes it.

48. **[] + []**

    Answer: `""`

    **Explanation**: Both arrays convert to empty strings.

    Deeper: Each `[]` coerces to `""` via `toString`, and `"" + ""` is `""`.

    Example: `[1] + [2]` → `"12"` (each array stringifies its contents).

49. **[] + {}**

    Answer: `"[object Object]"`

    **Explanation**: Object converts to string.

    Deeper: `[]` → `""` and `{}` → `"[object Object]"` via default `toString`, then concatenated.

    Example: `[] + {}` → `"[object Object]"`.

50. **!!"false"**

    Answer: `true`

    **Explanation**: Non-empty strings are truthy.

    Deeper: Truthiness is about the string being non-empty, not its contents — the text `"false"` is still a non-empty string.

    Example: `!!"false"` → `true`, `!!""` → `false`.


# JavaScript + Vue — Interview-Ready Notes

> **Use as a drill, not an article.** Cover the answer → say it out loud → check.
> You've already gotten 4 things wrong in prep by *reading* instead of *recalling*. Don't repeat it.
>
> ⚠️ = the follow-up the interviewer springs after the first answer.
> 🎯 = the one-liner to actually say in the room.

---

## 1. Execution Context

**What it is:** The environment where JS code runs. Two phases:

1. **Creation phase** — JS scans the code, sets up memory: `var` → `undefined`, functions → fully stored, `let`/`const` → reserved but unusable (TDZ).
2. **Execution phase** — runs line by line, assigns real values.

There's a **Global** context (created first) and a new **Function** context every time a function is called. They stack on the **Call Stack** (last in, first out).

🎯 *"Execution context is the environment code runs in. JS first sets up memory in a creation phase, then runs the code in an execution phase."*

⚠️ **"What's on the call stack?"** → Each function call pushes a new context; when it returns, it pops off. Stack overflow = too many calls (usually bad recursion).

---

## 2. Hoisting

**What it is:** During the creation phase, declarations are "moved to the top." But they behave differently:

```js
console.log(a);   // undefined  ← var is hoisted AND initialized to undefined
var a = 5;

console.log(b);   // ReferenceError ← let is hoisted but NOT initialized (TDZ)
let b = 5;

foo();            // works ← function declarations fully hoisted
function foo() {}

bar();            // ERROR ← function EXPRESSIONS are not
var bar = function () {};
```

**TDZ (Temporal Dead Zone)** = the gap between a `let`/`const` being hoisted and being assigned. Touching it there throws.

🎯 *"`var` hoists as undefined, `let`/`const` hoist but stay in the temporal dead zone until assigned, function declarations hoist fully."*

⚠️ **"Why TDZ exist?"** → To catch bugs — using a variable before you define it is almost always a mistake, so `let`/`const` make it an error instead of silently giving `undefined`.

---

## 3. Scope & Scope Chain

**Scope** = where a variable is accessible.
- **Global** — everywhere.
- **Function** — inside that function only.
- **Block** (`{}`) — `let`/`const` only; `var` ignores blocks.

**Scope chain** = when JS can't find a variable locally, it looks *outward* to the parent scope, then its parent, up to global. One direction only — outer scopes can't see inner.

```js
const a = 1;
function outer() {
  const b = 2;
  function inner() {
    console.log(a, b);  // finds b in outer, a in global — walks the chain
  }
  inner();
}
```

🎯 *"If a variable isn't found locally, JS walks up the scope chain to outer scopes until it finds it or hits global."*

---

## 4. Closures

**What it is:** An inner function that **remembers variables from its outer scope even after the outer function has returned.**

```js
function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const c = counter();   // run outer ONCE, keep the inner function
c(); // 1
c(); // 2  ← count stayed alive — that's the closure
```

⚠️ **THE trap:** `counter()` returns a **function**, not a number. And `counter(); counter();` gives `1, 1` (fresh count each time). Only `const c = counter(); c(); c();` climbs (`1, 2`) — because you **reuse** the same closure.

🎯 *"A closure lets an inner function keep access to its outer scope's variables after the outer function finishes. The variable stays alive as long as the closure references it."*

**Real uses:** private variables, counters, function factories, `useState`-style hooks.

---

## 5. `this`

**The rule: `this` depends on HOW a function is CALLED, not where it's defined.**

```js
obj.method();        // this = obj (the thing left of the dot)
standalone();        // this = undefined (strict) / window (non-strict)
new Foo();           // this = the new object
arrow();             // this = inherited from where it was DEFINED
```

**Arrow functions are the exception** — they don't get their own `this`, they grab it from the surrounding scope. That's *why* arrows are used in callbacks (to keep the outer `this`).

```js
const obj = {
  name: "Sam",
  greetLater() {
    setTimeout(() => console.log(this.name), 100);  // arrow → this = obj ✅
    // setTimeout(function(){ console.log(this.name) }) → this = undefined ❌
  }
};
```

🎯 *"`this` is determined by how a function is called. Arrow functions are the exception — they inherit `this` from where they're defined."*

⚠️ **"Left of the dot"** is the quick heuristic for normal calls: `a.b.c()` → `this` is `a.b`.

---

## 6. Call, Apply, Bind

All three set `this` manually. Difference is *how they pass arguments* and *when they run*:

```js
function greet(greeting) { return `${greeting}, ${this.name}`; }
const user = { name: "Sam" };

greet.call(user, "Hi");      // runs NOW, args comma-separated
greet.apply(user, ["Hi"]);   // runs NOW, args as an ARRAY
const bound = greet.bind(user, "Hi");  // returns a NEW function, run later
bound();                     // "Hi, Sam"
```

🎯 *"Call and apply invoke immediately — call takes comma args, apply takes an array. Bind returns a new function with `this` locked, to call later."*

Memory trick: **C**all = **C**omma, **A**pply = **A**rray, **B**ind = **B**ound for later.

---

## 7. Mutation vs Reassignment

**Mutation** = changing the contents of an object/array. **Reassignment** = pointing the variable at something new.

```js
const arr = [1, 2];
arr.push(3);    // ✅ mutation — same array, const allows it
arr = [9];      // ❌ reassignment — const forbids it
```

Why `const arr` allows `push`: the variable holds a **reference**, not the values. `const` locks the reference, not the contents.

```js
const a = [1, 2];
const b = a;     // b copies the REFERENCE — same array
b.push(3);
a;               // [1, 2, 3] — both point to one array

let c = a;
c = [9, 9];      // reassignment — c now points elsewhere
a;               // [1, 2, 3] — untouched
```

🎯 *"`const` prevents reassigning the variable, not mutating the value. Objects and arrays hold a reference, so their contents stay editable."*

⚠️ Mutation **shares** (same reference), reassignment **splits** (new reference). This is the root of the next topic AND Vue reactivity.

---

## 8. Deep vs Shallow Copy

**Shallow copy** = copies the top level; nested objects are still **shared references**.

```js
const obj = { name: "Sam", address: { city: "NYC" } };

const shallow = { ...obj };           // spread = shallow
shallow.name = "Alex";                // ✅ independent (top level)
shallow.address.city = "LA";          // ❌ ALSO changes obj.address.city — shared!
```

**Deep copy** = fully independent, nested included:

```js
const deep = structuredClone(obj);    // modern, built-in ✅
// or JSON.parse(JSON.stringify(obj)) — works but loses functions/dates
```

🎯 *"Spread and Object.assign are shallow — nested objects stay shared. For full independence use structuredClone."*

⚠️ **"Why does my copy still affect the original?"** → You did a shallow copy and mutated a *nested* object, which both still share.

---

## 9. Prototype Chain

**What it is:** Every object has a hidden link (`__proto__`) to another object — its prototype. When you access a property, JS checks the object, then its prototype, then *its* prototype, up to `null`. (Same outward-walk idea as the scope chain.)

```js
const arr = [1, 2];
arr.push(3);   // arr has no "push" itself — found on Array.prototype
```

This is how inheritance works in JS — objects borrow methods from their prototype instead of each having their own copy.

🎯 *"When you access a property, JS walks up the prototype chain until it finds it or hits null. It's how JS does inheritance and method sharing."*

⚠️ Class syntax (`class`, `extends`) is just nicer syntax over this prototype mechanism — not a different system.

---

## 10. Event Loop (async core — asked constantly)

JS is **single-threaded** — one thing at a time. The event loop is how it handles async without blocking.

**The pieces:**
- **Call stack** — runs your code.
- **Web APIs** — handle timers, fetch, events (outside JS).
- **Microtask queue** — Promises (`.then`, `await`). **Higher priority.**
- **Macrotask queue** — `setTimeout`, `setInterval`. Lower priority.

**Rule: the stack must be empty, then ALL microtasks run, then ONE macrotask. Repeat.**

```js
console.log("1");
setTimeout(() => console.log("2"), 0);   // macrotask
Promise.resolve().then(() => console.log("3"));  // microtask
console.log("4");

// Output: 1, 4, 3, 2
// sync first (1,4) → microtask (3) → macrotask (2)
```

🎯 *"JS is single-threaded. The event loop runs sync code, then drains all microtasks (Promises), then one macrotask (setTimeout). Promises always beat setTimeout."*

⚠️ **"setTimeout(fn, 0) — does it run immediately?"** → No. It waits for the stack to clear AND all microtasks to finish first. `0` is a minimum, not a guarantee.

---

## 11. Promises

**What it is:** An object representing a value that's **not ready yet**. Three states: **pending → fulfilled** or **rejected**. Once settled, it can't change.

```js
const p = fetch("/api/user")
  .then(res => res.json())   // runs on success
  .catch(err => console.log(err))  // runs on failure
  .finally(() => console.log("done"));  // always runs
```

Solves **callback hell** — chaining `.then` instead of nesting callbacks.

**Combinators worth knowing:**
- `Promise.all([...])` — waits for ALL, fails if any one fails.
- `Promise.allSettled([...])` — waits for all, never rejects (gives status of each).
- `Promise.race([...])` — first to settle wins.

🎯 *"A Promise represents a future value. It's pending, then either fulfilled or rejected, and once settled it's locked."*

---

## 12. Async / Await

**What it is:** Syntax sugar over Promises — makes async code *read* like sync code.

```js
async function getUser() {
  try {
    const res = await fetch("/api/user");   // pauses here till it resolves
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);   // handles rejected promises
  }
}
```

- `async` makes a function **always return a Promise**.
- `await` **pauses** until the Promise resolves — but only inside `async` functions.
- `try/catch` replaces `.catch`.

🎯 *"Async/await is cleaner syntax over Promises. `await` pauses until the Promise settles, and try/catch handles errors. The function still returns a Promise underneath."*

⚠️ **"Does await block the whole app?"** → No — it only pauses *that* function. Other code keeps running; the event loop isn't frozen.

---

## 13. ES6+ Features (rapid-fire — know one line each)

```js
let / const          // block scope, no more var
() => {}             // arrow functions, lexical this
`hello ${name}`      // template literals
const { a, b } = obj // destructuring
const [x, y] = arr   // array destructuring
...spread / ...rest  // expand / collect
function f(a = 1){}  // default params
import / export      // ES modules
class Foo {}         // class syntax (over prototypes)
async / await        // async sugar
obj?.a?.b            // optional chaining (no crash on undefined)
a ?? b               // nullish coalescing (b only if a is null/undefined)
```

⚠️ **`??` vs `||`:** `||` falls back on ANY falsy value (`0`, `""`, `false`). `??` falls back **only** on `null`/`undefined`. So `0 ?? 5` → `0`, but `0 || 5` → `5`. Common bug source.

---

## 14. Memory Management (short)

JS handles memory automatically via **garbage collection**. The rule: an object is kept while it's **reachable** (something still references it); when nothing references it, it becomes eligible for cleanup.

**Memory leaks happen when references hang around unintentionally:**
- Forgotten timers/intervals not cleared.
- Event listeners not removed.
- Closures holding large objects longer than needed.
- Global variables that never get released.

🎯 *"JS auto-frees memory through garbage collection — an object is collected once nothing references it. Leaks come from references you forgot to release, like uncleared intervals or listeners."*

---

## 15. Vue Reactivity Internals (the Vue-specific payoff)

**The core:** Vue 3 uses a **Proxy** to wrap your reactive data. The Proxy intercepts reads and writes:
- On **read** (get) → Vue **tracks** which effect (component render, computed, watcher) used that property.
- On **write** (set) → Vue **triggers** those tracked effects to re-run.

That track-on-read, trigger-on-write loop is the whole engine.

```js
const state = reactive({ count: 0 });
// reading state.count → Vue records "this render depends on count"
// state.count++ → Vue re-runs everything that depended on count
```

**Why `ref` needs `.value`:** Proxies only work on objects. Primitives (number, string) can't be proxied directly, so `ref` wraps the value in an object `{ value: x }` — and `.value` is the property the Proxy can intercept.

⚠️ **Connects to Mutation vs Reassignment (topic 7!):**
```js
let state = reactive({ count: 0 });
state.count++;        // ✅ mutation — Proxy intercepts, reactivity works
state = reactive({ count: 5 });  // ❌ reassignment — component still holds
                                 //    the OLD proxy, reactivity lost
```
Mutating keeps the same proxy (tracked). Reassigning points your variable at a new object the component isn't watching. **Same reference-vs-reassignment rule from topic 7** — now you see why it matters in Vue.

🎯 *"Vue 3 wraps data in a Proxy that tracks property reads and triggers updates on writes. `ref` needs `.value` because primitives can't be proxied, so they're wrapped in an object."*

---

## The connective tissue (this is what impresses)

Notice the **same idea** repeats across topics — point this out if you can:

- **Outward-walking lookup:** scope chain (vars) and prototype chain (properties) both walk *outward* until found.
- **Reference vs reassignment:** explains `const` arrays (7), shallow copy (8), AND why reassigning a `reactive` breaks Vue (15).
- **Single-threaded + queues:** event loop (10), Promises (11), async/await (12) are one story told three ways.

An interviewer who hears you connect these knows you *understand* JS, not just memorized 15 cards.

---

## Priority for your few days (Vue role)

**Drill these to the point you can WRITE them blank:**
1. Closures — the `counter()` reuse trap
2. `this` + arrow exception
3. Event loop output order (1, 4, 3, 2)
4. Mutation vs reassignment
5. Vue reactivity (Proxy, why `.value`)
6. async/await + try/catch

**Know cold but lighter:**
7. Hoisting + TDZ
8. Deep vs shallow copy
9. Call/apply/bind
10. `??` vs `||`

The rest (scope chain, prototype, memory, execution context, ES6 list) — read-level is fine; they're usually quick mentions, not whiteboard questions.

> Reading this once does nothing. Cover → recall → check. That's the only version that sticks.
