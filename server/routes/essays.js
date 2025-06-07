const express = require('express');
const router = express.Router();
const Essay = require('../models/Essay');

// @route   GET api/essays/position/:positionId
// @desc    获取特定职位的所有文书
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        const essays = await Essay.find({ position: req.params.positionId }).sort({ createdAt: -1 });
        res.json(essays);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/essays/:id
// @desc    获取单个文书
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);

        if (!essay) {
            return res.status(404).json({ msg: '文书不存在' });
        }

        res.json(essay);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '文书不存在' });
        }
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/essays
// @desc    创建新文书
// @access  Public
router.post('/', async(req, res) => {
    const { position, question, answer } = req.body;

    try {
        const newEssay = new Essay({
            position,
            question,
            answer
        });

        const essay = await newEssay.save();
        res.json(essay);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/essays/:id
// @desc    更新文书
// @access  Public
router.put('/:id', async(req, res) => {
    const { question, answer } = req.body;

    // 构建文书对象
    const essayFields = {};
    if (question) essayFields.question = question;
    if (answer) essayFields.answer = answer;
    essayFields.updatedAt = Date.now();

    try {
        let essay = await Essay.findById(req.params.id);

        if (!essay) return res.status(404).json({ msg: '文书不存在' });

        essay = await Essay.findByIdAndUpdate(
            req.params.id, { $set: essayFields }, { new: true }
        );

        res.json(essay);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/essays/:id
// @desc    删除文书
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);

        if (!essay) return res.status(404).json({ msg: '文书不存在' });

        await Essay.findByIdAndRemove(req.params.id);

        res.json({ msg: '文书已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;