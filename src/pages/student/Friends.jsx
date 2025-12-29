import { useState } from 'react';
import { users } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Check, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Friends() {
    const [activeTab, setActiveTab] = useState('friends');

    // Mock data for friends and requests
    const friends = users.slice(0, 2);
    const requests = users.slice(2, 3); // Just using mock users as examples

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Friends</h1>
                <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'friends' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        My Friends
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        Requests
                        <span className="ml-2 bg-supnum-blue text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {activeTab === 'friends' ? (
                    friends.map((friend) => (
                        <Card key={friend.id} className="bg-white dark:bg-slate-800 border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        {friend.avatar ? (
                                            <img src={friend.avatar} alt={friend.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                                {friend.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{friend.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{friend.role}</p>
                                    </div>
                                </div>
                                <Link to="/dashboard/messages">
                                    <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Message
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    requests.map((request) => (
                        <Card key={request.id} className="bg-white dark:bg-slate-800 border-none shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        {request.avatar ? (
                                            <img src={request.avatar} alt={request.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                                {request.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{request.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Sent you a friend request</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                        <Check className="mr-2 h-4 w-4" />
                                        Accept
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
                                        <X className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
