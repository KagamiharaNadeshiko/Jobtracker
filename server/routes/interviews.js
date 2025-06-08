const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Interview = require('../models/Interview');
const Position = require('../models/Position');

// @route   GET api/interviews/position/:positionId
// @desc    Get all interviews for a position
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

        const interviews = await Interview.find({
            position: req.params.positionId,
            createdBy: req.user.id
        }).sort({ date: -1 });

        res.json(interviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/interviews/:id
// @desc    Get interview by ID
// @access  Private
router.get('/:id', auth, async(req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ msg: 'Interview not found' });
        }

        // Make sure user owns interview
        if (interview.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(interview);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Interview not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/interviews
// @desc    Create an interview
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

        const {
            position,
            round,
            type,
            date,
            location,
            questions,
            notes,
            result
        } = req.body;

        try {
            // Check if position exists and belongs to user
            const positionObj = await Position.findById(position);

            if (!positionObj) {
                return res.status(404).json({ msg: 'Position not found' });
            }

            if (positionObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this position' });
            }

            const newInterview = new Interview({
                position,
                round: round || 1,
                type,
                date,
                location,
                questions,
                notes,
                result,
                createdBy: req.user.id
            });

            const interview = await newInterview.save();

            res.json(interview);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/interviews/:id
// @desc    Update interview
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const {
        round,
        type,
        date,
        location,
        questions,
        notes,
        result
    } = req.body;

    // Build interview object
    const interviewFields = {};
    if (round) interviewFields.round = round;
    if (type) interviewFields.type = type;
    if (date) interviewFields.date = date;
    if (location !== undefined) interviewFields.location = location;
    if (questions) interviewFields.questions = questions;
    if (notes !== undefined) interviewFields.notes = notes;
    if (result) interviewFields.result = result;

    try {
        let interview = await Interview.findById(req.params.id);

        if (!interview) return res.status(404).json({ msg: 'Interview not found' });

        // Make sure user owns interview
        if (interview.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        interview = await Interview.findByIdAndUpdate(
            req.params.id, { $set: interviewFields }, { new: true }
        );

        res.json(interview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/interviews/:id
// @desc    Delete interview
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let interview = await Interview.findById(req.params.id);

        if (!interview) return res.status(404).json({ msg: 'Interview not found' });

        // Make sure user owns interview
        if (interview.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Interview.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Interview removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;