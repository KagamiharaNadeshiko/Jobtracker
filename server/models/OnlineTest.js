const mongoose = require('mongoose');

const OnlineTestSchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: [true, '关联职位不能为空']
    },
    testType: {
        type: String,
        required: [true, '测试类型不能为空'],
        trim: true
    },
    platform: {
        type: String,
        required: [true, '测试平台不能为空'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, '测试日期不能为空']
    },
    duration: {
        type: Number,
        default: 60 // 默认时长60分钟
    },
    content: {
        type: String
    },
    score: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OnlineTest', OnlineTestSchema);