import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Building, Plus, Search, Globe, MapPin, Trash2, Edit, ExternalLink, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const initialCompanies = [
    { id: 1, name: 'Tech Solutions Ltd', industry: 'Technology', location: 'Nouakchott', website: 'techsolutions.mr', logo: null },
    { id: 2, name: 'Mauritania Mining', industry: 'Mining', location: 'Zouerate', website: 'mauritaniamining.mr', logo: null },
    { id: 3, name: 'Banque Populaire', industry: 'Finance', location: 'Nouakchott', website: 'bpm.mr', logo: null },
];

export function ManageCompanies() {
    const { t } = useLanguage();
    const [companies, setCompanies] = useState(() => {
        const saved = localStorage.getItem('supnum_companies');
        return saved ? JSON.parse(saved) : initialCompanies;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null); // For editing
    const [formData, setFormData] = useState({ name: '', industry: '', location: '', website: '' });

    // Safety check for translations
    if (!t || !t.admin.manageCompanies) {
        return <div className="p-8 text-center">Loading translations...</div>;
    }

    useEffect(() => {
        localStorage.setItem('supnum_companies', JSON.stringify(companies));
    }, [companies]);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (company = null) => {
        if (company) {
            setCurrentCompany(company);
            setFormData({ name: company.name, industry: company.industry, location: company.location, website: company.website });
        } else {
            setCurrentCompany(null);
            setFormData({ name: '', industry: '', location: '', website: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCompany(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentCompany) {
            // Edit
            setCompanies(companies.map(c => c.id === currentCompany.id ? { ...c, ...formData } : c));
        } else {
            // Add
            const newCompany = {
                id: Date.now(),
                ...formData,
                logo: null
            };
            setCompanies([...companies, newCompany]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        setCompanies(companies.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.manageCompanies.title}</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> {t.admin.manageCompanies.addCompany}
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t.admin.manageCompanies.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 dark:bg-slate-900 border-none"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompanies.map((company) => (
                    <Card key={company.id} className="bg-white dark:bg-slate-800 border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    <Building className="h-8 w-8 text-slate-400" />
                                </div>
                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">{t.admin.manageCompanies.partner}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{company.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{company.industry}</p>
                            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {company.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> {company.website}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => handleOpenModal(company)} variant="outline" className="flex-1 border-slate-200 dark:border-slate-700">
                                    <Edit className="h-4 w-4 mr-2" /> {t.common.edit}
                                </Button>
                                <Button onClick={() => handleDelete(company.id)} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
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
                                {currentCompany ? t.admin.manageCompanies.editCompany : t.admin.manageCompanies.addCompany}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageCompanies.form.name}</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Tech Solutions"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageCompanies.form.industry}</label>
                                <Input
                                    required
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder="e.g. Technology, Finance"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageCompanies.form.location}</label>
                                <Input
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Nouakchott"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.admin.manageCompanies.form.website}</label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="e.g. www.example.com"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">{t.admin.manageCompanies.form.cancel}</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    {currentCompany ? t.admin.manageCompanies.form.save : t.admin.manageCompanies.form.add}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
