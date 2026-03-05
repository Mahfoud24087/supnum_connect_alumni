import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, UserPlus, MessageSquare, Calendar, Check, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/api';

export function DashboardHome() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState({ totalUsers: 0, friendsCount: 0, pendingRequests: 0 });
    const [suggestions, setSuggestions] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, suggestionsRes, requestsRes] = await Promise.all([
                apiClient.get('/users/dashboard/stats'),
                apiClient.get('/users/suggestions'),
                apiClient.get('/users/connections/requests')
            ]);
            setStats(statsRes);
            setSuggestions(suggestionsRes.suggestions);
            setRequests(requestsRes.requests);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await apiClient.patch(`/users/connect/${requestId}/accept`);
            fetchData();
        } catch (error) {
            console.error('Failed to accept request');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await apiClient.patch(`/users/connect/${requestId}/reject`);
            fetchData();
        } catch (error) {
            console.error('Failed to reject request');
        }
    };

    const handleConnect = async (userId) => {
        try {
            await apiClient.post(`/users/connect/${userId}`);
            // Remove from suggestions
            setSuggestions(suggestions.filter(s => s.id !== userId));
        } catch (error) {
            console.error('Failed to send request');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-orange-100 dark:border-slate-700 shadow-sm flex items-center space-x-4"
            >
                <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t.dashboard.welcome} {user?.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {t.dashboard.welcomeSubtitle}
                    </p>
                </div>
            </motion.div>

            {/* Stats & Quick Links Grid */}
            <div className={`grid gap-6 md:grid-cols-2`}>
                {/* Friends Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-white dark:bg-slate-800 border-none shadow-lg h-full relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 p-4 opacity-5">
                            <Users className="h-40 w-40 text-slate-900 dark:text-white" />
                        </div>
                        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{user?.role === 'other' ? 'Total Community Members' : t.dashboard.stats.friends}</p>
                                <div className="text-5xl font-bold text-slate-900 dark:text-white">
                                    {user?.role === 'other' ? stats.totalUsers : stats.friendsCount}
                                </div>
                            </div>
                            <div className="mt-4 bg-slate-100 dark:bg-slate-700 p-2 rounded-xl w-fit">
                                <Users className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Pending Requests Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="bg-cyan-500 text-white border-none shadow-xl relative overflow-hidden h-full">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <UserPlus className="h-32 w-32" />
                        </div>
                        <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                            <div>
                                <p className="text-cyan-100 font-medium mb-1">{t.dashboard.stats.pending}</p>
                                <div className="text-5xl font-bold">{stats.pendingRequests}</div>
                            </div>
                            <div className="mt-4 bg-white/20 p-2 rounded-xl w-fit">
                                <UserPlus className="h-6 w-6 text-white" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Welcome Back Toast Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative md:col-span-2"
                >
                    <div className="absolute inset-0 bg-orange-500 rounded-xl transform translate-y-2 translate-x-2 opacity-20"></div>
                    <Card className="bg-white dark:bg-slate-800 border-l-8 border-orange-500 shadow-lg h-full">
                        <CardContent className="p-6 flex flex-col justify-center h-full">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.dashboard.welcomeBackTitle}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{t.dashboard.welcomeBackSubtitle}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                <Link to="/dashboard/search">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm bg-white dark:bg-slate-800 h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.dashboard.quickLinks.findUsers}</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/dashboard/messages">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm bg-white dark:bg-slate-800 h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.dashboard.quickLinks.messages}</span>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/events" className={user?.role === 'other' ? "md:col-span-2 lg:col-span-1" : ""}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-none shadow-lg bg-orange-500 text-white h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-white/20 rounded-full text-white">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <span className="font-semibold">{t.dashboard.quickLinks.events}</span>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Friend Requests */}
            {requests.length > 0 && (
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">{t.dashboard.friendRequests}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {requests.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                                <Link to={`/dashboard/profile/${req.requester.id}`} className="flex items-center space-x-3 group">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                                        {req.requester.avatar ? (
                                            <img src={req.requester.avatar} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                {req.requester.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{req.requester.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{req.requester.jobTitle || 'User'}</p>
                                    </div>
                                </Link>
                                <div className="flex space-x-2">
                                    <Button onClick={() => handleAccept(req.id)} size="icon" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10">
                                        <Check className="h-5 w-5" />
                                    </Button>
                                    <Button onClick={() => handleReject(req.id)} size="icon" variant="ghost" className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full h-10 w-10">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">{t.dashboard.suggestions}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {suggestions.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                                <Link to={`/dashboard/profile/${user.id}`} className="flex items-center space-x-3 group">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400">
                                                {user.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{user.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                                    </div>
                                </Link>
                                <Button onClick={() => handleConnect(user.id)} variant="outline" size="icon" className="rounded-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <div className="pt-4 text-center">
                            <Link to="/dashboard/search">
                                <Button variant="ghost" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                    {t.dashboard.viewMore}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
