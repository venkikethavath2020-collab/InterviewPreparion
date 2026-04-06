      
// Explanation of the currying concept and its benefits are included as comments at the top of the file.
// Currying transforms a function with multiple arguments into a sequence of functions each taking a single (or fewer) argument. 
// It’s useful for partial application, composition, and creating reusable small functions.

// Key ideas

// Currying: f(a, b, c) -> f(a)(b)(c)
// Partial application: fix some arguments of a function (can be implemented with currying)
// Benefits: clearer intent, reusable small functions, easier composition
// Gotchas: changes how this is handled (use arrow functions carefully), original function arity/length is lost unless preserved explicitly, slight runtime overhead

// Suggestions

// Use curry for creating small reusable transformations and for composition.
// Preserve metadata (name/length) if needed using wrapper helpers (Object.defineProperty).
// Avoid currying every function blindly — use it where readability and reuse improve code. 

// Example implementation of a curry function
function curry(fn) {
    const arity = fn.length;

    function curried(...args) {
        if (args.length >= arity) {
            return fn(...args);
        } else {
            return (...moreArgs) => curried(...args, ...moreArgs);
        }
    }

    return curried;
}

// Example usage
function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6


function add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}