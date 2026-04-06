/*

The Event Loop is a crucial mechanism in JavaScript that allows for non-blocking, asynchronous operations. 
It is responsible for managing the execution of code, handling events, and executing asynchronous callbacks.

1. Single - Threaded: JavaScript runs on a single thread, meaning it can only execute one piece of code at a time.

2. Call Stack: 
        A stack structure that keeps track of function calls. When a function is called, it’s added to the stack, 
               and when it returns, it’s removed from the stack.

3. Web APIs: 
        Browser - provided APIs(like setTimeout, DOM events, fetch, console, local storage and etc.) that run asynchronously.

4. Callback Queue: 
        A queue where callback functions from asynchronous operations(like timers or network requests) are placed, waiting to be executed.

5. Event Loop: 
        Continuously checks the Call Stack and Callback Queue.If the Call Stack is empty, it moves the first callback from the queue to the stack for execution.

6. Microtasks are tasks that are executed after the currently executing task completes and before the next event loop iteration. 
    They include:
        Promises (.then, .catch, .finally)
        Mutation Observers  =>   Mutation Observers are an object that watches for changes on a DOM element or subtree.. 

    Microtasks have higher priority than the tasks in the Callback Queue.

7. Macro Task (Macrotask)

A macro task is a unit of work scheduled by the runtime that executes on the event loop's task queue.
After the currently executing script and all pending microtasks complete, the event loop picks the next macro task.

Common examples:
    - setTimeout / setInterval callbacks
    - I/O callbacks (Node)
    - setImmediate (Node)
    - UI rendering and input events (browser)
    - Message events (postMessage)

Ordering with microtasks:
    - Execute current script (call stack).
    - Run all microtasks (Promise .then/.catch/.finally, MutationObserver) to completion.
    - Pick and execute one macro task from the task queue.
    - Repeat.

Implications:
    - Macro tasks have lower priority than microtasks; microtasks run before the next macro task.
    - Long-running macro tasks block the main thread and can cause jank (UI freezes).
    - Use web workers, chunking, requestAnimationFrame, or breaking work into smaller tasks to avoid blocking.

Node-specific note:
    - Node's event loop has multiple phases (timers, pending callbacks, idle/prepare, poll, check, close). Different types of macrotasks are handled in specific phases.


// NOTE: 
    Starvation: 
        Starvation in JavaScript's event loop can occur when long-running tasks 
        or an overload of microtasks prevent other tasks from being executed.
*/


console.log('Start');

setTimeout(() => {
    console.log('Timeout callback');
    Promise.resolve().then(() => {
        console.log('Promise callback one inside timeout');
    });
}, 0);

Promise.resolve().then(() => {
    console.log('Promise callback');
});

console.log('End');
