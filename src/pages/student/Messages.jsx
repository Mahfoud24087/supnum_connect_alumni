import { useState } from 'react';
import { users } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Image as ImageIcon, Users, Plus, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Messages() {
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { id: 1, senderId: users[0].id, text: 'Hey! How are you doing?', timestamp: '10:00 AM' },
        { id: 2, senderId: 'me', text: 'I am good, thanks! Working on the SupNum project.', timestamp: '10:05 AM' },
        { id: 3, senderId: users[0].id, text: 'That sounds great! Need any help?', timestamp: '10:06 AM' },
    ]);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groups, setGroups] = useState([
        { id: 'g1', name: 'Study Group A', members: 3 }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setChatHistory([
            ...chatHistory,
            { id: Date.now(), senderId: 'me', text: message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setMessage('');
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;

        const newGroup = {
            id: `g${Date.now()}`,
            name: groupName,
            members: 1
        };

        setGroups([...groups, newGroup]);
        setIsCreatingGroup(false);
        setGroupName('');
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Messages</h2>
                    <Button size="icon" variant="ghost" onClick={() => setIsCreatingGroup(true)} title="Create Group" className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                <AnimatePresence>
                    {isCreatingGroup && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <form onSubmit={handleCreateGroup} className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">New Group</span>
                                    <button type="button" onClick={() => setIsCreatingGroup(false)}><X className="h-4 w-4 text-slate-400" /></button>
                                </div>
                                <Input
                                    placeholder="Group Name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                                <Button size="sm" type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    <Check className="h-4 w-4 mr-2" /> Create Group
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 overflow-y-auto">
                    {users.slice(0, 3).map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={cn(
                                "w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left",
                                selectedUser?.id === user.id ? "bg-slate-50 dark:bg-slate-800 border-r-2 border-supnum-blue" : ""
                            )}
                        >
                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                        {user.name[0]}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Click to chat</p>
                            </div>
                        </button>
                    ))}

                    {/* Groups List */}
                    {groups.map(group => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedUser({ ...group, isGroup: true })}
                            className={cn(
                                "w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left",
                                selectedUser?.id === group.id ? "bg-slate-50 dark:bg-slate-800 border-r-2 border-supnum-blue" : ""
                            )}
                        >
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-slate-900 dark:text-white">{group.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{group.members} members</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    {selectedUser.isGroup ? (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    ) : selectedUser.avatar ? (
                                        <img src={selectedUser.avatar} alt={selectedUser.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 dark:text-slate-500">
                                            {selectedUser.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {selectedUser.isGroup ? `${selectedUser.members} members` : 'Online'}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" title="Add people to chat" className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Users className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                            {chatHistory.map((msg) => {
                                const isMe = msg.senderId === 'me';
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex", isMe ? "justify-end" : "justify-start")}
                                    >
                                        <div className={cn(
                                            "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                            isMe ? "bg-supnum-blue text-white rounded-br-none" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
                                        )}>
                                            <p>{msg.text}</p>
                                            <p className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-blue-100" : "text-slate-400 dark:text-slate-500")}>
                                                {msg.timestamp}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSend} className="flex items-center space-x-2">
                                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                />
                                <Button type="submit" size="icon" disabled={!message.trim()} className="bg-supnum-blue hover:bg-blue-700 text-white">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}
