const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json({ notifications });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:id/read', protect, async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.update({ isRead: true });
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.patch('/read-all', protect, async (req, res, next) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { userId: req.user.id, isRead: false } }
        );
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
