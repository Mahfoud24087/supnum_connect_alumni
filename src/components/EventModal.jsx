import { X, Calendar, MapPin, Trophy, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

export function EventModal({ event, isOpen, onClose }) {
    const { t } = useLanguage();

    if (!isOpen || !event) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden z-10"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors z-20"
                    >
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                    </button>

                    <div className="max-h-[85vh] overflow-y-auto">
                        {event.image && (
                            <div className="relative h-64 w-full">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${event.color || 'bg-blue-600'} shadow-lg`}>
                                    {event.type}
                                </div>
                            </div>
                        )}

                        <div className="p-6 md:p-8 space-y-6">
                            {!event.image && (
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-xl ${event.color || 'bg-blue-600'} bg-opacity-10 text-blue-600 dark:text-blue-400`}>
                                        {event.type === 'Challenge' ? <Trophy className="h-6 w-6" /> : event.type === 'Contest' ? <Zap className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.color || 'bg-blue-600'} text-white`}>
                                        {event.type}
                                    </span>
                                </div>
                            )}

                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h2>
                                <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 text-sm">
                                    <div className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        {(() => {
                                            try {
                                                const d = new Date(event.date);
                                                return isNaN(d.getTime())
                                                    ? event.date // Fallback to raw string
                                                    : d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                            } catch (e) {
                                                return event.date;
                                            }
                                        })()}
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                            {event.location}
                                        </div>
                                    )}
                                    {event.duration && (
                                        <div className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                            <Zap className="h-4 w-4 mr-2 text-amber-500" />
                                            {event.duration} {t.admin?.events?.days || 'Days'}
                                        </div>
                                    )}
                                    {event.stage && (
                                        <div className="flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                                            <Users className="h-4 w-4 mr-2 text-teal-500" />
                                            {event.stage}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                <p className="leading-relaxed whitespace-pre-line">{event.description}</p>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={onClose}>{t.common?.close || 'Fermer'}</Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
