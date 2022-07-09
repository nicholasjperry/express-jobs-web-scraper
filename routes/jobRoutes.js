const express = require("express");
const Job = require('../models/job');
const router = express.Router();

router.get('/jobs', async(req, res) => {
    const jobs = await Job.find({});
    try {
        res.send(jobs)
    } catch(err) {
        res.status(500).send(err)
    }
});

router.post('/jobs', async(req, res) => {
    const job = new Job(req.body);
    try {
        await job.save();
        res.send(job);
    } catch(err) {
        res.status(500).send(err);
    }
})

module.exports = router;
