const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    round: {
        type: Number,
        required: true,
        default: 1
    },
    type: {
        type: String,
        enum: ['Phone', 'Video', 'In-person', 'Technical', 'HR', 'Other'],
        required: true
    },
    date: {
        type: Date
    },
    location: {
        type: String
    },
    questions: [{
        question: {
            type: String
        },
        answer: {
            type: String
        }
    }],
    notes: {
        type: String
    },
    result: {
        type: String,
        enum: ['Passed', 'Failed', 'Pending', 'Cancelled'],
        default: 'Pending'
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

module.exports = mongoose.model('Interview', InterviewSchema);