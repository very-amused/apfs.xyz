// Initialize Express
const express = require('express');
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
app.set('views', `${__dirname}/templates`);
const port = 3001;
// Parse form data
app.use(express.urlencoded({extended: false}));

// Configure and initialize MariaDB
const mariadb = require('mariadb');
const dbConfig = require('../dbConfig');
const pool = mariadb.createPool(dbConfig);
app.set('pool', pool); // Store the pool variable in the app object

const createAccount = require('./routes/create-account');
app.use('/accounts/create-account', createAccount);

const accountVerified = require('./routes/account-verified');
app.use('/accounts/account-verified', accountVerified);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}.`));