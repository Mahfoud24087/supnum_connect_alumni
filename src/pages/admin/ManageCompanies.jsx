import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Building, Plus, Search, Globe, MapPin, Trash2, Edit, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/Toast';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { apiClient } from '../../services/api';

export function ManageCompanies() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [formData, setFormData] = useState({ name: '', industry: '', location: '', website: '', description: '' });

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/companies');
            setCompanies(response.companies || []);
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (company = null) => {
        if (company) {
            setCurrentCompany(company);
            setFormData({
                name: company.name,
                industry: company.industry,
                location: company.location,
                website: company.website || '',
                description: company.description || ''
            });
        } else {
            setCurrentCompany(null);
            setFormData({ name: '', industry: '', location: '', website: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCompany(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentCompany) {
                await apiClient.put(`/companies/${currentCompany.id}`, formData);
            } else {
                await apiClient.post('/companies', formData);
            }
            showToast(currentCompany ? 'Entreprise mise à jour' : 'Entreprise ajoutée avec succès', 'success');
            fetchCompanies();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save company:', error);
            showToast(error.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    };

    const handleDeleteClick = (company) => {
        setCompanyToDelete(company);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!companyToDelete) return;
        try {
            await apiClient.delete(`/companies/${companyToDelete.id}`);
            setCompanies(companies.filter(c => c.id !== companyToDelete.id));
            showToast('Entreprise supprimée', 'success');
        } catch (error) {
            console.error('Failed to delete company:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.footer.companies}</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> {t.admin.manageCompanies.addCompany}
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Rechercher une entreprise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Building className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                                        {company.industry}
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{company.name}</h3>
                                <div className="space-y-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        {company.location}
                                    </div>
                                    {company.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-slate-400" />
                                            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors truncate">
                                                {company.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleOpenModal(company)} variant="outline" className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <Edit className="h-4 w-4 mr-2" /> {t.common.edit}
                                    </Button>
                                    <Button onClick={() => handleDeleteClick(company)} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredCompanies.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            {t.admin.manageCompanies.noCompanies || "Aucune entreprise trouvée"}
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentCompany ? t.admin.manageCompanies.editCompany : t.admin.manageCompanies.addCompany}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nom</label>
                                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. SupNum" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Secteur</label>
                                    <Input required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} placeholder="e.g. Technology" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lieu</label>
                                    <Input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Nouakchott" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Site Web</label>
                                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="e.g. www.supnum.mr" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                    <textarea
                                        className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Décrivez l'entreprise..."
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">Annuler</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    Enregistrer
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
                title="Supprimer l'entreprise"
                message={`Êtes-vous sûr de vouloir supprimer ${companyToDelete?.name} ?`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
}
