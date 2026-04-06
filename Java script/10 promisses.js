const cart = ["mobiles", "shoes", "pants", "shirts"]



const promisee = new Promise((resolve, reject) => {
    const success = true;
    if (success) {
        resolve('Resolved')
    } else {
        reject('Rejected')
    }
})


// Promise: A promise is an object represents the eventually completion or failure of an asynchronus operation.

//  async operation:

//  promisee.all
//  use case: Calling parallel API calls

const pr1 = new Promise((resolve, reject) => {
    const success = false;
    if (success) resolve('PR1 Resolved')
    else reject('PR1 Rejected');
})

const pr2 = new Promise((resolve, reject) => {
    const success = false;
    if (success) resolve('PR2 Resolved')
    else reject('PR2 Rejected');
})

const pr3 = new Promise((resolve, reject) => {
    const success = false;
    if (success) {
        setTimeout(() => {
            resolve('PR3 Resolved')
        }, 2000)
    }
    else reject('PR3 Rejected');
})


Promise.any([pr1, pr2, pr3]).then((result) => {
    console.log('Result', result)
}).catch((err) => {
    console.error("Error", err);
    console.log('All the Errors ', err.errors);  // Gives all the errors in the form of Array
});


// Promise.all: Waits for all promises to fulfill and returns an array of their results.
// If any promise is rejected, it returns the reason for the first rejection.

// Promise.allSettled: Waits for all promises to settle (either fulfill or reject)
// and returns an array of objects describing the outcome of each promise.

// Promise.race: Returns the result of the first setteled promise either that fulfills or rejects.

// Promise.any: Returns the result of the first promise that resolved only.
// If all promises are rejected, it returns an "Aggregate error".





function callaPromise(params) {

    new Promise((resolve, reject) => {
        let status = true;
        if (status === true) {
            resolve('Promise is Resolved with sample data');
        } else {
            reject('Promise is rejectd');
        }

    }).then((data) => {
        console.log("data", data);

    })

}

// callaPromise();