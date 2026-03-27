require('dotenv').config();
const { sequelize, connectDB } = require('./config/database');
const { User, Event, Internship, Message, Connection, Application, Notification } = require('./models');

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data
        await Notification.destroy({ where: {}, truncate: true, cascade: true });
        await Application.destroy({ where: {}, truncate: true, cascade: true });
        await Connection.destroy({ where: {}, truncate: true, cascade: true });
        await Message.destroy({ where: {}, truncate: true, cascade: true });
        await Internship.destroy({ where: {}, truncate: true, cascade: true });
        await Event.destroy({ where: {}, truncate: true, cascade: true });
        // await Company.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });

        console.log('🗑️  Cleared all existing data');

        // Create ONLY the Admin User
        await User.create({
            name: 'admin',
            email: 'admin@supnum.mr',
            password: 'admin123',
            supnumId: 'ADMIN001',
            role: 'admin',
            status: 'Verified',
            bio: 'System Administrator'
        });

        console.log('✅ Created Admin Account');
        console.log('\n🎉 Database cleared! Only the admin account exists.');
        console.log('📝 Admin Account:');
        console.log('   Email:    admin@supnum.mr');
        console.log('   Password: admin123\n');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        await sequelize.close();
        process.exit(1);
    }
};

seedDatabase();
