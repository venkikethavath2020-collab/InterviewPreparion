//1.  What is async funtion

/*
async is a keyword is used for  handle the asynchonous functions and it always returns a promise with resolved or rejected values
Await is a keyword  used inside an async function and it pauses the execution of async function and waits for the promise to reolve or reject

Benifits: 

Readability: Async / await makes asynchronous code look like synchronous code, improving readability and maintainability.

Error Handling: Using try...catch blocks for error handling in async functions.

Sequential Execution: Awaiting multiple asynchronous operations ensures they execute in the desired order.

use cases: 

Fetching data from APIs.
Performing I/O operations like reading/writing files.
Any operation that involves waiting for a result, like database queries.


*/

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise resolved value")
    }, 10000)
})


const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise resolved value")
    }, 20000)
})


async function handlePromise() {
    console.log("Hello world");
    let result = await promise;
    console.log(result);
    console.log("Namaste");
    let result2 = await promise2;
    console.log(result2);
}

function dummmy(params) {
    console.log("Dummy Function");
}
handlePromise()
dummmy()


const API_URL = "https://jsonplaceholder.typicode.com/todos/4"

// async function fetchUserData() {
//     const data = await fetch(API_URL)
//     const Result = await data.json()
//     console.log(Result)
// }


async function fetchUserDataNew() {
    try {
        const data = await fetch(API_URL).then(res => res.json()).then(res => res)
        console.log(data)

    } catch (error) {
        console.error(error);

    }

}

// Why res.json() is used in fetchUserDataNew function?
// The `res.json()` method is used to parse the response from the fetch request into a JavaScript object. When you make a fetch request, the response is returned as a `Response` object, which contains various properties and methods. The `json()` method is one of those methods, and it reads the response stream and returns a promise that resolves with the result of parsing the body text as JSON.

fetchUserDataNew()
// fetchUserData()
