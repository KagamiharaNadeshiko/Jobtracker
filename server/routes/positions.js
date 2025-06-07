const express = require('express');
const router = express.Router();
const Position = require('../models/Position');

// @route   GET api/positions
// @desc    获取所有职位
// @access  Public
router.get('/', async(req, res) => {
    try {
        const positions = await Position.find()
            .populate({
                path: 'company',
                select: 'name',
                populate: { path: 'industry', select: 'name' }
            })
            .sort({ createdAt: -1 });
        res.json(positions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/positions/company/:companyId
// @desc    按公司获取职位
// @access  Public
router.get('/company/:companyId', async(req, res) => {
    try {
        const positions = await Position.find({ company: req.params.companyId })
            .populate({
                path: 'company',
                select: 'name',
                populate: { path: 'industry', select: 'name' }
            })
            .sort({ createdAt: -1 });
        res.json(positions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   GET api/positions/:id
// @desc    获取单个职位
// @access  Public
router.get('/:id', async(req, res) => {
    try {
        const position = await Position.findById(req.params.id)
            .populate({
                path: 'company',
                select: 'name',
                populate: { path: 'industry', select: 'name' }
            });

        if (!position) {
            return res.status(404).json({ msg: '职位不存在' });
        }

        res.json(position);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '职位不存在' });
        }
        res.status(500).send('服务器错误');
    }
});

// @route   POST api/positions
// @desc    创建新职位
// @access  Public
router.post('/', async(req, res) => {
    const {
        title,
        company,
        description,
        status,
        resumeDeadline,
        onlineTestDeadline,
        notes
    } = req.body;

    try {
        const newPosition = new Position({
            title,
            company,
            description,
            status,
            resumeDeadline,
            onlineTestDeadline,
            notes
        });

        const position = await newPosition.save();

        // 返回填充了公司和行业信息的职位
        const populatedPosition = await Position.findById(position._id)
            .populate({
                path: 'company',
                select: 'name',
                populate: { path: 'industry', select: 'name' }
            });

        res.json(populatedPosition);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   PUT api/positions/:id
// @desc    更新职位
// @access  Public
router.put('/:id', async(req, res) => {
    const {
        title,
        company,
        description,
        status,
        resumeDeadline,
        onlineTestDeadline,
        notes
    } = req.body;

    // 构建职位对象
    const positionFields = {};
    if (title) positionFields.title = title;
    if (company) positionFields.company = company;
    if (description) positionFields.description = description;
    if (status) positionFields.status = status;
    if (resumeDeadline) positionFields.resumeDeadline = resumeDeadline;
    if (onlineTestDeadline) positionFields.onlineTestDeadline = onlineTestDeadline;
    if (notes) positionFields.notes = notes;
    positionFields.updatedAt = Date.now();

    try {
        let position = await Position.findById(req.params.id);

        if (!position) return res.status(404).json({ msg: '职位不存在' });

        position = await Position.findByIdAndUpdate(
            req.params.id, { $set: positionFields }, { new: true }
        ).populate({
            path: 'company',
            select: 'name',
            populate: { path: 'industry', select: 'name' }
        });

        res.json(position);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

// @route   DELETE api/positions/:id
// @desc    删除职位
// @access  Public
router.delete('/:id', async(req, res) => {
    try {
        const position = await Position.findById(req.params.id);

        if (!position) return res.status(404).json({ msg: '职位不存在' });

        await Position.findByIdAndRemove(req.params.id);

        res.json({ msg: '职位已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
});

module.exports = router;