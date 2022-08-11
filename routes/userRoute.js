const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/user');

// GET request made, authentication performed server-side, which then allows the server to respond with requested user 
router.get('/user/me', auth, async(req, res) => {
    try {
        // Fetching user in db
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch(err) {
        res.send({ message: "Error in Fetching User." });
    }
});

module.exports = router;