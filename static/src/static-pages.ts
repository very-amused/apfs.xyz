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

// Function to check if an object is empty (this yields better performance than the Object.keys().length method)
function isEmpty(obj: object) {
    for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

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
            // Store render path
            const renderPath = `${__dirname}/${dirPath}/${file}`;

            app.get(webPath, (req, res) => {
                // Check if there are query parameters passed to the page
                if (!isEmpty(req.query)) {
                    // Convert query params to lowercase
                    for (const i in req.query) {
                        req.query[i] = req.query[i].toLowerCase();
                    }

                    // Pass query params to pug
                    res.render(renderPath, req.query);
                }
                else {
                    res.render(renderPath);
                }
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