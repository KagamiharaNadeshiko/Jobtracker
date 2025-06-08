const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Industry = require('../models/Industry');

// @route   GET api/industries
// @desc    Get all industries for a user
// @access  Private
router.get('/', auth, async(req, res) => {
    try {
        const industries = await Industry.find({ createdBy: req.user.id }).sort({ date: -1 });
        res.json(industries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/industries
// @desc    Create an industry
// @access  Private
router.post(
    '/', [
        auth, [
            check('name', 'Name is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        try {
            const newIndustry = new Industry({
                name,
                description,
                createdBy: req.user.id
            });

            const industry = await newIndustry.save();

            res.json(industry);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/industries/:id
// @desc    Update industry
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const { name, description } = req.body;

    // Build industry object
    const industryFields = {};
    if (name) industryFields.name = name;
    if (description) industryFields.description = description;

    try {
        let industry = await Industry.findById(req.params.id);

        if (!industry) return res.status(404).json({ msg: 'Industry not found' });

        // Make sure user owns industry
        if (industry.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        industry = await Industry.findByIdAndUpdate(
            req.params.id, { $set: industryFields }, { new: true }
        );

        res.json(industry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/industries/:id
// @desc    Delete industry
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let industry = await Industry.findById(req.params.id);

        if (!industry) return res.status(404).json({ msg: 'Industry not found' });

        // Make sure user owns industry
        if (industry.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Industry.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Industry removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;