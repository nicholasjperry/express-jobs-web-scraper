const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    password: {
        type: String,
        index: true
    }
}, {timestamps: true});

// Schema created into a model to be exported and used 
const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;