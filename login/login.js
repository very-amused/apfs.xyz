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

// Function to generate a random 6-digit User ID
async function genID() {
    let range = [...Array(10).keys()];
    let ID = '';
    for (let i = 0; i < 6; i++) {
        ID += range[Math.floor(Math.random() * range.length)];
    }
    return ID;
}

async function main(email, password) {
    let conn = await pool.getConnection();
    console.log(`Connected, the connection ID is ${conn.threadId}`);

    // Query ID column for currently existing IDs
    let IDcolumn = await conn.query('SELECT ID FROM Users');
    let IDs = [];
    IDcolumn.forEach(object => {
        IDs.push(object.ID);
    }); // A forEach loop is used to convert the sql column to a list

    // Generate a random ID
    let ID = await genID();

    // Regenerate the ID until it's unique
    while (IDs.includes(ID)) {
        ID = await genID();
    }

    // Insert the info into the Users table
    conn.query('INSERT INTO Users (ID, Email, Password, Admin) VALUES (?, ?, ?, ?)',
    [ID, email, password, 0]);
}

app.get('/create-account', (req, res) => {
    res.sendFile(`${__dirname}/html/create-account.html`);
});

app.post('/create-account', (req, res) => {
    // Reload the page if the passwords don't match
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('/create-account');
    }

    // Insert user info into the db
    main(req.body.email, req.body.password).catch(err => console.log(err));
    res.send('yes');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));