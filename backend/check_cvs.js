const { User, sequelize } = require('./models');

async function checkCVs() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const count = await User.count({
            where: {
                cvUrl: { [require('sequelize').Op.ne]: null }
            }
        });

        console.log(`Found ${count} users with CVs.`);

        if (count === 0) {
            console.log('Adding mock CV to a student for testing...');
            const student = await User.findOne({ where: { role: 'student' } });

            if (student) {
                // Using a base64 dummy PDF or just a string URL for test
                const dummyCV = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
                await student.update({ cvUrl: dummyCV });
                console.log(`Updated ${student.name} (${student.email}) with mock CV: ${dummyCV}`);
            } else {
                console.log('No student user found to update.');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkCVs();
