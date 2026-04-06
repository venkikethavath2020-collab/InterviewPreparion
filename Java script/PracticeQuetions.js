let arr = [1, 2, 3, [4, 5, [6, 7, [8, 9]]]]
let quick = [1, 2, 5, 7, 2, 9, 3, 6, 4]
let second = [1, 3, 2, 4, 8, 9, 22]
let duplicates = [1, 3, 2, 4, 8, 9, 22, 2, 6, 1]
let zeros = [0, 1, 0, 3, 12]
let max = [5, 3, 9, 1, 6]
let twoSum = [11, 2, 7, 15], target = 9
let highFreq = [1, 3, 2, 1, 4, 1, 3]
let nums = [1, 2, 3, 5, 6]
let countId = [
    { "id": 1 },
    { "id": 2 },
    { "id": 1 },
    { "id": 3 },
    { "id": 2 }
]

let departmentdata = [
    { "name": "Venki", "dept": "IT" },
    { "name": "Raj", "dept": "HR" },
    { "name": "Sam", "dept": "IT" }
]

let sumobj = {
    "a": 10,
    "b": 20,
    "c": 30
}

let objArr = {
    "name": "Venki",
    "age": 29
}

let student = [
    { "name": "A", "marks": 70 },
    { "name": "B", "marks": 85 },
    { "name": "C", "marks": 65 }
]

let duplicateData = [
    { "id": 1, "name": "A" },
    { "id": 2, "name": "B" },
    { "id": 1, "name": "A" }
]

let flattenObj = {
    "a": {
        "b": "Venki",
        "c": {
            "city": "Hyderabad"
        }
    }
}

let obj1 = { "a": 1, "b": 2 }
let obj2 = { "b": 3, "c": 4 }

let obj3 = { ...obj1, ...obj2 }

// console.log(obj3)



// Flatten nested objects.

function flattenNestedObj(obj, parentKey = "", result = {}) {
    for (let key in obj) {
        let newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenNestedObj(obj[key], newKey, result)
        } else {
            result[newKey] = obj[key]
        }
    }
    return result;
}

// console.log(flattenNestedObj(flattenObj))



// Remove objects with duplicate id.

function removeDuplicateObjects(arr) {
    let result = []
    let set = new Set()

    arr.forEach((x) => {
        if (!set.has(x.id)) {
            set.add(x.id)
            result.push(x)
        }
    })

    return result
}

// console.log(removeDuplicateObjects(duplicateData))

// Find the student with highest marks.

function studentWithHighestMarks(arr) {

    let max = 0
    let student = {}
    arr.forEach((x) => {
        if (x.marks > max) {
            max = x.marks
            student = x
        }
    })

    return student

}

// console.log(studentWithHighestMarks(student))


//Convert object key-value pairs into an array.

function objToArray(obj) {
    let result = []
    for (let key in obj) {
        let value = obj[key]
        result.push([key, value])
    }
    return result
}
// console.log(objToArray(objArr))




// Find the sum of all values in an object.

function sumValuesOfObj(obj) {
    let values = Object.values(obj)
    let sum = values.reduce((cur, pre) => cur + pre, 0)
    return sum;
}

// console.log(sumValuesOfObj(sumobj))



//Group objects based on their department.

function groupByDepartment(arr) {
    let obj = {}

    arr.forEach((x) => {
        if (obj[x.dept]) {
            obj[x.dept].push(x)
        } else {
            obj[x.dept] = [x]
        }
    })

    return obj


}

// console.log(groupByDepartment(departmentdata))



// Given an array of objects, count how many times each id appears.
function countIDs(arr) {
    let obj = {}

    arr.forEach((x) => {
        let count = (obj[x.id] || 0) + 1
        obj[x.id] = count
    })

    return obj;
}

// console.log(countIDs(countId))




function missingNumbers(arr) {

    if (arr.length < 1) return arr

    let n = arr.length + 1;

    let actualSum = arr.reduce((cur, prev) => cur + prev, 0)

    let expectedSum = (n * (n + 1)) / 2

    return expectedSum - actualSum;


}

