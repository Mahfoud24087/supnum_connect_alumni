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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            SupNum Connect
                        </h2>
                        <p className="text-blue-100 text-lg opacity-90 max-w-md mt-2">
                            {t.auth.welcomeBack}
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50 dark:bg-slate-950/20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Logo on top */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <img src="/logo.png" alt="SupNum Logo" className="h-24 w-auto drop-shadow-md" />
                        </motion.div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t.auth.signInTitle}</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">{t.auth.signInSubtitle}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.email}</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.auth.password}</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t.auth.newToSupNum}{' '}
                            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline underline-offset-4">
                                {t.auth.createAccount}
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
