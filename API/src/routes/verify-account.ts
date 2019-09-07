// Initialize Express Router
import * as express from 'express';
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

async function main(pool: any, userID: string, token: string) {
    const conn = await pool.getConnection();

    // Throw error if there is no token supplied
    if (!token) {
        throw 'A token must be supplied';
    }

    // Throw an error if the user ID doesn't belong to a user awaiting verification
    const userIDs = await selectAsArray('ID', 'Tokens', conn);
    if (!userIDs.includes(userID)) {
        throw `${userID} is not the ID of a user awaiting verification.`;
    }

    // Throw an error if the token supplied as a query string is invalid
    const validTokenData = await conn.query('SELECT Token FROM Tokens WHERE ID = ?',
    [userID]);
    const validToken: string = validTokenData[0].Token;
    if (token !== validToken) {
        throw 'Authentication failure due to an invalid token.';
    }
    else {
        // Verify the user because the token is valid
        conn.query('DELETE FROM Tokens WHERE ID = ?',
        [userID]);
        conn.query('UPDATE Users SET Verified = 1 WHERE ID = ?',
        [userID]);
    }
}

router.get('/', (req, res) => {
    res.send('ERROR: A user ID and token must be supplied');
});

router.get('/:userID', (req, res) => {
    main(req.app.locals.pool, req.params.userID, req.query.token)
    .then(() => {
        res.redirect('/accounts/account-verified?success=true');
    },
    (err) => {
        res.send(`ERROR: ${err}`);
    });
});

export default router;