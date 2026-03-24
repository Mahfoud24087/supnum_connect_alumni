import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, 
    Users, 
    MessageSquare, 
    TrendingUp, 
    Clock, 
    CheckCircle2, 
    XCircle,
    ArrowRight,
    Search
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { Link } from 'react-router-dom';

const CompanyOverview = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeOffers: 0,
        totalApplications: 0,
        unreadMessages: 0
    });
    const [recentApps, setRecentApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [offersRes, appsRes] = await Promise.all([
                    apiClient.get('/internships?myOffers=true'),
                    apiClient.get('/applications')
                ]);

                const activeOffers = offersRes.internships.filter(o => o.active).length;
                const totalApplications = appsRes.applications.length;
                
                // Sort applications by date for recent list
                const sortedApps = [...appsRes.applications]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);

                setStats({
                    activeOffers,
                    totalApplications,
                    unreadMessages: 0 // Will integrate with socket/messages later
                });
                setRecentApps(sortedApps);
            } catch (error) {
                console.error('Error fetching company dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: t.company.stats.activeOffers,
            value: stats.activeOffers,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: t.company.stats.totalApplications,
            value: stats.totalApplications,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: t.company.stats.unreadMessages,
            value: stats.unreadMessages,
            icon: MessageSquare,
            color: 'text-green-600',
            bg: 'bg-green-50 dark:bg-green-900/20'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t.dashboard.welcome} {user?.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {t.dashboard.welcomeSubtitle}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Applications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            {t.company.stats.recentApplications}
                        </h2>
                        <Link 
                            to="/dashboard/company/applications" 
                            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1"
                        >
                            {t.dashboard.viewMore}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentApps.length > 0 ? (
                            recentApps.map((app) => (
                                <div key={app.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {app.user?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {app.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t.company.overview.appliedFor} {app.internship?.title}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                app.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                                {app.status === 'pending' ? t.admin.manageApplications.pending : 
                                                 app.status === 'Accepted' ? t.admin.manageApplications.accepted : 
                                                 app.status === 'Rejected' ? t.admin.manageApplications.rejected : app.status}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                {t.admin.manageApplications.noApplications}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 p-8 rounded-2xl border border-primary/20">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t.company.overview.readyToHire}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t.company.overview.createOpp}
                        </p>
                        <Link 
                            to="/dashboard/company/offers" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all transform hover:scale-105"
                        >
                            {t.company.overview.postOffer}
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t.company.overview.platformTips}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.company.overview.tipActive}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.company.overview.tipMessages}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyOverview;
