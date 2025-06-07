const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Industry = require('../models/Industry');

// @route   GET api/companies
// @desc    获取所有公司
// @access  Public
router.get('/', async(req, res) => {
    try {
        const companies = await Company.find()
            .populate('industry', 'name')
            .sort('name');
        res.json(companies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/companies/industry/:industryId
// @desc    获取指定行业下的所有公司
// @access  Public
router.get('/industry/:industryId', async(req, res) => {
    try {
        // 验证行业是否存在
        const industry = await Industry.findById(req.params.industryId);
        if (!industry) {
            return res.status(404).json({ message: '未找到该行业' });
        }

        const companies = await Company.find({ industry: req.params.industryId })
            .populate('industry', 'name')
            .sort('name');
        res.json(companies);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '无效的行业ID' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/companies/:id
// @desc    获取指定ID的公司
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate('industry', 'name');

        if (!company) {
            return res.status(404).json({ message: '未找到该公司' });
        }

        res.json(company);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该公司' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/companies
// @desc    创建公司
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 验证行业是否存在
        const industry = await Industry.findById(req.body.industry);
        if (!industry) {
            return res.status(400).json({ message: '无效的行业ID' });
        }

        const newCompany = new Company({
            name: req.body.name,
            industry: req.body.industry,
            description: req.body.description,
            location: req.body.location,
            website: req.body.website
        });

        const company = await newCompany.save();

        // 返回带有行业信息的公司数据
        const populatedCompany = await Company.findById(company._id)
            .populate('industry', 'name');

        res.json(populatedCompany);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/companies/:id
// @desc    更新公司信息
// @access  Public
router.put('/:id', async(req, res) => {
    try {
        // 如果更新包含行业，验证行业是否存在
        if (req.body.industry) {
            const industry = await Industry.findById(req.body.industry);
            if (!industry) {
                return res.status(400).json({ message: '无效的行业ID' });
            }
        }

        const company = await Company.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        ).populate('industry', 'name');

        if (!company) {
            return res.status(404).json({ message: '未找到该公司' });
        }

        res.json(company);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该公司' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/companies/:id
// @desc    删除公司
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: '未找到该公司' });
        }

        await company.remove();
        res.json({ message: '公司已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该公司' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;