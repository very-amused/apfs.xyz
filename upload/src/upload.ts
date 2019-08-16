// Initialize Express
import express = require('express');
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
const port = 3000;

// Initialize Multer
import multer = require('multer');
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
        callback(null, genFilename(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 50 * 1000 * 1000} // 50MB size limit
})
.single('file');

// Function for generating filenames
function genFilename(filename: string) {
    // Remove and store the file extension
    const filenameParts: string[] = filename.split('.');
    const extension = filenameParts.pop();
    filename = filenameParts.join('');

    // Sanitize the filename
    filename = filename
    .replace(/[^a-z0-9]/gi, '_') // Replace all non-alphanumeric characters with underscores
    .replace(/_{2,}/g, '_'); // Replace all groups of 2 or more underscores with a single underscore

    // Generate a unique ID that isn't already taken
    const fs = require('fs');
    let IDs: string[] = [];
    const files: string[] = fs.readdirSync('./uploads')
    files.forEach(file => {
        if (file.startsWith(filename)) {
            let ID: string = file.split('-').pop()!;
            IDs.push(ID);
        }
    });
    let fileID: string;
    if (!IDs.length) {
        fileID = '00000'; // Set the ID to 00000 if no files exist with the same name
    }
    else {
        let highestID: number = Math.max(...IDs.map(ID => parseInt(ID)));
        fileID = (highestID + 1).toString(); // Set the ID to 1 higher than the highest ID of a file with the same name
        fileID = fileID.padStart(5, '0');
    }

    // Return the finished filename
    return `${filename}-${fileID}.${extension}`;
}


app.get('/upload', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

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