/*************************************************************/
/* 1 - SETTING:                                ***************/
/*************************************************************/

/* LIBRARIES */
const Sequelize = require('sequelize');
const sha512 = require('js-sha512');

/* DROP DATABASE (IF EXIST) AND CREATE: */
const create = true;

/* DATABASE CONFIGURATION: */
const sequelize = new Sequelize({
 dialect: 'sqlite',
 storage: 'db.sqlite',
 pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
 }
});

/* AUTHENTICATION: */
sequelize.authenticate()
 .then(() => {
  console.log('Successfully connected.');
 })
 .catch(err => {
  console.error('Error: ', err);
 });

/*************************************************************/
/* 2 - MODELS:                                 ***************/
/*************************************************************/

const Model = Sequelize.Model;

class Person extends Model {}

Person.init({
 name: {
  type: Sequelize.STRING,
  validate: {
   notEmpty: {
    args: true,
    msg: 'Name is empty.'
   },
   len: {
    args: [3, 45],
    msg: 'Invalid character length for Name. [Min: 3 | Max: 45]'
   }
  }
 },

 email: {
  type: Sequelize.STRING,
  validate: {
   notEmpty: {
    args: true,
    msg: 'Name is empty.'
   },
   len: {
    args: [7, 45],
    msg: 'Invalid character length for E-mail. [Min: 7 | Max: 45]'
   },
   isEmail: {
    args: true,
    msg: 'Invalid E-mail.'
   },
  },
  unique: {
   args: 'email',
   msg: 'E-mail already registered.'
  }
 },

 salary: {
  type: Sequelize.DECIMAL(12, 2),
  validate: {
   notEmpty: {
    args: true,
    msg: 'Salary is empty.'
   },
   min: {
    args: [0.00],
    msg: 'Salary out of valid range. [Min: 0.00 | Max: 999999999999.99]'
   },
   max: {
    args: [999999999999.99],
    msg: 'Salary out of valid range. [Min: 0.00 | Max: 999999999999.99]'
   },
   isDecimal: {
    args: true,
    msg: 'Invalid Salary.'
   },
  },
 },

 birthday: {
  type: Sequelize.DATE,
  validate: {
   notEmpty: {
    args: true,
    msg: 'Birthday is empty.'
   },
   isDate: {
    args: true,
    msg: 'Invalid Birthday.'
   },
  },
 },

 gender: {
  type: Sequelize.STRING(1),
  validate: {
   notEmpty: {
    args: true,
    msg: 'Gender is empty.'
   },
   len: {
    args: [1, 1],
    msg: 'Invalid character length for Gender. [Size: 1]'
   },
   isIn: {
    args: [
     ['M', 'F']
    ],
    msg: 'Invalid Gender.'
   },
  },
 }
}, {
 sequelize,
 tableName: 'person'
});

class User extends Model {
 /*
 constructor(id, username, password) {
  super();
  this.id = id;
  this.username = username;
  this.password = password;
 }
 */

 get Id() {
  return this.id;
 }

 get Username() {
  return this.username;
 }

 get Password() {
  return this.password;
 }
}

User.init({

 username: {
  type: Sequelize.STRING(45),
  validate: {
   notEmpty: {
    args: true,
    msg: 'Username is empty.'
   },
  },
  unique: {
   args: 'username',
   msg: 'Username already registered.'
  }
 },

 password: {
  type: Sequelize.STRING(128),
  validate: {
   notEmpty: {
    args: true,
    msg: 'Password is empty.'
   },
   len: {
    args: [128, 128],
    msg: 'Password error.'
   },
  },
 }
}, {
 sequelize,
 tableName: 'user'
});


if (create) {

 var result = User.sync({
  force: true
 }).then((x) => {
  User.create({
   username: "nodeapp",
   password: sha512('nodeapp')
  }).then(x => {
   console.log('Table User successfully created.');
  }).catch((error) => console.log('Error: ', error));
 });

 var result = Person.sync({
  force: true
 }).then(x => {
  Person.bulkCreate([{
    name: 'Lucy',
    email: 'lucy@hhh.com',
    salary: '1000.00',
    birthday: '1981-01-12',
    gender: 'F'
   },
   {
    name: 'Paul',
    email: 'paul@hhh.com',
    salary: '3000.00',
    birthday: '1982-02-13',
    gender: 'M'
   },
   {
    name: 'John',
    email: 'john@hhh.com',
    salary: '2000.00',
    birthday: '1983-03-14',
    gender: 'M'
   },
   {
    name: 'Mary',
    email: 'mary@hhh.com',
    salary: '5000.00',
    birthday: '1984-04-15',
    gender: 'F'
   },
   {
    name: 'Simon',
    email: 'simon@hhh.com',
    salary: '1500.00',
    birthday: '1985-05-16',
    gender: 'M'
   },
   {
    name: 'Tiffany',
    email: 'tif@hhh.com',
    salary: '2500.00',
    birthday: '1986-06-17',
    gender: 'F'
   },
   {
    name: 'Joe',
    email: 'joe@hhh.com',
    salary: '4000.00',
    birthday: '1987-07-18',
    gender: 'M'
   }
  ]).then(x => {
   console.log('Table Person successfully created.');
  }).catch((error) => console.log('Error: ', error));
 })
}

/*************************************************************/
/* 3 - ENTITIES:                               ***************/
/*************************************************************/



/*************************************************************/
/* 4 - CONTROLLER:                             ***************/
/*************************************************************/

class Controller {

 login(user) {
  return User.findAll({
   where: {
    username: user.username.trim(),
    password: sha512(user.password.trim())
   }
  }).then((response) => {
   return (response.length == 1);
  }).catch((error) => {
   console.log('Error: ', error);
   return false;
  });
 }

 getById(person) {
  return Person.findByPk(person.id).then((person) => {
   return person;
  }).catch((error) => {
   console.log('Error: ', error);
   return undefined;
  });
 }

 getByName(person) {
  const Op = Sequelize.Op;
  return Person.findAll({
   where: {
    name: {
     [Op.like]: person.name.trim() + '%'
    }
   },
   order: [
      ['id', 'DESC'],
   ],
  }).then((people) => {
   return people;
  }).catch((error) => {
   console.log('Error: ', error);
   return undefined;
  });
 }

 create(person) {
  return sequelize.transaction().then(t => {
   return Person.create({
    name: person.name.trim(),
    email: person.email.trim(),
    salary: person.salary.trim(),
    birthday: person.birthday.trim(),
    gender: person.gender.trim()
   }, {
    transaction: t
   }).then((response) => {
    t.commit();
    return true;
   }).catch((error) => {
    t.rollback();
    console.log('Error: ', error);
    return false;
   });
  });
 }

 update(person) {
  return sequelize.transaction().then(t => {
   return Person.update({
    name: person.name.trim(),
    email: person.email.trim(),
    salary: person.salary.trim(),
    birthday: person.birthday.trim(),
    gender: person.gender.trim()
   }, {
    where: {
     id: person.id
    }
   }, {
    transaction: t
   }).then((response) => {
    t.commit();
    return true;
   }).catch((error) => {
    t.rollback();
    console.log('Error: ', error);
    return false;
   });
  });
 }

 delete(person) {
  return sequelize.transaction().then(t => {
   return Person.destroy({
    where: {
     id: person.id.trim()
    }
   }, {
    transaction: t
   }).then((response) => {
    t.commit();
    return true;
   }).catch((error) => {
    t.rollback();
    console.log('Error: ', error);
    return false;
   });
  });
 }
}

module.exports = Controller;