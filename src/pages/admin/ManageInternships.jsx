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
import InternshipForm from '../../components/InternshipForm';

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
    const [filterAudience, setFilterAudience] = useState('all');

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
        const matchAudience = filterAudience === 'all' || i.targetAudience === filterAudience;
        return matchSearch && matchType && matchLocation && matchWorkplace && matchAudience;
    });

    const uniqueLocations = Array.from(new Set(internships.map(i => i.location).filter(Boolean)));

    const handleOpenModal = (internship = null) => {
        setCurrentInternship(internship);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentInternship(null);
    };

    const handleSubmit = async (formData) => {
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

                    {/* Audience Cible filter */}
                    <select
                        value={filterAudience}
                        onChange={(e) => setFilterAudience(e.target.value)}
                        className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-3 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">🎯 {t.admin.manageInternships.form.targetAudience}: Tous</option>
                        <option value="All">{t.admin.manageInternships.form.audiences?.all || 'Tout le monde'}</option>
                        <option value="Students">{t.admin.manageInternships.form.audiences?.students || 'Étudiants'}</option>
                        <option value="Graduates">{t.admin.manageInternships.form.audiences?.graduates || 'Diplômés'}</option>
                    </select>

                    {/* Reset filters */}
                    {(filterType !== 'all' || filterLocation !== 'all' || filterWorkplace !== 'all' || filterAudience !== 'all' || searchTerm) && (
                        <button
                            onClick={() => { setFilterType('all'); setFilterLocation('all'); setFilterWorkplace('all'); setFilterAudience('all'); setSearchTerm(''); }}
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
                <InternshipForm
                    initialData={currentInternship}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    t={t}
                />
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
