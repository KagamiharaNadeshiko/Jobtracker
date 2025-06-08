const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Company = require('../models/Company');
const Industry = require('../models/Industry');

// @route   GET api/companies
// @desc    Get all companies for a user
// @access  Private
router.get('/', auth, async(req, res) => {
    try {
        const companies = await Company.find({ createdBy: req.user.id })
            .populate('industry', 'name')
            .sort({ date: -1 });
        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/companies/industry/:industryId
// @desc    Get all companies for a specific industry
// @access  Private
router.get('/industry/:industryId', auth, async(req, res) => {
    try {
        const industry = await Industry.findById(req.params.industryId);

        if (!industry) {
            return res.status(404).json({ msg: 'Industry not found' });
        }

        // Make sure user owns industry
        if (industry.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const companies = await Company.find({
            industry: req.params.industryId,
            createdBy: req.user.id
        }).sort({ date: -1 });

        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/companies
// @desc    Create a company
// @access  Private
router.post(
    '/', [
        auth, [
            check('name', 'Name is required').not().isEmpty(),
            check('industry', 'Industry is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, industry, description, location, website } = req.body;

        try {
            // Check if industry exists and belongs to user
            const industryObj = await Industry.findById(industry);

            if (!industryObj) {
                return res.status(404).json({ msg: 'Industry not found' });
            }

            if (industryObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this industry' });
            }

            const newCompany = new Company({
                name,
                industry,
                description,
                location,
                website,
                createdBy: req.user.id
            });

            const company = await newCompany.save();

            res.json(company);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/companies/:id
// @desc    Update company
// @access  Private
router.put('/:id', auth, async(req, res) => {
    const { name, industry, description, location, website } = req.body;

    // Build company object
    const companyFields = {};
    if (name) companyFields.name = name;
    if (industry) companyFields.industry = industry;
    if (description) companyFields.description = description;
    if (location) companyFields.location = location;
    if (website) companyFields.website = website;

    try {
        let company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: 'Company not found' });

        // Make sure user owns company
        if (company.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // If industry is being updated, check if it belongs to user
        if (industry && industry !== company.industry.toString()) {
            const industryObj = await Industry.findById(industry);

            if (!industryObj) {
                return res.status(404).json({ msg: 'Industry not found' });
            }

            if (industryObj.createdBy.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized to use this industry' });
            }
        }

        company = await Company.findByIdAndUpdate(
            req.params.id, { $set: companyFields }, { new: true }
        );

        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/companies/:id
// @desc    Delete company
// @access  Private
router.delete('/:id', auth, async(req, res) => {
    try {
        let company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: 'Company not found' });

        // Make sure user owns company
        if (company.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Company.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Company removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;