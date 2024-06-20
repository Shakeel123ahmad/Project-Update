// models/SignupModel.js
const mongoose = require('mongoose');

const SignupSchema = new mongoose.Schema({
    name: String,
    email: String,
    pass: String,
    repass: String,
});

module.exports = mongoose.model('Signup', SignupSchema);
