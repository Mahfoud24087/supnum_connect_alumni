import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, GraduationCap, Calendar, Briefcase, Building, CheckCircle, Clock, AlertTriangle, FileText, TrendingUp, MessageSquare, BarChart2 } from 'lucide-react';
import { motion, animate, useInView } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { apiClient } from '../../services/api';

function Counter({ value }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const node = ref.current;
            const controls = animate(0, Number(value) || 0, {
                duration: 1.8,
                ease: "easeOut",
                onUpdate(value) {
                    if (node) node.textContent = Math.round(value).toLocaleString();
                }
            });
            return () => controls.stop();
        }
    }, [value, inView]);

    return <span ref={ref}>0</span>;
}

const STAT_CARDS = [
    {
        key: 'totalUsers',
        tKey: 'totalUsers',
        label: 'Total Users',
        icon: Users,
        gradient: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50 dark:bg-violet-900/10',
        text: 'text-violet-600',
        ring: 'ring-violet-200 dark:ring-violet-800'
    },
    {
        key: 'verifiedGraduates',
        tKey: 'verifiedGrads',
        label: 'Verified Graduates',
        icon: GraduationCap,
        gradient: 'from-emerald-400 to-teal-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10',
        text: 'text-emerald-600',
        ring: 'ring-emerald-200 dark:ring-emerald-800'
    },
    {
        key: 'pendingUserRequests',
        tKey: 'pendingRequests',
        label: 'Pending Requests',
        icon: Clock,
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-900/10',
        text: 'text-amber-600',
        ring: 'ring-amber-200 dark:ring-amber-800'
    },
    {
        key: 'partnerCompanies',
        tKey: 'partnerCompanies',
        label: 'Partner Companies',
        icon: Building,
        gradient: 'from-sky-400 to-blue-600',
        bg: 'bg-sky-50 dark:bg-sky-900/10',
        text: 'text-sky-600',
        ring: 'ring-sky-200 dark:ring-sky-800'
    },
    {
        key: 'activeInternships',
        tKey: 'activeOpportunities',
        label: 'Active Opportunities',
        icon: Briefcase,
        gradient: 'from-pink-400 to-rose-600',
        bg: 'bg-pink-50 dark:bg-pink-900/10',
        text: 'text-pink-600',
        ring: 'ring-pink-200 dark:ring-pink-800'
    },
    {
        key: 'totalApplications',
        tKey: 'applications',
        label: 'Applications',
        icon: FileText,
        gradient: 'from-indigo-400 to-blue-500',
        bg: 'bg-indigo-50 dark:bg-indigo-900/10',
        text: 'text-indigo-600',
        ring: 'ring-indigo-200 dark:ring-indigo-800'
    },
];

const FALLBACK_STATS = {
    stats: {
        totalUsers: 0, totalGraduates: 0, verifiedGraduates: 0,
        pendingUserRequests: 0, partnerCompanies: 0, activeInternships: 0,
        totalApplications: 0, activeEvents: 0, successRate: 0
    },
    growthData: [
        { name: '2024', users: 0, graduates: 0, students: 0 },
        { name: '2025', users: 0, graduates: 0, students: 0 },
    ],
    domainData: [{ name: 'No Data', value: 1, color: '#94a3b8' }],
    opportunitiesData: []
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl px-4 py-3 text-sm">
                <p className="font-bold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                        <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function AdminOverview() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/users/admin/stats');
                setStatsData(response);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                setError('Failed to load stats. Showing fallback data.');
                setStatsData(FALLBACK_STATS);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-violet-200 dark:border-violet-800 border-t-violet-600 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">Loading statistics...</p>
                </div>
            </div>
        );
    }

    const s = statsData?.stats || {};
    const growthData = statsData?.growthData || [];
    const domainData = (statsData?.domainData || []).filter(d => d.value > 0);
    const opportunitiesData = statsData?.opportunitiesData || [];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {t?.admin?.welcome || 'Admin Dashboard'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {t?.admin?.subtitle || 'Overview of your platform statistics'}
                </p>
                {error && (
                    <div className="mt-2 text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 w-fit">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {STAT_CARDS.map((card, index) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        <div className={`relative overflow-hidden rounded-2xl ${card.bg} ring-1 ${card.ring} p-5 flex flex-col gap-3 group hover:shadow-lg transition-all duration-300`}>
                            {/* Icon */}
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md`}>
                                <card.icon className="h-5 w-5 text-white" />
                            </div>
                            {/* Value */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                                    {t?.admin?.stats?.[card.tKey] || card.label}
                                </p>
                                <h3 className={`text-4xl font-black ${card.text}`}>
                                    <Counter value={s[card.key] || 0} />
                                </h3>
                            </div>
                            {/* Decorative circle */}
                            <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        </div>
                    </motion.div>
                ))}

                {/* Success Rate special card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: STAT_CARDS.length * 0.07, type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 flex flex-col gap-3 shadow-xl shadow-emerald-500/20">
                        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100 mb-1">{t?.admin?.stats?.successRateLabel || 'Success Rate'}</p>
                            <h3 className="text-4xl font-black text-white">
                                <Counter value={s.successRate || 0} />%
                            </h3>
                            <p className="text-xs text-emerald-200/70 mt-1 font-medium">{t?.admin?.stats?.successRateSubtitle || '(accepted candidates)'}</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                    </div>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Growth Chart - full width */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                {t?.admin?.charts?.institutionEvolution || 'Institution Growth'}
                            </h3>
                        </div>
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradGraduates" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#gradUsers)" name="Total Users" dot={{ fill: '#8b5cf6', r: 4 }} />
                                    <Area type="monotone" dataKey="graduates" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gradGraduates)" name="Graduates" dot={{ fill: '#10b981', r: 4 }} />
                                    <Area type="monotone" dataKey="students" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#gradStudents)" name="Students" dot={{ fill: '#f59e0b', r: 4 }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 16, fontSize: 13 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* Domain/Specialty Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center shadow-md">
                                <BarChart2 className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                {t?.admin?.charts?.employmentDomains || 'Specializations'}
                            </h3>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={domainData.length ? domainData : [{ name: 'No data', value: 1, color: '#e2e8f0' }]}
                                        cx="50%" cy="50%"
                                        innerRadius={65} outerRadius={105}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {(domainData.length ? domainData : [{ name: 'No data', value: 1, color: '#e2e8f0' }]).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* Opportunities Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md">
                                <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                {t?.admin?.charts?.opportunitiesPosted || 'Opportunities Posted'}
                            </h3>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={opportunitiesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                                    <Bar dataKey="jobs" fill="#6366f1" radius={[6, 6, 0, 0]} name="Jobs" />
                                    <Bar dataKey="internships" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Internships" />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 16, fontSize: 13 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
