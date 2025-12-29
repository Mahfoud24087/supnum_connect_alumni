import { useState } from 'react';
import { users } from '../../data/mockData';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search as SearchIcon, UserPlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Search() {
    const [query, setQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.role !== 'admin' && (
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.supnumId?.toLowerCase().includes(query.toLowerCase())
        )
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Find People</h1>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search by name or SupNum ID (e.g., 2YXXX)..."
                    className="pl-10 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border-none shadow-sm">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <Link to={`/dashboard/profile/${user.id}`} className="group relative">
                                    <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-sm group-hover:ring-supnum-blue/20 dark:group-hover:ring-supnum-blue/40 transition-all">
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
                                    <Link to={`/dashboard/profile/${user.id}`} className="hover:underline hover:text-supnum-blue dark:hover:text-blue-400">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h3>
                                    </Link>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{user.supnumId}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full capitalize">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex w-full gap-2">
                                    <Link to={`/dashboard/profile/${user.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                            View Profile
                                        </Button>
                                    </Link>
                                    <Button size="sm" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
