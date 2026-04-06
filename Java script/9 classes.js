// ES6

// Make a  class and prints car name and brand

class mycar {

    constructor(name, brand) {
        this.name = name;
        this.brand = brand;
    }

    carName() {
        return this.name
    }

    carBrand() {
        return this.brand
    }


}


const car1 = new mycar('audi', 'brand1').carName()
console.log(car1);

const car2 = new mycar('tata', 'brand2').carBrand()
console.log(car2);


// using function for class

function mycar2(name, brand) {
    this.name = name;
    this.brand = brand
}

mycar2.prototype.carName = function () {
    return this.name
}

mycar2.prototype.carBrand = function () {
    return this.brand
}

// Dont use arrow function while defining methods in prototype


const car3 = new mycar2('Kia', 'brand3').carName()
const car4 = new mycar2('Maruti', 'brand4').carBrand()

console.log(car3, car4);

