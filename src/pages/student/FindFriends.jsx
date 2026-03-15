import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search, UserPlus, Clock, Check, UserMinus, MapPin, Briefcase, Filter, X, Hash, Mail, User as UserIcon, Calendar, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export function FindFriends() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        supnumId: '',
        name: '',
        email: '',
        graduationYear: '',
        specialty: '',
        jobTitle: ''
    });

    const fetchUsers = async (query = '') => {
        setLoading(true);
        try {
            let url = `/users/search/all?query=${query}`;
            // Add other filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) url += `&${key}=${encodeURIComponent(value)}`;
            });

            const response = await apiClient.get(url);
            setUsers(response.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(search);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            supnumId: '',
            name: '',
            email: '',
            graduationYear: '',
            specialty: '',
            jobTitle: ''
        });
        setSearch('');
    };

    const handleConnect = async (userId) => {
        try {
            await apiClient.post(`/users/connect/${userId}`);
            fetchUsers(search); // Refresh list
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col items-center space-y-8">
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black text-slate-900 dark:text-white tracking-tight"
                    >
                        {t.findFriends.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 dark:text-slate-400 font-medium"
                    >
                        {t.findFriends.subtitle}
                    </motion.p>
                </div>

                <div className="w-full max-w-4xl space-y-4">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        {/* Search input — full width on mobile */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10" />
                            <Input
                                placeholder={t.findFriends.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 h-14 sm:h-16 rounded-2xl border-none bg-white dark:bg-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xl shadow-blue-500/5 text-base sm:text-lg font-medium w-full"
                            />
                        </div>
                        {/* Buttons row on mobile */}
                        <div className="flex gap-3 sm:contents">
                            <Button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                variant="outline"
                                className={`flex-1 sm:flex-none h-12 sm:h-16 px-5 rounded-2xl border-none shadow-xl transition-all font-bold flex items-center justify-center gap-2 ${showFilters ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'}`}
                            >
                                {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
                                <span>{t.findFriends.filters}</span>
                            </Button>
                            <Button type="submit" className="flex-1 sm:flex-none h-12 sm:h-16 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/20 font-black text-base sm:text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                {t.common.search.replace('...', '')}
                            </Button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-700/50 space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterId}</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                name="supnumId"
                                                value={filters.supnumId}
                                                onChange={handleFilterChange}
                                                placeholder="e.g. 24XXX"
                                                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterName}</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                name="name"
                                                value={filters.name}
                                                onChange={handleFilterChange}
                                                placeholder="John Doe"
                                                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterEmail}</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                name="email"
                                                value={filters.email}
                                                onChange={handleFilterChange}
                                                placeholder="name@supnum.mr"
                                                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterPromo}</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                name="graduationYear"
                                                type="number"
                                                value={filters.graduationYear}
                                                onChange={handleFilterChange}
                                                placeholder="2024"
                                                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterFiliere}</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none" />
                                            <select
                                                name="specialty"
                                                value={filters.specialty}
                                                onChange={handleFilterChange}
                                                className="w-full pl-9 pr-4 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none text-sm text-slate-700 dark:text-slate-300 font-medium"
                                            >
                                                <option value="">{t.common.statusLabels.all || 'All'}</option>
                                                <option value="RSS">RSS</option>
                                                <option value="DSI">DSI</option>
                                                <option value="DWM">DWM</option>
                                                <option value="IA">IA</option>
                                                <option value="IDS">IDS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.findFriends.filterJobs}</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                                            <Input
                                                name="jobTitle"
                                                value={filters.jobTitle}
                                                onChange={handleFilterChange}
                                                placeholder="Developer"
                                                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-none h-11 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={clearFilters}
                                        className="rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                    >
                                        {t.findFriends.clearFilters}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => fetchUsers(search)}
                                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-8 font-bold"
                                    >
                                        {t.findFriends.applyFilters}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow border-none bg-white dark:bg-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                            {item.avatar ? (
                                                <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-400">
                                                    {item.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                <Briefcase className="h-3 w-3" />
                                                <span className="truncate">{item.jobTitle || (item.role === 'student' ? t.profile.student : item.role === 'graduate' ? t.profile.graduate : t.profile.other)}</span>
                                            </div>
                                            {item.specialty && (
                                                <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 mt-0.5 font-bold uppercase tracking-tight">
                                                    <GraduationCap className="h-3 w-3" />
                                                    <span className="truncate">{item.specialty} {item.graduationYear ? `(${item.graduationYear})` : ''}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{item.location || 'Nouakchott'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Role badge */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                            {item.role === 'student' ? t.profile.student : item.role === 'graduate' ? t.profile.graduate : t.profile.other}
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        {(!item.connectionStatus || item.connectionStatus === 'none') && (
                                            <Button
                                                onClick={() => handleConnect(item.id)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" /> {t.common.connect}
                                            </Button>
                                        )}
                                        {item.connectionStatus === 'pending' && item.isRequester && (
                                            <Button disabled className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl">
                                                <Clock className="h-4 w-4 mr-2" /> {t.common.pending}
                                            </Button>
                                        )}
                                        {item.connectionStatus === 'pending' && !item.isRequester && (
                                            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg">
                                                {t.findFriends.respond}
                                            </Button>
                                        )}
                                        {item.connectionStatus === 'accepted' && (
                                            <Button disabled className="w-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30 rounded-xl">
                                                <Check className="h-4 w-4 mr-2" /> {t.findFriends.connected}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )
            }

            {
                !loading && users.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            {!search.trim() ? t.findFriends.searchPlaceholder : t.findFriends.noResults}
                        </p>
                    </div>
                )
            }
        </div >
    );
}
