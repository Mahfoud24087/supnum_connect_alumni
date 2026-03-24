const { User, Internship, Application } = require('./models');

async function reseed() {
    try {
        await Application.destroy({ where: {} });
        await Internship.destroy({ where: {} });

        // Get the active admin
        const adminUser = await User.findOne({ where: { role: 'admin' } });
        if (!adminUser) {
            console.log("No admin found.");
            process.exit();
            return;
        }

        // Get some regular users (students or graduates) to act as applicants
        let students = await User.findAll({ where: { role: 'student' } });
        if (students.length === 0) {
            // Create dummy students if none exist
            const stu1 = await User.create({ name: 'Ahmed Student', email: 'ahmed@student.mr', password: 'password', role: 'student', phone: '40001234' });
            const stu2 = await User.create({ name: 'Fatima Graduate', email: 'fatima@student.mr', password: 'password', role: 'student', phone: '40005678' });
            students = [stu1, stu2];
        }

        const student1 = students[0];
        const student2 = students.length > 1 ? students[1] : students[0];
        const student3 = students.length > 2 ? students[2] : students[0];

        // Ensure internships are created precisely by the Admin
        const opp1 = await Internship.create({ 
            title: 'Senior Software Architect', 
            company: 'Mauritel Innovation Lab', 
            location: 'Nouakchott (Capital)', 
            type: 'Job', 
            createdById: adminUser.id,
            description: 'Leading the future of Mauritanian telecom structures.',
            active: true
        });
        
        const opp2 = await Internship.create({ 
            title: 'Maritime Data Analyst', 
            company: 'NDB Port Authority', 
            location: 'Nouadhibou (Economic Hub)', 
            type: 'Internship', 
            createdById: adminUser.id,
            description: 'Analyze deep-sea port logistics.',
            active: true
        });
        
        const opp3 = await Internship.create({ 
            title: 'Agricultural IoT Developer', 
            company: 'Rosso Smart Farms', 
            location: 'Rosso (Senegal River Valley)', 
            type: 'Job', 
            createdById: adminUser.id,
            description: 'Implementing IoT sensors for irrigation.',
            active: true
        });

        // Make the students apply to the admin-created opportunities
        await Application.create({
            userId: student1.id, 
            internshipId: opp1.id,
            status: 'accepted',
            message: 'I have 5 years of experience building scalable telecom APIs in NodeJS.',
            email: student1.email,
            phone: student1.phone || '40001122',
            customAnswers: {
                "Why do you want to work in Nouakchott?": "I am permanently based here and deeply passionate about empowering the local tech startup scene.",
                "How do you handle high-throughput microservices?": "I typically utilize Redis caching mechanisms paired with horizontally scaled Node pods."
            }
        });

        await Application.create({
            userId: student2.id,
            internshipId: opp2.id,
            status: 'pending',
            message: 'Fascinated by maritime trade analytics and algorithmic data tracking.',
            email: student2.email,
            phone: student2.phone || '40005566',
            customAnswers: {
                "Are you willing to relocate to Nouadhibou?": "Absolutely! I am extremely flexible and willing to relocate to Nouadhibou next month.",
                "What is your proficiency in Python and Pandas?": "Advanced. I recently completed my graduation project mapping out port cargo distributions using Pandas."
            }
        });

        await Application.create({
            userId: student3.id,
            internshipId: opp3.id,
            status: 'rejected',
            message: 'Looking for a junior agricultural tech position to start my career.',
            email: student3.email,
            phone: student3.phone || '36009988',
            customAnswers: {
                "Can you start working in Rosso on-site immediately?": "Unfortunately no. I require at least 3 months to wrap up my current engagements in the capital.",
                "Describe your experience with IoT LoRa gateways?": "I don't have practical experience yet, but I'm learning fast."
            }
        });

        console.log("Successfully re-seeded applications using authentic 'student' profiles exclusively pointing toward Admin opportunities!");

    } catch (e) {
        console.error(e);
    }
    process.exit();
}

reseed();
