const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../keys.js');


router.post('/signup', (req, res) => {
    const {
        username,
        email,
        password,
        avatar
    } = req.body;
    if (!username || !email || !password) {
        return res.status(422).json({
            error: "Please, fill in all fields"
        });
    }

    User.findOne({
        email: email
    }).then(savedUser => {
        if (savedUser) {
            return res.status(422).json({
                error: "User already exists with that email"
            });
        }
        // bigger number - high security
        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                username,
                email,
                password: hashedPassword,
                avatar
            });

            user.save().then(user => {
                res.json({
                    message: "Successful user registration"
                });
            }).catch(err => {
                console.log("error 1-1");
            });
        });
    }).catch(err => {
        console.log("error 1-2");
    });
});

router.post('/signin', (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return res.status(442).json({
            error: "Please, add email or password"
        });
    }

    User.findOne({
        email: email
    }).then((savedUser) => {
        if (!savedUser) {
            return res.status(442).json({
                error: "Invalid email or password"
            });
        }
        bcrypt.compare(password, savedUser.password).then(doMatch => {
            if (doMatch) {
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET);
                const {_id, username, email, avatar, followers, following} = savedUser;
                res.json({token, user:{_id, username, email, avatar, followers, following}});
            } else {
                return res.status(442).json({
                    error: "Invalid email or password"
                });
            }
        }).catch(err => {
            console.log("error 2-1");
        });
    });
});

module.exports = router;