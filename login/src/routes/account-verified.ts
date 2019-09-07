// Initialize Express Router
import * as express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.success === 'true') {
        res.sendFile('account-verified.html', {root: '../public'});
    }
    else {
        res.status(403);
        res.send('ERROR 403: Resource forbidden');
    }
});

export default router;