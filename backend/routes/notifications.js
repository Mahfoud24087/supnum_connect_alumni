const express = require('express');
const router = express.Router();
const { Notification, PushSubscription } = require('../models');
const { protect } = require('../middleware/auth');
const { sendPushNotification } = require('../services/pushNotificationService');

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

// @route   GET /api/notifications/push-key
// @desc    Get Public VAPID Key
// @access  Public
router.get('/push-key', (req, res) => {
    res.json({ publicKey: process.env.PUBLIC_VAPID_KEY || 'BFxuRErTWPIHmpXClcwPaeNJFTRQGTsy3ZgdxetKAR9sFje-vLXovqiY3XIesCM6UmEqm2-X1ut6G7nNmqFJdbo' });
});

// @route   POST /api/notifications/subscribe
// @desc    Subscribe to push notifications
// @access  Private
router.post('/subscribe', protect, async (req, res, next) => {
    try {
        const { subscription } = req.body;
        const userId = req.user.id;

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return res.status(400).json({ message: 'Invalid subscription object' });
        }

        const existingSub = await PushSubscription.findOne({ where: { endpoint: subscription.endpoint } });
        
        if (existingSub) {
            await existingSub.update({ 
                userId, 
                p256dh: subscription.keys.p256dh, 
                auth: subscription.keys.auth 
            });
            return res.status(200).json({ message: 'Subscription updated' });
        }

        await PushSubscription.create({
            userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth
        });

        res.status(201).json({ message: 'Subscription recorded' });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/notifications/test-push
// @desc    Test push notification
// @access  Private
router.post('/test-push', protect, async (req, res, next) => {
    try {
        const userId = req.user.id;
        await sendPushNotification(userId, {
            title: 'Test Push Notification',
            body: 'Hey! This is a test notification from SupNum Connect.',
            icon: '/icons/icon-192x192.png',
            data: { url: '/' }
        });
        res.json({ message: 'Push notification sent' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
