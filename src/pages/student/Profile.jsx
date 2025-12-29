import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Linkedin, Github, Facebook, GraduationCap, Mail, User, Briefcase, Calendar, Phone, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
    const { user, updateProfile } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        linkedin: user?.social?.linkedin || '',
        github: user?.social?.github || '',
        facebook: user?.social?.facebook || '',
        phone: user?.phone || '',
        birthday: user?.birthday || '',
        workStatus: user?.workStatus || '',
        jobTitle: user?.jobTitle || '',
        company: user?.company || ''
    });
    const [previewImage, setPreviewImage] = useState(user?.avatar || null);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'

    // Check for changes
    useEffect(() => {
        const isChanged =
            formData.name !== (user?.name || '') ||
            formData.bio !== (user?.bio || '') ||
            formData.linkedin !== (user?.social?.linkedin || '') ||
            formData.github !== (user?.social?.github || '') ||
            formData.facebook !== (user?.social?.facebook || '') ||
            formData.phone !== (user?.phone || '') ||
            formData.birthday !== (user?.birthday || '') ||
            formData.workStatus !== (user?.workStatus || '') ||
            formData.jobTitle !== (user?.jobTitle || '') ||
            formData.company !== (user?.company || '') ||
            previewImage !== (user?.avatar || null);

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

    const handleSubmit = (e) => {
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
                social: {
                    linkedin: formData.linkedin,
                    github: formData.github,
                    facebook: formData.facebook
                }
            };

            updateProfile(updatedProfile);
            setSaveStatus('success');
            setTimeout(() => {
                setSaveStatus('');
                setIsDirty(false);
            }, 3000);
        } catch (error) {
            console.error("Failed to save profile", error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
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
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.fullName}</label>
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
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
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
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Birthday</label>
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.bio}</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white">Professional Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Status</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        value={formData.workStatus}
                                        onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                                        className="w-full h-11 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="employed">Employed</option>
                                        <option value="seeking">Seeking Opportunities</option>
                                        <option value="studying">Continuing Studies</option>
                                        <option value="freelance">Freelancing</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                                <Input
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g. Software Engineer"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company / Organization</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Tech Corp"
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
                        <CardTitle className="text-xl text-slate-900 dark:text-white">{t.profile.socialLinks}</CardTitle>
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

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    {saveStatus === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium"
                        >
                            ✓ Changes saved successfully!
                        </motion.div>
                    )}
                    <Button
                        type="submit"
                        disabled={!isDirty || saveStatus === 'saving'}
                        className={`px-8 ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
