class user {
    constructor(username) {
        this.username = username
    }
    logMe() {
        console.log('Username: ', this.username);
    }

    createId() {
        return '123'
    }
}


const venki = new user().createId()
console.log(venki)

class Teacher extends user {
    constructor(username, email) {
        super(username)
        this.email = email
    }
}

const iphone = new Teacher('Iphone', 'I@phone.com')
// console.log(iphone.createId());