import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notification, setNotification] = useState(null);
    const { user } = useAuth();

    const ENDPOINT = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://127.0.0.1:3000';

    useEffect(() => {
        if (user && user.id) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            newSocket.emit('setup', String(user.id));

            newSocket.on('connected', () => {
                console.log('✅ Socket connected');
            });

            newSocket.on('get_online_users', (users) => {
                setOnlineUsers(users);
            });

            newSocket.on('new_message', (message) => {
                // Only show notification if NOT on messages page or if it's from a different conversation
                if (window.location.pathname !== '/dashboard/messages' && window.location.pathname !== '/admin/messages') {
                    if (String(message.senderId) !== String(user.id)) {
                        setNotification(message);
                        setTimeout(() => setNotification(null), 5000);
                    }
                }
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, ENDPOINT]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}

            {/* Global Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className="fixed top-0 left-1/2 z-[9999] w-full max-w-sm"
                    >
                        <div className="mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-blue-100 dark:border-blue-900/30 p-4 flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {notification.sender?.name || 'New Message'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {notification.content || 'Sent an image'}
                                </p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SocketContext.Provider>
    );
};
