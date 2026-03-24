require('dotenv').config();
const { Internship, User } = require('./models');
const { connectDB } = require('./config/database');

async function cleanupFakeOffers() {
    try {
        await connectDB();
        
        // Find all internships with "Test" in title, or very short titles, or created by non-admin graduates
        const fakeOffers = await Internship.findAll({
            where: {
                [require('sequelize').Op.or]: [
                    { title: { [require('sequelize').Op.iLike]: '%test%' } },
                    { title: { [require('sequelize').Op.iLike]: '%demo%' } },
                    { title: { [require('sequelize').Op.iLike]: '%Consultant%' } },
                    { title: { [require('sequelize').Op.iLike]: '%Formation%' } },
                    { company: { [require('sequelize').Op.iLike]: '%test%' } }
                ]
            }
        });

        console.log(`Found ${fakeOffers.length} fake offers to delete.`);
        
        for (const offer of fakeOffers) {
            console.log(`Deleting: ${offer.title} (${offer.company})`);
            await offer.destroy();
        }

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

cleanupFakeOffers();
