/*
Available JavaScript loops — in-depth summary and differences

Overview
- JavaScript provides several looping constructs for iteration:
    - for
    - while
    - do...while
    - for...in
    - for...of
    - Array iteration helpers (forEach, map, filter, reduce) — not language-level loops but common iteration patterns
    - for await...of for async iterables
- Choose a loop based on what you iterate (indices vs keys vs values vs async), whether you need early exit, and concerns about prototype properties or performance.

1) for (classic indexed loop)
- Syntax: for (let i = 0; i < arr.length; i++) { ... }
- Use when you need index access, control over increment, or to iterate part of an array.
- Can break/continue.
- Very explicit and usually fastest for numeric indexed arrays in hot code paths.
- Example:
    for (let i = 0; i < arr.length; i++) { console.log(i, arr[i]); }

2) while
- Syntax: while (condition) { ... }
- Checks condition before each iteration.
- Good when the number of iterations is unknown and depends on runtime condition.
- Can be less readable if loop variable initialization/advance are separated from the loop header.

3) do...while
- Syntax: do { ... } while (condition);
- Executes body at least once (condition checked after).
- Useful when you must run the body before checking a terminating condition.

4) for...in
- Syntax: for (let key in obj) { ... }
- Iterates enumerable property names (strings) over an object, including inherited properties.
- NOT recommended for arrays (order may be surprising; includes prototype properties).
- Use when you need to enumerate property keys and are aware of prototype chain implications.
- To restrict to own properties: for (let k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) { ... }

5) for...of
- Syntax: for (let value of iterable) { ... }
- Iterates values from any iterable (Array, String, Map, Set, arguments, generator, etc.) using the object's @@iterator.
- Yields values (not keys) and supports break/continue.
- Preferred for arrays when you only need values:
    for (const v of arr) { console.log(v); }

6) Array helpers (forEach, map, filter, reduce)
- forEach(callback): invokes callback for each element, returns undefined. Cannot break out of the loop (use exceptions as a hack).
- map/filter/reduce produce new arrays or aggregate values; preferred for declarative transformations and chaining.
- These are callbacks and can be slightly slower; offer more readable, functional-style code.
- Example:
    const doubled = arr.map(x => x * 2);
- Note: callback receives (value, index, array).

7) for await...of (async iteration)
- Syntax: for await (const item of asyncIterable) { ... }
- Use when iterating over async iterables (e.g., streams, async generators).
- Allows awaiting each produced value sequentially.

Differences and pitfalls
- for...in vs for...of: for...in -> keys (strings, incl. inherited), for...of -> values via iterator. For arrays prefer for/for...of or array methods, not for...in.
- Mutation during iteration: modifying array length or object properties while iterating can produce surprising results. Be deliberate (iterate over a snapshot if needed).
- Order guarantees:
    - Arrays: numeric indices are iterated in ascending order by most array-specific operations (for/forOf/Array methods). for...in’s order for numeric keys is implementation-defined historically and should not be relied upon.
    - Objects: property order is insertion order for string keys in modern engines, with integer-like keys ordered differently. Rely on Object.keys/entries if order matters.
- Breaking/short-circuit:
    - for, while, do...while, for...in, for...of support break/continue.
    - forEach/map/filter do not support break (use some/every or a for loop instead).
- Performance:
    - Classic for loops are often fastest in microbenchmarks for numeric-index arrays.
    - for...of is modern and clean; performance is competitive; array methods may allocate new arrays.
    - Prefer readability and correctness first; optimize when profiling shows a bottleneck.

Best practices
- Use for...of for iterable values when you don't need indices.
- Use classic for when you need random access to indices or to iterate reverse/partial ranges.
- Use array methods (map/filter/reduce) for declarative transformations and chaining.
- Avoid for...in for arrays; use Object.keys/entries to enumerate object own properties if you need keys/values.
- Use for await...of for async streams and generators.
- Avoid mutating the collection you are iterating over unless you intentionally understand the consequences.

Summary (quick)
- for: index control, fast, break/continue.
- while / do...while: condition-driven; do...while guarantees one execution.
- for...in: iterate enumerable property names (incl. prototype) — use with caution.
- for...of: iterate iterable values via iterator — recommended for arrays/sets/maps when values are needed.
- Array helpers: declarative, chaining-friendly, no break.
- for await...of: for asynchronous iteration.

*/







const numbers = [1, 2, 3, 4]

Array.prototype.myMap = function (cb) {
    let Temp = []
    for (let index = 0; index < this.length; index++) {
        Temp.push(cb(this[index], index, this))
    }
    return Temp
}

const mapresult = numbers.myMap((value) => {
    return value * 10
})

console.log('VALUE =>', mapresult);

// filter((value, index, arr) => {})

Array.prototype.myFilter = function (cb) {
    let Temp = []
    for (let index = 0; index < this.length; index++) {
        if (cb(this[index], index, this)) {
            Temp.push(cb(this[index], index, this))
        }
    }
    return Temp

}

const filterresult = numbers.myFilter((value) => {
    if (value > 1) {
        return value
    }
})

console.log("filterresult =>", filterresult);

// reduce((acc, cur, index, arr) => {}, inigtialValue)
Array.prototype.myReduce = function (cb, initialValue) {
    let accumalator = initialValue
    for (let index = 0; index < this.length; index++) {
        if (accumalator) {
            accumalator = cb(accumalator, this[index], index, this);
        } else {
            accumalator = this[index]
        }
    }
    return accumalator
}

const reduceResult = numbers.myReduce((acc, curr) => {
    return acc + curr
}, 0);

console.log("ReduceResult => ", reduceResult);

// map vs forEach

const arr = [2, 3, 4, 5, 6]

const resultMap = arr.map((value) => {
    return value + 2
})

console.log("Result Map ", resultMap);

// ......................................................................................
/*

`map` and `forEach` are both array methods in JavaScript that allow you to iterate over elements in an array, 
but they have key differences in their behavior and purpose:

### `forEach`
- **Purpose**: Executes a provided function once for each array element.
- **Return Value**: `forEach` does not return anything. It always returns `undefined`.
- **Side Effects**: `forEach` is primarily used for performing side effects (e.g., logging, modifying external variables) rather than transforming an array.

**Example**:
const numbers = [1, 2, 3, 4];
numbers.forEach(num => {
  console.log(num * 2); // logs: 2, 4, 6, 8
});

// No return value from forEach, so nothing is assigned to a new variable
```

### `map`
- **Purpose**: Creates a new array with the results of calling a provided function on every element in the array.
- **Return Value**: `map` returns a new array containing the transformed elements.
- **Side Effects**: `map` is used when you want to transform the array’s elements into a new array, not for performing side effects.

**Example**:
```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);

console.log(doubled); // logs: [2, 4, 6, 8]
```

### Key Differences
1. **Return Value**:
   - `forEach` doesn’t return anything.
   - `map` returns a new array.
  
2. **Usage**:
   - Use `forEach` when you need to execute a function for its side effects (e.g., updating the DOM, logging values, or modifying external variables).
   - Use `map` when you need to transform the elements of an array and create a new array from the results.

3. **Chainability**:
   - Since `map` returns a new array, you can chain other array methods like `filter`, `reduce`, or another `map` after it.
   - `forEach` cannot be chained because it returns `undefined`.

### Summary
- **`forEach`**: For executing a function on each element without returning a new array.
- **`map`**: For transforming each element and creating a new array based on those transformations.

*/