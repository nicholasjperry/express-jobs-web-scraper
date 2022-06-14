const express = require("express");
const app = express();
const Job = require('../models/job');

app.get('/', async(req, res) => {
    const jobs = await Job.find({});
    try {
        res.send(jobs)
    } catch(err) {
        res.status(500).send(err)
    }
});

app.post('/', async(req, res) => {
    const job = new Job(req.body);
    try {
        await job.save();
        res.send(job);
    } catch(err) {
        res.status(500).send(err);
    }
})

module.exports = app;
