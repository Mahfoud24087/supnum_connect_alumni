const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
    body('fullName').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('supnumId').notEmpty().withMessage('SupNum ID is required'),
    body('role').isIn(['student', 'graduate']).withMessage('Invalid role')
], async (req, res, next) => {
    try {
        const { fullName, email, password, supnumId, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email }, { supnumId }]
            }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name: fullName,
            email,
            password,
            supnumId,
            role: role || 'student',
            status: 'Pending'
        });

        res.status(201).json({
            message: 'Registration successful! Please wait for admin approval.',
            user: { id: user.id, name: user.name, status: user.status }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check for user (include password for verification)
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check approval status
        if (user.status === 'Pending') {
            return res.status(403).json({ message: 'Your account is pending admin approval.' });
        }
        if (user.status === 'Suspended') {
            return res.status(403).json({ message: 'Your account has been suspended.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            token,
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json({ user: req.user.toJSON() });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
    try {
        const allowedUpdates = ['name', 'bio', 'location', 'avatar', 'phone', 'birthday', 'workStatus', 'jobTitle', 'company', 'cvUrl', 'gallery'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                let value = req.body[field];
                if ((field === 'birthday' || field === 'workStatus') && value === '') {
                    value = null;
                }
                updates[field] = value;
            }
        });

        // Handle social media separately
        if (req.body.social) {
            if (req.body.social.linkedin !== undefined) updates.socialLinkedin = req.body.social.linkedin;
            if (req.body.social.github !== undefined) updates.socialGithub = req.body.social.github;
            if (req.body.social.facebook !== undefined) updates.socialFacebook = req.body.social.facebook;
        }

        await req.user.update(updates);

        res.json({ user: req.user.toJSON() });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
