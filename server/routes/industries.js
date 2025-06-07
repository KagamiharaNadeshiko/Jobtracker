const express = require('express');
const router = express.Router();
const Industry = require('../models/Industry');

// @route   GET api/industries
// @desc    获取所有行业
// @access  Public
router.get('/', async(req, res) => {
    try {
        const industries = await Industry.find().sort('name');
        res.json(industries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/industries/:id
// @desc    获取指定ID的行业
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);
        if (!industry) {
            return res.status(404).json({ message: '未找到该行业' });
        }
        res.json(industry);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该行业' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/industries
// @desc    创建行业
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 检查是否已存在同名行业
        const existingIndustry = await Industry.findOne({ name: req.body.name });
        if (existingIndustry) {
            return res.status(400).json({ message: '该行业名称已存在' });
        }

        const newIndustry = new Industry({
            name: req.body.name,
            description: req.body.description
        });

        const industry = await newIndustry.save();
        res.json(industry);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/industries/:id
// @desc    更新行业信息
// @access  Public
router.put('/:id', async(req, res) => {
    try {
        // 检查是否有其他行业已使用该名称
        if (req.body.name) {
            const existingIndustry = await Industry.findOne({
                name: req.body.name,
                _id: { $ne: req.params.id }
            });

            if (existingIndustry) {
                return res.status(400).json({ message: '该行业名称已存在' });
            }
        }

        const industry = await Industry.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!industry) {
            return res.status(404).json({ message: '未找到该行业' });
        }

        res.json(industry);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该行业' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/industries/:id
// @desc    删除行业
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);
        if (!industry) {
            return res.status(404).json({ message: '未找到该行业' });
        }

        await industry.remove();
        res.json({ message: '行业已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该行业' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;