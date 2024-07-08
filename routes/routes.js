const express = require('express');
const router = express.Router();
const { validateAdminCredentials, checkAdminAuth } = require('../models/authMiddleware'); 
const joinUsModel = require('../models/joinusModel'); 
const FreeTrialUser = require('../models/FreeTrialUser'); 
const validator = require('validator');     

router.get('/admin', async (req, res) => {
    try {
        const pendingUsers = await joinUsModel.find({ status: 'pending' });
        res.render('admin', { users: pendingUsers });
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).send('Error fetching pending users.');
    }
});


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



router.get('/approved', async (req, res) => {
    try {
        const approvedUsers = await joinUsModel.find({ status: 'approved' });
        res.render('requests', { users: approvedUsers, title: 'Approved Requests' });
    } catch (err) {
        console.error('Error fetching approved users:', err);
        res.status(500).send('Error fetching approved users.');
    }
});


router.get('/rejected', async (req, res) => {
    try {
        const rejectedUsers = await joinUsModel.find({ status: 'rejected' });
        res.render('requests', { users: rejectedUsers, title: 'Rejected Requests' });
    } catch (err) {
        console.error('Error fetching rejected users:', err);
        res.status(500).send('Error fetching rejected users.');
    }
});

router.get('/inbox', async (req, res) => {
    try {
        const pendingUsers = await joinUsModel.find({ status: 'pending' });
        res.render('inbox', { users: pendingUsers }); // Assuming you have an inbox.ejs template
    } catch (err) {
        console.error('Error fetching pending users:', err);
        res.status(500).send('Error fetching pending users.');
    }
});

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

router.get('/admin/login', (req, res) => {
    res.render('login');  
});


router.post('/admin/login', validateAdminCredentials);


router.get('/admin/panel', checkAdminAuth, (req, res) => {
   
    res.render('admin');  
});



router.post('/joinUS', async (req, res) => {
    const { name, email, occupation, registerDayTime, interestedIn, gender, trainer, status } = req.body;
    const nameRegex = /^[a-zA-Z]+$/; 
    const occupationRegex = /^[a-zA-Z\s]*$/;
    try {
       
        const userCount = await joinUsModel.countDocuments({ status: { $in: ['approved', 'pending'] } });

        if (userCount >= 300) {
            req.session.message = {
                type: 'danger',
                content: 'Registration failed. No seats available.'
            };
            return res.redirect('/joinus');
        }

        
        if (!nameRegex.test(name)) {
            req.session.message = {
                type: 'danger',
                content: 'Name can only contain letters.'
            };
            return res.redirect('/joinus');
        }
         
        if (!occupationRegex.test(occupation)) {
            req.session.message = {
                type: 'danger',
                content: 'Occupation can only contain letters.'
            };
            return res.redirect('/joinus');
        }

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

router.post('/free-trial', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    const nameRegex = /^[a-zA-Z]+$/;

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        req.session.message = {
            type: 'danger',
            content: 'Names can only contain letters.'
        };
        return res.redirect('/');
    }

    if (!validator.isEmail(email)) {
        req.session.message = {
            type: 'danger',
            content: 'Please enter a valid email address.'
        };
        return res.redirect('/');
    }

    try {
       
        const existingUser = await FreeTrialUser.findOne({ email });
        if (existingUser) {
            req.session.message = {
                type: 'danger',
                content: 'You have already signed up for a free trial.'
            };
            return res.redirect('/');
        }

        const newUser = new FreeTrialUser({
            firstName,
            lastName,
            email
        });
        await newUser.save();
        req.session.message = {
            type: 'success',
            content: 'Thank you for signing up for a free trial!'
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error saving free trial user:', err);
        req.session.message = {
            type: 'danger',
            content: 'There was an error with your submission. Please try again.'
        };
        res.redirect('/');
    }
});

router.get('/freeTrialUsers', async (req, res) => {
    try {
        const freeTrialUsers = await FreeTrialUser.find({});
        res.render('freeTrialUsers', { users: freeTrialUsers });
    } catch (err) {
        console.error('Error fetching free trial users:', err);
        res.status(500).send('Error fetching free trial users.');
    }
});


router.get('/Signup', (req, res) => {
    res.render('Signup');
});

router.get('/Login', (req, res) => {
    res.render('Login');
});

router.get('/joinUS', (req, res) => {
    res.render('joinUS');
});
module.exports = router;