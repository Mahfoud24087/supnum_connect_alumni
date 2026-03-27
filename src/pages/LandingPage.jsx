import { ArrowRight, Users, User, GraduationCap, Award, Calendar, Trophy, Zap, ChevronRight, BarChart3, Building, Briefcase, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { stats, events as initialEvents } from '../data/mockData';
import { motion, animate, useInView, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../services/api';
import { EventModal } from '../components/EventModal';

// Data for "Students by Entry Year" (Bar Chart)
const entryYearData = [
    { name: '2021', students: 200 },
    { name: '2022', students: 240 },
    { name: '2023', students: 240 },
    { name: '2024', students: 400 },
    { name: '2025', students: 230 },
];

// Data for "Graduates by Promotion" (Donut Chart)
const promotionData = [
    { name: 'DSI', value: 35, color: '#3ce33fff' }, // Green
    { name: 'RSS', value: 25, color: '#1e3a8a' }, // Dark Blue
    { name: 'IA', value: 15, color: '#c2b1b1ff' },  // i don't know the name of this color even in arabic hhhhhhhhhh
    { name: 'IDS', value: 15, color: '#000001ff' }, // black 
    { name: 'DWM', value: 10, color: '#0affffff' }, // i don't know 😒
];

// Data for "Community Growth" (Line/Area Chart)
const growthData = [
    { name: '2021', students: 200, graduates: 0 },
    { name: '2022', students: 240, graduates: 0 },
    { name: '2023', students: 240, graduates: 150 },
    { name: '2024', students: 400, graduates: 235 },
    { name: '2025', students: 230, graduates: 310 },
];

function Counter({ value }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            const node = ref.current;
            const controls = animate(0, Number(value) || 0, {
                duration: 2.5, // Slower counting
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

const MOCK_LANDING_DATA = {
    stats: {
        totalUsers: 0,
        students: 0,
        graduates: 0,
        eventsCount: 0,
        partnerCompanies: 0,
        activeInternships: 0
    },
    latestEvents: [],
    latestInternships: []
};

export function LandingPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [latestInternships, setLatestInternships] = useState([]);
    const [realStats, setRealStats] = useState({
        totalUsers: 0,
        students: 0,
        graduates: 0,
        others: 0,
        eventsCount: 0,
        partnerCompanies: 0,
        activeInternships: 0
    });
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [subFilters, setSubFilters] = useState({
        location: 'all',
        date: 'all',
        workplace: 'all'
    });
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/users/public/stats');

                const finalStats = response.stats || {};

                setRealStats(finalStats);
                setUpcomingEvents(response.latestEvents || []);
                setLatestInternships(response.latestInternships || []);
            } catch (error) {
                console.error('Failed to fetch public stats:', error);
                // Fallback on error
                setRealStats(MOCK_LANDING_DATA.stats);
                setUpcomingEvents(MOCK_LANDING_DATA.latestEvents);
                setLatestInternships(MOCK_LANDING_DATA.latestInternships);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleJobClick = (id) => {
        if (!user) {
            navigate('/signin');
            return;
        }

        if (user.role === 'other') {
            showToast(t.common.noAccess, 'error');
            return;
        }

        navigate(`/dashboard/apply/${id}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] py-24 lg:py-32 text-white">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0 }}
                            className="space-y-6 max-w-5xl"
                        >
                            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
                                {t.hero.title} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">SupNum Connect</span>
                            </h1>
                            <p className="mx-auto max-w-[800px] text-blue-100 md:text-xl leading-relaxed">
                                {t.hero.subtitle}
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
                        >
                            <Link to="/signup">
                                <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/25 px-8 py-6 text-lg rounded-xl font-bold">
                                    {t.hero.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-blue-500/20 text-white border-none hover:bg-blue-500/30 px-8 py-6 text-lg rounded-xl font-bold backdrop-blur-sm">
                                    {t.hero.learnMore}
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.stats.community}</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            {t.stats.communityDesc}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-12">
                        {/* Total Users Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-sm h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Users className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-blue-100 font-medium mb-1">{t.stats.totalUsers}</p>
                                        <div className="text-4xl font-bold">
                                            <Counter value={realStats.totalUsers} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-blue-100 bg-white/10 inline-block px-2 py-1 rounded-lg w-fit">
                                        {t.landing.activeCommunity}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Students Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-white dark:bg-slate-800 border-none shadow-sm h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-700 group-hover:text-blue-50 dark:group-hover:text-slate-600 transition-colors">
                                    <GraduationCap className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t.stats.students}</p>
                                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                                            <Counter value={realStats.students} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-green-600 font-medium">
                                        {t.landing.currentStudents}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Graduates Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-none shadow-sm h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Award className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-cyan-100 font-medium mb-1">{t.stats.graduates}</p>
                                        <div className="text-4xl font-bold">
                                            <Counter value={realStats.graduates} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-cyan-100 bg-white/10 inline-block px-2 py-1 rounded-lg w-fit">
                                        {t.landing.alumniNetwork}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Others Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-white dark:bg-slate-800 border-none shadow-sm h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-700 group-hover:text-amber-50 dark:group-hover:text-slate-600 transition-colors">
                                    <User className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{t.stats.others}</p>
                                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                                            <Counter value={realStats.others} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-amber-600 font-medium">
                                        {t.landing.othersNetwork}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Events Card */}
                        <motion.div whileHover={{ y: -5 }} className="h-full">
                            <Card className="bg-gradient-to-br from-slate-700 to-slate-900 text-white border-none shadow-sm h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Calendar className="h-24 w-24" />
                                </div>
                                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                                    <div>
                                        <p className="text-slate-100 font-medium mb-1">{t.stats.events}</p>
                                        <div className="text-4xl font-bold">
                                            <Counter value={upcomingEvents.length} />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-slate-300">
                                        {t.landing.upcomingTerm}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Opportunities & Partners Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.landing.oppsTitle}</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                                {t.landing.oppsSubtitle}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 mb-12">
                        <Card className="bg-white dark:bg-slate-800 border-none shadow-sm p-6 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <Building className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    <Counter value={realStats.partnerCompanies} />+
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.landing.partnerCompanies}</p>
                            </div>
                        </Card>

                        <Card className="bg-white dark:bg-slate-800 border-none shadow-sm p-6 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                <Briefcase className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    <Counter value={realStats.activeInternships} />+
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.landing.activeOpps}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Main Opportunities Column */}
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex-shrink-0">{t.landing.latestOpps}</h3>

                                {/* Horizontal Filters */}
                                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 lg:gap-3 w-full xl:w-auto">
                                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                                        {['all', 'Internship', 'Job', 'Training'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedFilter(type)}
                                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex-1 whitespace-nowrap ${selectedFilter === type
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {t.landing.types[type]}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 flex-1 sm:flex-none">
                                        <select
                                            value={subFilters.location}
                                            onChange={(e) => setSubFilters({ ...subFilters, location: e.target.value })}
                                            className="flex-1 sm:flex-none h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                                        >
                                            <option value="all">{t.landing.filters?.location}</option>
                                            {Array.from(new Set(latestInternships.map(job => job.location).filter(Boolean))).map(loc => (
                                                <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                                            ))}
                                        </select>

                                        <select
                                            value={subFilters.workplace}
                                            onChange={(e) => setSubFilters({ ...subFilters, workplace: e.target.value })}
                                            className="flex-1 sm:flex-none h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                                        >
                                            <option value="all">{t.landing.filters?.workplace}</option>
                                            <option value="on-site">{t.landing.filters?.workplaceOnSite}</option>
                                            <option value="remote">{t.landing.filters?.workplaceRemote}</option>
                                            <option value="hybrid">{t.landing.filters?.workplaceHybrid}</option>
                                        </select>

                                        <select
                                            className="flex-1 sm:flex-none h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
                                        >
                                            <option value="all">{t.landing.filters?.pay}</option>
                                            <option value="paid">{t.landing.filters?.payPaid}</option>
                                            <option value="unpaid">{t.landing.filters?.payUnpaid}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {latestInternships.length > 0 ? latestInternships
                                    .filter(opp => {
                                        let match = true;
                                        const oppType = opp.type?.toLowerCase() || '';
                                        const oppLoc = opp.location?.toLowerCase() || '';
                                        const oppWork = opp.workplaceType?.toLowerCase() || '';

                                        // Status Filter (Intern/Job)
                                        if (selectedFilter !== 'all') {
                                            const f = selectedFilter.toLowerCase();
                                            const matchesType = (
                                                (f === 'internship' && (oppType.includes('stage') || oppType.includes('intern'))) ||
                                                (f === 'job' && (oppType.includes('emploi') || oppType.includes('job') || oppType.includes('contract'))) ||
                                                (f === 'training' && (oppType.includes('formation') || oppType.includes('training'))) ||
                                                oppType.includes(f) || f.includes(oppType)
                                            );
                                            if (!matchesType) match = false;
                                        }

                                        // Location Filter
                                        if (subFilters.location !== 'all') {
                                            if (!oppLoc.includes(subFilters.location)) match = false;
                                        }

                                        // Workplace Filter
                                        if (subFilters.workplace !== 'all') {
                                            if (!oppWork.includes(subFilters.workplace)) match = false;
                                        }

                                        return match;
                                    })
                                    .map((job, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors border border-slate-100 dark:border-slate-800">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                        <p className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</p>
                                                        <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider ${(job.type?.toLowerCase().includes('intern') || job.type?.toLowerCase().includes('stag')) ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30' :
                                                            (job.type?.toLowerCase().includes('job') || job.type?.toLowerCase().includes('empl')) ? 'bg-green-100/80 text-green-700 dark:bg-green-900/30' :
                                                                'bg-purple-100/80 text-purple-700 dark:bg-purple-900/30'
                                                            }`}>
                                                            {job.type}
                                                        </span>
                                                        {job.workplaceType && (
                                                            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                                                {job.workplaceType}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {job.company} 
                                                        {job.createdBy && job.createdBy.role === 'graduate' && (
                                                            <span className="text-blue-500 dark:text-blue-400"> (par {job.createdBy.name})</span>
                                                        )}
                                                        • {job.location}
                                                        {(job.startDate || job.endDate) && (
                                                            <div className="text-slate-400 dark:text-slate-500 text-[10px] flex items-center gap-1 mt-1 font-semibold uppercase tracking-wider">
                                                                <Calendar className="h-3 w-3" />
                                                                {job.startDate && new Date(job.startDate).toLocaleDateString()}
                                                                {job.endDate && ` - ${new Date(job.endDate).toLocaleDateString()}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {job.matchScore !== undefined && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm transition-all hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
                                                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                                        <span className="text-[10px] font-black tracking-widest">{job.matchScore}% MATCH AI</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleJobClick(job.id)}
                                                    className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    {user ? t.landing.view : t.landing.apply}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )) : (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-500 font-medium">{t.landing.noOpps}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charts Section */}
            <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Students by Entry Year */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5 }}
                        >
                            <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                        <Users className="h-5 w-5 text-teal-500" />
                                        {t.landing.studentsByYear}
                                    </h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={entryYearData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    itemStyle={{ color: '#1e293b' }}
                                                />
                                                <Bar
                                                    dataKey="students"
                                                    fill="#2dd4bf"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={50}
                                                    isAnimationActive={true}
                                                    animationDuration={3000}
                                                    animationEasing="ease-out"
                                                    name={t.stats.students}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Graduates by Promotion */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                        >
                            <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-teal-500" />
                                        {t.landing.graduatesByPromo}
                                    </h3>
                                    <div className="h-[300px] w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={promotionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    isAnimationActive={true}
                                                    animationDuration={3000}
                                                    animationBegin={200}
                                                    animationEasing="ease-out"
                                                >
                                                    {promotionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    itemStyle={{ color: '#1e293b' }}
                                                />
                                                <Legend verticalAlign="right" align="right" layout="vertical" iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Community Growth Over Years */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.4 }}
                            className="lg:col-span-2"
                        >
                            <Card className="shadow-sm border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 h-full">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-teal-500" />
                                        {t.landing.communityGrowth}
                                    </h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorGraduates" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
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
                                                    stroke="#2dd4bf"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorStudents)"
                                                    name={t.stats.students}
                                                    isAnimationActive={true}
                                                    animationDuration={3000}
                                                    animationEasing="ease-out"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="graduates"
                                                    stroke="#1e3a8a"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorGraduates)"
                                                    name={t.stats.graduates}
                                                    isAnimationActive={true}
                                                    animationDuration={3000}
                                                    animationEasing="ease-out"
                                                />
                                                <Legend iconType="circle" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.events.title}</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
                                {t.events.subtitle}
                            </p>
                        </div>
                        <Link to="/events">
                            <Button variant="outline" className="bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                {t.events.viewAll} <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="group"
                            >
                                <Card className="overflow-hidden border-none shadow-sm h-full flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300">
                                    {event.image ? (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${event.color || 'bg-blue-600'} shadow-lg`}>
                                                {event.type}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 pb-0 flex items-start justify-between">
                                            <div className={`p-3 rounded-xl ${event.color || 'bg-blue-600'} bg-opacity-10 text-blue-600 dark:text-blue-400`}>
                                                {event.type === 'Challenge' ? <Trophy className="h-6 w-6" /> : event.type === 'Contest' ? <Zap className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.color || 'bg-blue-600'} text-white`}>
                                                {event.type}
                                            </span>
                                        </div>
                                    )}

                                    <CardContent className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
                                            {event.description}
                                        </p>
                                        <div className="w-full">
                                            <Button
                                                variant="outline"
                                                className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                {t.landing.viewDetails}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-500 dark:text-slate-400 italic">{t.landing.noEvents}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex justify-center">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <GraduationCap className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            {t.cta.title}
                        </h2>
                        <p className="text-blue-100 text-lg md:text-xl leading-relaxed">
                            {t.cta.subtitle}
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-xl shadow-orange-500/25 px-8 py-6 text-lg rounded-full mt-4">
                                <Users className="mr-2 h-5 w-5" />
                                {t.cta.button}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <EventModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
}
