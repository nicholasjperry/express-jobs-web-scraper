const express = require("express");
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

// router.get('/users', async(req, res) => {
//     const users = await User.find({});
//     try {
//         res.send(users)
//     } catch(err) {
//         res.status(500).send(err)
//     }
// });

// router.get("/users/:id", async (req, res) => {
// 	const user = await User.findOne({ _id: req.params.id });
// 	res.send(user);
// });

router.post('/register', 
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
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({
                email
            });
            if(user) {
                return res.status(400).json({
                    msg: "User Already Exists."
                });
            }
            user = new User({
                email, 
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const payload = {
                user: { id: user.id }
            };
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
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

router.post('/login',
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
        
        const { email, password } = req.body;
        try {
            let user = await User.findOne({
                email
            });

            if(!user) {
                return res.status(400).json({
                    message: "User Does Not Exist."
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({
                    message: "Incorrect Password"
                });
            }

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
            })
        }
    }
)

// router.post('/users/login', async(req, res) => {
//     const user = new User(req.body);
//     try {
//         await user.save();
//         res.send(user);
//     } catch(err) {
//         res.status(500).send(err);
//     }
// });

// router.delete('/users/:id', async(req, res) => {
//     try {
//         await User.deleteOne({ _id: req.params.id });
//         res.send(204).send();
//     } catch {
//         res.status(404);
//         res.send({ error: "User doesn't exist" })
//     }
// });

module.exports = router;
