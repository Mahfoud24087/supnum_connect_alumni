require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const { User, Company, Internship, Application } = require('../models');

const addMissingStats = async () => {
    try {
        await connectDB();
        console.log('Adding missing stats...');

        // Find Admin
        const admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            console.error('No admin found!');
            return;
        }

        // Add 50 Companies
        const companyNames = [
            'Mauritel', 'Chinguittel', 'Mattel', 'SNIM', 'Banque Centrale',
            'BMCI', 'BNM', 'Société Générale', 'Startup GIE', 'Tech-MR'
        ];
        for (let i = 0; i < 50; i++) {
            await Company.create({
                name: `${companyNames[i % companyNames.length]} ${Math.floor(i / 10) || ''}`,
                email: `contact@company_real_${i}_${Date.now()}@example.com`,
                password: 'password123',
                industry: 'Digital',
                location: 'Nouakchott'
            }).catch(() => { });
        }
        console.log('✅ Companies added');

        // Add 30 Internships
        const comps = await Company.findAll({ limit: 50 });
        for (let i = 0; i < 30; i++) {
            const comp = comps[i % comps.length];
            await Internship.create({
                title: i % 2 === 0 ? 'Full-stack Developer' : 'Systems Admin',
                company: comp.name,
                location: 'Nouakchott',
                description: 'Real opportunity at ' + comp.name,
                type: i % 3 === 0 ? 'Full-time' : 'Internship',
                active: true,
                createdById: admin.id,
                companyId: comp.id
            }).catch((e) => console.log('I-Error:', e.message));
        }
        console.log('✅ Internships added');

        // Add 50 Applications
        const students = await User.findAll({ where: { role: 'student' }, limit: 100 });
        const jobs = await Internship.findAll({ limit: 20 });
        if (students.length > 0 && jobs.length > 0) {
            for (let i = 0; i < 50; i++) {
                await Application.create({
                    userId: students[i % students.length].id,
                    internshipId: jobs[i % jobs.length].id,
                    status: ['pending', 'accepted', 'rejected'][i % 3],
                    cvUrl: 'file.pdf'
                }).catch(() => { });
            }
            console.log('✅ Applications added');
        }

        await sequelize.close();
    } catch (e) {
        console.error(e);
    }
};
addMissingStats();
