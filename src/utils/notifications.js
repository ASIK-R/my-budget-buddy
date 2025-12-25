/**
 * Notification Utility Functions
 *
 * This file contains utility functions for managing notifications in the app.
 * These functions help generate, store, and manage user notifications.
 */

// Generate a unique ID for notifications
export const generateNotificationId = () => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if a notification already exists to prevent duplicates
export const notificationExists = (existingNotifications, newNotification) => {
  return existingNotifications.some(
    notification =>
      notification.type === newNotification.type &&
      notification.category === newNotification.category &&
      notification.message === newNotification.message
  );
};

// Format notification timestamp
export const formatNotificationTime = timestamp => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return notificationTime.toLocaleDateString();
};

// Get priority level based on notification type and content
export const getNotificationPriority = notification => {
  // High priority for critical alerts
  if (notification.type === 'budget' && notification.percentage >= 100) return 'high';
  if (notification.type === 'wallet' && notification.balance < 50) return 'high';

  // Medium priority for warnings
  if (notification.type === 'budget' && notification.percentage >= 90) return 'medium';
  if (notification.type === 'wallet' && notification.balance < 100) return 'medium';
  if (notification.type === 'transaction' && notification.amount > 1000) return 'medium';
  if (notification.type === 'recurring') return 'medium';

  // Low priority for informational
  return 'low';
};

// Get appropriate icon for notification type
export const getNotificationIcon = type => {
  const icons = {
    budget: 'Target',
    transaction: 'DollarSign',
    wallet: 'Wallet',
    recurring: 'Repeat',
    goal: 'TrendingUp',
    system: 'Settings',
  };
  return icons[type] || 'Bell';
};

// Filter notifications based on user preferences
export const filterNotifications = (notifications, preferences) => {
  return notifications.filter(notification => {
    // If user has disabled this type of notification, filter it out
    if (preferences[notification.type] === false) return false;

    // If user has set priority filter, only show notifications with that priority or higher
    if (preferences.minPriority) {
      const priorityLevels = { low: 1, medium: 2, high: 3 };
      return priorityLevels[notification.priority] >= priorityLevels[preferences.minPriority];
    }

    return true;
  });
};

// Group notifications by date
export const groupNotificationsByDate = notifications => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  notifications.forEach(notification => {
    const notificationDate = new Date(notification.timestamp);

    if (notificationDate.toDateString() === today.toDateString()) {
      groups.today.push(notification);
    } else if (notificationDate.toDateString() === yesterday.toDateString()) {
      groups.yesterday.push(notification);
    } else if (notificationDate > oneWeekAgo) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};
