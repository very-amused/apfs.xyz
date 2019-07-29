// Initialize Express
const express = require('express');
const app = express();
const port = 3002;

// Initialize MariaDB
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '208.167.233.12',
    user: 'testing',
    password: process.env.MARIADB_PASS, // $MARIADB_PASS environment variable
    database: 'apfs_testing'
});
app.locals.pool = pool; // Store the pool variable in the app object

const verifyAccount = require('./routes/verify-account');
app.use('/API/verify-account', verifyAccount);

app.listen(port, () => console.log(`Listening on port ${port}.`)); // eslint-disable-line no-console