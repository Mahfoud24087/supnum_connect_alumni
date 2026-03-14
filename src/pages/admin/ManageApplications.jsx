import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { FileText, User as UserIcon, Calendar, Building, Link as LinkIcon, CheckCircle, XCircle, Clock, Phone, Mail, Search, Briefcase, ChevronRight, ExternalLink, Info, MessageSquare, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../services/api';

export function ManageApplications() {
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
            // Update local state instead of full fetch to preserve selection
            setApplications(prev => prev.map(app => 
                app.id === id ? { ...app, status } : app
            ));
        } catch (error) {
            console.error(error);
        }
    };

    // Safety check for translations
    if (!t || !t.admin || !t.admin.manageApplications) {
        return <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm">Loading components...</div>;
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
                <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Interface</p>
            </div>
        );
    }

    if (viewMode === 'dashboard') {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 -mt-10 pt-10 px-4">
                <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 overflow-hidden">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-[10px]">
                            <div className="h-1 w-8 bg-blue-600 rounded-full" /> {t.admin.manageApplications.title}
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            {t.admin.manageApplications.title}
                        </h1>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={t.common.search || "Rechercher..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white shadow-xl"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-4 rounded-3xl border border-white dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="text-center px-4">
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{t.admin.manageApplications.all || 'Total'}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{applications.length}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                        <div className="text-center px-4">
                            <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">{t.admin.manageApplications.pending || 'Pending'}</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">{applications.filter(a => a.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {internshipsWithApps
                        .filter(item => searchTerm === '' || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.company.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                    setSearchTerm(''); // Reset search when entering specific internship
                                    setFilter('all'); // Reset filter
                                }}
                                className="group relative bg-white dark:bg-slate-800/80 backdrop-blur-3xl rounded-[3rem] border border-white dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(59,130,246,0.15)] transition-all duration-700 hover:-translate-y-2 text-left p-8 flex flex-col overflow-hidden ring-1 ring-slate-200 dark:ring-white/5 h-full"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <Briefcase className="h-40 w-40" />
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-blue-500/10">
                                        <Building className="h-6 w-6" />
                                    </div>
                                    {pending > 0 && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30">
                                            {pending} {language === 'FR' ? 'ACTIF' : language === 'AR' ? 'نشط' : 'ACTIVE'}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight break-words">
                                        {item.title || "Position Title"}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                        {item.company}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* Progress Distribution Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>{language === 'FR' ? 'Progression' : language === 'AR' ? 'التقدم' : 'Progress'}</span>
                                            <span className="text-slate-900 dark:text-white">{item.count} {language === 'FR' ? 'TOTAL' : language === 'AR' ? 'المجموع' : 'TOTAL'}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full flex overflow-hidden p-0.5 ring-1 ring-slate-200 dark:ring-slate-700">
                                            <div style={{ width: `${(accepted / total) * 100}%` }} className="h-full bg-green-500 rounded-full transition-all duration-1000" />
                                            <div style={{ width: `${(pending / total) * 100}%` }} className="h-full bg-amber-500 rounded-full transition-all duration-1000" />
                                            <div style={{ width: `${(rejected / total) * 100}%` }} className="h-full bg-red-500 rounded-full transition-all duration-1000" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {item.apps.slice(0, 4).map((app, i) => (
                                                <div key={app.id} className="w-10 h-10 rounded-xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 overflow-hidden shadow-md">
                                                    {app.user?.name?.charAt(0)}
                                                </div>
                                            ))}
                                            {item.count > 4 && (
                                                <div className="w-10 h-10 rounded-xl border-4 border-white dark:border-slate-800 bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-md">
                                                    +{item.count - 4}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform duration-300">
                                            <ChevronRight className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {internshipsWithApps.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-2xl">
                            <FileText className="h-20 w-20 text-slate-100 dark:text-slate-700 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.admin.manageApplications.noApplications || "No Stream Identified"}</h3>
                            <p className="text-slate-400 font-medium">{t.admin.manageApplications.noApplicationsDesc || "Waiting for signal from active opportunities."}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-4 w-full h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in slide-in-from-bottom-8 duration-700 pb-4 overflow-hidden">
            {/* Header / Command Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 shrink-0">
                <div className="flex items-center gap-4 md:gap-6">
                    <button 
                        onClick={() => {
                            setViewMode('dashboard');
                            setSearchTerm('');
                        }}
                        className="group h-12 w-12 md:h-14 md:w-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:-translate-x-1 shrink-0"
                    >
                        <ChevronRight className="h-6 w-6 md:h-8 md:w-8 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5 overflow-hidden">
                            <div className="h-0.5 w-6 bg-blue-600 rounded-full shrink-0" /> 
                            <span className="truncate">{applications.filter(a => a.internshipId === selectedInternshipId && a.status === 'pending').length} Actions Required</span>
                        </div>
                        <h1 className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-tight flex items-center gap-2 md:gap-3 truncate">
                            <span className="opacity-40 truncate max-w-[80px] md:max-w-none">{currentOpportunity?.company}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                            <span className="truncate">{currentOpportunity?.title}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-[1.2rem] md:rounded-[1.5rem] w-full md:w-auto ring-1 ring-slate-200 dark:ring-white/10 shrink-0 overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'accepted', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`whitespace-nowrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === s ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl shadow-blue-500/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {s === 'all' ? (language === 'FR' ? 'TOUT' : 'ALL') :
                             s === 'pending' ? (language === 'FR' ? 'EN ATTENTE' : 'PENDING') :
                             s === 'accepted' ? (language === 'FR' ? 'ACCEPTÉ' : 'ACCEPTED') :
                             (language === 'FR' ? 'REJETÉ' : 'REJECTED')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white/50 dark:bg-slate-800/50 backdrop-blur-3xl rounded-none sm:rounded-[2rem] lg:rounded-[3rem] border-y sm:border border-white dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] ring-1 ring-slate-200 dark:ring-white/5 relative">
                {/* Master: Ultra Dense Candidate List */}
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

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
                        {filteredApplications.length > 0 ? (
                            <div className="space-y-3">
                                {filteredApplications.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            setSelectedId(app.id);
                                            setIsMobileListOpen(false);
                                        }}
                                        className={`w-full text-left p-5 rounded-[2rem] transition-all duration-500 group flex items-center gap-5 border ${selectedId === app.id ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/40 -translate-y-1' : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'}`}
                                    >
                                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-base shadow-lg ${selectedId === app.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
                                            {app.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-black text-sm tracking-tight truncate uppercase">
                                                    {app.user?.name}
                                                </span>
                                                <div className={`h-2.5 w-2.5 rounded-full shadow-sm ring-4 ${app.status === 'accepted' ? 'bg-green-500 ring-green-500/10' : app.status === 'rejected' ? 'bg-red-500 ring-red-500/10' : 'bg-amber-500 ring-amber-500/10 animate-pulse'}`} />
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedId === app.id ? 'text-white/60' : 'text-slate-400'}`}>
                                                {new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center opacity-30">
                                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">No Intel Matches</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail: Professional Analysis Suite */}
                <div className={`${!isMobileListOpen ? 'w-full' : 'hidden'} lg:flex flex-1 flex flex-col bg-white/30 dark:bg-slate-900/10 overflow-hidden relative`}>
                    {selectedApp ? (
                        <>
                            {/* Mobile Back Button */}
                            <button 
                                onClick={() => setIsMobileListOpen(true)}
                                className="lg:hidden absolute top-6 left-6 z-50 h-10 w-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-2xl rounded-xl flex items-center justify-center text-slate-500 border border-white dark:border-white/10"
                            >
                                <ChevronRight className="h-6 w-6 rotate-180" />
                            </button>

                            {/* Candidate Hero Header */}
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shrink-0">
                                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                                    <div className="flex items-center gap-6 min-w-0">
                                        <div className="relative group shrink-0">
                                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                                            <div className="relative h-16 w-16 bg-white dark:bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-2xl font-black text-blue-600 shadow-2xl border border-slate-100 dark:border-white/5">
                                                {selectedApp.user?.name?.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase truncate">{selectedApp.user?.name}</h2>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${getStatusColor(selectedApp.status)}`}>
                                                    {getStatusLabel(selectedApp.status)}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <a href={`mailto:${selectedApp.email}`} className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all">
                                                    <Mail className="h-3 w-3" /> <span className="truncate max-w-[100px] sm:max-w-none">{selectedApp.email}</span>
                                                </a>
                                                {selectedApp.phone && (
                                                    <a href={`tel:${selectedApp.phone}`} className="flex items-center gap-2.5 text-[9px] md:text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:underline px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-xl transition-all">
                                                        <Phone className="h-3 w-3" /> {selectedApp.phone}
                                                    </a>
                                                )}
                                                <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl">
                                                    <Clock className="h-3 w-3" /> {new Date(selectedApp.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto shrink-0 pt-4 xl:pt-0">
                                        {selectedApp.status === 'accepted' && (
                                            <button
                                                onClick={() => navigate('/admin/messages', { 
                                                    state: { 
                                                        recipientId: selectedApp.userId, 
                                                        recipientName: selectedApp.user?.name 
                                                    } 
                                                })}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 py-3 bg-green-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-wider hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Send className="h-3.5 w-3.5" /> {t.common.message || 'Message'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                                            disabled={selectedApp.status === 'rejected'}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 rounded-2xl font-black text-[9px] uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-900/30 transition-all border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none disabled:opacity-30 disabled:grayscale"
                                        >
                                            <XCircle className="h-3.5 w-3.5" /> {t.admin.manageApplications.reject || 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                                            disabled={selectedApp.status === 'accepted'}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-wider hover:bg-blue-700 shadow-xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" /> {t.admin.manageApplications.accept || 'Accept'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 lg:p-5 custom-scrollbar space-y-5 pb-10">
                                <div className="grid grid-cols-1 gap-5 bg-transparent">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                                        {/* Professional Intent Section */}
                                        {selectedApp.message && (
                                            <section className="relative">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-6 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none">Intel Analysis</span>
                                                        <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Intent</h3>
                                                    </div>
                                                </div>
                                                
                                                <div className="relative p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl rounded-[1.5rem] border border-white dark:border-white/5 shadow-lg group">
                                                    <MessageSquare className="absolute -top-3 -right-3 h-16 w-16 text-blue-600/5 rotate-12" />
                                                    <p className="text-[11px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic px-1">
                                                        {selectedApp.message}
                                                    </p>
                                                </div>
                                            </section>
                                        )}

                                        {/* Core Documents Section */}
                                        <section className="relative">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-5 w-1 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest leading-none">Dossier</span>
                                                    <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Main File</h3>
                                                </div>
                                            </div>

                                            <div className="relative bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-purple-500/20 rounded-[1.5rem] p-0.5 shadow-lg">
                                                {selectedApp.cvUrl ? (
                                                    <a href={selectedApp.cvUrl} target="_blank" rel="noopener noreferrer" 
                                                       className="block w-full p-3 bg-white dark:bg-slate-900 rounded-[1.3rem] hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 text-left">
                                                                <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">CURRICULUM VITAE</h4>
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Access Repository</p>
                                                            </div>
                                                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="w-full p-4 bg-slate-50 dark:bg-slate-900/40 rounded-[1.3rem] border-2 border-dashed border-slate-200 dark:border-white/5 text-center">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Not Provided</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* System Logs Section */}
                                        <section className="relative">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-5 w-1 rounded-full bg-slate-400 dark:bg-slate-500 shadow-sm" />
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Real-time</span>
                                                    <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Signal Stream</h3>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-slate-900 dark:bg-slate-800/80 rounded-[1.5rem] border border-white/5 shadow-xl min-h-[100px]">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 py-1.5 border-b border-white/5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Live</p>
                                                        <span className="text-[8px] font-mono text-slate-500 ml-auto">{new Date(selectedApp.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className="space-y-1 font-mono text-[8px] text-slate-400 leading-tight">
                                                        <div className="flex gap-2">
                                                            <span className="text-blue-500 shrink-0">AUTH:</span>
                                                            <span className="truncate">{selectedApp.email}</span>
                                                        </div>
                                                        <div className="mt-2 p-2 bg-black/30 rounded-lg text-blue-400/80">
                                                            &gt; SIGNAL_OK
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Smart Forms Breakdown */}
                                    {selectedApp.customAnswers && Object.keys(selectedApp.customAnswers).length > 0 && (
                                        <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-6 w-1.5 bg-purple-600 rounded-full" />
                                                <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Interview Intelligence</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {Object.entries(selectedApp.customAnswers).map(([q, a]) => (
                                                    <div key={q} className="p-4 bg-white/50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 text-left transition-all hover:shadow-lg">
                                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 truncate">{q}</p>
                                                        <div className="text-[10px] font-bold text-slate-800 dark:text-white leading-snug">
                                                            {a}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                            <div className="relative">
                                <div className="absolute -inset-10 bg-blue-500 blur-[80px] opacity-10 animate-pulse" />
                                <UserIcon className="relative h-24 w-24 text-slate-100 dark:text-slate-800 mx-auto mb-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Initialize Selection</h3>
                            <p className="text-slate-400 dark:text-slate-600 text-xs font-bold mt-4 uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                                Select a profile from the signal list to begin deep content analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