// console.log(missingNumbers(nums))


function highestFrequencyElement(arr = []) {

    const map = new Map()

    for (let num of arr) {
        map.set(num, (map.get(num) || 0) + 1)
    }

    let maxCount = 0
    let result = null

    for (let [key, value] of map) {
        if (value > maxCount) {
            maxCount = value
            result = key
        }
    }

    return result
}


// console.log(highestFrequencyElement(highFreq))


function debounce(fn, delay) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}


function search(data) {
    console.log(data)
}

const debouncedSearch = debounce(search, 500)

// debouncedSearch('h')
// debouncedSearch('he')
// debouncedSearch('hel')
// debouncedSearch('hell')
// debouncedSearch('hello')


function twoSumWithReturnIndex(arr, target) {
    let indexes = []
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) {
                indexes.push(i, j)
                return indexes
            }
        }
    }
    return indexes
}

// console.log(twoSumWithReturnIndex(twoSum, target))


function findMax(arr) {
    let max = 0

    arr.forEach((x) => {
        if (x > max) {
            max = x
            return
        } else {
            max = x
        }
    })

    return max


}

// console.log(findMax(max))


function movezerostoEnd(arr) {

    let zeros = []
    let nonZeros = []

    arr.forEach((x) => {
        x !== 0 ? nonZeros.push(x) : zeros.push(x)
    })

    return [...nonZeros, ...zeros]
}

// console.log(movezerostoEnd(zeros))



function flattenArrayByLevel(arr, level) {
    let result = []
    arr.forEach((x) => {
        if (Array.isArray(x) && level > 0) {
            result.push(...flattenArrayByLevel(x, level - 1))
        } else {
            result.push(x)
        }
    })
    return result;
}

// console.log(flattenArrayByLevel(arr, 1))


function secondHighest(arr) {

    let first = 0
    let second = 0

    arr.forEach((x) => {
        if (x > first) {
            second = first;
            first = x;

        } else if (x > second && x < first) {
            second = x
        }
    })

    return second;

}

// console.log(secondHighest(second))


function onlyDuplicates(arr) {
    let duplicates = []
    let seen = new Set()

    arr.forEach((x) => {
        if (seen.has(x)) {
            duplicates.push(x)
        } else {
            seen.add(x)
        }
    })

    return duplicates
}

// console.log(onlyDuplicates(duplicates))

function uniqueElements(arr) {
    let seen = new Set()

    arr.forEach(x => {
        if (!seen.has(x)) {
            seen.add(x)
            
        }
    })
    return [...seen]
}

console.log(uniqueElements(duplicates))




function quickSort(arr) {
    if (arr.length <= 1) return arr
    let pivot = arr[arr.length - 1]
    let left = []
    let right = []

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i])
        } else {
            right.push(arr[i])
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]

}


function flatten(arr) {

    let result = []

    arr.forEach((x) => {
        if (Array.isArray(x)) {
            result.push(...flatten(x))
        } else {
            result.push(x)
        }
    })


    const res = quickSort(result)

    return res


}

console.log(flatten([2, [3, 4], [6], 1, [5, 7]]))




let samplename = "venkatesh"
let samplename1 = "venkat"
// output = "hsetAknev"  // "taKNev"


function reverseString(str) {

    let reversed = str.split("").reverse().join("")
    let length = reversed.length

    if (length % 2 === 0) {
        let mid1 = length / 2 - 1
        let mid2 = length / 2

        return reversed.slice(0, mid1) +
            reversed[mid1].toUpperCase() +
            reversed[mid2].toUpperCase() +
            reversed.slice(mid2 + 1)

    } else {
        let mid = Math.floor(length / 2)

        return reversed.slice(0, mid) +
            reversed[mid].toUpperCase() +
            reversed.slice(mid + 1)
    }
}

console.log(reverseString("venkatesh")) // hsetAknev
console.log(reverseString("venkat"))    // taKNev
console.log(reverseString(samplename))









