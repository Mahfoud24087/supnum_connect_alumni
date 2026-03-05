import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, User, Mail, Lock, Hash, ArrowRight, CheckCircle2, Eye, EyeOff, Network, Globe, Cpu, Database, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SignUp() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        supnumId: '',
        email: '',
        password: '',
        role: 'graduate',
        graduationYear: '',
        specialty: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'supnumId' && formData.role !== 'other') {
            // Keep only digits
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                supnumId: numericValue,
                email: numericValue ? `${numericValue.toLowerCase()}@supnum.mr` : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRoleChange = (newRole) => {
        setFormData(prev => ({
            ...prev,
            role: newRole,
            // Clear supnumId and email if switching to other to let them enter their own
            ...(newRole === 'other' ? { supnumId: '', email: '' } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting signup...');
            // Prepare data - if other, ensure supnumId is null or empty
            const submissionData = { ...formData };
            if (submissionData.role === 'other') {
                submissionData.supnumId = null;
            }

            const result = await signup(submissionData);
            if (result.success) {
                navigate('/signin', { state: { message: 'Account created successfully! Please sign in.' } });
            } else {
                setError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const brandingVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.8 + (i * 0.1), duration: 0.8, ease: "easeOut" }
        })
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-3 sm:p-8 lg:p-14 flex items-center justify-center font-sans">
            <div className="w-full max-w-[1600px] h-full min-h-[85vh] grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-slate-100 dark:border-slate-800">
                {/* Left Side: Premium Image Gallery View */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#8bb5d7]"
                >
                    {/* Visual Quality Layers */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 z-10" />

                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0 bg-contain bg-center bg-no-repeat z-20"
                        style={{
                            backgroundImage: "url('/building.jpg')",
                            imageRendering: 'high-quality'
                        }}
                    />

                    {/* Branding Badge - High Visibility */}
                    <div className="relative z-30 mt-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-3" />
                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                                {t.auth.futureTech}
                            </span>
                        </motion.div>
                    </div>

                    {/* Bottom Ecosystem Card for SignUp */}
                    <div className="relative z-30">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-sm"
                        >
                            <h2 className="text-3xl font-black text-white leading-tight tracking-tighter mb-6">
                                {t.auth.ecosystemTitle.split(' ').slice(0, 2).join(' ')}<br /><span className="text-blue-100/70">{t.auth.ecosystemTitle.split(' ').slice(2).join(' ')}</span>
                            </h2>

                            <div className="space-y-3">
                                {Object.values(t.auth.signup.features).map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                        custom={i}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex items-center space-x-3 text-white font-medium"
                                    >
                                        <div className="bg-white/20 p-1 rounded-full">
                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-xs">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side: High-End Form Section */}
                <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full h-full flex items-center justify-center px-6 py-10 sm:px-16 lg:px-32 lg:py-24 overflow-y-auto bg-white dark:bg-slate-950/20 relative z-10"
                >
                    <div className="w-full max-w-md space-y-8 py-8">
                        {/* Seamless Logo Implementation */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                                className="bg-white dark:bg-white p-2 rounded-3xl"
                            >
                                <img
                                    src="/logo.png"
                                    alt="SupNum Logo"
                                    className="h-24 w-auto mix-blend-multiply select-none"
                                />
                            </motion.div>
                            <div className="text-center mt-6">
                                <motion.h1
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic"
                                >
                                    {t.auth.signup.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 1 }}
                                    className="mt-2 text-slate-500 dark:text-slate-400 font-medium"
                                >
                                    {t.auth.signup.subtitle}
                                </motion.p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </motion.div>
                            )}
                            <div className={`${formData.role === 'other' ? 'grid-cols-1' : 'grid gap-5 md:grid-cols-2'}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.fullName}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                                        <Input
                                            name="fullName"
                                            placeholder="John Doe"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {formData.role !== 'other' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20, width: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-2 overflow-hidden"
                                        >
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.supnumId}</label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                                                <Input
                                                    name="supnumId"
                                                    placeholder="2YXXX"
                                                    required
                                                    value={formData.supnumId}
                                                    onChange={handleChange}
                                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence mode="wait">
                                {(formData.role === 'graduate' || formData.role === 'student') && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className={`grid gap-4 overflow-hidden ${formData.role === 'graduate' ? 'grid-cols-2' : 'grid-cols-1'}`}
                                    >
                                        {formData.role === 'graduate' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.promoYear}</label>
                                                <div className="relative">
                                                    <Input
                                                        name="graduationYear"
                                                        type="number"
                                                        placeholder="2024"
                                                        required
                                                        value={formData.graduationYear}
                                                        onChange={handleChange}
                                                        className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-3 col-span-full">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                                {t.auth.signup.fieldOfStudy}
                                            </label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                                                {[
                                                    { id: 'RSS', label: 'RSS', icon: Network, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                                    { id: 'DSI', label: 'DSI', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                                    { id: 'DWM', label: 'DWM', icon: Globe, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                                                    { id: 'IA', label: 'IA', icon: Cpu, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                                                    { id: 'IDS', label: 'IDS', icon: Database, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                                                ].map((spec) => (
                                                    <button
                                                        key={spec.id}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, specialty: spec.id }))}
                                                        className={`
                                                            relative group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300
                                                            ${formData.specialty === spec.id
                                                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-600/10 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5'
                                                                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-200 dark:hover:border-blue-800/50'}
                                                        `}
                                                    >
                                                        <div className={`
                                                            p-2 rounded-xl mb-2 transition-transform duration-300 group-hover:scale-110
                                                            ${formData.specialty === spec.id ? spec.bg + ' ' + spec.color : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                                                        `}>
                                                            <spec.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        </div>
                                                        <span className={`
                                                            text-[10px] sm:text-xs font-black tracking-wider transition-colors duration-300
                                                            ${formData.specialty === spec.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}
                                                        `}>
                                                            {spec.label}
                                                        </span>
                                                        {formData.specialty === spec.id && (
                                                            <motion.div
                                                                layoutId="activeSpecIndicator"
                                                                className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-lg z-10"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.email}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.password}</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-20"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t.auth.signup.role}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'student', label: t.profile.student, icon: GraduationCap },
                                        { id: 'graduate', label: t.profile.graduate, icon: CheckCircle2 },
                                        { id: 'other', label: t.auth.signup.other, icon: User }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => handleRoleChange(role.id)}
                                            className={`
                                                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1
                                                ${formData.role === role.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'}
                                            `}
                                        >
                                            <role.icon className={`h-5 w-5 ${formData.role === role.id ? 'text-blue-500' : 'text-slate-400'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{role.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.5 }}
                                className="pt-2"
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            {t.auth.signup.creating}
                                        </div>
                                    ) : (
                                        <>{t.auth.signup.button} <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="text-center text-sm text-slate-500 dark:text-slate-400"
                        >
                            {t.auth.signup.alreadyHaveAccount}{' '}
                            <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-4 hover:underline">
                                {t.auth.signup.signIn}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
