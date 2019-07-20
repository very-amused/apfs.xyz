// Initialize Express Router
const router = require('express').Router();

// Function to generate a random 6-digit User ID
async function genID() {
    let range = [...Array(10).keys()];
    let ID = '';
    for (let i = 0; i < 6; i++) {
        ID += range[Math.floor(Math.random() * range.length)];
    }
    return ID;
}

async function main(pool, email, password) {
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

    // Hash the password using bcrypt
    const bcrypt = require('bcrypt');
    // Generates a 10-round salt and hashes the password in one function call
    let hashedPassword = await bcrypt.hash(password, 10);

    // Insert the info into the Users table
    conn.query('INSERT INTO Users (ID, Email, Password) VALUES (?, ?, ?)',
    [ID, email, hashedPassword]);
}

router.get('/', (req, res) => {
    res.sendFile('create-account.html', {root: './html'});
});

router.post('/', (req, res) => {
    // Reload the page if the passwords don't match
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('/create-account');
    }

    // Insert user info into the db
    main(req.app.get('pool'), req.body.email, req.body.password)
    .catch(err => res.render('creation-error', {err: err})); // Render error page if an error occurs
    res.render('creation-success', {email: req.body.email});
});

module.exports = router;