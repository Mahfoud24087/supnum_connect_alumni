import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GraduationCap, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/authService';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await authService.forgotPassword(email);

        if (result.success) {
            setIsSubmitted(true);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex flex-col">
            <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-12 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">SupNum Connect</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800">
                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.auth.forgotPasswordTitle}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{t.auth.forgotPasswordDesc}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

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
                                                className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                        ) : (
                                            <>{t.auth.sendResetLink} <ArrowRight className="ml-2 h-4 w-4" /></>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.auth.resetLinkSent}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8">
                                    {t.auth.resetLinkSent}
                                </p>
                            </div>
                        )}

                        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                            <Link
                                to="/signin"
                                className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t.auth.backToSignIn}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
