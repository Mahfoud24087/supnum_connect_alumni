import React, { useState, useEffect } from 'react';
import { 
    Briefcase, 
    Plus, 
    Search, 
    MapPin,
    Building,
    Edit, 
    Trash2,
    Calendar,
    Users,
    Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import InternshipForm from '../../components/InternshipForm';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const ManageCompanyOffers = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterLocation, setFilterLocation] = useState('all');
    const [filterAudience, setFilterAudience] = useState('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [offerToDelete, setOfferToDelete] = useState(null);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/internships?myOffers=true');
            setOffers(res.internships);
        } catch (error) {
            console.error('Error fetching company offers:', error);
            showToast('error', 'Failed to fetch offers');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await apiClient.patch(`/internships/${id}/toggle`);
            setOffers(offers.map(o => o.id === id ? { ...o, active: !o.active } : o));
            showToast('success', 'Statut mis à jour');
        } catch (error) {
            showToast('error', 'Erreur lors du changement de statut');
        }
    };

    const handleDeleteClick = (offer) => {
        setOfferToDelete(offer);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!offerToDelete) return;
        try {
            await apiClient.delete(`/internships/${offerToDelete.id}`);
            setOffers(offers.filter(o => o.id !== offerToDelete.id));
            showToast('success', 'Offre supprimée avec succès');
            setIsConfirmOpen(false);
        } catch (error) {
            console.error('Error deleting offer:', error);
            showToast('error', error.message || 'Échec de la suppression de l\'offre');
        }
    };

    const handleSave = async (formData) => {
        try {
            const { id, createdAt, updatedAt, createdById, applyingCount, ...cleanData } = formData;
            if (editingOffer) {
                await apiClient.put(`/internships/${editingOffer.id}`, cleanData);
                showToast('success', 'Offre mise à jour avec succès');
            } else {
                await apiClient.post('/internships', cleanData);
                showToast('success', 'Offre créée avec succès');
            }
            setIsFormOpen(false);
            setEditingOffer(null);
            await fetchOffers();
        } catch (error) {
            console.error('Error saving offer:', error);
            showToast('error', error.message || 'Échec de l\'enregistrement de l\'offre');
        }
    };

    const filteredOffers = offers.filter(offer => {
        const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || offer.type?.toLowerCase() === filterType.toLowerCase() || (filterType === 'Internship' && offer.type === 'Internship');
        const matchesLocation = filterLocation === 'all' || offer.location?.toLowerCase() === filterLocation.toLowerCase();
        const matchesAudience = filterAudience === 'all' || offer.targetAudience === filterAudience;
        return matchesSearch && matchesType && matchesLocation && matchesAudience;
    });

    const uniqueLocations = Array.from(new Set(offers.map(i => i.location).filter(Boolean)));

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    {t.company?.nav?.offers || "Mes Offres"}
                </h1>
                <Button onClick={() => { setEditingOffer(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                    <Plus className="mr-2 h-4 w-4" /> {t.admin?.manageInternships?.postOpportunity || "Publier"}
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm space-y-3 border border-slate-100 dark:border-slate-700/50">
                {/* Search row */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.admin?.manageInternships?.searchPlaceholder || "Rechercher une offre..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none shadow-inner"
                    />
                </div>

                {/* Filter row */}
                <div className="flex flex-wrap gap-2 pt-1">
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {[
                            ['all', t.admin?.manageInternships?.filterTypes?.all || 'Tous'],
                            ['Internship', t.admin?.manageInternships?.filterTypes?.internship || 'Stages'],
                            ['Job', t.admin?.manageInternships?.filterTypes?.job || 'Emplois'],
                            ['Training', t.admin?.manageInternships?.filterTypes?.training || 'Formations']
                        ].map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => setFilterType(val)}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${filterType === val
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">📍 Lieu: Tous</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>

                    <select
                        value={filterAudience}
                        onChange={(e) => setFilterAudience(e.target.value)}
                        className="h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">🎯 {t.admin?.manageInternships?.form?.targetAudience || 'Audience'}: Tous</option>
                        <option value="All">{t.admin?.manageInternships?.form?.audiences?.all || 'Tout le monde'}</option>
                        <option value="Students">{t.admin?.manageInternships?.form?.audiences?.students || 'Étudiants'}</option>
                        <option value="Graduates">{t.admin?.manageInternships?.form?.audiences?.graduates || 'Diplômés'}</option>
                    </select>

                    {(filterType !== 'all' || filterLocation !== 'all' || filterAudience !== 'all' || searchTerm) && (
                        <button
                            onClick={() => { setFilterType('all'); setFilterLocation('all'); setFilterAudience('all'); setSearchTerm(''); }}
                            className="h-9 px-3 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 transition-colors border border-red-100 dark:border-red-900/30"
                        >
                            ✕ Réinitialiser
                        </button>
                    )}

                    <span className="ml-auto self-center text-xs text-slate-400 font-bold uppercase tracking-widest px-2">
                        {filteredOffers.length} {filteredOffers.length > 1 ? 'RÉSULTATS' : 'RÉSULTAT'}
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    [1, 2, 3].map(n => (
                        <Card key={n} className="bg-slate-50 dark:bg-slate-800 border-none animate-pulse h-28 rounded-2xl" />
                    ))
                ) : filteredOffers.length > 0 ? (
                    filteredOffers.map((offer) => (
                        <Card key={offer.id} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center space-x-5">
                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white/20 ${offer.type === 'Job' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate max-w-lg mb-1">{offer.title}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg">
                                                <MapPin className="h-3 w-3" /> {offer.location}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-lg">
                                                <Users className="h-3 w-3" /> {offer.targetAudience}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg border font-bold uppercase tracking-wider text-[9px] ${
                                                offer.type === 'Job' ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-400'
                                            }`}>
                                                {offer.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 self-end md:self-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => handleToggleStatus(offer.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${
                                            offer.active 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60 ring-1 ring-green-500/20' 
                                                : 'bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 ring-1 ring-slate-400/20'
                                        }`}
                                    >
                                        {offer.active ? t.admin?.manageInternships?.active || 'Actif' : t.admin?.manageInternships?.closed || 'Fermé'}
                                    </button>
                                    <Button onClick={() => { setEditingOffer(offer); setIsFormOpen(true); }} variant="outline" size="sm" className="h-[34px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <Edit className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button onClick={() => handleDeleteClick(offer)} variant="ghost" size="sm" className="h-[34px] text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="bg-slate-50 dark:bg-slate-900/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-wide">Aucune offre trouvée</h3>
                        <p className="text-slate-500 font-medium mb-8">Commencez par publier votre première opportunité professionnelle.</p>
                        <Button
                            onClick={() => { setEditingOffer(null); setIsFormOpen(true); }}
                            className="bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 px-8 py-6 h-auto"
                        >
                            Publier une Nouvelle Offre
                        </Button>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <InternshipForm
                    initialData={editingOffer}
                    onSubmit={handleSave}
                    onClose={() => { setIsFormOpen(false); setEditingOffer(null); }}
                    t={t}
                    isCompany={user?.role === 'company'}
                    isGraduate={user?.role === 'graduate'}
                    companyName={user?.role === 'graduate' ? user?.company : (user?.name || user?.companyName)}
                    companyDisabled={user?.role === 'company' || user?.role === 'graduate'}
                />
            )}

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'offre"
                message={`Voulez-vous vraiment supprimer "${offerToDelete?.title}" ?`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default ManageCompanyOffers;
