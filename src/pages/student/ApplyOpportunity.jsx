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
                alert('File size too large. Max 5MB.');
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
            alert(error.message || t.common.error);
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
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.apply.back}
            </button>

            <Card className="border-none shadow-xl bg-white dark:bg-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Briefcase className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">{opportunity.title}</h1>
                        <div className="flex justify-center gap-4 mt-2 text-blue-100">
                            <span className="flex items-center gap-1 font-medium"><Building className="h-4 w-4" /> {opportunity.company}</span>
                            <span className="flex items-center gap-1 font-medium"><MapPin className="h-4 w-4" /> {opportunity.location}</span>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" /> {t.apply.positionDetails}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                            {opportunity.description || t.common.noResults}
                        </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t.apply.candidateInfo}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> {t.apply.emailLabel}
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-slate-50 dark:bg-slate-900 h-12"
                                    />
                                </div>
                                {opportunity.requirePhone !== false && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> {t.apply.phoneLabel}
                                        </label>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="+222 ..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-slate-50 dark:bg-slate-900 h-12"
                                        />
                                    </div>
                                )}
                            </div>

                            {opportunity.requireCv !== false && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.apply.cvLabel}</label>
                                    <div className="relative h-32 w-full">
                                        <input
                                            type="file"
                                            accept=".pdf,image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            required={!formData.cvBase64}
                                        />
                                        <div className={`h-full w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${formData.cvFile ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500'}`}>
                                            {formData.cvFile ? (
                                                <>
                                                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">{formData.cvFile.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                                    <span className="text-sm text-slate-500">{t.apply.uploadText}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {opportunity.customQuestions?.length > 0 && (
                                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.apply.additionalInfo}</h3>
                                    <div className="grid gap-6">
                                        {opportunity.customQuestions.map((q, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {q.label} {q.required && <span className="text-red-500">*</span>}
                                                </label>
                                                {q.type === 'textarea' ? (
                                                    <textarea
                                                        required={q.required}
                                                        rows={3}
                                                        className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                        value={formData.customAnswers[q.label] || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            customAnswers: { ...formData.customAnswers, [q.label]: e.target.value }
                                                        })}
                                                    />
                                                ) : q.type === 'select' ? (
                                                    <select
                                                        required={q.required}
                                                        className="w-full h-12 rounded-xl border-none bg-slate-50 dark:bg-slate-900 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                        value={formData.customAnswers[q.label] || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            customAnswers: { ...formData.customAnswers, [q.label]: e.target.value }
                                                        })}
                                                    >
                                                        <option value="">{t.common.selectPrompt || 'Select an option...'}</option>
                                                        {q.options?.split(',').map(opt => (
                                                            <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <Input
                                                        required={q.required}
                                                        type={q.type}
                                                        value={formData.customAnswers[q.label] || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            customAnswers: { ...formData.customAnswers, [q.label]: e.target.value }
                                                        })}
                                                        className="bg-slate-50 dark:bg-slate-900 h-12"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {opportunity.requireMessage !== false && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.apply.messageToAdmin}</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder={t.apply.messagePlaceholder}
                                        className="w-full rounded-xl border-none bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.apply.submitting}
                                    </>
                                ) : (
                                    <>
                                        {t.apply.submit} <Send className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
