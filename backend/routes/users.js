const express = require('express');
const router = express.Router();
const { User, Connection, Event, Company, Internship, Application, sequelize } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { Op, fn, col } = require('sequelize');

// @route   GET /api/users/public/stats
// @desc    Get public statistics for landing page
// @access  Public
router.get('/public/stats', async (req, res, next) => {
    try {
        const totalUsers = await User.count({ where: { status: 'Verified' } });
        const students = await User.count({ where: { role: 'student', status: 'Verified' } });
        const graduates = await User.count({ where: { role: 'graduate', status: 'Verified' } });
        const eventsCount = await Event.count();
        const partnerCompanies = await Company.count();
        const activeInternships = await Internship.count({ where: { active: true } });

        // Latest 3 Internships
        const latestInternships = await Internship.findAll({
            where: { active: true },
            limit: 3,
            order: [['createdAt', 'DESC']]
        });

        // Latest 3 Events
        const latestEvents = await Event.findAll({
            limit: 3,
            order: [['date', 'ASC']]
        });

        res.json({
            stats: {
                totalUsers,
                students,
                graduates,
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

        // Growth Data (Last 6 months)
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push({
                name: date.toLocaleString('default', { month: 'short' }),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            });
        }

        const growthData = await Promise.all(months.map(async (m) => {
            const startOfMonth = new Date(m.year, m.month - 1, 1);
            const endOfMonth = new Date(m.year, m.month, 0, 23, 59, 59);

            const students = await User.count({
                where: {
                    role: 'student',
                    createdAt: { [Op.lte]: endOfMonth }
                }
            });
            const graduates = await User.count({
                where: {
                    role: 'graduate',
                    createdAt: { [Op.lte]: endOfMonth }
                }
            });

            return { name: m.name, students, graduates };
        }));

        // Domain Data (based on jobTitle)
        const domains = await User.findAll({
            where: { role: 'graduate', jobTitle: { [Op.ne]: '' } },
            attributes: ['jobTitle', [fn('COUNT', col('id')), 'count']],
            group: ['jobTitle'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 4
        });

        const domainColors = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6'];
        const domainData = domains.map((d, i) => ({
            name: d.jobTitle,
            value: parseInt(d.getDataValue('count')),
            color: domainColors[i % domainColors.length]
        }));

        // Opportunities Data
        const opportunitiesData = await Promise.all(months.map(async (m) => {
            const startOfMonth = new Date(m.year, m.month - 1, 1);
            const endOfMonth = new Date(m.year, m.month, 0, 23, 59, 59);

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

            return { name: m.name, jobs, internships };
        }));

        res.json({
            stats: {
                totalUsers,
                totalGraduates,
                verifiedGraduates,
                pendingUserRequests,
                partnerCompanies,
                activeInternships,
                totalApplications,
                activeEvents
            },
            growthData,
            domainData,
            opportunitiesData
        });
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
        const { query } = req.query;
        let where = {
            status: 'Verified',
            role: { [Op.ne]: 'admin' },
            id: { [Op.ne]: req.user.id }
        };

        if (query) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },
                { supnumId: { [Op.iLike]: `%${query}%` } }
            ];
        }

        const users = await User.findAll({
            where,
            attributes: ['id', 'name', 'avatar', 'role', 'supnumId', 'jobTitle', 'company'],
            limit: 50
        });

        res.json({ users });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const { status, search } = req.query;
        let where = {};

        if (status) {
            where.status = status;
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
                { company: { [Op.iLike]: `%${search}%` } }
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
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/users/export/csv
// @desc    Export users to CSV (admin only)
// @access  Private/Admin
router.get('/export/csv', protect, admin, async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'supnumId', 'role', 'status', 'createdAt']
        });

        // CSV Header
        let csv = 'ID,Name,Email,SupNum ID,Role,Status,Joined Date\n';

        // CSV Rows
        users.forEach(user => {
            csv += `${user.id},"${user.name}",${user.email},${user.supnumId},${user.role},${user.status},${user.createdAt}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=supnum_users.csv');
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
