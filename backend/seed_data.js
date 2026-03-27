/**
 * seed_data.js
 * Run: node backend/seed_data.js
 * Seeds 6 real events + 11 real opportunities (across Mauritania cities) into the DB.
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { sequelize } = require('./config/database');
const { User, Event, Internship } = require('./models');

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ DB connected');

        // ── Find the admin user ────────────────────────────────
        const admin = await User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            console.error('❌ No admin user found. Create an admin first.');
            process.exit(1);
        }
        const adminId = admin.id;
        console.log(`👤 Using admin: ${admin.name} (${adminId})`);

        // ── 1. EVENTS ──────────────────────────────────────────
        const events = [
            {
                title: 'Hackathon SupNum 2025',
                type: 'Challenge',
                date: new Date('2025-04-20'),
                duration: 2,
                description: 'Un hackathon de 48 heures réunissant les meilleurs développeurs de SupNum pour concevoir des solutions numériques innovantes aux défis locaux. Les équipes de 3 à 5 membres compétitent pour des prix et des opportunités de stage.',
                color: 'bg-orange-500',
                stage: 'All',
                createdById: adminId
            },
            {
                title: 'Forum des Entreprises 2025',
                type: 'Event',
                date: new Date('2025-05-10'),
                duration: 1,
                description: 'Le Forum des Entreprises est le grand rendez-vous annuel entre les étudiants de SupNum et les entreprises partenaires. Plus de 20 entreprises mauritaniennes et internationales présentes pour des entretiens et des offres de stages et d\'emploi.',
                color: 'bg-blue-600',
                stage: 'All',
                createdById: adminId
            },
            {
                title: 'Conférence Intelligence Artificielle & Société',
                type: 'Event',
                date: new Date('2025-06-05'),
                duration: 1,
                description: 'Une conférence internationale sur l\'impact de l\'Intelligence Artificielle sur la société mauritanienne. Des experts en IA, des entrepreneurs tech et des décideurs politiques échangeront sur les enjeux et opportunités de la transformation numérique en Mauritanie.',
                color: 'bg-indigo-600',
                stage: 'All',
                createdById: adminId
            },
            {
                title: 'Concours Meilleure App Mobile',
                type: 'Contest',
                date: new Date('2025-07-15'),
                duration: 3,
                description: 'Les étudiants développent une application mobile répondant à un défi sociétal mauritanien (agriculture, santé, éducation ou transport). Un jury d\'experts sélectionne les meilleures applications. Le premier prix inclut un accompagnement d\'incubation et une dotation.',
                color: 'bg-green-600',
                stage: 'All',
                createdById: adminId
            },
            {
                title: 'Journée Portes Ouvertes SupNum',
                type: 'Event',
                date: new Date('2025-09-08'),
                duration: 1,
                description: 'Journée d\'accueil des nouveaux étudiants et de découverte des filières et projets de SupNum. Démonstrations de projets des étudiants, présentations des clubs, visite des laboratoires et networking avec les anciens élèves.',
                color: 'bg-teal-600',
                stage: 'All',
                createdById: adminId
            },
            {
                title: 'Cybersecurity Bowl 2025',
                type: 'Contest',
                date: new Date('2025-10-22'),
                duration: 2,
                description: 'Compétition de cybersécurité de type Capture The Flag (CTF) ouverte aux étudiants de SupNum. Les participants doivent résoudre des défis en cryptographie, forensics, reverse engineering et web security. Formation préparatoire gratuite pour tous les inscrits.',
                color: 'bg-red-600',
                stage: 'All',
                createdById: adminId
            }
        ];

        let eventsCount = 0;
        for (const ev of events) {
            const [, created] = await Event.findOrCreate({
                where: { title: ev.title },
                defaults: ev
            });
            if (created) eventsCount++;
        }
        console.log(`✅ Events seeded: ${eventsCount} new / ${events.length - eventsCount} already existed`);

        // ── 2. OPPORTUNITIES (11 across Mauritania) ────────────
        const opportunities = [
            {
                title: 'Développeur Full Stack',
                company: 'Mauritel',
                type: 'Job',
                workplaceType: 'On-site',
                targetAudience: 'Graduates',
                location: 'Nouakchott',
                description: 'Mauritel, premier opérateur télécom de Mauritanie, recrute un développeur Full Stack (React / Node.js). Vous travaillerez sur les applications internes de gestion client et les portails en ligne. Expérience : 1 à 3 ans. Avantages : mutuelle, prime annuelle.',
                startDate: new Date('2025-05-01'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Stage en Data Science',
                company: 'Banque Centrale de Mauritanie',
                type: 'Internship',
                workplaceType: 'On-site',
                targetAudience: 'Students',
                location: 'Nouakchott',
                description: 'La Banque Centrale de Mauritanie offre un stage de 3 mois en Data Science au sein de la Direction des Statistiques. Mission : analyse des données économiques nationales, développement de modèles de prévision et création de dashboards de reporting pour la direction générale.',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2025-08-31'),
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: false,
                createdById: adminId
            },
            {
                title: 'Ingénieur Réseaux & Sécurité',
                company: 'Chinguitel',
                type: 'Job',
                workplaceType: 'On-site',
                targetAudience: 'Graduates',
                location: 'Nouakchott',
                description: 'Chinguitel recrute un Ingénieur Réseaux & Sécurité pour renforcer son infrastructure nationale. Responsabilités : administration des équipements Cisco/Juniper, mise en œuvre des politiques de sécurité, monitoring et supervision du réseau. Bac+5 en informatique ou télécoms requis.',
                startDate: new Date('2025-04-15'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Stage Développement Web',
                company: 'Mauritanie Post',
                type: 'Internship',
                workplaceType: 'Hybrid',
                targetAudience: 'Students',
                location: 'Nouakchott',
                description: 'Stage de 2 mois au sein du département informatique de Mauritanie Post. Le stagiaire participera au développement et à la modernisation du portail clients, à la mise en place de nouvelles fonctionnalités e-commerce et à l\'optimisation des performances du site web.',
                startDate: new Date('2025-07-01'),
                endDate: new Date('2025-08-31'),
                active: true,
                requireCv: true,
                requireMessage: false,
                requirePhone: false,
                createdById: adminId
            },
            {
                title: 'Technicien Informatique',
                company: 'Société Nationale Industrielle et Minière (SNIM)',
                type: 'Job',
                workplaceType: 'On-site',
                targetAudience: 'All',
                location: 'Zouerate',
                description: 'La SNIM recrute un Technicien Informatique pour son site minier de Zouerate. Missions : maintenance du parc informatique (~500 postes), administration des serveurs Windows, support utilisateurs niveau 1 et 2, gestion du réseau local. Logement de fonction et indemnités inclus.',
                startDate: new Date('2025-05-15'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Analyste Cybersécurité',
                company: 'BAMIS - Banque Al Wava Mauritanienne Islamique',
                type: 'Job',
                workplaceType: 'On-site',
                targetAudience: 'Graduates',
                location: 'Nouakchott',
                description: 'BAMIS recherche un Analyste Cybersécurité pour protéger ses systèmes bancaires. Missions : surveillance des incidents de sécurité (SOC), réalisation d\'audits de vulnérabilité, mise en conformité avec les réglementations BCM, formation des employés aux bonnes pratiques. Certification CEH appréciée.',
                startDate: new Date('2025-06-01'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Stage en Génie Logiciel',
                company: 'Agence Mauritanienne pour l\'Information Numérique (AMIN)',
                type: 'Internship',
                workplaceType: 'On-site',
                targetAudience: 'Students',
                location: 'Nouakchott',
                description: 'L\'AMIN propose un stage de 3 mois en génie logiciel. Le stagiaire intégrera l\'équipe de développement pour contribuer à la digitalisation des services publics. Technologies utilisées : Java Spring Boot, Angular, PostgreSQL. Une expérience valorisante au cœur de la transformation numérique de l\'État.',
                startDate: new Date('2025-05-01'),
                endDate: new Date('2025-07-31'),
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: false,
                createdById: adminId
            },
            {
                title: 'Développeur Mobile (Flutter)',
                company: 'Masrvi Tech',
                type: 'Job',
                workplaceType: 'Remote',
                targetAudience: 'All',
                location: 'Nouadhibou',
                description: 'Startup mauritanienne spécialisée dans les solutions fintech recrute un développeur Flutter. Vous développerez des applications mobiles de paiement et de gestion financière pour les marchés d\'Afrique de l\'Ouest. Télétravail possible depuis Mauritanie. Rémunération compétitive en USD.',
                startDate: new Date('2025-04-20'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: false,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Formation & Stage DevOps',
                company: 'Orange Mauritanie',
                type: 'Training',
                workplaceType: 'Hybrid',
                targetAudience: 'All',
                location: 'Nouakchott',
                description: 'Orange Mauritanie lance un programme de formation-stage DevOps de 4 mois. Les participants apprennent Docker, Kubernetes, CI/CD (GitLab), et Terraform à travers des projets réels. Certification AWS Cloud Practitioner financée par Orange à la fin du programme. Ouvert aux étudiants et jeunes diplômés.',
                startDate: new Date('2025-06-15'),
                endDate: new Date('2025-10-15'),
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: false,
                createdById: adminId
            },
            {
                title: 'Ingénieur IA & Machine Learning',
                company: 'Centre Mauritanien de Recherche Scientifique (CNRST)',
                type: 'Job',
                workplaceType: 'On-site',
                targetAudience: 'Graduates',
                location: 'Rosso',
                description: 'Le CNRST recrute un ingénieur en IA pour ses projets de recherche appliquée sur l\'agriculture intelligente et la gestion des ressources hydriques. Vous développerez des modèles de machine learning pour l\'analyse satellite et la prévision des crues. Master ou doctorat en informatique ou mathématiques appliquées requis.',
                startDate: new Date('2025-07-01'),
                endDate: null,
                active: true,
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                createdById: adminId
            },
            {
                title: 'Stage Administration Système',
                company: 'Université de Nouakchott Al Aasriya',
                type: 'Internship',
                workplaceType: 'On-site',
                targetAudience: 'Students',
                location: 'Nouakchott',
                description: 'L\'Université de Nouakchott propose un stage de 2 mois en administration système au sein de sa direction informatique. Missions : gestion des serveurs Linux, administration Active Directory, déploiement et maintenance des équipements réseau campus. Attestation officielle délivrée à l\'issue du stage.',
                startDate: new Date('2025-08-01'),
                endDate: new Date('2025-09-30'),
                active: true,
                requireCv: true,
                requireMessage: false,
                requirePhone: false,
                createdById: adminId
            }
        ];

        let oppsCount = 0;
        for (const opp of opportunities) {
            const [, created] = await Internship.findOrCreate({
                where: { title: opp.title, company: opp.company },
                defaults: opp
            });
            if (created) oppsCount++;
        }
        console.log(`✅ Opportunities seeded: ${oppsCount} new / ${opportunities.length - oppsCount} already existed`);

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
