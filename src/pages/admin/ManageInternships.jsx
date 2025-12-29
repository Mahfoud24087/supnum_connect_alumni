import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Briefcase, Plus, Search, MapPin, Building, Trash2, Edit, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const initialInternships = [
    { id: 1, title: 'Software Engineer Intern', company: 'Tech Corp', type: 'Internship', location: 'Nouakchott', active: true },
    { id: 2, title: 'Junior Data Analyst', company: 'Data Systems', type: 'Full-time', location: 'Nouadhibou', active: true },
    { id: 3, title: 'Marketing Assistant', company: 'Creative Agency', type: 'Internship', location: 'Nouakchott', active: false },
];

export function ManageInternships() {
    const [internships, setInternships] = useState(() => {
        const saved = localStorage.getItem('supnum_internships');
        return saved ? JSON.parse(saved) : initialInternships;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInternship, setCurrentInternship] = useState(null);
    const [formData, setFormData] = useState({ title: '', company: '', type: 'Internship', location: '', active: true });

    useEffect(() => {
        localStorage.setItem('supnum_internships', JSON.stringify(internships));
    }, [internships]);

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
                active: internship.active
            });
        } else {
            setCurrentInternship(null);
            setFormData({ title: '', company: '', type: 'Internship', location: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentInternship(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentInternship) {
            setInternships(internships.map(i => i.id === currentInternship.id ? { ...i, ...formData } : i));
        } else {
            const newInternship = {
                id: Date.now(),
                ...formData
            };
            setInternships([...internships, newInternship]);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            setInternships(internships.filter(i => i.id !== id));
        }
    };

    const toggleActive = (id) => {
        setInternships(internships.map(i => i.id === id ? { ...i, active: !i.active } : i));
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Internships & Opportunities</h1>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Post Opportunity
                </Button>
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search internships..."
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
                                    {internship.active ? 'Active' : 'Closed'}
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
                                {currentInternship ? 'Edit Opportunity' : 'Post Opportunity'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Job Title</label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company</label>
                                <Input
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="e.g. Tech Corp"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
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
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Nouakchott"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Listing</label>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                    {currentInternship ? 'Save Changes' : 'Post Opportunity'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
