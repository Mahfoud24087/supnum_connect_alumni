const express = require('express');
const router = express.Router();
const { Internship, User } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { type, search, active } = req.query;
        let where = {};

        if (type) {
            where.type = type;
        }

        if (active !== undefined) {
            where.active = active === 'true';
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { company: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const internships = await Internship.findAll({
            where,
            include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ internships });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/internships/:id
// @desc    Get internship by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id, {
            include: [{ model: User, as: 'createdBy', attributes: ['name'] }]
        });
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        res.json({ internship });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/internships
// @desc    Create internship (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const { title, company, type, location, description, active, customQuestions, requireCv, requireMessage, requirePhone } = req.body;

        const internship = await Internship.create({
            title,
            company,
            type,
            location,
            description,
            active,
            customQuestions,
            requireCv,
            requireMessage,
            requirePhone,
            createdById: req.user.id
        });

        res.status(201).json({ internship });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/internships/:id
// @desc    Update internship (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        await internship.update(req.body);

        res.json({ internship });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        await internship.destroy();
        res.json({ message: 'Internship deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/internships/:id/toggle
// @desc    Toggle internship active status
// @access  Private/Admin
router.patch('/:id/toggle', protect, admin, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        await internship.update({ active: !internship.active });

        res.json({ internship });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
