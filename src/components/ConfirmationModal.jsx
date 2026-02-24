import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/Button';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant = 'danger' }) {
    if (!isOpen) return null;

    const variants = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                                <AlertCircle className={`h-6 w-6 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    {title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {message}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-slate-200 dark:border-slate-700"
                            >
                                {cancelText || 'Annuler'}
                            </Button>
                            <Button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 ${variants[variant]}`}
                            >
                                {confirmText || 'Confirmer'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
