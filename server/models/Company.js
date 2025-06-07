const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '公司名称不能为空'],
        trim: true
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        required: [true, '所属行业不能为空']
    },
    description: {
        type: String,
        required: [true, '公司描述不能为空'],
        trim: true
    },
    location: {
        type: String,
        required: [true, '公司地点不能为空'],
        trim: true
    },
    website: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 虚拟字段: 关联的职位数量
CompanySchema.virtual('positions', {
    ref: 'Position',
    localField: '_id',
    foreignField: 'company',
    count: true
});

module.exports = mongoose.model('Company', CompanySchema);