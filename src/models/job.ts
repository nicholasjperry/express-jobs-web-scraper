import { Schema, model } from 'mongoose';

interface IJob {
    name: string,
    url: string,
    path: string
}

// Junior jobs data schema
const JobSchema = new Schema<IJob>({
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
const Job = model<IJob>('Job', JobSchema, 'jobs');

module.exports = Job;