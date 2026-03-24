const express = require('express');
const router = express.Router();
const { Internship, User } = require('../models');
const { protect, admin, optionalProtect } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get('/', optionalProtect, async (req, res, next) => {
    try {
        const { type, search, active, audience } = req.query;
        let where = {};

        // Visibility logic
        if (req.user) {
            if (req.user.role === 'student') {
                where.targetAudience = { [Op.in]: ['All', 'Students'] };
                where.active = true; // Students only see active ones
            } else if (req.user.role === 'graduate') {
                where.targetAudience = { [Op.in]: ['All', 'Graduates'] };
                where.active = true; // Graduates only see active ones
            } else if ((req.user.role === 'company' || req.user.role === 'graduate') && req.query.myOffers === 'true') {
                where.createdById = req.user.id;
            }
            // Admins see all by default
        } else {
            // Public view only see 'All' targeted and active
            where.targetAudience = 'All';
            where.active = true;
        }

        // Override if explicit audience filter is used (e.g. by admin)
        if (audience && (req.user?.role === 'admin' || !req.user)) {
            where.targetAudience = audience;
        }

        if (type) {
            where.type = type;
        }

        if (active !== undefined && (req.user?.role === 'admin' || req.user?.role === 'company')) {
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
router.get('/:id', optionalProtect, async (req, res, next) => {
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
// @desc    Create internship
// @access  Private (Admin or Company)
router.post('/', protect, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'company' && req.user.role !== 'graduate') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const {
            title, company, type, location, description,
            active, customQuestions, requireCv, requireMessage,
            requirePhone, targetAudience, startDate, endDate, workplaceType
        } = req.body;

        if (req.user.role === 'graduate' && (!req.user.jobTitle || !req.user.company)) {
            return res.status(403).json({ message: 'Vous devez renseigner votre poste et votre entreprise dans votre profil pour publier une offre.' });
        }

        const currentUser = req.user;
        let internshipCompany = company;

        if (currentUser.role === 'graduate') {
            if (!currentUser.company) {
                return res.status(403).json({ message: 'Vous devez renseigner votre entreprise dans votre profil avant de publier une offre.' });
            }
            internshipCompany = currentUser.company; // Enforce profile company
        } else if (currentUser.role === 'company') {
            internshipCompany = currentUser.company || currentUser.name;
        }

        const internship = await Internship.create({
            title,
            company: internshipCompany,
            type,
            location,
            description,
            active,
            customQuestions,
            requireCv,
            requireMessage,
            requirePhone,
            targetAudience,
            startDate,
            endDate,
            workplaceType,
            createdById: req.user.id
        });

        res.status(201).json({ internship });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/internships/:id
// @desc    Update internship
// @access  Private (Admin or Company owner)
router.put('/:id', protect, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Ownership check
        if ((req.user.role === 'company' || req.user.role === 'graduate') && internship.createdById != req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this internship' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'company' && req.user.role !== 'graduate') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        let internshipCompany = req.body.company;
        if (req.user.role === 'graduate') {
            internshipCompany = req.user.company;
        } else if (req.user.role === 'company') {
            internshipCompany = req.user.company || req.user.name;
        }

        await internship.update({ ...req.body, company: internshipCompany });

        res.json({ internship });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship
// @access  Private (Admin or Company owner)
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Ownership check
        if ((req.user.role === 'company' || req.user.role === 'graduate') && internship.createdById != req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this internship' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'company' && req.user.role !== 'graduate') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await internship.destroy();
        res.json({ message: 'Internship deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/internships/:id/toggle
// @desc    Toggle internship active status
// @access  Private (Admin or Company owner)
router.patch('/:id/toggle', protect, async (req, res, next) => {
    try {
        const internship = await Internship.findByPk(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Ownership check
        if ((req.user.role === 'company' || req.user.role === 'graduate') && internship.createdById != req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'company' && req.user.role !== 'graduate') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await internship.update({ active: !internship.active });

        res.json({ internship });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
