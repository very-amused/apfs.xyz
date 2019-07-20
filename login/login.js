// Initialize Express
const express = require('express');
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
app.set('views', `${__dirname}/templates`);
const port = 3001;
// Parse form data
app.use(express.urlencoded({extended: false}));

// Initialize MariaDB
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '208.167.233.12',
    user: 'testing',
    password: process.env.MARIADB_PASS, // $MARIADB_PASS environment variable
    database: 'apfs_testing'
});
app.set('pool', pool); // Store the pool variable in the app object

const createAccount = require('./routes/create-account');
app.use('/create-account', createAccount);

app.listen(port, () => console.log(`Listening on port ${port}.`));