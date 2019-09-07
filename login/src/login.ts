// Initialize Express
import * as express from 'express';
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
app.set('views', '../templates');
const port = 3001;
// Parse form data
app.use(express.urlencoded({extended: false}));

// Configure and initialize MariaDB
import * as mariadb from 'mariadb';
// This is a CommonJS import because the dbConfig file is plain JS, not TypeScript
const dbConfig = require('../../internal/dbConfig');
const pool = mariadb.createPool(dbConfig);
app.set('pool', pool); // Store the pool variable in the app object

import createAccount from './routes/create-account';
app.use('/accounts/create-account', createAccount);

import accountVerified from './routes/account-verified';
app.use('/accounts/account-verified', accountVerified);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}.`));