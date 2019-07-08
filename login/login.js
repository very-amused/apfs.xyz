// Initialize Express
const express = require('express');
const app = express();
app.set('view engine', 'pug'); // Use pug to render templates
app.set('views', `${__dirname}/templates`);
const port = 3001;

// Parse form data
app.use(express.urlencoded({extended: false}));

app.get('/create-account', (req, res) => {
    res.render('create-account');
});

app.post('/create-account', (req, res) => {
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassowrd) {
        // YEET
    }
});

app.listen(port, () => console.log(`Listening on port ${port}.`));