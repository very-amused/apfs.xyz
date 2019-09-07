// Initialize Express
import * as express from 'express';
const app = express();
const port = 3002;

// Configure and initialize MariaDB
import * as mariadb from 'mariadb';
const dbConfig = require('../../internal/dbConfig');
const pool = mariadb.createPool(dbConfig);
app.locals.pool = pool; // Store the pool variable in the app object
import verifyAccount from './routes/verify-account';
app.use('/API/verify-account', verifyAccount);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}.`));