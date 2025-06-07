const mongoose = require('mongoose');

const EssaySchema = new mongoose.Schema({
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: [true, '关联职位不能为空']
    },
    title: {
        type: String,
        required: [true, '标题不能为空'],
        trim: true
    },
    content: {
        type: String,
        required: [true, '内容不能为空']
    },
    wordCount: {
        type: Number,
        default: 0
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Essay', EssaySchema);