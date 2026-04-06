
let name1 = {
    firstName: 'Venkatesh',
    lastName: 'Kethavath'
}

let printFullname = function (hometown, state) {
    return console.log(this.firstName + " " + this.lastName + " from " + hometown + " " + state)
}


printFullname.call(name1, "Hyderabad", "Telangana");
printFullname.apply(name1, ["NagarKurnool", "Telangana"]);

// ..............................polyfill for call..........

Function.prototype.mycall = function (context = {}, ...args) {
    if (typeof this !== 'function') {
        throw Error(this + 'Its not Callable')
    }
    context.fn = this;
    context.fn(...args)
}

printFullname.mycall(name1, "Hyderabad", "Telangana");


// ................................ polyfill for Apply.............
Function.prototype.myApply = function (context = {}, args = []) {
    if (typeof this !== 'function') {
        throw Error(this + 'Its not Callable')
    }
    if (!Array.isArray(args)) {
        throw new TypeError('CreateListFromArrayLike called on non-objects');
    }

    context.fn = this;
    context.fn(...args)
}
printFullname.myApply(name1, ["Chennai", "Telangana"]);

// ..............................................Bind polyfill..............................

let student = {
    sname: 'Venki',
    age: 22
}

let printname = function (home, city, result) {
    console.log(this.sname + ' ' + this.age + ' ' + home + '' + city + ' ' + result);
}

const studentName = printname.bind(student, 'HYD', 'TS');
studentName('fail')


Function.prototype.myBind = function (context = {}, ...arg) {
    if (typeof this !== 'function') {
        throw Error(this + "can not be bound as it's not Collable")
    }
    context.fn = this
    return function (...newargs) {
        return context.fn(...arg, ...newargs)
    }
}

const studentName2 = printname.myBind(student, 'UK', 'TS');
studentName2('pass')


// .........................MAP, FILTER AND REDUCE POLYFILLS.....................................

const numbers = [1, 2, 3, 4]

// Array.map((value, index, arr) => {})
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

// ...................MEMOIZE................

function memoizefn(fn, context) {
    let res = {}
    return function (...args) {
        let argsCache = JSON.stringify(args)
        if (!res[argsCache]) {
            res[argsCache] = fn.call(context || this, ...args)
        }
        return res[argsCache]
    }

}

const calculate = (a, b) => {
    for (let index = 0; index < 10000000; index++) {
        return a * b
    }
}

const memoziedCalculate = memoizefn(calculate)
console.time('First Call');
console.log(memoziedCalculate(200000, 3000000))
console.timeEnd('First Call');

console.time('Second Call');
console.log(memoziedCalculate(200000, 3000000))
console.timeEnd('Second Call');

console.time('First Call========');
console.log('asdf');
console.timeEnd('First Call========');
