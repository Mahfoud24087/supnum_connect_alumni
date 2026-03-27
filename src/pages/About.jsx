import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
    GraduationCap, Target, Users, Briefcase, MessageSquare,
    Newspaper, Network, Globe, Mail, MapPin, Lightbulb,
    Heart, Star, BookOpen, Zap, Shield, ArrowRight,
    CheckCircle, Code2, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* ─── Animation Variants ────────────────────────────────────── */
const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: 'easeOut' }
};

const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.9 }
};

const slideLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: 'easeOut' }
};

const slideRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.7, ease: 'easeOut' }
};

const stagger = (i, base = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.55, delay: base + i * 0.1, ease: 'easeOut' }
});

/* ─── Icon Maps ─────────────────────────────────────────────── */
const VALUE_ICONS = { innovation: Lightbulb, community: Heart, excellence: Star, openness: BookOpen };
const FEATURE_ICONS = { network: Network, jobs: Briefcase, events: Zap, messaging: MessageSquare, feed: Newspaper, profiles: Users };
const VALUE_COLORS = [
    'from-amber-400 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-600',
    'from-teal-400 to-cyan-500',
];
const FEATURE_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-500',
    'from-purple-500 to-violet-600',
    'from-cyan-500 to-blue-500',
    'from-pink-500 to-rose-500',
];

/* ─── Component ─────────────────────────────────────────────── */
export function About() {
    const { t, language } = useLanguage();
    const ab = t.aboutPage;
    const isRTL = language === 'AR';
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb] min-h-[85vh] flex items-center">
                {/* Animated background blobs */}
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[80px] pointer-events-none" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-400/20 blur-[80px] pointer-events-none" />

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.07]" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 dark:bg-slate-900" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />

                <motion.div style={{ y: heroY, opacity: heroOpacity }}
                    className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl py-24">

                    {/* Built By Badge — TOP */}
                    <motion.div {...{ ...fadeUp, transition: { duration: 0.6 } }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-8 shadow-lg">
                        <Code2 className="h-4 w-4 text-yellow-400" />
                        {ab?.builtByTitle}
                    </motion.div>

                    <motion.div {...{ ...fadeUp, transition: { duration: 0.7, delay: 0.1 } }}
                        className="flex justify-center mb-8">
                        <div className="p-5 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                            <GraduationCap className="h-14 w-14 text-white" />
                        </div>
                    </motion.div>

                    <motion.h1 {...{ ...fadeUp, transition: { duration: 0.7, delay: 0.2 } }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
                        {ab?.title}
                    </motion.h1>

                    <motion.p {...{ ...fadeUp, transition: { duration: 0.7, delay: 0.3 } }}
                        className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
                        {ab?.lead}
                    </motion.p>

                    <motion.p {...{ ...fadeUp, transition: { duration: 0.7, delay: 0.4 } }}
                        className="text-blue-200 text-base leading-relaxed max-w-xl mx-auto">
                        {ab?.builtByText}
                    </motion.p>

                    {/* Floating icons decoration */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.8 }}
                        className="hidden md:flex justify-center items-center gap-6 mt-12 flex-wrap">
                        {[Code2, Network, Sparkles, Shield, Globe].map((Icon, i) => (
                            <motion.div key={i}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                                className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                                <Icon className="h-5 w-5 text-white/70" />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* ── MISSION + GOALS ───────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* Mission */}
                        <motion.div {...slideLeft} className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold">
                                <Target className="h-4 w-4" />
                                {ab?.missionTitle}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                {ab?.missionText}
                            </p>

                            {/* Institute badge */}
                            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-lg">SupNum</p>
                                    <p className="text-blue-200 text-sm">{ab?.founded} 2021 · {ab?.institute}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Goals */}
                        <motion.div {...slideRight}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                {ab?.goalsTitle}
                            </h3>
                            <ul className="space-y-4">
                                {ab?.goals && Object.values(ab.goals).map((goal, i) => (
                                    <motion.li key={i} {...stagger(i, 0.1)}
                                        className="flex items-start gap-3 text-slate-600 dark:text-slate-300 group">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-600 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:bg-white transition-colors" />
                                        </div>
                                        <span className="text-sm leading-relaxed">{goal}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold mb-2">
                            <Zap className="h-4 w-4" />
                            {ab?.featuresTitle}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            {ab?.featuresTitle}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {ab?.features && Object.entries(ab.features).map(([key, feat], i) => {
                            const Icon = FEATURE_ICONS[key] || Zap;
                            const color = FEATURE_COLORS[i % FEATURE_COLORS.length];
                            return (
                                <motion.div key={key} {...stagger(i)}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-default">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base">{feat.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── VALUES ────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 to-blue-950 text-white relative overflow-hidden">
                {/* Background decoration */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/5 border-dashed opacity-30 pointer-events-none" style={{ transform: 'translate(30%, -30%)' }} />

                <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                    <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{ab?.valuesTitle}</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {ab?.values && Object.entries(ab.values).map(([key, val], i) => {
                            const Icon = VALUE_ICONS[key] || Star;
                            const color = VALUE_COLORS[i % VALUE_COLORS.length];
                            return (
                                <motion.div key={key} {...stagger(i)}
                                    whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 text-center">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-white text-base mb-2">{val.title}</h3>
                                    <p className="text-blue-200 text-sm leading-relaxed">{val.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── TEAM ──────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                    <motion.div {...fadeUp} className="space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-bold">
                            <Users className="h-4 w-4" />
                            {ab?.teamTitle}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{ab?.teamTitle}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            {ab?.teamDesc}
                        </p>

                        {/* Animated dots instead of letter avatars */}
                        <div className="flex justify-center items-center gap-3 mt-6">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <motion.div key={i}
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: `hsl(${i * 47 + 200}, 70%, 55%)` }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CONTACT ───────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                    <motion.div {...fadeUp} className="space-y-4 mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold">
                            <Globe className="h-4 w-4" />
                            {ab?.contactTitle}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{ab?.contactTitle}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">{ab?.contactDesc}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
                        <motion.a href={`mailto:${ab?.contactEmail}`} {...stagger(0)}
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                <Mail className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 break-all">{ab?.contactEmail}</p>
                            </div>
                        </motion.a>

                        <motion.div {...stagger(1)}
                            className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-left">
                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Location</p>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ab?.contactLocation}</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div {...{ ...fadeUp, transition: { duration: 0.7, delay: 0.25 } }}>
                        <Link to="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03] active:scale-[0.98]">
                            <Shield className="h-5 w-5" />
                            {t.hero?.getStarted}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
