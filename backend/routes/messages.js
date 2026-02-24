const express = require('express');
const router = express.Router();
const { Message, User, Connection, sequelize } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { emitToUser } = require('../utils/socket');

// Configure Multer for message images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/messages/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `msg-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for audio
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and audio files are allowed'));
        }
    }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res, next) => {
    try {
        // 1. Get unique conversation IDs and the date of the last message for each
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
            raw: true
        });

        if (conversations.length === 0) {
            return res.json({ conversations: [] });
        }

        const convoIds = conversations.map(c => c.conversationId);
        const lastDates = conversations.map(c => c.lastMessageAt);

        // 2. Fetch all last messages in ONE query
        const lastMessages = await Message.findAll({
            where: {
                conversationId: { [Op.in]: convoIds },
                createdAt: { [Op.in]: lastDates }
            },
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar', 'role'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar', 'role'] },
                {
                    model: Message,
                    as: 'replyTo',
                    attributes: ['id', 'content', 'type', 'fileUrl'],
                    include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }]
                }
            ]
        });

        // 3. Fetch all unread counts in ONE query
        const unreadCounts = await Message.findAll({
            where: {
                conversationId: { [Op.in]: convoIds },
                recipientId: req.user.id,
                read: false
            },
            attributes: [
                'conversationId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['conversationId'],
            raw: true
        });

        // Map unread counts for easy lookup
        const unreadMap = {};
        unreadCounts.forEach(c => {
            unreadMap[c.conversationId] = parseInt(c.count);
        });

        // 4. Assemble results and sort by date
        const conversationDetails = lastMessages.map(msg => ({
            _id: msg.conversationId,
            lastMessage: msg,
            unreadCount: unreadMap[msg.conversationId] || 0
        })).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

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
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar', 'role'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar', 'role'] },
                {
                    model: Message,
                    as: 'replyTo',
                    attributes: ['id', 'content', 'type', 'fileUrl'],
                    include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }]
                }
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
router.post('/', protect, upload.single('file'), async (req, res, next) => {
    try {
        const { recipientId, content, replyToId } = req.body;
        const file = req.file;

        // Validation: Must have either content or file
        if (!content && !file) {
            return res.status(400).json({ message: 'Message must have text, image or voice' });
        }

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

        let type = 'text';
        if (file) {
            type = file.mimetype.startsWith('image/') ? 'image' : 'audio';
        }

        const message = await Message.create({
            conversationId,
            senderId: req.user.id,
            recipientId,
            content: content || '',
            type,
            fileUrl: file ? `/uploads/messages/${file.filename}` : null,
            replyToId: replyToId || null
        });

        const populatedMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] },
                {
                    model: Message,
                    as: 'replyTo',
                    attributes: ['id', 'content', 'type', 'fileUrl'],
                    include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }]
                }
            ]
        });

        res.status(201).json({ message: populatedMessage });

        // Emit socket event to recipient
        emitToUser(String(recipientId), 'new_message', populatedMessage);
        // Also emit to sender (in case they have multiple sessions/tabs)
        emitToUser(String(req.user.id), 'new_message', populatedMessage);
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

        // Soft delete
        await message.update({
            isDeleted: true,
            content: '', // Clear content for privacy
            fileUrl: null
        });

        const updatedMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] }
            ]
        });

        res.json({ message: updatedMessage });

        // Emit delete event
        emitToUser(String(message.recipientId), 'message_deleted', { messageId: message.id, conversationId: message.conversationId });
        emitToUser(String(req.user.id), 'message_deleted', { messageId: message.id, conversationId: message.conversationId });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/messages/:id
// @desc    Edit a message
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    try {
        const { content } = req.body;
        const message = await Message.findByPk(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only sender can edit
        if (message.senderId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (message.isDeleted) {
            return res.status(400).json({ message: 'Cannot edit deleted message' });
        }

        if (message.type === 'image') {
            return res.status(400).json({ message: 'Cannot edit image messages' });
        }

        await message.update({
            content,
            isEdited: true
        });

        const updatedMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'recipient', attributes: ['id', 'name', 'avatar'] }
            ]
        });

        res.json({ message: updatedMessage });

        // Emit edit event
        emitToUser(String(message.recipientId), 'message_edited', updatedMessage);
        emitToUser(String(req.user.id), 'message_edited', updatedMessage);
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/messages/conversation/:conversationId
// @desc    Delete all messages in a conversation
// @access  Private
router.delete('/conversation/:conversationId', protect, async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        // Check if user is part of the conversation
        const isParticipant = conversationId.includes(req.user.id);
        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized to delete this conversation' });
        }

        // Ideally we should have a 'deletedFor' array to hide it for one user but keep for other
        // But for simplicity, we will delete all messages or mark them isDeleted
        await Message.destroy({
            where: { conversationId }
        });

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
