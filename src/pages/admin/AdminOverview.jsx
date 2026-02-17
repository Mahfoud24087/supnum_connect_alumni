import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, GraduationCap, Calendar, Briefcase, Building, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { motion, animate, useInView } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { apiClient } from '../../services/api';

function Counter({ value }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const node = ref.current;
            const controls = animate(0, Number(value) || 0, {
                duration: 2,
                ease: "easeOut",
                onUpdate(value) {
                    if (node) {
                        node.textContent = Math.round(value).toLocaleString();
                    }
                }
            });
            return () => controls.stop();
        }
    }, [value, inView]);

    return <span ref={ref}>0</span>;
}

const MOCK_ADMIN_DATA = {
    stats: {
        totalGraduates: 1240,
        verifiedGraduates: 850,
        pendingUserRequests: 12,
        partnerCompanies: 45,
        activeInternships: 28,
        totalApplications: 156,
        activeEvents: 3
    },
    growthData: [
        { name: '2019', students: 150, graduates: 80 },
        { name: '2020', students: 200, graduates: 120 },
        { name: '2021', students: 300, graduates: 180 },
        { name: '2022', students: 450, graduates: 250 },
        { name: '2023', students: 600, graduates: 400 },
        { name: '2024', students: 850, graduates: 600 },
    ],
    domainData: [
        { name: 'Software Eng', value: 400, color: '#3b82f6' },
        { name: 'Data Science', value: 300, color: '#8b5cf6' },
        { name: 'Networking', value: 300, color: '#10b981' },
        { name: 'Cybersecurity', value: 200, color: '#f59e0b' },
        { name: 'IT Management', value: 100, color: '#ef4444' }
    ],
    opportunitiesData: [
        { name: 'Jan', jobs: 20, internships: 10 },
        { name: 'Feb', jobs: 25, internships: 15 },
        { name: 'Mar', jobs: 30, internships: 12 },
        { name: 'Apr', jobs: 35, internships: 20 },
        { name: 'May', jobs: 40, internships: 25 },
        { name: 'Jun', jobs: 45, internships: 30 }
    ]
};

export function AdminOverview() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/users/admin/stats');

                setStatsData(response);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                // Fallback on error too
                setStatsData(MOCK_ADMIN_DATA);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const { stats: s, growthData, domainData, opportunitiesData } = statsData || {
        stats: {},
        growthData: [],
        domainData: [],
        opportunitiesData: []
    };

    // FIX: Sync "Partner Companies" with the local storage (since ManageCompanies is client-side)
    try {
        const localCompanies = localStorage.getItem('supnum_companies');
        if (localCompanies) {
            const parsed = JSON.parse(localCompanies);
            if (Array.isArray(parsed)) {
                if (!s.partnerCompanies || s.partnerCompanies === 0) {
                    s.partnerCompanies = parsed.length;
                }
            }
        }
    } catch (e) {
        console.error("Error syncing local companies stats:", e);
    }

    const stats = [
        { title: t?.admin?.stats?.totalUsers || "Total Users", value: s.totalUsers || 0, icon: Users, color: "bg-blue-500", subtext: t?.admin?.charts?.userGrowth || "Total registered" },
        { title: "Verified Graduates", value: s.verifiedGraduates || 0, icon: CheckCircle, color: "bg-green-500", subtext: `${Math.round((s.verifiedGraduates / s.totalGraduates) * 100) || 0}% verification rate` },
        { title: t?.dashboard?.stats?.pending || "Pending Requests", value: s.pendingUserRequests || 0, icon: Clock, color: "bg-amber-500", subtext: "Requires attention" },
        { title: t?.landing?.partnerCompanies || "Partner Companies", value: s.partnerCompanies || 0, icon: Building, color: "bg-indigo-500", subtext: "Active partnerships" },
        { title: t?.landing?.activeInternships || "Active Internships", value: s.activeInternships || 0, icon: Briefcase, color: "bg-purple-500", subtext: "Currently active" },
        { title: t?.admin?.nav?.applications || "Applications", value: s.totalApplications || 0, icon: FileText, color: "bg-orange-500", subtext: "Total submissions" },
        { title: t?.admin?.events?.title || "Active Events", value: s.activeEvents || 0, icon: Calendar, color: "bg-pink-500", subtext: "Upcoming events" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{t.admin.welcome}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">{t.admin.subtitle}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 overflow-hidden relative">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 text-slate-900 dark:text-white`}>
                                <stat.icon className="h-24 w-24" />
                            </div>
                            <CardContent className="p-6 relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    <Counter value={stat.value} />
                                </h3>
                                <p className="text-xs text-slate-400 mt-2">{stat.subtext}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Growth Chart */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl lg:col-span-2">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin?.charts?.graduatesGrowth}</h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGraduates" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="students"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorStudents)"
                                        name={t.admin?.charts?.students}
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                        animationEasing="ease-out"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="graduates"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorGraduates)"
                                        name={t.admin?.charts?.graduates}
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                        animationEasing="ease-out"
                                    />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Domains */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin?.charts?.employmentDomains}</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={domainData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                        animationBegin={200}
                                        animationEasing="ease-out"
                                    >
                                        {domainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities Posted */}
                <Card className="bg-white dark:bg-slate-800 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">{t.admin?.charts?.opportunitiesPosted}</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={opportunitiesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Bar
                                        dataKey="jobs"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        name={t.admin?.charts?.jobs}
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                        animationEasing="ease-out"
                                    />
                                    <Bar
                                        dataKey="internships"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                        name={t.admin?.charts?.internships}
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                        animationEasing="ease-out"
                                    />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
