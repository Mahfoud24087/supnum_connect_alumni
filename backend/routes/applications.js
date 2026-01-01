const express = require('express');
const router = express.Router();
const { Application, Internship, User, Notification } = require('../models');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/applications
// @desc    Apply for an internship
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        const { internshipId, message, cvUrl, email, phone, customAnswers } = req.body;

        const internship = await Internship.findByPk(internshipId);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            where: {
                userId: req.user.id,
                internshipId
            }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this opportunity.' });
        }

        const application = await Application.create({
            userId: req.user.id,
            internshipId,
            message,
            cvUrl,
            email,
            phone,
            customAnswers
        });

        res.status(201).json({ application });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/applications
// @desc    Get all applications (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const applications = await Application.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name', 'email', 'supnumId', 'role'] },
                { model: Internship, as: 'internship', attributes: ['title', 'company'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ applications });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status (admin only)
// @access  Private/Admin
router.patch('/:id/status', protect, admin, async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await application.update({ status });

        // Fetch internship for title
        const internship = await Internship.findByPk(application.internshipId);

        // Create notification for the user
        await Notification.create({
            userId: application.userId,
            title: `Application Update: ${internship?.title}`,
            message: `Your application status has been updated to: ${status.toUpperCase()}`,
            type: 'application_update',
            link: '/dashboard' // Link back to dashboard/apps
        });

        res.json({ application });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
