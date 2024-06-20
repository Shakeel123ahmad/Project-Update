const express = require('express');
const router = express.Router();
const SignupModel = require('../models/SignupModel'); // Adjust path as necessary
const joinUsModel = require('../models/joinusModel'); // Adjust path as necessary

// Signup routes
router.post('/Signup', async (req, res) => {
    const { name, email, pass, repass } = req.body;

    if (pass !== repass) {
        req.session.message = {
            type: 'danger',
            content: 'Passwords do not match!'
        };
        return res.redirect('/Signup');
    }

    const newData = new SignupModel({
        name,
        email,
        pass,
        repass
    });

    try {
        await newData.save();
        req.session.message = {
            type: 'success',
            content: 'Signup Successfully.'
        };
        res.redirect('/Signup');
    } catch (err) {
        req.session.message = {
            type: 'danger',
            content: 'Signup failed. Email might already be taken.'
        };
        res.redirect('/Signup');
    }
});

router.get('/Signup', (req, res) => {
    res.render('Signup');
});

// Login routes
router.post('/Login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        const user = await SignupModel.findOne({ email, pass });
        if (user) {
            req.session.message = {
                type: 'success',
                content: 'Login Successfully.'
            };
            res.redirect('/Login');
        } else {
            req.session.message = {
                type: 'danger',
                content: 'Invalid email or password.'
            };
            res.redirect('/Login');
        }
    } catch (err) {
        req.session.message = {
            type: 'danger',
            content: 'Login failed. Please try again.'
        };
        res.redirect('/Login');
    }
});

router.get('/Login', (req, res) => {
    res.render('Login');
});

// User joinUS routes
router.post('/joinUS', async (req, res) => {
    const { name, email, occupation, registerDayTime, interestedIn, gender, trainer } = req.body;

    const newUser = new joinUsModel({
        name,
        email,
        occupation,
        registerDayTime,
        interestedIn,
        gender,
        trainer
    });

    try {
        await newUser.save();
        req.session.message = {
            type: 'success',
            content: 'Registration successful.'
        };
        res.redirect('/joinUS');
    } catch (err) {
        req.session.message = {
            type: 'danger',
            content: 'Registration failed. Email might already be taken.'
        };
        res.redirect('/joinUS');
    }
});

router.get('/joinUS', (req, res) => {
    res.render('joinUS');
});

module.exports = router;
