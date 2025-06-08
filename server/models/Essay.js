const mongoose = require('mongoose');

const EssaySchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
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

module.exports = mongoose.model('Essay', EssaySchema);