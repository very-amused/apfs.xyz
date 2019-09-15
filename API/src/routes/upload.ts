// Initialize Express
import * as express from 'express';
const app = express();
app.set('view engine', 'pug');
app.set('views', '../../static/templates/upload');

// Import the node fs module for scanning directories
import fs = require('fs');

// Function for generating filenames
function genFilename(filename: string) {
    // Remove and store the file extension
    const filenameParts = filename.split('.');
    const extension = filenameParts.pop();
    filename = filenameParts[0];

    // Sanitize the filename
    filename = filename
    .replace(/[^a-z0-9]/gi, '_') // Replace all non-alphanumeric characters with underscores
    .replace(/_{2,}/g, '_'); // Replace all groups of 2 or more underscores with a single underscore

    // Generate a unique ID that isn't already taken
    const IDs: string[] = [];
    fs.readdirSync(multerDestination).forEach(file => {
        if (file.startsWith(filename)) {
            const ID = file.split('-').pop();
            IDs.push(ID!);
        }
    });
    let fileID;
    if (!IDs.length) {
        fileID = '00000'; // Set the ID to 00000 if no files exist with the same name
    }
    else {
        const highestID = Math.max(...IDs.map(ID => parseInt(ID)));
        fileID = highestID + 1; // Set the ID to 1 higher than the highest ID of a file with the same name
        fileID = fileID.toString().padStart(5, '0');
    }

    // Return the finished filename
    return `${filename}-${fileID}.${extension}`;
}

// Configure and initialize Multer
import * as multer from 'multer';
if (!process.env.NODE_ENV) {
    // eslint-disable-next-line no-console
    console.error('The environment variable NODE_ENV isn\'t set and needs to be.');
    process.exit(1);
}
let multerDestination: string;
if (process.env.NODE_ENV === 'production') {
    multerDestination = '/var/www/cdn.apfs.xyz/uploads';
}
else {
    multerDestination = `${process.env.HOME}/uploads`;
}

// Storage configuration and upload function for multer
const storage = multer.diskStorage({
    destination: multerDestination,
    filename: (req, file, callback) => {
        callback(null, genFilename(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 50 * 1000 * 1000} // 50MB size limit
}).single('file');

// Parse urlencoded HTTP form data
app.use(express.urlencoded({extended: false}));

app.post('/', (req, res) => {
    upload(req, res, err => {
        // Handle error or success using pug templates
        if (err) {
            res.render('error', {err: err});
        }
        else {
            res.render('success', {filename_: req.file.filename});
        }
    });
});

module.exports = app;