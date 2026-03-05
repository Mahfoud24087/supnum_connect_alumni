import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search as SearchIcon, UserPlus, Eye, Loader2, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function Search() {
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/users/search/all?query=${searchQuery}`);
            setUsers(response.users);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSearch(query);
        }, 500); // 500ms debounce for better experience

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleConnect = async (userId) => {
        try {
            await apiClient.post(`/users/connect/${userId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.search.title}</h1>

            <div className="relative group max-w-2xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                    placeholder={t.findFriends.searchPlaceholder}
                    className="pl-12 h-14 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 dark:focus:border-blue-500 transition-all shadow-md"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border-none shadow-sm">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <Link to={`/dashboard/profile/${user.id}`} className="group relative">
                                    <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-sm group-hover:ring-blue-500/20 dark:group-hover:ring-blue-500/40 transition-all">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-500">
                                                {user.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-full transition-colors">
                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                                <div>
                                    <Link to={`/dashboard/profile/${user.id}`} className="hover:underline hover:text-blue-600 dark:hover:text-blue-400">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h3>
                                    </Link>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.supnumId}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full capitalize">
                                        {user.role === 'student' ? t.profile.student : t.profile.graduate}
                                    </span>
                                </div>
                                <div className="flex w-full gap-2">
                                    <Link to={`/dashboard/profile/${user.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            {t.search.viewProfile}
                                        </Button>
                                    </Link>
                                    {currentUser?.role === 'admin' ? (
                                        <Button
                                            onClick={() => navigate('/dashboard/messages', { state: { recipientId: user.id, recipientName: user.name } })}
                                            size="sm"
                                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => handleConnect(user.id)} size="sm" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {!loading && users.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 italic">
                        {!query.trim() ? "Start searching by name, job, ID, or role..." : t.search.noResults}
                    </div>
                )}
            </div>
        </div>
    );
}
