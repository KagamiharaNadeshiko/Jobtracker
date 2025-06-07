const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Position = require('../models/Position');

// @route   GET api/interviews/position/:positionId
// @desc    获取指定职位下的所有面试
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.params.positionId);
        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        const interviews = await Interview.find({ position: req.params.positionId })
            .sort({ date: -1 });
        res.json(interviews);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '无效的职位ID' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/interviews/:id
// @desc    获取指定ID的面试
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: '未找到该面试' });
        }

        res.json(interview);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该面试' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/interviews
// @desc    创建面试
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.body.position);
        if (!position) {
            return res.status(400).json({ message: '无效的职位ID' });
        }

        const newInterview = new Interview({
            position: req.body.position,
            round: req.body.round,
            type: req.body.type,
            date: req.body.date,
            duration: req.body.duration || 60,
            interviewers: req.body.interviewers,
            questions: req.body.questions,
            notes: req.body.notes,
            result: req.body.result || '等待结果'
        });

        const interview = await newInterview.save();
        res.json(interview);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/interviews/:id
// @desc    更新面试
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

        const interview = await Interview.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!interview) {
            return res.status(404).json({ message: '未找到该面试' });
        }

        res.json(interview);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该面试' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/interviews/:id
// @desc    删除面试
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: '未找到该面试' });
        }

        await interview.remove();
        res.json({ message: '面试已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该面试' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;