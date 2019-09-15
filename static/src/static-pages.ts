// Initialize Express
import * as express from 'express';
const app = express();
const port = 3030;

// Initialize pug for rendering templates
app.set('view engine', 'pug');

// Serve static files (css, js, images) from the public directory
app.use(express.static('../public'));

// Render the homepage
app.get('/', (req, res) => {
    res.render(`${__dirname}/../templates/home`);
});

// Render each index.pug
import * as fs from 'fs';
fs.readdir('../templates', (err, files) => {
    files.forEach(page => {
        const path = `${__dirname}/../templates/${page}`;
        if (!fs.lstatSync(path).isDirectory()) {
            return;
        }
        app.get(`/pages/${page}`, (req, res) => {
            res.render(`${path}/index`);
        });
    });
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
});