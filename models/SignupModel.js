const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    pass: {
        type: String,
        required: true
    },
    repass: {
        type: String,
        required: true
    }
});

const SignupModel = mongoose.model('Signup', signupSchema);

module.exports = SignupModel;
