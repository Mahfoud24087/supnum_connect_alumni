const express = require('express');
const router = express.Router();
const { Message, User, Connection, sequelize } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res, next) => {
    try {
        // Get unique conversation IDs where user is involved
        const conversations = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id },
                    { recipientId: req.user.id }
                ]
            },
            attributes: [
                'conversationId',
                [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageAt']
            ],
            group: ['conversationId'],
            order: [[sequelize.literal('MAX("createdAt")'), 'DESC']]
        });

        // For each conversation, get the last message details
        const conversationDetails = await Promise.all(conversations.map(async (conv) => {
            const lastMessage = await Message.findOne({
                where: { conversationId: conv.conversationId },
                order: [['createdAt', 'DESC']],
                include: [
                    { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                    { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] }
                ]
            });

            const unreadCount = await Message.count({
                where: {
                    conversationId: conv.conversationId,
                    recipientId: req.user.id,
                    read: false
                }
            });

            return {
                _id: conv.conversationId,
                lastMessage,
                unreadCount
            };
        }));

        res.json({ conversations: conversationDetails });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/messages/:conversationId
// @desc    Get messages in a conversation
// @access  Private
router.get('/:conversationId', protect, async (req, res, next) => {
    try {
        const messages = await Message.findAll({
            where: { conversationId: req.params.conversationId },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        // Mark messages as read
        await Message.update(
            { read: true, readAt: new Date() },
            {
                where: {
                    conversationId: req.params.conversationId,
                    recipientId: req.user.id,
                    read: false
                }
            }
        );

        res.json({ messages });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        const { recipientId, content } = req.body;

        // CHECK IF FRIENDS (Admins can message anyone, and anyone can message admins)
        if (req.user.role !== 'admin') {
            const recipientUser = await User.findByPk(recipientId);

            // Allow if recipient is admin
            if (recipientUser && recipientUser.role === 'admin') {
                // Allowed
            } else {
                // Check if already friends
                const isFriend = await Connection.findOne({
                    where: {
                        [Op.or]: [
                            { requesterId: req.user.id, recipientId, status: 'accepted' },
                            { requesterId: recipientId, recipientId: req.user.id, status: 'accepted' }
                        ]
                    }
                });

                if (!isFriend) {
                    // One last check: if there's ALREADY a message from this person, allow reply
                    const existingConversation = await Message.findOne({
                        where: {
                            [Op.or]: [
                                { senderId: req.user.id, recipientId },
                                { senderId: recipientId, recipientId: req.user.id }
                            ]
                        }
                    });

                    if (!existingConversation) {
                        return res.status(403).json({ message: 'You can only message your friends.' });
                    }
                }
            }
        }

        // Generate conversation ID (sorted user IDs to ensure uniqueness)
        const conversationId = [req.user.id, recipientId].sort().join('_');

        const message = await Message.create({
            conversationId,
            senderId: req.user.id,
            recipientId,
            content
        });

        const populatedMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] }
            ]
        });

        res.status(201).json({ message: populatedMessage });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const message = await Message.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only sender can delete
        if (message.senderId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await message.destroy();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
