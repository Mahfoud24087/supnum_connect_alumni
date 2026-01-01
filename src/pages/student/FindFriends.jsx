import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search, UserPlus, Clock, Check, UserMinus, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export function FindFriends() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [graduates, setGraduates] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGraduates = async (query = '') => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/users/graduates/search?search=${query}`);
            setGraduates(response.graduates);
        } catch (error) {
            console.error('Failed to fetch graduates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraduates();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchGraduates(search);
    };

    const handleConnect = async (userId) => {
        try {
            await apiClient.post(`/users/connect/${userId}`);
            fetchGraduates(search); // Refresh list
        } catch (error) {
            alert(error.message || t.common.error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.findFriends.title}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t.findFriends.subtitle}</p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={t.findFriends.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit">{t.common.search.replace('...', '')}</Button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {graduates.map((grad) => (
                        <motion.div
                            key={grad.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow border-none bg-white dark:bg-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                            {grad.avatar ? (
                                                <img src={grad.avatar} alt={grad.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-xl font-bold text-slate-400">
                                                    {grad.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{grad.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                <Briefcase className="h-3 w-3" />
                                                <span className="truncate">{grad.jobTitle || (grad.role === 'student' ? t.profile.student : t.profile.graduate)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate">{grad.location || 'Nouakchott'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        {grad.connectionStatus === 'none' && (
                                            <Button
                                                onClick={() => handleConnect(grad.id)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" /> {t.common.connect}
                                            </Button>
                                        )}
                                        {grad.connectionStatus === 'pending' && grad.isRequester && (
                                            <Button disabled className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                <Clock className="h-4 w-4 mr-2" /> {t.common.pending}
                                            </Button>
                                        )}
                                        {grad.connectionStatus === 'pending' && !grad.isRequester && (
                                            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                                                {t.findFriends.respond}
                                            </Button>
                                        )}
                                        {grad.connectionStatus === 'accepted' && (
                                            <Button disabled className="w-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30">
                                                <Check className="h-4 w-4 mr-2" /> {t.findFriends.connected}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && graduates.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">{t.findFriends.noResults}</p>
                </div>
            )}
        </div>
    );
}
