/*
Hoisting in JavaScript is a behavior where variable and function declarations are moved to the top of their containing scope 
(either function or global scope) during the compilation phase, before the code is executed. 
This means that you can use variables and functions before they are declared in the code, 
as the declarations are "hoisted" to the top.

1. Variable Hoisting:
Only the declaration is hoisted, not the initialization. 
This means that if you declare a variable using var, it will be undefined 
until it is assigned a value later in the code.

    Example:
        console.log(x); // undefined
        var x = 5;
        console.log(x); // 5

For let and const, the variables are hoisted but are not initialized, 
leading to a "temporal dead zone" (TDZ) until the actual declaration line is encountered.
The Temporal Dead Zone is a period during which a variable declared with let or const exists but cannot be accessed. 

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;


2. Function Hoisting:

Function declarations are fully hoisted, meaning you can call a function before it is defined in the code.
greet(); // "Hello"

function greet() {
  console.log("Hello");
}

However, function expressions and arrow functions are not hoisted the same way. 
They behave like variables declared with var, let, or const.

greet(); // TypeError: greet is not a function

var greet = function() {
  console.log("Hello");
};

*/
