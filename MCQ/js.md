## JavaScript MCQ Quick Revision Sheet (Clean Version)

### Section 1: Core JavaScript Basics

1. **typeof undefined**
   Answer: `"undefined"`
   Explanation: `typeof` returns the string `"undefined"` for undefined values.

2. **2 + "2"**
   Answer: `"22"`
   Explanation: Number is converted to string and concatenated.

3. **Which is NOT a primitive type?**
   Answer: `object`
   Explanation: Objects are reference types.

4. ```javascript
   var a;
   console.log(a);
   ```

   Answer: `undefined`
   Explanation: `var` is hoisted and initialized with `undefined`.

5. **Block scoped keyword**
   Answer: `let` and `const`
   Explanation: `let` and `const` are block scoped.

6. **null == undefined**
   Answer: `true`
   Explanation: Loose equality treats `null` and `undefined` as equal.

7. **typeof []**
   Answer: `"object"`
   Explanation: Arrays are a special type of object.

8. **Default value of a var variable**
   Answer: `undefined`
   Explanation: `var` variables are automatically initialized.

9. **Boolean(0)**
   Answer: `false`
   Explanation: `0` is a falsy value.

10. **Convert JSON string to object**
    Answer: `JSON.parse()`
    Explanation: Converts JSON text to a JavaScript object.

---

# Section 2: Hoisting, Closures, Async

11. ```javascript
    console.log(a);
    let a = 5;
    ```

    Answer: `ReferenceError`
    Explanation: `let` variables are in Temporal Dead Zone before initialization.

12. ```javascript
    function test(){
      return
      { name: "JS" }
    }
    test()
    ```

    Answer: `undefined`
    Explanation: Automatic semicolon insertion ends the return statement.

13. ```javascript
    for(var i=0;i<3;i++){
      setTimeout(()=>console.log(i),0)
    }
    ```

    Answer: `3 3 3`
    Explanation: `var` is function scoped and shares the same variable.

14. ```javascript
    const {a = 3} = {};
    ```

    Answer: `3`
    Explanation: Default value is used when property does not exist.

15. ```javascript
    foo();
    function foo(){ console.log("Hello"); }
    ```

    Answer: `"Hello"`
    Explanation: Function declarations are fully hoisted.

16. **typeof NaN**
    Answer: `"number"`
    Explanation: `NaN` is a special numeric value.

17. ```javascript
    Promise.resolve().then(()=>console.log("A"));
    console.log("B");
    ```

    Answer: `B A`
    Explanation: Synchronous code runs before microtasks.

18. ```javascript
    let arr=[1,2,3];
    arr.length = 1;
    ```

    Answer: `[1]`
    Explanation: Reducing length truncates the array.

19. **0 === false**
    Answer: `false`
    Explanation: Strict equality checks both type and value.

20. **Which is NOT a JavaScript loop?**
    Answer: `foreach`
    Explanation: `forEach` is an array method, not a loop keyword.

---

# Section 3: Practical JavaScript

21. **"5" - 3**
    Answer: `2`
    Explanation: `-` converts operands to numbers.

22. **[] + {}**
    Answer: `"[object Object]"`
    Explanation: Array converts to empty string and object to string.

23. **Stop event bubbling**
    Answer: `stopPropagation()`
    Explanation: Prevents event propagation to parent elements.

24. **Math.max()**
    Answer: `-Infinity`
    Explanation: No arguments returns negative infinity.

25. ```javascript
    var a = 10;
    (function(){
      a = 20;
    })();
    ```

    Answer: `20`
    Explanation: No local declaration modifies global variable.

26. **Returns a new array**
    Answer: `map()`
    Explanation: `map` creates a new transformed array.

27. **typeof function(){}**
    Answer: `"function"`
    Explanation: Functions have a special `typeof` result.

28. **parseInt("10px")**
    Answer: `10`
    Explanation: Parsing stops at the first non-numeric character.

29. **JavaScript threading model**
    Answer: `Single-threaded`
    Explanation: JavaScript runs on a single call stack.

30. **!!""**
    Answer: `false`
    Explanation: Double negation converts falsy value to boolean.

---

# Top 50 Repeated JavaScript MCQs

## Core JavaScript Basics

1. **typeof undefined**
   Answer: `"undefined"`
   Explanation: `typeof` returns a string representing the type.

2. **typeof null**
   Answer: `"object"`
   Explanation: Historical bug in JavaScript.

3. **typeof NaN**
   Answer: `"number"`
   Explanation: `NaN` belongs to number type.

4. **Is JavaScript statically typed?**
   Answer: `No`
   Explanation: JavaScript is dynamically typed.

5. **Default value of uninitialized var**
   Answer: `undefined`
   Explanation: `var` is initialized during hoisting.

---

## Equality and Type Coercion

6. **0 == false**
   Answer: `true`
   Explanation: Loose equality performs type conversion.

