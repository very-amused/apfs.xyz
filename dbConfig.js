// Stored configurations
const devConfig = {
    host: '208.167.233.12',
    user: 'testing',
    password: process.env.MARIADB_PASS,
    database: 'apfs_testing'
};
const prodConfig = {
    user: 'admin',
    password: process.env.MARIADB_PASS,
    database: 'apfs'
};

// Exit the process if NODE_ENV or MARIADB_PASS isn't set
['NODE_ENV', 'MARIADB_PASS'].forEach(envVar => {
    if (!process.env[envVar]) {
        // eslint-disable-next-line no-console
        console.error(`The environment variable ${envVar} isn't set and needs to be.`);
        process.exit(1);
    }
});

// Configure DB based on the NODE_ENV environment variable
let dbConfig;
if (process.env.NODE_ENV === 'production') {
    dbConfig = prodConfig;
}
else {
    dbConfig = devConfig;
}

// Export the configuration
module.exports = dbConfig;