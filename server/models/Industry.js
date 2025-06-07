const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '行业名称不能为空'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, '行业描述不能为空'],
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 虚拟字段: 关联的公司数量
IndustrySchema.virtual('companies', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'industry',
    count: true
});

module.exports = mongoose.model('Industry', IndustrySchema);