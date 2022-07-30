const mongoose = require('mongoose');

// Junior jobs data schema
const JobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    }
});

// Schema created into a model to be exported and used 
const Job = mongoose.model('Job', JobSchema, 'jobs');

module.exports = Job;