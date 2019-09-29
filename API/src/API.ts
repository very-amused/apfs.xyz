// Initialize Express
import * as express from 'express';
const app = express();
const port = 3002;

// Configure Express for rendering pug templates
app.set('view engine', 'pug');
app.set('views', '../../static/templates');

// Configure and initialize MariaDB
import * as mariadb from 'mariadb';
const dbConfig = require('../../internal/dbConfig');
const pool = mariadb.createPool(dbConfig);
app.locals.pool = pool; // Store the pool variable in the app object

// Make sure important environment variables are set
require('../../internal/envCheck');

// Import routes/subapps
import * as fs from 'fs';
fs.readdir('./routes', (err, routes) => {
    routes.forEach(file => {
        const routeName = file.split('.')[0];
        const route = require(`./routes/${routeName}`);
        // eslint-disable-next-line no-console
        console.log(`API Route ${routeName} is going up`);
        app.use(`/API/${routeName}`, route);
    });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on port ${port}.`));