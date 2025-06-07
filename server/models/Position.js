const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '职位名称不能为空'],
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, '所属公司不能为空']
    },
    description: {
        type: String,
        required: [true, '职位描述不能为空'],
        trim: true
    },
    location: {
        type: String,
        required: [true, '工作地点不能为空'],
        trim: true
    },
    deadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['准备中', '已投递', '网测中', '面试中', 'Offer', '拒绝'],
        default: '准备中'
    },
    resume: {
        type: String // 简历文件路径
    },
    attachments: [{
        name: String,
        path: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// 查询时自动关联公司信息
PositionSchema.pre('find', function() {
    this.populate('company', 'name industry location');
});

PositionSchema.pre('findOne', function() {
    this.populate({
        path: 'company',
        populate: {
            path: 'industry',
            select: 'name'
        }
    });
});

module.exports = mongoose.model('Position', PositionSchema);