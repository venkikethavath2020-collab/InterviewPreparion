

let obj = {
    name: "suni",
    age: 28,
}

console.log("====", obj);

const obj2 = new Object()
obj2.name = "venki";
obj2.age = "28"

console.log(obj2);


const obj3 = Object.create(null)
obj3.name = "chinnu";
obj3.age = 4

console.log(Object.entries(obj3));

const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const obj4 = Object.assign(target, source);
const obj5 = { ...target, ...source }
console.log(obj4);
console.log(obj5);


Object.keys(obj2)   // [key1, key2]
Object.values(obj2) // [value1, value2 ]
Object.entries(obj2) // [["key1",  "value1"], ["key2", "value"]]

Object.freeze(obj2)
obj2.country = "UK"
// obj2.age = "444"
console.log("FREEZE ====", obj2);   // Freezes the age property and it will be readonly and we can not assign any other values

Object.seal(obj3)
obj3.city = "Hyd"
console.log("Obj3", obj3); // Throws error as this object is sealed 

// Differnce between freeze and seal
// Freeze makes the object completely immutable where as seal makes the object properties as non configurable but values can be changed
Object.isFrozen(obj2)  // true
Object.isSealed(obj3)  // true
// End of objects.js
