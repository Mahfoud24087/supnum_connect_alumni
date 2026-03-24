require('dotenv').config();
const { User } = require('./models');
const { connectDB, sequelize } = require('./config/database');

async function checkUser() {
    try {
        await connectDB();
        const users = await User.findAll({ attributes: ['name', 'role', 'workStatus', 'jobTitle', 'company'] });
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUser();
