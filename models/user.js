const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    password: {
        type: String,
        required: [true, "can't be blank"],
        index: true
    }
}, {timestamps: true});

// Schema created into a model to be exported and used 
const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;