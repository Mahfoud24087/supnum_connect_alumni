import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Plus, Calendar, Edit, Trash2, ArrowRight, Trophy, Zap, X, Save, Image as ImageIcon, Clock, Briefcase, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../services/api';
import { EventModal } from '../../components/EventModal';
import { useToast } from '../../components/Toast';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export function ManageEvents() {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [typeFilter, setTypeFilter] = useState('All');

    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        type: 'Event',
        description: '',
        image: '',
        duration: '7',
        stage: 'All',
        color: 'bg-blue-600'
    });

    const fetchEvents = async (overrides = {}) => {
        try {
            setLoading(true);
            const currentType = overrides.type ?? typeFilter;

            const url = currentType !== 'All' ? `/events?type=${currentType}` : '/events';
            const response = await apiClient.get(url);
            setEvents(response.events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [typeFilter]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEvent(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteClick = (event) => {
        setEventToDelete(event);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        try {
            await apiClient.delete(`/events/${eventToDelete.id}`);
            showToast('Événement supprimé', 'success');
            fetchEvents();
        } catch (error) {
            console.error(error);
            showToast('Erreur lors de la suppression', 'error');
        }
    };

    const handleEdit = (event) => {
        setNewEvent({
            title: event.title,
            date: event.date.split('T')[0], // Format for date input if needed, but the mock used strings
            type: event.type,
            description: event.description,
            image: event.image || '',
            duration: event.duration || '7',
            stage: event.stage || 'All',
            color: event.color
        });
        setCurrentEventId(event.id);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await apiClient.put(`/events/${currentEventId}`, newEvent);
            } else {
                await apiClient.post('/events', newEvent);
            }
            fetchEvents();
            setIsAdding(false);
            resetForm();
            showToast(isEditing ? 'Événement mis à jour' : 'Événement créé avec succès', 'success');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    };

    const resetForm = () => {
        setNewEvent({
            title: '',
            date: '',
            type: 'Event',
            description: '',
            image: '',
            duration: '7',
            stage: 'All',
            color: 'bg-blue-600'
        });
        setIsEditing(false);
        setCurrentEventId(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t.admin.events.title}</h1>
                <Button
                    onClick={() => { resetForm(); setIsAdding(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.admin.events.create}
                </Button>
            </div>

            <div className="flex justify-start">
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-12 px-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm min-w-[200px] transition-all cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                >
                    <option value="All">Tous les types</option>
                    <option value="Event">Event</option>
                    <option value="Challenge">Challenge</option>
                    <option value="Contest">Contest</option>
                </select>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-8">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {isEditing ? 'Edit Event' : 'New Event Details'}
                                    </h3>
                                    <Button variant="ghost" size="sm" onClick={() => { setIsAdding(false); resetForm(); }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                                        <Input
                                            required
                                            value={newEvent.title}
                                            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                            placeholder="Event Title"
                                            className="bg-white dark:bg-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Text</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                required
                                                value={newEvent.date}
                                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                                placeholder="e.g., Jun 01, 2024"
                                                className="pl-10 bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                                        <select
                                            className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newEvent.type}
                                            onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                        >
                                            <option value="Event">Event</option>
                                            <option value="Challenge">Challenge</option>
                                            <option value="Contest">Contest</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stage / Nature</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                value={newEvent.stage}
                                                onChange={e => setNewEvent({ ...newEvent, stage: e.target.value })}
                                                placeholder="e.g., Internship, Workshop, All"
                                                className="pl-10 bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Image</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    value={newEvent.image}
                                                    onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                                                    placeholder="Image URL (optional)"
                                                    className="pl-10 bg-white dark:bg-slate-900"
                                                />
                                            </div>
                                            <label className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                                <Upload className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                        {newEvent.image && (
                                            <div className="mt-2 h-20 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                                <img src={newEvent.image} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (Days)</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                type="number"
                                                min="1"
                                                value={newEvent.duration}
                                                onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                                                placeholder="7"
                                                className="pl-10 bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                        <textarea
                                            required
                                            className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            value={newEvent.description}
                                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                            placeholder="Event description..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-2">
                                        <Button type="button" variant="ghost" onClick={() => { setIsAdding(false); resetForm(); }}>Cancel</Button>
                                        <Button type="submit" className="bg-blue-600 text-white">
                                            <Save className="mr-2 h-4 w-4" /> {isEditing ? 'Update Event' : 'Save Event'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <Card className="overflow-hidden border-none shadow-lg h-full flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300">
                            {event.image ? (
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${event.color} shadow-lg flex items-center gap-2`}>
                                        {event.type === 'Challenge' && <Trophy className="h-3 w-3" />}
                                        {event.type === 'Contest' && <Zap className="h-3 w-3" />}
                                        {event.type}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                            )}

                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {event.date}
                                    </div>
                                    {!event.image && (
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.color} text-white`}>
                                            {event.type}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{event.stage || 'All'}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="flex items-center text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:bg-blue-400 transition-colors"
                                    >
                                        {t.admin.events.learnMore} <ArrowRight className="ml-2 h-4 w-4" />
                                    </button>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            onClick={() => handleEdit(event)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-600 text-white border-none"
                                            onClick={() => handleDeleteClick(event)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <EventModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer l'événement"
                message={`Voulez-vous vraiment supprimer l'événement "${eventToDelete?.title}" ?`}
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
}
