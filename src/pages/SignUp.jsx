import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, User, Mail, Lock, Hash, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SignUp() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        supnumId: '',
        email: '',
        password: '',
        role: 'graduate'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'supnumId') {
            setFormData(prev => ({
                ...prev,
                supnumId: value,
                email: value ? `${value.toLowerCase()}@supnum.mr` : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting signup...');
            const result = await signup(formData);
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-900 overflow-hidden">
            {/* Left Side - Building Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex flex-col justify-end p-12 bg-slate-900 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
                    style={{ backgroundImage: "url('/building.jpg')" }}
                />

                <div className="relative z-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="flex items-center space-x-3 text-white"
                    >
                        <h2 className="text-4xl font-bold text-white leading-tight">SupNum Connect</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {Object.values(t.auth.signup.features).map((item, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                className="flex items-center space-x-3 text-blue-100"
                            >
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                                <span>{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form Section */}
            <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-y-auto bg-slate-50 dark:bg-slate-950/20"
            >
                <div className="w-full max-w-md space-y-8">
                    {/* Logo on top */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <img src="/logo.png" alt="SupNum Logo" className="h-20 w-auto drop-shadow-md" />
                        </motion.div>
                        <div className="text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
                            >
                                {t.auth.signup.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 1 }}
                                className="mt-2 text-slate-500 dark:text-slate-400"
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
                        <div className="grid gap-5 md:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.fullName}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
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
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0, duration: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.supnumId}</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
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
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.signup.email}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
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
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
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
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
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
    );
}
