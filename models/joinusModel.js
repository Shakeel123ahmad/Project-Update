    // models/UserRegistrationModel.js
    const mongoose = require('mongoose');

    const UserRegistrationSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        occupation: {
            type: String,
            required: true,
        },
        registerDayTime: {
            type: Date,
            required: true,
        },
        interestedIn: {
            type: String,
            required: true,
            enum: ['Yoga', 'Cycling', 'Cardio'],
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Others'],
        },
        trainer: {
            type: String,
            required: true,
        }
    });

    module.exports = mongoose.model('joinUS', UserRegistrationSchema);
