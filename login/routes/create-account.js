// Initialize Express Router
const router = require('express').Router();

// Function to generate a random 10-digit User ID
async function genID() {
    let range = [...Array(10).keys()];
    let ID = '';
    for (let i = 0; i < 10; i++) {
        ID += range[Math.floor(Math.random() * range.length)];
    }
    return ID;
}

// Function to generate a random 20-character token
async function genToken() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    let token = '';
    for (let i = 0; i < 20; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

// Function to select a column from an SQL table and convert it to an array
async function selectAsArray(column, table, conn) {
    let sqlColumn = await conn.query(`SELECT ${column} FROM ${table}`);
    let dataArray = [];
    sqlColumn.forEach(object => {
        dataArray.push(object[column]);
    }); // A forEach loop is used to convert the sql column to an array
    return dataArray;
}

async function main(pool, email, password) {
    let conn = await pool.getConnection();

    // Throw an error if the user already exists
    let users = await selectAsArray('Email', 'Users', conn);
    if (users.includes(email)) {
        throw `A user with the email address of ${email} already exists`;
    }

    // Query ID column for currently existing IDs
    let IDs = await selectAsArray('ID', 'Users', conn);

    // Generate a random, unique ID
    let ID = await genID();
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

    // Query Token column for currently existing tokens
    let tokens = await selectAsArray('Token', 'Tokens', conn);
    
    // Generate a unique confirmation token for the new user
    token = await genToken();
    while (token in tokens) {
        token = await genToken();
    }

    // Insert the info into the Tokens table
    conn.query('INSERT INTO Tokens (ID, Token) VALUES (?, ?)',
    [ID, token]);

    return {
        ID: ID,
        token: token
    };
}

function sendVerificationEmail(ID, token, email) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.migadu.com',
        port: 587,
        auth: {
            user: 'noreply@accounts.apfs.xyz',
            pass: process.env.MIGADU_PASS
        }
    });

    // Verify the transporter connection, and log the error if it fails
    transporter.verify((err) => {
        if (err) {
            console.log(`Error connecting to the Migadu transporter: ${err}`);
        }
    });

    // Send the verification email
    transporter.sendMail({
        from: 'noreply@accounts.apfs.xyz',
        to: email,
        subject: 'Verify apfs account',
        text: `Follow this link to verify your account:
        https://apfs.xyz/API/verify-account/${ID}?token=${token}`
    });
}

router.get('/', (req, res) => {
    res.sendFile('create-account.html', {root: './html'});
});

router.post('/', (req, res) => {
    // Reload the page if the passwords don't match
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('/accounts/create-account');
    }

    // Insert user info into the db
    main(req.app.get('pool'), req.body.email, req.body.password)
    .then((user) => {
        // Send the user a verification email
        sendVerificationEmail(user.ID, user.token, req.body.email);
        // Render success template
        res.render('creation-success', {email: req.body.email});
    },
    (err) => {
        res.render('creation-error', {err: err}); // Render error page if an error occurs
    });
});

module.exports = router;