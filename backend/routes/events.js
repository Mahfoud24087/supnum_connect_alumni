const express = require('express');
const router = express.Router();
const { Event, User, sequelize, Notification } = require('../models');
const { Op } = require('sequelize');
const { protect, admin } = require('../middleware/auth');
const { sendPushNotification } = require('../services/pushNotificationService');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { search, type, stage } = req.query;
        const andConditions = [];

        if (type && type !== 'All') {
            andConditions.push({ type });
        }

        if (stage && stage !== 'All') {
            andConditions.push({ stage: { [Op.iLike]: `%${stage}%` } });
        }

        if (search) {
            andConditions.push({
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                    { stage: { [Op.iLike]: `%${search}%` } }
                ]
            });
        }

        const where = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

        const events = await Event.findAll({
            where,
            include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
            order: [['date', 'DESC']]
        });
        res.json({ events });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{ model: User, as: 'createdBy', attributes: ['name'] }]
        });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ event });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/events
// @desc    Create event (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const { title, date, type, description, image, duration, stage } = req.body;

        const event = await Event.create({
            title,
            date,
            type,
            description,
            image,
            duration,
            stage,
            color: type === 'Challenge' ? 'bg-sky-500' : type === 'Contest' ? 'bg-amber-500' : 'bg-blue-600',
            createdById: req.user.id
        });

        res.status(201).json({ event });

        // Notify all students/graduates about the new event
        const allUsers = await User.findAll({ 
            where: { role: { [Op.in]: ['student', 'graduate'] } },
            attributes: ['id']
        });

        const notifyPromises = allUsers.map(async (u) => {
            // Create in-app notification
            await Notification.create({
                userId: u.id,
                title: 'Nouvel Événement ! 🎉',
                message: `Un nouvel événement "${title}" a été publié. Ne le manquez pas !`,
                type: 'event_reminder',
                link: `/events/${event.id}`
            });

            // Send Push
            return sendPushNotification(u.id, {
                title: 'Nouvel Événement sur SupNum ! 🎉',
                body: `Vient de paraître: ${title}. Regardez les détails maintenant !`,
                icon: '/icons/icon-192x192.png',
                data: { url: `/events/${event.id}` }
            });
        });

        await Promise.all(notifyPromises);
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/events/:id
// @desc    Update event (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
    try {
        const { title, date, type, description, image, duration, stage } = req.body;

        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.update({
            title,
            date,
            type,
            description,
            image,
            duration,
            stage,
            color: type === 'Challenge' ? 'bg-sky-500' : type === 'Contest' ? 'bg-amber-500' : 'bg-blue-600'
        });

        res.json({ event });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete event (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        await event.destroy();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
