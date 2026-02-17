import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Github, Linkedin, Facebook, ArrowLeft, MessageSquare, UserPlus, Mail, GraduationCap, MapPin, Calendar, Briefcase, Building, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState('none');
    const [isRequester, setIsRequester] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get(`/users/${id}`);
                setUser(response.user);

                // Fetch connection status
                const friendsRes = await apiClient.get('/users/connections/friends');
                const requestsRes = await apiClient.get('/users/connections/requests');

                const isFriend = friendsRes.friends.some(f => f.id === id);
                if (isFriend) {
                    setConnectionStatus('accepted');
                } else {
                    const isPending = requestsRes.requests.some(r => r.requesterId === id);
                    if (isPending) {
                        setConnectionStatus('pending');
                        setIsRequester(false);
                    } else {
                        // Check if we sent a request (this would need a separate endpoint or more data)
                        // For now, let's assume 'none' if not in friends or incoming requests
                        setConnectionStatus('none');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleConnect = async () => {
        try {
            await apiClient.post(`/users/connect/${id}`);
            setConnectionStatus('pending');
            setIsRequester(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMessage = () => {
        const basePath = currentUser.role === 'admin' ? '/admin' : '/dashboard';
        navigate(`${basePath}/messages`, { state: { recipientId: id, recipientName: user.name } });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t.common.noData}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 pb-12"
        >
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.common.back}
            </Button>

            {/* Profile Header / Banner */}
            <div className="relative">
                <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                </div>

                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-5xl font-bold text-slate-300 dark:text-slate-600 bg-slate-100 dark:bg-slate-800">
                                {user.name[0]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-8 flex gap-3">
                    {currentUser.id !== user.id && (
                        <div className="flex gap-3">
                            {connectionStatus === 'accepted' ? (
                                <Button onClick={handleMessage} variant="outline" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-none text-slate-900 dark:text-white">
                                    <MessageSquare className="mr-2 h-4 w-4" /> {t.common.message}
                                </Button>
                            ) : currentUser.role === 'admin' ? (
                                <>
                                    <Button onClick={handleConnect} className="shadow-lg backdrop-blur-md bg-blue-600 hover:bg-blue-700 text-white border-none">
                                        <UserPlus className="mr-2 h-4 w-4" /> {t.common.connect}
                                    </Button>
                                    <Button onClick={handleMessage} variant="outline" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-none text-slate-900 dark:text-white">
                                        <MessageSquare className="mr-2 h-4 w-4" /> {t.common.message}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {connectionStatus === 'none' && (
                                        <Button onClick={handleConnect} className="shadow-lg backdrop-blur-md bg-blue-600 hover:bg-blue-700 text-white border-none">
                                            <UserPlus className="mr-2 h-4 w-4" /> {t.common.connect}
                                        </Button>
                                    )}
                                    {connectionStatus === 'pending' && (
                                        <Button disabled className="shadow-lg backdrop-blur-md bg-slate-200 dark:bg-slate-700 text-slate-500 border-none">
                                            {isRequester ? t.common.pending : t.common.accept}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-16 grid gap-8 lg:grid-cols-[1fr_350px]">
                {/* Main Content */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{user.supnumId} • <span className="capitalize text-blue-600 dark:text-blue-400">{user.role === 'student' ? t.profile.student : t.profile.graduate}</span></p>
                        <div className="flex items-center text-slate-400 dark:text-slate-500 text-sm pt-1">
                            <MapPin className="h-4 w-4 mr-1" /> {user.location || 'Nouakchott, Mauritania'}
                        </div>
                    </div>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">{t.common.about}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                {user.bio || t.common.noBio}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">{t.common.professionalInfo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.jobTitle}</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{user.jobTitle || 'N/A'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.company}</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{user.company || 'N/A'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.workStatus.label}</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                        {user.workStatus ? t.common.workStatus[user.workStatus] || user.workStatus : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">{t.common.contactInfo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">{t.common.email}</p>
                                    <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-200" title={user.email}>{user.email}</p>
                                </div>
                            </div>
                            {user.phone && (
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">{t.common.phone}</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{user.phone}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">{t.common.social}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-3">
                                {user.socialLinkedin && (
                                    <a href={user.socialLinkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#0077b5]">{t.common.linkedinProfile}</span>
                                    </a>
                                )}
                                {user.socialGithub && (
                                    <a href={user.socialGithub} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                        <Github className="h-5 w-5 text-slate-900 dark:text-white" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{t.common.githubProfile}</span>
                                    </a>
                                )}
                                {user.socialFacebook && (
                                    <a href={user.socialFacebook} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#1877F2]">{t.common.facebookProfile}</span>
                                    </a>
                                )}
                                {!user.socialLinkedin && !user.socialGithub && !user.socialFacebook && (
                                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">{t.common.noSocial}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
