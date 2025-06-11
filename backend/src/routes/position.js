const express = require('express');
const router = express.Router();
const { Position, Company, Industry, Interview } = require('../models');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new position
router.post('/', async(req, res) => {
    try {
        const {
            company_id,
            title,
            applied_date,
            es_text,
            test_deadline,
            test_type,
            test_progress
        } = req.body;

        if (!company_id || !title) {
            return res.status(400).json({ message: 'Company ID and title are required' });
        }

        // Verify company belongs to user's industry
        const company = await Company.findOne({
            where: { id: company_id },
            include: {
                model: Industry,
                as: 'industry',
                where: { user_id: req.user.id }
            }
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found or access denied' });
        }

        const position = await Position.create({
            company_id,
            title,
            applied_date,
            es_text: es_text || [],
            test_deadline,
            test_type,
            test_progress
        });

        res.status(201).json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get position by ID
router.get('/:id', async(req, res) => {
    try {
        const position = await Position.findOne({
            where: { id: req.params.id },
            include: [{
                model: Company,
                as: 'company',
                include: {
                    model: Industry,
                    as: 'industry',
                    where: { user_id: req.user.id } // Ensure position belongs to user's industry
                }
            }]
        });

        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }

        res.json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update position
router.put('/:id', async(req, res) => {
    try {
        const {
            title,
            applied_date,
            es_text,
            test_deadline,
            test_type,
            test_progress
        } = req.body;

        // Verify position belongs to user
        const position = await Position.findOne({
            where: { id: req.params.id },
            include: {
                model: Company,
                as: 'company',
                include: {
                    model: Industry,
                    as: 'industry',
                    where: { user_id: req.user.id }
                }
            }
        });

        if (!position) {
            return res.status(404).json({ message: 'Position not found or access denied' });
        }

        // Update fields
        if (title !== undefined) position.title = title;
        if (applied_date !== undefined) position.applied_date = applied_date;
        if (es_text !== undefined) position.es_text = es_text;
        if (test_deadline !== undefined) position.test_deadline = test_deadline;
        if (test_type !== undefined) position.test_type = test_type;
        if (test_progress !== undefined) position.test_progress = test_progress;

        await position.save();

        res.json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete position
router.delete('/:id', async(req, res) => {
    try {
        // Verify position belongs to user
        const position = await Position.findOne({
            where: { id: req.params.id },
            include: {
                model: Company,
                as: 'company',
                include: {
                    model: Industry,
                    as: 'industry',
                    where: { user_id: req.user.id }
                }
            }
        });

        if (!position) {
            return res.status(404).json({ message: 'Position not found or access denied' });
        }

        await position.destroy();

        res.json({ message: 'Position deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all interviews for a position
router.get('/:pid/interviews', async(req, res) => {
    try {
        // Verify position belongs to user
        const position = await Position.findOne({
            where: { id: req.params.pid },
            include: {
                model: Company,
                as: 'company',
                include: {
                    model: Industry,
                    as: 'industry',
                    where: { user_id: req.user.id }
                }
            }
        });

        if (!position) {
            return res.status(404).json({ message: 'Position not found or access denied' });
        }

        const interviews = await Interview.findAll({
            where: { position_id: req.params.pid },
            order: [
                ['round', 'ASC']
            ]
        });

        res.json(interviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;