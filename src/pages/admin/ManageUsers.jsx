import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, Trash2, ArrowLeft, Eye, CheckCircle, XCircle, AlertTriangle, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/Toast';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export function ManageUsers() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');
    const [specialtyFilter, setSpecialtyFilter] = useState('All');
    const [workStatusFilter, setWorkStatusFilter] = useState('All');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [showExportConfirm, setShowExportConfirm] = useState(false);

    const fetchUsers = async (overrides = {}) => {
        setLoading(true);
        const currentStatus    = overrides.status    ?? statusFilter;
        const currentRole      = overrides.role      ?? roleFilter;
        const currentSpecialty = overrides.specialty ?? specialtyFilter;
        const currentWorkStatus= overrides.workStatus?? workStatusFilter;
        const currentSearch    = overrides.search    ?? searchTerm;
        try {
            const query = [];
            if (currentStatus    !== 'All') query.push(`status=${currentStatus}`);
            if (currentRole      !== 'All') query.push(`role=${currentRole}`);
            if (currentSpecialty !== 'All') query.push(`specialty=${currentSpecialty}`);
            if (currentWorkStatus!== 'All') query.push(`workStatus=${currentWorkStatus}`);
            if (currentSearch)              query.push(`search=${encodeURIComponent(currentSearch)}`);

            const response = await apiClient.get(`/users?${query.join('&')}`);
            setUsers(response.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers({ status: statusFilter, role: roleFilter, specialty: specialtyFilter, workStatus: workStatusFilter, search: searchTerm });
    }, [statusFilter, roleFilter, specialtyFilter, workStatusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers({ status: statusFilter, role: roleFilter, specialty: specialtyFilter, workStatus: workStatusFilter, search: searchTerm });
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await apiClient.delete(`/users/${userToDelete.id}`);
            setUsers(users.filter(u => u.id !== userToDelete.id));
            showToast('Utilisateur supprimé', 'success');
        } catch (error) {
            console.error(error);
            showToast(t.admin.manageUsers.failedDelete || 'Failed to delete user', 'error');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await apiClient.patch(`/users/${id}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error(error);
        }
    };

    const handleExportPDF = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const currentLang = localStorage.getItem('language') || 'FR';

            // Build filter query matching current view
            const query = [`lang=${currentLang}`];
            if (statusFilter    !== 'All') query.push(`status=${statusFilter}`);
            if (roleFilter      !== 'All') query.push(`role=${roleFilter}`);
            if (specialtyFilter !== 'All') query.push(`specialty=${specialtyFilter}`);
            if (workStatusFilter!== 'All') query.push(`workStatus=${workStatusFilter}`);
            if (searchTerm)                query.push(`search=${encodeURIComponent(searchTerm)}`);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/users/export/pdf?${query.join('&')}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (!res.ok) throw new Error('Failed to download PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'supnum_users_report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowExportConfirm(false);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    // Build a human-readable summary of active filters for the confirmation dialog
    const buildFilterSummary = () => {
        const parts = [];
        if (roleFilter      !== 'All') parts.push(`Rôle : ${roleFilter}`);
        if (specialtyFilter !== 'All') parts.push(`Spécialité : ${specialtyFilter}`);
        if (workStatusFilter!== 'All') parts.push(`Statut de travail : ${workStatusFilter}`);
        if (statusFilter    !== 'All') parts.push(`Statut : ${statusFilter}`);
        if (searchTerm)                parts.push(`Recherche : "${searchTerm}"`);
        return parts.length > 0
            ? parts.join(' · ')
            : 'Tous les utilisateurs (aucun filtre actif)';
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const response = await apiClient.post('/users/create-admin', formData);
            setShowCreateModal(false);
            setFormData({ name: '', email: '', password: '' });
            fetchUsers(); // Refresh the user list
            showToast('Administrateur créé avec succès', 'success');
        } catch (error) {
            setFormError(error.message || 'Failed to create admin user');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link to="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">{t.admin.manageUsers.title}</h1>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto justify-center">
                        <Plus className="h-4 w-4 mr-2" /> Create Admin
                    </Button>
                    <Button variant="outline" onClick={() => setShowExportConfirm(true)} className="w-full sm:w-auto justify-center">
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by name, ID or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500"
                    />
                </form>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="All">{t.admin.manageUsers.allStatus}</option>
                    <option value="Verified">{t.admin.manageUsers.verified}</option>
                    <option value="Pending">{t.admin.manageUsers.pending}</option>
                    <option value="Suspended">{t.admin.manageUsers.suspended}</option>
                </select>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="All">Tous les rôles</option>
                    <option value="student">Étudiant</option>
                    <option value="graduate">Diplômé</option>
                    <option value="company">Entreprise (Company)</option>
                    <option value="other">Invité (Autre)</option>
                    <option value="admin">Administrateur</option>
                </select>
                <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="All">Toutes les spécialités</option>
                    <option value="RSS">RSS</option>
                    <option value="DSI">DSI</option>
                    <option value="DWM">DWM</option>
                    <option value="IA">IA</option>
                    <option value="IDS">IDS</option>
                </select>
                <select
                    value={workStatusFilter}
                    onChange={(e) => setWorkStatusFilter(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none text-slate-700 dark:text-slate-300"
                >
                    <option value="All">{t?.common?.workStatus?.label || 'All Work Status'}</option>
                    <option value="employed">{t?.common?.workStatus?.employed || 'Employed'}</option>
                    <option value="seeking">{t?.common?.workStatus?.seeking || 'Seeking'}</option>
                    <option value="studying">{t?.common?.workStatus?.studying || 'Studying'}</option>
                    <option value="freelance">{t?.common?.workStatus?.freelance || 'Freelance'}</option>
                </select>
            </div>

            <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white">{t.admin.users.name}</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white hidden sm:table-cell">{t.profile.supnumId}</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white hidden lg:table-cell">{t.admin.users.role}</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white">{t.common.status}</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white text-right">{t.admin.users.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-500">{t.admin.manageUsers.noUsers}</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 md:p-6">
                                            <div className="flex items-center space-x-3 md:space-x-4">
                                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs md:text-base">
                                                            {user.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base truncate">{user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] md:max-w-none">{user.email}</p>
                                                    {user.specialty && (
                                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                            user.specialty === 'RSS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                                            user.specialty === 'DSI' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            user.specialty === 'DWM' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                                            user.specialty === 'IA'  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' :
                                                            user.specialty === 'IDS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                        }`}>
                                                            {user.specialty}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300 font-mono text-xs md:text-sm hidden sm:table-cell">{user.supnumId}</td>
                                        <td className="p-4 md:p-6 hidden lg:table-cell">
                                            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${user.role === 'student'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                : user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                                                : user.role === 'company' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                                : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                                                }`}>
                                                {t.common?.roles?.[user.role?.toLowerCase()] || user.role}
                                            </span>
                                        </td>

                                        <td className="p-4 md:p-6">
                                            <span className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider w-fit ${user.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                user.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {user.status === 'Verified' && <CheckCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />}
                                                {user.status === 'Pending' && <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />}
                                                {user.status === 'Suspended' && <XCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />}
                                                <span className="truncate">{t.common?.statusLabels?.[user.status?.toLowerCase()] || user.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 md:p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.status === 'Pending' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(user.id, 'Verified')} className="bg-green-600 hover:bg-green-700 text-white">
                                                        {t.admin.manageUsers.approve}
                                                    </Button>
                                                )}
                                                {user.status === 'Verified' && user.role !== 'admin' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(user.id, 'Suspended')} className="text-red-600 border-red-100 hover:bg-red-50">
                                                        {t.admin.manageUsers.suspend}
                                                    </Button>
                                                )}
                                                {user.status === 'Suspended' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(user.id, 'Verified')} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                        {t.admin.manageUsers.reactivate}
                                                    </Button>
                                                )}
                                                <Link to={`/admin/profile/${user.id}`}>
                                                    <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title={t.admin.manageUsers.viewProfile}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDeleteClick(user)}
                                                    size="sm"
                                                    className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
                                                    title={t.admin.manageUsers.removeUser}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                {user.cvUrl && (
                                                    <a href={user.cvUrl} target="_blank" rel="noopener noreferrer" download>
                                                        <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-600" title={t.profile?.downloadCv || "Download CV"}>
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create Admin Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Create Admin User</h2>

                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleCreateAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Enter admin name"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="admin@supnum.mr"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                        className="w-full"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setFormData({ name: '', email: '', password: '' });
                                            setFormError('');
                                        }}
                                        className="flex-1"
                                        disabled={formLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? 'Creating...' : 'Create Admin'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={userToDelete?.role === 'admin' ? "⚠️ AVERTISSEMENT : Administrateur" : "Supprimer l'utilisateur"}
                message={userToDelete?.role === 'admin'
                    ? `Vous êtes sur le point de supprimer un compte ADMINISTRATEUR : ${userToDelete?.name}. Cette action est irréversible. Êtes-vous absolument sûr ?`
                    : `Voulez-vous vraiment supprimer l'utilisateur ${userToDelete?.name} ?`
                }
                confirmText="Supprimer"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={showExportConfirm}
                onClose={() => setShowExportConfirm(false)}
                onConfirm={handleExportPDF}
                title="📄 Exporter le rapport PDF"
                message={`Vous allez exporter un rapport PDF avec les filtres suivants :\n\n${buildFilterSummary()}\n\n${users.length} utilisateur(s) sera/seront inclus dans le rapport.`}
                confirmText="Exporter"
                variant="primary"
            />
        </div>
    );
}
