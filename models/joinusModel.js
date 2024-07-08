const mongoose = require('mongoose');

const joinUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    occupation: {
        type: String,
        required: true
    },
    registerDayTime: {
        type: Date,
        required: true
    },
    interestedIn: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    trainer: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }

});

const joinUsModel = mongoose.model('JoinUs', joinUsSchema);

module.exports = joinUsModel;
