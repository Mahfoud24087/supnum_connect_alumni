import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Plus, Search, MapPin, Building, Trash2, Edit, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../services/api';

export function ManageInternships() {
    const { t } = useLanguage();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInternship, setCurrentInternship] = useState(null);

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
        requirePhone: true
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

    const filteredInternships = internships.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                requirePhone: internship.requirePhone !== false
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
                requirePhone: true
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
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`/internships/${id}`);
            fetchInternships();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleActive = async (id) => {
        try {
            await apiClient.patch(`/internships/${id}/toggle`);
            fetchInternships();
        } catch (error) {
            console.error(error);
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

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.admin.manageInternships.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
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
                                <Button onClick={() => handleDelete(internship.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.jobTitle}</label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Software Engineer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.company}</label>
                                <Input
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g. Tech Corp"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.type}</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Internship</option>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageInternships.form.location}</label>
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Nouakchott"
                                    />
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
        </div>
    );
}
