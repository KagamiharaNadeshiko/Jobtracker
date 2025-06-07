const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');

// @route   GET api/interviews/position/:positionId
// @desc    获取特定职位的所有面试
// @access  Public
router.get('/position/:positionId', async(req, res) => {
    try {
        const interviews = await Interview.find({ position: req.params.positionId }).sort({ round: 1 });
        res.json(interviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/interviews/:id
// @desc    获取单个面试
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ msg: '面试不存在' });
        }

        res.json(interview);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '面试不存在' });
        }
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/interviews
// @desc    创建新面试
// @access  Public
router.post('/', async(req, res) => {
    const {
        position,
        round,
        type,
        date,
        location,
        interviewers,
        questions,
        notes,
        feedback,
        result
    } = req.body;

    try {
        const newInterview = new Interview({
            position,
            round,
            type,
            date,
            location,
            interviewers,
            questions,
            notes,
            feedback,
            result
        });

        const interview = await newInterview.save();
        res.json(interview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/interviews/:id
// @desc    更新面试
// @access  Public
router.put('/:id', async(req, res) => {
    const {
        round,
        type,
        date,
        location,
        interviewers,
        questions,
        notes,
        feedback,
        result
    } = req.body;

    // 构建面试对象
    const interviewFields = {};
    if (round) interviewFields.round = round;
    if (type) interviewFields.type = type;
    if (date) interviewFields.date = date;
    if (location !== undefined) interviewFields.location = location;
    if (interviewers !== undefined) interviewFields.interviewers = interviewers;
    if (questions) interviewFields.questions = questions;
    if (notes !== undefined) interviewFields.notes = notes;
    if (feedback !== undefined) interviewFields.feedback = feedback;
    if (result) interviewFields.result = result;
    interviewFields.updatedAt = Date.now();

    try {
        let interview = await Interview.findById(req.params.id);

        if (!interview) return res.status(404).json({ msg: '面试不存在' });

        interview = await Interview.findByIdAndUpdate(
            req.params.id, { $set: interviewFields }, { new: true }
        );

        res.json(interview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/interviews/:id
// @desc    删除面试
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) return res.status(404).json({ msg: '面试不存在' });

        await Interview.findByIdAndRemove(req.params.id);

        res.json({ msg: '面试已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;