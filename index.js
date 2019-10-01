const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const sha512 = require('js-sha512');
const rn = require('random-number');
const dateformat = require('dateformat');
const app = express();
const helpers = require('handlebars-helpers')();

// Settings ------------------------------
app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	helpers: {
        formatDate: function (date) { return dateformat(date, "mm/dd/yyyy"); },
    }
}));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.set('view engine', 'handlebars');

// Settings ------------------------------

// References ----------------------------
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/datatables', express.static(path.join(__dirname, 'node_modules/datatables.net-dt')));
app.use('/datatables-js', express.static(path.join(__dirname, 'node_modules/datatables.net/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/jquery-maskmoney', express.static(path.join(__dirname, 'node_modules/jquery-maskmoney/dist')));
app.use('/moment', express.static(path.join(__dirname, 'node_modules/moment/min')));
app.use('/tempusdominus', express.static(path.join(__dirname, 'node_modules/tempusdominus-bootstrap-4/build')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// References ----------------------------

////////
let Crud = require('./modules/Crud');
let Alert = require('./modules/Alert');
let Validation = require('./modules/Validation');
///////

/***********************************************************/
function createMessage(opt, message, req) {
	let alert = new Alert();
	req.app.locals.alert = alert.createMessage(opt, message);
	req.app.locals.delete = (
		() => {
			req.app.locals.alert = undefined;
		});
}

function generateHash(req) {
	var options = {
		min: 9874316514,
		max: 98743165149874316514
	};
	req.session.hash = sha512(rn(options).toString());
	return req.session.hash;
}

function createLogin(req) {
	req.session.login = {
		name: req.body.username,
		key: generateHash(req)
	};
	req.app.locals.logged = true;
}

function renderError(res, error) {
	res.status(error).render('error', {
		error: error,
		description: ((error == '404') ? 'Page Not Found Error.' : 'Internal Server Error.')
	});
}

function createPerson(req) {
	let person = {
		id: req.body.id,
		name: req.body.name,
		email: req.body.email,
		salary: req.body.salary,
		birthday: req.body.birthday,
		gender: req.body.gender
	};
	return person;
}

function createUser(req) {
	let user = {
		username: req.body.username,
		password: req.body.password
	};
	return user;
}

function getDate18() {
	let date = new Date();
	date.setFullYear(date.getFullYear() - 18);
	date.setHours(0);
	date.setMilliseconds(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return dateformat(date, "mm/dd/yyyy");
}

/***********************************************************/

app.use(session({
	secret: '2c896f307e14f6c99e009a66286db89b43ec11e5c042d705d1afcbeb770b67bf394b26a1a5cbcc7925965739e42f776a6bf53dcdb8061ff080f0b0add98d412b',
	resave: true,
	saveUninitialized: true
}));

// Routes --------------------------------
app.get('/', function (req, res) {
	res.render('home');
});

app.get('/login', function (req, res, next) {
	let crud = new Crud();
	if (!req.session.login) {
		res.render('login', {
			hash: generateHash(req)
		});
	} else {
		createMessage(2, 'User is already logged in.', req);
		res.redirect('/');
	}
});

app.post('/login', function (req, res) {
	if (req.session.hash == req.body.hash) {
		let crud = new Crud();
		crud.login(createUser(req)).then((response) => {
			if (response.errors.length == 0) {
				if (response.op) {
					createLogin(req);
					createMessage(1, 'Successfully logged.', req);
					res.redirect('/');
				} else {
					createMessage(4, 'Invalid username and password.', req);
					res.redirect('/login');
				}
			} else {
				res.render('login', {
					errors: response.errors,
					hash: generateHash(req)
				});
			}
		});
	} else {
		renderError(res, 500);
	}
});

app.get('/logoff', function (req, res) {
	if (req.session.login) {
		req.session.login = undefined;
		req.app.locals.logged = undefined;
		createMessage(1, 'Successfully unlogged.', req);
	} else {
		createMessage(2, 'User is offline.', req);
	}
	res.redirect('/');
});

app.get('/people', function (req, res) {
	if (req.session.login) {
		let hash = generateHash(req);
		if (req.session.hash == hash) {
			let crud = new Crud();
			crud.getByName({
				name: ""
			}).then((people) => {
				if (people.length == 0) {
					createMessage(2, 'No person registered.', req);
				}
				if (people == undefined) {
					createMessage(4, 'Error listing.', req);
				}
				res.render('list', {
					people: people,
					hash: generateHash(req)
				});
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.post('/people', function (req, res) {
	if (req.session.login) {
		if (req.session.hash == req.body.hash) {
			let crud = new Crud();
			crud.getByName({
				name: req.body.search
			}).then((people) => {
				if (people.length == 0) {
					createMessage(2, 'No people found with this name.', req);
				}
				if (people == undefined) {
					createMessage(4, 'Error listing.', req);
				}
				res.render('list', {
					people: people,
					hash: generateHash(req)
				});
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.get('/people/new', function (req, res) {
	let crud = new Crud();
	if (req.session.login) {
		let person = {
			id: '',
			name: '',
			salary: '0.00',
			email: '',
			birthday: getDate18(),
			gender : 'M'
		};
		res.render('form', {
			title: 'Create',
			hash: generateHash(req),
			action: '/people/save',
			person: person
		});
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.post('/people/save', function (req, res) {
	if (req.session.login) {
		if (req.session.hash == req.body.hash) {
			let crud = new Crud();
			let person = createPerson(req);
			crud.create(person).then((response) => {
				if (response.errors.length == 0) {
					if (response.op) {
						createMessage(1, 'Successfully created.', req);
						res.redirect('/people');
					} else {
						createMessage(4, 'Error creating.', req);
						res.redirect('/people');
					}
				} else {
					res.render('form', {
						title: 'Create',
						errors: response.errors,
						person: person,
						hash: generateHash(req),
						action: '/people/save'
					});
				}
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.get('/people/edit/:id(\\d+)/', function (req, res) {
	if (req.session.login) {
		let hash = generateHash(req);
		if (req.session.hash == hash) {
			let crud = new Crud();
			crud.getById({
				id: req.params.id
			}).then((person) => {
				if(person != null){
					res.render('form', {
						title: 'Edit',
						person: person,
						hash: generateHash(req),
						action: '/people/update'
					});
				}else{
					renderError(res, 404);
				}
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.post('/people/update', function (req, res) {
	if (req.session.login) {
		if (req.session.hash == req.body.hash) {
			let crud = new Crud();
			let person = createPerson(req);
			crud.update(person).then((response) => {
				if (response.errors.length == 0) {
					if (response.op) {
						createMessage(1, 'Successfully edited.', req);
						res.redirect('/people');
					} else {
						createMessage(4, 'Error editing.', req);
						res.redirect('/people');
					}
				} else {
					res.render('form', {
						title: 'Edit',
						errors: response.errors,
						person: person,
						hash: generateHash(req),
						action: '/people/update'
					});
				}
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

app.get('/people/delete/:id(\\d+)/', function (req, res) {
	if (req.session.login) {
		let hash = generateHash(req);
		if (req.session.hash == hash) {
			let crud = new Crud();
			crud.delete({
				id: req.params.id
			}).then((response) => {
				if (response) {
					createMessage(1, 'Successfully deleted.', req);
					res.redirect('/people');
				} else {
					createMessage(4, 'Error deleting.', req);
					res.redirect('/people');
				}
			});
		} else {
			renderError(res, 500);
		}
	} else {
		createMessage(2, 'User is offline.', req);
		res.redirect('/login');
	}
});

// middleware to catch non-existing routes
app.use((req, res, next) => {
    renderError(res, 404);
});

// Routes --------------------------------

app.listen(8080);