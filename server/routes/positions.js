const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Position = require('../models/Position');
const Company = require('../models/Company');

// @route   GET api/positions
// @desc    Get all positions for a user
// @access  Private
router.get('/', auth, async(req, res) => {
    try {
        const positions = await Position.find({ createdBy: req.user.id })
            .populate('company', ['name', 'location'])
            .sort({ date: -1 });
        res.json(positions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/positions/company/:companyId
// @desc    Get all positions for a specific company
// @access  Private
router.get('/company/:companyId', auth, async(req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);

        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        // Make sure user owns company
        if (company.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const positions = await Position.find({
            company: req.params.companyId,
            createdBy: req.user.id
        }).sort({ date: -1 });

        res.json(positions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/positions/:id
// @desc    Get position by ID
// @access  Private
router.get('/:id', auth, async(req, res) => {
    try {
        const position = await Position.findById(req.params.id)
            .populate('company', ['name', 'location', 'website']);

        if (!position) {
            return res.status(404).json({ msg: 'Position not found' });
        }

        // Make sure user owns position
        if (position.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(position);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Position not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/positions
// @desc    Create a position
// @access  Private
router.post(
    '/', [
        auth, [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            description,
            applicationType,
            testType,
            deadline,
            status
        } = req.body;

        try {
            // Check if company exists and belongs to user
            const companyObj = await Company.findById(company);

            if (!companyObj) {
                return res.status(404).json({ msg: 'Company not found' });
            }

            if (companyObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this company' });
            }

            const newPosition = new Position({
                title,
                company,
                description,
                applicationType,
                testType,
                deadline,
                status,
                createdBy: req.user.id
            });

            const position = await newPosition.save();

            res.json(position);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/positions/:id
// @desc    Update position
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const {
        title,
        company,
        description,
        applicationType,
        testType,
        deadline,
        status
    } = req.body;

    // Build position object
    const positionFields = {};
    if (title) positionFields.title = title;
    if (company) positionFields.company = company;
    if (description) positionFields.description = description;
    if (applicationType) positionFields.applicationType = applicationType;
    if (testType) positionFields.testType = testType;
    if (deadline) positionFields.deadline = deadline;
    if (status) positionFields.status = status;

    try {
        let position = await Position.findById(req.params.id);

        if (!position) return res.status(404).json({ msg: 'Position not found' });

        // Make sure user owns position
        if (position.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // If company is being updated, check if it belongs to user
        if (company && company !== position.company.toString()) {
            const companyObj = await Company.findById(company);

            if (!companyObj) {
                return res.status(404).json({ msg: 'Company not found' });
            }

            if (companyObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this company' });
            }
        }

        position = await Position.findByIdAndUpdate(
            req.params.id, { $set: positionFields }, { new: true }
        );

        res.json(position);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/positions/:id
// @desc    Delete position
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let position = await Position.findById(req.params.id);

        if (!position) return res.status(404).json({ msg: 'Position not found' });

        // Make sure user owns position
        if (position.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Position.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Position removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;