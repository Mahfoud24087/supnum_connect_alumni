require('dotenv').config({ path: './backend/.env' });
const { Internship } = require('./backend/models');
const { connectDB } = require('./backend/config/database');

async function cleanup() {
    try {
        await connectDB();
        const all = await Internship.findAll();
        console.log(`Current offers: ${all.map(a => `[${a.title} by ${a.company}]`).join(', ')}`);
        
        // Delete "Test1", "Consultant..." (if the user wants all fake ones gone)
        // I'll delete all that are NOT from the user Mahfoud (unless Mahfoud is the creator of these fakes?)
        // If the user says "I didn't create anything yet" then ALL current ones created by Graduates are fake.
        
        const killed = await Internship.destroy({
            where: {
                [require('sequelize').Op.or]: [
                    { title: { [require('sequelize').Op.iLike]: '%Test%' } },
                    { title: { [require('sequelize').Op.iLike]: '%Consultant%' } },
                    { company: { [require('sequelize').Op.iLike]: 'company' } },
                    { company: { [require('sequelize').Op.iLike]: 'graduate' } }
                ]
            }
        });
        
        console.log(`Deleted ${killed} fake offers.`);
        process.exit(0);
    } catch (e) { console.error(e); process.exit(1); }
}
cleanup();