7. **0 === false**
   Answer: `false`
   Explanation: Strict equality compares type and value.

8. **null == undefined**
   Answer: `true`
   Explanation: Special equality rule.

9. **null === undefined**
   Answer: `false`
   Explanation: Different types.

10. **[] == false**
    Answer: `true`
    Explanation: Array converts to empty string then to zero.

---

## Hoisting and Scope

11. **Accessing var before assignment**
    Answer: `undefined`
    Explanation: `var` is hoisted.

12. **Accessing let before initialization**
    Answer: `ReferenceError`
    Explanation: Temporal Dead Zone.

13. **Are function declarations hoisted?**
    Answer: `Yes`
    Explanation: Entire function is hoisted.

14. **var scope**
    Answer: `Function scope`
    Explanation: Not block scoped.

15. **let / const scope**
    Answer: `Block scope`
    Explanation: Scoped to `{}`.

---

## Arrays

16. **typeof []**
    Answer: `"object"`
    Explanation: Arrays are objects.

17. **Proper way to check array**
    Answer: `Array.isArray()`
    Explanation: Reliable array detection.

18. **arr.length = 0**
    Answer: `Clears array`
    Explanation: Removes all elements.

19. **arr[10] = 5, length?**
    Answer: `11`
    Explanation: Length equals highest index plus one.

20. **Does map() mutate array?**
    Answer: `No`
    Explanation: Returns a new array.

---

## Strings and Numbers

21. **"5" + 1**
    Answer: `"51"`
    Explanation: String concatenation.

22. **"5" - 1**
    Answer: `4`
    Explanation: Numeric coercion.

23. **parseInt("10px")**
    Answer: `10`
    Explanation: Stops parsing at non-number.

24. **Number("10px")**
    Answer: `NaN`
    Explanation: Full numeric conversion required.

25. **Boolean("")**
    Answer: `false`
    Explanation: Empty string is falsy.

---

## Objects

26. **Object keys type**
    Answer: `String or Symbol`
    Explanation: Keys are converted to strings.

27. **{} == {}**
    Answer: `false`
    Explanation: Different object references.

28. **Best structure for object keys**
    Answer: `Map`
    Explanation: Supports non-string keys.

29. **Shallow clone object**
    Answer: `Object.assign()` or spread operator
    Explanation: Copies first level properties.

30. **JSON to object conversion**
    Answer: `JSON.parse()`
    Explanation: Converts JSON string to object.

---

## Closures

31. **Closure definition**
    Answer: `Function with lexical scope`
    Explanation: Access to outer variables.

32. **New function call creates new closure**
    Answer: `Yes`
    Explanation: New lexical environment.

33. **Closures used for**
    Answer: `Data hiding`
    Explanation: Encapsulation pattern.

---

## Async and Event Loop

34. **Is JavaScript single-threaded?**
    Answer: `Yes`
    Explanation: Uses one call stack.

35. **Promise callbacks go to**
    Answer: `Microtask queue`
    Explanation: Higher priority queue.

36. **setTimeout goes to**
    Answer: `Macrotask queue`
    Explanation: Runs after microtasks.

37. **Execution order**
    Answer: `Sync → Microtask → Macrotask`
    Explanation: Event loop priority.

38. **async/await built on**
    Answer: `Promises`
    Explanation: Syntactic sugar.

---

## DOM and Browser

39. **Stop event bubbling**
    Answer: `stopPropagation()`
    Explanation: Prevents upward event flow.

40. **Prevent default browser action**
    Answer: `preventDefault()`
    Explanation: Stops default behavior.

---

## Tricky but Common

41. **typeof function(){}**
    Answer: `"function"`
    Explanation: Special typeof value.

42. **Math.max()**
    Answer: `-Infinity`
    Explanation: No arguments returns lowest number.

43. **!!value meaning**
    Answer: `Boolean conversion`
    Explanation: Converts value to true or false.

44. **Is JavaScript case-sensitive?**
    Answer: `Yes`
    Explanation: Variable names are case-sensitive.

45. **Does const mean immutable value?**
    Answer: `No`
    Explanation: Reference is immutable.

---

## Output Prediction

46. ```javascript
    console.log(a);
    var a = 10;
    ```

Answer: `undefined`
Explanation: `var` hoisting.

47. ```javascript
    console.log(b);
    let b = 10;
    ```

Answer: `ReferenceError`
Explanation: Temporal Dead Zone.

48. **[] + []**
    Answer: `""`
    Explanation: Both arrays convert to empty strings.

49. **[] + {}**
    Answer: `"[object Object]"`
    Explanation: Object converts to string.

50. **!!"false"**
    Answer: `true`
    Explanation: Non-empty strings are truthy.

---

If you want, I can also give you a **Senior Frontend Interview MCQ Sheet (Top 100 JS tricky questions companies ask)** that is **much harder than this and often asked in FAANG / product company interviews.**
