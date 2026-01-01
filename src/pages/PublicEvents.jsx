import { useState, useEffect } from 'react';
import { events as initialEvents } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Calendar, Trophy, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

import { apiClient } from '../services/api';
import { EventModal } from '../components/EventModal';

export function PublicEvents() {
    const { t } = useLanguage();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get('/events');
                setEvents(response.events);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <h1 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">{t.landing.eventsTitle}</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border-none shadow-md flex flex-col h-full">
                        {event.image ? (
                            <div className="aspect-video w-full overflow-hidden relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                />
                                <div className={cn(
                                    "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg",
                                    event.color || (event.type === 'Challenge' ? 'bg-sky-500' : event.type === 'Contest' ? 'bg-amber-500' : 'bg-blue-600')
                                )}>
                                    {event.type}
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 pb-0 flex items-start justify-between">
                                <div className={cn(
                                    "p-3 rounded-xl bg-opacity-10",
                                    event.color || (event.type === 'Challenge' ? 'bg-sky-500 text-sky-600' : event.type === 'Contest' ? 'bg-amber-500 text-amber-600' : 'bg-blue-600 text-blue-600')
                                )}>
                                    {event.type === 'Challenge' ? <Trophy className="h-6 w-6" /> : event.type === 'Contest' ? <Zap className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded text-xs font-bold uppercase text-white",
                                    event.color || (event.type === 'Challenge' ? 'bg-sky-500' : event.type === 'Contest' ? 'bg-amber-500' : 'bg-blue-600')
                                )}>
                                    {event.type}
                                </span>
                            </div>
                        )}

                        <CardHeader className={cn("flex-1", !event.image && "pt-4")}>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{event.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">{event.description}</p>
                            <Button
                                onClick={() => setSelectedEvent(event)}
                                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                            >
                                {t.landing.viewDetails} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <EventModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
}
