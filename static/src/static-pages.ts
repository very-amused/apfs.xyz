// Initialize Express
import * as express from 'express';
const app = express();
const port = 3030;

// Initialize pug for rendering templates
app.set('view engine', 'pug');

// Serve static files (css, js, images) from the public directory
app.use(express.static('../public'));

// Render each directory's index.pug tempalte
import * as fs from 'fs';
import * as util from 'util';

const readdirPromise = util.promisify(fs.readdir);
const statPromise = util.promisify(fs.stat);

async function scanDirRecursive(dirPath: string, webPath = '/') {
    // Make sure a file path is supplied
    if (!dirPath) {
        throw 'You must supply a filepath to begin the scan at';
    }
    // Read the directory
    const files = await readdirPromise(dirPath);
    for (const file of files) {
        // Render the file if it's named 'index.pug'
        if (file === 'index.pug') {
            app.get(webPath, (req, res) => {
                res.render(`${__dirname}/${dirPath}/${file}`);
            });
        }
        else {
            const stat = await statPromise(`${dirPath}/${file}`);
            // Begin a recursive scan if the file is a directory
            if (stat.isDirectory()) {
                scanDirRecursive(`${dirPath}/${file}`, `${webPath}${file}/`);
            }
        }
    }
}
scanDirRecursive('../templates');

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
});