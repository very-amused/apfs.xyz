// Initialize Express Router
const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.query);
    if (req.query.success === 'true') {
        res.sendFile('account-verified.html', {root: './html'});
    }
    else {
        res.status(403);
        res.send('ERROR 403: Resource forbidden');
    }
});

module.exports = router;