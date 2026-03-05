import React, { useState, useRef, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    getYear,
    getMonth,
    setYear,
    setMonth
} from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, ArrowUp, ArrowDown, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { Button } from './Button';

const locales = {
    FR: fr,
    EN: enUS,
    AR: ar
};

export function DatePicker({ value, onChange, placeholder, className }) {
    const { language, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const containerRef = useRef(null);

    const selectedDate = value ? new Date(value) : null;
    const currentLocale = locales[language] || fr;

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateClick = (date) => {
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const nextMonth = () => setViewDate(addMonths(viewDate, 1));
    const prevMonth = () => setViewDate(subMonths(viewDate, 1));

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center space-x-1 cursor-pointer">
                    <span className="text-lg font-bold text-slate-900 dark:text-white lowercase">
                        {format(viewDate, 'MMMM yyyy', { locale: currentLocale })}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-900 dark:text-white" />
                </div>
                <div className="flex space-x-2">
                    <button type="button" onClick={prevMonth} className="p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        <ArrowUp className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={nextMonth} className="p-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                        <ArrowDown className="h-5 w-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(viewDate, { locale: currentLocale });

        for (let i = 0; i < 7; i++) {
            const dayName = format(addDays(startDate, i), 'eeeeee', { locale: currentLocale }).toLowerCase();
            days.push(
                <div key={i} className="h-8 flex items-center justify-center text-sm font-medium text-slate-900 dark:text-slate-100">
                    {dayName}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(viewDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { locale: currentLocale });
        const endDate = endOfWeek(monthEnd, { locale: currentLocale });

        const calendarDays = eachDayOfInterval({
            start: startDate,
            end: endDate
        });

        const rows = [];
        calendarDays.forEach((day, i) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthStart);

            rows.push(
                <button
                    key={day.toString()}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={cn(
                        "h-10 w-full flex items-center justify-center text-sm rounded transition-all",
                        !isCurrentMonth && "text-slate-400 dark:text-slate-600",
                        isCurrentMonth && "text-slate-900 dark:text-slate-100",
                        isSelected && "bg-[#424242] text-white font-medium shadow-sm",
                        !isSelected && isCurrentMonth && "hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                >
                    {format(day, 'd')}
                </button>
            );
        });

        return <div className="grid grid-cols-7 gap-y-1">{rows}</div>;
    };

    const footer = () => {
        return (
            <div className="flex items-center justify-between px-4 pb-4 pt-2">
                <button
                    type="button"
                    onClick={() => {
                        onChange('');
                        setIsOpen(false);
                    }}
                    className="text-sm font-medium text-[#1a73e8] hover:text-blue-700 transition-colors"
                >
                    {language === 'AR' ? 'مسح' : (language === 'FR' ? 'Effacer' : 'Clear')}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        handleDateClick(new Date());
                    }}
                    className="text-sm font-medium text-[#1a73e8] hover:text-blue-700 transition-colors"
                >
                    {language === 'AR' ? 'اليوم' : (language === 'FR' ? "Aujourd'hui" : 'Today')}
                </button>
            </div>
        );
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div
                className="relative group cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                    <CalendarIcon className="h-4 w-4" />
                </div>
                <div className={cn(
                    "flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-3 py-2 text-sm items-center transition-all",
                    isOpen ? "ring-2 ring-blue-500/20 border-blue-500/50" : "hover:border-slate-300 dark:hover:border-slate-700",
                    !value && "text-slate-400"
                )}>
                    {value ? format(new Date(value), 'PPP', { locale: currentLocale }) : (placeholder || t.common.birthday || 'Select Date')}
                </div>
            </div>

            {isOpen && (
                <div className={cn(
                    "absolute top-full mt-2 w-[280px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200",
                    language === 'AR' ? "right-0" : "left-0"
                )}>
                    {renderHeader()}
                    <div className="p-3">
                        {renderDays()}
                        {renderCells()}
                    </div>
                    {footer()}
                </div>
            )}
        </div>
    );
}
