import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Image as ImageIcon, Users, Plus, X, Check, Search, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function Messages() {
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv._id);
        }
    }, [selectedConv]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await apiClient.get('/messages/conversations');
            setConversations(response.conversations);

            // Check if we were redirected with a recipientId
            if (location.state?.recipientId) {
                const existingConv = response.conversations.find(c => {
                    if (!c.lastMessage) return false;
                    const otherUserId = String(c.lastMessage.senderId) === String(currentUser.id)
                        ? String(c.lastMessage.recipientId)
                        : String(c.lastMessage.senderId);
                    return otherUserId === String(location.state.recipientId);
                });

                if (existingConv) {
                    setSelectedConv(existingConv);
                } else {
                    // Create a "virtual" conversation for the UI until first message is sent
                    setSelectedConv({
                        _id: 'new',
                        virtual: true,
                        recipientId: location.state.recipientId,
                        recipientName: location.state.recipientName,
                        otherUser: {
                            id: location.state.recipientId,
                            name: location.state.recipientName,
                            avatar: null // We could fetch this if needed
                        }
                    });
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        if (convId === 'new') {
            setMessages([]);
            return;
        }
        try {
            const response = await apiClient.get(`/messages/${convId}`);
            setMessages(response.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        let recipientId;
        if (selectedConv.virtual) {
            recipientId = selectedConv.recipientId;
        } else {
            recipientId = String(selectedConv.lastMessage.senderId) === String(currentUser.id)
                ? selectedConv.lastMessage.recipientId
                : selectedConv.lastMessage.senderId;
        }

        try {
            const response = await apiClient.post('/messages', {
                recipientId,
                content: newMessage
            });

            const sentMessage = response.message;

            if (selectedConv.virtual) {
                // Refresh conversations and find the new one
                const convsRes = await apiClient.get('/messages/conversations');
                const newConvs = convsRes.conversations;
                setConversations(newConvs);

                const newConv = newConvs.find(c => c._id === sentMessage.conversationId);
                if (newConv) {
                    setSelectedConv(newConv);
                    setMessages([sentMessage]);
                } else {
                    // Fallback if not found yet
                    setSelectedConv({ _id: sentMessage.conversationId, lastMessage: sentMessage });
                    setMessages([sentMessage]);
                }
            } else {
                setMessages(prev => [...prev, sentMessage]);
                // Refresh sidebar to update last message and unread count
                const convsRes = await apiClient.get('/messages/conversations');
                setConversations(convsRes.conversations);
            }

            setNewMessage('');
        } catch (error) {
            alert(error.message || t.messages.error);
        }
    };

    const getOtherUser = (conv) => {
        if (conv.virtual) return conv.otherUser;
        if (!conv.lastMessage) return { name: 'Unknown', avatar: null };
        return String(conv.lastMessage.senderId) === String(currentUser.id)
            ? conv.lastMessage.recipient
            : conv.lastMessage.sender;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">{t.messages.title}</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                        </div>
                    ) : conversations.length === 0 && !selectedConv?.virtual ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            {t.messages.noConversations}
                        </div>
                    ) : (
                        <>
                            {selectedConv?.virtual && (
                                <button
                                    className="w-full p-4 flex items-center space-x-3 bg-blue-50/50 dark:bg-blue-900/10 border-r-2 border-blue-600 text-left border-b border-slate-50 dark:border-slate-800/50"
                                >
                                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                            {selectedConv.recipientName[0]}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-slate-900 dark:text-white">{selectedConv.recipientName}</p>
                                        <p className="text-xs text-blue-600">{t.messages.newConversation}</p>
                                    </div>
                                </button>
                            )}
                            {conversations.map((conv) => {
                                const otherUser = getOtherUser(conv);
                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => setSelectedConv(conv)}
                                        className={cn(
                                            "w-full p-4 flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50",
                                            selectedConv?._id === conv._id ? "bg-blue-50/50 dark:bg-blue-900/10 border-r-2 border-blue-600" : ""
                                        )}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                            {otherUser.avatar ? (
                                                <img src={otherUser.avatar} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                    {otherUser.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium truncate text-slate-900 dark:text-white">{otherUser.name}</p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {conv.lastMessage.content}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/20">
                {selectedConv ? (
                    <>
                        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    {getOtherUser(selectedConv).avatar ? (
                                        <img src={getOtherUser(selectedConv).avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                            {getOtherUser(selectedConv).name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{getOtherUser(selectedConv).name}</h3>
                                    <p className="text-xs text-green-500">{t.messages.activeNow}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => {
                                const isMe = String(msg.senderId) === String(currentUser.id);
                                return (
                                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                            isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none"
                                        )}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-blue-100" : "text-slate-400")}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSend} className="flex items-center space-x-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={t.messages.placeholder}
                                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>{t.messages.selectPrompt}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
