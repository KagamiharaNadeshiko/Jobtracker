const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    description: {
        type: String
    },
    applicationType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Other']
    },
    testType: {
        type: String,
        enum: ['Technical', 'Behavioral', 'Case Study', 'Mixed', 'None', 'Other']
    },
    deadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Applied', 'In Progress', 'Rejected', 'Offer', 'Accepted', 'Withdrawn'],
        default: 'Applied'
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

module.exports = mongoose.model('Position', PositionSchema);