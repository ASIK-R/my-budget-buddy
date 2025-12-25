# Expense Tracker Application

A comprehensive financial management application built with React, Vite, and Tailwind CSS. This application helps users track their expenses, manage budgets, plan finances, and gain insights into their spending patterns.

## Features

### Core Functionality (Phase 1 - Locked)
- **Wallets**: Track multiple accounts/wallets with different types (Bank, Cash, Mobile Wallet, Credit/Debit Card)
- **Transactions**: Add, edit, and categorize income and expense transactions
- **Transfers**: Move money between accounts with linked debit/credit records
- **Reports**: Generate comprehensive financial reports

### Advanced Features (Inactive/Future)
- **Budget Planning**: Set and monitor budgets for different categories
- **Financial Analytics**: Detailed insights and visualizations of spending patterns
- **Goal Setting**: Define and track financial goals
- **Recurring Transactions**: Automate regular income and expense entries
- **AI-Powered Insights**: Intelligent analysis of financial data to provide actionable insights
- **Investment Tracking**: Monitor investment portfolios and performance
- **Shared Accounts**: Collaborate on shared finances with family or roommates
- **Mobile-First Design**: Fully responsive interface optimized for mobile devices
- **Offline Support**: Continue using the app even when offline

### User Experience
- **One Primary Action Per Page**: Reduce decision-making per screen
- **Default Categories**: Pre-filled for common expenses
- **Progressive Disclosure**: Advanced options hidden by default
- **Monthly Context**: Default time range instead of all-time
- **Undo Capability**: Ability to undo recent transactions
- **Dark/Light Mode**: Switch between color schemes based on preference
- **Haptic Feedback**: Enhanced touch interactions on mobile devices
- **Smooth Animations**: Framer Motion powered UI transitions
- **Touch-Optimized Controls**: Large touch targets and intuitive gestures

## Technology Stack

- **Frontend**: React 18+ with hooks and context API
- **Build Tool**: Vite for fast development and builds
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date operations
- **Charts**: Chart.js with React wrappers for data visualization
- **State Management**: React Context API with custom hooks
- **Routing**: React Router DOM for navigation
- **Backend**: Supabase for authentication, real-time database, and storage

## Architecture

### Components Structure
- **Layout Components**: Main layout, sidebar navigation, bottom navigation
- **UI Components**: Cards, forms, modals, transaction tables
- **Context Providers**: App context for global state management
- **Utility Hooks**: Custom hooks for haptic feedback, performance optimizations

### Data Model & Management
- **Canonical Schemas**: Strict transaction schemas with `transaction_group_id` for transfers
- **Immutable Records**: Transaction records cannot be modified after creation
- **Derived Balances**: Wallet balances calculated from transactions, not manually editable
- **Local Storage**: Persistent storage for offline data
- **Supabase Integration**: Backend services for authentication and real-time data sync
- **Conflict Resolution**: Timestamp-based resolution with user-visible conflict warnings
- **Sync Rules**: Local always wins, cloud reconciles later with visible status indicator

### Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices first
- **Desktop Enhancements**: Additional features and layouts for larger screens
- **Safe Area Handling**: Proper handling of mobile device notches and home indicators

## Key Pages

- **Dashboard**: Overview of financial health with key metrics
- **Transactions**: Detailed list of all income and expenses
- **Wallets**: Management of multiple accounts and transfers
- **Budgets**: Budget creation and tracking
- **Analytics**: Deep insights into spending patterns
- **Financial Planning**: Long-term financial goal planning
- **Investments**: Portfolio tracking and performance analysis
- **Goals**: Financial objective tracking
- **Reports**: Comprehensive financial reporting
- **Profile**: User account management
- **Settings**: App configuration and preferences

### Performance Strategy
- **Virtualized Transaction Lists**: For smooth scrolling of large datasets
- **Chart Memoization**: By month to prevent unnecessary recalculations
- **Background Sync**: Using idle time to sync data
- **Debounced Writes**: For rapid transaction entry
- **Mobile Optimizations**:
  - Minimum 44px touch targets for easy interaction
  - Swipe gestures for navigation and actions
  - Bottom navigation bar for easy thumb access
  - Responsive design that adapts to different screen sizes

## Security & Privacy

- **Authentication**: Secure login with Supabase
- **Data Encryption**: Sensitive data protection
- **Privacy Controls**: User control over data sharing

## Trust Signals

- **Data Status Indicator**: "Data saved locally" indicator always visible
- **Export Functionality**: Manual export button always accessible
- **Undo Capability**: Ability to undo last transaction
- **Demo Mode**: Read-only mode for safe exploration

## Developer Experience

- **Centralized Data Access**: All data access through centralized layer
- **No Direct DB Access**: Components cannot access DB directly
- **Strict TypeScript Types**: Full type safety implemented
- **Feature Flags**: Advanced modules controlled by flags

## Architecture Principles

- **Scope Discipline**: Core features locked for Phase 1
- **Data Integrity**: Immutable records and derived balances
- **Offline-First**: Local-first approach with sync reconciliation
- **Performance by Design**: Optimized for low-end devices

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables for Supabase (if using backend features):
   - Get your Supabase URL and anon key from your Supabase dashboard
   - Update the `.env` file with your credentials
   - Run the SQL schema from `SUPABASE_SCHEMA.sql` in your Supabase SQL editor
4. Start the development server: `npm run dev`

## Contributing

This project welcomes contributions. Please follow the established code style and submit pull requests for review.

## Key Architectural Decisions

1. **Phase 1 Scope Freeze**: Only Wallets, Transactions, Transfers, and Reports are active
2. **Data Contract Strictness**: Immutable transactions with derived balances
3. **Offline-First Rules**: Local always wins, cloud reconciles with conflict warnings
4. **Performance Strategy**: Virtualized lists, memoized charts, debounced writes
5. **Trust Building**: Visible sync status, export options, undo capability

## License

This project is licensed under the MIT License - see the LICENSE file for details.