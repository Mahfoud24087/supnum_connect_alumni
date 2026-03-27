import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/Toast';
import { Briefcase, Building, MapPin, Send, ArrowLeft, Loader2, Upload, Phone, Mail, FileText, CheckCircle, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

export function ApplyOpportunity() {
    const { id } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { success: showSuccessToast, error: showErrorToast } = useToast();
    const navigate = useNavigate();

    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        message: '',
        cvFile: null,
        cvBase64: '',
        email: user?.email || '',
        phone: '',
        customAnswers: {}
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await apiClient.get(`/internships/${id}`);
                setOpportunity(response.internship);
            } catch (error) {
                console.error('Failed to fetch opportunity:', error);
                setError(t.common?.error || 'Failed to fetch opportunity');
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // Increase to 10MB as Supabase handles larger files
                setError('File size too large. Max 10MB.');
                return;
            }
            setError('');
            setFormData({ ...formData, cvFile: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, cvBase64: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            console.log('📤 Submitting application for:', id);
            const payload = {
                internshipId: id,
                message: formData.message,
                cvUrl: formData.cvBase64,
                email: formData.email,
                phone: formData.phone,
                customAnswers: formData.customAnswers
            };
            
            const response = await apiClient.post('/applications', payload);
            console.log('✅ Application submitted successfully:', response);
            
            showSuccessToast(t.apply?.successTitle || 'Application submitted successfully!');
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/dashboard/feed');
            }, 2500);
        } catch (err) {
            console.error('❌ Application submission error:', err);
            const errorMsg = err.response?.data?.message || t.common?.error || 'Submit failed';
            setError(errorMsg);
            showErrorToast(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">{t.common?.loading || 'Loading...'}</p>
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="max-w-md mx-auto py-24 text-center space-y-6">
                <div className="h-20 w-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto rotate-3 shadow-lg">
                    <XCircle className="h-10 w-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.apply.notFound}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t.common?.noData}</p>
                </div>
                <Button onClick={() => navigate(-1)} variant="ghost" className="mt-8 font-black uppercase tracking-tighter">
                    <ArrowLeft className="mr-2 h-5 w-5" /> {t.apply.goBack}
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-lg w-full bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] text-center space-y-8 border border-white dark:border-slate-800 shadow-2xl"
                >
                    <div className="relative mx-auto w-24 h-24">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            className="h-24 w-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-green-500/20"
                        >
                            <Send className="h-12 w-12" />
                        </motion.div>
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-3 -right-3 h-8 w-8 bg-white dark:bg-slate-800 rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center"
                        >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </motion.div>
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter decoration-green-500 underline decoration-8 underline-offset-8 decoration-skip-ink">
                            {t.apply.successTitle}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-lg leading-snug pt-4">
                            {t.apply.successSubtitle.replace('{title}', opportunity.title)}
                        </p>
                    </div>

                    <div className="pt-6">
                        <div className="h-1.5 w-48 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 2.5, ease: "linear" }}
                                className="h-full bg-blue-600 rounded-full"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">
                            {t.apply.redirecting}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-10 lg:p-14 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto space-y-8"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    {t.apply.back}
                </button>

                <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 md:p-14 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150">
                            <Briefcase className="h-48 w-48" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase border border-white/10"
                            >
                                {opportunity.type || 'Opportunity'}
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">{opportunity.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-blue-100 font-medium pt-2">
                                <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-sm">
                                    <Building className="h-4 w-4" /> {opportunity.company}
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-sm">
                                    <MapPin className="h-4 w-4" /> {opportunity.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-8 md:p-14 space-y-12">
                        {/* Position Description */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {t.apply.positionDetails}
                                </h3>
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950/40 p-8 rounded-[2rem] text-lg font-medium border border-slate-100 dark:border-slate-800 shadow-inner">
                                {opportunity.description || t.common.noResults}
                            </div>
                        </section>

                        {/* Application Form */}
                        <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col mb-10">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t.apply.candidateInfo}</h3>
                                <p className="text-slate-500 font-medium mt-2">{t.apply.fillFormSubtitle || 'Please provide your details and CV to apply.'}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-500" /> {t.apply.emailLabel}
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-950 h-14 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 font-medium"
                                        />
                                    </motion.div>

                                    {opportunity.requirePhone !== false && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="space-y-3"
                                        >
                                            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-blue-500" /> {t.apply.phoneLabel}
                                            </label>
                                            <Input
                                                required
                                                type="tel"
                                                placeholder="+222 ..."
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-slate-50 dark:bg-slate-950 h-14 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 font-medium"
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {opportunity.requireCv !== false && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-4"
                                    >
                                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t.apply.cvLabel}</label>
                                        <div className="relative group crosshair">
                                            <input
                                                type="file"
                                                accept=".pdf,image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                required={!formData.cvBase64}
                                            />
                                            <div className={`min-h-[160px] w-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 ${formData.cvFile ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 group-hover:border-blue-500 group-hover:bg-blue-50/30'}`}>
                                                <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${formData.cvFile ? 'bg-green-100 text-green-600 scale-110 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 shadow-md group-hover:scale-110 group-hover:text-blue-500'}`}>
                                                    {formData.cvFile ? <CheckCircle className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
                                                </div>
                                                <div className="text-center px-6">
                                                    {formData.cvFile ? (
                                                        <span className="text-lg font-bold text-green-700 dark:text-green-400 block">{formData.cvFile.name}</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-lg font-bold text-slate-900 dark:text-white block">{t.apply.uploadText}</span>
                                                            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">{t.apply.maxSizeLabel || 'PDF or Images • Max 5MB'}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {opportunity.customQuestions?.length > 0 && (
                                    <div className="space-y-8 pt-10 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.apply.additionalInfo}</h3>
                                        <div className="grid gap-8 pb-4">
                                            {opportunity.customQuestions.map((q, idx) => (
                                                <div key={idx} className="space-y-3">
                                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                                        {q.label} {q.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {q.type === 'textarea' ? (
                                                        <textarea
                                                            required={q.required}
                                                            rows={4}
                                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium placeholder:text-slate-400"
                                                            value={formData.customAnswers[q.label] || ''}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                customAnswers: { ...formData.customAnswers, [q.label]: e.target.value }
                                                            })}
                                                        />
                                                    ) : (
                                                        <Input
                                                            required={q.required}
                                                            type={q.type === 'select' ? 'text' : q.type} // Using simple inputs for custom questions in this layout
                                                            className="bg-slate-50 dark:bg-slate-950 h-14 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 font-medium"
                                                            value={formData.customAnswers[q.label] || ''}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                customAnswers: { ...formData.customAnswers, [q.label]: e.target.value }
                                                            })}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {opportunity.requireMessage !== false && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="space-y-3"
                                    >
                                        <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t.apply.messageToAdmin}</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder={t.apply.messagePlaceholder}
                                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium placeholder:text-slate-400"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-5 rounded-2xl flex items-center gap-4 text-red-600 dark:text-red-400 font-bold mb-6"
                                    >
                                        <XCircle className="h-6 w-6 flex-shrink-0" />
                                        <p>{error}</p>
                                    </motion.div>
                                )}

                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-[1.5rem] text-xl font-black shadow-2xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 group"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" /> {t.apply.submitting}
                                            </>
                                        ) : (
                                            <>
                                                {t.apply.submit} <Send className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-slate-500 mt-6 font-bold uppercase tracking-widest opacity-60">
                                        Your application will be sent directly to the HR department.
                                    </p>
                                </div>
                            </form>
                        </section>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
