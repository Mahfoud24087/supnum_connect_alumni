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
                let errorMsg = result.error;
                if (errorMsg?.includes('Too many login attempts')) {
                    errorMsg = t.auth.tooManyAttempts;
                } else if (errorMsg === 'Invalid credentials' || errorMsg === 'Invalid email or password') {
                    errorMsg = t.auth.invalidCredentials;
                }
                setError(errorMsg || t.auth.invalidCredentials);
            }
        } catch (err) {
            setError(t.auth.unexpectedError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-3 sm:p-8 lg:p-14 flex items-center justify-center font-sans">
            <div className="w-full max-w-[1600px] h-full min-h-[85vh] grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-slate-100 dark:border-slate-800">
                {/* Left Side: Premium Image Gallery View */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[#8bb5d7]" // Sky blue to match image perfectly
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

                    {/* Bottom Ecosystem Card */}
                    <div className="relative z-30">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-sm"
                        >
                            <h2 className="text-4xl font-black text-white leading-none tracking-tighter">
                                {t.auth.ecosystemTitle.split(' ').slice(0, 2).join(' ')}<br /><span className="text-blue-100/70 text-2xl">{t.auth.ecosystemTitle.split(' ').slice(2).join(' ')}</span>
                            </h2>
                            <div className="h-1 w-16 bg-white/40 rounded-full mt-6" />
                            <p className="text-white/90 text-sm mt-6 leading-relaxed font-medium">
                                {t.auth.ecosystemSubtitle}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side: High-End Form Section */}
                <div className="w-full h-full flex items-center justify-center px-6 py-10 sm:px-16 lg:px-32 lg:py-24 bg-white dark:bg-slate-950 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-md"
                    >
                        {/* Seamless Logo Implementation */}
                        <div className="flex flex-col items-center mb-10">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                                className="bg-white dark:bg-white p-2 rounded-3xl"
                            >
                                <img
                                    src="/logo.png"
                                    alt="SupNum Logo"
                                    className="h-28 w-auto mix-blend-multiply select-none"
                                />
                            </motion.div>
                            <div className="text-center mt-6">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
                                    {t.auth.signInTitle}
                                </h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
                                    {t.auth.signInSubtitle}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-5">
                                {[
                                    { label: t.auth.email, type: "email", placeholder: "name@example.com", icon: Mail, value: email, setter: setEmail },
                                    { label: t.auth.password, type: showPassword ? "text" : "password", placeholder: "••••••••", icon: Lock, value: password, setter: setPassword, isPass: true }
                                ].map((field, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.1) }}
                                        className="space-y-2"
                                    >
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                                            {field.label}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                            <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                                            <Input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={field.value}
                                                onChange={(e) => field.setter(e.target.value)}
                                                required
                                                className="pl-12 h-14 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-xl transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-base"
                                            />
                                            {field.isPass && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors z-20"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] group"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                        {t.auth.signingIn}
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {t.auth.signInButton}
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                {t.auth.newToSupNum}{' '}
                                <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-bold hover:underline underline-offset-8 transition-all">
                                    {t.auth.createAccount}
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
