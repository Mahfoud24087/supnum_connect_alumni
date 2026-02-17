const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');

// Helper to include standard post data
const postInclude = [
    {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'avatar', 'role', 'jobTitle']
    },
    {
        model: Post,
        as: 'sharedPost',
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'avatar', 'role', 'jobTitle']
        }]
    },
    {
        model: Comment,
        as: 'comments',
        where: { parentId: null },
        required: false,
        include: [
            {
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'avatar']
            },
            {
                model: Comment,
                as: 'replies',
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'avatar']
                }]
            }
        ]
    }
];

// @route   GET /api/posts
// @desc    Get all posts for the feed
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: postInclude,
            order: [
                ['createdAt', 'DESC'],
                [{ model: Comment, as: 'comments' }, 'createdAt', 'ASC'],
                [{ model: Comment, as: 'comments' }, { model: Comment, as: 'replies' }, 'createdAt', 'ASC']
            ]
        });
        res.json({ posts });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        const { content, image, type, sharedPostId } = req.body;
        const post = await Post.create({
            content,
            image,
            type,
            sharedPostId: sharedPostId || null,
            userId: req.user.id
        });

        const fullPost = await Post.findByPk(post.id, {
            include: postInclude
        });

        res.status(201).json({ post: fullPost });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/posts/:id/react
// @desc    React to a post (emoji reactions)
// @access  Private
router.post('/:id/react', protect, async (req, res, next) => {
    try {
        const { type } = req.body;
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        let reactions = [...(post.reactions || [])];
        const existingIndex = reactions.findIndex(r => r.userId === req.user.id);

        if (existingIndex !== -1) {
            if (reactions[existingIndex].type === type) {
                reactions.splice(existingIndex, 1);
            } else {
                reactions[existingIndex].type = type;
            }
        } else {
            reactions.push({ userId: req.user.id, type });
        }

        await post.update({ reactions });
        res.json({ reactions });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment (or reply)
// @access  Private
router.post('/:id/comments', protect, async (req, res, next) => {
    try {
        const { content, parentId } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const comment = await Comment.create({
            content,
            postId: req.params.id,
            userId: req.user.id,
            parentId: parentId || null
        });

        const fullComment = await Comment.findByPk(comment.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'avatar']
                },
                {
                    model: Comment,
                    as: 'replies',
                    include: [{
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'avatar']
                    }]
                }
            ]
        });

        res.status(201).json({ comment: fullComment });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/posts/comments/:id/react
// @desc    React to a comment
// @access  Private
router.post('/comments/:id/react', protect, async (req, res, next) => {
    try {
        const { type } = req.body;
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        let reactions = [...(comment.reactions || [])];
        const existingIndex = reactions.findIndex(r => r.userId === req.user.id);

        if (existingIndex !== -1) {
            if (reactions[existingIndex].type === type) {
                reactions.splice(existingIndex, 1);
            } else {
                reactions[existingIndex].type = type;
            }
        } else {
            reactions.push({ userId: req.user.id, type });
        }

        await comment.update({ reactions });
        res.json({ reactions });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await post.destroy();
        res.json({ message: 'Post removed' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
