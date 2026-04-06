
// Definition
// A closure is created when a function remembers variables from its lexical scope, even after the outer function has finished execution.
// Function + Lexical Environment = Closure

// Basic Example
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const fn = outer();
fn(); // 1
fn(); // 2

// Why it works:
// inner() retains access to count via closure even after outer() completes.

// Lexical Scope (Foundation)
// JavaScript uses lexical scoping.
// Inner functions can access their own scope, parent scope, and global scope.
// Closures exist because of lexical scope.

// Closure with Parameters

function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5); // 10

// Use Cases

// 1. Data Encapsulation (Private Variables)
function counter() {
  let count = 0;

  return {
    increment() {
      count++;
    },
    getCount() {
      return count;
    }
  };
}

// 2. setTimeout Closure Trap
// Using var (wrong):
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 4 4 4

// Fix using let:
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 1000);
}

// 3. Event Handlers
function attachHandler() {
  let name = "Venki";

  document.getElementById("btn").addEventListener("click", function () {
    console.log(name);
  });
}

// Closures and Memory
// Closures keep references to variables and can cause memory leaks if not cleaned properly.

// Currying Example
const sum = a => b => c => a + b + c;
sum(1)(2)(3); // 6

// Common Interview Points
// - Closures keep references, not copies
// - Every function has a closure
// - Closures are safe if used correctly
// - Closures can access global variables

// Advanced Output Question
function test() {
  let a = 10;

  return function () {
    a++;
    console.log(a);
  };
}

const fn1 = test();
const fn2 = test();

fn1(); // 11
fn2(); // 11
fn1(); // 12

// Interview Summary
// A closure allows a function to access variables from its lexical scope even after the outer function has finished execution.
