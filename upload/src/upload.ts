// Initialize Express
import * as express from 'express';
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
app.set('views', '../templates');
const port = 3000;

// Render the upload page template
app.get('/upload', (req, res) => {
    res.render('upload');
});

app.listen(port, () => console.log(`Listening on port ${port}.`)); // eslint-disable-line no-console