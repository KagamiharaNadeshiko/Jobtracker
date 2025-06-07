const express = require('express');
const router = express.Router();
const OnlineTest = require('../models/OnlineTest');
const Position = require('../models/Position');

// @route   GET api/onlinetests/position/:positionId
// @desc    获取指定职位下的所有网测
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.params.positionId);
        if (!position) {
            return res.status(404).json({ message: '未找到该职位' });
        }

        const onlinetests = await OnlineTest.find({ position: req.params.positionId })
            .sort({ date: -1 });
        res.json(onlinetests);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '无效的职位ID' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   GET api/onlinetests/:id
// @desc    获取指定ID的网测
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const onlinetest = await OnlineTest.findById(req.params.id);

        if (!onlinetest) {
            return res.status(404).json({ message: '未找到该网测' });
        }

        res.json(onlinetest);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该网测' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   POST api/onlinetests
// @desc    创建网测
// @access  Public
router.post('/', async(req, res) => {
    try {
        // 验证职位是否存在
        const position = await Position.findById(req.body.position);
        if (!position) {
            return res.status(400).json({ message: '无效的职位ID' });
        }

        const newOnlineTest = new OnlineTest({
            position: req.body.position,
            testType: req.body.testType,
            platform: req.body.platform,
            date: req.body.date,
            duration: req.body.duration || 60,
            content: req.body.content,
            score: req.body.score,
            notes: req.body.notes
        });

        const onlinetest = await newOnlineTest.save();
        res.json(onlinetest);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   PUT api/onlinetests/:id
// @desc    更新网测
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

        const onlinetest = await OnlineTest.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true, runValidators: true }
        );

        if (!onlinetest) {
            return res.status(404).json({ message: '未找到该网测' });
        }

        res.json(onlinetest);
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该网测' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

// @route   DELETE api/onlinetests/:id
// @desc    删除网测
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const onlinetest = await OnlineTest.findById(req.params.id);
        if (!onlinetest) {
            return res.status(404).json({ message: '未找到该网测' });
        }

        await onlinetest.remove();
        res.json({ message: '网测已删除' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: '未找到该网测' });
        }
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;