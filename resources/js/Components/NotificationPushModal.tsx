import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
}

interface NotificationPushModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification: NotificationData | null;
}

const iconMap: Record<string, { icon: string; color: string; bg: string }> = {
    info: { icon: 'info', color: 'text-blue-600', bg: 'bg-blue-100' },
    warning: { icon: 'warning', color: 'text-amber-600', bg: 'bg-amber-100' },
    success: { icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    error: { icon: 'error', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function NotificationPushModal({ isOpen, onClose, notification }: NotificationPushModalProps) {
    // ✅ useEffect must always be called — no early return before hooks
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Safe guard — do not render if notification data is missing entirely
    if (!notification) return null;

    const style = iconMap[notification.type] || iconMap.info;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 border border-slate-100/50"
                    >
                        {/* Top Accent Strip */}
                        <div className={`h-2 w-full ${style.bg}`}></div>

                        <div className="p-6">
                            {/* Header & Icon */}
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className={`size-16 rounded-full ${style.bg} ${style.color} flex items-center justify-center mb-4 ring-8 ring-white shadow-sm`}>
                                    <span className="material-symbols-outlined text-[32px]">{style.icon}</span>
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900">
                                    {notification.title}
                                </h3>
                            </div>

                            {/* Body */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                                <p className="text-slate-600 text-sm leading-relaxed text-center">
                                    {notification.message}
                                </p>
                            </div>

                            {/* Action */}
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                            >
                                Tutup Pesan
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
