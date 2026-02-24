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
        totalUsers: 1310,
        totalGraduates: 440,
        verifiedGraduates: 412,
        pendingUserRequests: 18,
        partnerCompanies: 52,
        activeInternships: 34,
        totalApplications: 284,
        activeEvents: 5,
        avgApplicationsPerUser: 2.1,
        successRate: 68
    },
    growthData: [
        { name: '2021', students: 200, graduates: 0, users: 200 },
        { name: '2022', students: 440, graduates: 0, users: 440 },
        { name: '2023', students: 480, graduates: 200, users: 680 },
        { name: '2024', students: 640, graduates: 440, users: 1080 },
        { name: '2025', students: 870, graduates: 440, users: 1310 },
    ],
    domainData: [
        { name: 'DSI', value: 350, color: '#3b82f6' },
        { name: 'RSS', value: 250, color: '#8b5cf6' },
        { name: 'IA', value: 200, color: '#10b981' },
        { name: 'Cybersécurité', value: 180, color: '#f59e0b' },
        { name: 'IDS', value: 150, color: '#0ea5e9' },
        { name: 'DWM', value: 120, color: '#2dd4bf' },
        { name: 'ISI', value: 60, color: '#ef4444' }
    ],
    opportunitiesData: [
        { name: 'Oct', jobs: 12, internships: 18 },
        { name: 'Nov', jobs: 15, internships: 22 },
        { name: 'Dec', jobs: 8, internships: 12 },
        { name: 'Jan', jobs: 24, internships: 30 },
        { name: 'Feb', jobs: 19, internships: 25 }
    ],
    skillsData: [
        { name: 'React', count: 420 },
        { name: 'Python', count: 380 },
        { name: 'Node.js', count: 310 },
        { name: 'SQL', count: 290 },
        { name: 'Docker', count: 150 },
        { name: 'AWS', count: 120 }
    ],
    applicationStatus: [
        { name: 'Accepted', value: 124, color: '#10b981' },
        { name: 'Pending', value: 82, color: '#f59e0b' },
        { name: 'Rejected', value: 78, color: '#ef4444' }
    ],
    userActivity: [
        { day: 'Mon', active: 450 },
        { day: 'Tue', active: 520 },
        { day: 'Wed', active: 610 },
        { day: 'Thu', active: 580 },
        { day: 'Fri', active: 490 },
        { day: 'Sat', active: 310 },
        { day: 'Sun', active: 280 }
    ],
    genderData: [
        { name: 'Male', value: 780, color: '#3b82f6' },
        { name: 'Female', value: 530, color: '#ec4899' }
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

    const s = statsData?.stats || {};
    const growthData = statsData?.growthData || [];
    const domainData = statsData?.domainData || [];
    const opportunitiesData = statsData?.opportunitiesData || [];

    const stats = [
        { title: t?.admin?.stats?.totalUsers || "Total Users", value: s.totalUsers || 0, icon: Users, color: "bg-blue-500", subtext: t?.admin?.charts?.userGrowth || "Total registered" },
        { title: "Verified Graduates", value: s.verifiedGraduates || 0, icon: CheckCircle, color: "bg-green-500", subtext: `${Math.round((s.verifiedGraduates / s.totalGraduates) * 100) || 0}% verification rate` },
        { title: t?.dashboard?.stats?.pending || "Pending Requests", value: s.pendingUserRequests || 0, icon: Clock, color: "bg-amber-500", subtext: "Requires attention" },
        { title: t?.landing?.partnerCompanies || "Partner Companies", value: s.partnerCompanies || 0, icon: Building, color: "bg-indigo-500", subtext: "Active partnerships" },
        { title: t?.landing?.activeInternships || "Active Internships", value: s.activeInternships || 0, icon: Briefcase, color: "bg-purple-500", subtext: "Currently active" },
        { title: t?.admin?.nav?.applications || "Applications", value: s.totalApplications || 0, icon: FileText, color: "bg-orange-500", subtext: "Total submissions" },
        { title: t?.admin?.events?.title || "Active Events", value: s.activeEvents || 0, icon: Calendar, color: "bg-pink-500", subtext: t?.landing?.upcomingTerm || "Upcoming events" },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col space-y-2">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.admin.welcome}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">{t.admin.subtitle}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-900 overflow-hidden relative">
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
                <Card className="bg-white dark:bg-slate-900 border-none shadow-xl lg:col-span-2">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-tighter">
                            {t.admin.charts.institutionEvolution}
                        </h3>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        name="Total Users"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="graduates"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={0}
                                        name="Graduates"
                                    />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Employment Domains */}
                <Card className="bg-white dark:bg-slate-900 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-tighter">
                            {t.admin.charts.employmentDomains}
                        </h3>
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
                                    >
                                        {domainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Opportunities Bar Chart */}
                <Card className="bg-white dark:bg-slate-900 border-none shadow-xl">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 uppercase tracking-tighter">
                            {t.admin.charts.opportunitiesPosted}
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={opportunitiesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Jobs" />
                                    <Bar dataKey="internships" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Internships" />
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
