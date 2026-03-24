const express = require('express');
const router = express.Router();
const { Application, Internship, User, Notification } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { sendPushNotification } = require('../services/pushNotificationService');
const { Op } = require('sequelize');

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

        // Notifications logic
        const offerCreator = await User.findByPk(internship.createdById);
        const applicantUser = await User.findByPk(req.user.id);
        
        // Notify the creator (company or admin)
        if (offerCreator) {
            await Notification.create({
                userId: offerCreator.id,
                title: 'Nouvelle Candidature !',
                message: `${applicantUser?.name || 'Un utilisateur'} a postulé à l'offre: ${internship.title}`,
                type: 'application_new',
                link: (offerCreator.role === 'company' || offerCreator.role === 'graduate') ? '/dashboard/company/applications' : '/admin/applications'
            });
        }

        // Notify admins if it's a company/graduate offer to track activity
        if (offerCreator && (offerCreator.role === 'company' || offerCreator.role === 'graduate')) {
            const admins = await User.findAll({ where: { role: 'admin' } });
            const adminPromises = admins.map(adm => Notification.create({
                userId: adm.id,
                title: 'Candidature sur une offre d\'entreprise',
                message: `${applicantUser?.name || 'Un utilisateur'} a postulé à l'offre de ${offerCreator.name}: ${internship.title}`,
                type: 'system_alert',
                link: '/admin/applications'
            }));
            await Promise.all(adminPromises);
        }

        res.status(201).json({ application });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/applications
// @desc    Get all applications (admin or company owner)
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        let where = {};
        let stats = null;

        // If company or graduate, filter by their internships
        if (req.user.role === 'company' || req.user.role === 'graduate') {
            const myInternships = await Internship.findAll({
                where: { createdById: req.user.id },
                attributes: ['id']
            });
            const internshipIds = myInternships.map(i => i.id);
            where.internshipId = { [Op.in]: internshipIds };
        } else if (req.user.role === 'admin') {
            // Admin only sees candidatures for Admin created offers
            const adminUsers = await User.findAll({ where: { role: 'admin' }, attributes: ['id'] });
            const adminUserIds = adminUsers.map(u => u.id);
            const adminInternships = await Internship.findAll({
                where: { createdById: { [Op.in]: adminUserIds } },
                attributes: ['id']
            });
            const adminInternshipIds = adminInternships.map(i => i.id);
            
            // Allow admin to fetch all if explicitly requested? (Not needed yet, strictly separate as requested)
            // But we do need to avoid empty in-clause errors:
            where.internshipId = adminInternshipIds.length > 0 ? { [Op.in]: adminInternshipIds } : null;

            // Gather stats: How many candidatures sent to external company/graduate offers
            const externalCreators = await User.findAll({ 
                where: { role: { [Op.in]: ['company', 'graduate'] } }, 
                attributes: ['id'] 
            });
            const externalCreatorIds = externalCreators.map(u => u.id);
            
            let companyStats = 0;
            if (externalCreatorIds.length > 0) {
                const externalInternships = await Internship.findAll({
                    where: { createdById: { [Op.in]: externalCreatorIds } },
                    attributes: ['id']
                });
                const externalInternshipIds = externalInternships.map(i => i.id);
                
                if (externalInternshipIds.length > 0) {
                    companyStats = await Application.count({
                        where: { internshipId: { [Op.in]: externalInternshipIds } }
                    });
                }
            }
            stats = { totalCompanyApplications: companyStats };
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (where.internshipId === null) {
            return res.json({ applications: [], stats }); // Handle empty IN clause edge case
        }

        const applications = await Application.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['name', 'email', 'supnumId', 'role'] },
                { model: Internship, as: 'internship', attributes: ['title', 'company'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ applications, stats });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/applications/:id/status
// @desc    Update application status (admin or company owner)
// @access  Private
router.patch('/:id/status', protect, async (req, res, next) => {
    try {
        const { status } = req.body;
        const application = await Application.findByPk(req.params.id, {
            include: [{ model: Internship, as: 'internship' }]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ownership check for companies and graduates
        if (req.user.role === 'company' || req.user.role === 'graduate') {
            if (req.user.role === 'graduate' && (!req.user.jobTitle || !req.user.company)) {
                return res.status(403).json({ message: 'Not authorized: You must have a job to manage offers.' });
            }
            if (!application.internship || application.internship.createdById != req.user.id) {
                return res.status(403).json({ message: 'Not authorized to manage this candidate' });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await application.update({ status });

        // Fetch internship for title (already included above if company, but re-fetch for admin consistency if needed)
        const internship = application.internship || await Internship.findByPk(application.internshipId);

        // Create notification for the user
        await Notification.create({
            userId: application.userId,
            title: `Mise à jour de votre candidature: ${internship?.title}`,
            message: `Le statut de votre candidature est maintenant: ${status.toUpperCase()}`,
            type: 'application_update',
            link: '/dashboard'
        });

        // Send Push Notification
        await sendPushNotification(application.userId, {
            title: 'Mise à jour de Candidature 🚀',
            body: `Votre candidature pour "${internship?.title}" a été mise à jour vers: ${status.toUpperCase()}`,
            icon: '/icons/icon-192x192.png',
            data: { url: '/dashboard' }
        });

        res.json({ application });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application (admin or company owner)
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [{ model: Internship, as: 'internship' }]
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ownership check for companies and graduates
        if (req.user.role === 'company' || req.user.role === 'graduate') {
            if (!application.internship || application.internship.createdById != req.user.id) {
                return res.status(403).json({ message: 'Not authorized to delete this candidate' });
            }
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await application.destroy();
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
