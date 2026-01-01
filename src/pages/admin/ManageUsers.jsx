import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, Trash2, ArrowLeft, Eye, CheckCircle, XCircle, AlertTriangle, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export function ManageUsers() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = [];
            if (statusFilter !== 'All') query.push(`status=${statusFilter}`);
            if (searchTerm) query.push(`search=${searchTerm}`);

            const response = await apiClient.get(`/users?${query.join('&')}`);
            setUsers(response.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            try {
                await apiClient.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await apiClient.patch(`/users/${id}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await apiClient.get('/users/export/csv');
            const blob = new Blob([response], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'supnum_users.csv';
            a.click();
        } catch (error) {
            alert('Export failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <Link to="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">User Management</h1>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleExportCSV} className="w-full sm:w-auto justify-center">
                        <Download className="h-4 w-4 mr-2" /> Export CSV
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
                    <option value="All">All Status</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>

            <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white">User</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white hidden sm:table-cell">SupNum ID</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white hidden lg:table-cell">Role</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white">Status</th>
                                <th className="p-4 md:p-6 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
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
                                    <td colSpan="5" className="p-12 text-center text-slate-500">No users found.</td>
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-6 text-slate-600 dark:text-slate-300 font-mono text-xs md:text-sm hidden sm:table-cell">{user.supnumId}</td>
                                        <td className="p-4 md:p-6 hidden lg:table-cell">
                                            <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${user.role === 'student'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                : user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                                                }`}>
                                                {user.role}
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
                                                <span className="truncate">{user.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 md:p-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.status === 'Pending' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(user.id, 'Verified')} className="bg-green-600 hover:bg-green-700 text-white">
                                                        Approve
                                                    </Button>
                                                )}
                                                {user.status === 'Verified' && user.role !== 'admin' && (
                                                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(user.id, 'Suspended')} className="text-red-600 border-red-100 hover:bg-red-50">
                                                        Suspend
                                                    </Button>
                                                )}
                                                {user.status === 'Suspended' && (
                                                    <Button size="sm" onClick={() => handleStatusChange(user.id, 'Verified')} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                        Reactivate
                                                    </Button>
                                                )}
                                                <Link to={`/admin/profile/${user.id}`}>
                                                    <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="View Profile">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {user.role !== 'admin' && (
                                                    <Button
                                                        onClick={() => handleDelete(user.id)}
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
                                                        title="Remove User"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
        </div>
    );
}
