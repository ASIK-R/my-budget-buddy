import { HomeIcon, WalletIcon, ArrowsRightLeftIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/outline';

const icons = {
  dashboard: HomeIcon,
  wallets: WalletIcon,
  transactions: ArrowsRightLeftIcon,
  reports: ChartBarIcon,
  goals: TrophyIcon,
};

export default function MobileNav({ navItems, currentSlide, onSlideChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 py-2">
      <div className="container mx-auto px-2">
        <div className="flex justify-around">
          {navItems.map((item, index) => {
            const Icon = icons[item.id] || HomeIcon;
            const isActive = currentSlide === index;
            
            return (
              <button
                key={item.id}
                onClick={() => onSlideChange(index)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                  isActive 
                    ? 'text-brand-accent bg-white/30 dark:bg-gray-700/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-brand-accent'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}