let score = "33abc"

console.log(typeof score)

let valueinNumber = Number(score);
console.log(typeof valueinNumber);

// another method

let valueinNumber1 = +score
console.log(typeof valueinNumber1);

console.log(valueinNumber);

/*
 
 "33" =>  33
 "33abc" => NaN
 true => 1
 false => 0

 */

let isloggedIn = 1
let booleanLoggedIn = Boolean(isloggedIn)
console.log(booleanLoggedIn);
 
// 1 => true
// 0 => false
// "" => false
// "data" => true

let somenumeber = 22
let stringNumber = String(somenumeber)
console.log(stringNumber);
console.log(typeof stringNumber);

//  *********************************OPERATIONS************************************

let value = 3
let negValue = --value
console.log(negValue);

let value1 = 3
let posValue = ++value1
console.log(posValue);

console.log("1" + 2); // 12
console.log(1 + "2"); // 12
console.log("1" + 2 + 3); // 123
console.log(1 + 2 + "2"); // 32


/*
In JavaScript, the increment operator (++) is used to increase the value of a variable by one. There are two types of increment operators: pre-increment and post-increment. The difference lies in when the value of the variable is increased.

Pre-increment (++variable)
    The pre-increment operator increases the value of the variable before it is used in an expression.

    Syntax:
    ++variable;

    Example:
    let x = 5;
    let y = ++x; // x is incremented to 6, then y is assigned the value 6
    console.log(x); // Output: 6
    console.log(y); // Output: 6


Post-increment (variable++)

    The post-increment operator increases the value of the variable after it is used in an expression.
    Syntax:
    variable++;

    Example:
    let x = 5;
    let y = x++; // y is assigned the value 5, then x is incremented to 6
    console.log(x); // Output: 6
    console.log(y); // Output: 5

Summary

Pre-increment (++variable): Increments the value of the variable before it is used in an expression.
Post-increment (variable++): Increments the value of the variable after it is used in an expression.

These operators are commonly used in loops and other scenarios where you need
to update a variable's value as part of an expression.

// Type Conversion in JavaScript
// Converting one data type to another

// 1. String Conversion
console.log(String(123)); // "123"
console.log(String(true)); // "true"
console.log(String(null)); // "null"

// 2. Number Conversion
console.log(Number("456")); // 456
console.log(Number(true)); // 1
console.log(Number(false)); // 0
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN

// 3. Boolean Conversion
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean("hello")); // true
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false

// 4. Implicit Conversion (Coercion)
console.log("5" + 3); // "53" (string concatenation)
console.log("5" - 3); // 2 (numeric operation)
console.log("5" * "2"); // 10
console.log(true + 1); // 2
console.log(false + 1); // 1



// Conversion operations - concise examples and notes

// String -> Number
let a = "42";
console.log(Number(a));        // 42
console.log(+"42");            // 42 (unary +)

let b = "3.14px";
console.log(parseInt(b, 10));  // 3
console.log(parseFloat(b));    // 3.14

// Radix parsing
console.log(parseInt("101", 2));   // 5 (binary)
console.log(Number("0x1f"));       // 31 (hex via Number)

// NaN behavior and checks
let bad = Number("not-a-number");
console.log(bad);                  // NaN
console.log(Number.isNaN(bad));    // true (reliable)
console.log(isNaN("foo"));         // true (global isNaN coerces first)

// Boolean conversion
console.log(Boolean(0));           // false
console.log(Boolean(""));          // false
console.log(Boolean("text"));      // true
console.log(!!"text");             // true (double bang idiom)

// Number -> String
console.log(String(2021));         // "2021"
console.log((3.14159).toString()); // "3.14159"
console.log((1/3).toFixed(2));     // "0.33" (formatted string)

// Implicit coercion examples
console.log("7" + 4);   // "74"  (string concatenation)
console.log("7" - 4);   // 3     (numeric subtraction)
console.log(true + 1);  // 2     (true -> 1)

// Objects and arrays to primitives
console.log(+[1]);      // 1      ([1] -> "1" -> 1)
console.log(+[]);       // 0      ([] -> "" -> 0)
console.log(+[1,2]);    // NaN    ("1,2" -> NaN)
let obj = { valueOf(){ return 10; } };
console.log(+obj);      // 10     (valueOf used)

// Date to number
console.log(+new Date()); // milliseconds since epoch (number)

// Quick summary (notes):
// - Use Number(), parseInt/parseFloat, + for numeric conversion.
// - Use String() or toString() for string conversion.
// - Use Boolean() or !! for boolean conversion.
// - Prefer Number.isNaN() to detect NaN.
// - Be mindful of implicit coercion rules ( + can mean concat or add ).


*/