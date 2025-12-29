import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Search, Trash2, ArrowLeft, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { users as initialUsers } from '../../data/mockData';

export function ManageUsers() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(initialUsers.map(u => ({ ...u, status: 'Verified' }))); // Mock status

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.supnumId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'SupNum ID', 'Role', 'Status'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [u.name, u.email, u.supnumId, u.role, u.status].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'supnum_graduates.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleAddGraduate = () => {
        // Simple prompt for now as requested to make it functional
        const name = prompt('Enter Full Name:');
        if (!name) return;
        const email = prompt('Enter Email:');
        if (!email) return;
        const supnumId = prompt('Enter SupNum ID:');
        if (!supnumId) return;

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            supnumId,
            role: 'graduate',
            status: 'Verified',
            avatar: null
        };
        setUsers([...users, newUser]);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Graduate Management</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
                    <Button className="bg-blue-600 text-white" onClick={handleAddGraduate}>Add Graduate</Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by name, ID or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-blue-500"
                    />
                </div>
                <select className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm outline-none">
                    <option>All Status</option>
                    <option>Verified</option>
                    <option>Pending</option>
                    <option>Suspended</option>
                </select>
            </div>

            <Card className="border-none shadow-lg overflow-hidden bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">User</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">SupNum ID</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">Role</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white">Status</th>
                                <th className="p-6 font-semibold text-slate-900 dark:text-white text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                                                        {user.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-600 dark:text-slate-300 font-mono">{user.supnumId}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'student'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                                            }`}>
                                            {user.role === 'student' ? 'Student' : 'Graduate'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${user.status === 'Verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            user.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                            }`}>
                                            {user.status === 'Verified' && <CheckCircle className="h-3 w-3" />}
                                            {user.status === 'Pending' && <AlertTriangle className="h-3 w-3" />}
                                            {user.status === 'Suspended' && <XCircle className="h-3 w-3" />}
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.status === 'Pending' && (
                                                <Button size="sm" onClick={() => handleStatusChange(user.id, 'Verified')} className="bg-green-600 hover:bg-green-700 text-white">
                                                    Approve
                                                </Button>
                                            )}
                                            <Link to={`/admin/profile/${user.id}`}>
                                                <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="View Profile">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(user.id)}
                                                size="sm"
                                                className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm"
                                                title="Remove User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
