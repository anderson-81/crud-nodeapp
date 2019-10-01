# crud-nodeapp

## 1- Description:
- CRUD Web Application Example does in Node.js. with database connection and with security features.

## 2- Features CRUD:
- Basic features of a crud (create, read, update and delete)
- Login with Session (sha512)
- Token (sha512)
- Search for Name

## 3- Security Features:
- SQL Injection protection Cross Site Scripting Protection CSRF Protection

## 4 - Development Tools:
- Node v10.16.3
- npm 6.9.0
- Sublime Text 3.2.1, Build 3207
- SQLite3 (Development database)
- PostgreSQL 10 (Production database)

### 4.1- Dependencies - "package.json":
#### 4.1.1 - Development:
- "body-parser": "^1.19.0",
- "bootstrap": "^4.3.1",
- "datatables.net": "^1.10.19",
- "datatables.net-dt": "^1.10.19",
- "dateformat": "^3.0.3",
- "express": "^4.17.1",
- "express-handlebars": "^3.1.0",
- "express-session": "^1.16.2",
- "handlebars-helpers": "^0.10.0",
- "jquery-maskmoney": "^3.0.2",
- "js-sha512": "^0.8.0",
- "nodemon": "^1.19.2",
- "random-number": "0.0.9",
- "sequelize": "^5.19.0",
- "sqlite3": "^4.1.0",
- "tempusdominus-bootstrap-4": "^5.1.2"

#### 4.1.2 - Production:
##### 4.1.2.1 - Added:
- ##### Session:
	- "cookie-session": "^1.3.3"
- ##### - PostgreSQL Database Connection:
	- "pg": "^7.12.1"
	- "pg-hstore": "^2.3.3"

##### 4.1.2.2 - Retired:
- ##### Session:
	- "express-session": "^1.16.2"
- ##### SQLite3 Database Connection:
	- "sqlite3": "^4.1.0"
