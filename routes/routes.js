const express = require('express');
const router = express.Router();
const SignupModel = require('../models/SignupModel'); // Adjust path as necessary
const joinUsModel = require('../models/joinusModel'); // Adjust path as necessary

// Admin panel route to display pending user registrations
router.get('/admin', async (req, res) => {
    try {
        const pendingUsers = await joinUsModel.find({ status: 'pending' });
        res.render('admin', { users: pendingUsers });
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).send('Error fetching pending users.');
    }
});
// Admin route to approve a user registration
router.post('/admin/approve-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await joinUsModel.findByIdAndUpdate(userId, { status: 'approved' }, { new: true });
        console.log('User Approved:', updatedUser);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error approving user:', err);
        res.status(500).send('Error approving user.');
    }
});

// Admin route to reject a user registration
router.post('/admin/reject-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await joinUsModel.findByIdAndUpdate(userId, { status: 'rejected' }, { new: true });
        console.log('User Rejected:', updatedUser);
        res.redirect('/admin');
    } catch (err) {
        console.error('Error rejecting user:', err);
        res.status(500).send('Error rejecting user.');
    }
});


// Route to fetch pending user requests (inbox functionality)
router.get('/inbox', async (req, res) => {
    try {
        const pendingUsers = await joinUsModel.find({ status: 'pending' });
        res.render('inbox', { users: pendingUsers }); // Assuming you have an inbox.ejs template
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).send('Error fetching pending users.');
    }
});
// Signup route
router.post('/Signup', async (req, res) => {
    const { name, email, pass, repass } = req.body;

    if (pass !== repass) {
        req.session.message = {
            type: 'danger',
            content: 'Passwords do not match!'
        };
        return res.redirect('/Signup');
    }

    try {
        const newData = new SignupModel({
            name,
            email,
            pass,
            repass
        });

        await newData.save();
        req.session.message = {
            type: 'success',
            content: 'Signup Successfully.'
        };
        res.redirect('/Signup');
    } catch (err) {
        console.error('Error during signup:', err);
        if (err.code === 11000) {
            req.session.message = {
                type: 'danger',
                content: 'Signup failed. Email is already taken.'
            };
        } else {
            req.session.message = {
                type: 'danger',
                content: 'Signup failed. Please try again.'
            };
        }
        res.redirect('/Signup');
    }
});

// Login route
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
        console.error('Error during login:', err);
        req.session.message = {
            type: 'danger',
            content: 'Login failed. Please try again.'
        };
        res.redirect('/Login');
    }
});

// User joinUS route
router.post('/joinUS', async (req, res) => {
    const { name, email, occupation, registerDayTime, interestedIn, gender, trainer, status } = req.body;

    try {
        // Check the number of users with status 'approved' or 'pending'
        const userCount = await joinUsModel.countDocuments({ status: { $in: ['approved', 'pending'] } });

        if (userCount >= 2) {
            // If the user count is 2 or more, send a message indicating no seats are available
            req.session.message = {
                type: 'danger',
                content: 'Registration failed. No seats available.'
            };
            return res.redirect('/joinus');
        }

        // Proceed with registration if seats are available
        const newUser = new joinUsModel({
            name,
            email,
            occupation,
            registerDayTime,
            interestedIn,
            gender,
            trainer,
            status
        });

        await newUser.save();
        req.session.message = {
            type: 'success',
            content: 'Registration successful.'
        };
        res.redirect('/joinus');
    } catch (err) {
        console.error('Error during registration:', err);
        if (err.code === 11000) {
            req.session.message = {
                type: 'danger',
                content: 'Registration failed. Email is already taken.'
            };
        } else {
            req.session.message = {
                type: 'danger',
                content: 'Registration failed. Please try again.'
            };
        }
        res.redirect('/joinus');
    }
});




// Route to render Signup page
router.get('/Signup', (req, res) => {
    res.render('Signup');
});

// Route to render Login page
router.get('/Login', (req, res) => {
    res.render('Login');
});

// Route to render joinUS page
router.get('/joinUS', (req, res) => {
    res.render('joinUS');
});

module.exports = router;
