import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
    FileText, 
    User as UserIcon, 
    Calendar, 
    Building, 
    Link as LinkIcon, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Phone, 
    Mail, 
    Search, 
    Briefcase, 
    ChevronRight, 
    ExternalLink, 
    Info, 
    MessageSquare, 
    Send,
    Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useToast } from '../../components/Toast';

const ManageCompanyApplications = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'participants'
    const [selectedInternshipId, setSelectedInternshipId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isMobileListOpen, setIsMobileListOpen] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const { showToast } = useToast();

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/applications');
            setApplications(response.applications);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await apiClient.patch(`/applications/${id}/status`, { status });
            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status } : app
            ));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (app) => {
        setApplicationToDelete(app);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!applicationToDelete) return;
        try {
            await apiClient.delete(`/applications/${applicationToDelete.id}`);
            setApplications(prev => prev.filter(app => app.id !== applicationToDelete.id));
            if (selectedId === applicationToDelete.id) {
                setSelectedId(null);
            }
            showToast('Candidature supprimée avec succès', 'success');
        } catch (error) {
            console.error(error);
            showToast('Échec de la suppression', 'error');
        } finally {
            setIsConfirmOpen(false);
            setApplicationToDelete(null);
        }
    };

    if (!t || !t.company) {
        return <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm">Loading components...</div>;
    }

    const groupedByInternship = applications.reduce((acc, app) => {
        const id = app.internshipId;
        if (!acc[id]) {
            acc[id] = {
                id,
                title: app.internship?.title,
                company: app.internship?.company,
                count: 0,
                pending: 0,
                lastActivity: app.createdAt,
                apps: []
            };
        }
        acc[id].count++;
        if (app.status === 'pending') acc[id].pending++;
        if (new Date(app.createdAt) > new Date(acc[id].lastActivity)) {
            acc[id].lastActivity = app.createdAt;
        }
        acc[id].apps.push(app);
        return acc;
    }, {});

    const internshipsWithApps = Object.values(groupedByInternship).sort((a, b) => 
        new Date(b.lastActivity) - new Date(a.lastActivity)
    );

    const currentOpportunity = selectedInternshipId ? groupedByInternship[selectedInternshipId] : null;

    const filteredApplications = (selectedInternshipId ? groupedByInternship[selectedInternshipId].apps : []).filter(app => {
        const matchesFilter = filter === 'all' || app.status === filter;
        const matchesSearch = searchTerm === '' || 
            (app.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const selectedApp = filteredApplications.find(a => a.id === selectedId) || 
                       (filteredApplications.length > 0 ? filteredApplications[0] : null);

    useEffect(() => {
        if (viewMode === 'participants' && !selectedId && filteredApplications.length > 0) {
            setSelectedId(filteredApplications[0].id);
        }
    }, [filteredApplications, selectedId, viewMode]);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return t.admin.manageApplications.pending;
            case 'accepted': return t.admin.manageApplications.accepted;
            case 'rejected': return t.admin.manageApplications.rejected;
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Pipelin</p>
            </div>
        );
    }

    if (viewMode === 'dashboard') {
        return (
            <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                            <div className="h-1 w-8 bg-primary rounded-full" /> {t.company.nav.applications}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
                            Candidate Pipeline
                        </h1>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder={t.common.search || "Search..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-8 bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="text-center px-4">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{applications.length}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                        <div className="text-center px-4">
                            <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Pending</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{applications.filter(a => a.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internshipsWithApps
                        .filter(item => searchTerm === '' || item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((item) => {
                            const accepted = item.apps.filter(a => a.status === 'accepted').length;
                            const rejected = item.apps.filter(a => a.status === 'rejected').length;
                            const pending = item.pending;
                            const total = item.count;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedInternshipId(item.id);
                                        setViewMode('participants');
                                        setSelectedId(null);
                                        setSearchTerm('');
                                        setFilter('all');
                                    }}
                                    className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-left p-8 flex flex-col overflow-hidden h-full"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <Briefcase className="h-6 w-6" />
                                        </div>
                                        {pending > 0 && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30">
                                                {pending} New
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2 mb-8">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight break-words">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                            {total} Applicants
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <span>Progress</span>
                                                <span className="text-gray-900 dark:text-white">{Math.round(((accepted + rejected) / total) * 100)}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full flex overflow-hidden p-0.5">
                                                <div style={{ width: `${(accepted / total) * 100}%` }} className="h-full bg-green-500 rounded-full" />
                                                <div style={{ width: `${(pending / total) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
                                                <div style={{ width: `${(rejected / total) * 100}%` }} className="h-full bg-red-500 rounded-full" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {item.apps.slice(0, 4).map((app, i) => (
                                                    <div key={app.id} className="w-10 h-10 rounded-xl border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-black text-gray-600 dark:text-gray-300 shadow-sm">
                                                        {app.user?.name?.charAt(0)}
                                                    </div>
                                                ))}
                                                {item.count > 4 && (
                                                    <div className="w-10 h-10 rounded-xl border-4 border-white dark:border-gray-800 bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                                                        +{item.count - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-primary group-hover:translate-x-2 transition-transform duration-300">
                                                <ChevronRight className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}

                    {internshipsWithApps.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700">
                            <FileText className="h-20 w-20 text-gray-200 dark:text-gray-700 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Empty Pipeline</h3>
                            <p className="text-gray-400 font-medium">No candidates have applied to your offers yet.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in slide-in-from-bottom-8 duration-700 pb-4 overflow-hidden px-4">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 pt-4">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => { setViewMode('dashboard'); setSearchTerm(''); }}
                        className="h-11 w-11 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:-translate-x-1"
                    >
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                            <div className="h-0.5 w-6 bg-blue-600 dark:bg-blue-400 rounded-full" />
                            {currentOpportunity?.pending || 0} ACTIONS REQUIRED
                        </div>
                        <h1 className="text-base font-black tracking-tighter leading-tight">
                            <span className="text-gray-400 dark:text-gray-500 font-semibold">{currentOpportunity?.company}</span>
                            <span className="text-gray-300 dark:text-gray-600 mx-2">·</span>
                            <span className="text-gray-900 dark:text-white">{currentOpportunity?.title}</span>
                        </h1>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full md:w-auto">
                    {[
                        { key: 'all',      label: 'TOUT' },
                        { key: 'pending',  label: 'EN ATTENTE' },
                        { key: 'accepted', label: 'ACCÉPTÉ' },
                        { key: 'rejected', label: 'REJETÉ' },
                    ].map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setFilter(s.key)}
                            className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === s.key
                                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Panel ── */}
            <div className="flex-1 flex overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-3xl rounded-none sm:rounded-[2rem] lg:rounded-[3rem] border-y sm:border border-white dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-slate-200 dark:ring-white/5 relative">

                {/* Left — Candidate List */}
                <div className={`${isMobileListOpen ? 'w-full' : 'hidden'} lg:flex lg:w-80 flex flex-col border-r border-slate-200 dark:border-white/5 bg-slate-50/20 dark:bg-slate-900/40 transition-all duration-500 shrink-0`}>
                    <div className="p-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Command Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
                        {filteredApplications.length > 0 ? (
                            <div className="space-y-3">
                                {filteredApplications.map((app) => {
                                    const sel = selectedId === app.id;
                                    return (
                                        <button
                                            key={app.id}
                                            onClick={() => { setSelectedId(app.id); setIsMobileListOpen(false); }}
                                            className={`w-full text-left p-5 rounded-[2rem] transition-all duration-500 group flex items-center gap-5 border ${sel ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/40 -translate-y-1' : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'}`}
                                        >
                                            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-base shadow-lg ${sel ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                                                {app.user?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className="font-black text-sm tracking-tight truncate uppercase">
                                                        {app.user?.name}
                                                    </span>
                                                    <div className={`h-2.5 w-2.5 rounded-full shadow-sm ring-4 ${app.status === 'accepted' ? 'bg-green-500 ring-green-500/10' : app.status === 'rejected' ? 'bg-red-500 ring-red-500/10' : 'bg-amber-500 ring-amber-500/10 animate-pulse'}`} />
                                                </div>
                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${sel ? 'text-white/60' : 'text-slate-400'}`}>
                                                    {new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center opacity-30">
                                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">No Signal</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Candidate Detail */}
                <div className={`${!isMobileListOpen ? 'w-full' : 'hidden'} lg:flex flex-1 flex flex-col bg-white/30 dark:bg-slate-900/10 overflow-hidden relative`}>
                    {selectedApp ? (
                        <>
                            <button onClick={() => setIsMobileListOpen(true)} className="lg:hidden absolute top-6 left-6 z-50 h-10 w-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl flex items-center justify-center text-gray-500 border border-gray-100 dark:border-gray-700">
                                <ChevronRight className="h-5 w-5 rotate-180" />
                            </button>
                            {/* Detail Header */}
                            <div className="p-7 border-b border-gray-100 dark:border-gray-700 shrink-0">
                                {/* Row 1: Avatar + Name + Status */}
                                 <div className="flex items-center gap-5 mb-6">
                                     <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-[1.25rem] flex items-center justify-center text-2xl font-black text-primary border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none shrink-0">
                                         {selectedApp.user?.name?.charAt(0)?.toUpperCase()}
                                     </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                                                {selectedApp.user?.name?.split(' ')[0]}
                                            </h2>
                                            <span className={`px-4 py-1.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest ${
                                                selectedApp.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                selectedApp.status === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {getStatusLabel(selectedApp.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Contact Pills */}
                                <div className="flex flex-wrap items-center gap-2 mb-5">
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        <Mail className="h-3 w-3 text-primary shrink-0" />
                                        {selectedApp.email || selectedApp.user?.email}
                                    </span>
                                    {selectedApp.phone && (
                                        <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                            <Phone className="h-3 w-3 text-primary shrink-0" />
                                            {selectedApp.phone}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-[11px] font-bold text-gray-400">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        {new Date(selectedApp.createdAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>

                                {/* Row 3: Action Buttons */}
                                <div className="flex items-center gap-3">
                                    {selectedApp.status === 'accepted' && (
                                        <button
                                            onClick={() => navigate('/dashboard/messages', { 
                                                state: { 
                                                    recipientId: selectedApp.userId, 
                                                    recipientName: selectedApp.user?.name 
                                                } 
                                            })}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Send className="h-4 w-4" /> MESSAGE
                                        </button>
                                    )}
                                     <button
                                         onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                                         disabled={selectedApp.status === 'rejected'}
                                         className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-red-50 dark:border-red-900/20 bg-white dark:bg-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95 shadow-sm"
                                     >
                                         <XCircle className="h-4 w-4" /> REJETER
                                     </button>
                                    <button
                                         onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                                         disabled={selectedApp.status === 'accepted'}
                                         className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
                                     >
                                         <CheckCircle className="h-4 w-4" /> {t.admin.manageApplications.accept}
                                     </button>
                                     <button
                                         onClick={() => handleDeleteClick(selectedApp)}
                                         className="flex-none flex items-center justify-center h-[52px] w-[52px] bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 border border-red-200 dark:border-red-800/30"
                                     >
                                         <Trash2 className="h-5 w-5" />
                                     </button>
                                </div>
                            </div>

                            {/* 3-Column Body */}
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                                    {/* Col 1 — Intel Analysis / Intent */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-1 bg-primary rounded-full" />
                                            <div>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">Intel Analysis</p>
                                                <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-tight">Intent</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 min-h-[140px]">
                                            {selectedApp.message ? (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                                    {selectedApp.message}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest">No message provided</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Col 2 — Dossier / Main File */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-1 bg-indigo-500 rounded-full" />
                                            <div>
                                                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Dossier</p>
                                                <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-tight">Main File</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-h-[140px]">
                                            {selectedApp.cvUrl ? (
                                                <a
                                                    href={selectedApp.cvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex flex-col items-center justify-center gap-3 p-6 h-full bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group text-center"
                                                >
                                                    <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[11px] text-gray-700 dark:text-gray-200 uppercase tracking-tight">Curric...</p>
                                                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Access Repository</p>
                                                    </div>
                                                    <ExternalLink className="h-4 w-4 text-indigo-400" />
                                                </a>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-6 h-full bg-gray-50 dark:bg-gray-900/40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
                                                    <p className="text-[10px] text-gray-300 dark:text-gray-600 font-black uppercase tracking-widest">No File Provided</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Col 3 — Real-Time / Signal Stream */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-1 bg-emerald-500 rounded-full" />
                                            <div>
                                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-Time</p>
                                                <p className="text-[11px] font-black text-gray-800 dark:text-white uppercase tracking-tight">Signal Stream</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-gray-900 dark:bg-black rounded-2xl p-5 font-mono text-[10px] leading-loose overflow-hidden min-h-[140px]">
                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
                                                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                                                <span className="text-emerald-400 font-black uppercase tracking-widest text-[9px]">Live</span>
                                                <span className="text-gray-600 ml-auto text-[9px]">
                                                    {new Date(selectedApp.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="space-y-2 text-gray-400">
                                                <div>
                                                    <span className="text-gray-600">AUTH:</span>{' '}
                                                    <span className="text-blue-400">{selectedApp.email || selectedApp.user?.email}</span>
                                                </div>
                                                {selectedApp.phone && (
                                                    <div>
                                                        <span className="text-gray-600">TEL:</span>{' '}
                                                        <span className="text-yellow-400">{selectedApp.phone}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-gray-600">STATUS:</span>{' '}
                                                    <span className={selectedApp.status === 'accepted' ? 'text-emerald-400' : selectedApp.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}>
                                                        {selectedApp.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">OFFER_ID:</span>{' '}
                                                    <span className="text-purple-400">#{selectedApp.internshipId}</span>
                                                </div>
                                                <div className="pt-1 text-emerald-500">
                                                    {'> '}{selectedApp.status === 'accepted' ? 'SIGNAL_ACCEPTED' : selectedApp.status === 'rejected' ? 'SIGNAL_REJECTED' : 'SIGNAL_OK'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Custom Answers */}
                                {selectedApp.customAnswers && Object.keys(selectedApp.customAnswers).length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-4 w-1 bg-purple-500 rounded-full" />
                                            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Questionnaire Responses</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(selectedApp.customAnswers).map(([q, a]) => (
                                                <div key={q} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{q}</p>
                                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-20">
                            <UserIcon className="h-28 w-28 mb-6" />
                            <h3 className="text-2xl font-black uppercase tracking-[0.3em] mb-3">Select Candidate</h3>
                            <p className="max-w-xs font-bold text-sm uppercase tracking-widest">Choose a profile from the pipeline to start the review process.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la candidature"
                message="Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </div>
    );
};

export default ManageCompanyApplications;
