// Initialize Express
const express = require('express');
const app = express();
const port = 3030;

// Initialize pug for rendering templates
app.set('view engine', 'pug');
app.set('views', './templates');

// Serve static files (css, js, images) from the public directory
app.use(express.static('public'));

// Render the pug homepage template
app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
});