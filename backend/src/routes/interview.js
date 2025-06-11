const express = require('express');
const router = express.Router();
const { Interview, Position, Company, Industry } = require('../models');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new interview
router.post('/', async(req, res) => {
    try {
        const { position_id, round, date, interviewer, notes, result } = req.body;

        if (!position_id) {
            return res.status(400).json({ message: 'Position ID is required' });
        }

        // Verify position belongs to user
        const position = await Position.findOne({
            where: { id: position_id },
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

        // Get highest round number for this position
        let maxRound = 1;
        const lastInterview = await Interview.findOne({
            where: { position_id },
            order: [
                ['round', 'DESC']
            ]
        });

        if (lastInterview) {
            maxRound = lastInterview.round + 1;
        }

        const interview = await Interview.create({
            position_id,
            round: round || maxRound,
            date,
            interviewer,
            notes,
            result
        });

        res.status(201).json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get interview by ID
router.get('/:id', async(req, res) => {
    try {
        const interview = await Interview.findOne({
            where: { id: req.params.id },
            include: {
                model: Position,
                as: 'position',
                include: {
                    model: Company,
                    as: 'company',
                    include: {
                        model: Industry,
                        as: 'industry',
                        where: { user_id: req.user.id }
                    }
                }
            }
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        res.json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update interview
router.put('/:id', async(req, res) => {
    try {
        const { date, interviewer, notes, result, round } = req.body;

        // Verify interview belongs to user
        const interview = await Interview.findOne({
            where: { id: req.params.id },
            include: {
                model: Position,
                as: 'position',
                include: {
                    model: Company,
                    as: 'company',
                    include: {
                        model: Industry,
                        as: 'industry',
                        where: { user_id: req.user.id }
                    }
                }
            }
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        // Update fields
        if (date !== undefined) interview.date = date;
        if (interviewer !== undefined) interview.interviewer = interviewer;
        if (notes !== undefined) interview.notes = notes;
        if (result !== undefined) interview.result = result;
        if (round !== undefined) interview.round = round;

        await interview.save();

        res.json(interview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete interview
router.delete('/:id', async(req, res) => {
    try {
        // Verify interview belongs to user
        const interview = await Interview.findOne({
            where: { id: req.params.id },
            include: {
                model: Position,
                as: 'position',
                include: {
                    model: Company,
                    as: 'company',
                    include: {
                        model: Industry,
                        as: 'industry',
                        where: { user_id: req.user.id }
                    }
                }
            }
        });

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found or access denied' });
        }

        await interview.destroy();

        res.json({ message: 'Interview deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;