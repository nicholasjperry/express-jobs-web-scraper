const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/user');

router.get('/me', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch(err) {
        res.send({ message: "Error in Fetching User." });
    }
});

module.exports = router;