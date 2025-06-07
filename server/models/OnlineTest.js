const mongoose = require('mongoose');

const OnlineTestSchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    type: {
        type: String,
        enum: ['行测', '性格测试', '英语测试', '专业知识', '编程测试', '案例分析', '其他'],
        required: true
    },
    description: {
        type: String,
        trim: true
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
    testDate: {
        type: Date
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

module.exports = mongoose.model('OnlineTest', OnlineTestSchema);