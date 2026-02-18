import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Briefcase, Building, MapPin, Send, ArrowLeft, Loader2, Upload, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

export function ApplyOpportunity() {
    const { id } = useParams();
    const { user } = useAuth();
    const { t } = useLanguage();
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

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await apiClient.get(`/internships/${id}`);
                setOpportunity(response.internship);
            } catch (error) {
                console.error('Failed to fetch opportunity:', error);
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
            if (file.size > 5 * 1024 * 1024) {
                console.warn('File size too large. Max 5MB.');
                return;
            }
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
        try {
            await apiClient.post('/applications', {
                internshipId: id,
                message: formData.message,
                cvUrl: formData.cvBase64,
                email: formData.email,
                phone: formData.phone,
                customAnswers: formData.customAnswers
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!opportunity) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">{t.apply.notFound}</h2>
                <Button onClick={() => navigate(-1)} variant="ghost" className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.apply.goBack}
                </Button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Send className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.apply.successTitle}</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    {t.apply.successSubtitle.replace('{title}', opportunity.title)}
                </p>
                <p className="text-sm text-slate-400">{t.apply.redirecting}</p>
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
