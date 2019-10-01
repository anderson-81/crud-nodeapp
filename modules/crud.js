const Controller = require('./sequelize');
const Validation = require('./validation');

class Crud {

  constructor() {
    this.ctr = new Controller();
    this.val = new Validation();
  }

  login(user) {
    let errors = this.val.validationLogin(user);
    if (this.val.arrayIsEmpty(errors)) {
      return this.ctr.login(user).then((response) => {
        return createResult.bind(this)(errors, response);
      });
    }
    return new Promise((resolve, reject) => {
      resolve(createResult.bind(this)(errors, false));
    });
  }

  getById(person) {
    return this.ctr.getById(person).then((response) => {
      return response;
    });
  }

  getByName(person) {
    return this.ctr.getByName(person).then((response) => {
      return response;
    });
  }

  create(person) {
    let errors = this.val.validationPerson(person);
    if (this.val.arrayIsEmpty(errors)) {
      return this.ctr.create(person).then((response) => {
        return createResult.bind(this)(errors, response);
      });
    }
    return new Promise((resolve, reject) => {
      resolve(createResult.bind(this)(errors, false));
    });
  }

  update(person) {
    let errors = this.val.validationPerson(person);
    if (this.val.arrayIsEmpty(errors)) {
      return this.ctr.update(person).then((response) => {
        return createResult.bind(this)(errors, response);
      });
    }
    return new Promise((resolve, reject) => {
      resolve(createResult.bind(this)(errors, false));
    });
  }

  delete(person) {
    if (person) {
      return this.ctr.delete(person).then((response) => {
        return createResult.bind(this)([], response);
      });
    }
    return new Promise((resolve, reject) => {
      resolve(createResult.bind(this)([], false));
    });
  }
}

// private functions -----------
function createResult(errors, op) {
  let result = {
    errors: errors,
    op: op
  };
  return result;
}
// private functions -----------

module.exports = Crud;