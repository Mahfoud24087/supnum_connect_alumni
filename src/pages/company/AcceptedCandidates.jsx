import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Mail, 
    Phone, 
    Calendar, 
    Trash2, 
    ExternalLink, 
    Download,
    MessageSquare,
    Filter,
    CheckCircle,
    User as UserIcon,
    Briefcase,
    ArrowUpDown,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ConfirmationModal';

const AcceptedCandidates = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [candidates, setCandidates] = useState([]);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobFilter, setJobFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const [showExportConfirm, setShowExportConfirm] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [appRes, intRes] = await Promise.all([
                apiClient.get('/applications'),
                apiClient.get('/internships?myOffers=true') 
            ]);
            
            setCandidates((appRes.applications || []).filter(app => app.status === 'accepted'));
            setInternships(intRes.internships || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            showToast(t.company.acceptedPage.failedLoad, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (candidate) => {
        setCandidateToDelete(candidate);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;
        try {
            await apiClient.delete(`/applications/${candidateToDelete.id}`);
            setCandidates(prev => prev.filter(c => c.id !== candidateToDelete.id));
            showToast(t.company.acceptedPage.recordRemoved, 'success');
        } catch (error) {
            console.error(error);
            showToast('Failed to delete', 'error');
        } finally {
            setIsConfirmOpen(false);
            setCandidateToDelete(null);
        }
    };

    const handleExportPDF = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const currentLang = language || 'FR';

            const query = [`lang=${currentLang}`];
            if (jobFilter !== 'All') query.push(`internshipId=${jobFilter}`);
            if (searchTerm) query.push(`search=${encodeURIComponent(searchTerm)}`);
            
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/applications/export/pdf?${query.join('&')}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (!res.ok) throw new Error('Failed to download PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `accepted_candidates_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowExportConfirm(false);
            showToast('Report generated successfully', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showToast('Export failed', 'error');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = (c.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (c.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesJob = jobFilter === 'All' || c.internshipId === jobFilter;
        
        let matchesDate = true;
        if (dateFilter !== 'All') {
            const appDate = new Date(c.updatedAt);
            const now = new Date();
            if (dateFilter === 'this_month') {
                matchesDate = appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
            } else if (dateFilter === 'last_month') {
                const lastMonth = new Date();
                lastMonth.setMonth(now.getMonth() - 1);
                matchesDate = appDate.getMonth() === lastMonth.getMonth() && appDate.getFullYear() === lastMonth.getFullYear();
            }
        }

        return matchesSearch && matchesJob && matchesDate;
    });

    const sortedCandidates = [...filteredCandidates].sort((a, b) => {
        let valA = a[sortConfig.key] || '';
        let valB = b[sortConfig.key] || '';
        
        if (sortConfig.key === 'name') {
            valA = a.user?.name?.toLowerCase() || '';
            valB = b.user?.name?.toLowerCase() || '';
        }
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">{t.company.acceptedPage.initializing}</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-7xl mx-auto px-4">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-600 font-extrabold uppercase tracking-[0.2em] text-[10px]">
                        <div className="h-1 w-12 bg-blue-600 rounded-full" />
                        {t.company.acceptedPage.console}
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        {t.company.nav.accepted}
                    </h1>
                    <p className="text-slate-500 font-bold max-w-lg">
                        {t.company.acceptedPage.subtitle}
                    </p>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowExportConfirm(true)} 
                        className="flex-1 lg:flex-none h-12 px-8 rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <Download className="h-4 w-4" /> {t.company.acceptedPage.exportReport}
                    </Button>
                </div>
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2.5rem] shadow-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder={t.company.acceptedPage.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                </div>

                <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner appearance-none outline-none"
                    >
                        <option value="All">{t.company.acceptedPage.allPositions}</option>
                        {internships.map(int => (
                            <option key={int.id} value={int.id}>{int.title}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner appearance-none outline-none"
                    >
                        <option value="All">{t.company.acceptedPage.allDates}</option>
                        <option value="this_month">{t.company.acceptedPage.thisMonth}</option>
                        <option value="last_month">{t.company.acceptedPage.lastMonth}</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="h-10 w-px bg-slate-100 dark:bg-slate-700 hidden lg:block mx-2" />
                    <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.company.acceptedPage.activeHits}</span>
                        <span className="text-sm font-black text-blue-800 dark:text-blue-400">{sortedCandidates.length}</span>
                    </div>
                </div>
            </div>

            {/* Main Table Content */}
            <div className="bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/5">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-blue-600 transition-colors group" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">{t.company.acceptedPage.thCandidate} <ArrowUpDown className="h-3 w-3 group-hover:rotate-180 transition-transform" /></div>
                                </th>
                                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-blue-600 transition-colors group" onClick={() => handleSort('updatedAt')}>
                                    <div className="flex items-center gap-2">{t.company.acceptedPage.thHiredDate} <ArrowUpDown className="h-3 w-3 group-hover:rotate-180 transition-transform" /></div>
                                </th>
                                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.company.acceptedPage.thPosition}</th>
                                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400">{t.company.acceptedPage.thCommunication}</th>
                                <th className="px-8 py-7 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t.company.acceptedPage.thOperation}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                            <AnimatePresence mode="popLayout">
                                {sortedCandidates.map((candidate) => (
                                    <motion.tr 
                                        key={candidate.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-all duration-300"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative h-14 w-14 shrink-0 rounded-[1.25rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-blue-600 shadow-xl group-hover:scale-105 transition-transform">
                                                    {candidate.user?.name?.[0]}
                                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center">
                                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{candidate.user?.name}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Key: #{candidate.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                                                {new Date(candidate.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <Briefcase className="h-4 w-4" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[180px] uppercase tracking-tight">{candidate.internship?.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5 font-bold text-[11px] text-slate-500">
                                                <div className="flex items-center gap-2 group/msg cursor-pointer hover:text-blue-500 transition-colors">
                                                    <Mail className="h-3 w-3" /> {candidate.email || candidate.user?.email}
                                                </div>
                                                {candidate.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3 w-3" /> {candidate.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => navigate('/dashboard/messages', { state: { recipientId: candidate.userId, recipientName: candidate.user?.name } })}
                                                    className="h-10 w-10 bg-white dark:bg-slate-800 shadow-lg rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-500 hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/dashboard/profile/${candidate.userId}`)}
                                                    className="h-10 w-10 bg-white dark:bg-slate-800 shadow-lg rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
                                                >
                                                    <UserIcon className="h-4 w-4" />
                                                </button>
                                                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                                                <button 
                                                    onClick={() => handleDeleteClick(candidate)}
                                                    className="h-10 w-10 bg-red-50 dark:bg-red-900/20 shadow-md rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-95 transition-all border border-red-100 dark:border-red-900/30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {sortedCandidates.length === 0 && (
                    <div className="py-40 text-center animate-in fade-in zoom-in duration-500">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Users className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{t.company.acceptedPage.zeroMatches}</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">{t.company.acceptedPage.pipelineClear}</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={t.company.acceptedPage.expungeTitle}
                message={t.company.acceptedPage.expungeMessage}
                confirmText={t.company.acceptedPage.expungeConfirm}
                cancelText={t.company.acceptedPage.retainRecord}
            />

            <ConfirmationModal
                isOpen={showExportConfirm}
                onClose={() => setShowExportConfirm(false)}
                onConfirm={handleExportPDF}
                title={t.company.acceptedPage.exportTitle}
                message={t.company.acceptedPage.exportMessage
                    .replace('{{count}}', sortedCandidates.length)
                    .replace('{{job}}', jobFilter === 'All' ? t.company.acceptedPage.allPositions : 'Selective')
                    .replace('{{date}}', dateFilter === 'All' ? t.company.acceptedPage.allDates : 'Recent')}
                confirmText={t.company.acceptedPage.generatePdf}
                variant="primary"
            />
        </div>
    );
};

export default AcceptedCandidates;
