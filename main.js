require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/routes');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
    session({
        secret: "My personal matter",
        saveUninitialized: true,
        resave: false
    })
);

// Flash message middleware
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/GYM_CRUD");

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection Error: ${err}`);
});

// Use routes
app.use("/", routes);

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gallery', (req, res) => {
    res.render('gallery');
});

app.get('/classes', (req, res) => {
    res.render('classes');
});

app.get('/joinUS', (req, res) => {
    res.render('joinUS');
});

app.get('/admin/add-trainer', (req, res) => {
    res.render('add-trainer');
});

app.get('/trainer', (req, res) => {
    res.render('trainer');
});

app.get('/coach1', (req, res) => {
    res.render('coach1');
});

app.get('/coach2', (req, res) => {
    res.render('coach2');
});

app.get('/t1', (req, res) => {
    res.render('t1');
});

app.get('/t2', (req, res) => {
    res.render('t2');
});

app.get('/t3', (req, res) => {
    res.render('t3');
});

app.get('/t4', (req, res) => {
    res.render('t4');
});

app.get('/AboutUs', (req, res) => {
    res.render('AboutUs');
});

// Route to handle adding a trainer
app.post('/admin/add-trainer', async (req, res) => {
    const { name, email, phone, specialty, bio } = req.body;

    const newTrainer = new OurTrainerSchemaModel({
        name,
        email,
        phone,
        specialty,
        bio,
    });

    try {
        const savedTrainer = await newTrainer.save();
        console.log('Trainer Successfully Saved:', savedTrainer);
        res.send('Trainer Added Successfully');
    } catch (err) {
        console.error('Error Saving Trainer:', err);
        res.status(500).send('Error Saving Trainer.');
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
