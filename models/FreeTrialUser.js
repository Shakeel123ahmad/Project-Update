const mongoose = require('mongoose');

const FreeTrialUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const FreeTrialUser = mongoose.model('FreeTrialUser', FreeTrialUserSchema);

module.exports = FreeTrialUser;
