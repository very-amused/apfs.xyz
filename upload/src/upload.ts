// Initialize Express
import express = require('express');
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
const port = 3000;

// Import the node fs module for scanning directories
import fs = require('fs');

// Initialize Multer
import multer = require('multer');
const storage = multer.diskStorage({
    destination: '/var/www/cdn.apfs.xyz/uploads',
    filename: (req, file, callback) => {
        callback(null, genFilename(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 50 * 1000 * 1000} // 50MB size limit
}).single('file');

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
    fs.readdirSync('/var/www/cdn.apfs.xyz/uploads').forEach(file => {
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


// Statically host the html homepage
app.use('/upload', express.static('../public'));

app.post('/upload', (req, res) => {
    upload(req, res, err => {
        // Handle error or success using pug templates
        if (err) {
            res.render(`${__dirname}/templates/error.pug`, {err: err});
        }
        else {
            res.render(`${__dirname}/templates/success.pug`, {filename_: req.file.filename});
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}.`)); // eslint-disable-line no-console