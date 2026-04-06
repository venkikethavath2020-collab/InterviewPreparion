// Callbacks are functions passed as arguments to other functions to be executed later,
// usually after some kind of event or task completion.
// They are fundamental to handling asynchronous operations in JavaScript.


function greeting(name) {
    console.log('Hello ' + name);
}

function processUserInput(callback) {
    const name = 'Alice';
    callback(name);
}

processUserInput(greeting); // Output: Hello Alice

// Drawbacks

/* 
    Callback Hell: Nested callbacks can lead to deeply nested and hard - to - read code,
                   often referred to as "callback hell" or "pyramid of doom".
    
    Ex: 

    Error handling: Managing errors can become complicated with nested callbacks.
*/
