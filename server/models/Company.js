const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', CompanySchema);