const express = require('express');
const router = express.Router();
const { Company, Industry, Position } = require('../models');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new company
router.post('/', async(req, res) => {
    try {
        const { industry_id, name, description } = req.body;

        if (!industry_id || !name) {
            return res.status(400).json({ message: 'Industry ID and name are required' });
        }

        // Check if industry belongs to user
        const industry = await Industry.findOne({
            where: {
                id: industry_id,
                user_id: req.user.id
            }
        });

        if (!industry) {
            return res.status(404).json({ message: 'Industry not found' });
        }

        const company = await Company.create({
            industry_id,
            name,
            description
        });

        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get company by ID (with positions)
router.get('/:id', async(req, res) => {
    try {
        const company = await Company.findOne({
            where: { id: req.params.id },
            include: [{
                    model: Industry,
                    as: 'industry',
                    where: { user_id: req.user.id } // Ensure company belongs to user's industry
                },
                {
                    model: Position,
                    as: 'positions',
                    order: [
                        ['applied_date', 'DESC']
                    ]
                }
            ]
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update company
router.put('/:id', async(req, res) => {
    try {
        const { name, description } = req.body;

        // First get the company and check if it belongs to user's industry
        const company = await Company.findOne({
            where: { id: req.params.id },
            include: {
                model: Industry,
                as: 'industry',
                where: { user_id: req.user.id }
            }
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        company.name = name || company.name;
        company.description = description !== undefined ? description : company.description;
        await company.save();

        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete company
router.delete('/:id', async(req, res) => {
    try {
        // First get the company and check if it belongs to user's industry
        const company = await Company.findOne({
            where: { id: req.params.id },
            include: {
                model: Industry,
                as: 'industry',
                where: { user_id: req.user.id }
            }
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        await company.destroy();

        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get positions in a company
router.get('/:cid/positions', async(req, res) => {
    try {
        // Check if company belongs to user
        const company = await Company.findOne({
            where: { id: req.params.cid },
            include: {
                model: Industry,
                as: 'industry',
                where: { user_id: req.user.id }
            }
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const positions = await Position.findAll({
            where: { company_id: req.params.cid },
            order: [
                ['applied_date', 'DESC']
            ]
        });

        res.json(positions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;