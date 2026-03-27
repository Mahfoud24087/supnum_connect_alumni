import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Camera, Save, Linkedin, Facebook, Globe, Building, Mail, Phone, MapPin, Calendar, Image as ImageIcon, Plus, Trash2, Send, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../components/Toast';

export default function CompanyProfile() {
    const { user, updateProfile } = useAuth();
    const { success, error } = useToast();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        location: '',
        website: '',
        industry: '',
        foundationYear: '',
        phone: '',
        contactEmail: '',
        latitude: '',
        longitude: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        youtube: '',
    });
    const [gallery, setGallery] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'success', 'error'

    // Sync form with user data
    useEffect(() => {
        if (user && user.name) {
            console.log('Syncing form with user data:', user);
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                industry: user.industry || '',
                foundationYear: user.foundationYear?.toString() || '',
                phone: user.phone || '',
                contactEmail: user.contactEmail || '',
                latitude: user.latitude?.toString() || '',
                longitude: user.longitude?.toString() || '',
                linkedin: user.social?.linkedin || '',
                facebook: user.social?.facebook || '',
                twitter: user.social?.twitter || '',
                youtube: user.social?.youtube || '',
            });
            setPreviewImage(user.avatar || null);
            if (user.gallery) setGallery(user.gallery);
        } else {
            console.log('User object missing or incomplete, skipping sync:', user);
        }
    }, [user]);

    // Check for changes
    useEffect(() => {
        if (!user) return;
        const isChanged =
            formData.name !== (user.name || '') ||
            formData.bio !== (user.bio || '') ||
            formData.location !== (user.location || '') ||
            formData.website !== (user.website || '') ||
            formData.industry !== (user.industry || '') ||
            formData.foundationYear !== (user.foundationYear || '') ||
            formData.phone !== (user.phone || '') ||
            formData.contactEmail !== (user.contactEmail || '') ||
            formData.latitude !== (user.latitude || '') ||
            formData.longitude !== (user.longitude || '') ||
            formData.linkedin !== (user.social?.linkedin || '') ||
            formData.facebook !== (user.social?.facebook || '') ||
            formData.twitter !== (user.social?.twitter || '') ||
            formData.youtube !== (user.social?.youtube || '') ||
            previewImage !== (user.avatar || null) ||
            JSON.stringify(gallery) !== JSON.stringify(user.gallery || []);

        setIsDirty(isChanged);
    }, [formData, previewImage, gallery, user]);

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

    const handleDetectLocation = async () => {
        if (!navigator.geolocation) {
            alert(t.common?.noAccess || "La géolocalisation n'est pas supportée par votre navigateur");
            return;
        }

        setSaveStatus('saving'); // Use as a temporary loading state
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    // Reverse geocoding using Nominatim (OSM)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    const address = data.address;
                    const city = address.city || address.town || address.village || address.suburb || '';
                    const country = address.country || '';
                    const locationString = city && country ? `${city}, ${country}` : (data.display_name || '');

                    setFormData(prev => ({
                        ...prev,
                        latitude: latitude.toString(),
                        longitude: longitude.toString(),
                        location: locationString || prev.location
                    }));
                } catch (geocodingError) {
                    console.error("Geocoding failed", geocodingError);
                    setFormData(prev => ({
                        ...prev,
                        latitude: latitude.toString(),
                        longitude: longitude.toString()
                    }));
                }
                
                setSaveStatus('');
                success("Position détectée !");
            },
            (error) => {
                console.error("Error detecting location", error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus(''), 2000);
                alert(t.common?.error || "Impossible de détecter votre position. Veuillez l'entrer manuellement.");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        try {
            const updatedProfile = {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                website: formData.website,
                industry: formData.industry,
                foundationYear: formData.foundationYear,
                phone: formData.phone,
                contactEmail: formData.contactEmail,
                latitude: formData.latitude,
                longitude: formData.longitude,
                avatar: previewImage,
                gallery: gallery,
                social: {
                    linkedin: formData.linkedin,
                    facebook: formData.facebook,
                    twitter: formData.twitter,
                    youtube: formData.youtube
                }
            };

            const result = await updateProfile(updatedProfile);
            if (result.success) {
                setSaveStatus('success');
                success(t.common?.saved || "Profil mis à jour");
                setTimeout(() => {
                    setSaveStatus('');
                    setIsDirty(false);
                }, 3000);
            } else {
                setSaveStatus('error');
                error(result.error || "Erreur lors de la mise à jour");
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (err) {
            console.error("Failed to save profile", err);
            setSaveStatus('error');
            error("Une erreur inattendue est survenue");
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
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.company.nav.profile}</h1>
            </div>

            {/* Profile Header Card */}
            <Card className="border-none shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-2xl border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                {previewImage ? (
                                    <img src={previewImage} alt="Company Logo" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-600 text-4xl font-bold text-slate-400 dark:text-slate-300">
                                        {user?.name?.[0]}
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-primary-700 transition-colors">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 text-lg">
                                <Building className="h-5 w-5 text-primary-500" /> {formData.industry || t.profile.industry}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    {formData.website || t.profile.website}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-black tracking-wider uppercase">
                                    {formData.location || t.profile.location}
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
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                             <Building className="h-5 w-5 text-primary-500" /> {t.profile.companyTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.companyName}</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.industry}</label>
                                <Input
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder={t.profile.industryPlaceholder}
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.website}</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://www.example.com"
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.foundationYear}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="number"
                                        value={formData.foundationYear}
                                        onChange={(e) => setFormData({ ...formData, foundationYear: e.target.value })}
                                        placeholder="2010"
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.location}</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder={t.profile.locationPlaceholder}
                                            className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDetectLocation}
                                        className="gap-2 shrink-0 border-primary-100 dark:border-primary-900 text-primary-600 dark:text-primary-400"
                                        title={t.profile.detectLocation}
                                    >
                                        <MapPin className="h-4 w-4" />
                                        <span className="hidden sm:inline">{t.profile.detectLocation}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.contactEmail}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        placeholder="contact@company.com"
                                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.contactPhone}</label>
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
                        </div>

                        {/* Map Location Section */}
                        <div className="pt-4 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-500" /> {t.profile.mapGeolocation}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">{t.profile.latitude}</label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        placeholder="ex: 18.0735"
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">{t.profile.longitude}</label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        placeholder="ex: -15.9582"
                                        className="bg-slate-50 dark:bg-slate-900 border-slate-200"
                                    />
                                </div>
                            </div>
                            
                            {formData.latitude && formData.longitude ? (
                                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-64 w-full bg-slate-100 relative">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0" 
                                        scrolling="no" 
                                        marginHeight="0" 
                                        marginWidth="0" 
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(formData.longitude)-0.01}%2C${parseFloat(formData.latitude)-0.01}%2C${parseFloat(formData.longitude)+0.01}%2C${parseFloat(formData.latitude)+0.01}&layer=mapnik&marker=${formData.latitude}%2C${formData.longitude}`}
                                        style={{ border: 0 }}
                                    ></iframe>
                                    <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-[10px] text-slate-500 shadow-sm border border-slate-200 dark:border-slate-700">
                                        {t.profile.mapPreview}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-64 w-full bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                    <MapPin className="h-12 w-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">{t.profile.mapInstructions}</p>
                                    <p className="text-xs mt-1">Exemple: 18.0735, -15.9582</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.profile.companyDescription}</label>
                            <textarea
                                className="w-full min-h-[150px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none outline-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder={t.profile.companyDescriptionPlaceholder}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <Linkedin className="h-5 w-5 text-[#0077b5]" /> {t.profile.socialNetworks}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <Linkedin className="h-4 w-4 text-[#0077b5]" /> LinkedIn Page
                                </label>
                                <Input
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    placeholder="https://linkedin.com/company/name"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook Page
                                </label>
                                <Input
                                    value={formData.facebook}
                                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                    placeholder="https://facebook.com/name"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <span className="text-slate-900 dark:text-white font-bold">X</span> (Twitter) Page
                                </label>
                                <Input
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    placeholder="https://x.com/username"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    <ImageIcon className="h-4 w-4 text-red-600" /> YouTube Channel
                                </label>
                                <Input
                                    value={formData.youtube}
                                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                    placeholder="https://youtube.com/@channel"
                                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Photo Gallery */}
                <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-purple-500" /> {t.profile.gallery}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {gallery.map((img, index) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                    <img src={img} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                            <label className="aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group">
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
                <div className="flex justify-end gap-4 items-center">
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
                        className={`px-10 py-6 text-lg rounded-xl shadow-xl transition-all ${!isDirty ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95 shadow-primary/20'}`}
                    >
                        <Save className="mr-2 h-5 w-5" />
                        {saveStatus === 'saving' ? t.common.saving : t.common.save}
                    </Button>
                </div>
            </form>


        </motion.div >
    );
}
