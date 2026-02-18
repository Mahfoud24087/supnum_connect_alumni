import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Linkedin, Github, Facebook, GraduationCap, Mail, User, Briefcase, Calendar, Phone, Building, FileText, Image as ImageIcon, Plus, Trash2, Download, Paperclip, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
    const { user, updateProfile } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        linkedin: '',
        github: '',
        facebook: '',
        phone: '',
        birthday: '',
        workStatus: '',
        jobTitle: '',
        company: '',
        cvUrl: ''
    });
    const [gallery, setGallery] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'

    // Sync form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                linkedin: user.social?.linkedin || '',
                github: user.social?.github || '',
                facebook: user.social?.facebook || '',
                phone: user.phone || '',
                birthday: user.birthday ? user.birthday.split('T')[0] : '',
                workStatus: user.workStatus || '',
                jobTitle: user.jobTitle || '',
                company: user.company || '',
                cvUrl: user.cvUrl || ''
            });
            setPreviewImage(user.avatar || null);
            setGallery(user.gallery || []);
        }
    }, [user]);

    // Check for changes
    useEffect(() => {
        if (!user) return;
        const isChanged =
            formData.name !== (user.name || '') ||
            formData.bio !== (user.bio || '') ||
            formData.linkedin !== (user.social?.linkedin || '') ||
            formData.github !== (user.social?.github || '') ||
            formData.facebook !== (user.social?.facebook || '') ||
            formData.phone !== (user.phone || '') ||
            formData.birthday !== (user.birthday ? user.birthday.split('T')[0] : '') ||
            formData.workStatus !== (user.workStatus || '') ||
            formData.jobTitle !== (user.jobTitle || '') ||
            formData.company !== (user.company || '') ||
            formData.cvUrl !== (user.cvUrl || '') ||
            previewImage !== (user.avatar || null) ||
            JSON.stringify(gallery) !== JSON.stringify(user.gallery || []);

        setIsDirty(isChanged);
    }, [formData, previewImage, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                console.error('Only PDF files are allowed');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, cvUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImageAdd = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGallery([...gallery, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImageDelete = (index) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        try {
            const updatedProfile = {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                avatar: previewImage,
                phone: formData.phone,
                birthday: formData.birthday,
                workStatus: formData.workStatus,
                jobTitle: formData.jobTitle,
                company: formData.company,
                cvUrl: formData.cvUrl,
                gallery: gallery,
                social: {
                    linkedin: formData.linkedin,
                    github: formData.github,
                    facebook: formData.facebook
                }
            };

            const result = await updateProfile(updatedProfile);
            if (result.success) {
                setSaveStatus('success');
                setTimeout(() => {
                    setSaveStatus('');
                    setIsDirty(false);
                }, 3000);
            } else {
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (error) {
            console.error("Failed to save profile", error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const handleExportCV = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const currentLang = localStorage.getItem('language') || 'FR';
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/users/${user.id}/export-cv?lang=${currentLang}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to download CV');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${user.name.replace(/\s+/g, '_')}_CV.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 pb-12"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.profile.title}</h1>
                <Button onClick={handleExportCV} variant="outline" className="shadow-md">
                    <Download className="mr-2 h-4 w-4" /> Export CV
                </Button>
            </div>

            {/* Profile Header Card */}
            <Card className="border-none shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 text-4xl font-bold text-slate-400 dark:text-slate-300">
                                        {user?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="h-4 w-4" /> {user?.email}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                                <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    {user?.role === 'student' ? t.profile.student : t.profile.graduate}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.profile.basicInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.name}</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.supnumId}</label>
                                <Input
                                    value={user?.supnumId || ''}
                                    disabled
                                    className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.phone}</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+222 ..."
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.birthday}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={formData.birthday}
                                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.location}</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder={t.profile.locationPlaceholder}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.bio}</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder={t.profile.bioPlaceholder}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.common.professionalInfo}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.workStatus.label}</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        value={formData.workStatus}
                                        onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                                        className="w-full h-11 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">{t.common.workStatus.select}</option>
                                        <option value="employed">{t.common.workStatus.employed}</option>
                                        <option value="seeking">{t.common.workStatus.seeking}</option>
                                        <option value="studying">{t.common.workStatus.studying}</option>
                                        <option value="freelance">{t.common.workStatus.freelance}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.jobTitle}</label>
                                <Input
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder={t.profile.jobPlaceholder}
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.common.company}</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder={t.profile.companyPlaceholder}
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <Linkedin className="h-5 w-5 text-[#0077b5]" /> {t.profile.socialLinks}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn
                            </label>
                            <Input
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Github className="h-4 w-4 text-slate-900 dark:text-white" /> GitHub
                            </label>
                            <Input
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                placeholder="https://github.com/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                            </label>
                            <Input
                                value={formData.facebook}
                                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                placeholder="https://facebook.com/username"
                                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* CV Section */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" /> {t.profile.cv}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {formData.cvUrl ? (
                                <div className="flex-1 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <FileText className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Curriculum Vitae.pdf</p>
                                            <p className="text-xs text-slate-500">PDF Document</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={formData.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, cvUrl: '' })}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full group-hover:scale-110 transition-transform">
                                        <Paperclip className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <span className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">{t.profile.uploadCv}</span>
                                    <span className="mt-1 text-xs text-slate-400">PDF (Max 5MB)</span>
                                    <input type="file" className="hidden" accept="application/pdf" onChange={handleCvChange} />
                                </label>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Gallery Section */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-purple-500" /> {t.profile.gallery}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {gallery.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                    <img src={img} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleGalleryImageDelete(index)}
                                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <label className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                                    <Plus className="h-6 w-6 text-slate-500" />
                                </div>
                                <span className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">{t.profile.addGalleryImage}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryImageAdd} />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    {saveStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium"
                        >
                            ✓ {t.common.saved}
                        </motion.div>
                    )}
                    <Button
                        type="submit"
                        disabled={!isDirty || saveStatus === 'saving'}
                        className={`px-8 ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saveStatus === 'saving' ? t.common.saving : t.common.save}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
