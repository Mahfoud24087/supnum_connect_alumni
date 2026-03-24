require('dotenv').config({ path: './backend/.env' });
const { Internship } = require('./backend/models');
const { connectDB } = require('./backend/config/database');

async function cleanup() {
    try {
        await connectDB();
        
        // Find and delete the "Test1" and other potential fakes
        const killedCount = await Internship.destroy({
            where: {
                [require('sequelize').Op.or]: [
                    { title: { [require('sequelize').Op.iLike]: '%Test%' } },
                    { title: { [require('sequelize').Op.iLike]: '%Consultant%' } },
                    { company: { [require('sequelize').Op.iLike]: '%fake%' } }
                ]
            }
        });
        
        console.log(`Deleted ${killedCount} fake offers.`);
        process.exit(0);
    } catch (e) { 
        console.error(e); 
        process.exit(1); 
    }
}
cleanup();
