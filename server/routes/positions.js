const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const Company = require('../models/Company');

// @route   GET api/positions
// @desc    获取所有职位
// @access  Public
router.get('/', async(req, res) => {
    try {
        const positions = await Position.find()
            .populate('company', 'name industry location')
            .sort({ updatedAt: -1 });
        res.json(positions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/positions/company/:companyId
// @desc    获取指定公司下的所有职位
// @access  Public
router.get('/company/:companyId', async(req, res) => {
    try {
        // 验证公司是否存在
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ message: '未找到该公司' });
        }

        const positions = await Position.find({ company: req.params.companyId })
            .populate('company', 'name industry location')
            .sort({ updatedAt: -1 });
        res.json(positions);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '无效的公司ID' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/positions/:id
// @desc    获取指定ID的职位
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const position = await Position.findById(req.params.id);

        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        res.json(position);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该职位' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/positions
// @desc    创建职位
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 验证公司是否存在
        const company = await Company.findById(req.body.company);
        if (!company) {
            return res.status(400).json({ message: '无效的公司ID' });
        }

        const newPosition = new Position({
            title: req.body.title,
            company: req.body.company,
            description: req.body.description,
            location: req.body.location,
            deadline: req.body.deadline,
            status: req.body.status || '准备中'
        });

        const position = await newPosition.save();

        // 返回带有公司信息的职位数据
        const populatedPosition = await Position.findById(position._id);

        res.json(populatedPosition);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/positions/:id
// @desc    更新职位信息
// @access  Public
router.put('/:id', async(req, res) => {
    try {
        // 如果更新包含公司，验证公司是否存在
        if (req.body.company) {
            const company = await Company.findById(req.body.company);
            if (!company) {
                return res.status(400).json({ message: '无效的公司ID' });
            }
        }

        const position = await Position.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        res.json(position);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该职位' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/positions/:id
// @desc    删除职位
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        await position.remove();
        res.json({ message: '职位已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该职位' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;