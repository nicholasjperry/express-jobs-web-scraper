import express, { Request, Response } from 'express';
import auth from '../middleware/auth';

const router = express.Router();
const User = require('../models/user');

// GET request made, authentication performed server-side, which then allows the server to respond with requested user 
router.get('/user/me', auth, async(req: Request | any, res: Response) => {
    try {
        // Fetching user in db
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch(err) {
        res.send({ message: "Error in Fetching User." });
    }
});

module.exports = router;