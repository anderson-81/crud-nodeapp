// -- VALIDATION --
class Validation {
	
	constructor(){
		// Regexs:
		this.errors = [];
		this.remail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		this.rsalary = /^(\-?)([0-9]{1,12})+\.([0-9]{2})$/;
		this.rdate = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
	}

	/*
	// Dates:
	let date = new Date();	
	let date00 = new Date(1900,0,1,0,0,0);
	let date18 = new Date(date.getFullYear() - 18, date.getMonth(), date.getDate(), 0, 0, 0);
	let dateFormat = require('dateformat');
	*/

	// public functions ------------
	arrayIsEmpty(array){
		return (typeof array !== 'undefined' && array.length == 0);
	}

	validationPerson(person){

		// Name
		if(checkIsEmpty.bind(this)(person.name)){
			this.errors.push('Name is empty.');
		}else{
			if(checkMinMaxChar.bind(this)(person.name, 3, 45)){
				this.errors.push('Invalid number of character for Name. Min: 3 | Max: 45');
			}
		}

		// E-mail
		if(checkIsEmpty.bind(this)(person.email)){
			this.errors.push('E-mail is empty.');
		}else{
			if(checkMinMaxChar.bind(this)(person.email, 7, 45)){
				this.errors.push('Invalid number of character for E-mail. Min: 7 | Max: 45');
			}else{
				if(checkRegex.bind(this)(person.email, this.remail)){
					this.errors.push('Invalid E-mail.');
				}
			}
		}

		// Salary
		if(checkIsEmpty.bind(this)(person.salary)){
			this.errors.push('Salary is empty.');
		}else{
			if(checkRegex.bind(this)(person.salary, this.rsalary)){
				this.errors.push('Invalid Salary.');
			}else{
				if(checkRanger.bind(this)(parseFloat(person.salary), 0.00, 999999999999.99) && (person.salary.toString() != "0.00")){
					this.errors.push('Salary out of valid range. Min:  0.00 | Max: 999999999999.99');
				}
			}
		}

		// Birthday
		if(checkIsEmpty.bind(this)(person.birthday)){
			this.errors.push('Birthday is empty.');
		}else{
			if(checkRegex.bind(this)(person.birthday, this.rdate)){
				this.errors.push('Invalid Birthday.');
			}
			/*
			else{
				if(CheckRanger(dateFormat(person.birthday, "mm/dd/yyyy"), dateFormat(date00, "mm/dd/yyyy"), dateFormat(date18, "mm/dd/yyyy"))){
					errors.push('Only people over 18 can be registered.');
				}
			}
			*/
		}

		//Gender
		if(checkIsEmpty.bind(this)(person.gender)){
			this.errors.push('Gender is empty.');
		}else{
			// Regular expression //
			if(!((person.gender == "M") || (person.gender == "F"))){
				this.errors.push('Invalid Gender.');
			}
			// Regular expression //
		}

		return this.errors;
	}

	validationLogin(user){
		
		if(checkIsEmpty.bind(this)(user.username)){
			this.errors.push('Username is empty.');
		}

		if(checkIsEmpty.bind(this)(user.password)){
			this.errors.push('Password is empty.');
		}

		return this.errors;
	}
	// public functions ------------
}


// private functions -----------
function checkIsEmpty(data){
	return (!data);
}

function checkMinMaxChar(data, qmin, qmax){
	return (!((data.length >= qmin) && (data.length <= qmax)));
}

function checkRegex(data, regex){
	return (!regex.test(String(data).toLowerCase()));
}

function checkRangerNumbers(data, min, max){
	return ((parseFloat(data) <= min) && (parseFloat(data) >= max));
}

function checkRanger(data, min, max){
	return !((data >= min) && (data <= max));
}
// private functions -----------

module.exports = Validation;
// -- VALIDATION --