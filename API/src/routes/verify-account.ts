// Initialize Express Router
import * as express from 'express';
// eslint-disable-next-line no-unused-vars
import {Pool} from 'mariadb';
const router = express.Router();

// Function to select a column from an SQL table and convert it to an array
async function selectAsArray(column: string, table: string, conn: any) {
    const sqlColumn = await conn.query(`SELECT ${column} FROM ${table}`);
    const dataArray: any[] = [];
    sqlColumn.forEach((object: any) => {
        dataArray.push(object[column]);
    }); // A forEach loop is used to convert the sql column to an array
    return dataArray;
}

async function main(pool: Pool, userID: string, token: string) {
    const conn = await pool.getConnection();

    // Validate that a 10-digit UID and a 20-char token are supplied
    if (!userID || userID.length !== 10) {
        conn.end();
        throw 'A 10-digit user ID must be supplied';
    }
    else if (!token || token.length !== 20) {
        conn.end();
        throw 'A 20-character token must be supplied';
    }

    // Throw an error if the user ID doesn't belong to a user awaiting verification
    const userIDs = await selectAsArray('ID', 'Tokens', conn);
    if (!userIDs.includes(userID)) {
        conn.end();
        throw `${userID} is not the ID of a user awaiting verification.`;
    }

    // Throw an error if the token supplied as a query string is invalid
    const validTokenData = await conn.query('SELECT Token FROM Tokens WHERE ID = ?',
    [userID]);
    const validToken: string = validTokenData[0].Token;
    if (token !== validToken) {
        conn.end();
        throw 'Authentication failure due to invalid token.';
    }
    else {
        // Verify the user because the token is valid
        conn.query('DELETE FROM Tokens WHERE ID = ?',
        [userID]);
        conn.query('UPDATE Users SET Verified = 1 WHERE ID = ?',
        [userID]);
        conn.end();
    }
}

router.get('/:userID?/:token?', (req, res) => {
    main(req.app.locals.pool, req.params.userID, req.params.token)
    .then(() => {
        res.status(200).redirect('/accounts/account-verified?success=true');
    },
    (err) => {
        res.status(500).redirect(`/accounts/account-verified?success=false&error=${err}`);
    });
});


module.exports = router;