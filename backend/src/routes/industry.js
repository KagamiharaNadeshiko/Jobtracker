const express = require('express');
const router = express.Router();
const { Industry, Company } = require('../models');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all industries for current user
router.get('/', async(req, res) => {
    try {
        const industries = await Industry.findAll({
            where: { user_id: req.user.id },
            order: [
                ['name', 'ASC']
            ]
        });

        res.json(industries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new industry
router.post('/', async(req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Industry name is required' });
        }

        const industry = await Industry.create({
            user_id: req.user.id,
            name
        });

        res.status(201).json(industry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get industry by ID (with companies)
router.get('/:id', async(req, res) => {
    try {
        const industry = await Industry.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: {
                model: Company,
                as: 'companies',
                order: [
                    ['name', 'ASC']
                ]
            }
        });

        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        res.json(industry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update industry
router.put('/:id', async(req, res) => {
    try {
        const { name } = req.body;

        const industry = await Industry.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        industry.name = name || industry.name;
        await industry.save();

        res.json(industry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete industry
router.delete('/:id', async(req, res) => {
    try {
        const result = await Industry.destroy({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!result) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        res.json({ message: 'Industry deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get companies in an industry
router.get('/:iid/companies', async(req, res) => {
    try {
        const industry = await Industry.findOne({
            where: {
                id: req.params.iid,
                user_id: req.user.id
            }
        });

        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        const companies = await Company.findAll({
            where: { industry_id: req.params.iid },
            order: [
                ['name', 'ASC']
            ]
        });

        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;