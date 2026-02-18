const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/:id/export-cv
// @desc    Export user CV as PDF
// @access  Private
router.get('/:id/export-cv', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lang = 'EN' } = req.query;

        // Fetch user data
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Translation object
        const translations = {
            EN: {
                cv: 'Curriculum Vitae',
                personalInfo: 'Personal Information',
                contactInfo: 'Contact Information',
                professionalInfo: 'Professional Information',
                education: 'Education',
                social: 'Social Media',
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                location: 'Location',
                supnumId: 'SupNum ID',
                role: 'Role',
                jobTitle: 'Job Title',
                company: 'Company',
                workStatus: 'Work Status',
                bio: 'About Me',
                linkedin: 'LinkedIn',
                github: 'GitHub',
                facebook: 'Facebook',
                student: 'Student',
                graduate: 'Graduate',
                admin: 'Administrator'
            },
            FR: {
                cv: 'Curriculum Vitae',
                personalInfo: 'Informations Personnelles',
                contactInfo: 'Coordonnées',
                professionalInfo: 'Informations Professionnelles',
                education: 'Formation',
                social: 'Réseaux Sociaux',
                name: 'Nom',
                email: 'Email',
                phone: 'Téléphone',
                location: 'Localisation',
                supnumId: 'ID SupNum',
                role: 'Rôle',
                jobTitle: 'Poste',
                company: 'Entreprise',
                workStatus: 'Statut Professionnel',
                bio: 'À Propos',
                linkedin: 'LinkedIn',
                github: 'GitHub',
                facebook: 'Facebook',
                student: 'Étudiant',
                graduate: 'Diplômé',
                admin: 'Administrateur'
            },
            AR: {
                cv: 'السيرة الذاتية',
                personalInfo: 'المعلومات الشخصية',
                contactInfo: 'معلومات الاتصال',
                professionalInfo: 'المعلومات المهنية',
                education: 'التعليم',
                social: 'وسائل التواصل الاجتماعي',
                name: 'الاسم',
                email: 'البريد الإلكتروني',
                phone: 'الهاتف',
                location: 'الموقع',
                supnumId: 'معرف SupNum',
                role: 'الدور',
                jobTitle: 'المسمى الوظيفي',
                company: 'الشركة',
                workStatus: 'حالة العمل',
                bio: 'نبذة عني',
                linkedin: 'لينكد إن',
                github: 'جيت هاب',
                facebook: 'فيسبوك',
                student: 'طالب',
                graduate: 'خريج',
                admin: 'مسؤول'
            }
        };

        const t = translations[lang] || translations.EN;

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s+/g, '_')}_CV.pdf`);

        doc.pipe(res);

        // Header
        doc.rect(0, 0, doc.page.width, 120).fill('#1e40af');
        doc.fillColor('white')
            .fontSize(28)
            .font('Helvetica-Bold')
            .text(user.name, 50, 40);

        doc.fontSize(14)
            .font('Helvetica')
            .text(t[user.role.toLowerCase()] || user.role, 50, 75);

        doc.fontSize(10)
            .text(user.supnumId, 50, 95);

        doc.fillColor('#000000');
        let currentY = 150;

        // About / Bio Section
        if (user.bio) {
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text(t.bio, 50, currentY);

            currentY += 25;
            doc.fontSize(11)
                .font('Helvetica')
                .fillColor('#374151')
                .text(user.bio, 50, currentY, { width: doc.page.width - 100, align: 'justify' });

            currentY = doc.y + 20;
        }

        // Contact Information
        doc.fontSize(16)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text(t.contactInfo, 50, currentY);

        currentY += 25;

        const contactInfo = [
            { label: t.email, value: user.email },
            { label: t.phone, value: user.phone || 'N/A' },
            { label: t.location, value: user.location || 'Nouakchott, Mauritania' }
        ];

        contactInfo.forEach(item => {
            doc.fontSize(11)
                .font('Helvetica-Bold')
                .fillColor('#1e40af')
                .text(`${item.label}: `, 50, currentY, { continued: true })
                .font('Helvetica')
                .fillColor('#374151')
                .text(item.value);
            currentY += 20;
        });

        currentY += 10;

        // Professional Information
        if (user.jobTitle || user.company || user.workStatus) {
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text(t.professionalInfo, 50, currentY);

            currentY += 25;

            if (user.jobTitle) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.jobTitle}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#374151')
                    .text(user.jobTitle);
                currentY += 20;
            }

            if (user.company) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.company}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#374151')
                    .text(user.company);
                currentY += 20;
            }

            if (user.workStatus) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.workStatus}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#374151')
                    .text(user.workStatus);
                currentY += 20;
            }

            currentY += 10;
        }

        // Social Media
        if (user.socialLinkedin || user.socialGithub || user.socialFacebook) {
            doc.fontSize(16)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text(t.social, 50, currentY);

            currentY += 25;

            if (user.socialLinkedin) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.linkedin}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#0077b5')
                    .text(user.socialLinkedin, { link: user.socialLinkedin, underline: true });
                currentY += 20;
            }

            if (user.socialGithub) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.github}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#374151')
                    .text(user.socialGithub, { link: user.socialGithub, underline: true });
                currentY += 20;
            }

            if (user.socialFacebook) {
                doc.fontSize(11)
                    .font('Helvetica-Bold')
                    .fillColor('#1e40af')
                    .text(`${t.facebook}: `, 50, currentY, { continued: true })
                    .font('Helvetica')
                    .fillColor('#1877F2')
                    .text(user.socialFacebook, { link: user.socialFacebook, underline: true });
                currentY += 20;
            }
        }

        // Footer
        doc.fontSize(8)
            .fillColor('#94a3b8')
            .text(
                `Generated from SupNum Connect on ${new Date().toLocaleDateString()}`,
                50,
                doc.page.height - 50,
                { align: 'center', width: doc.page.width - 100 }
            );

        doc.end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
