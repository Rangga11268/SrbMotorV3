import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { Bell, CreditCard, CheckCircle, AlertCircle, Info, Bike, Calendar } from 'lucide-react';

export default function NotificationItem({ notification, onClick }) {
    const isUnread = !notification.read_at;
    const data = notification.data || {};
    
    // Choose icon based on type or content
    const getIcon = () => {
        const type = notification.type || '';
        if (type.includes('TransactionStatusChanged') || type.includes('CreditStatusChanged')) {
            return <CheckCircle className="w-5 h-5 text-blue-500" />;
        }
        if (type.includes('InstallmentReminder')) {
            return <AlertCircle className="w-5 h-5 text-orange-500" />;
        }
        if (type.includes('TransactionCreated')) {
            return <CreditCard className="w-5 h-5 text-green-500" />;
        }
        if (type.includes('SurveyScheduled')) {
            return <Calendar className="w-5 h-5 text-purple-500" />;
        }
        return <Bell className="w-5 h-5 text-gray-400" />;
    };

    return (
        <div 
            onClick={() => onClick(notification)}
            className={`flex items-start gap-4 p-4 border-b border-gray-100 cursor-pointer transition-colors ${isUnread ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
        >
            <div className="mt-1 shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <p className={`text-xs leading-relaxed ${isUnread ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {data.message || 'Pemberitahuan Baru'}
                    </p>
                    {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: id })}
                    </p>
                    {data.transaction_id && (
                        <span className="text-[9px] text-gray-300 font-bold tracking-tighter">
                            #{data.reference_number || data.transaction_id}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
