import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, 
    Users, 
    MessageSquare, 
    TrendingUp, 
    Clock, 
    CheckCircle2, 
    XCircle,
    ArrowRight,
    Search,
    Plus,
    Activity,
    Target,
    Zap,
    ChevronRight,
    Sparkles,
    Eye,
    Bell
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const CompanyOverview = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeOffers: 0,
        pendingReview: 0,
        acceptedTotal: 0,
        hiringRate: 0,
        totalApplications: 0
    });
    const [myOffers, setMyOffers] = useState([]);
    const [pendingApps, setPendingApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [offersRes, appsRes] = await Promise.all([
                apiClient.get('/internships?myOffers=true'),
                apiClient.get('/applications')
            ]);

            const offers = offersRes.internships || [];
            const allApps = appsRes.applications || [];
            
            const activeOffersCount = offers.filter(o => o.active).length;
            const pendingReview = allApps.filter(a => a.status === 'pending');
            const acceptedApps = allApps.filter(a => a.status === 'accepted');
            
            setStats({
                activeOffers: activeOffersCount,
                pendingReview: pendingReview.length,
                acceptedTotal: acceptedApps.length,
                hiringRate: allApps.length > 0 ? Math.round((acceptedApps.length / allApps.length) * 100) : 0,
                totalApplications: allApps.length
            });

            setMyOffers(offers.slice(0, 3));
            setPendingApps(pendingReview.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600 animate-pulse" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{t.company.dashboard.syncing}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4 pt-4">
            {/* Header: Dynamic Welcome Banner */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 p-10 lg:p-16 text-white shadow-2xl shadow-blue-900/40 border border-white/10"
            >
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-300">
                            <Sparkles className="h-3 w-3" /> {t.company.dashboard.portal}
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
                            {t.company.dashboard.command} <br />
                            <span className="text-blue-400">{user?.name}</span>
                        </h1>
                        <p className="text-lg text-blue-100/70 font-bold max-w-lg">
                            {t.company.dashboard.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button 
                                onClick={() => navigate('/dashboard/company/offers')}
                                className="h-14 px-8 rounded-2xl bg-white text-blue-900 font-extrabold text-xs uppercase tracking-widest hover:bg-blue-50 hover:scale-105 transition-all gap-2"
                            >
                                <Plus className="h-4 w-4" /> {t.company.dashboard.postOffer}
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/dashboard/company/applications')}
                                className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-widest gap-2"
                            >
                                <Users className="h-4 w-4" /> {t.company.dashboard.managePipeline}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="hidden xl:flex grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="h-32 w-32 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-4">
                                <Target className="h-6 w-6 text-blue-400 mb-2" />
                                <span className="text-2xl font-black">{stats.hiringRate}%</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-300">{t.company.dashboard.conversion}</span>
                            </div>
                            <div className="h-44 w-32 rounded-3xl bg-blue-500/20 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-4">
                                <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                                <span className="text-2xl font-black">{stats.activeOffers}</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-300">{t.company.dashboard.activeSlots}</span>
                            </div>
                        </div>
                        <div className="pt-8">
                            <div className="h-48 w-32 rounded-3xl bg-white flex flex-col items-center justify-center p-4 shadow-2xl">
                                <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                                <span className="text-2xl font-black text-slate-900">+{stats.pendingReview}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">{t.company.dashboard.potentialTargets}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>

            {/* Performance Snapshot */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {[
                    { label: t.company.dashboard.velocity, value: stats.totalApplications || 0, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                    { label: t.company.dashboard.pendingReview, value: stats.pendingReview, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: t.company.dashboard.acceptedTalent, value: stats.acceptedTotal, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: t.company.dashboard.activeReach, value: stats.activeOffers, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
                ].map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        variants={item}
                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:scale-[1.02] transition-transform group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column: Active Opportunities */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 shadow-xl">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.company.dashboard.inventory}</h2>
                        </div>
                        <Link to="/dashboard/company/offers" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                            {t.company.dashboard.arsenal} <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {myOffers.length > 0 ? myOffers.map((offer) => (
                            <div key={offer.id} className="group p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all shadow-lg hover:shadow-2xl shadow-slate-100 dark:shadow-none flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-[1.25rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                        <Briefcase className="h-8 w-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 uppercase tracking-widest">{offer.type}</span>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight">{offer.title}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {t.company.dashboard.potentialHires} {(stats.totalApplications / stats.activeOffers || 0).toFixed(0)}</span>
                                            <span className="flex items-center gap-1 circle-divider">{t.company.dashboard.posted} {new Date(offer.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/dashboard/company/applications`)}
                                        className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-16 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-black text-[10px] mb-6 uppercase tracking-[0.3em]">{t.company.dashboard.pipelineClear}</p>
                                <Button onClick={() => navigate('/dashboard/company/offers')}>{t.company.dashboard.postOffer}</Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Column: Hot Leads / Pending Actions */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.company.dashboard.rawTalents}</h2>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">{t.company.dashboard.awaitingAssessment}</p>
                        {pendingApps.length > 0 ? pendingApps.map((app) => (
                            <div key={app.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all cursor-pointer group shadow-sm flex items-center gap-4" onClick={() => navigate('/dashboard/company/applications')}>
                                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 font-black flex items-center justify-center border border-indigo-100">
                                    {app.user?.name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate uppercase tracking-tight">{app.user?.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate uppercase">{app.internship?.title}</p>
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center">
                                <Users className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">{t.company.dashboard.pipelineClear}</p>
                            </div>
                        )}
                        <Button 
                            variant="ghost" 
                            className="w-full h-12 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 mt-2"
                            onClick={() => navigate('/dashboard/company/applications')}
                        >
                            {t.company.dashboard.reviewAll}
                        </Button>
                    </div>

                    {/* Quick Insight Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20 space-y-4">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <h4 className="text-lg font-black tracking-tight leading-snug">
                            {t.company.dashboard.attractMore}
                        </h4>
                        <p className="text-xs text-indigo-100/70 font-bold">
                            {t.company.dashboard.bioTip}
                        </p>
                        <Button 
                            size="sm" 
                            className="bg-white text-indigo-600 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 w-full rounded-xl"
                            onClick={() => navigate('/dashboard/profile')}
                        >
                            {t.company.dashboard.optProfile}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CompanyOverview;
