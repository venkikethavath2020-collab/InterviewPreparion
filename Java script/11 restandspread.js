/*
The rest and spread operators in JavaScript are represented by three dots (...). 
They are used to work with arrays, objects, and function parameters in a more flexible and concise way. 
Although they look similar, they serve different purposes depending on the context in which they are used.

1. Rest Operator (...)
The rest operator allows you to collect multiple elements into a single array or object. 
It's typically used in function parameters or destructuring assignments.

Use in Function Parameters:
When used in a function's parameter list, the rest operator gathers all remaining arguments into an array.

    Example:

    function sum(...numbers) {
        return numbers.reduce((acc, curr) => acc + curr, 0);
    }
    console.log(sum(1, 2, 3, 4)); // 10

Here, ...numbers gathers all arguments passed to the sum function into an array called numbers.

Use in Destructuring:
    The rest operator can also be used to collect the remaining elements in an array or properties in an object.

    Example with Arrays:
    const [first, ...rest] = [1, 2, 3, 4];
    console.log(first); // 1
    console.log(rest);  // [2, 3, 4]

    Example with Objects:

    const person = { name: "John", age: 30, job: "developer" };
    const { name, ...details } = person;
    console.log(name);    // "John"
    console.log(details); // { age: 30, job: "developer" }

    In this example, the name property is extracted, and the rest of the properties are gathered into the details object.

2. Spread Operator (...)

The spread operator is used to spread or unpack elements from an array, object, or iterable into individual elements or properties. 
It’s the opposite of the rest operator.

Use in Function Calls:
The spread operator can be used to pass elements of an array as individual arguments to a function.

    Example:
    const numbers = [1, 2, 3, 4];
    console.log(Math.max(...numbers)); // 4
    Here, ...numbers spreads the elements of the numbers array so that Math.max receives them as individual arguments.

Use in Array Literals:
    You can use the spread operator to create a new array by merging or copying elements from existing arrays.
    Example:
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combined = [...arr1, ...arr2];
    console.log(combined); // [1, 2, 3, 4, 5, 6]

Use in Object Literals:
The spread operator can also be used to copy properties from one object to another or merge multiple objects.
Example:
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const combinedObj = { ...obj1, ...obj2 };
console.log(combinedObj); // { a: 1, b: 2, c: 3, d: 4 }

Summary:
Rest Operator (...): Gathers multiple elements into an array or object. Used in function parameters and destructuring.
Spread Operator (...): Spreads or unpack elements from an array, object, or iterable into individual elements or properties. 
Used in function calls, array literals, and object literals.

Both operators make it easier to handle collections of data in JavaScript, leading to more concise and readable code.

*/