const mongoose = require('mongoose');

const OnlineTestSchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    type: {
        type: String,
        enum: ['Coding', 'Multiple Choice', 'Written', 'Mixed', 'Other'],
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    notes: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model('OnlineTest', OnlineTestSchema);