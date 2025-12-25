import { format, isThisMonth, isThisWeek, isToday, parseISO } from 'date-fns';
import { Bell, Calendar, DollarSign, Target, Wallet, X, AlertTriangle, CheckCircle, XCircle, Info, Trash2, Eye, EyeOff, Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Notifications = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const markAsRead = id => {
    markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const clearAll = () => {
    deleteAllNotifications();
  };

  const filteredNotifications = useMemo(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    if (filter === 'all') return list;
    if (filter === 'unread') return list.filter(n => !n.read);
    return list.filter(n => n.type === filter);
  }, [notifications, filter]);

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const formatTime = timestamp => {
    let date;
    if (typeof timestamp === 'string') {
      try {
        date = parseISO(timestamp);
      } catch (e) {
        date = new Date(timestamp);
      }
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      // Fallback to current time if timestamp is invalid/undefined
      date = new Date();
    }

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isThisWeek(date)) {
      return format(date, 'EEE h:mm a');
    } else if (isThisMonth(date)) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div className="p-responsive w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
          {/* Mobile-specific spacing adjustments */}
          <div class="sm:hidden mt-16"></div>
      <div className="sm:hidden mt-16"></div>
      
      {/* Modern Header with Gradient Background */}
      <div className="rounded-2xl bg-gradient-to-r from-[#076653]/10 to-[#076653]/5 p-5 sm:p-6 md:p-7 backdrop-blur-sm border border-[#076653]/20 dark:border-[#076653]/10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#076653]/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#076653]/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-300">Stay updated with your financial activities and alerts</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-[#076653]/10 text-[#076653] dark:text-[#076653] rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  unreadCount === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-[#076653] text-white hover:bg-[#076653]/90'
                }`}
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                disabled={(Array.isArray(notifications) ? notifications.length === 0 : true)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                  (Array.isArray(notifications) ? notifications.length === 0 : true)
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50'
                }`}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters with Modern Design */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            filter === 'all'
              ? 'bg-[#076653] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            filter === 'unread'
              ? 'bg-[#076653] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('budget')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            filter === 'budget'
              ? 'bg-[#076653] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Budget Alerts
        </button>
        <button
          onClick={() => setFilter('transaction')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            filter === 'transaction'
              ? 'bg-[#076653] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setFilter('wallet')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            filter === 'wallet'
              ? 'bg-[#076653] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Wallet Alerts
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/60 p-5 sm:p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg text-center">
          <Bell className="mx-auto text-gray-400" size={48} />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-4 sm:mt-5 md:mt-6">
            No notifications
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 md:mt-4">
            You're all caught up! Check back later for new alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {filteredNotifications.map(notification => {
            const Icon =
              notification.type === 'budget'
                ? Target
                : notification.type === 'transaction'
                  ? DollarSign
                  : notification.type === 'wallet'
                    ? Wallet
                    : notification.type === 'recurring'
                      ? Calendar
                      : Bell;

            return (
              <div
                key={notification.id}
                className={`rounded-xl p-4 sm:p-5 backdrop-blur-sm border-l-4 border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
                  notification.read
                    ? 'bg-white/50 dark:bg-gray-800/40'
                    : 'bg-white/80 dark:bg-gray-800/60 border-l-[#076653]'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2 rounded-lg ${
                    notification.read
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-[#076653]/10 text-[#076653] dark:text-[#076653]'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        notification.read
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-[#076653]"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;