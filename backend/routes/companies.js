const express = require('express');
const router = express.Router();
const { Company } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { industry: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const companies = await Company.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json({ companies });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json({ company });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/companies
// @desc    Create company (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const { name, industry, location, website, logo, description } = req.body;

        const company = await Company.create({
            name,
            industry,
            location,
            website,
            logo,
            description
        });

        res.status(201).json({ company });
    } catch (error) {
        console.error('❌ Error creating company:', error);
        next(error);
    }
});

// @route   PUT /api/companies/:id
// @desc    Update company (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
    try {
        const company = await Company.findByPk(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        await company.update(req.body);

        res.json({ company });
    } catch (error) {
        console.error('❌ Error updating company:', error);
        next(error);
    }
});

// @route   DELETE /api/companies/:id
// @desc    Delete company (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        await company.destroy();
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
