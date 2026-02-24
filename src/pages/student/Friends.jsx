import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { UserCheck, UserX, MessageSquare, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function Friends() {
    const { t } = useLanguage();
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, friendsRes] = await Promise.all([
                apiClient.get('/users/connections/requests'),
                apiClient.get('/users/connections/friends')
            ]);
            setRequests(reqRes.requests);
            setFriends(friendsRes.friends);
        } catch (error) {
            console.error('Failed to fetch connections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (requestId) => {
        try {
            await apiClient.patch(`/users/connect/${requestId}/accept`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await apiClient.patch(`/users/connect/${requestId}/reject`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMessage = (friend) => {
        navigate('/dashboard/messages', { state: { recipientId: friend.id, recipientName: friend.name } });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.friends.title}</h1>
                <Link to="/dashboard/find-friends">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Search className="h-4 w-4 mr-2" /> {t.findFriends.title}
                    </Button>
                </Link>
            </div>

            {/* Pending Requests */}
            {requests.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {t.friends.pendingRequests} <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs">{requests.length}</span>
                    </h2>
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {requests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="border-none shadow-sm bg-white dark:bg-slate-800">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <Link to={`/dashboard/profile/${req.requester.id}`} className="flex items-center gap-4 group">
                                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                                                    {req.requester.avatar ? (
                                                        <img src={req.requester.avatar} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                            {req.requester.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{req.requester.name}</h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">{req.requester.jobTitle || (req.requester.role === 'student' ? t.profile.student : t.profile.graduate)}</p>
                                                </div>
                                            </Link>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleAccept(req.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white h-9 px-4"
                                                >
                                                    <UserCheck className="h-4 w-4 mr-2" /> {t.common.accept}
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(req.id)}
                                                    variant="outline"
                                                    className="h-9 px-4 text-red-600 border-red-100 hover:bg-red-50"
                                                >
                                                    <UserX className="h-4 w-4 mr-2" /> {t.friends.decline}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            )}

            {/* Friends List */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.friends.connections}</h2>
                {friends.length === 0 ? (
                    <Card className="border-dashed border-2 bg-transparent">
                        <CardContent className="p-12 text-center">
                            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">{t.friends.noConnections}</p>
                            <Link to="/dashboard/find-friends" className="mt-4 inline-block">
                                <Button variant="link" className="text-blue-600">{t.friends.startFinding}</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friends.map((friend) => (
                            <Card key={friend.id} className="border-none shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <Link to={`/dashboard/profile/${friend.id}`} className="flex items-center gap-4 group">
                                        <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                                            {friend.avatar ? (
                                                <img src={friend.avatar} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                    {friend.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{friend.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{friend.jobTitle || (friend.role === 'student' ? t.profile.student : t.profile.graduate)}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{friend.company}</p>
                                        </div>
                                    </Link>
                                    <div className="flex gap-1">
                                        <Button onClick={() => handleMessage(friend)} variant="ghost" className="h-10 w-10 p-0 rounded-full text-blue-600 hover:bg-blue-50">
                                            <MessageSquare className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                if (window.confirm(`Retirer ${friend.name} des amis ?`)) {
                                                    try {
                                                        await apiClient.delete(`/users/connect/${friend.id}/unfriend`);
                                                        fetchData();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }
                                            }}
                                            variant="ghost"
                                            className="h-10 w-10 p-0 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                                            title="Retirer des amis"
                                        >
                                            <UserX className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
