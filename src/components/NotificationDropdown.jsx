import { useState, useEffect } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import { cn } from '../lib/utils';

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/notifications');
            setNotifications(response.notifications);
            setUnreadCount(response.notifications.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await apiClient.patch(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await apiClient.patch('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-950">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="fixed left-2 right-2 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96 w-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2" dir="ltr">
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group",
                                                !notification.isRead && "bg-blue-50/30 dark:bg-blue-900/10"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                                                    notification.type === 'application_update' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                                                )}>
                                                    <Bell className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="h-2 w-2 rounded-full bg-blue-600 mt-1.5"
                                                                title="Mark as read"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium italic">
                                                            <Clock className="h-3 w-3" /> {new Date(notification.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {notification.link && (
                                                            <Link
                                                                to={notification.link}
                                                                onClick={() => {
                                                                    setIsOpen(false);
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                                            >
                                                                View <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 text-sm">No notifications yet</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-slate-50 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
                            <Link
                                to="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors block w-full"
                            >
                                View all activity
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
