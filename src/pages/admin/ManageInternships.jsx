import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Plus, Search, MapPin, Building, Trash2, Edit, X, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../services/api';
import { useToast } from '../../components/Toast';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { DatePicker } from '../../components/ui/DatePicker';

export function ManageInternships() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInternship, setCurrentInternship] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [internshipToDelete, setInternshipToDelete] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [filterWorkplace, setFilterWorkplace] = useState('all');

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        type: 'Internship',
        location: '',
        active: true,
        description: '',
        customQuestions: [],
        requireCv: true,
        requireMessage: true,
        requirePhone: true,
        targetAudience: 'All',
        startDate: '',
        endDate: '',
        workplaceType: 'On-site'
    });

    const fetchInternships = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/internships');
            setInternships(response.internships);
        } catch (error) {
            console.error('Failed to fetch internships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    // Safety check for translations
    if (!t || !t.admin.manageInternships) {
        return <div className="p-8 text-center">Loading translations...</div>;
    }

    const filteredInternships = internships.filter(i => {
        const s = searchTerm.toLowerCase();
        const matchSearch = i.title.toLowerCase().includes(s) || i.company.toLowerCase().includes(s);
        const matchType = filterType === 'all' || i.type?.toLowerCase().includes(filterType.toLowerCase());
        const matchLocation = filterLocation === 'all' || i.location?.toLowerCase() === filterLocation.toLowerCase();
        const matchWorkplace = filterWorkplace === 'all' || i.workplaceType?.toLowerCase() === filterWorkplace.toLowerCase();
        return matchSearch && matchType && matchLocation && matchWorkplace;
    });

    const uniqueLocations = Array.from(new Set(internships.map(i => i.location).filter(Boolean)));

    const handleOpenModal = (internship = null) => {
        if (internship) {
            setCurrentInternship(internship);
            setFormData({
                title: internship.title,
                company: internship.company,
                type: internship.type,
                location: internship.location,
                active: internship.active,
                description: internship.description || '',
                customQuestions: internship.customQuestions || [],
                requireCv: internship.requireCv !== false,
                requireMessage: internship.requireMessage !== false,
                requirePhone: internship.requirePhone !== false,
                targetAudience: internship.targetAudience || 'All',
                startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : '',
                endDate: internship.endDate ? new Date(internship.endDate).toISOString().split('T')[0] : '',
                workplaceType: internship.workplaceType || 'On-site'
            });
        } else {
            setCurrentInternship(null);
            setFormData({
                title: '',
                company: '',
                type: 'Internship',
                location: '',
                active: true,
                description: '',
                customQuestions: [],
                requireCv: true,
                requireMessage: true,
                requirePhone: true,
                targetAudience: 'All',
                startDate: '',
                endDate: '',
                workplaceType: 'On-site'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentInternship(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentInternship) {
                await apiClient.put(`/internships/${currentInternship.id}`, formData);
            } else {
                await apiClient.post('/internships', formData);
            }
            fetchInternships();
            handleCloseModal();
            showToast(currentInternship ? 'Opportunité mise à jour' : 'Opportunité publiée avec succès', 'success');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleDeleteClick = (internship) => {
        setInternshipToDelete(internship);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!internshipToDelete) return;
        try {
            await apiClient.delete(`/internships/${internshipToDelete.id}`);
            showToast('Opportunité supprimée', 'success');
            fetchInternships();
        } catch (error) {
            console.error(error);
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const toggleActive = async (id) => {
        try {
            await apiClient.patch(`/internships/${id}/toggle`);
            fetchInternships();
            showToast('Statut mis à jour', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erreur lors du changement de statut', 'error');
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.manageInternships.title}</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> {t.admin.manageInternships.postOpportunity}
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm space-y-3">
                {/* Search row */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.admin.manageInternships.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>

                {/* Filter row */}
                <div className="flex flex-wrap gap-2 pt-1">
                    {/* Type toggle pill group */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        {[
                            ['all', t.admin.manageInternships.filterTypes?.all || 'Tous'],
                            ['Internship', t.admin.manageInternships.filterTypes?.internship || 'Stages'],
                            ['Job', t.admin.manageInternships.filterTypes?.job || 'Emplois'],
                            ['Training', t.admin.manageInternships.filterTypes?.training || 'Formations']
                        ].map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => setFilterType(val)}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${filterType === val
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Location dropdown — dynamic from data */}
                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">📍 Lieu: Tous</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>

                    {/* Workplace mode dropdown */}
                    <select
                        value={filterWorkplace}
                        onChange={(e) => setFilterWorkplace(e.target.value)}
                        className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">🏢 Mode: Tous</option>
                        <option value="On-site">Présentiel</option>
                        <option value="Remote">À distance</option>
                        <option value="Hybrid">Hybride</option>
                    </select>

                    {/* Reset filters */}
                    {(filterType !== 'all' || filterLocation !== 'all' || filterWorkplace !== 'all' || searchTerm) && (
                        <button
                            onClick={() => { setFilterType('all'); setFilterLocation('all'); setFilterWorkplace('all'); setSearchTerm(''); }}
                            className="h-9 px-3 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            ✕ Réinitialiser
                        </button>
                    )}

                    {/* Results count */}
                    <span className="ml-auto self-center text-xs text-slate-400 font-medium">
                        {filteredInternships.length} résultat{filteredInternships.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredInternships.map((internship) => (
                    <Card key={internship.id} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{internship.title}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {internship.company}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {internship.location}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium">{internship.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 self-end md:self-center">
                                <button
                                    onClick={() => toggleActive(internship.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${internship.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    {internship.active ? t.admin.manageInternships.active : t.admin.manageInternships.closed}
                                </button>
                                <Button onClick={() => handleOpenModal(internship)} variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => handleDeleteClick(internship)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentInternship ? t.admin.manageInternships.editOpportunity : t.admin.manageInternships.postOpportunity}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.manageInternships.form.basicInfo || 'Informations de base'}</h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.jobTitle}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Briefcase className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. Lead Developer"
                                                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.company}</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Building className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="e.g. SupNum Tech"
                                                className="pl-10 bg-white dark:bg-slate-900 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.admin.manageInternships.form.details || 'Détails de l\'opportunité'}</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.type || 'Type d\'opportunité'}</label>
                                            <select
                                                required
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            >
                                                <option value="Internship">{t.admin.manageInternships.filterTypes?.internship || 'Stage'}</option>
                                                <option value="Job">{t.admin.manageInternships.filterTypes?.job || 'Emploi'}</option>
                                                <option value="Training">{t.admin.manageInternships.filterTypes?.training || 'Formation'}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.targetAudience}</label>
                                            <select
                                                className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                value={formData.targetAudience}
                                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                            >
                                                <option value="All">{t.admin.manageInternships.form.audiences.all}</option>
                                                <option value="Students">{t.admin.manageInternships.form.audiences.students}</option>
                                                <option value="Graduates">{t.admin.manageInternships.form.audiences.graduates}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.workplaceType}</label>
                                            <select
                                                className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                value={formData.workplaceType}
                                                onChange={(e) => setFormData({ ...formData, workplaceType: e.target.value })}
                                            >
                                                <option value="On-site">{t.admin.manageInternships.form.workplace.onSite}</option>
                                                <option value="Remote">{t.admin.manageInternships.form.workplace.remote}</option>
                                                <option value="Hybrid">{t.admin.manageInternships.form.workplace.hybrid}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.location}</label>
                                            <Input
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="e.g. Nouakchott"
                                                className="bg-white dark:bg-slate-900 border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.startDate}</label>
                                            <DatePicker
                                                value={formData.startDate}
                                                onChange={(date) => setFormData({ ...formData, startDate: date })}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.endDate}</label>
                                            <DatePicker
                                                value={formData.endDate}
                                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 py-4 border-t border-b border-slate-100 dark:border-slate-800">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.admin.manageInternships.form.appRequirements}</label>
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="requireCv"
                                            checked={formData.requireCv}
                                            onChange={(e) => setFormData({ ...formData, requireCv: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="requireCv" className="text-sm text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.requireCv}</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="requireMessage"
                                            checked={formData.requireMessage}
                                            onChange={(e) => setFormData({ ...formData, requireMessage: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="requireMessage" className="text-sm text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.requireMessage}</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="requirePhone"
                                            checked={formData.requirePhone}
                                            onChange={(e) => setFormData({ ...formData, requirePhone: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="requirePhone" className="text-sm text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.requirePhone}</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="active" className="text-sm font-bold text-blue-600">{t.admin.manageInternships.form.activeListing}</label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.admin.manageInternships.form.customQuestions}</label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setFormData({ ...formData, customQuestions: [...formData.customQuestions, { label: '', type: 'text', required: true }] })}
                                        className="h-8 text-xs"
                                    >
                                        <Plus className="h-3 w-3 mr-1" /> {t.admin.manageInternships.form.addQuestion}
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.customQuestions.map((q, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-2 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newQs = [...formData.customQuestions];
                                                    newQs.splice(idx, 1);
                                                    setFormData({ ...formData, customQuestions: newQs });
                                                }}
                                                className="absolute -right-2 -top-2 h-6 w-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <Input
                                                required
                                                placeholder={t.admin.manageInternships.form.questionLabel}
                                                value={q.label}
                                                onChange={(e) => {
                                                    const newQs = [...formData.customQuestions];
                                                    newQs[idx].label = e.target.value;
                                                    setFormData({ ...formData, customQuestions: newQs });
                                                }}
                                                className="h-9 text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    className="flex-1 h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                                                    value={q.type}
                                                    onChange={(e) => {
                                                        const newQs = [...formData.customQuestions];
                                                        newQs[idx].type = e.target.value;
                                                        setFormData({ ...formData, customQuestions: newQs });
                                                    }}
                                                >
                                                    <option value="text">Short Text</option>
                                                    <option value="url">URL Link</option>
                                                    <option value="textarea">Long Text</option>
                                                    <option value="select">Dropdown Choice</option>
                                                </select>
                                                {q.type === 'select' && (
                                                    <Input
                                                        placeholder={t.admin.manageInternships.form.options}
                                                        value={q.options || ''}
                                                        onChange={(e) => {
                                                            const newQs = [...formData.customQuestions];
                                                            newQs[idx].options = e.target.value;
                                                            setFormData({ ...formData, customQuestions: newQs });
                                                        }}
                                                        className="h-8 text-[10px] mt-1"
                                                    />
                                                )}
                                                <label className="flex items-center gap-1 text-[10px] text-slate-500">
                                                    <input
                                                        type="checkbox"
                                                        checked={q.required}
                                                        onChange={(e) => {
                                                            const newQs = [...formData.customQuestions];
                                                            newQs[idx].required = e.target.checked;
                                                            setFormData({ ...formData, customQuestions: newQs });
                                                        }}
                                                    />
                                                    {t.admin.manageInternships.form.required}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.customQuestions.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-2">No custom questions added.</p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">{t.admin.manageInternships.form.cancel}</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    {currentInternship ? t.admin.manageInternships.form.saveChanges : t.admin.manageInternships.postOpportunity}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'opportunité"
                message={`Voulez-vous vraiment supprimer "${internshipToDelete?.title}" ?`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
}
