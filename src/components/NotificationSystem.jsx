import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Optimized Notification System - Less intrusive notifications
 * Shows a subtle indicator for new notifications instead of full popups
 */
const NotificationSystem = () => {
  const { notifications, markNotificationAsRead } = useAppContext();

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-dismiss notifications after a shorter time to reduce intrusiveness
  useEffect(() => {
    const timers = notifications
      .filter(notification => !notification.read)
      .map(
        notification =>
          setTimeout(() => {
            markNotificationAsRead(notification.id);
          }, 3000) // Reduced from 5 seconds to 3 seconds
      );

    // Cleanup timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, markNotificationAsRead]);

  // For a less intrusive experience, we'll show a subtle indicator
  // instead of full popup notifications
  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-[#076653] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#076653]/90 transition-colors"
        onClick={() => {
          // Navigate to notifications page (we'll handle this in the parent component)
          window.dispatchEvent(new CustomEvent('showNotifications'));
        }}
      >
        <span className="font-medium">{unreadCount > 9 ? '9+' : unreadCount}</span>
      </motion.div>
    </div>
  );
};

export default NotificationSystem;
