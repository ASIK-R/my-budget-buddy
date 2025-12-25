# Notification System Documentation

## Overview

The Expense Tracker app now includes a comprehensive notification system that provides users with timely alerts about their financial activities. This system automatically generates notifications based on user data and preferences.

## Features

### 1. Automatic Notification Generation

- **Budget Alerts**: Notifies when spending reaches 90% or more of budget limits
- **Large Transaction Alerts**: Alerts for transactions above a customizable threshold
- **Low Balance Alerts**: Warns when wallet balances fall below a set amount
- **Recurring Transaction Reminders**: Notifies before recurring transactions are due

### 2. Notification Management

- **Mark as Read**: Users can mark individual notifications as read
- **Mark All as Read**: Option to mark all notifications as read at once
- **Clear All**: Remove all notifications from the list
- **Filtering**: Filter notifications by type or read status

### 3. Notification Types

- **Budget Notifications**: Related to budget limits and spending
- **Transaction Notifications**: Related to individual transactions
- **Wallet Notifications**: Related to wallet balances
- **Recurring Notifications**: Related to recurring transactions

### 4. Priority Levels

- **High**: Critical alerts requiring immediate attention
- **Medium**: Important notifications that should be reviewed
- **Low**: Informational notifications

## Implementation Details

### Components

1. **Notifications Page** (`src/pages/Notifications.jsx`)
   - Main interface for viewing and managing notifications
   - Includes filtering and management controls

2. **Notification Hook** (`src/hooks/useNotifications.js`)
   - Custom hook that automatically generates notifications
   - Monitors user data for changes and creates appropriate alerts

3. **Notification Utilities** (`src/utils/notifications.js`)
   - Helper functions for notification management
   - ID generation, duplicate checking, formatting, etc.

4. **Context Integration** (`src/context/AppContext.jsx`)
   - Centralized notification storage and management
   - Functions for adding, updating, and clearing notifications

### Data Flow

1. User data changes (transactions, budgets, wallets)
2. `useNotifications` hook detects changes
3. Appropriate notifications are generated based on rules
4. Notifications are stored in AppContext
5. Notifications page displays all alerts
6. Users can interact with notifications (mark read, clear, etc.)

## Configuration

### Settings

The notification system can be configured through the Settings page:

- **Enable/Disable Notifications**: Toggle all notifications on/off
- **Budget Alerts**: Enable budget-related notifications
- **Transaction Confirmations**: Enable transaction confirmation alerts
- **Weekly Reports**: Enable weekly summary notifications
- **Large Transaction Alerts**: Enable alerts for large transactions
- **Thresholds**: Customize amount thresholds for alerts

### Default Thresholds

- **Large Transaction**: $500
- **Low Balance**: $100

These can be adjusted in the Settings page.

## Technical Architecture

### Notification Structure

Each notification includes:

```javascript
{
  id: string,           // Unique identifier
  type: string,         // Type of notification (budget, transaction, etc.)
  title: string,        // Short title
  message: string,      // Detailed message
  amount: number,       // Associated amount (if applicable)
  category: string,     // Associated category (if applicable)
  priority: string,     // Priority level (high, medium, low)
  timestamp: string,    // When the notification was created
  read: boolean         // Whether the notification has been read
}
```

### Integration Points

1. **AppContext**: Central storage and management
2. **Bottom Navigation**: Badge showing unread count
3. **Settings Page**: Configuration options
4. **Desktop Slider**: Navigation to Notifications page
5. **Mobile Router**: Direct access via /notifications route

## Testing

The notification system includes comprehensive tests in `src/utils/testNotifications.js`:

- Notification ID generation
- Duplicate detection
- Time formatting
- Priority calculation

To run tests:

```javascript
import { runAllTests } from './utils/testNotifications'
runAllTests()
```

## Future Enhancements

Planned improvements:

1. Push notification support
2. Email/SMS notification options
3. Custom notification rules
4. Notification scheduling
5. Integration with external services
