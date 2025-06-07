const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// @route   GET api/companies
// @desc    获取所有公司
// @access  Public
router.get('/', async(req, res) => {
    try {
        const companies = await Company.find().populate('industry', 'name').sort({ name: 1 });
        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/companies/industry/:industryId
// @desc    按行业获取公司
// @access  Public
router.get('/industry/:industryId', async(req, res) => {
    try {
        const companies = await Company.find({ industry: req.params.industryId })
            .populate('industry', 'name')
            .sort({ name: 1 });
        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/companies/:id
// @desc    获取单个公司
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('industry', 'name');

        if (!company) {
            return res.status(404).json({ msg: '公司不存在' });
        }

        res.json(company);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '公司不存在' });
        }
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/companies
// @desc    创建新公司
// @access  Public
router.post('/', async(req, res) => {
    const { name, industry, description, website } = req.body;

    try {
        const newCompany = new Company({
            name,
            industry,
            description,
            website
        });

        const company = await newCompany.save();
        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/companies/:id
// @desc    更新公司
// @access  Public
router.put('/:id', async(req, res) => {
    const { name, industry, description, website } = req.body;

    // 构建公司对象
    const companyFields = {};
    if (name) companyFields.name = name;
    if (industry) companyFields.industry = industry;
    if (description) companyFields.description = description;
    if (website) companyFields.website = website;

    try {
        let company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: '公司不存在' });

        company = await Company.findByIdAndUpdate(
            req.params.id, { $set: companyFields }, { new: true }
        ).populate('industry', 'name');

        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/companies/:id
// @desc    删除公司
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: '公司不存在' });

        await Company.findByIdAndRemove(req.params.id);

        res.json({ msg: '公司已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;