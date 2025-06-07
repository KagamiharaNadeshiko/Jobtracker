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
        enum: ['电话面试', '视频面试', '现场面试', '群面', '单面', '其他'],
        required: true
    },
    date: {
        type: Date
    },
    location: {
        type: String
    },
    interviewers: {
        type: String
    },
    questions: [{
        type: String
    }],
    notes: {
        type: String
    },
    feedback: {
        type: String
    },
    result: {
        type: String,
        enum: ['通过', '未通过', '等待结果', '未参加'],
        default: '等待结果'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', InterviewSchema);