const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const OnlineTest = require('../models/OnlineTest');
const Position = require('../models/Position');

// @route   GET api/online-tests/position/:positionId
// @desc    Get all online tests for a position
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

        const onlineTests = await OnlineTest.find({
            position: req.params.positionId,
            createdBy: req.user.id
        }).sort({ date: -1 });

        res.json(onlineTests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/online-tests/:id
// @desc    Get online test by ID
// @access  Private
router.get('/:id', auth, async(req, res) => {
    try {
        const onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) {
            return res.status(404).json({ msg: 'Online test not found' });
        }

        // Make sure user owns online test
        if (onlineTest.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(onlineTest);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Online test not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/online-tests
// @desc    Create an online test
// @access  Private
router.post(
    '/', [
        auth, [
            check('position', 'Position is required').not().isEmpty(),
            check('type', 'Type is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { position, type, description, content, notes, completed } = req.body;

        try {
            // Check if position exists and belongs to user
            const positionObj = await Position.findById(position);

            if (!positionObj) {
                return res.status(404).json({ msg: 'Position not found' });
            }

            if (positionObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this position' });
            }

            const newOnlineTest = new OnlineTest({
                position,
                type,
                description,
                content,
                notes,
                completed,
                createdBy: req.user.id
            });

            const onlineTest = await newOnlineTest.save();

            res.json(onlineTest);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/online-tests/:id
// @desc    Update online test
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const { type, description, content, notes, completed } = req.body;

    // Build online test object
    const onlineTestFields = {};
    if (type) onlineTestFields.type = type;
    if (description !== undefined) onlineTestFields.description = description;
    if (content !== undefined) onlineTestFields.content = content;
    if (notes !== undefined) onlineTestFields.notes = notes;
    if (completed !== undefined) onlineTestFields.completed = completed;

    try {
        let onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) return res.status(404).json({ msg: 'Online test not found' });

        // Make sure user owns online test
        if (onlineTest.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        onlineTest = await OnlineTest.findByIdAndUpdate(
            req.params.id, { $set: onlineTestFields }, { new: true }
        );

        res.json(onlineTest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/online-tests/:id
// @desc    Delete online test
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let onlineTest = await OnlineTest.findById(req.params.id);

        if (!onlineTest) return res.status(404).json({ msg: 'Online test not found' });

        // Make sure user owns online test
        if (onlineTest.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await OnlineTest.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Online test removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;