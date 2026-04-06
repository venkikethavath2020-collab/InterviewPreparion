// Variable is a kind of storing data in memory

const accountId = 1223344;
let accountEmail = "Venki.kethavath@gmail.com";
var accountPassword = "12345";

/* 
Prefer not to use var 
because of issue in block scope and functional scope
*/

accountCity = "Hyderabad";  // Without let and const declaration we can assign value to the variable but its not preffered

// accountId = 2;   // not allowed to change as this variable is constant
console.log(accountId) // Throws error

let accountState; 
// The default value will be undefined for accountState variable as we have not assigned any value to this vailable.

console.table([accountEmail, accountPassword, accountCity, accountState])



