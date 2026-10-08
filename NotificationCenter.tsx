import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Video, 
  FileText, 
  Star, 
  Sparkles, 
  Clock, 
  Trash2, 
  ChevronRight,
  Crown,
  AlertCircle
} from 'lucide-react';
import { AppNotification, UserRole } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentRole: UserRole;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: AppNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications = [],
  currentRole,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const safeNotifs = Array.isArray(notifications) ? notifications : [];

  const relevantNotifications = safeNotifs.filter(n => 
    n.recipientRole === currentRole || n.recipientRole === 'all'
  );

  const filteredNotifications = relevantNotifications.filter(n => 
    filter === 'unread' ? !n.read : true
  );

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'question_solved':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
        );
      case 'question_in_progress':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        );
      case 'new_question_available':
        return (
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
        );
      case 'rating_received':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
        );
      case 'subscription_updated':
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">Bildirim Merkezi</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {unreadCount} Yeni
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {currentRole === 'student' ? 'Çözüm ve soru bildirimleriniz' : 'Gelen sorular ve öğrenci puanları'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Mark All Read Row */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'all' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Tümü ({relevantNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md transition ${filter === 'unread' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Okunmamış ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Tümünü Oku
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">Bildiriminiz bulunmuyor</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Sorularınız çözüldüğünde veya yeni soru geldiğinde buradan anlık bildirim alacaksınız.
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => {
                  onMarkAsRead(notification.id);
                  onNotificationClick(notification);
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 relative group ${
                  notification.read
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-indigo-50/40 border-indigo-200 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                {/* Unread indicator dot */}
                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-3.5 right-3.5"></span>
                )}

                {getNotificationIcon(notification.type)}

                <div className="flex-1 space-y-1 pr-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {notification.createdAt}
                    </span>
                    <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                      Görüntüle <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Anlık bildirimler otomatik olarak güncellenir.
        </div>
      </div>
    </div>
  );
};
