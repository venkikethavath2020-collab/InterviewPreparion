"use strict"; // treat all JS code as newer version

// alert(3 + 3) // we are using node js env and not browser as alert is deined in browser not in nodejs

// Data Types

/*

PRIMITIVE DATA TYPES
 number => 2 power of 53
 bigint
 string => ""
 boolean => true / false
 null => The Null type has exactly one value, called null or empty.
 undefined  => The Undefined type has exactly one value, called undefined. Any variable that has not been assigned a value has the value undefined.
 symbol => unique

*/

// typeof null is Object
// typeof undefined is undefined


/* 

JavaScript has several data types, categorized into two main groups: primitive types and object types. Here's an overview of these data types:

1. Primitive Data Types

    String : Represents textual data.
    Example: "Hello, world!"
    
    Number
    Represents both integer and floating-point numbers.
    Example: 42, 3.14

    BigInt
    Represents whole numbers larger than the Number type can handle.
    Example: 1234567890123456789012345678901234567890n

    Boolean
    Represents logical values: true or false.
    Example: true

    Undefined
    Represents an uninitialized variable or a missing value.
    Example: let x; // x is undefined

    Null
    Represents an intentional absence of any object value.
    Example: let y = null;

    Symbol
    Represents a unique and immutable value, often used as object property keys.
    Example: let sym = Symbol('description');

2. Object Data Types

    Object
    Represents a collection of key-value pairs.
    Example:
        let person = {
                name: "John",
                age: 30
            };

    Array
    Represents a list-like collection of elements.
    Example: let numbers = [1, 2, 3, 4, 5, {a:1}];

    Function
    Represents a block of code designed to perform a particular task.
    Example:
        function greet() {
            return "Hello, world!";
        }
    
    Date
    Represents dates and times.
    Example: let now = new Date();

    RegExp
    Represents regular expressions.
    Example: let pattern = /ab+c/;

Special Data Types

    Map
    Represents a collection of keyed data items, similar to an object but with additional features.
    Example:
        let map = new Map();
            map.set('key', 'value');

    
    Set
    Represents a collection of unique values.
    Example:
    let set = new Set([1, 2, 3, 4, 4]);


    WeakMap
    Similar to Map but allows garbage collection of keys.
    Example:
        let weakMap = new WeakMap();


    WeakSet
    Similar to Set but allows garbage collection of its items.
    Example:
    let weakSet = new WeakSet();


Type Checking
To check the type of a variable in JavaScript, you can use the typeof operator:

typeof "Hello"; // "string"
typeof 42; // "number"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (this is a known quirk of JavaScript)
typeof Symbol(); // "symbol"
typeof {name: "John"}; // "object"
typeof [1, 2, 3]; // "object" (arrays are objects in JavaScript)
typeof function() {}; // "function"

*/



// const message = "Hai hello how are you"
// const vowels = ['a', 'e', 'i', 'o', 'u']



// function findVowles(data) {
//     let Totalcount = 0
//     let vowelsCount = 0;
//     let obj = {}
//     let stringData = message.toLowerCase();
//     stringData.toLowerCase().split('').forEach(element => {
//         if (vowels.includes(element)) {
//             Totalcount++

//             let objKeys = Object.keys(obj)
//             if (objKeys.length && objKeys.includes(element)) {
//                 obj[element] = ++obj[element]
//             } else {
//                 obj[`${element}`] = ++vowelsCount
//             }

//         }
//         vowelsCount = 0
//     })
//     console.log("obj", obj);
//     return Totalcount
// }

// console.log(findVowles(message))


const message = "Hai hello how are you";
const vowels = ['a', 'e', 'i', 'o', 'u'];

function countVowels(str) {
    let vowelCount = {};
    let Totalcount = 0

    for (let char of str.toLowerCase()) {
        if (vowels.includes(char)) {
            ++Totalcount;
            if (!vowelCount[char]) {
                vowelCount[char] = 0;
            }
            vowelCount[char]++;
        }
    }

    return { vowelCount, Totalcount };
}

const result = countVowels(message);
console.log(result.vowelCount);
console.log(result.Totalcount);


let nums = [1, 0, 2, 0, 4, 6];

function movezerotoend() {
    let countozeors = 0
    nums.forEach((x, index) => {
        if (x === 0) {
            ++countozeors
            nums[index] = 0
        }
    })

    nums = nums.filter(x => x !== 0)

    for (let index = 0; index < countozeors; index++) {
        nums[nums.length] = 0;
    }

    return nums
}


console.log(movezerotoend());


