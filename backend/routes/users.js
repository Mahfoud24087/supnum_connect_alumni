const express = require('express');
const router = express.Router();
const { User, Connection, Event, Company, Internship, Application, Message, Notification, Post, Comment, sequelize } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { Op, fn, col } = require('sequelize');

// @route   GET /api/users/public/stats
// @desc    Get public statistics for landing page
// @access  Public (Optional Auth)
const { optionalProtect } = require('../middleware/auth');
router.get('/public/stats', optionalProtect, async (req, res, next) => {
    try {
        const totalUsers = await User.count({
            where: {
                status: 'Verified',
                role: { [Op.ne]: 'admin' }
            }
        });
        const students = await User.count({ where: { role: 'student', status: 'Verified' } });
        const graduates = await User.count({ where: { role: 'graduate', status: 'Verified' } });
        const others = await User.count({ where: { role: 'other', status: 'Verified' } });
        const eventsCount = await Event.count();
        const partnerCompanies = await Company.count();

        // For the public landing page, show ALL active opportunities so visitors
        // can discover the full range. The targetAudience restriction only applies
        // when a user actually tries to apply (handled by the apply route).
        const internshipWhere = { active: true };

        const activeInternships = await Internship.count({ where: internshipWhere });

        // Latest 30 Opportunities
        const latestInternships = await Internship.findAll({
            where: internshipWhere,
            limit: 30,
            order: [['createdAt', 'DESC']]
        });

        // Latest 6 Events
        const latestEvents = await Event.findAll({
            limit: 6,
            order: [['date', 'ASC']]
        });

        res.json({
            stats: {
                totalUsers,
                students,
                graduates,
                others,
                eventsCount,
                partnerCompanies,
                activeInternships
            },
            latestInternships,
            latestEvents
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard/stats', protect, async (req, res, next) => {
    try {
        const totalUsers = await User.count({ where: { status: 'Verified' } });
        const friendsCount = await Connection.count({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id },
                    { recipientId: req.user.id }
                ],
                status: 'accepted'
            }
        });
        const pendingRequests = await Connection.count({
            where: {
                recipientId: req.user.id,
                status: 'pending'
            }
        });

        res.json({
            totalUsers,
            friendsCount,
            pendingRequests
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/admin/stats', protect, admin, async (req, res, next) => {
    try {
        const totalUsers = await User.count();
        const totalGraduates = await User.count({ where: { role: 'graduate' } });
        const verifiedGraduates = await User.count({ where: { role: 'graduate', status: 'Verified' } });
        const pendingUserRequests = await User.count({ where: { status: 'Pending' } });
        const partnerCompanies = await Company.count();
        const activeInternships = await Internship.count({ where: { active: true } });
        const totalApplications = await Application.count();
        const activeEvents = await Event.count({
            where: {
                date: { [Op.gte]: new Date() }
            }
        });

        // Growth Data - start from 2024 to show relevant data
        const currentYear = new Date().getFullYear();
        const years = [2024, 2025, 2026].filter(y => y <= currentYear + 1);

        const growthData = await Promise.all(years.map(async (year) => {
            const endOfYear = new Date(year, 11, 31, 23, 59, 59);

            const usersCount = await User.count({
                where: {
                    createdAt: { [Op.lte]: endOfYear }
                }
            });
            const graduatesCount = await User.count({
                where: {
                    role: 'graduate',
                    createdAt: { [Op.lte]: endOfYear }
                }
            });
            const studentsCount = await User.count({
                where: {
                    role: 'student',
                    createdAt: { [Op.lte]: endOfYear }
                }
            });

            return { name: year.toString(), users: usersCount, graduates: graduatesCount, students: studentsCount };
        }));

        // Domain distribution - use specialty field (more meaningful for students/graduates)
        const specialties = await User.findAll({
            where: {
                specialty: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
            },
            attributes: [
                'specialty',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['specialty'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 8
        });

        // If no specialty data, fallback to role distribution
        let domainData;
        const domainColors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#ef4444', '#0ea5e9', '#2dd4bf'];
        if (specialties.length > 0) {
            domainData = specialties.map((d, i) => ({
                name: d.specialty || 'Other',
                value: parseInt(d.getDataValue('count')),
                color: domainColors[i % domainColors.length]
            }));
        } else {
            // Fallback: show distribution by role
            domainData = [
                { name: 'Students', value: await User.count({ where: { role: 'student' } }), color: '#6366f1' },
                { name: 'Graduates', value: await User.count({ where: { role: 'graduate' } }), color: '#10b981' },
                { name: 'Other', value: await User.count({ where: { role: 'other' } }), color: '#f59e0b' }
            ].filter(d => d.value > 0);
        }

        // Opportunities Data (Last 6 months)
        const opportunitiesData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const m = date.getMonth();
            const y = date.getFullYear();
            const startOfMonth = new Date(y, m, 1);
            const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);

            const jobs = await Internship.count({
                where: {
                    type: { [Op.ne]: 'Internship' },
                    createdAt: { [Op.between]: [startOfMonth, endOfMonth] }
                }
            });
            const internships = await Internship.count({
                where: {
                    type: 'Internship',
                    createdAt: { [Op.between]: [startOfMonth, endOfMonth] }
                }
            });

            opportunitiesData.push({
                name: date.toLocaleString('default', { month: 'short' }),
                jobs,
                internships
            });
        }

        res.json({
            stats: {
                totalUsers,
                totalGraduates,
                verifiedGraduates,
                pendingUserRequests,
                partnerCompanies,
                activeInternships,
                totalApplications,
                activeEvents,
                avgApplicationsPerUser: totalUsers > 0 ? (totalApplications / totalUsers).toFixed(1) : 0,
                successRate: totalApplications > 0 ? Math.round((await Application.count({ where: { status: 'accepted' } }) / totalApplications) * 100) : 0
            },
            growthData,
            domainData,
            opportunitiesData
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/users/create-admin
// @desc    Create a new admin user (admin only)
// @access  Private/Admin
router.post('/create-admin', protect, admin, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Generate unique admin ID
        const adminUsers = await User.findAll({
            where: { role: 'admin' },
            attributes: ['supnumId']
        });

        // Extract numbers from existing admin IDs and find the highest
        const adminNumbers = adminUsers
            .map(u => u.supnumId ? parseInt(u.supnumId.replace(/\D/g, '')) : 0)
            .filter(n => !isNaN(n));

        const nextAdminNumber = adminNumbers.length > 0 ? Math.max(...adminNumbers) + 1 : 1;
        const adminId = `ADMIN${String(nextAdminNumber).padStart(3, '0')}`;

        // Create admin user (password will be hashed by the User model's beforeCreate hook)
        const newAdmin = await User.create({
            name,
            email,
            password, // Don't hash manually - let the model hook do it
            role: 'admin',
            status: 'Verified',
            supnumId: adminId
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            user: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
                status: newAdmin.status,
                supnumId: newAdmin.supnumId
            }
        });
    } catch (error) {
        next(error);
    }
});



// @route   GET /api/users/export/pdf
// @desc    Export users to PDF (admin only)
// @access  Private/Admin
router.get('/export/pdf', protect, admin, async (req, res, next) => {
    try {
        const { lang = 'EN' } = req.query;

        // Translation object
        const translations = {
            EN: {
                title: 'SupNum Connect',
                subtitle: 'User Management Report',
                generated: 'Generated',
                summary: 'Executive Summary',
                summaryDesc: 'Overview of current user base statistics',
                totalUsers: 'Total Users',
                students: 'Students',
                graduates: 'Graduates',
                verified: 'Verified',
                detailedList: 'Detailed User List',
                name: 'Name',
                email: 'Email',
                supnumId: 'SupNum ID',
                role: 'Role',
                status: 'Status',
                joined: 'Joined',
                page: 'Page',
                of: 'of',
                confidential: 'SupNum Connect - Confidential',
                student: 'Student',
                graduate: 'Graduate',
                admin: 'Admin'
            },
            FR: {
                title: 'SupNum Connect',
                subtitle: 'Rapport de Gestion des Utilisateurs',
                generated: 'Généré le',
                summary: 'Résumé Exécutif',
                summaryDesc: 'Aperçu des statistiques actuelles de la base d\'utilisateurs',
                totalUsers: 'Total Utilisateurs',
                students: 'Étudiants',
                graduates: 'Diplômés',
                verified: 'Vérifiés',
                detailedList: 'Liste Détaillée des Utilisateurs',
                name: 'Nom',
                email: 'Email',
                supnumId: 'ID SupNum',
                role: 'Rôle',
                status: 'Statut',
                joined: 'Inscrit',
                page: 'Page',
                of: 'sur',
                confidential: 'SupNum Connect - Confidentiel',
                student: 'Étudiant',
                graduate: 'Diplômé',
                admin: 'Admin'
            },
            AR: {
                title: 'SupNum Connect',
                subtitle: 'تقرير إدارة المستخدمين',
                generated: 'تم الإنشاء في',
                summary: 'الملخص التنفيذي',
                summaryDesc: 'نظرة عامة على إحصائيات قاعدة المستخدمين الحالية',
                totalUsers: 'إجمالي المستخدمين',
                students: 'الطلاب',
                graduates: 'الخريجين',
                verified: 'تم التحقق',
                detailedList: 'قائمة المستخدمين التفصيلية',
                name: 'الاسم',
                email: 'البريد الإلكتروني',
                supnumId: 'معرف SupNum',
                role: 'الدور',
                status: 'الحالة',
                joined: 'تاريخ الانضمام',
                page: 'صفحة',
                of: 'من',
                confidential: 'SupNum Connect - سري',
                student: 'طالب',
                graduate: 'خريج',
                admin: 'مسؤول'
            }
        };

        const t = translations[lang] || translations.EN;

        const allUsers = await User.findAll({
            attributes: ['id', 'name', 'email', 'supnumId', 'role', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        // Filter out test users (emails with 'test-' pattern or name 'Test User')
        const users = allUsers.filter(user => {
            const isTestEmail = user.email && user.email.includes('test-');
            const isTestName = user.name && user.name.toLowerCase() === 'test user';
            return !isTestEmail && !isTestName;
        });

        // Fetch statistics (excluding test users)
        const stats = {
            total: users.length,
            students: users.filter(u => u.role === 'student').length,
            graduates: users.filter(u => u.role === 'graduate').length,
            verified: users.filter(u => u.status === 'Verified').length
        };

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({
            margin: 40,
            size: 'A4',
            bufferPages: true
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=supnum_users_report.pdf');

        doc.pipe(res);

        // --- HEADER ---
        doc.rect(0, 0, doc.page.width, 80).fill('#2563eb');
        doc.fillColor('white')
            .fontSize(22)
            .font('Helvetica-Bold')
            .text(t.title, 40, 25, { width: doc.page.width - 80 });

        doc.fontSize(12)
            .font('Helvetica')
            .text(t.subtitle, 40, 50);

        doc.fontSize(9)
            .text(`${t.generated}: ${new Date().toLocaleDateString(lang === 'AR' ? 'ar-EG' : lang === 'FR' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`, 40, 50, {
                align: 'right',
                width: doc.page.width - 80
            });

        doc.fillColor('#000000');

        // --- SUMMARY SECTION ---
        let currentY = 110;
        doc.fontSize(16)
            .font('Helvetica-Bold')
            .text(t.summary, 40, currentY);

        currentY += 25;
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#64748b')
            .text(t.summaryDesc, 40, currentY);

        currentY += 30;

        // Summary boxes
        const summaryData = [
            { label: t.totalUsers, value: stats.total, color: '#dbeafe', textColor: '#1e40af' },
            { label: t.students, value: stats.students, color: '#e0f2fe', textColor: '#0369a1' },
            { label: t.graduates, value: stats.graduates, color: '#ede9fe', textColor: '#6d28d9' },
            { label: t.verified, value: stats.verified, color: '#d1fae5', textColor: '#047857' }
        ];

        const boxWidth = 125;
        const boxHeight = 70;
        const spacing = 10;
        let startX = 40;

        summaryData.forEach((item) => {
            doc.rect(startX, currentY, boxWidth, boxHeight)
                .fill(item.color);

            doc.fillColor('#475569')
                .fontSize(10)
                .font('Helvetica')
                .text(item.label, startX + 10, currentY + 15, {
                    width: boxWidth - 20,
                    align: 'left'
                });

            doc.fillColor(item.textColor)
                .fontSize(28)
                .font('Helvetica-Bold')
                .text(String(item.value), startX + 10, currentY + 35, {
                    width: boxWidth - 20,
                    align: 'left'
                });

            startX += boxWidth + spacing;
        });

        currentY += boxHeight + 40;

        // --- TABLE SECTION ---
        doc.fillColor('#000000')
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(t.detailedList, 40, currentY);

        currentY += 30;

        // Table configuration
        const tableTop = currentY;
        const tableLeft = 40;
        const rowHeight = 25;
        const headerHeight = 30;

        const columns = [
            { header: t.name, width: 100, key: 'name' },
            { header: t.email, width: 140, key: 'email' },
            { header: t.supnumId, width: 70, key: 'supnumId' },
            { header: t.role, width: 70, key: 'role' },
            { header: t.status, width: 70, key: 'status' },
            { header: t.joined, width: 65, key: 'joined' }
        ];

        // Draw table header
        let xPos = tableLeft;
        doc.rect(tableLeft, tableTop, 515, headerHeight).fill('#1e40af');

        columns.forEach(col => {
            doc.fillColor('#ffffff')
                .fontSize(9)
                .font('Helvetica-Bold')
                .text(col.header, xPos + 5, tableTop + 10, {
                    width: col.width - 10,
                    align: 'left'
                });
            xPos += col.width;
        });

        currentY = tableTop + headerHeight;

        // Draw table rows
        users.forEach((user, index) => {
            // Check if we need a new page
            if (currentY + rowHeight > doc.page.height - 80) {
                doc.addPage();
                currentY = 40;
            }

            // Alternate row background
            if (index % 2 === 0) {
                doc.rect(tableLeft, currentY, 515, rowHeight).fill('#f8fafc');
            } else {
                doc.rect(tableLeft, currentY, 515, rowHeight).fill('#ffffff');
            }

            // Draw cell borders
            doc.strokeColor('#e2e8f0').lineWidth(0.5);
            doc.rect(tableLeft, currentY, 515, rowHeight).stroke();

            xPos = tableLeft;
            const rowData = {
                name: user.name,
                email: user.email,
                supnumId: user.role === 'admin' ? '------' : (user.supnumId ? user.supnumId.replace(/\D/g, '') || 'N/A' : 'N/A'),
                role: t[user.role.toLowerCase()] || user.role,
                status: user.status,
                joined: new Date(user.createdAt).toLocaleDateString(lang === 'AR' ? 'ar-EG' : lang === 'FR' ? 'fr-FR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
            };

            columns.forEach(col => {
                doc.fillColor('#1f2937')
                    .fontSize(8)
                    .font('Helvetica')
                    .text(rowData[col.key], xPos + 5, currentY + 8, {
                        width: col.width - 10,
                        align: 'left',
                        ellipsis: true
                    });
                xPos += col.width;
            });

            currentY += rowHeight;
        });

        // --- FOOTER (on all pages) ---
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
            doc.switchToPage(i);

            doc.fontSize(8)
                .fillColor('#94a3b8')
                .text(
                    `${t.page} ${i + 1} ${t.of} ${range.count}`,
                    40,
                    doc.page.height - 50,
                    { align: 'center', width: doc.page.width - 80 }
                );

            doc.text(
                t.confidential,
                40,
                doc.page.height - 35,
                { align: 'center', width: doc.page.width - 80 }
            );
        }

        doc.end();
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/suggestions
// @desc    Get user suggestions
// @access  Private
router.get('/suggestions', protect, async (req, res, next) => {
    try {
        // Find users who are not friends and not self
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id },
                    { recipientId: req.user.id }
                ]
            }
        });

        const connectedUserIds = connections.map(c =>
            c.requesterId === req.user.id ? c.recipientId : c.requesterId
        );
        connectedUserIds.push(req.user.id);

        const suggestions = await User.findAll({
            where: {
                id: { [Op.notIn]: connectedUserIds },
                status: 'Verified',
                role: { [Op.ne]: 'admin' }
            },
            attributes: ['id', 'name', 'avatar', 'role', 'jobTitle', 'company'],
            limit: 5,
            order: fn('RANDOM')
        });

        res.json({ suggestions });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/search/all
// @desc    Search all users
// @access  Private
router.get('/search/all', protect, async (req, res, next) => {
    try {
        const { query, supnumId, name, email, graduationYear, specialty, jobTitle } = req.query;
        const queryTerm = query || req.query.search || '';

        // Base where clause
        let where = {
            status: 'Verified',
            role: { [Op.ne]: 'admin' }
        };

        // Specific filters (AND logic with the base query)
        if (supnumId) where.supnumId = { [Op.iLike]: `%${supnumId}%` };
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (email) where.email = { [Op.iLike]: `%${email}%` };
        if (graduationYear) where.graduationYear = graduationYear;
        if (specialty) where.specialty = { [Op.iLike]: `%${specialty}%` };
        if (jobTitle) where.jobTitle = { [Op.iLike]: `%${jobTitle}%` };

        if (queryTerm && queryTerm.trim()) {
            const searchVal = `%${queryTerm.trim()}%`;
            // If we have specific filters, we add the general query to the OR array
            if (Object.keys(where).length > 2) {
                // Already have filters, we might want to combine them? 
                // Usually general search is alternative to specific filters or they work together.
                // Let's make it work together (AND)
                where[Op.and] = [
                    {
                        [Op.or]: [
                            { name: { [Op.iLike]: searchVal } },
                            { email: { [Op.iLike]: searchVal } },
                            { supnumId: { [Op.iLike]: searchVal } },
                            { jobTitle: { [Op.iLike]: searchVal } },
                            { company: { [Op.iLike]: searchVal } },
                            { bio: { [Op.iLike]: searchVal } },
                            { specialty: { [Op.iLike]: searchVal } }
                        ]
                    }
                ];
            } else {
                where[Op.or] = [
                    { name: { [Op.iLike]: searchVal } },
                    { email: { [Op.iLike]: searchVal } },
                    { supnumId: { [Op.iLike]: searchVal } },
                    { jobTitle: { [Op.iLike]: searchVal } },
                    { company: { [Op.iLike]: searchVal } },
                    { bio: { [Op.iLike]: searchVal } },
                    { specialty: { [Op.iLike]: searchVal } }
                ];
            }
        }

        const users = await User.findAll({
            where,
            attributes: ['id', 'name', 'avatar', 'role', 'supnumId', 'jobTitle', 'company', 'location', 'bio', 'graduationYear', 'specialty'],
            limit: 50
        });

        // Get current user's connections to show status
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id },
                    { recipientId: req.user.id }
                ]
            }
        });

        const usersWithStatus = users.map(user => {
            const conn = connections.find(c =>
                (c.requesterId === req.user.id && c.recipientId === user.id) ||
                (c.recipientId === req.user.id && c.requesterId === user.id)
            );
            return {
                ...user.toJSON(),
                connectionStatus: conn ? conn.status : 'none',
                isRequester: conn ? conn.requesterId === req.user.id : false
            };
        });

        res.json({ users: usersWithStatus });
    } catch (error) {
        console.error('Search error:', error);
        next(error);
    }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const { status, search, role } = req.query;
        let where = {};

        if (status) {
            where.status = status;
        }

        if (role) {
            where.role = role;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { supnumId: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
        res.json({ users });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/graduates/search
// @desc    Search graduates for connections
// @access  Private
router.get('/graduates/search', protect, async (req, res, next) => {
    try {
        const { search } = req.query;
        let where = {
            role: 'graduate',
            status: 'Verified',
            id: { [Op.ne]: req.user.id } // Exclude self
        };

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { jobTitle: { [Op.iLike]: `%${search}%` } },
                { company: { [Op.iLike]: `%${search}%` } },
                { supnumId: { [Op.iLike]: `%${search}%` } },
                { bio: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const graduates = await User.findAll({
            where,
            attributes: ['id', 'name', 'avatar', 'jobTitle', 'company', 'location'],
            limit: 20
        });

        // Get current user's connections to show status (pending, accepted, etc)
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id },
                    { recipientId: req.user.id }
                ]
            }
        });

        const graduatesWithStatus = graduates.map(grad => {
            const conn = connections.find(c =>
                (c.requesterId === req.user.id && c.recipientId === grad.id) ||
                (c.recipientId === req.user.id && c.requesterId === grad.id)
            );
            return {
                ...grad.toJSON(),
                connectionStatus: conn ? conn.status : 'none',
                isRequester: conn ? conn.requesterId === req.user.id : false
            };
        });

        res.json({ graduates: graduatesWithStatus });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/users/connect/:id
// @desc    Send friend request
// @access  Private
router.post('/connect/:id', protect, async (req, res, next) => {
    try {
        const recipientId = req.params.id;

        if (recipientId === req.user.id) {
            return res.status(400).json({ message: 'You cannot connect with yourself' });
        }

        // Check if connection already exists
        const existing = await Connection.findOne({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id, recipientId },
                    { requesterId: recipientId, recipientId: req.user.id }
                ]
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Connection already exists or pending' });
        }

        const connection = await Connection.create({
            requesterId: req.user.id,
            recipientId,
            status: req.user.role === 'admin' ? 'accepted' : 'pending'
        });

        res.status(201).json({ connection });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/users/connect/:id/accept
// @desc    Accept friend request
// @access  Private
router.patch('/connect/:id/accept', protect, async (req, res, next) => {
    try {
        const connection = await Connection.findOne({
            where: {
                id: req.params.id,
                recipientId: req.user.id,
                status: 'pending'
            }
        });

        if (!connection) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await connection.update({ status: 'accepted' });
        res.json({ message: 'Connection accepted', connection });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/users/connect/:id/reject
// @desc    Reject friend request
// @access  Private
router.patch('/connect/:id/reject', protect, async (req, res, next) => {
    try {
        const connection = await Connection.findOne({
            where: {
                id: req.params.id,
                recipientId: req.user.id,
                status: 'pending'
            }
        });

        if (!connection) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await connection.update({ status: 'rejected' });
        res.json({ message: 'Connection rejected' });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/connections/requests
// @desc    Get pending friend requests
// @access  Private
router.get('/connections/requests', protect, async (req, res, next) => {
    try {
        const requests = await Connection.findAll({
            where: {
                recipientId: req.user.id,
                status: 'pending'
            },
            include: [{ model: User, as: 'requester', attributes: ['id', 'name', 'avatar', 'jobTitle'] }]
        });
        res.json({ requests });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/connections/friends
// @desc    Get accepted friends
// @access  Private
router.get('/connections/friends', protect, async (req, res, next) => {
    try {
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id },
                    { recipientId: req.user.id }
                ],
                status: 'accepted'
            },
            include: [
                { model: User, as: 'requester', attributes: ['id', 'name', 'avatar', 'jobTitle', 'company'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar', 'jobTitle', 'company'] }
            ]
        });

        const friends = connections.map(c => {
            return c.requesterId === req.user.id ? c.recipient : c.requester;
        });

        res.json({ friends });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/users/:id/status
// @desc    Update user status (admin only)
// @access  Private/Admin
router.patch('/:id/status', protect, admin, async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['Verified', 'Pending', 'Suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ status });

        res.json({ user: user.toJSON() });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: 'User not found' });
        }

        // Clean up related data that might have foreign key constraints
        await Connection.destroy({
            where: {
                [Op.or]: [
                    { requesterId: user.id },
                    { recipientId: user.id }
                ]
            },
            transaction: t
        });

        await Message.destroy({
            where: {
                [Op.or]: [
                    { senderId: user.id },
                    { recipientId: user.id }
                ]
            },
            transaction: t
        });

        await Application.destroy({ where: { userId: user.id }, transaction: t });
        await Notification.destroy({ where: { userId: user.id }, transaction: t });

        // Re-assign or delete events created by this user
        await Event.destroy({ where: { createdById: user.id }, transaction: t });
        await Internship.destroy({ where: { createdById: user.id }, transaction: t });

        // Clean up social feed data
        await Comment.destroy({ where: { userId: user.id }, transaction: t });
        await Post.destroy({ where: { userId: user.id }, transaction: t });

        // Finally destroy the user
        await user.destroy({ transaction: t });

        await t.commit();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('DELETE USER ERROR:', error);
        next(error);
    }
});

// @route   GET /api/users/:id/export-cv
// @desc    Export user CV as PDF
// @access  Private
router.get('/:id/export-cv', protect, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lang = 'EN' } = req.query;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const translations = {
            EN: { cv: 'Curriculum Vitae', contactInfo: 'Contact Information', professionalInfo: 'Professional Information', social: 'Social Media', email: 'Email', phone: 'Phone', location: 'Location', jobTitle: 'Job Title', company: 'Company', workStatus: 'Work Status', bio: 'About Me', linkedin: 'LinkedIn', github: 'GitHub', facebook: 'Facebook', student: 'Student', graduate: 'Graduate', admin: 'Administrator', other: 'Community Member' },
            FR: { cv: 'Curriculum Vitae', contactInfo: 'Coordonnées', professionalInfo: 'Informations Professionnelles', social: 'Réseaux Sociaux', email: 'Email', phone: 'Téléphone', location: 'Localisation', jobTitle: 'Poste', company: 'Entreprise', workStatus: 'Statut Professionnel', bio: 'À Propos', linkedin: 'LinkedIn', github: 'GitHub', facebook: 'Facebook', student: 'Étudiant', graduate: 'Diplômé', admin: 'Administrateur', other: 'Membre du Réseau' },
            AR: { cv: 'السيرة الذاتية', contactInfo: 'معلومات الاتصال', professionalInfo: 'المعلومات المهنية', social: 'وسائل التواصل الاجتماعي', email: 'البريد الإلكتروني', phone: 'الهاتف', location: 'الموقع', jobTitle: 'المسمى الوظيفي', company: 'الشركة', workStatus: 'حالة العمل', bio: 'نبذة عني', linkedin: 'لينكد إن', github: 'جيت هاب', facebook: 'فيسبوك', student: 'طالب', graduate: 'خريج', admin: 'مسؤول', other: 'عضو في الشبكة' }
        };

        const t = translations[lang] || translations.EN;
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${user.name.replace(/\s+/g, '_')}_CV.pdf`);
        doc.pipe(res);

        // Header
        doc.rect(0, 0, doc.page.width, 120).fill('#1e40af');
        doc.fillColor('white').fontSize(28).font('Helvetica-Bold').text(user.name, 50, 40);
        doc.fontSize(14).font('Helvetica').text(t[user.role.toLowerCase()] || user.role, 50, 75);
        if (user.supnumId) {
            doc.fontSize(10).text(user.supnumId, 50, 95);
        }
        doc.fillColor('#000000');
        let currentY = 150;

        // Bio
        if (user.bio) {
            doc.fontSize(16).font('Helvetica-Bold').text(t.bio, 50, currentY);
            currentY += 25;
            doc.fontSize(11).font('Helvetica').fillColor('#374151').text(user.bio, 50, currentY, { width: doc.page.width - 100, align: 'justify' });
            currentY = doc.y + 20;
        }

        // Contact
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text(t.contactInfo, 50, currentY);
        currentY += 25;
        [
            { label: t.email, value: user.email },
            { label: t.phone, value: user.phone || 'N/A' },
            { label: t.location, value: user.location || 'Nouakchott, Mauritania' }
        ].forEach(item => {
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${item.label}: `, 50, currentY, { continued: true })
                .font('Helvetica').fillColor('#374151').text(item.value);
            currentY += 20;
        });
        currentY += 10;

        // Professional
        if (user.jobTitle || user.company || user.workStatus) {
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text(t.professionalInfo, 50, currentY);
            currentY += 25;
            if (user.jobTitle) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.jobTitle}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#374151').text(user.jobTitle);
                currentY += 20;
            }
            if (user.company) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.company}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#374151').text(user.company);
                currentY += 20;
            }
            if (user.workStatus) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.workStatus}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#374151').text(user.workStatus);
                currentY += 20;
            }
            currentY += 10;
        }

        // Social
        if (user.socialLinkedin || user.socialGithub || user.socialFacebook) {
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text(t.social, 50, currentY);
            currentY += 25;
            if (user.socialLinkedin) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.linkedin}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#0077b5').text(user.socialLinkedin, { link: user.socialLinkedin, underline: true });
                currentY += 20;
            }
            if (user.socialGithub) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.github}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#374151').text(user.socialGithub, { link: user.socialGithub, underline: true });
                currentY += 20;
            }
            if (user.socialFacebook) {
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e40af').text(`${t.facebook}: `, 50, currentY, { continued: true })
                    .font('Helvetica').fillColor('#1877F2').text(user.socialFacebook, { link: user.socialFacebook, underline: true });
                currentY += 20;
            }
        }

        // Footer
        doc.fontSize(8).fillColor('#94a3b8').text(`Generated from SupNum Connect on ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50, { align: 'center', width: doc.page.width - 100 });
        doc.end();
    } catch (error) {
        next(error);
    }
});


// @route   DELETE /api/users/connect/:id/unfriend
// @desc    Unfriend/Remove connection
// @access  Private
router.delete('/connect/:id/unfriend', protect, async (req, res, next) => {
    try {
        const recipientId = req.params.id;

        const connection = await Connection.findOne({
            where: {
                [Op.or]: [
                    { requesterId: req.user.id, recipientId },
                    { requesterId: recipientId, recipientId: req.user.id }
                ]
            }
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        await connection.destroy();
        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
