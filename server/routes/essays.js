const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Essay = require('../models/Essay');
const Position = require('../models/Position');

// @route   GET api/essays/position/:positionId
// @desc    Get all essays for a position
// @access  Private
router.get('/position/:positionId', auth, async(req, res) => {
    try {
        const position = await Position.findById(req.params.positionId);

        if (!position) {
            return res.status(404).json({ msg: 'Position not found' });
        }

        // Make sure user owns position
        if (position.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const essays = await Essay.find({
            position: req.params.positionId,
            createdBy: req.user.id
        }).sort({ date: -1 });

        res.json(essays);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/essays/:id
// @desc    Get essay by ID
// @access  Private
router.get('/:id', auth, async(req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);

        if (!essay) {
            return res.status(404).json({ msg: 'Essay not found' });
        }

        // Make sure user owns essay
        if (essay.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(essay);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Essay not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/essays
// @desc    Create an essay
// @access  Private
router.post(
    '/', [
        auth, [
            check('position', 'Position is required').not().isEmpty(),
            check('question', 'Question is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { position, question, answer } = req.body;

        try {
            // Check if position exists and belongs to user
            const positionObj = await Position.findById(position);

            if (!positionObj) {
                return res.status(404).json({ msg: 'Position not found' });
            }

            if (positionObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this position' });
            }

            const newEssay = new Essay({
                position,
                question,
                answer,
                createdBy: req.user.id
            });

            const essay = await newEssay.save();

            res.json(essay);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/essays/:id
// @desc    Update essay
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const { question, answer } = req.body;

    // Build essay object
    const essayFields = {};
    if (question) essayFields.question = question;
    if (answer !== undefined) essayFields.answer = answer;

    try {
        let essay = await Essay.findById(req.params.id);

        if (!essay) return res.status(404).json({ msg: 'Essay not found' });

        // Make sure user owns essay
        if (essay.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        essay = await Essay.findByIdAndUpdate(
            req.params.id, { $set: essayFields }, { new: true }
        );

        res.json(essay);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/essays/:id
// @desc    Delete essay
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let essay = await Essay.findById(req.params.id);

        if (!essay) return res.status(404).json({ msg: 'Essay not found' });

        // Make sure user owns essay
        if (essay.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Essay.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Essay removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;