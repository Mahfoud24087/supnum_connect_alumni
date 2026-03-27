import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, CheckCircle, Clock, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../services/api';
import { useToast } from '../../components/Toast';

const STATUS_CONFIG = {
    Pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
    'In Progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Loader2 },
    Resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
};

export function ManageSupportMessages() {
    const { t, language } = useLanguage();
    const st = t.support;
    const { showToast } = useToast();
    const isRTL = language === 'AR';

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await apiClient.get('/support');
            setMessages(data);
        } catch {
            showToast('Failed to load support messages', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const updated = await apiClient.patch(`/support/${id}`, { status });
            setMessages(prev => prev.map(m => m.id === id ? { ...m, status: updated.status } : m));
            showToast('Status updated', 'success');
        } catch {
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return;
        try {
            await apiClient.delete(`/support/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));
            showToast('Message deleted', 'success');
        } catch {
            showToast('Failed to delete', 'error');
        }
    };

    const filtered = filterStatus === 'all'
        ? messages
        : messages.filter(m => m.status === filterStatus);

    const counts = {
        all: messages.length,
        Pending: messages.filter(m => m.status === 'Pending').length,
        'In Progress': messages.filter(m => m.status === 'In Progress').length,
        Resolved: messages.filter(m => m.status === 'Resolved').length,
    };

    return (
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{st?.adminTitle}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {[['all', 'All'], ['Pending', st?.pending], ['In Progress', st?.inProgress], ['Resolved', st?.resolved]].map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => setFilterStatus(val)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterStatus === val
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {label}
                        <span className="ml-1.5 bg-white/20 dark:bg-slate-700/50 text-current px-1.5 py-0.5 rounded-full text-xs">
                            {counts[val]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{st?.noMessages}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((msg, i) => {
                            const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG['Pending'];
                            const StatusIcon = cfg.icon;
                            const isExpanded = expandedId === msg.id;
                            const dateStr = new Date(msg.createdAt).toLocaleDateString(
                                language === 'AR' ? 'ar-MR' : language === 'FR' ? 'fr-FR' : 'en-US',
                                { day: '2-digit', month: 'short', year: 'numeric' }
                            );

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, delay: i * 0.04 }}
                                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                                        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                                    >
                                        {/* Avatar */}
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                                            {(msg.name || msg.email || '?')[0].toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{msg.name || msg.email}</p>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {msg.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold truncate">{msg.subject}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{msg.email} · {dateStr}</p>
                                        </div>

                                        {isExpanded
                                            ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                                    </button>

                                    {/* Expanded Body */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                                                    {/* Message Body */}
                                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                        {msg.message}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">{st?.status}:</label>
                                                            <select
                                                                value={msg.status}
                                                                onChange={e => handleStatusChange(msg.id, e.target.value)}
                                                                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                                                            >
                                                                <option value="Pending">{st?.pending}</option>
                                                                <option value="In Progress">{st?.inProgress}</option>
                                                                <option value="Resolved">{st?.resolved}</option>
                                                            </select>
                                                        </div>

                                                        <button
                                                            onClick={() => handleDelete(msg.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors ml-auto"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
