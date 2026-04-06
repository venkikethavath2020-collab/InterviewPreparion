// "use strict"

// 1.  this in global space
console.log("Global space", this); // window (in a browser) or global (in Node.js)
//  Global object will be different in different Js run time as in browser its window

// this keyword works diffently in strict mode and non strict mode
function x() {
    console.log(this)
    // NOTE: 
    // In Strict mode the values of this will be undefined
    // In non strict mode the value of this will be global object i.e window
}
x();

// Que: what is strict and non strict mode in Javascript ?
/*
Strict mode and non-strict mode in JavaScript refer to two different ways the JavaScript engine interprets your code. 
Strict mode is a way to opt-in to a "restricted" variant of JavaScript, 
thereby avoiding some common pitfalls and enabling more secure and optimized code.

How to Enable Strict Mode
For an entire script:
Place "use strict"; at the top of your JavaScript file.

"use strict";
// All code in this file will be in strict mode

For a specific function:
Place "use strict"; at the beginning of a function definition to apply strict mode only to that function.

function myFunction() {
  "use strict";
  // Code in this function will be in strict mode
}

Differences Between Strict Mode and Non-Strict Mode

1. Variable Declaration

Non-Strict Mode: 
Variables can be used without being declared with var, let, or const. 
This can lead to accidental global variable creation.
myVar = 10; // Creates a global variable `myVar`

Strict Mode: 
An error is thrown if you try to use a variable without declaring it.
"use strict";
myVar = 10; // ReferenceError: myVar is not defined

2. Assignment to Read-Only Properties

Non-Strict Mode: 
Assigning a value to a read-only property fails silently.
const obj = {};
Object.defineProperty(obj, "prop", { value: 10, writable: false });
obj.prop = 20; // Fails silently, no error is thrown

Strict Mode: 
An error is thrown when attempting to assign a value to a read-only property.

"use strict";
const obj = {};
Object.defineProperty(obj, "prop", { value: 10, writable: false });
obj.prop = 20; // TypeError: Cannot assign to read-only property 'prop'

3. Deleting Variables or Functions

Non-Strict Mode: 
Deleting variables, functions, or arguments does nothing.
var x = 10;
delete x; // No effect, x is not deleted

Strict Mode: Deleting variables, functions, or arguments throws an error.
"use strict";
var x = 10;
delete x; // SyntaxError: Delete of an unqualified identifier in strict mode



4. Duplicate Parameter Names

Non-Strict Mode: 
Functions can have duplicate parameter names, which can cause confusion.

function sum(a, a, c) {
  return a + a + c; // Which `a` is used?
}

Strict Mode: 
Duplicate parameter names are not allowed and will throw an error.
"use strict";
function sum(a, a, c) {
  // SyntaxError: Duplicate parameter name not allowed in this context
}


5. Octal Literals

Non-Strict Mode: 
Octal literals (e.g., 0123) are allowed.
var num = 0123; // 83 in decimal

Strict Mode: 
Octal literals are not allowed and will throw an error.
"use strict";
var num = 0123; // SyntaxError: Octal literals are not allowed in strict mode


6. this in Functions

Non-Strict Mode: 
In a regular function, this refers to the global object (e.g., window in browsers).

function showThis() {
  console.log(this); // `this` is the global object
}
showThis();

Strict Mode: In a regular function, this is undefined.
"use strict";

function showThis() {
  console.log(this); // `this` is `undefined`
}
showThis();


7. Reserved Keywords for Future Versions

Non-Strict Mode: 
You can use certain keywords that are reserved for future use, 
like implements, interface, let, package, private, protected, public, static, and yield.

Strict Mode: 
Using these reserved keywords will throw a syntax error.

*/


// 2 . this inside non strict mode - ( this substituation )
// if the value of this keyword is undefined of null this will be replacred with global object 
//only in non strict mode

// 3. this keyword value depends on how this function is called ( window )
x() // undefined    .. Strict mode 
window.x() // window object  ( with reference)

// 4. this inside a object's method

const obj = {
    a: 10,
    x: function () {        // x is a method
        console.log(this);        // Value of this is object
    }
}

obj.x();
// Note: this refers to the object that the method is called on.

// 5. call apply bind methods ( sharing method)
const student = {
    name: 'Venki',
    printName: function () {
        console.log(this.name)
    }
}
student.printName();
const student1 = {
    name: "kethavath"
}
student.printName.call(student1);  // Re using the method from student into the student1 using call

// 6 . this inside arrow functions

// Note: Arrow functions don't provide their own 'this' binding( it retains the 'this' value of the enclosing lexical context ) 
const sample = {
    a: 100,
    x: () => {
        console.log(this)   // window 
    }
}
sample.x()

// Enclosing lexical context : In JavaScript, the term "enclosing lexical context" refers to the 
//                             scope in which a function is defined, not where it is executed.

// 7. this inside nested arrow function
const sample2 = {
    a: 43,
    x: function () {
        const y = () => {
            console.log(this)  // prints obj  => As this is defined in enclosing lexical context
        }
        y();
    }
}
sample2.x();


// 8. this in DOM
//    this keyword inside DOM referrence to HTMLElement

// 9. this inside class constructor ?


/*                                              SUMMERY

1. "this" in global scope always points to the globalObject (globalObject depends on javascript runtime env)
2. "this" in a function depends on 2 things
    a. strict / non strict mode (in strict mode, "this" is undefined, in non strict mode, "this substitution" takes place and "this" points to globalObject)
    b. how the function is being invoked (if we invoke the function using the global object in strict mode, then "this" will point to that globalObject)
3. "this" in a method always points to the object that is used to invoke the method.
4. call, apply & bind are used to share a method with another object (hence the "this" keyword reference would also change accordingly)
5. "this" inside arrow function refers to the enclosing lexical context
6. "this" in DOM points to the HTML element itself on which it is being used

*/



class greetStudent {
    constructor(name, age) {
        this.NAME = name,
            this.AGE = age
    }


    greet() {
        console.log(`Say good morning to ${this.NAME} AND ${this.AGE}`)
    }

}



const student99 = new greetStudent('venki', 23)

student99()