const { User } = require('./backend/models');
const { sequelize } = require('./backend/config/database');

async function checkUser() {
    try {
        const users = await User.findAll({ attributes: ['name', 'role', 'workStatus', 'jobTitle', 'company'] });
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUser();
