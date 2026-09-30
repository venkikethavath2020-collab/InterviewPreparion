/*

In JavaScript, Call, apply, and bind are methods used to explicitly set the this value of a function. 

call: 
    The call method calls a function with a given this value and arguments provided individually.

    Syntax: functionName(thisArg, arg1, arg2, ......)

apply: 
    The apply method calls a function with a given this value and arguments provided as array.
    
    Syntax: functionName(thisArgs, ["arg1", "arg2", .....])

bind: Creates a copy of a function that and invoked later

*/

// What is the use of call, apply and bind methods in JavaScript and vue?
// In JavaScript, call, apply, and bind methods are used to control the value of this within a function.
// In Vue.js, these methods can be used to invoke methods with a specific context, allowing you to access component data and methods from different scopes.
// Example: In Vue.js, you might use call or apply to invoke a method defined in one component from another component, passing the appropriate this context to access the component's data and methods.



let printFullname = function (hometown, state) {
    return console.log(this.firstName + " " + this.lastName + " from " + hometown + " " + state)
}

let name1 = {
    firstName: 'Venkatesh',
    lastName: 'Kethavath'
}


let name2 = {
    firstName: 'Chinnu',
    lastName: 'kethavath'
}

printFullname.call(name1, "Hyderabad", "Telangana");
printFullname.call(name2, "Amaravathi", "Andhra");

printFullname.apply(name2, ["NagarKurnool", "Telangana"]);

// polyfill for call

Function.prototype.mycall = function (...args) {
    let obj = this
    return function () {
        return args
    }
}

printFullname.mycall(name1, "Hyderabad", "Telangana");


// Note : The only difference between call and apply is the way of passing the arguments
// In Call method, we can send the arguments as individual with comma separate
// In apply method, we can send the arguments as array of list

// bind method

let printmyName = printFullname.bind(name1, "Hyderabad", "Telangana");
// Here bind method will be used for keeping a copy of a method which can be invoked later
printmyName()


// polyfill for bind method

let name3 = {
    firstName: 'Suni',
    lastName: 'kethavath'
}

let printName = function (state, country, area) {
    return console.log(this.firstName + " " + this.lastName, " " + state + " " + country + " " + area);
}

let printuserName = printName.bind(name3);
printuserName('TS', 'India', "Hyd");

// now we can implement our own bind method
Function.prototype.mybind = function (...args) {
    let obj = this;
    let params = args.slice(1)
    return function (...arg2) {
        obj.apply(args[0], [...params, ...arg2]);
    }
}

let printmybindName = printName.mybind(name3, "TEST", "UK")
printmybindName('London')
