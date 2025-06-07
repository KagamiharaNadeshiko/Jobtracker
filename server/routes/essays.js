const express = require('express');
const router = express.Router();
const Essay = require('../models/Essay');
const Position = require('../models/Position');

// @route   GET api/essays/position/:positionId
// @desc    获取指定职位下的所有申请文书
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.params.positionId);
        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        const essays = await Essay.find({ position: req.params.positionId })
            .sort({ createdAt: -1 });
        res.json(essays);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '无效的职位ID' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/essays/:id
// @desc    获取指定ID的申请文书
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);

        if (!essay) {
            return res.status(404).json({ message: '未找到该申请文书' });
        }

        res.json(essay);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该申请文书' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/essays
// @desc    创建申请文书
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.body.position);
        if (!position) {
            return res.status(400).json({ message: '无效的职位ID' });
        }

        const newEssay = new Essay({
            position: req.body.position,
            title: req.body.title,
            content: req.body.content,
            wordCount: req.body.wordCount || req.body.content.length,
            notes: req.body.notes
        });

        const essay = await newEssay.save();
        res.json(essay);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/essays/:id
// @desc    更新申请文书
// @access  Public
router.put('/:id', async(req, res) => {
    try {
        // 如果更新包含职位，验证职位是否存在
        if (req.body.position) {
            const position = await Position.findById(req.body.position);
            if (!position) {
                return res.status(400).json({ message: '无效的职位ID' });
            }
        }

        // 如果更新内容，更新字数
        if (req.body.content) {
            req.body.wordCount = req.body.wordCount || req.body.content.length;
        }

        const essay = await Essay.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!essay) {
            return res.status(404).json({ message: '未找到该申请文书' });
        }

        res.json(essay);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该申请文书' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/essays/:id
// @desc    删除申请文书
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);
        if (!essay) {
            return res.status(404).json({ message: '未找到该申请文书' });
        }

        await essay.remove();
        res.json({ message: '申请文书已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该申请文书' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;