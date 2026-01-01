import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle2, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login...');
            const result = await login(email, password);
            if (result.success) {
                if (result.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.error || t.auth.invalidCredentials);
            }
        } catch (err) {
            setError(t.auth.unexpectedError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex flex-col">
            {/* Top Banner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-12 px-4 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">SupNum Connect</h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-center text-blue-50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        {t.auth.welcomeBack}
                    </motion.p>

                    {/* Feature Highlights */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        {[
                            { icon: Users, text: t.auth.connectAlumni },
                            { icon: Shield, text: t.auth.securePlatform },
                            { icon: CheckCircle2, text: t.auth.verifiedProfiles }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.8 + (i * 0.2),
                                    duration: 1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
                            >
                                <item.icon className="h-5 w-5 text-blue-200" />
                                <span className="text-white font-medium text-sm">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        delay: 1.2,
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.6, duration: 1 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.auth.signInTitle}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{t.auth.signInSubtitle}</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                            <input type="text" style={{ display: 'none' }} name="dummy-email" />
                            <input type="password" style={{ display: 'none' }} name="dummy-password" />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.8, duration: 0.8 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.email}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            name="login-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="off"
                                            className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.0, duration: 0.8 }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.password}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            name="login-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            className="pl-10 pr-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-sans transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
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
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2.2, duration: 0.8 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            {t.auth.signingIn}
                                        </div>
                                    ) : (
                                        <>{t.auth.signInButton} <ArrowRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.4, duration: 1.5 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {t.auth.newToSupNum}{' '}
                                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-4 hover:underline">
                                    {t.auth.createAccount}
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
