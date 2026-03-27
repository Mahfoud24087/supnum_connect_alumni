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

// @route   GET /api/applications/export/pdf
// @desc    Export accepted applications to PDF (company owner or admin)
// @access  Private
router.get('/export/pdf', protect, async (req, res, next) => {
    try {
        const { lang = 'EN', search, internshipId, startDate, endDate } = req.query;

        // Translation object (simplified based on ManageUsers.jsx)
        const translations = {
            EN: {
                title: 'SupNum Connect - Accepted Candidates',
                subtitle: 'Talent Acquisition Report',
                generated: 'Generated',
                filters: 'Filters',
                summary: 'Recruitment Summary',
                total: 'Total Placements',
                details: 'Candidate Details',
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                job: 'Position',
                date: 'Date Accepted',
                confidential: 'Confidential HR Report'
            },
            FR: {
                title: 'SupNum Connect - Candidats Acceptés',
                subtitle: 'Rapport d\'Acquisition de Talents',
                generated: 'Généré le',
                filters: 'Filtres',
                summary: 'Résumé de Recrutement',
                total: 'Total Placements',
                details: 'Détails des Candidats',
                name: 'Nom',
                email: 'E-mail',
                phone: 'Téléphone',
                job: 'Poste',
                date: 'Date d\'Acceptation',
                confidential: 'Rapport RH Confidentiel'
            },
            AR: {
                title: 'SupNum Connect - المرشحون المقبولون',
                subtitle: 'تقرير استقطاب المواهب',
                generated: 'تم الإنشاء في',
                filters: 'الفلاتر',
                summary: 'ملخص التوظيف',
                total: 'إجمالي التوظيف',
                details: 'تفاصيل المرشحين',
                name: 'الاسم',
                email: 'البريد الإلكتروني',
                phone: 'الهاتف',
                job: 'المنصب',
                date: 'تاريخ القبول',
                confidential: 'تقرير موارد بشرية سري'
            }
        };

        const t = translations[lang] || translations.EN;

        // Build filter conditions
        let where = { status: 'accepted' };

        // Ownership check
        if (req.user.role === 'company' || req.user.role === 'graduate') {
            const myInternships = await Internship.findAll({
                where: { createdById: req.user.id },
                attributes: ['id']
            });
            const ownIds = myInternships.map(i => i.id);
            where.internshipId = { [Op.in]: ownIds };
        } else if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Apply filters
        if (internshipId) where.internshipId = internshipId;
        if (startDate && endDate) {
            where.updatedAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }
        
        const joinWhere = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        const applications = await Application.findAll({
            where,
            include: [
                { model: User, as: 'user', where: joinWhere, attributes: ['name', 'email'] },
                { model: Internship, as: 'internship', attributes: ['title'] }
            ],
            order: [['updatedAt', 'DESC']]
        });

        const PDFDocument = require('pdfkit');
        // We use pdfkit-table if available for better tables, but since I'm using raw pdfkit in users.js, I'll stick to it for consistency.
        const doc = new PDFDocument({
            margin: 40,
            size: 'A4',
            bufferPages: true
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=accepted_candidates_report.pdf');
        doc.pipe(res);

        // --- Header ---
        doc.rect(0, 0, doc.page.width, 100).fill('#2563eb');
        doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text(t.title, 40, 30);
        doc.fontSize(12).font('Helvetica').text(t.subtitle, 40, 56);
        doc.fontSize(9).text(`${t.generated}: ${new Date().toLocaleDateString()}`, 40, 30, { align: 'right', width: doc.page.width - 80 });

        // --- Summary ---
        doc.fillColor('#000000').fontSize(16).font('Helvetica-Bold').text(t.summary, 40, 130);
        doc.rect(40, 160, 150, 70).fill('#dbeafe');
        doc.fillColor('#1e40af').fontSize(10).font('Helvetica').text(t.total, 50, 175);
        doc.fontSize(28).font('Helvetica-Bold').text(String(applications.length), 50, 195);

        // --- Detailed List ---
        doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text(t.details, 40, 260);
        
        let currentY = 290;
        const colWidths = [120, 130, 80, 120, 80];
        const headers = [t.name, t.email, t.phone, t.job, t.date];

        // Draw Table Header
        doc.rect(40, currentY, 515, 25).fill('#1e40af');
        let x = 45;
        doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
        headers.forEach((h, i) => {
            doc.text(h, x, currentY + 8, { width: colWidths[i] - 10 });
            x += colWidths[i];
        });

        currentY += 25;

        // Draw Rows
        applications.forEach((app, i) => {
            if (currentY > doc.page.height - 100) {
                doc.addPage();
                currentY = 40;
            }

            if (i % 2 === 1) doc.rect(40, currentY, 515, 20).fill('#f8fafc');
            
            doc.fillColor('#334155').fontSize(8).font('Helvetica');
            let rx = 45;
            doc.text(app.user?.name || '', rx, currentY + 6, { width: colWidths[0] - 10, truncate: true });
            rx += colWidths[0];
            doc.text(app.email || app.user?.email || '', rx, currentY + 6, { width: colWidths[1] - 10, truncate: true });
            rx += colWidths[1];
            doc.text(app.phone || 'N/A', rx, currentY + 6, { width: colWidths[2] - 10 });
            rx += colWidths[2];
            doc.text(app.internship?.title || '', rx, currentY + 6, { width: colWidths[3] - 10, truncate: true });
            rx += colWidths[3];
            doc.text(new Date(app.updatedAt).toLocaleDateString(), rx, currentY + 6, { width: colWidths[4] - 10 });

            currentY += 20;
        });

        doc.end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
