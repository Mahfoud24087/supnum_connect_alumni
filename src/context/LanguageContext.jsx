import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    EN: {
        nav: { home: 'Home', events: 'Events', about: 'About', signin: 'Sign In', signup: 'Sign Up' },
        dashboard: {
            nav: { dashboard: 'Dashboard', profile: 'Profile', users: 'Users', friends: 'My Network', messages: 'Messages', feed: 'Feed' },
            welcome: 'Welcome,',
            welcomeSubtitle: "Here's what's happening in your SupNum network.",
            stats: { totalUsers: 'Total Users', friends: 'My Network', pending: 'Pending Requests' },
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
            stats: {
                totalUsers: 'Total Users',
                students: 'Students',
                graduates: 'Graduates',
                verifiedGrads: 'Verified Graduates',
                placementRate: 'Placement Rate',
                engagement: 'User Engagement',
                successRateLabel: 'Success Rate',
                successRateSubtitle: '(accepted candidates)',
                activeOpportunities: 'Active Opportunities',
                pendingRequests: 'Pending Requests',
                partnerCompanies: 'Partner Companies',
                applications: 'Applications',
                companyApplications: 'Company Route'
            },
            charts: {
                userGrowth: 'User Growth',
                students: 'Students',
                graduates: 'Graduates',
                graduatesGrowth: 'Graduates Growth Over Time',
                employmentDomains: 'Employment Domains',
                graduateEmploymentStatus: 'Graduate Employment Status',
                opportunitiesPosted: 'Opportunities Posted',
                jobs: 'Jobs',
                internships: 'Internships',
                institutionEvolution: 'Institution Evolution',
                genderParity: 'Gender Parity',
                usageHeatmap: 'Usage Heatmap',
                topCompetencies: 'Top Competencies',
                placementFunnel: 'Placement Funnel'
            },
            events: { title: 'Recent Events', create: 'Create Event', edit: 'Edit', delete: 'Delete', learnMore: 'Learn More', days: 'Days' },
            users: { title: 'Manage Users', search: 'Search users...', role: 'Role', actions: 'Actions', remove: 'Remove' },
            manageUsers: {
                title: 'User Management',
                allStatus: 'All Status',
                verified: 'Verified',
                pending: 'Pending',
                suspended: 'Suspended',
                exportCSV: 'Export CSV',
                approve: 'Approve',
                suspend: 'Suspend',
                reactivate: 'Reactivate',
                viewProfile: 'View Profile',
                removeUser: 'Remove User',
                noUsers: 'No users found.',
                confirmDelete: 'Are you sure you want to remove this user?',
                failedDelete: 'Failed to delete user',
                failedUpdate: 'Failed to update status',
                exportFailed: 'Export failed'
            },
            manageInternships: {
                title: 'Professional Opportunities',
                postOpportunity: 'Post Opportunity',
                searchPlaceholder: 'Search opportunities...',
                active: 'Active',
                closed: 'Closed',
                editOpportunity: 'Edit Opportunity',
                view: 'View',
                delete: 'Delete',
                confirmDelete: 'Are you sure you want to delete this opportunity?',
                failedDelete: 'Failed to delete internship',
                failedToggle: 'Failed to toggle status',
                filterTypes: {
                    all: 'All',
                    internship: 'Internships',
                    job: 'Jobs',
                    training: 'Trainings'
                },
                form: {
                    basicInfo: 'Basic Information',
                    details: 'Opportunity Details',
                    jobTitle: 'Job Title',
                    company: 'Company',
                    type: 'Opportunity Type',
                    targetAudience: 'Target Audience',
                    workplaceType: 'Workplace Type',
                    startDate: 'Start Date',
                    endDate: 'End Date',
                    location: 'Location',
                    appRequirements: 'Application Requirements',
                    requireCv: 'Require CV',
                    requireMessage: 'Require Message',
                    requirePhone: 'Require Phone',
                    activeListing: 'Active Listing',
                    customQuestions: 'Custom Questions',
                    addQuestion: 'Add Question',
                    noQuestions: 'No custom questions added.',
                    saveChanges: 'Save Changes',
                    cancel: 'Cancel',
                    questionLabel: 'Question Label (e.g. Portfolio Link)',
                    options: 'Options (comma separated)',
                    required: 'Required',
                    audiences: {
                        all: 'All Community',
                        students: 'Students Only',
                        graduates: 'Graduates Only'
                    },
                    workplace: {
                        onSite: 'On-site',
                        remote: 'Remote',
                        hybrid: 'Hybrid'
                    }
                }
            },
            manageApplications: {
                title: 'Job Applications',
                all: 'All',
                pending: 'Pending',
                accepted: 'Accepted',
                rejected: 'Rejected',
                contact: 'Applicant Contact & Message',
                additionalQuestions: 'Additional Questions',
                viewCv: 'View CV / Portfolio',
                noCv: 'No CV provided',
                reject: 'Reject',
                accept: 'Accept',
                noApplications: 'No applications found',
                noApplicationsDesc: 'Applications for internships and jobs will appear here.',
                companyRoute: 'Company Route',
                companyRouteTooltip: 'Total candidatures directly sent to companies'
            },
            manageCompanies: {
                title: 'Partner Companies',
                addCompany: 'Add Company',
                editCompany: 'Edit Company',
                searchPlaceholder: 'Search companies...',
                partner: 'Partner',
                confirmDelete: 'Are you sure you want to remove this company?',
                form: {
                    name: 'Company Name',
                    industry: 'Industry',
                    location: 'Location',
                    website: 'Website',
                    save: 'Save Changes',
                    add: 'Add Company',
                    cancel: 'Cancel'
                }
            }
        },
        company: {
            nav: {
                dashboard: 'Dashboard',
                offers: 'My Offers',
                applications: 'Applications',
                accepted: 'Accepted Candidates',
                messages: 'Messages',
                profile: 'Company Profile'
            },
            stats: {
                activeOffers: 'Active Offers',
                totalApplications: 'Total Applications',
                unreadMessages: 'Unread Messages',
                recentApplications: 'Recent Applications'
            },
            overview: {
                readyToHire: 'Ready to hire?',
                createOpp: 'Create a new professional opportunity to reach the best SupNum talent.',
                postOffer: 'Post New Offer',
                platformTips: 'Platform Tips',
                tipActive: 'Keep your offers active and detailed to receive more applications.',
                tipMessages: 'Regularly check your messages to respond quickly to interested candidates.',
                appliedFor: 'Applied for:'
            },
            dashboard: {
                portal: 'Partner Portal Dashboard',
                command: 'Command & Control,',
                subtitle: 'Track your recruitment pipeline in real-time. Manage candidates, monitor opportunity performance, and build your future team.',
                postOffer: 'Post New Opportunity',
                managePipeline: 'Manage Pipeline',
                conversion: 'Conversion',
                activeSlots: 'Active Slots',
                potentialTargets: 'New Potential Targets',
                velocity: 'Pipeline Velocity',
                pendingReview: 'Pending Review',
                acceptedTalent: 'Accepted Talent',
                activeReach: 'Active Reach',
                inventory: 'Your Live Inventory',
                arsenal: 'Entire Arsenal',
                potentialHires: 'Potential Hires:',
                posted: 'Posted:',
                rawTalents: 'Raw Talents',
                awaitingAssessment: 'Awaiting Assessment',
                reviewAll: 'Review All Candidates',
                optProfile: 'Optimize Profile',
                syncing: 'Syncing Recruitment Data...',
                pipelineClear: 'Pipeline Clear',
                zeroMatches: 'Zero Matches',
                refineLookup: 'The pipeline is clear. Refine your lookup criteria.',
                attractMore: 'Attract more students with a detailed bio.',
                bioTip: 'Companies with full descriptions get 40% more applications on average.'
            }
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
            other: 'Other',
            bioPlaceholder: 'Tell us about yourself...',
            locationPlaceholder: 'e.g. Nouakchott, Mauritania',
            jobPlaceholder: 'e.g. Software Engineer',
            companyPlaceholder: 'e.g. Tech Corp',
            cv: 'CV / Resume',
            downloadCv: 'Download CV',
            uploadCv: 'Upload CV (PDF)',
            gallery: 'Image Gallery',
            addGalleryImage: 'Add Image',
            skills: 'Skills'
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
            students: 'Students',
            graduates: 'Graduates',
            others: 'Others',
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
            internships: 'Opportunities',
            companies: 'Companies',
            signOut: 'Sign Out',
            language: 'Language'
        },
        landing: {
            activeCommunity: 'Active Community',
            currentStudents: 'Current Students',
            alumniNetwork: 'Alumni Network',
            othersNetwork: 'External Community',
            upcomingTerm: 'Upcoming this term',
            oppsTitle: 'Opportunities & Partners',
            oppsSubtitle: 'Connect with top companies and find your next career move.',
            partnerCompanies: 'Partner Companies',
            activeOpps: 'Active Opportunities',
            latestOpps: 'Latest Opportunities',
            types: {
                all: 'All',
                Internship: 'Internships',
                Job: 'Jobs',
                Training: 'Trainings'
            },
            filters: {
                location: '📍 Location: All',
                workplace: '🏢 Mode: All',
                pay: '💰 Pay: All',
                workplaceOnSite: 'On-site',
                workplaceRemote: 'Remote',
                workplaceHybrid: 'Hybrid',
                payPaid: 'Paid',
                payUnpaid: 'Unpaid'
            },
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
            roles: {
                student: 'Student',
                admin: 'Admin',
                graduate: 'Graduate',
                company: 'Company'
            },
            statusLabels: {
                verified: 'Verified',
                pending: 'Pending',
                suspended: 'Suspended',
                active: 'Active',
                inactive: 'Inactive'
            },
            close: 'Close',
            back: 'Back',
            save: 'Save Changes',
            saving: 'Saving...',
            saved: 'Changes saved successfully!',
            noAccess: 'Access denied. Only SupNum students and graduates can access this feature.',
            error: 'An error occurred. Please try again.',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            loading: 'Loading...',
            noData: 'No data found.',
            search: 'Search...',
            name: 'Name',
            email: 'Email',
            phone: 'Phone Number',
            location: 'Location',
            birthday: 'Date of Birth',
            jobTitle: 'Job Title',
            company: 'Company / Organization',
            bio: 'Bio',
            status: 'Status',
            connect: 'Connect',
            message: 'Message',
            pending: 'Pending Request',
            accept: 'Accept Request',
            social: 'Social Profiles',
            noSocial: 'No social profiles linked.',
            noBio: 'No bio available.',
            linkedinProfile: 'LinkedIn Profile',
            githubProfile: 'GitHub Profile',
            facebookProfile: 'Facebook Profile',
            about: 'About',
            professionalInfo: 'Professional Information',
            contactInfo: 'Contact Information',
            workStatus: {
                label: 'Current Status',
                select: 'Select Status',
                employed: 'Employed',
                seeking: 'Seeking Opportunities',
                studying: 'Studying',
                freelance: 'Freelance'
            },
            skills: 'Skills & Endorsements'
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
            tooManyAttempts: 'Too many login attempts, please try again after 15 minutes',
            unexpectedError: 'An unexpected error occurred. Please try again.',
            ecosystemTitle: 'Advanced Digital Ecosystem',
            ecosystemSubtitle: 'Experience the full spectrum of innovation. Connecting our elite community through state-of-the-art technology.',
            futureTech: 'The Future of technologies made here',
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
                role: 'Register as',
                other: 'Other',
                promoYear: 'Promotion Year',
                fieldOfStudy: 'Field of Study (Filière)',
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
            title: 'Community Search',
            subtitle: 'Search for students, graduates, and other members of our community',
            searchPlaceholder: 'Search by name, ID or email...',
            noResults: 'No members found. Try a different search term.',
            connected: 'Connected',
            respond: 'Respond to Request',
            filters: 'Filter Search',
            filterId: 'ID',
            filterName: 'Name',
            filterEmail: 'Email',
            filterPromo: 'Promo Year',
            filterFiliere: 'Filière',
            filterJobs: 'Jobs',
            applyFilters: 'Apply Filters',
            clearFilters: 'Clear'
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
        },
        feed: {
            title: 'Community Feed',
            subtitle: 'Share your thoughts, ask questions, and connect with the community.',
            placeholder: "What's on your mind?",
            post: 'Post',
            question: 'Ask Question',
            liked: 'Liked',
            like: 'Like',
            comment: 'Comment',
            comments: 'Comments',
            noPosts: 'No posts yet. Be the first to share something!',
            deleteConfirm: 'Are you sure you want to delete this post?',
            justNow: 'Just now',
            writeComment: 'Write a comment...',
            reply: 'Reply',
            replies: 'Replies',
            share: 'Share',
            confirmDeleteTitle: 'Delete Post',
            confirmDeleteMessage: 'This action cannot be undone. Are you sure you want to delete this post?',
            cancel: 'Cancel',
            delete: 'Delete',
            copied: 'Link copied to clipboard!'
        },
        formations: {
            title: 'Our Programs',
            subtitle: 'Excellence in digital education at SupNum',
            licence: 'Licence',
            master: 'Master',
            isi: {
                title: 'Intelligent Systems Engineering',
                description: 'Learn to design and manage automated and intelligent systems, integrating software, hardware, and sensors for innovative and high-performance applications.'
            },
            ids: {
                title: 'Data Engineering and Statistics',
                description: 'Become an expert in data collection, processing, and analysis. Transform raw information into actionable insights for strategic decision-making.'
            },
            dsi: {
                title: 'Computer Systems Development',
                description: 'Acquire the skills to create, deploy, and maintain high-performance, reliable systems and applications tailored to modern business needs.'
            },
            rss: {
                title: 'Networks, Systems, and Security',
                description: 'Train in key digital skills: networks, cybersecurity, systems, development, and AI, and be immediately operational in a constantly evolving technological environment.'
            },
            dwm: {
                title: 'Web and Mobile Development',
                description: 'Master web development tools, interface design, and mobile applications to create high-performance digital solutions.'
            },
            cyber: {
                title: 'Cybersecurity',
                description: 'Develop advanced skills in system and data protection. Learn to anticipate, detect, and counter digital threats to ensure the security of IT infrastructures.'
            },
            ia: {
                title: 'Artificial Intelligence',
                description: 'Master AI and machine learning techniques to design intelligent solutions capable of analyzing, predicting, and automating processes across various sectors.'
            }
        },

    },
    FR: {
        nav: { home: 'Accueil', events: 'Événements', about: 'À propos', signin: 'Se connecter', signup: "S'inscrire" },
        dashboard: {
            nav: { dashboard: 'Tableau de bord', profile: 'Profil', users: 'Utilisateurs', friends: 'Mon réseau', messages: 'Messages', feed: 'Flux' },
            welcome: 'Bienvenue,',
            welcomeSubtitle: "Voici ce qui se passe dans votre réseau SupNum.",
            stats: { totalUsers: 'Total Utilisateurs', friends: 'Mon réseau', pending: 'Demandes en attente' },
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
            stats: {
                totalUsers: 'Total Utilisateurs',
                students: 'Étudiants',
                graduates: 'Diplômés',
                verifiedGrads: 'Diplômés Vérifiés',
                placementRate: 'Taux de Placement',
                engagement: 'Engagement Utilisateur',
                successRateLabel: 'Taux de Réussite',
                successRateSubtitle: '(candidats acceptés)',
                activeOpportunities: 'Opportunités Actives',
                pendingRequests: 'Demandes en Attente',
                partnerCompanies: 'Entreprises Partenaires',
                applications: 'Candidatures',
                companyApplications: 'Route Entreprise'
            },
            charts: {
                userGrowth: 'Croissance des utilisateurs',
                students: 'Étudiants',
                graduates: 'Diplômés',
                graduatesGrowth: 'Croissance des diplômés au fil du temps',
                employmentDomains: "Secteurs d'emploi",
                graduateEmploymentStatus: "Statut d'emploi des diplômés",
                opportunitiesPosted: 'Opportunités publiées',
                jobs: 'Emplois',
                internships: 'Stages',
                institutionEvolution: 'Évolution de l\'institution',
                genderParity: 'Parité Homme/Femme',
                usageHeatmap: 'Activité Hebdomadaire',
                topCompetencies: 'Compétences Clés',
                placementFunnel: 'Entonnoir de Placement'
            },
            events: { title: 'Événements Récents', create: 'Créer un événement', edit: 'Modifier', delete: 'Supprimer', learnMore: 'En savoir plus', days: 'Jours' },
            users: { title: 'Gérer les utilisateurs', search: 'Rechercher...', role: 'Rôle', actions: 'Actions', remove: 'Supprimer' },
            manageUsers: {
                title: 'Gestion des Utilisateurs',
                allStatus: 'Tous les statuts',
                verified: 'Vérifié',
                pending: 'En attente',
                suspended: 'Suspendu',
                exportCSV: 'Exporter CSV',
                approve: 'Approuver',
                suspend: 'Suspendre',
                reactivate: 'Réactiver',
                viewProfile: 'Voir le profil',
                removeUser: 'Supprimer l\'utilisateur',
                noUsers: 'Aucun utilisateur trouvé.',
                confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
                failedDelete: 'Échec de la suppression de l\'utilisateur',
                failedUpdate: 'Échec de la mise à jour du statut',
                exportFailed: 'Échec de l\'exportation'
            },
            manageInternships: {
                title: 'Opportunités Professionnelles',
                postOpportunity: 'Publier une opportunité',
                searchPlaceholder: 'Rechercher des opportunités...',
                active: 'Actif',
                closed: 'Fermé',
                editOpportunity: 'Modifier l\'opportunité',
                view: 'Voir',
                delete: 'Supprimer',
                confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette opportunité ?',
                failedDelete: 'Échec de la suppression du stage',
                failedToggle: 'Échec du changement de statut',
                filterTypes: {
                    all: 'Tous',
                    internship: 'Stages',
                    job: 'Emplois',
                    training: 'Formations'
                },
                form: {
                    basicInfo: 'Informations de Base',
                    details: 'Détails de l\'Opportunité',
                    jobTitle: 'Intitulé du poste',
                    company: 'Entreprise',
                    type: 'Type d\'opportunité',
                    targetAudience: 'Audience Cible',
                    workplaceType: 'Type de Lieu',
                    startDate: 'Date de Début',
                    endDate: 'Date de Fin',
                    location: 'Lieu',
                    appRequirements: 'Exigences de candidature',
                    requireCv: 'Exiger un CV',
                    requireMessage: 'Exiger un message',
                    requirePhone: 'Exiger un téléphone',
                    activeListing: 'Annonce active',
                    customQuestions: 'Questions personnalisées',
                    addQuestion: 'Ajouter une question',
                    noQuestions: 'Aucune question personnalisée ajoutée.',
                    saveChanges: 'Enregistrer',
                    cancel: 'Annuler',
                    questionLabel: 'Libellé de la question (ex : Lien Portfolio)',
                    options: 'Options (séparées par des virgules)',
                    required: 'Obligatoire',
                    audiences: {
                        all: 'Tout le monde',
                        students: 'Étudiants uniquement',
                        graduates: 'Diplômés uniquement'
                    },
                    workplace: {
                        onSite: 'Sur place (On-site)',
                        remote: 'À distance (Remote)',
                        hybrid: 'Hybride'
                    }
                }
            },
            manageApplications: {
                title: 'Candidatures',
                all: 'Tout',
                pending: 'En attente',
                accepted: 'Accepté',
                rejected: 'Rejeté',
                contact: 'Contact & Message du candidat',
                additionalQuestions: 'Questions supplémentaires',
                viewCv: 'Voir CV / Portfolio',
                noCv: 'Aucun CV fourni',
                reject: 'Rejeter',
                accept: 'Accepter',
                noApplications: 'Aucune candidature trouvée',
                noApplicationsDesc: 'Les candidatures aux stages et emplois apparaîtront ici.',
                companyRoute: 'Route Entreprise',
                companyRouteTooltip: 'Total des candidatures envoyées directement aux entreprises'
            },
            manageCompanies: {
                title: 'Entreprises Partenaires',
                addCompany: 'Ajouter une Entreprise',
                editCompany: 'Modifier une Entreprise',
                searchPlaceholder: 'Rechercher des entreprises...',
                partner: 'Partenaire',
                confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette entreprise ?',
                form: {
                    name: "Nom de l'Entreprise",
                    industry: 'Industrie',
                    location: 'Lieu',
                    website: 'Site Web',
                    save: 'Enregistrer',
                    add: 'Ajouter',
                    cancel: 'Annuler'
                }
            }
        },
        company: {
            nav: {
                dashboard: 'Tableau de bord',
                offers: 'Mes Offres',
                applications: 'Candidatures',
                accepted: 'Candidats Acceptés',
                messages: 'Messages',
                profile: 'Profil Entreprise'
            },
            stats: {
                activeOffers: 'Offres Actives',
                totalApplications: 'Total Candidatures',
                unreadMessages: 'Messages non lus',
                recentApplications: 'Candidatures Récentes'
            },
            overview: {
                readyToHire: 'Prêt à recruter ?',
                createOpp: 'Créez une nouvelle opportunité professionnelle pour atteindre les meilleurs talents de SupNum.',
                postOffer: 'Publier une Offre',
                platformTips: 'Conseils Plateforme',
                tipActive: 'Gardez vos offres actives et détaillées pour recevoir plus de candidatures.',
                tipMessages: 'Vérifiez régulièrement vos messages pour répondre rapidement aux candidats intéressés.',
                appliedFor: 'Candidature pour :',
            },
            dashboard: {
                portal: 'Tableau de bord Partenaire',
                command: 'Commandement & Contrôle,',
                subtitle: 'Suivez votre pipeline de recrutement en temps réel. Gérez les candidats, surveillez la performance des opportunités et bâtissez votre future équipe.',
                postOffer: 'Publier une nouvelle offre',
                managePipeline: 'Gérer le pipeline',
                conversion: 'Conversion',
                activeSlots: 'Postes actifs',
                potentialTargets: 'Nouveaux profils potentiels',
                velocity: 'Vitesse du pipeline',
                pendingReview: 'En attente de révision',
                acceptedTalent: 'Talents acceptés',
                activeReach: 'Portée active',
                inventory: 'Votre inventaire en direct',
                arsenal: 'Tout l\'arsenal',
                potentialHires: 'Embauches potentielles :',
                posted: 'Publié le :',
                rawTalents: 'Talents bruts',
                awaitingAssessment: 'En attente d\'évaluation',
                reviewAll: 'Réviser tous les candidats',
                optProfile: 'Optimiser le profil',
                syncing: 'Synchronisation des données...',
                pipelineClear: 'Pipeline dégagé',
                zeroMatches: 'Aucune correspondance',
                refineLookup: 'Le pipeline est vide. Affinez vos critères de recherche.',
                attractMore: 'Attirez plus d\'étudiants avec une bio détaillée.',
                bioTip: 'Les entreprises avec des descriptions complètes reçoivent 40% plus de candidatures en moyenne.'
            }
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
            other: 'Autre',
            bioPlaceholder: 'Parlez-nous de vous...',
            locationPlaceholder: 'ex: Nouakchott, Mauritanie',
            jobPlaceholder: 'ex: Ingénieur Logiciel',
            companyPlaceholder: 'ex: Tech Corp',
            cv: 'CV / Resume',
            downloadCv: 'Télécharger le CV',
            uploadCv: 'Télécharger CV (PDF)',
            gallery: 'Galerie d\'images',
            addGalleryImage: 'Ajouter une image',
            skills: 'Compétences'
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
            others: 'Autres',
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
            internships: 'Opportunités',
            companies: 'Entreprises',
            signOut: 'Déconnexion',
            language: 'Langue'
        },
        landing: {
            activeCommunity: 'Communauté Active',
            currentStudents: 'Étudiants Actuels',
            alumniNetwork: 'Réseau des Anciens',
            othersNetwork: 'Communauté Externe',
            upcomingTerm: 'À venir ce trimestre',
            oppsTitle: 'Opportunités & Partenaires',
            oppsSubtitle: 'Connectez-vous avec les meilleures entreprises et trouvez votre prochaine étape de carrière.',
            partnerCompanies: 'Entreprises Partenaires',
            activeOpps: 'Opportunités Actives',
            latestOpps: 'Dernières Opportunités',
            types: {
                all: 'Tout',
                Internship: 'Stages',
                Job: 'Emplois',
                Training: 'Formations'
            },
            filters: {
                location: '📍 Lieu: Tous',
                workplace: '🏢 Mode: Tous',
                pay: '💰 Paye: Tous',
                workplaceOnSite: 'Présentiel',
                workplaceRemote: 'À distance',
                workplaceHybrid: 'Hybride',
                payPaid: 'Rémunéré',
                payUnpaid: 'Non rémunéré'
            },
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
            roles: {
                student: 'Étudiant',
                admin: 'Admin',
                graduate: 'Diplômé',
                company: 'Entreprise'
            },
            statusLabels: {
                verified: 'Vérifié',
                pending: 'En attente',
                suspended: 'Suspendu',
                active: 'Actif',
                inactive: 'Inactif'
            },
            save: 'Enregistrer les modifications',
            saving: 'Enregistrement...',
            saved: 'Modifications enregistrées avec succès!',
            noAccess: 'Accès refusé. Seuls les étudiants et diplômés de SupNum peuvent accéder à cette fonctionnalité.',
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
            name: 'Nom complet',
            email: 'Adresse Email',
            phone: 'Numéro de téléphone',
            location: 'Emplacement',
            birthday: 'Date de naissance',
            jobTitle: 'Poste',
            company: 'Entreprise',
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
                seeking: 'En recherche',
                studying: 'Études',
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
            tooManyAttempts: 'Trop de tentatives de connexion, veuillez réessayer après 15 minutes',
            unexpectedError: 'Une erreur est survenue. Veuillez réessayer.',
            ecosystemTitle: 'Écosystème Numérique Avancé',
            ecosystemSubtitle: 'Découvrez tout le spectre de l\'innovation. Connecter notre communauté d\'élite grâce à une technologie de pointe.',
            futureTech: 'L\'avenir des technologies créées ici',
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
                role: "S'inscrire en tant que",
                other: 'Autre',
                promoYear: 'Année de Promotion',
                fieldOfStudy: 'Filière / Spécialité',
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
            title: 'Recherche de la Communauté',
            subtitle: 'Recherchez des étudiants, des diplômés et d\'autres membres de notre communauté',
            searchPlaceholder: 'Recherchez par nom, ID ou email...',
            noResults: 'Aucun membre trouvé. Essayez un autre terme de recherche.',
            connected: 'Connecté',
            respond: 'Répondre à la demande',
            filters: 'Filtrer la recherche',
            filterId: 'ID',
            filterName: 'Nom',
            filterEmail: 'Email',
            filterPromo: 'Année Promo',
            filterFiliere: 'Filière',
            filterJobs: 'Jobs',
            applyFilters: 'Appliquer les filtres',
            clearFilters: 'Effacer'
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
        },
        feed: {
            title: 'Fil d\'actualité',
            subtitle: 'Partagez vos pensées, posez des questions et connectez-vous avec la communauté.',
            placeholder: "Quoi de neuf ?",
            post: 'Publier',
            question: 'Poser une question',
            liked: 'Aimé',
            like: 'J\'aime',
            comment: 'Commenter',
            comments: 'Commentaires',
            noPosts: 'Aucune publication pour le moment. Soyez le premier à partager !',
            deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette publication ?',
            justNow: 'À l\'instant',
            writeComment: 'Écrire un commentaire...',
            reply: 'Répondre',
            replies: 'Réponses',
            share: 'Partager',
            confirmDeleteTitle: 'Supprimer la publication',
            confirmDeleteMessage: 'Cette action ne peut pas être annulée. Êtes-vous sûr de vouloir supprimer cette publication ?',
            cancel: 'Annuler',
            delete: 'Supprimer',
            copied: 'Lien copié dans le presse-papiers !'
        },
        formations: {
            title: 'Nos Formations',
            subtitle: 'L\'excellence du numérique à SupNum',
            licence: 'Licence',
            master: 'Master',
            isi: {
                title: 'Ingénierie des Systèmes Intelligents',
                description: 'Apprenez à concevoir et à gérer des systèmes automatisés et intelligents, intégrant logiciels, matériels et capteurs pour des applications innovantes et performantes.'
            },
            ids: {
                title: 'Ingénierie des Données et Statistiques',
                description: 'Devenez expert en collecte, traitement et analyse des données. Transformez les informations brutes en insights exploitables pour la prise de décision stratégique.'
            },
            dsi: {
                title: 'Développement des Systèmes Informatiques',
                description: 'Acquérez les compétences pour créer, déployer et maintenir des systèmes et applications performants, fiables et adaptés aux besoins des entreprises modernes.'
            },
            rss: {
                title: 'Réseaux, Systèmes et Sécurité',
                description: 'Formez‑vous aux compétences clés du numérique : réseaux, cybersécurité, systèmes, développement et intelligence artificielle, et soyez immédiatement opérationnel dans un environnement technologique en constante évolution.'
            },
            dwm: {
                title: 'Développement Web et Mobile',
                description: 'Maîtrisez les outils et techniques de développement web, design d\'interfaces et applications mobiles pour créer des solutions numériques performantes.'
            },
            cyber: {
                title: 'Cybersécurité',
                description: 'Développez des compétences avancées en protection des systèmes et des données. Apprenez à anticiper, détecter et contrer les menaces numériques pour garantir la sécurité des infrastructures informatiques.'
            },
            ia: {
                title: 'Intelligence Artificielle',
                description: 'Maîtrisez les techniques d’IA et de machine learning pour concevoir des solutions intelligentes capables d’analyser, prédire et automatiser des processus dans divers secteurs.'
            }
        },
    },
    AR: {
        nav: { home: 'الرئيسية', events: 'الأحداث', about: 'حول', signin: 'تسجيل الدخول', signup: 'إنشاء حساب' },
        dashboard: {
            nav: { dashboard: 'لوحة التحكم', profile: 'الملف الشخصي', users: 'المستخدمين', friends: 'شبكتي', messages: 'الرسائل', feed: 'آخر الأخبار' },
            welcome: 'مرحبًا،',
            welcomeSubtitle: 'إليك ما يحدث في شبكة SupNum الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', friends: 'شبكتي', pending: 'طلبات معلقة' },
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
            stats: {
                totalUsers: 'إجمالي المستخدمين',
                students: 'الطلاب',
                graduates: 'الخريجين',
                verifiedGrads: 'الخريجون الموثقون',
                placementRate: 'معدل التوظيف',
                engagement: 'تفاعل المستخدمين',
                successRateLabel: 'معدل القبول',
                successRateSubtitle: '(المتقدمون المقبولون)',
                activeOpportunities: 'الفرص النشطة',
                pendingRequests: 'الطلبات المعلقة',
                partnerCompanies: 'الشركات الشريكة',
                applications: 'الطلبات',
                companyApplications: 'مسار الشركات'
            },
            charts: {
                userGrowth: 'نمو المستخدمين',
                students: 'الطلاب',
                graduates: 'الخريجين',
                graduatesGrowth: 'نمو الخريجين بمرور الوقت',
                employmentDomains: 'مجالات العمل',
                graduateEmploymentStatus: 'حالة توظيف الخريجين',
                opportunitiesPosted: 'الفرص المنشورة',
                jobs: 'وظائف',
                internships: 'تدريب',
                institutionEvolution: 'تطور المؤسسة',
                genderParity: 'التكافؤ بين الجنسين',
                usageHeatmap: 'خريطة استخدام النشاط',
                topCompetencies: 'الكفاءات العليا',
                placementFunnel: 'قمع التوظيف'
            },
            events: { title: 'الأحداث الأخيرة', create: 'إنشاء حدث', edit: 'تعديل', delete: 'حذف', learnMore: 'المزيد', days: 'أيام' },
            users: { title: 'إدارة المستخدمين', search: 'البحث عن مستخدمين...', role: 'الدور', actions: 'إجراءات', remove: 'إزالة' },
            manageUsers: {
                title: 'إدارة المستخدمين',
                allStatus: 'كل الحالات',
                verified: 'موثق',
                pending: 'معلق',
                suspended: 'موقوف',
                exportCSV: 'تصدير CSV',
                approve: 'قبول',
                suspend: 'إيقاف',
                reactivate: 'إعادة تفعيل',
                viewProfile: 'عرض الملف الشخصي',
                removeUser: 'حذف المستخدم',
                noUsers: 'لم يتم العثور على مستخدمين.',
                confirmDelete: 'هل أنت متأكد أنك تريد حذف هذا المستخدم؟',
                failedDelete: 'فشل حذف المستخدم',
                failedUpdate: 'فشل تحديث الحالة',
                exportFailed: 'فشل التصدير'
            },
            manageInternships: {
                title: 'الفرص المهنية',
                postOpportunity: 'نشر فرصة',
                searchPlaceholder: 'بحث في الفرص...',
                active: 'نشط',
                closed: 'مغلق',
                editOpportunity: 'تعديل الفرصة',
                view: 'عرض',
                delete: 'حذف',
                confirmDelete: 'هل أنت متأكد أنك تريد حذف هذه الفرصة؟',
                failedDelete: 'فشل حذف الفرصة',
                failedToggle: 'فشل تغيير الحالة',
                filterTypes: {
                    all: 'الكل',
                    internship: 'تدريب',
                    job: 'وظائف',
                    training: 'تكوين'
                },
                form: {
                    basicInfo: 'المعلومات الأساسية',
                    details: 'تفاصيل الفرصة',
                    jobTitle: 'مسمى الوظيفة',
                    company: 'الشركة',
                    type: 'نوع الفرصة',
                    targetAudience: 'الجمهور المستهدف',
                    workplaceType: 'نوع مكان العمل',
                    startDate: 'تاريخ البدء',
                    endDate: 'تاريخ الانتهاء',
                    location: 'الموقع',
                    appRequirements: 'متطلبات التقديم',
                    requireCv: 'طلب السيرة الذاتية',
                    requireMessage: 'طلب رسالة',
                    requirePhone: 'طلب رقم الهاتف',
                    activeListing: 'إعلان نشط',
                    customQuestions: 'أسئلة مخصصة',
                    addQuestion: 'إضافة سؤال',
                    noQuestions: 'لم تتم إضافة أسئلة مخصصة.',
                    saveChanges: 'حفظ التغييرات',
                    cancel: 'إلغاء',
                    questionLabel: 'نص السؤال (مثال: رابط المعرض)',
                    options: 'الخيارات (مفصولة بفاصلة)',
                    required: 'مطلوب',
                    audiences: {
                        all: 'الكل',
                        students: 'الطلاب فقط',
                        graduates: 'الخريجون فقط'
                    },
                    workplace: {
                        onSite: 'في الموقع (On-site)',
                        remote: 'عن بعد (Remote)',
                        hybrid: 'هجين (Hybrid)'
                    }
                }
            },
            manageApplications: {
                title: 'طلبات التوظيف',
                all: 'الكل',
                pending: 'قيد الانتظار',
                accepted: 'مقبول',
                rejected: 'مرفوض',
                contact: 'بيانات الاتصال والرسالة',
                additionalQuestions: 'أسئلة إضافية',
                viewCv: 'عرض السيرة الذاتية / بورتفوليو',
                noCv: 'لم يتم تقديم سيرة ذاتية',
                reject: 'رفض',
                accept: 'قبول',
                noApplications: 'لا توجد طلبات',
                noApplicationsDesc: 'ستظهر طلبات التدريب والوظائف هنا.',
                companyRoute: 'مسار الشركات',
                companyRouteTooltip: 'إجمالي الطلبات المرسلة مباشرة إلى الشركات'
            },
            manageCompanies: {
                title: 'الشركات الشريكة',
                addCompany: 'إضافة شركة',
                editCompany: 'تعديل الشركة',
                searchPlaceholder: 'البحث عن شركات...',
                partner: 'شريك',
                confirmDelete: 'هل أنت متأكد أنك تريد حذف هذه الشركة؟',
                form: {
                    name: 'اسم الشركة',
                    industry: 'المجال',
                    location: 'الموقع',
                    website: 'الموقع الإلكتروني',
                    save: 'حفظ التغييرات',
                    add: 'إضافة شركة',
                    cancel: 'إلغاء'
                }
            },
        },
        company: {
            nav: {
                dashboard: 'لوحة التحكم',
                offers: 'عروضي',
                applications: 'طلبات التوظيف',
                accepted: 'المرشحون المقبولون',
                messages: 'الرسائل',
                profile: 'ملف الشركة'
            },
            stats: {
                activeOffers: 'العروض النشطة',
                totalApplications: 'إجمالي الطلبات',
                unreadMessages: 'رسائل غير مقروءة',
                recentApplications: 'الطلبات الأخيرة'
            },
            overview: {
                readyToHire: 'مستعد للتوظيف؟',
                createOpp: 'أنشئ فرصة مهنية جديدة للوصول إلى أفضل مواهب SupNum.',
                postOffer: 'نشر عرض جديد',
                platformTips: 'نصائح المنصة',
                tipActive: 'حافظ على عروضك نشطة ومفصلة لتلقي المزيد من طلبات التوظيف.',
                tipMessages: 'تحقق من رسائلك بانتظام للرد السريع على المرشحين المهتمين.',
                appliedFor: 'متقدم على:',
            },
            dashboard: {
                portal: 'لوحة تحكم الشركاء',
                command: 'التحكم والقيادة،',
                subtitle: 'تتبع مسار التوظيف الخاص بك في الوقت الفعلي. قم بإدارة المرشحين، ومراقبة أداء الفرص، وبناء فريقك المستقبلي.',
                postOffer: 'نشر فرصة جديدة',
                managePipeline: 'إدارة المسار',
                conversion: 'معدل التحويل',
                activeSlots: 'المراكز المفتوحة',
                potentialTargets: 'أهداف محتملة جديدة',
                velocity: 'سرعة المسار',
                pendingReview: 'قيد المراجعة',
                acceptedTalent: 'الموافقة على المواهب',
                activeReach: 'الوصول النشط',
                inventory: 'المخزون المباشر الخاص بك',
                arsenal: 'المخزون الكامل',
                potentialHires: 'التوظيف المحتمل:',
                posted: 'نشر في:',
                rawTalents: 'المواهب الخام',
                awaitingAssessment: 'في انتظار التقييم',
                reviewAll: 'مراجعة جميع المرشحين',
                optProfile: 'تحسين الملف التعريفي',
                syncing: 'جاري مزامنة البيانات...',
                pipelineClear: 'المسار خالٍ',
                zeroMatches: 'لا توجد نتائج',
                refineLookup: 'المسار خالٍ حالياً. حاول تعديل معايير البحث.',
                attractMore: 'اجذب المزيد من الطلاب بسيرة ذاتية مفصلة.',
                bioTip: 'الشركات التي لديها أوصاف كاملة تحصل على طلبات توظيف أكثر بنسبة 40% في المتوسط.'
            }
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
            other: 'آخر',
            bioPlaceholder: 'أخبرنا عن نفسك...',
            locationPlaceholder: 'مثال: نواكشوط، موريتانيا',
            jobPlaceholder: 'مثال: مهندس برمجيات',
            companyPlaceholder: 'مثال: شركة تقنية',
            cv: 'السيرة الذاتية',
            downloadCv: 'تحميل السيرة الذاتية',
            uploadCv: 'رفع السيرة الذاتية (PDF)',
            gallery: 'معرض الصور',
            addGalleryImage: 'إضافة صورة',
            skills: 'المهارات'
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
            others: 'آخرون',
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
            internships: 'الفرص',
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
            activeOpps: 'الفرص المتاحة',
            latestOpps: 'أحدث الفرص',
            types: {
                all: 'الكل',
                Internship: 'تربصات',
                Job: 'وظائف',
                Training: 'تدريبات'
            },
            filters: {
                location: '📍 المكان: الكل',
                workplace: '🏢 النظام: الكل',
                pay: '💰 الدفع: الكل',
                workplaceOnSite: 'حضوري',
                workplaceRemote: 'عن بعد',
                workplaceHybrid: 'مدمج',
                payPaid: 'مدفوع',
                payUnpaid: 'غير مدفوع'
            },
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
            roles: {
                student: 'طالب',
                admin: 'مسؤول',
                graduate: 'خريج',
                company: 'شركة'
            },
            statusLabels: {
                verified: 'تم التحقق',
                pending: 'قيد الانتظار',
                suspended: 'موقوف',
                active: 'نشط',
                inactive: 'غير نشط'
            },
            save: 'حفظ التغييرات',
            saving: 'جاري الحفظ...',
            saved: 'تم حفظ التغييرات بنجاح!',
            noAccess: 'تم رفض الوصول. يمكن لطلاب وخريجي SupNum فقط الوصول إلى هذه الميزة.',
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
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            location: 'الموقع',
            birthday: 'تاريخ الميلاد',
            jobTitle: 'المسمى الوظيفي',
            company: 'الشركة',
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
                seeking: 'باحث عن عمل',
                studying: 'طالب',
                freelance: 'عمل حر'
            },
            skills: 'المهارات والتوصيات'
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
            tooManyAttempts: 'محاولات تسجيل دخول كثيرة جداً، يرجى المحاولة مرة أخرى بعد 15 دقيقة',
            unexpectedError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
            ecosystemTitle: 'نظام رقمي متطور',
            ecosystemSubtitle: 'اختبر الطيف الكامل للابتكار. ربط مجتمع النخبة لدينا من خلال أحدث التقنيات.',
            futureTech: 'مستقبل التقنيات المصنوعة هنا',
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
                role: 'التسجيل كـ',
                other: 'آخر',
                promoYear: 'سنة التخرج',
                fieldOfStudy: 'التخصص / الفرع',
                brandingTitle: 'انضم إلى شبكة النخبة لخريجي SupNum',
                features: {
                    connect: 'تواصل مع الخريجين وقادة الصناعة',
                    access: 'الوصول إلى فرص عمل وتدريب حصرية',
                    participate: 'المشاركة في الفعاليات والورش المهنية',
                    mentor: 'توجيه الجيل القادم من الطلاب'
                }
            }
        },
        findFriends: {
            title: 'بحث في المجتمع',
            subtitle: 'البحث عن الطلاب والخريجين وأعضاء المجتمع الآخرين',
            searchPlaceholder: 'البحث بالاسم، أو الرقم، أو البريد الإلكتروني...',
            noResults: 'لم يتم العثور على أعضاء. جرب كلمة بحث أخرى.',
            connected: 'متصل',
            respond: 'الرد على الطلب',
            filters: 'تصفية البحث',
            filterId: 'المعرف',
            filterName: 'الاسم',
            filterEmail: 'البريد',
            filterPromo: 'سنة التخرج',
            filterFiliere: 'التخصص',
            filterJobs: 'الوظائف',
            applyFilters: 'تطبيق الفلاتر',
            clearFilters: 'مسح'
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
            placeholder: 'البحث بالاسم أو معرف SupNum (مثال: 2YYXXX)...',
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
        },
        feed: {
            title: 'آخر الأخبار',
            subtitle: 'شارك أفكارك، اطرح الأسئلة، وتواصل مع المجتمع.',
            placeholder: "بماذا تفكر؟",
            post: 'نشر',
            question: 'اطرح سؤالاً',
            liked: 'أعجبني',
            like: 'إعجاب',
            comment: 'تعليق',
            comments: 'تعليقات',
            noPosts: 'لا توجد منشورات بعد. كن أول من يشارك شيئاً!',
            deleteConfirm: 'هل أنت متأكد من حذف هذا المنشور؟',
            justNow: 'الآن',
            writeComment: 'اكتب تعليقاً...',
            reply: 'رد',
            replies: 'ردود',
            share: 'مشاركة',
            confirmDeleteTitle: 'حذف المنشور',
            confirmDeleteMessage: 'لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من حذف هذا المنشور؟',
            cancel: 'إلغاء',
            delete: 'حذف',
            copied: 'تم نسخ الرابط!'
        },
        formations: {
            title: 'برامجنا التعليمية',
            subtitle: 'التميز في التعليم الرقمي في SupNum',
            licence: 'ليسانس',
            master: 'ماستر',
            isi: {
                title: 'هندسة الأنظمة الذكية',
                description: 'تعلم تصميم وإدارة الأنظمة المؤتمتة والذكية، ودمج البرمجيات والأجهزة وأجهزة الاستشعار لتطبيقات مبتكرة وعالية الأداء.'
            },
            ids: {
                title: 'هندسة البيانات والإحصاء',
                description: 'كن خبيرًا في جمع البيانات ومعالجتها وتحليلها. حول المعلومات الخام إلى رؤى قابلة للتنفيذ لاتخاذ القرارات الاستراتيجية.'
            },
            dsi: {
                title: 'تطوير الأنظمة المعلوماتية',
                description: 'اكتسب المهارات اللازمة لإنشاء ونشر وصيانة أنظمة وتطبيقات عالية الأداء وموثوقة ومتكيفة مع احتياجات الشركات الحديثة.'
            },
            rss: {
                title: 'الشبكات والأنظمة والأمن',
                description: 'تدرب على المهارات الرقمية الأساسية: الشبكات، الأمن السيبراني، الأنظمة، التطوير والذكاء الاصطناعي، وكن جاهزاً للعمل فوراً في بيئة تكنولوجية دائمة التطور.'
            },
            dwm: {
                title: 'تطوير الويب والجوال',
                description: 'أتقن أدوات وتقنيات تطوير الويب وتصميم الواجهات وتطبيقات الجوال لإنشاء حلول رقمية عالية الأداء.'
            },
            cyber: {
                title: 'الأمن السيبراني',
                description: 'طوّر مهارات متقدمة في حماية الأنظمة والبيانات. تعلم كيفية التنبؤ بالتهديدات الرقمية واكتشافها ومواجهتها لضمان أمن البنى التحتية المعلوماتية.'
            },
            ia: {
                title: 'الذكاء الاصطناعي',
                description: 'أتقن تقنيات الذكاء الاصطناعي والتعلم الآلي لتصميم حلول ذكية قادرة على تحليل وتوقع وأتمتة العمليات في مختلف القطاعات.'
            }
        },
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
        document.documentElement.lang = language.toLowerCase();
    }, [theme, language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, theme, toggleTheme }}>
            <div dir={language === 'AR' ? 'rtl' : 'ltr'} className={language === 'AR' ? 'font-arabic' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
