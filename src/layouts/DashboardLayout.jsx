import { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    LayoutDashboard,
    User,
    Users,
    MessageSquare,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Sun,
    Moon,
    ChevronDown,
    Calendar,
    Briefcase,
    Building,
    Home,
    UserPlus,
    Newspaper,
    ClipboardList
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { apiClient } from '../services/api';
import { requestNotificationPermission, subscribeToPushNotifications } from '../services/notificationService';

export function DashboardLayout() {
    const { user, logout } = useAuth();
    const { t, language, setLanguage, theme, toggleTheme } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const fetchUnreadMessages = async () => {
        try {
            const response = await apiClient.get('/messages/conversations');
            // response.conversations is an array of conversation objects with unreadCount
            const totalUnread = response.conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
            setUnreadMessagesCount(totalUnread);
        } catch (error) {
            console.error('Failed to fetch unread messages:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUnreadMessages();
            // Poll for unread messages every 30 seconds
            const interval = setInterval(fetchUnreadMessages, 30000);
            
            // Handle Push Notifications
            const setupNotifications = async () => {
                const granted = await requestNotificationPermission();
                if (granted) {
                    await subscribeToPushNotifications();
                }
            };
            setupNotifications();

            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const studentNavItems = [
        { name: t.footer.home, path: '/', icon: Home },
        { name: t.dashboard.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.dashboard.nav.profile, path: '/dashboard/profile', icon: User },
        { name: t.footer.findAlumni, path: '/dashboard/find-friends', icon: UserPlus },
        { name: t.dashboard.nav.friends, path: '/dashboard/friends', icon: Users },
        { name: t.dashboard.nav.messages, path: '/dashboard/messages', icon: MessageSquare },
        { name: t.dashboard.nav.feed, path: '/dashboard/feed', icon: Newspaper },
    ];

    useEffect(() => {
        if (location.pathname.includes('/messages')) {
            setUnreadMessagesCount(0);
        }
    }, [location.pathname]);

    const adminNavItems = [
        { name: t.footer.home, path: '/', icon: Home },
        { name: t.admin.nav.dashboard, path: '/admin', icon: LayoutDashboard },
        { name: t.admin.nav.events, path: '/admin/events', icon: Calendar },
        { name: t.admin.nav.users, path: '/admin/users', icon: Users },
        { name: t.admin.nav.applications, path: '/admin/applications', icon: Briefcase },
        { name: t.footer.internships, path: '/admin/internships', icon: Briefcase },
        { name: t.footer.companies, path: '/admin/companies', icon: Building },
        { name: t.dashboard.nav.messages, path: '/admin/messages', icon: MessageSquare },
    ];

    const otherNavItems = [
        { name: t.footer.home, path: '/', icon: Home },
        { name: t.dashboard.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.footer.findAlumni, path: '/dashboard/find-friends', icon: UserPlus },
        { name: t.dashboard.nav.messages, path: '/dashboard/messages', icon: MessageSquare },
        { name: t.dashboard.nav.profile, path: '/dashboard/profile', icon: User },
    ];

    const companyNavItems = [
        { name: t.footer.home, path: '/', icon: Home },
        { name: t.company.nav.dashboard, icon: LayoutDashboard, path: '/dashboard' },
        { name: t.company.nav.offers, icon: Briefcase, path: '/dashboard/company/offers' },
        { name: t.company.nav.applications, icon: ClipboardList, path: '/dashboard/company/applications' },
        { name: t.company.nav.accepted, icon: Users, path: '/dashboard/company/accepted' },
        { name: t.company.nav.messages, icon: MessageSquare, path: '/dashboard/messages' },
        { name: t.company.nav.profile, icon: User, path: '/dashboard/profile' },
    ];

    const graduateNavItems = [
        { name: t.footer.home, path: '/', icon: Home },
        { name: t.dashboard.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.company.nav.offers, icon: Briefcase, path: '/dashboard/company/offers' },
        { name: t.company.nav.applications, icon: ClipboardList, path: '/dashboard/company/applications' },
        { name: t.footer.findAlumni, path: '/dashboard/find-friends', icon: UserPlus },
        { name: t.dashboard.nav.friends, path: '/dashboard/friends', icon: Users },
        { name: t.dashboard.nav.messages, path: '/dashboard/messages', icon: MessageSquare },
        { name: t.dashboard.nav.feed, path: '/dashboard/feed', icon: Newspaper },
        { name: t.dashboard.nav.profile, path: '/dashboard/profile', icon: User },
    ];

    const isWorkingGraduate = useMemo(() => {
        return user?.role === 'graduate' && (
            user?.workStatus?.toLowerCase() === 'employed' || 
            user?.jobTitle || 
            user?.company
        );
    }, [user]);

    const navItems = useMemo(() => {
        if (!user) return [];
        if (user.role === 'admin') return adminNavItems;
        if (user.role === 'company') return companyNavItems;
        
        if (user.role === 'graduate') {
            return graduateNavItems;
        }
        
        if (user.role === 'other') return otherNavItems;
        return studentNavItems;
    }, [user, isWorkingGraduate, t]);

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const languages = ['AR', 'EN', 'FR'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar Navigation - Desktop */}
            <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50">
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <Link to={user?.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
                        <div className="bg-supnum-blue p-1.5 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-supnum-blue">SupNum</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">Connect</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive(item.path)
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <div className="relative">
                                <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                                {(item.path.includes('messages') && unreadMessagesCount > 0) && (
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
                                )}
                            </div>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Sidebar Footer (Logout) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>{t.footer.signOut}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 transition-colors duration-300">
                    <div className="h-full px-4 md:px-8 flex items-center justify-between md:justify-end" dir="ltr">
                        {/* Mobile Logo (Visible only on mobile) */}
                        <div className="md:hidden flex items-center">
                            <Link to={user?.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center space-x-2">
                                <div className="bg-supnum-blue p-1.5 rounded-lg shrink-0">
                                    <GraduationCap className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-sm">SupNum Connect</span>
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Language Selector */}
                            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                {languages.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLanguage(l)}
                                        className={cn(
                                            "px-2 py-1 text-xs font-bold rounded-md transition-all",
                                            language === l
                                                ? "bg-white dark:bg-slate-800 text-supnum-blue shadow-sm"
                                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                        )}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            {/* Notifications */}
                            <NotificationDropdown />

                            {/* Theme Toggle - hidden on mobile */}
                            <button
                                onClick={toggleTheme}
                                className="hidden md:block p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-900"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {/* User Menu */}
                            <div className="relative ml-2">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.[0]}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-900">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        {user?.role !== 'admin' && (
                                            <Link
                                                to="/dashboard/profile"
                                                className="flex items-center px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <User className="h-4 w-4 mr-2.5" />
                                                {t.dashboard.nav.profile}
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-2.5" />
                                            {t.footer.signOut}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu (Overlay) */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 overflow-y-auto pb-8 z-40 animate-in slide-in-from-top-2">
                            <div className="p-4 space-y-4">
                                <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                                isActive(item.path)
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                                            )}
                                        >
                                            <div className="relative">
                                                <item.icon className="h-5 w-5" />
                                                {(item.path.includes('messages') && unreadMessagesCount > 0) && (
                                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
                                                )}
                                            </div>
                                            <span>{item.name}</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-900">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.footer.language}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                                                {languages.map((l) => (
                                                    <button
                                                        key={l}
                                                        onClick={() => setLanguage(l)}
                                                        className={cn(
                                                            "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                                            language === l
                                                                ? "bg-white dark:bg-slate-800 text-supnum-blue shadow-sm"
                                                                : "text-slate-500 dark:text-slate-400"
                                                        )}
                                                    >
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* Theme toggle in mobile menu */}
                                            <button
                                                onClick={toggleTheme}
                                                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-lg bg-slate-100 dark:bg-slate-900"
                                            >
                                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>{t.footer.signOut}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 container mx-auto px-4 md:px-8 py-8 w-full max-w-7xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
