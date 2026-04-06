// Function Statement           : Function statement and Function declaration are both same           
function a() {
    console.log('a called');
}

// Function expression          :   Assigning the function to a variable is function expression
const b = function () {
    console.log('b called');
}

/* Major Difference between function statement and function expression is hoisting i.e ( memory creating phase)
a1()   // Excuted 
b1()   // Throws error
function a1() {
    console.log('a called');
}
const b1 = function () {
    console.log('b called');
}
In memory creating phase, a is crated memory and function is assingned to a and in the case of b its assigned with undefined and its not available to execute
*/

// Anonymos functions
/*
Functon statemenets without any names are called anonymos functions. 
If we declare anonymos functions it will be results in syntax error: 

So what is the use it : 
    Anonymos functions are used as a value
    Ex: 
     let abc = function() { console.log('Anonymos) }
     here anonymos function is assigned to a variable abc and its acts like a value
*/

// Named Function Expression

/* Assigning the function with name to a variable is called Named Function Expression
let c = function xyz() {
    console.log('c is called');
}

c() // Executes
xyz()  // Throws error => because its not defined in the scope

*/

// Diff between parameter and arguments

function Test(params1, params2) {    // Values are receiving know as parameter
    console.log(params1, params2);
}

Test(1, 2)  // Values passing to a function know as arguments


// ARROW FUNCTINOS

// ..... arrow function
const add1 = (a, b) => a + b;


// Difference between normal and arrow functions

// 1 syntax

function add2(a, b) {
    return a + b
}

const add3 = (a, b) => {
    return a + b;
}

// 2 implicit "return keyword"
const add4 = (a, b) => a + b;

// 3 arguments

const args = function () {
    console.log(arguments);  // prints arguments : 1, 2, 3
}
args(1, 2, 3)

const args1 = () => console.log(arguments);
// args1(2, 3, 4) // Throws error: arguments not defined

// 4 this keyword

let obj = {
    username: 'venkatesh',
    rc1: () => console.log("This is arrow function " + this.username),  //  undefined as this refers to global scope
    rc2: function () {
        return console.log("This is normal function " + this.username); // prints name as this refers to local level scope
    }
}

obj.rc1();
obj.rc2();

// First class functions  or First class citizens

// Passing a function to a another function as an argument and 
// also returning a function from an funtion as value this phenomenon called as first class functions
// Ex:
function first(params) {
    console.log('First function :', params)
}

function second() {
    console.log('Second Function')
}
first(second)    // passing second fn as an argument to first fn

function sample(params) {
    return function returningFn(params) {
        console.log('This is returning fn from sample fn');
    }
}
console.log(sample())  // returning fn as value from sample fn


//............................................ SUMMERY.....................
/*
1. Functions can be assigned to variables
    const greet = function(name) {
        return `Hello, ${name}!`;
    };

2. Functions can be passed as arguments to other functions:

    function logGreeting(greetFunction, name) {
    console.log(greetFunction(name));
    }
    logGreeting(greet, 'Alice'); // Outputs: Hello, Alice!

3. Functions can be returned from other functions

    function createGreetingFunction(greeting) {
        return function(name) {
                return `${greeting}, ${name}!`;
        };
    }

    const sayHello = createGreetingFunction('Hello');
    console.log(sayHello('Bob')); // Outputs: Hello, Bob!

4. Functions can be stored in data structures

    const operations = {
        add: function(a, b) { return a + b; },
        subtract: function(a, b) { return a - b; }
    };
    console.log(operations.add(2, 3)); // Outputs: 5


A pure function is a function that:

    Always produces the same output for given the same input.
    Does not cause any side effects (e.g., modifying global variables, changing the DOM, etc.).
    Pure functions are fundamental to functional programming and contribute to writing more reliable, maintainable, and testable code.


*/


//................................... Higher Order Functions..................


function student(name) {
    return `My name is ${name}`
}

function Teacher(value, logic) {
    return console.log('Tell me your name: ', logic(value))
}

const data = Teacher('Venkatesh', student)
console.log(data);

// From the above ex: Teacher function is acts as higher order fn and makes callback fn with student


// IIFE ( Immediate Invocation Function Expression)

(function name(params) {
    console.log('IIFE');
})()


/**
 * @fileoverview Functions are reusable first-class values that can be declared, assigned, passed, and returned to enable abstraction and composition.
 *
 * @summary Functions are reusable first-class values that support declaration/expression forms, hoisting differences, arrow-function semantics, and higher-order patterns.
 *
 * @description
 * - Function declaration (statement):
 *   - Declared with the function keyword and a name.
 *   - Hoisted with its implementation, so it can be called before its definition.
 *
 * - Function expression:
 *   - A function assigned to a variable (may be anonymous or named).
 *   - The variable is hoisted (as undefined for const/let temporal dead zone), but the function value is not available until assignment.
 *
 * - Anonymous function:
 *   - A function without a name, typically used as a value (assigned to variables or passed as callbacks).
 *
 * - Named function expression:
 *   - A function expression that includes an internal name useful for stack traces and self-reference; the internal name is not available in the outer scope.
 *
 * - Parameters vs Arguments:
 *   - Parameters are the named identifiers in a function signature.
 *   - Arguments are the concrete values supplied when invoking the function.
 *
 * - Arrow functions:
 *   - Provide concise syntax and support implicit return for single expressions.
 *   - Do not create their own 'this' binding — they capture 'this' lexically from the surrounding scope.
 *   - Do not provide an 'arguments' object.
 *
 * - 'arguments' object:
 *   - Available only in non-arrow (regular) functions to access all call-time arguments.
 *
 * - 'this' behavior:
 *   - Regular functions determine 'this' based on call-site (method call, call/apply/bind, new).
 *   - Arrow functions inherit 'this' from their defining (lexical) scope.
 *
 * - First-class functions:
 *   - Functions can be stored in variables, passed as arguments, and returned from other functions.
 *
 * - Higher-order functions:
 *   - Functions that accept other functions as parameters or return functions.
 *
 * - Pure functions:
 *   - Given the same inputs always return the same output and have no side effects (no mutation of external state).
 *
 * - IIFE (Immediately Invoked Function Expression):
 *   - A function expression that is executed immediately to create an isolated scope.
 *
 * @notes
 * - Choose declarations when you rely on hoisting; choose expressions/arrow functions for lexical 'this' and concise syntax.
 * - Favor pure and small higher-order functions for easier testing and composition.
 */
