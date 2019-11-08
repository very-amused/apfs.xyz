// Initialize Express Router
import * as express from 'express';
const router = express.Router();
// Import bcrypt for hashing
import * as bcrypt from 'bcrypt';
// Import nodemailer for programmatic sending of emails
import * as nodemailer from 'nodemailer';
// eslint-disable-next-line no-unused-vars
import {Pool, Connection} from 'mariadb';

class User {
    // Randomly generated user identifiers
    private ID!: string;
    private token!: string;

    // Database connection information
    private conn!: Connection;
    private pool: Pool;    

    // User information
    private email: string;
    private password: string;
    private hashedPassword: string;

    constructor(email: string, password: string, pool: Pool) {
        // Store user info
        this.email = email;
        this.password = password;
        this.hashedPassword = '';

        // Store db pool
        this.pool = pool;
    }

    // Method called to create the user's account
    async setup() {
        // Connect to db
        await this.connect();
        // Verify that user email is unique
        await this.verifyUniqueness();
        // Generate user ID
        this.ID = await this.genID();
        // Hash user password
        this.hashedPassword = await this.hashPassword();
        // Insert user info into db
        await this.insertInfo();
        // Generate a token (used for email verification)
        this.token = await this.genToken();
        // Insert the token into the db
        await this.insertToken();
        // Send the user a verification email
        await this.sendVerificationEmail();
    }

    // Method to establish db connection
    private async connect() {
        this.conn = await this.pool.getConnection();
    }

    /* Method to verify the uniqueness of a user account by checking if the email is already connected to an
    established user in the database */
    private async verifyUniqueness() {
        // Throw an error if the user already exists
        const users = await selectAsArray('Email', 'Users', this.conn);
        if (users.includes(this.email)) {
            throw `A user with the email address of ${this.email} already exists`;
        }
    }

    // Method to generate a random 10-digit User ID
    private async genID() {
        const range = [...Array(10).keys()];
        let ID = '';
        for (let i = 0; i < 10; i++) {
            ID += range[Math.floor(Math.random() * range.length)];
        }
        // Query ID column for currently existing IDs
        const IDs = await selectAsArray('ID', 'Users', this.conn);
        // Regenerate the ID if it isn't unique
        if (IDs.includes(ID)) {
            ID = await this.genID();
            return ID;
        }
        else {
            return ID;
        }
    }

    // Method to hash the user's password
    private async hashPassword() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        return hashedPassword;
    }

    // Method to insert the user's info into the db
    private async insertInfo() {
        await this.conn.query('INSERT INTO Users (ID, Email, Password) VALUES (?, ?, ?)',
        [this.ID, this.email, this.hashedPassword]);
    }

    // Method to generate a random 20-character token
    private async genToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
        let token = '';
        for (let i = 0; i < 20; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    }

    // Method to insert the user's token into the db
    private async insertToken() {
        await this.conn.query('INSERT INTO Tokens (ID, Token) VALUES (?, ?)',
        [this.ID, this.token]);
    }

    // Method to send the user a verification email
    private async sendVerificationEmail() {
        // Create a nodemailer transporter
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
            to: this.email,
            subject: 'Verify apfs account',
            text: `Follow this link to verify your account:
            https://apfs.xyz/API/verify-account/${this.ID}/${this.token}`
        });
    }
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

// Parse urlencoded web form data with built-in express middleware
router.post('/', express.json(), async (req, res) => {
    // Insert user info into the db
    const user = new User(req.body.email, req.body.password, req.app.locals.pool);
    user.setup().then(() => {
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