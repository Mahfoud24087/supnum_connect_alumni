require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const { User, Company, Internship, Event, Application, Connection, Message, Notification, Post, Comment, SkillEndorsement } = require('../models');

const resetDatabase = async () => {
    try {
        await connectDB();
        console.log('🗑️  Wiping database (force sync)...');
        
        // This will drop all tables and recreate them based on models
        await sequelize.sync({ force: true });
        
        console.log('✅ Database wiped successfully.');

        // Recreate default admin
        console.log('👷 Creating default admin user...');
        await User.create({
            name: 'admin',
            email: 'admin@supnum.mr',
            password: 'admin123',
            supnumId: 'ADMIN001',
            role: 'admin',
            status: 'Verified',
            bio: 'System Administrator'
        });
        
        console.log('✅ Admin user recreated (admin@supnum.mr / admin123).');
        console.log('✨ Your project is now clean and ready for REAL data!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during reset:', error);
        process.exit(1);
    }
};

resetDatabase();
