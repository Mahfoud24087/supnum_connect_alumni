import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    EN: {
        nav: { home: 'Home', events: 'Events', about: 'About', signin: 'Sign In', signup: 'Sign Up' },
        dashboard: {
            nav: { dashboard: 'Dashboard', profile: 'Profile', users: 'Users', friends: 'Friends', messages: 'Messages' },
            welcome: 'Welcome,',
            welcomeSubtitle: "Here's what's happening in your SupNum network.",
            stats: { totalUsers: 'Total Users', friends: 'Your Friends', pending: 'Pending Requests' },
            quickLinks: { findUsers: 'Find Users', messages: 'Messages', events: 'Events' },
            friendRequests: 'Friend Requests',
            suggestions: 'Connection Suggestions',
            viewMore: 'View more',
            accept: 'Accept',
            decline: 'Decline'
        },
        admin: {
            nav: { dashboard: 'Dashboard', events: 'Manage Events', users: 'Manage Users', applications: 'Applications' },
            welcome: 'Admin Dashboard',
            subtitle: 'Manage your SupNum Connect platform.',
            stats: { totalUsers: 'Total Users', students: 'Students', graduates: 'Graduates' },
            charts: {
                userGrowth: 'User Growth',
                students: 'Students',
                graduates: 'Graduates',
                graduatesGrowth: 'Graduates Growth Over Time',
                employmentDomains: 'Employment Domains',
                opportunitiesPosted: 'Opportunities Posted',
                jobs: 'Jobs',
                internships: 'Internships'
            },
            events: { title: 'Recent Events', create: 'Create Event', edit: 'Edit', delete: 'Delete', learnMore: 'Learn More', days: 'Days' },
            users: { title: 'Manage Users', search: 'Search users...', role: 'Role', actions: 'Actions', remove: 'Remove' }
        },
        profile: {
            title: 'My Profile',
            basicInfo: 'Basic Information',
            fullName: 'Full Name',
            supnumId: 'SupNum ID',
            role: 'Role',
            bio: 'Bio',
            socialLinks: 'Social Links',
            saveChanges: 'Save Changes',
            uploadPhoto: 'Upload Photo',
            student: 'Student',
            graduate: 'Graduate',
            bioPlaceholder: 'Tell us about yourself...',
            locationPlaceholder: 'e.g. Nouakchott, Mauritania',
            jobPlaceholder: 'e.g. Software Engineer',
            companyPlaceholder: 'e.g. Tech Corp'
        },
        hero: {
            welcome: 'Welcome to the SupNum Community',
            title: 'Connect, Learn & Grow with',
            subtitle: 'The official social network for Institut Supérieur Numérique graduates. Build connections, participate in events, and advance your career.',
            getStarted: 'Get Started',
            learnMore: 'Learn More'
        },
        stats: {
            community: 'Our Growing Community',
            communityDesc: 'Join tens of SupNum graduates building the future of technology in Mauritania.',
            totalUsers: 'Total Users',
            students: 'Alumni',
            graduates: 'Graduates',
            events: 'Events',
            challenges: 'Challenges',
            contests: 'Contests'
        },
        events: {
            title: 'Upcoming Events',
            subtitle: 'Participate in events, challenges, and contests to enhance your skills and connect with peers.',
            viewAll: 'View All Events',
            learnMore: 'Learn More'
        },
        cta: {
            title: 'Ready to Join the SupNum Community?',
            subtitle: 'Connect with fellow graduates, access exclusive opportunities, and be part of the next generation of tech leaders in Mauritania.',
            button: "Join Now – It's Free"
        },
        footer: {
            rights: 'All rights reserved.',
            home: 'Home',
            findAlumni: 'Find Alumni',
            internships: 'Internships',
            companies: 'Companies',
            signOut: 'Sign Out',
            language: 'Language'
        },
        landing: {
            activeCommunity: 'Active Community',
            currentStudents: 'Current Students',
            alumniNetwork: 'Alumni Network',
            upcomingTerm: 'Upcoming this term',
            oppsTitle: 'Opportunities & Partners',
            oppsSubtitle: 'Connect with top companies and find your next career move.',
            partnerCompanies: 'Partner Companies',
            activeInternships: 'Active Internships',
            latestOpps: 'Latest Opportunities',
            view: 'View',
            apply: 'Apply',
            noOpps: 'No active opportunities at the moment.',
            studentsByYear: 'Students by Entry Year',
            graduatesByPromo: 'Graduates by Promotion',
            communityGrowth: 'Community Growth Over Years',
            viewDetails: 'View Details',
            noEvents: 'No upcoming events at the moment. Check back later!',
            eventsTitle: 'Events & Challenges'
        },
        common: {
            close: 'Close',
            back: 'Back'
        },
        aboutPage: {
            title: 'About SupNum Connect',
            lead: 'SupNum Connect is the official social-academic network for the Institut Supérieur Numérique (SupNum).',
            missionTitle: 'Our Mission',
            missionText: 'To create a vibrant, interconnected community where students, graduates, and administrators can collaborate, share knowledge, and grow together. We believe in the power of networking to unlock new opportunities and foster academic excellence.',
            goalsTitle: 'Key Goals',
            goals: {
                connect: 'Connect current students with alumni',
                mentorship: 'Facilitate mentorship and guidance',
                events: 'Centralize campus events and news',
                achievements: 'Showcase student achievements'
            },
            builtByTitle: 'Built by Students, for Students',
            builtByText: 'This platform was created as a project by SupNum students, demonstrating the technical skills and innovation fostered at our institute.',
            founded: 'Founded',
            institute: 'Institute'
        },
        auth: {
            welcomeBack: 'Welcome back to your alumni community. Connect, grow, and succeed together.',
            signInTitle: 'Sign in to your account',
            signInSubtitle: 'Enter your credentials to continue',
            email: 'Email Address',
            password: 'Password',
            signInButton: 'Sign In',
            signingIn: 'Signing in...',
            newToSupNum: 'New to SupNum Connect?',
            createAccount: 'Create an account',
            connectAlumni: 'Connect with Alumni',
            securePlatform: 'Secure Platform',
            verifiedProfiles: 'Verified Profiles',
            invalidCredentials: 'Invalid email or password',
            unexpectedError: 'An unexpected error occurred. Please try again.',
            signup: {
                title: 'Create your account',
                subtitle: 'Start your journey with SupNum Connect today',
                fullName: 'Full Name',
                supnumId: 'SupNum ID',
                email: 'Email Address',
                password: 'Password',
                button: 'Create Account',
                creating: 'Creating account...',
                alreadyHaveAccount: 'Already have an account?',
                signIn: 'Sign in',
                brandingTitle: 'Join the elite network of SupNum graduates',
                features: {
                    connect: 'Connect with alumni and industry leaders',
                    access: 'Access exclusive job and internship opportunities',
                    participate: 'Participate in professional events and workshops',
                    mentor: 'Mentor the next generation of students'
                }
            }
        },
        findFriends: {
            title: 'Find Alumni',
            subtitle: 'Connect with fellow graduates and grow your network',
            searchPlaceholder: 'Search by name, company, or job...',
            noResults: 'No graduates found. Try a different search term.',
            connected: 'Connected',
            respond: 'Respond to Request'
        },
        friends: {
            title: 'My Network',
            pendingRequests: 'Pending Requests',
            connections: 'Connections',
            noConnections: "You haven't connected with anyone yet.",
            startFinding: 'Start finding alumni',
            accept: 'Accept',
            decline: 'Decline'
        },
        search: {
            title: 'Find People',
            placeholder: 'Search by name or SupNum ID (e.g., 2YXXX)...',
            viewProfile: 'View Profile',
            noResults: 'No users found matching your search.',
            requestSent: 'Connection request sent!'
        },
        messages: {
            title: 'Messages',
            noConversations: 'No conversations yet. Connect with alumni to start chatting!',
            newConversation: 'New conversation',
            activeNow: 'Active now',
            placeholder: 'Type a message...',
            selectPrompt: 'Select a conversation to start messaging',
            error: 'Failed to send message'
        },
        apply: {
            title: 'Apply for Opportunity',
            notFound: 'Opportunity not found',
            goBack: 'Go Back',
            successTitle: 'Application Sent!',
            successSubtitle: 'Your application for {title} has been submitted successfully.',
            redirecting: 'Redirecting to dashboard...',
            back: 'back',
            positionDetails: 'Position Details',
            candidateInfo: 'Candidate Information',
            emailLabel: 'Email Address',
            phoneLabel: 'Phone Number',
            cvLabel: 'CV / Portfolio (PDF or Image)',
            uploadText: 'Click to upload CV (Max 5MB)',
            additionalInfo: 'Additional Information',
            messageToAdmin: 'Message to Administration',
            messagePlaceholder: 'Briefly explain why you are applying...',
            submitting: 'Submitting...',
            submit: 'Submit Application'
        }
    },
    FR: {
        nav: { home: 'Accueil', events: 'Événements', about: 'À propos', signin: 'Se connecter', signup: "S'inscrire" },
        dashboard: {
            nav: { dashboard: 'Tableau de bord', profile: 'Profil', users: 'Utilisateurs', friends: 'Amis', messages: 'Messages' },
            welcome: 'Bienvenue,',
            welcomeSubtitle: "Voici ce qui se passe dans votre réseau SupNum.",
            stats: { totalUsers: 'Total Utilisateurs', friends: 'Vos Amis', pending: 'Demandes en attente' },
            quickLinks: { findUsers: 'Trouver des utilisateurs', messages: 'Messages', events: 'Événements' },
            friendRequests: "Demandes d'amis",
            suggestions: 'Suggestions de connexions',
            viewMore: 'Voir plus',
            accept: 'Accepter',
            decline: 'Refuser',
            welcomeBackTitle: 'Bon retour !',
            welcomeBackSubtitle: 'Vous vous êtes connecté avec succès.'
        },
        admin: {
            nav: { dashboard: 'Tableau de bord', events: 'Gérer événements', users: 'Gérer utilisateurs', applications: 'Candidatures' },
            welcome: 'Tableau de bord Admin',
            subtitle: 'Gérez votre plateforme SupNum Connect.',
            stats: { totalUsers: 'Total Utilisateurs', students: 'Étudiants', graduates: 'Diplômés' },
            charts: {
                userGrowth: 'Croissance des utilisateurs',
                students: 'Étudiants',
                graduates: 'Diplômés',
                graduatesGrowth: 'Croissance des diplômés au fil du temps',
                employmentDomains: "Secteurs d'emploi",
                opportunitiesPosted: 'Opportunités publiées',
                jobs: 'Emplois',
                internships: 'Stages'
            },
            events: { title: 'Événements Récents', create: 'Créer un événement', edit: 'Modifier', delete: 'Supprimer', learnMore: 'En savoir plus', days: 'Jours' },
            users: { title: 'Gérer les utilisateurs', search: 'Rechercher...', role: 'Rôle', actions: 'Actions', remove: 'Supprimer' }
        },
        profile: {
            title: 'Mon Profil',
            basicInfo: 'Informations de base',
            fullName: 'Nom complet',
            supnumId: 'ID SupNum',
            role: 'Rôle',
            bio: 'Biographie',
            socialLinks: 'Liens sociaux',
            saveChanges: 'Enregistrer les modifications',
            uploadPhoto: 'Télécharger une photo',
            student: 'Étudiant',
            graduate: 'Diplômé',
            bioPlaceholder: 'Parlez-nous de vous...',
            locationPlaceholder: 'ex: Nouakchott, Mauritanie',
            jobPlaceholder: 'ex: Ingénieur Logiciel',
            companyPlaceholder: 'ex: Tech Corp'
        },
        hero: {
            welcome: 'Bienvenue dans la communauté SupNum',
            title: 'Connectez, Apprenez et Grandissez avec',
            subtitle: "Le réseau social officiel des diplômés de l'Institut Supérieur Numérique. Tissez des liens, participez à des événements et faites avancer votre carrière.",
            getStarted: 'Commencer',
            learnMore: 'En savoir plus'
        },
        stats: {
            community: 'Notre Communauté Grandissante',
            communityDesc: 'Rejoignez des dizaines de diplômés de SupNum qui construisent l\'avenir de la technologie en Mauritanie.',
            totalUsers: 'Utilisateurs Totaux',
            students: 'Étudiants',
            graduates: 'Diplômés',
            events: 'Événements',
            challenges: 'Défis',
            contests: 'Concours'
        },
        events: {
            title: 'Événements à Venir',
            subtitle: 'Participez à des événements, défis et concours pour améliorer vos compétences et vous connecter avec vos pairs.',
            viewAll: 'Voir tous les événements',
            learnMore: 'En savoir plus'
        },
        cta: {
            title: 'Prêt à rejoindre la communauté SupNum ?',
            subtitle: "Connectez-vous avec d'autres diplômés, accédez à des opportunités exclusives et faites partie de la prochaine génération de leaders technologiques en Mauritanie.",
            button: "Rejoindre maintenant – C'est gratuit"
        },
        footer: {
            rights: 'Tous droits réservés.',
            home: 'Accueil',
            findAlumni: 'Trouver des anciens',
            internships: 'Stages',
            companies: 'Entreprises',
            signOut: 'Déconnexion',
            language: 'Langue'
        },
        landing: {
            activeCommunity: 'Communauté Active',
            currentStudents: 'Étudiants Actuels',
            alumniNetwork: 'Réseau des Anciens',
            upcomingTerm: 'À venir ce trimestre',
            oppsTitle: 'Opportunités & Partenaires',
            oppsSubtitle: 'Connectez-vous avec les meilleures entreprises et trouvez votre prochaine étape de carrière.',
            partnerCompanies: 'Entreprises Partenaires',
            activeInternships: 'Stages Actifs',
            latestOpps: 'Dernières Opportunités',
            view: 'Voir',
            apply: 'Postuler',
            noOpps: 'Aucune opportunité active pour le moment.',
            studentsByYear: "Étudiants par année d'entrée",
            graduatesByPromo: 'Diplômés par promotion',
            communityGrowth: 'Croissance de la communauté au fil des ans',
            viewDetails: 'Voir les détails',
            noEvents: 'Aucun événement à venir pour le moment. Revenez plus tard !',
            eventsTitle: 'Événements & Défis'
        },
        common: {
            save: 'Enregistrer les modifications',
            saving: 'Enregistrement...',
            saved: 'Modifications enregistrées avec succès !',
            error: 'Une erreur est survenue. Veuillez réessayer.',
            back: 'Retour',
            close: 'Fermer',
            cancel: 'Annuler',
            delete: 'Supprimer',
            edit: 'Modifier',
            view: 'Voir',
            loading: 'Chargement...',
            noData: 'Aucune donnée trouvée.',
            search: 'Rechercher...',
            name: 'Nom',
            email: 'Email',
            phone: 'Numéro de téléphone',
            location: 'Localisation',
            birthday: 'Date de naissance',
            jobTitle: 'Poste',
            company: 'Entreprise / Organisation',
            bio: 'Biographie',
            status: 'Statut',
            connect: 'Se connecter',
            message: 'Message',
            pending: 'Demande en attente',
            accept: 'Accepter la demande',
            social: 'Profils sociaux',
            noSocial: 'Aucun profil de réseaux sociaux lié.',
            noBio: 'Aucune biographie disponible.',
            linkedinProfile: 'Profil LinkedIn',
            githubProfile: 'Profil GitHub',
            facebookProfile: 'Profil Facebook',
            about: 'À propos',
            professionalInfo: 'Informations professionnelles',
            contactInfo: 'Coordonnées',
            workStatus: {
                label: 'Statut actuel',
                select: 'Sélectionner le statut',
                employed: 'Employé',
                seeking: 'À la recherche d\'opportunités',
                studying: 'Poursuite d\'études',
                freelance: 'Freelance'
            }
        },
        aboutPage: {
            title: 'À propos de SupNum Connect',
            lead: "SupNum Connect est le réseau social et académique officiel de l'Institut Supérieur Numérique (SupNum).",
            missionTitle: 'Notre Mission',
            missionText: 'Créer une communauté dynamique et interconnectée où étudiants, diplômés et administrateurs peuvent collaborer, partager des connaissances et grandir ensemble. Nous croyons au pouvoir du réseautage pour débloquer de nouvelles opportunités et favoriser l\'excellence académique.',
            goalsTitle: 'Objectifs Clés',
            goals: {
                connect: 'Connecter les étudiants actuels avec les diplômés',
                mentorship: 'Faciliter le mentorat et l\'orientation',
                events: 'Centraliser les actualités et événements du campus',
                achievements: 'Mettre en valeur les réalisations des étudiants'
            },
            builtByTitle: 'Conçu par des Étudiants, pour des Étudiants',
            builtByText: 'Cette plateforme a été créée en tant que projet par des étudiants de SupNum, démontrant les compétences techniques et l\'innovation encouragées au sein de notre institut.',
            founded: 'Fondé',
            institute: 'Institut'
        },
        auth: {
            welcomeBack: "Ravis de vous revoir dans votre communauté d'anciens. Connectez-vous, grandissez et réussissez ensemble.",
            signInTitle: "Connectez-vous à votre compte",
            signInSubtitle: "Entrez vos identifiants pour continuer",
            email: "Adresse Email",
            password: "Mot de passe",
            signInButton: "Se connecter",
            signingIn: "Connexion en cours...",
            newToSupNum: "Nouveau sur SupNum Connect ?",
            createAccount: "Créer un compte",
            connectAlumni: "Connectez-vous avec les anciens",
            securePlatform: "Plateforme sécurisée",
            verifiedProfiles: "Profils vérifiés",
            invalidCredentials: 'Email ou mot de passe invalide',
            unexpectedError: 'Une erreur est survenue. Veuillez réessayer.',
            signup: {
                title: 'Créez votre compte',
                subtitle: 'Commencez votre voyage avec SupNum Connect dès aujourd\'hui',
                fullName: 'Nom Complet',
                supnumId: 'ID SupNum',
                email: 'Adresse Email',
                password: 'Mot de passe',
                button: 'Créer un compte',
                creating: 'Création du compte...',
                alreadyHaveAccount: 'Vous avez déjà un compte ?',
                signIn: 'Se connecter',
                brandingTitle: 'Rejoignez le réseau d\'élite des diplômés de SupNum',
                features: {
                    connect: 'Connectez-vous avec des anciens et des leaders de l\'industrie',
                    access: 'Accédez à des opportunités exclusives d\'emploi et de stage',
                    participate: 'Participez à des événements et ateliers professionnels',
                    mentor: 'Devenez mentor pour la prochaine génération d\'étudiants'
                }
            }
        },
        findFriends: {
            title: 'Trouver des anciens',
            subtitle: 'Connectez-vous avec d\'autres diplômés et développez votre réseau',
            searchPlaceholder: 'Rechercher par nom, entreprise ou poste...',
            noResults: 'Aucun diplômé trouvé. Essayez un autre terme de recherche.',
            connected: 'Connecté',
            respond: 'Répondre à la demande'
        },
        friends: {
            title: 'Mon Réseau',
            pendingRequests: 'Demandes en attente',
            connections: 'Connexions',
            noConnections: "Vous n'êtes encore connecté avec personne.",
            startFinding: 'Commencer à trouver des anciens',
            accept: 'Accepter',
            decline: 'Refuser'
        },
        search: {
            title: 'Trouver des personnes',
            placeholder: 'Rechercher par nom ou identifiant SupNum (ex: 2YXXX)...',
            viewProfile: 'Voir le profil',
            noResults: 'Aucun utilisateur trouvé correspondant à votre recherche.',
            requestSent: 'Demande de connexion envoyée !'
        },
        messages: {
            title: 'Messages',
            noConversations: 'Pas encore de conversations. Connectez-vous avec des anciens pour commencer à discuter !',
            newConversation: 'Nouvelle conversation',
            activeNow: 'En ligne',
            placeholder: 'Tapez un message...',
            selectPrompt: 'Sélectionnez une conversation pour commencer à envoyer des messages',
            error: 'Échec de l\'envoi du message'
        },
        apply: {
            title: 'Postuler à l\'opportunité',
            notFound: 'Opportunité non trouvée',
            goBack: 'Retour',
            successTitle: 'Candidature envoyée !',
            successSubtitle: 'Votre candidature pour {title} a été soumise avec succès.',
            redirecting: 'Redirection vers le tableau de bord...',
            back: 'retour',
            positionDetails: 'Détails du poste',
            candidateInfo: 'Informations du candidat',
            emailLabel: 'Adresse Email',
            phoneLabel: 'Numéro de Téléphone',
            cvLabel: 'CV / Portfolio (PDF ou Image)',
            uploadText: 'Cliquez pour télécharger le CV (Max 5Mo)',
            additionalInfo: 'Informations supplémentaires',
            messageToAdmin: 'Message à l\'administration',
            messagePlaceholder: 'Expliquez brièvement pourquoi vous postulez...',
            submitting: 'Envoi en cours...',
            submit: 'Soumettre la candidature'
        }
    },
    AR: {
        nav: { home: 'الرئيسية', events: 'الأحداث', about: 'حول', signin: 'تسجيل الدخول', signup: 'إنشاء حساب' },
        dashboard: {
            nav: { dashboard: 'لوحة التحكم', profile: 'الملف الشخصي', users: 'المستخدمين', friends: 'الأصدقاء', messages: 'الرسائل' },
            welcome: 'مرحبًا،',
            welcomeSubtitle: 'إليك ما يحدث في شبكة SupNum الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', friends: 'أصدقاؤك', pending: 'طلبات معلقة' },
            quickLinks: { findUsers: 'البحث عن مستخدمين', messages: 'الرسائل', events: 'الأحداث' },
            friendRequests: 'طلبات الصداقة',
            suggestions: 'اقتراحات التواصل',
            viewMore: 'عرض المزيد',
            accept: 'قبول',
            decline: 'رفض',
            welcomeBackTitle: 'مرحباً بعودتك!',
            welcomeBackSubtitle: 'لقد قمت بتسجيل الدخول بنجاح.'
        },
        admin: {
            nav: { dashboard: 'لوحة التحكم', events: 'إدارة الأحداث', users: 'إدارة المستخدمين', applications: 'الطلبات' },
            welcome: 'لوحة تحكم المسؤول',
            subtitle: 'إدارة منصة SupNum Connect الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', students: 'الطلاب', graduates: 'الخريجين' },
            charts: {
                userGrowth: 'نمو المستخدمين',
                students: 'الطلاب',
                graduates: 'الخريجين',
                graduatesGrowth: 'نمو الخريجين بمرور الوقت',
                employmentDomains: 'مجالات العمل',
                opportunitiesPosted: 'الفرص المنشورة',
                jobs: 'وظائف',
                internships: 'تدريب'
            },
            events: { title: 'الأحداث الأخيرة', create: 'إنشاء حدث', edit: 'تعديل', delete: 'حذف', learnMore: 'المزيد', days: 'أيام' },
            users: { title: 'إدارة المستخدمين', search: 'البحث عن مستخدمين...', role: 'الدور', actions: 'إجراءات', remove: 'إزالة' }
        },
        profile: {
            title: 'ملفي الشخصي',
            basicInfo: 'المعلومات الأساسية',
            fullName: 'الاسم الكامل',
            supnumId: 'معرف SupNum',
            role: 'الدور',
            bio: 'نبذة عني',
            socialLinks: 'روابط التواصل الاجتماعي',
            saveChanges: 'حفظ التغييرات',
            uploadPhoto: 'رفع صورة',
            student: 'طالب',
            graduate: 'خريج',
            bioPlaceholder: 'أخبرنا عن نفسك...',
            locationPlaceholder: 'مثال: نواكشوط، موريتانيا',
            jobPlaceholder: 'مثال: مهندس برمجيات',
            companyPlaceholder: 'مثال: شركة تقنية'
        },
        hero: {
            welcome: 'مرحبًا بكم في مجتمع SupNum',
            title: 'تواصل، تعلم وتطور مع',
            subtitle: 'الشبكة الاجتماعية الرسمية لخريجي المعهد العالي للرقمنة. ابنِ علاقات، شارك في الأحداث، وطور مسارك المهني.',
            getStarted: 'ابدأ الآن',
            learnMore: 'المزيد'
        },
        stats: {
            community: 'مجتمعنا المتنامي',
            communityDesc: 'انضم إلى عشرات من خريجي SupNum الذين يبنون مستقبل التكنولوجيا في موريتانيا.',
            totalUsers: 'إجمالي المستخدمين',
            students: 'الطلاب',
            graduates: 'الخريجين',
            events: 'الأحداث',
            challenges: 'التحديات',
            contests: 'المسابقات'
        },
        events: {
            title: 'الأحداث القادمة',
            subtitle: 'شارك في الأحداث، التحديات، والمسابقات لتعزيز مهاراتك والتواصل مع أقرانك.',
            viewAll: 'عرض كل الأحداث',
            learnMore: 'اعرف المزيد'
        },
        cta: {
            title: 'مستعد للانضمام إلى مجتمع SupNum؟',
            subtitle: 'تواصل مع زملائك الخريجين، احصل على فرص حصرية، وكن جزءًا من الجيل القادم من قادة التكنولوجيا في موريتانيا.',
            button: 'انضم الآن – مجانًا'
        },
        footer: {
            rights: 'جميع الحقوق محفوظة.',
            home: 'الرئيسية',
            findAlumni: 'البحث عن الخريجين',
            internships: 'التربصات',
            companies: 'الشركات',
            signOut: 'تسجيل الخروج',
            language: 'اللغة'
        },
        landing: {
            activeCommunity: 'مجتمع نشط',
            currentStudents: 'الطلاب الحاليون',
            alumniNetwork: 'شبكة الخريجين',
            upcomingTerm: 'قادم هذا الفصل',
            oppsTitle: 'الفرص والشركاء',
            oppsSubtitle: 'تواصل مع كبرى الشركات وابحث عن خطوتك المهنية التالية.',
            partnerCompanies: 'الشركات الشريكة',
            activeInternships: 'التربصات النشطة',
            latestOpps: 'أحدث الفرص',
            view: 'عرض',
            apply: 'تقديم',
            noOpps: 'لا توجد فرص نشطة في الوقت الحالي.',
            studentsByYear: 'الطلاب حسب سنة الدخول',
            graduatesByPromo: 'الخريجون حسب الدفعة',
            communityGrowth: 'نمو المجتمع عبر السنين',
            viewDetails: 'عرض التفاصيل',
            noEvents: 'لا توجد أحداث قادمة في الوقت الحالي. عد لاحقًا!',
            eventsTitle: 'الأحداث والتحديات'
        },
        common: {
            save: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            saved: 'تم حفظ التغييرات بنجاح!',
            error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
            back: 'عودة',
            close: 'إغلاق',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            view: 'عرض',
            loading: 'جاري التحميل...',
            noData: 'لم يتم العثور على بيانات.',
            search: 'بحث...',
            name: 'الاسم',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            location: 'الموقع',
            birthday: 'تاريخ الميلاد',
            jobTitle: 'المسمى الوظيفي',
            company: 'الشركة / المؤسسة',
            bio: 'نبذة شخصية',
            status: 'الحالة',
            connect: 'تواصل',
            message: 'رسالة',
            pending: 'طلب معلق',
            accept: 'قبول الطلب',
            social: 'الحسابات الاجتماعية',
            noSocial: 'لم يتم ربط أي ملفات تعريف اجتماعية.',
            noBio: 'لا توجد سيرة ذاتية متاحة.',
            linkedinProfile: 'ملف LinkedIn',
            githubProfile: 'ملف GitHub',
            facebookProfile: 'ملف Facebook',
            about: 'حول',
            professionalInfo: 'المعلومات المهنية',
            contactInfo: 'معلومات الاتصال',
            workStatus: {
                label: 'الحالة الحالية',
                select: 'اختر الحالة',
                employed: 'موظف',
                seeking: 'يبحث عن فرص',
                studying: 'يواصل الدراسة',
                freelance: 'عمل حر (Freelance)'
            },
            noSocial: 'لا توجد روابط اجتماعية عامة.'
        },
        aboutPage: {
            title: 'حول SupNum Connect',
            lead: 'SupNum Connect هي الشبكة الاجتماعية والأكاديمية الرسمية للمعهد العالي للرقمنة (SupNum).',
            missionTitle: 'مهمتنا',
            missionText: 'خلق مجتمع حيوي ومترابط حيث يمكن للطلاب والخريجين والإداريين التعاون وتبادل المعرفة والنمو معًا. نؤمن بقوة التشبيك لفتح فرص جديدة وتعزيز التفوق الأكاديمي.',
            goalsTitle: 'الأهداف الرئيسية',
            goals: {
                connect: 'ربط الطلاب الحاليين بالخريجين',
                mentorship: 'تسهيل الإرشاد والتوجيه',
                events: 'تجميع أخبار وأحداث الحرم الجامعي',
                achievements: 'إبراز إنجازات الطلاب'
            },
            builtByTitle: 'بُنيت بواسطة الطلاب، للطلاب',
            builtByText: 'تم إنشاء هذه المنصة كمشروع من قبل طلاب SupNum، مما يبرز المهارات التقنية والابتكار الذي يُشجعه معهدنا.',
            founded: 'تأسست',
            institute: 'معهد'
        },
        auth: {
            welcomeBack: "مرحبًا بك مرة أخرى في مجتمع الخريجين الخاص بك. تواصل، تنمو، وانجح معًا.",
            signInTitle: "تسجيل الدخول إلى حسابك",
            signInSubtitle: "أدخل بيانات اعتمادك للمتابعة",
            email: "عنوان البريد الإلكتروني",
            password: "كلمة المرور",
            signInButton: "تسجيل الدخول",
            signingIn: "جاري تسجيل الدخول...",
            newToSupNum: "جديد في SupNum Connect؟",
            createAccount: "إنشاء حساب",
            connectAlumni: "تواصل مع الخريجين",
            securePlatform: "منصة آمنة",
            verifiedProfiles: "ملفات شخصية موثقة",
            invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صالحة',
            unexpectedError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            signup: {
                title: 'إنشاء حسابك',
                subtitle: 'ابدأ رحلتك مع SupNum Connect اليوم',
                fullName: 'الاسم الكامل',
                supnumId: 'معرف SupNum',
                email: 'عنوان البريد الإلكتروني',
                password: 'كلمة المرور',
                button: 'إنشاء حساب',
                creating: 'جاري إنشاء الحساب...',
                alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
                signIn: 'تسجيل الدخول',
                brandingTitle: 'انضم إلى شبكة النخبة من خريجي SupNum',
                features: {
                    connect: 'تواصل مع الخريجين وقادة الصناعة',
                    access: 'الوصول إلى فرص عمل وتدريب حصرية',
                    participate: 'المشاركة في الفعاليات والورش المهنية',
                    mentor: 'توجيه الجيل القادم من الطلاب'
                }
            }
        },
        findFriends: {
            title: 'البحث عن الخريجين',
            subtitle: 'تواصل مع زملائك الخريجين ووسع شبكتك',
            searchPlaceholder: 'البحث بالاسم، الشركة، أو الوظيفة...',
            noResults: 'لم يتم العثور على خريجين. جرب مصطلح بحث آخر.',
            connected: 'متصل',
            respond: 'الرد على الطلب'
        },
        friends: {
            title: 'شبكتي',
            pendingRequests: 'الطلبات المعلقة',
            connections: 'جهات الاتصال',
            noConnections: 'لم تتواصل مع أي شخص بعد.',
            startFinding: 'ابدأ بالبحث عن الخريجين',
            accept: 'قبول',
            decline: 'رفض'
        },
        search: {
            title: 'البحث عن الأشخاص',
            placeholder: 'البحث بالاسم أو معرف SupNum (مثال: 2YXXX)...',
            viewProfile: 'عرض الملف الشخصي',
            noResults: 'لم يتم العثور على مستخدمين يطابقون بحثك.',
            requestSent: 'تم إرسال طلب الاتصال!'
        },
        messages: {
            title: 'الرسائل',
            noConversations: 'لا توجد محادثات بعد. تواصل مع الخريجين لبدء الدردشة!',
            newConversation: 'محادثة جديدة',
            activeNow: 'نشط الآن',
            placeholder: 'اكتب رسالة...',
            selectPrompt: 'اختر محادثة لبدء المراسلة',
            error: 'فشل إرسال الرسالة'
        },
        apply: {
            title: 'التقدم للفرصة',
            notFound: 'الفرصة غير موجودة',
            goBack: 'رجوع',
            successTitle: 'تم إرسال الطلب!',
            successSubtitle: 'تم تقديم طلبك لـ {title} بنجاح.',
            redirecting: 'جاري التوجيه إلى لوحة التحكم...',
            back: 'رجوع',
            positionDetails: 'تفاصيل الوظيفة',
            candidateInfo: 'معلومات المترشح',
            emailLabel: 'عنوان البريد الإلكتروني',
            phoneLabel: 'رقم الهاتف',
            cvLabel: 'السيرة الذاتية / بورتفوليو (PDF أو صورة)',
            uploadText: 'انقر لتحميل السيرة الذاتية (بحد أقصى 5 ميجابايت)',
            additionalInfo: 'معلومات إضافية',
            messageToAdmin: 'رسالة إلى الإدارة',
            messagePlaceholder: 'اشرح باختصار سبب تقدمك...',
            submitting: 'جاري الإرسال...',
            submit: 'تقديم الطلب'
        }
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('FR');
    const [theme, setTheme] = useState('light');

    const t = translations[language];

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, theme, toggleTheme }}>
            <div dir={language === 'AR' ? 'rtl' : 'ltr'} className={language === 'AR' ? 'font-arabic' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
