const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    // 记录申请状态：准备中、已投递、网测中、面试中、offer、拒绝等
    status: {
        type: String,
        enum: ['准备中', '已投递', '网测中', '面试中', 'Offer', '拒绝'],
        default: '准备中'
    },
    // 简历截止日期
    resumeDeadline: {
        type: Date
    },
    // 网测截止日期
    onlineTestDeadline: {
        type: Date
    },
    notes: {
        type: String
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

module.exports = mongoose.model('Position', PositionSchema);