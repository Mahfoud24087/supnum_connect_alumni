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
            nav: { dashboard: 'Dashboard', events: 'Manage Events', users: 'Manage Users' },
            welcome: 'Admin Dashboard',
            subtitle: 'Manage your SupNum Connect platform.',
            stats: { totalUsers: 'Total Users', students: 'Students', graduates: 'Graduates' },
            charts: { userGrowth: 'User Growth', students: 'Students', graduates: 'Graduates' },
            events: { title: 'Recent Events', create: 'Create Event', edit: 'Edit', delete: 'Delete', learnMore: 'Learn More' },
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
            graduate: 'Graduate'
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
            communityDesc: 'Join thousands of SupNum graduates building the future of technology in Mauritania.',
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
            rights: 'All rights reserved.'
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
            decline: 'Refuser'
        },
        admin: {
            nav: { dashboard: 'Tableau de bord', events: 'Gérer événements', users: 'Gérer utilisateurs' },
            welcome: 'Tableau de bord Admin',
            subtitle: 'Gérez votre plateforme SupNum Connect.',
            stats: { totalUsers: 'Total Utilisateurs', students: 'Anciens', graduates: 'Diplômés' },
            charts: { userGrowth: 'Croissance des utilisateurs', students: 'Anciens', graduates: 'Diplômés' },
            events: { title: 'Événements Récents', create: 'Créer un événement', edit: 'Modifier', delete: 'Supprimer', learnMore: 'En savoir plus' },
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
            student: 'Ancien',
            graduate: 'Diplômé'
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
            communityDesc: "Rejoignez des milliers de diplômés de SupNum qui construisent l'avenir de la technologie en Mauritanie.",
            totalUsers: 'Utilisateurs Totaux',
            students: 'Anciens',
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
            rights: 'Tous droits réservés.'
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
            decline: 'رفض'
        },
        admin: {
            nav: { dashboard: 'لوحة التحكم', events: 'إدارة الأحداث', users: 'إدارة المستخدمين' },
            welcome: 'لوحة تحكم المسؤول',
            subtitle: 'إدارة منصة SupNum Connect الخاصة بك.',
            stats: { totalUsers: 'إجمالي المستخدمين', students: 'الخريجين القدامى', graduates: 'الخريجين الجدد' },
            charts: { userGrowth: 'نمو المستخدمين', students: 'الخريجين القدامى', graduates: 'الخريجين الجدد' },
            events: { title: 'الأحداث الأخيرة', create: 'إنشاء حدث', edit: 'تعديل', delete: 'حذف', learnMore: 'المزيد' },
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
            student: 'خريج سابق',
            graduate: 'خريج'
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
            communityDesc: 'انضم إلى آلاف الخريجين من SupNum الذين يبنون مستقبل التكنولوجيا في موريتانيا.',
            totalUsers: 'إجمالي المستخدمين',
            students: 'الخريجين القدامى',
            graduates: 'الخريجين الجدد',
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
            rights: 'جميع الحقوق محفوظة.'
        }
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('EN');
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
