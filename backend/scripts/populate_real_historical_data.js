require('dotenv').config();
const { sequelize, connectDB } = require('../config/database');
const { User, Company, Internship, Event, Application } = require('../models');
const { Op } = require('sequelize');

const populateHistoricalData = async () => {
    try {
        await connectDB();

        console.log('🌱 Starting historical data population...');

        // 0. Clear existing data to avoid duplicates
        await Application.destroy({ where: {}, cascade: true });
        await Internship.destroy({ where: {}, cascade: true });
        await Company.destroy({ where: {}, cascade: true });
        await User.destroy({ where: { role: { [Op.ne]: 'admin' } }, cascade: true });

        console.log('🗑️  Cleaned existing non-admin data');
        const companiesCount = await Company.count();
        if (companiesCount < 50) {
            const companyNames = [
                'Mauritel', 'Chinguittel', 'Mattel', 'SNIM', 'Banque Centrale',
                'BMCI', 'BNM', 'Société Générale', 'Startup GIE', 'Tech-MR'
            ];
            for (let i = 0; i < 50; i++) {
                await Company.create({
                    name: `${companyNames[i % companyNames.length]} ${Math.floor(i / 10) || ''}`,
                    email: `contact@company${i}.com`,
                    password: 'password123',
                    industry: 'Digital',
                    location: 'Nouakchott',
                    description: 'Partner company'
                }).catch(() => { });
            }
            console.log('✅ Added ~50 Partner Companies');
        }

        // 2. Create Users (Students & Graduates) distributed over years
        // Target: 1310 total users
        // 2021: 200 (All students)
        // 2022: +240 (Total 440, all students)
        // 2023: +240 (Total 680, 200 become graduates)
        // 2024: +400 (Total 1080, 440 become graduates)
        // 2025: +230 (Total 1310, 440 remain graduates)

        const userSpecs = [
            { year: 2021, count: 200, graduates: 0 },
            { year: 2022, count: 240, graduates: 0 },
            { year: 2023, count: 240, graduates: 200 },
            { year: 2024, count: 400, graduates: 240 },
            { year: 2025, count: 230, graduates: 0 }
        ];

        const domains = ['DSI', 'RSS', 'IA', 'ISI', 'IDS', 'CNM'];
        let totalCreated = 0;

        for (const spec of userSpecs) {
            console.log(`Processing Year ${spec.year}...`);
            for (let i = 0; i < spec.count; i++) {
                const isGraduate = i < spec.graduates;
                const domain = domains[Math.floor(Math.random() * domains.length)];

                await User.create({
                    name: `Member ${spec.year}_${i}`,
                    email: `user_${spec.year}_${i}@example.com`,
                    password: 'password123',
                    supnumId: `${spec.year}_${String(i).padStart(3, '0')}`,
                    role: isGraduate ? 'graduate' : 'student',
                    status: 'Verified',
                    jobTitle: isGraduate ? domain : '',
                    createdAt: new Date(spec.year, Math.floor(Math.random() * 12), 1)
                }).catch(() => { });
                totalCreated++;
            }
        }

        // 3. Create some Internships/Jobs
        const companies = await Company.findAll();
        for (let i = 0; i < 30; i++) {
            const company = companies[i % companies.length];
            await Internship.create({
                title: i % 2 === 0 ? 'Full-stack Developer' : 'Systems Admin Internship',
                company: company.name,
                location: 'Nouakchott / Remote',
                description: 'Exciting opportunity at ' + company.name,
                requirements: 'Basic knowledge',
                type: i % 3 === 0 ? 'Full-time' : 'Internship',
                active: true,
                deadline: new Date(2025, 5, 30),
                companyId: company.id
            }).catch(() => { });
        }
        console.log('✅ Added 30 Internships/Jobs');

        // 4. Create some Applications
        const users = await User.findAll({ where: { role: 'student' }, limit: 100 });
        const internships = await Internship.findAll({ limit: 20 });
        for (let i = 0; i < 50; i++) {
            const user = users[i % users.length];
            const internship = internships[i % internships.length];
            await Application.create({
                userId: user.id,
                internshipId: internship.id,
                status: ['pending', 'accepted', 'rejected'][i % 3],
                cvUrl: 'sample.pdf'
            }).catch(() => { });
        }
        console.log('✅ Added 50 Applications');

        console.log(`✅ Population Complete. Total processed entries: ${totalCreated}`);

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during population:', error);
        process.exit(1);
    }
};

populateHistoricalData();
