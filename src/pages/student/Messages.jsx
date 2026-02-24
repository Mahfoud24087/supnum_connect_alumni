import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, Image as ImageIcon, Users, Plus, X, Check, Search, MessageSquare, ArrowLeft, MoreVertical, Trash2, Edit2, Eye, Download, XCircle, Mic, Square, Play, Pause, Reply, CornerUpLeft, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSocket } from '../../context/SocketContext';

// Helper component for Audio Playback
function AudioPlayer({ url, isMe }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const onTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const onLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl min-w-[200px]",
            isMe ? "bg-blue-700/50 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white"
        )}>
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
            <button
                onClick={togglePlay}
                className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                    isMe ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"
                )}
            >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
            </button>
            <div className="flex-1">
                <div className="h-1.5 w-full bg-slate-300/30 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full transition-all duration-100", isMe ? "bg-white" : "bg-blue-600")}
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] opacity-70 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}

export function Messages() {
    const { user: currentUser } = useAuth();
    const { t } = useLanguage();
    const { socket, onlineUsers } = useSocket();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [openActionId, setOpenActionId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [forwardingMessage, setForwardingMessage] = useState(null);

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingIntervalRef = useRef(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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

    useEffect(() => {
        if (!socket) return;

        socket.on('new_message', (message) => {
            if (selectedConv && message.conversationId === selectedConv._id) {
                setMessages(prev => {
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, message];
                });
            }
            fetchConversations();
        });

        socket.on('message_deleted', ({ messageId, conversationId }) => {
            if (selectedConv && conversationId === selectedConv._id) {
                setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true, content: '', fileUrl: null } : m));
            }
            fetchConversations();
        });

        socket.on('message_edited', (updatedMessage) => {
            if (selectedConv && updatedMessage.conversationId === selectedConv._id) {
                setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
            }
        });

        return () => {
            socket.off('new_message');
            socket.off('message_deleted');
            socket.off('message_edited');
        };
    }, [socket, selectedConv]);

    const fetchConversations = async () => {
        try {
            const response = await apiClient.get('/messages/conversations');
            setConversations(response.conversations);

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
                    setSelectedConv({
                        _id: 'new',
                        virtual: true,
                        recipientId: location.state.recipientId,
                        recipientName: location.state.recipientName,
                        otherUser: {
                            id: location.state.recipientId,
                            name: location.state.recipientName,
                            avatar: null
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
        // Clear messages immediately so user doesn't see old chat
        setMessages([]);
        try {
            const response = await apiClient.get(`/messages/${convId}`);
            setMessages(response.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const startRecording = async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.onstop = null;
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setAudioBlob(null);
        clearInterval(recordingIntervalRef.current);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if ((!newMessage.trim() && !selectedFile && !audioBlob) || !selectedConv) return;

        let recipientId;
        if (selectedConv.virtual) {
            recipientId = selectedConv.recipientId;
        } else {
            const otherUser = getOtherUser(selectedConv);
            recipientId = otherUser.id;
        }

        // Optimistic UI: Clear input immediately for snappier feel
        setNewMessage('');
        setSelectedFile(null);
        setAudioBlob(null);
        setReplyTo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        try {
            const formData = new FormData();
            formData.append('recipientId', recipientId);
            if (newMessage.trim()) formData.append('content', newMessage);

            if (selectedFile) {
                formData.append('file', selectedFile);
            } else if (audioBlob) {
                formData.append('file', audioBlob, `voice-${Date.now()}.webm`);
            }

            if (replyTo) {
                formData.append('replyToId', replyTo.id);
            }

            const response = await apiClient.post('/messages', formData);

            if (selectedConv.virtual) {
                const sentMessage = response.message;
                const convRes = await apiClient.get('/messages/conversations');
                const newConvs = convRes.conversations;
                setConversations(newConvs);

                const newConv = newConvs.find(c => c._id === sentMessage.conversationId);
                if (newConv) setSelectedConv(newConv);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Optional: Restore message on error
            showToast('Failed to send message', 'error');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await apiClient.delete(`/messages/${messageId}`);
            setOpenActionId(null);
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const startEditing = (message) => {
        setEditingMessageId(message.id);
        setEditContent(message.content);
        setOpenActionId(null);
    };

    const handleEditMessage = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;
        try {
            await apiClient.put(`/messages/${editingMessageId}`, { content: editContent });
            setEditingMessageId(null);
            setEditContent('');
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    };

    const getOtherUser = (conv) => {
        if (conv.virtual && conv.otherUser) return conv.otherUser;
        if (!conv.lastMessage) return { name: 'Unknown', avatar: null, role: '' };
        return String(conv.lastMessage.senderId) === String(currentUser.id)
            ? conv.lastMessage.recipient : conv.lastMessage.sender;
    };

    if (loading) {
        return <div className="flex h-[calc(100vh-8rem)] items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300">
            {/* Sidebar */}
            <div className={cn(
                "w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all",
                selectedConv ? "hidden md:flex" : "flex"
            )}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        {t.messages?.title || 'Messages'}
                    </h2>
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search messages..." className="pl-9 bg-white dark:bg-slate-800 border-none shadow-sm h-10 rounded-xl text-sm" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
                            <p className="text-xs">{t.messages?.noConversations || 'No conversations yet'}</p>
                        </div>
                    ) : (
                        <>
                            {conversations.map((conv) => {
                                const otherUser = getOtherUser(conv);
                                if (!otherUser) return null;
                                const isSelected = selectedConv?._id === conv._id;

                                return (
                                    <button
                                        key={conv._id}
                                        onClick={() => setSelectedConv(conv)}
                                        className={cn(
                                            "w-full p-4 flex items-center space-x-4 rounded-2xl transition-all duration-200 group",
                                            isSelected
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95"
                                                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                        )}
                                    >
                                        <div className="relative h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-400 transition-all">
                                            {otherUser.avatar ? (
                                                <img src={otherUser.avatar} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                    {otherUser.name[0]}
                                                </div>
                                            )}
                                            {onlineUsers.includes(String(otherUser.id)) && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className={cn("font-medium truncate", isSelected ? "text-white" : "text-slate-900 dark:text-white")}>{otherUser.name}</p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn("text-xs truncate", isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400")}>
                                                {conv.lastMessage?.type === 'audio' ? 'Voice Message' : conv.lastMessage?.type === 'image' ? 'Image message' : conv.lastMessage?.content}
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
            <div className={cn(
                "flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/20",
                !selectedConv ? "hidden md:flex" : "flex"
            )}>
                {selectedConv ? (
                    <>
                        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2 h-8 w-8 text-slate-500"
                                    onClick={() => setSelectedConv(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative shadow-inner">
                                    {getOtherUser(selectedConv).avatar ? (
                                        <img src={getOtherUser(selectedConv).avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                            {getOtherUser(selectedConv).name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{getOtherUser(selectedConv).name}</h3>
                                        {onlineUsers.includes(String(getOtherUser(selectedConv).id)) && (
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Online
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 capitalize">
                                        {t.common?.roles?.[getOtherUser(selectedConv).role?.toLowerCase()] || getOtherUser(selectedConv).role || ''}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => {
                                const isMe = String(msg.senderId) === String(currentUser.id);
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn("flex group relative mb-4", isMe ? "justify-end" : "justify-start")}
                                    >
                                        <div
                                            onClick={() => !msg.isDeleted && setOpenActionId(openActionId === msg.id ? null : msg.id)}
                                            className={cn(
                                                "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative cursor-pointer transition-all active:scale-[0.98]",
                                                isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none",
                                                msg.isDeleted && "italic opacity-70 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                                                openActionId === msg.id && "ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-slate-900"
                                            )}
                                        >
                                            {/* Actions Dropdown triggered by bubble click */}
                                            <AnimatePresence>
                                                {openActionId === msg.id && !msg.isDeleted && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: index < 2 ? -5 : 5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: index < 2 ? -5 : 5 }}
                                                        className={cn(
                                                            "absolute w-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-[100] p-1",
                                                            isMe ? "right-0" : "left-0",
                                                            index < 2 ? "top-full mt-1" : "bottom-full mb-1"
                                                        )}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {[
                                                            { label: 'Reply', icon: Reply, color: 'text-emerald-500', action: () => setReplyTo(msg) },
                                                            { label: 'Forward', icon: Share2, color: 'text-blue-500', action: () => setForwardingMessage(msg) },
                                                            ...(msg.type === 'image' ? [{ label: 'View Image', icon: Eye, color: 'text-purple-500', action: () => setPreviewImage(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}${msg.fileUrl}`) }] : []),
                                                            ...(isMe && msg.type !== 'image' && msg.type !== 'audio' ? [{ label: 'Edit', icon: Edit2, color: 'text-blue-500', action: () => startEditing(msg) }] : []),
                                                            ...(isMe ? [{ label: 'Delete', icon: Trash2, color: 'text-red-500', action: () => handleDeleteMessage(msg.id) }] : [])
                                                        ].map((item, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    item.action();
                                                                    setOpenActionId(null);
                                                                }}
                                                                className="w-full px-3 py-2 text-left text-[13px] font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 transition-all rounded-xl active:scale-95"
                                                            >
                                                                <item.icon className={cn("h-4 w-4", item.color)} />
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {msg.isDeleted ? (
                                                <p className="text-sm flex items-center gap-2">
                                                    <XCircle className="h-4 w-4" /> This message was deleted
                                                </p>
                                            ) : (
                                                <>
                                                    {msg.replyTo && (
                                                        <div className={cn(
                                                            "mb-2 p-2 rounded-lg text-xs border-l-4 opacity-80",
                                                            isMe ? "bg-white/10 border-white/40 text-blue-50" : "bg-slate-100 dark:bg-slate-700 border-blue-500 text-slate-600 dark:text-slate-300"
                                                        )}>
                                                            <p className="font-bold mb-1 flex items-center gap-1">
                                                                <CornerUpLeft className="h-3 w-3" />
                                                                {msg.replyTo.sender?.name || 'Someone'}
                                                            </p>
                                                            <p className="truncate">
                                                                {msg.replyTo.type === 'audio' ? 'Voice Message' : msg.replyTo.type === 'image' ? 'Image' : msg.replyTo.content}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {msg.type === 'image' && msg.fileUrl && (
                                                        <div className="mb-2 rounded-lg overflow-hidden relative group max-w-[200px]">
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                            <img
                                                                src={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}${msg.fileUrl}`}
                                                                alt="Sent"
                                                                className="w-full h-32 object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {msg.type === 'audio' && msg.fileUrl && (
                                                        <AudioPlayer url={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}${msg.fileUrl}`} isMe={isMe} />
                                                    )}

                                                    {editingMessageId === msg.id ? (
                                                        <form onSubmit={handleEditMessage} className="flex flex-col gap-2 min-w-[200px]">
                                                            <Input
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                className="h-8 text-slate-900 bg-white"
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-2 justify-end">
                                                                <Button type="button" size="xs" variant="ghost" onClick={() => setEditingMessageId(null)} className="h-6 text-xs text-white/80 hover:text-white">Cancel</Button>
                                                                <Button type="submit" size="xs" className="h-6 text-xs bg-white text-blue-600">Save</Button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    )}

                                                    <div className={cn(
                                                        "text-[10px] mt-1 flex items-center justify-end gap-1 opacity-70",
                                                        isMe ? "text-blue-50" : "text-slate-500"
                                                    )}>
                                                        {msg.isEdited && <span className="mr-1 italic">Edited</span>}
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isMe && <Check className="h-3 w-3" />}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            {/* Reply Preview */}
                            <AnimatePresence>
                                {replyTo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mb-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-blue-600">Replying to {String(replyTo.senderId) === String(currentUser.id) ? 'yourself' : replyTo.sender?.name}</p>
                                                <p className="text-xs text-slate-500 truncate">
                                                    {replyTo.type === 'audio' ? 'Voice Message' : replyTo.type === 'image' ? 'Image' : replyTo.content}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setReplyTo(null)} className="h-6 w-6 rounded-full text-slate-400 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isRecording ? (
                                <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 p-3 rounded-2xl border border-red-100 dark:border-red-900/20">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Recording: {formatTime(recordingTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={cancelRecording} className="text-slate-500 hover:text-red-600">Cancel</Button>
                                        <Button size="sm" onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white rounded-full h-10 w-10 p-0">
                                            <Square className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ) : audioBlob ? (
                                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                    <div className="flex items-center gap-3">
                                        <Mic className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Voice message ready</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)} className="text-slate-500 hover:text-red-600">Delete</Button>
                                        <Button size="sm" onClick={() => handleSend()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl">Send Voice</Button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn("text-slate-500 hover:text-blue-600", selectedFile && "text-blue-600 bg-blue-50")}
                                    >
                                        <ImageIcon className="h-5 w-5" />
                                    </Button>

                                    <div className="flex-1 relative">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={t.messages?.typeSomething || 'Type a message...'}
                                            className="pr-10 bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-2xl"
                                        />
                                    </div>

                                    {!newMessage.trim() && !selectedFile ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={startRecording}
                                            className="text-slate-500 hover:text-blue-600"
                                        >
                                            <Mic className="h-5 w-5" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    )}
                                </form>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-10 w-10 text-blue-500 opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.messages?.selectConversation || 'Select a conversation'}</h3>
                        <p className="text-sm max-w-xs">{t.messages?.selectConversationDesc || 'Choose a friend from the list to start chatting in real-time.'}</p>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X className="h-8 w-8" />
                        </Button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Forward Modal */}
            <AnimatePresence>
                {forwardingMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setForwardingMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-bold">Transmettre à...</h3>
                                <Button variant="ghost" size="icon" onClick={() => setForwardingMessage(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="p-2 max-h-[400px] overflow-y-auto">
                                {conversations.map(conv => {
                                    const otherUser = getOtherUser(conv);
                                    return (
                                        <button
                                            key={conv._id}
                                            onClick={async () => {
                                                try {
                                                    const formData = new FormData();
                                                    formData.append('recipientId', otherUser.id);

                                                    if (forwardingMessage.type === 'text') {
                                                        formData.append('content', forwardingMessage.content);
                                                    } else {
                                                        formData.append('content', `Transmis : ${forwardingMessage.content || forwardingMessage.type}`);
                                                    }

                                                    const response = await apiClient.post('/messages', formData);

                                                    // Switch to the target conversation
                                                    setSelectedConv(conv);
                                                    setForwardingMessage(null);
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            }}
                                            className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl transition-colors"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                {otherUser.avatar ? (
                                                    <img src={otherUser.avatar} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                                                        {otherUser.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-medium">{otherUser.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
