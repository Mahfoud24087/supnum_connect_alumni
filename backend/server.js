require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const companyRoutes = require('./routes/companies');
const internshipRoutes = require('./routes/internships');
const messageRoutes = require('./routes/messages');
const applicationRoutes = require('./routes/applications');
const notificationRoutes = require('./routes/notifications');
const postRoutes = require('./routes/posts');

const app = express();

// Connect to database and initialize admin
const { User } = require('./models');
const initApp = async () => {
    const isConnected = await connectDB();
    if (isConnected) {
        try {
            console.log('🔍 Checking for admin account...');
            let admin = await User.findOne({ where: { email: 'admin@supnum.mr' } });

            if (!admin) {
                console.log('👷 Creating default admin user...');
                admin = await User.create({
                    name: 'admin',
                    email: 'admin@supnum.mr',
                    password: 'admin123',
                    supnumId: 'ADMIN001',
                    role: 'admin',
                    status: 'Verified',
                    bio: 'System Administrator'
                });
                console.log('✅ Admin user created successfully');
            } else {
                console.log('👤 Admin already exists, ensuring role and status...');
                admin.role = 'admin';
                admin.status = 'Verified';
                admin.password = 'admin123';
                await admin.save();
                console.log('✅ Admin account synchronized');
            }
        } catch (err) {
            console.error('❌ Failed to initialize admin:', err.message);
        }
    }
};
if (require.main === module) {
    initApp();
}

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin images/resources
}));

// CORS - Must be before routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - MUST be before any middleware that reads req.body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import custom limiters
const progressiveAuthLimiter = require('./middleware/authLimiter');

// Rate limiting - General
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, 
    message: { message: 'Too many requests from this IP, please try again after 5 minutes' }
});

app.use('/api/', limiter);
app.use('/api/auth/login', progressiveAuthLimiter);
app.use('/api/auth/register', progressiveAuthLimiter);

app.disable('x-powered-by');
app.use(compression());

const path = require('path');

// Serve static files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SupNum Connect API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const http = require('http');
const { initSocket } = require('./utils/socket');

const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
    });
}

module.exports = { app, server };
