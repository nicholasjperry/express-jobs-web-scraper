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

router.patch('/jobs/:id', async(req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id });
        if(req.body.name) {
            job.name = req.body.name;
        }
        if(req.body.url) {
            job.url = req.body.url;
        }
        if(req.body.path) {
            job.path = req.body.path;
        }
        await job.save();
        res.send(job);

    } catch {
        res.status(404);
        res.send({ error: "Job doesn't exist!" });
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
});

router.delete('/jobs/:id', async(req, res) => {
    try {
        await Job.deleteOne({ _id: req.params.id });
        res.send(204).send();
    } catch {
        res.status(404);
        res.send({ error: "Job doesn't exist" })
    }
});

module.exports = router;
