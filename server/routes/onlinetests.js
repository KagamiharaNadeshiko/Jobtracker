const express = require('express');
const router = express.Router();
const OnlineTest = require('../models/OnlineTest');

// @route   GET api/onlinetests/position/:positionId
// @desc    获取特定职位的所有网测
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        const onlineTests = await OnlineTest.find({ position: req.params.positionId }).sort({ createdAt: -1 });
        res.json(onlineTests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/onlinetests/:id
// @desc    获取单个网测
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) {
            return res.status(404).json({ msg: '网测不存在' });
        }

        res.json(onlineTest);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '网测不存在' });
        }
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/onlinetests
// @desc    创建新网测
// @access  Public
router.post('/', async(req, res) => {
    const { position, type, description, content, notes, completed, testDate } = req.body;

    try {
        const newOnlineTest = new OnlineTest({
            position,
            type,
            description,
            content,
            notes,
            completed,
            testDate
        });

        const onlineTest = await newOnlineTest.save();
        res.json(onlineTest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/onlinetests/:id
// @desc    更新网测
// @access  Public
router.put('/:id', async(req, res) => {
    const { type, description, content, notes, completed, testDate } = req.body;

    // 构建网测对象
    const onlineTestFields = {};
    if (type) onlineTestFields.type = type;
    if (description) onlineTestFields.description = description;
    if (content !== undefined) onlineTestFields.content = content;
    if (notes !== undefined) onlineTestFields.notes = notes;
    if (completed !== undefined) onlineTestFields.completed = completed;
    if (testDate) onlineTestFields.testDate = testDate;
    onlineTestFields.updatedAt = Date.now();

    try {
        let onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) return res.status(404).json({ msg: '网测不存在' });

        onlineTest = await OnlineTest.findByIdAndUpdate(
            req.params.id, { $set: onlineTestFields }, { new: true }
        );

        res.json(onlineTest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/onlinetests/:id
// @desc    删除网测
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) return res.status(404).json({ msg: '网测不存在' });

        await OnlineTest.findByIdAndRemove(req.params.id);

        res.json({ msg: '网测已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;