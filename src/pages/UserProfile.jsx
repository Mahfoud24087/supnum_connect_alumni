import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Github, Linkedin, Facebook, Globe, ArrowLeft, MessageSquare, UserPlus, Mail, GraduationCap, MapPin, Calendar, Briefcase, Building, Phone, FileText, Download, Twitter, Youtube, Image as ImageIcon, Send, Award, CheckCircle } from 'lucide-react';
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

    const handleEndorse = async (skillName) => {
        try {
            const response = await apiClient.post(`/users/${id}/endorse`, { skillName });
            
            // Re-fetch user to get updated endorsements
            const userRes = await apiClient.get(`/users/${id}`);
            setUser(userRes.user);
        } catch (error) {
            console.error('Failed to endorse:', error);
        }
    };

    const handleExportCV = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const currentLang = localStorage.getItem('language') || 'FR';
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/users/${id}/export-cv?lang=${currentLang}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to download CV');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${user.name.replace(/\s+/g, '_')}_CV.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export failed:', error);
        }
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
                    {user.role !== 'company' && (
                        <Button onClick={handleExportCV} variant="outline" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-none text-slate-900 dark:text-white">
                            <Download className="mr-2 h-4 w-4" /> Export CV
                        </Button>
                    )}
                    {currentUser.id !== user.id && (
                        <div className="flex gap-3">
                            <Button onClick={handleMessage} className="shadow-lg backdrop-blur-md bg-blue-600 hover:bg-blue-700 text-white border-none">
                                <MessageSquare className="mr-2 h-4 w-4" /> {t.common.message}
                            </Button>
                            {connectionStatus === 'none' && (
                                <Button onClick={handleConnect} variant="outline" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-none text-slate-900 dark:text-white">
                                    <UserPlus className="mr-2 h-4 w-4" /> {t.common.connect}
                                </Button>
                            )}
                            {connectionStatus === 'pending' && (
                                <Button disabled className="shadow-lg backdrop-blur-md bg-slate-100 dark:bg-slate-800 text-slate-500 border-none">
                                    <Clock className="mr-2 h-4 w-4" /> {t.common.pending}
                                </Button>
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
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap">
                            {user.supnumId} •
                             {user.role === 'company' ? (
                                <span className="capitalize text-primary-600 dark:text-primary-400">
                                    {t.common.roles.company}
                                </span>
                             ) : (
                                <span className="capitalize text-blue-600 dark:text-blue-400">
                                    {user.role === 'student' ? t.profile.student : 
                                     user.role === 'graduate' ? t.profile.graduate : 
                                     t.profile.other}
                                </span>
                             )}
                             {user.role !== 'company' && user.graduationYear && (
                                 <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-0.5 rounded-full text-xs font-black tracking-widest uppercase">
                                     PROMO {user.graduationYear}
                                 </span>
                             )}
                             {user.role === 'company' && user.industry && (
                                <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-0.5 rounded-full text-xs font-black tracking-widest uppercase border border-primary-100 dark:border-primary-800">
                                    {user.industry}
                                </span>
                             )}
                             {user.role !== 'company' && user.specialty && (
                                 <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-0.5 rounded-full text-xs font-black tracking-widest uppercase">
                                     {user.specialty}
                                 </span>
                             )}
                        </p>
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

                    {/* Skills & Endorsements Section */}
                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                                <Award className="h-5 w-5 text-indigo-500" /> {t.common.skills || "Compétences & Recommandations"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, index) => {
                                        const endorsements = (user.endorsementsReceived || []).filter(e => e.skillName.toLowerCase() === skill.toLowerCase());
                                        const isEndorsedByMe = endorsements.some(e => e.endorserId === currentUser.id);
                                        
                                        return (
                                            <div 
                                                key={index}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                <button
                                                    onClick={() => currentUser.id !== user.id && handleEndorse(skill)}
                                                    disabled={currentUser.id === user.id}
                                                    className={`
                                                        relative flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 group
                                                        ${isEndorsedByMe 
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 -translate-y-1' 
                                                            : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'}
                                                        ${currentUser.id === user.id ? 'cursor-default' : 'hover:scale-105 active:scale-95'}
                                                    `}
                                                >
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{skill}</span>
                                                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-black ${isEndorsedByMe ? 'bg-white/20' : 'bg-indigo-200/50 dark:bg-indigo-800/50 group-hover:bg-indigo-300/50 transition-colors'}`}>
                                                        {endorsements.length}
                                                    </div>
                                                    {isEndorsedByMe && (
                                                        <CheckCircle className="absolute -top-2 -right-2 h-5 w-5 bg-white dark:bg-slate-900 text-green-500 rounded-full shadow-md animate-in zoom-in" />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Aucune compétence listée.</p>
                                )}
                            </div>
                            {currentUser.id !== user.id && user.skills?.length > 0 && (
                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                                    <Award className="h-3 w-3" />
                                    <span>Cliquez sur une compétence pour la recommander à {user.name.split(' ')[0]}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-900 dark:text-white">{t.common.professionalInfo}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="grid sm:grid-cols-2 gap-4">
                                {user.role === 'company' ? (
                                    <>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.industry || "Industry"}</p>
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">{user.industry || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.foundationYear || "Founded"}</p>
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">{user.foundationYear || 'N/A'}</p>
                                        </div>
                                        {user.website && (
                                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 md:col-span-2">
                                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.common.website || "Website"}</p>
                                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-2 hover:underline">
                                                    <Globe className="h-4 w-4" /> {user.website}
                                                </a>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {user.gallery && user.gallery.length > 0 && (
                        <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-purple-500" /> {t.profile?.gallery || "Gallery"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {user.gallery.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                            <img src={img} alt={`Gallery ${index}`} className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
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
                                    <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-200" title={user.contactEmail || user.email}>{user.contactEmail || user.email}</p>
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
                            {user.birthday && (
                                <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">{t.common.birthday}</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                            {new Date(user.birthday).toLocaleDateString()}
                                        </p>
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
                                {user.social?.linkedin && (
                                    <a href={user.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Linkedin className="h-5 w-5 text-[#0077b5]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#0077b5]">{t.common.linkedinProfile}</span>
                                    </a>
                                )}
                                {user.social?.github && (
                                    <a href={user.social.github} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                        <Github className="h-5 w-5 text-slate-900 dark:text-white" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{t.common.githubProfile}</span>
                                    </a>
                                )}
                                {user.social?.facebook && (
                                    <a href={user.social.facebook} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                                        <Facebook className="h-5 w-5 text-[#1877F2]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#1877F2]">{t.common.facebookProfile}</span>
                                    </a>
                                )}
                                {user.social?.twitter && (
                                    <a href={user.social.twitter} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                        <Twitter className="h-5 w-5 text-slate-900 dark:text-white" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">Twitter / X</span>
                                    </a>
                                )}
                                {user.social?.youtube && (
                                    <a href={user.social.youtube} target="_blank" rel="noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
                                        <Youtube className="h-5 w-5 text-[#FF0000]" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-[#FF0000]">YouTube Channel</span>
                                    </a>
                                )}
                                {(!user.social || !Object.values(user.social).some(v => v)) && (
                                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">{t.common.noSocial}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CV Download Section */}
                    {user.cvUrl && (
                        <Card className="border-none shadow-md bg-white dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-500" /> {t.profile?.cv || "Curriculum Vitae"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                                            <FileText className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                CV_{user.name ? user.name.replace(/\s+/g, '_') : 'User'}.pdf
                                            </p>
                                            <p className="text-xs text-slate-500">PDF Document</p>
                                        </div>
                                    </div>
                                    <a
                                        href={user.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download // Add download attribute
                                        className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                        title={t.common?.download || "Download"}
                                    >
                                        <Download className="h-5 w-5" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Premium Map Section */}
            {user.role === 'company' && user.latitude && user.longitude && (
                <div className="mt-16 -mx-4 md:-mx-12 overflow-hidden border-y border-slate-200 dark:border-slate-800 relative group">
                    <div className="absolute top-6 left-12 z-10">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs transition-all group-hover:translate-x-2">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-500" /> Nous trouver
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.location}</p>
                        </div>
                    </div>
                    <div className="h-[450px] w-full bg-slate-100 dark:bg-slate-900 grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight="0" 
                            marginWidth="0" 
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(user.longitude)-0.02}%2C${parseFloat(user.latitude)-0.01}%2C${parseFloat(user.longitude)+0.02}%2C${parseFloat(user.latitude)+0.01}&layer=mapnik&marker=${user.latitude}%2C${user.longitude}`}
                            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} // Night mode effect for dark theme
                            className="dark:opacity-80"
                        ></iframe>
                    </div>
                    {/* Interaction Overlay */}
                    <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-slate-900/5 transition-colors"></div>
                </div>
            )}
            
            {/* Professional Company Footer */}
            {user.role === 'company' && (
                <div className="mt-20 -mx-4 md:-mx-12 -mb-12 bg-slate-900 text-white rounded-t-[3rem] overflow-hidden pt-16 pb-12 shadow-2xl">
                    <div className="max-w-5xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Newsletter / Stay in Touch */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold tracking-tight">Abonnez-vous à notre actualité</h3>
                            <p className="text-slate-400 text-sm">Recevez nos dernières offres et nouvelles directement.</p>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">NOM</label>
                                    <input 
                                        type="text" 
                                        placeholder="Votre nom" 
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">E-MAIL</label>
                                    <input 
                                        type="email" 
                                        placeholder="votre@email.com" 
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                                    />
                                </div>
                                <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-lg shadow-lg shadow-green-900/20 group border-none">
                                    S'ABONNER <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500">LIENS UTILES</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#offers" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></div>
                                        Offres d'emploi
                                    </a>
                                </li>
                                {user.website && (
                                    <li>
                                        <a href={user.website} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></div>
                                            Site Officiel
                                        </a>
                                    </li>
                                )}
                                <li>
                                    <a href="#" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 group">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></div>
                                        À propos de nous
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contacts & Socials */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold uppercase tracking-widest text-slate-500">CONTACTS</h3>
                            <div className="space-y-4">
                                {user.phone && (
                                    <div className="flex items-center gap-4 text-slate-300">
                                        <div className="p-3 bg-slate-800 rounded-xl">
                                            <Phone className="h-5 w-5 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-black">Téléphone</p>
                                            <p className="font-medium">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="p-3 bg-slate-800 rounded-xl">
                                        <Mail className="h-5 w-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">E-mail</p>
                                        <p className="font-medium truncate max-w-[200px]">{user.contactEmail || user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                {user.social?.facebook && (
                                    <a href={user.social.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                )}
                                {user.social?.twitter && (
                                    <a href={user.social.twitter} target="_blank" rel="noreferrer" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-black transition-all hover:-translate-y-1 border border-slate-700">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {user.social?.linkedin && (
                                    <a href={user.social.linkedin} target="_blank" rel="noreferrer" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all hover:-translate-y-1">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                                {user.social?.youtube && (
                                    <a href={user.social.youtube} target="_blank" rel="noreferrer" className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1">
                                        <Youtube className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-slate-800 pt-8 text-center text-slate-500 text-xs">
                        <p>© {new Date().getFullYear()} {user.name}. Tous droits réservés.</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
