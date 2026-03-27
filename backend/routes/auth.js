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
    body('supnumId').custom((value, { req }) => {
        if (req.body.role !== 'other' && !value) {
            throw new Error('SupNum ID is required for students and graduates');
        }
        return true;
    }),
    body('role').isIn(['student', 'graduate', 'other', 'company']).withMessage('Invalid role'),
    body('graduationYear').custom((value, { req }) => {
        if (req.body.role === 'graduate' && !value) {
            throw new Error('Graduation year is required for graduates');
        }
        return true;
    }),
    body('specialty').custom((value, { req }) => {
        const needsSpecialty = ['graduate', 'student'].includes(req.body.role);
        if (needsSpecialty && !value) {
            throw new Error('Specialty (Filière) is required');
        }
        return true;
    })
], async (req, res, next) => {
    try {
        const { fullName, email, password, supnumId, role, graduationYear, specialty, jobTitle, company, workStatus } = req.body;

        // Check if user exists
        const whereClause = {
            [require('sequelize').Op.or]: [{ email }]
        };

        if (supnumId && role !== 'company' && role !== 'other') {
            whereClause[require('sequelize').Op.or].push({ supnumId });
        }

        const userExists = await User.findOne({
            where: whereClause
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email or ID already exists' });
        }

        // Verification Logic: Only graduates and companies need manual approval
        const status = (role === 'graduate' || role === 'company') ? 'Pending' : 'Verified';

        // Create user
        const user = await User.create({
            name: fullName,
            email,
            password,
            supnumId: (role === 'company' || role === 'other') ? null : supnumId,
            role: role || 'student',
            status,
            graduationYear: role === 'graduate' ? graduationYear : null,
            specialty: (role === 'graduate' || role === 'student') ? specialty : '',
            jobTitle: role === 'graduate' ? jobTitle : '',
            company: role === 'graduate' ? company : '',
            workStatus: role === 'graduate' ? workStatus : ''
        });

        const successMessage = status === 'Pending' 
            ? 'Registration successful! Please wait for admin approval.' 
            : 'Registration successful! You can now sign in.';

        res.status(201).json({
            message: successMessage,
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
            return res.status(403).json({ 
                message: 'Your account is pending admin approval.',
                errorCode: 'PENDING_APPROVAL'
            });
        }
        if (user.status === 'Suspended') {
            return res.status(403).json({ 
                message: 'Your account has been suspended.',
                errorCode: 'ACCOUNT_SUSPENDED'
            });
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
        const allowedUpdates = ['name', 'bio', 'location', 'avatar', 'phone', 'birthday', 'workStatus', 'jobTitle', 'company', 'cvUrl', 'gallery', 'graduationYear', 'specialty', 'website', 'industry', 'foundationYear', 'contactEmail', 'latitude', 'longitude', 'socialTwitter', 'socialYoutube', 'skills'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                let value = req.body[field];
                if ((field === 'birthday' || field === 'workStatus' || field === 'latitude' || field === 'longitude' || field === 'foundationYear' || field === 'graduationYear') && value === '') {
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
            if (req.body.social.twitter !== undefined) updates.socialTwitter = req.body.social.twitter;
            if (req.body.social.youtube !== undefined) updates.socialYoutube = req.body.social.youtube;
        }

        console.log('Final updates object:', JSON.stringify(updates, null, 2));
        
        await req.user.update(updates);
        
        // Re-fetch to ensure we have all fields from the DB
        const refreshedUser = await User.findByPk(req.user.id);
        const userJson = refreshedUser.toJSON();
        
        console.log('Sending back refreshed user JSON:', JSON.stringify(userJson, null, 2));

        res.json({ user: userJson });
    } catch (error) {
        console.error('Profile update error:', error);
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
