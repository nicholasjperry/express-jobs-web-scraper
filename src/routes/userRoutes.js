const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

// POST HTTP request at endpoint '/register'
router.post('/user/register', 
    /* 1) check method - takes in field and message parameters. Field is a string that is used to be validated against.
        Message is an error message if not supplied with correct entry.
        2) not method - negates value of the next validator.
        3) isEmpty method - part of validation chain to check if value is "empty".
    */
    [
        check("email", "Please Enter a Valid Email.")
        .not()
        .isEmpty()
        .isEmail(),
        check("password", "Please Enter a Valid Password.").isLength({
            min: 6
        })
    ],

    async(req, res) => {
        // Extracts the validation errors from a request and makes them available in a Result object
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        // Data accessed from the client side; it is received from the POST request made to Express server.
        const { email, password } = req.body;

        try {
            // Assigning 'user' to email, which is searched against the database and passed to Express server from req.body to see if user already exists.
            let user = await User.findOne({
                email
            });
            // If user is already defined in database, server returns message to client that they already exist.
            if(user) {
                return res.status(400).json({
                    msg: "User Already Exists."
                });
            }
            // Same instance of 'user' to now be enforced by mongoose 'User' schema in order to create a new user in the database. 
            user = new User({
                email, 
                password
            });
            // Bcrypt returns a Promise, hence async/await.  
            // Generating salt
            const salt = await bcrypt.genSalt(10);
            // Generating hash password based on salt. Takes in two arguments: 1) plain text, 2) salt string which returns a hash value with salt string
            user.password = await bcrypt.hash(password, salt);
            // Save user to the db
            await user.save();

            // Storing the user that we created and stored in the db in an object called 'payload'
            const payload = {
                user: { 
                    id: user.id 
                }
            };
            // Anatomy of JWT - 1) Header segment, payload segment, and crypto segment/signature
            // Synchronously signing the given payload into a jwt string payload
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                // Callback function that takes in err and token as arguments
                //If err, throw err; otherwise send 'ok' response and the token back to the client in the form of JSON
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch(err) {
            console.log(err.message);
            res.status(500).send("Error in Saving.");
        }
    }
);

// POST HTTP request at endpoint '/register'
router.post('/user/login',
    [
        check('email', 'Please Enter a Valid Email.').isEmail(),
        check('password', 'Please Enter a Valid Password.').isLength({
            min: 6
        })
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // Destructuring email and password variables from request body
        const { email, password } = req.body;
        try {
            // Look up user in db by email
            let user = await User.findOne({
                email
            });
            if(!user) {
                return res.status(400).json({
                    message: "User Does Not Exist."
                });
            }
            // Comparing password provided client-side to what is stored in the db
            const isMatch = await bcrypt.compare(password, user.password);
            // If isMatch is false then produce error message
            if(!isMatch) {
                return res.status(400).json({
                    message: "Incorrect Password"
                });
            }
            /* Setting payload to be verified and subsequently signed by the server once POST request 
            is made to '/user/login' in order to authenticate the user to sign in*/
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600 
                },
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch(err) {
            console.log(err);
            res.status(500).json({
                message: "Server Error."
            });
        }
    }
);

module.exports = router;
