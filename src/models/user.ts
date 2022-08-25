import { Schema, model } from 'mongoose';

interface IUser {
    email: string,
    password: string
}

// User schema
const UserSchema = new Schema<IUser>({
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
const User = model<IUser>('User', UserSchema, 'users');

module.exports = User;