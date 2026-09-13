import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, SlidersHorizontal, Info } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            await axios.post(route('notifications.mark-all-read'));
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read_at) {
            try {
                await axios.post(route('notifications.mark-as-read', notification.id));
                setNotifications(prev => 
                    prev.map(n => n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n)
                );
                window.dispatchEvent(new CustomEvent('notifications-updated'));
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }

        // Handle navigation based on notification data
        const data = notification.data || {};
        if (data.url) {
            router.get(data.url);
        } else if (data.transaction_id) {
            // Default to transaction show page if no URL is provided but transaction ID is present
            router.get(route('motors.transaction.show', data.transaction_id));
        }
        
        onClose();
    };

    return (
        <div className="absolute right-0 mt-2 w-[380px] bg-white shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col rounded-none animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
                        Notifikasi
                    </h3>
                    <p className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">
                        Pemberitahuan Sistem Terbaru
                    </p>
                </div>
                {notifications.some(n => !n.read_at) && (
                    <button 
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                    >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Baca Semua
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 max-h-[420px] overflow-y-auto custom-scrollbar bg-white">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Memuat...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="flex flex-col">
                        {notifications.map(notification => (
                            <NotificationItem 
                                key={notification.id} 
                                notification={notification} 
                                onClick={handleNotificationClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <Bell className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                            Belum Ada Notifikasi
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50/50 border-t border-gray-100">
                <button 
                    onClick={onClose}
                    className="w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 hover:border-gray-300"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
