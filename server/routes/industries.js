const express = require('express');
const router = express.Router();
const Industry = require('../models/Industry');

// @route   GET api/industries
// @desc    获取所有行业
// @access  Public
router.get('/', async(req, res) => {
    try {
        const industries = await Industry.find().sort({ name: 1 });
        res.json(industries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/industries
// @desc    创建新行业
// @access  Public
router.post('/', async(req, res) => {
    const { name, description } = req.body;

    try {
        let industry = await Industry.findOne({ name });

        if (industry) {
            return res.status(400).json({ msg: '该行业已存在' });
        }

        industry = new Industry({
            name,
            description
        });

        await industry.save();
        res.json(industry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/industries/:id
// @desc    更新行业
// @access  Public
router.put('/:id', async(req, res) => {
    const { name, description } = req.body;

    // 构建行业对象
    const industryFields = {};
    if (name) industryFields.name = name;
    if (description) industryFields.description = description;

    try {
        let industry = await Industry.findById(req.params.id);

        if (!industry) return res.status(404).json({ msg: '行业不存在' });

        industry = await Industry.findByIdAndUpdate(
            req.params.id, { $set: industryFields }, { new: true }
        );

        res.json(industry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/industries/:id
// @desc    删除行业
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);

        if (!industry) return res.status(404).json({ msg: '行业不存在' });

        await Industry.findByIdAndRemove(req.params.id);

        res.json({ msg: '行业已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;