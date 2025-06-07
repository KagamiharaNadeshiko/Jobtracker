const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: [true, '关联职位不能为空']
    },
    round: {
        type: String,
        required: [true, '面试轮次不能为空'],
        trim: true
    },
    type: {
        type: String,
        required: [true, '面试类型不能为空'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, '面试日期不能为空']
    },
    duration: {
        type: Number,
        default: 60 // 默认时长60分钟
    },
    interviewers: {
        type: String
    },
    questions: {
        type: String
    },
    notes: {
        type: String
    },
    result: {
        type: String,
        enum: ['等待结果', '通过', '拒绝'],
        default: '等待结果'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);