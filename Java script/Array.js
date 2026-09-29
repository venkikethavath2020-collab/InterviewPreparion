// **An Array in JavaScript** is a special type of object used to store multiple values in a single variable.  

// Arrays are ordered collections, which means every element has a numeric index starting from `0`. They can hold any data type — numbers, strings, objects, functions, or even other arrays.

// ### Simple Example
// ```javascript
// let fruits = ["Apple", "Banana", "Mango"];
// console.log(fruits[0]); // Apple
// console.log(fruits.length); // 3
// ```

// ---

// ### Different Types of Array Methods in JavaScript

// JavaScript provides many built-in array methods. They are mainly divided into three categories:

// ### 1. Mutator Methods (Modify the Original Array)

// These methods change the original array.

// | Method     | Description                                      | Example |
// |------------|--------------------------------------------------|-------|
// | `push()`   | Adds element(s) at the end                       | `arr.push(4)` |
// | `pop()`    | Removes the last element                         | `arr.pop()` |
// | `unshift()`| Adds element(s) at the beginning                 | `arr.unshift(0)` |
// | `shift()`  | Removes the first element                        | `arr.shift()` |
// | `splice()` | Adds/removes elements at any position            | `arr.splice(1, 2)` |
// | `sort()`   | Sorts the array                                  | `arr.sort()` |
// | `reverse()`| Reverses the order of elements                   | `arr.reverse()` |

// **Examples:**
// ```javascript
// let numbers = [1, 2, 3];

// // push
// numbers.push(4);
// console.log(numbers); // [1, 2, 3, 4]

// // pop
// numbers.pop();
// console.log(numbers); // [1, 2, 3]

// // unshift
// numbers.unshift(0);
// console.log(numbers); // [0, 1, 2, 3]

// // shift
// numbers.shift();
// console.log(numbers); // [1, 2, 3]

// // splice (remove 2 elements starting from index 1)
// numbers.splice(1, 2);
// console.log(numbers); // [1]
// ```

// ---

// ### 2. Accessor Methods (Do Not Modify the Original Array)

// These methods return a new value or a new array without changing the original one.

// | Method       | Description                                      | Example |
// |--------------|--------------------------------------------------|-------|
// | `concat()`   | Joins two or more arrays                         | `arr1.concat(arr2)` |
// | `slice()`    | Returns a portion of the array                   | `arr.slice(1, 3)` |
// | `indexOf()`  | Returns the first index of an element            | `arr.indexOf(2)` |
// | `lastIndexOf()` | Returns the last index of an element          | `arr.lastIndexOf(2)` |
// | `includes()` | Checks if an element exists (returns true/false) | `arr.includes(3)` |
// | `join()`     | Converts array into a string                     | `arr.join("-")` |

// **Examples:**
// ```javascript
// let arr1 = [1, 2, 3];
// let arr2 = [4, 5];

// // concat
// let combined = arr1.concat(arr2);
// console.log(combined); // [1, 2, 3, 4, 5]
// console.log(arr1);     // [1, 2, 3] (original remains same)

// // slice
// let part = arr1.slice(1, 3);
// console.log(part); // [2, 3]

// // indexOf
// console.log(arr1.indexOf(2)); // 1

// // includes
// console.log(arr1.includes(3)); // true

// // join
// console.log(arr1.join(" - ")); // "1 - 2 - 3"
// ```

// ---

// ### 3. Iteration Methods (Loop through the Array)

// These methods are used to process every element of the array.

// | Method      | Description                                          |
// |-------------|------------------------------------------------------|
// | `forEach()` | Executes a function for each element                 |
// | `map()`     | Creates a new array by transforming each element     |
// | `filter()`  | Creates a new array with elements that pass a test   |
// | `reduce()`  | Reduces the array to a single value                  |
// | `find()`    | Returns the first element that matches a condition   |
// | `findIndex()`| Returns the index of the first matching element     |
// | `some()`    | Returns `true` if at least one element passes        |
// | `every()`   | Returns `true` if all elements pass                  |

// **Examples:**
// ```javascript
// let numbers = [1, 2, 3, 4, 5];

// // forEach
// numbers.forEach(num => console.log(num * 2));
// // 2 4 6 8 10

// // map
// let doubled = numbers.map(num => num * 2);
// console.log(doubled); // [2, 4, 6, 8, 10]

// // filter
// let even = numbers.filter(num => num % 2 === 0);
// console.log(even); // [2, 4]

// // reduce
// let sum = numbers.reduce((total, num) => total + num, 0);
// console.log(sum); // 15

// // find
// let found = numbers.find(num => num > 3);
// console.log(found); // 4

// // some
// console.log(numbers.some(num => num > 4)); // true

// // every
// console.log(numbers.every(num => num > 0)); // true
// ```

// ---

// ### Quick Summary

// | Category          | Does it change original array? | Common Use Case                  |
// |-------------------|--------------------------------|----------------------------------|
// | Mutator Methods   | Yes                            | Add, remove, or rearrange items  |
// | Accessor Methods  | No                             | Search, copy, or convert array   |
// | Iteration Methods | No                             | Process or transform data        |

// This covers the most important and commonly used array methods in JavaScript in a simple and clear way.