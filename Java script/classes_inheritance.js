class user {
    constructor(username) {
        this.username = username
    }

    logMe() {
        console.log(`USERNAME is ${this.username}`);
    }
}

class Teacher extends user {

    constructor(username, email, password) {
        super(username);
        this.email = email;
        this.password = password;
    }

    addCourse() {
        console.log(`This course is done by`, this.username)
    }
}


const chai = new Teacher('venki', 'abcd@fma', '123')
chai.addCourse()

const masalaChai = new user('Suni');
masalaChai.logMe()
