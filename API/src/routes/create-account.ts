// Initialize Express Router
import * as express from 'express';
const router = express.Router();
// Import bcrypt for hashing
import * as bcrypt from 'bcrypt';

// Function to generate a random 10-digit User ID
async function genID() {
    const range = [...Array(10).keys()];
    let ID = '';
    for (let i = 0; i < 10; i++) {
        ID += range[Math.floor(Math.random() * range.length)];
    }
    return ID;
}

// Function to generate a random 20-character token
async function genToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    let token = '';
    for (let i = 0; i < 20; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

// Function to select a column from an SQL table and convert it to an array
async function selectAsArray(column: string, table: string, conn: any) {
    const sqlColumn = await conn.query(`SELECT ${column} FROM ${table}`);
    const dataArray: any[] = [];
    sqlColumn.forEach((object: any) => {
        dataArray.push(object[column]);
    }); // A forEach loop is used to convert the sql column to an array
    return dataArray;
}

import * as nodemailer from 'nodemailer';
async function sendVerificationEmail(ID: string, token: string, email: string) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.migadu.com',
        port: 587,
        auth: {
            user: 'noreply@accounts.apfs.xyz',
            pass: process.env.MIGADU_PASS
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

async function main(pool: any, email: string, password: string) {
    const conn = await pool.getConnection();

    // Throw an error if the user already exists
    const users = await selectAsArray('Email', 'Users', conn);
    if (users.includes(email)) {
        conn.end(); // End the database connection before throwing an error
        throw `A user with the email address of ${email} already exists`;
    }

    // Query ID column for currently existing IDs
    const IDs = await selectAsArray('ID', 'Users', conn);

    // Generate a random, unique ID
    let ID = await genID();
    while (IDs.includes(ID)) {
        ID = await genID();
    }

    // Hash the password using bcrypt
    // Generates a 10-round salt and hashes the password in one function call
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the info into the Users table
    conn.query('INSERT INTO Users (ID, Email, Password) VALUES (?, ?, ?)',
    [ID, email, hashedPassword]);

    // Query Token column for currently existing tokens
    const tokens = await selectAsArray('Token', 'Tokens', conn);
    
    // Generate a unique confirmation token for the new user
    let token = await genToken();
    while (token in tokens) {
        token = await genToken();
    }

    // Insert the info into the Tokens table
    conn.query('INSERT INTO Tokens (ID, Token) VALUES (?, ?)',
    [ID, token]);

    // Send the user a verification email
    sendVerificationEmail(ID, token, email);

    // Close the db connection
    conn.end();
}

// Parse urlencoded web form data with built-in express middleware
router.post('/', express.json(), (req, res) => {
    // Insert user info into the db
    main(req.app.locals.pool, req.body.email, req.body.password)
    .then(() => {
        res.status(200).json({
            success: true
        });
    },
    (err) => {
        res.status(500).json({
            error: err.toString()
        });
    });
});

module.exports = router;