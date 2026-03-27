const express = require('express');
const router = express.Router();
const { SupportMessage, User } = require('../models');
const { protect, admin, optionalProtect } = require('../middleware/auth');

// @route   POST /api/support
// @desc    Send a support message / report a problem
// @access  Public (with optional userId)
router.post('/', optionalProtect, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        // If user is logged in, use their data
        const supportData = {
            subject,
            message,
            userId: req.user ? req.user.id : null,
            name: req.user ? req.user.name : name,
            email: req.user ? req.user.email : email
        };

        if (!supportData.email && !req.user) {
            return res.status(400).json({ message: 'Email is required for non-logged in users' });
        }

        await SupportMessage.create(supportData);

        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('Support message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/support
// @desc    Get all support messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const messages = await SupportMessage.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'role']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        console.error('Fetch support messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/support/:id
// @desc    Update support message status
// @access  Private/Admin
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const message = await SupportMessage.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.status = status;
        await message.save();

        res.json(message);
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/support/:id
// @desc    Delete a support message
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const message = await SupportMessage.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.destroy();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Delete support message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
