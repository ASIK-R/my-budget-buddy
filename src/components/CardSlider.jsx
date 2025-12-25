import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

const CardSlider = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsToShow = window.innerWidth >= 1024 ? 2 : 1; // Show 2 cards on desktop, 1 on mobile

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || cards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, cards.length]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset index when screen size changes significantly
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getIconComponent = (type) => {
    switch (type) {
      case 'sales':
        return <TrendingUp size={16} />;
      case 'profit':
        return <TrendingUp size={16} />;
      case 'customers':
        return <TrendingUp size={16} />;
      case 'growth':
        return <TrendingUp size={16} />;
      case 'downloads':
        return <TrendingUp size={16} />;
      case 'views':
        return <TrendingUp size={16} />;
      case 'shares':
        return <TrendingUp size={16} />;
      case 'likes':
        return <TrendingUp size={16} />;
      case 'comments':
        return <TrendingUp size={16} />;
      case 'messages':
        return <TrendingUp size={16} />;
      case 'notifications':
        return <TrendingUp size={16} />;
      case 'tasks':
        return <TrendingUp size={16} />;
      case 'projects':
        return <TrendingUp size={16} />;
      case 'leads':
        return <TrendingUp size={16} />;
      case 'subscribers':
        return <TrendingUp size={16} />;
      case 'emails':
        return <TrendingUp size={16} />;
      case 'calls':
        return <TrendingUp size={16} />;
      case 'meetings':
        return <TrendingUp size={16} />;
      case 'appointments':
        return <TrendingUp size={16} />;
      case 'events':
        return <TrendingUp size={16} />;
      case 'reminders':
        return <TrendingUp size={16} />;
      case 'alerts':
        return <TrendingUp size={16} />;
      case 'errors':
        return <TrendingUp size={16} />;
      case 'warnings':
        return <TrendingUp size={16} />;
      case 'info':
        return <TrendingUp size={16} />;
      case 'success':
        return <TrendingUp size={16} />;
      case 'danger':
        return <TrendingUp size={16} />;
      case 'primary':
        return <TrendingUp size={16} />;
      case 'secondary':
        return <TrendingUp size={16} />;
      case 'accent':
        return <TrendingUp size={16} />;
      case 'light':
        return <TrendingUp size={16} />;
      case 'dark':
        return <TrendingUp size={16} />;
      default:
        return <TrendingUp size={16} />;
    }
  };

  const getIconBgClass = (type) => {
    switch (type) {
      case 'sales':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'profit':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'customers':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'growth':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'downloads':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'views':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'shares':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'likes':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'comments':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'messages':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'notifications':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'tasks':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'projects':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'leads':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'subscribers':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'emails':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'calls':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'meetings':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'appointments':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'events':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'reminders':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'alerts':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'errors':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warnings':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'info':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'danger':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'primary':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'secondary':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'accent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'light':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'dark':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
        >
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 px-1"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-full card-mobile transition-all duration-300 hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 md:p-3 rounded-lg ${getIconBgClass(card.type)}`}>
                    {getIconComponent(card.type)}
                  </div>
                  {card.trend && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                      card.trend > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {card.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="ml-1">{Math.abs(card.trend)}%</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg md:text-xl mb-2">
                  {card.title}
                </h3>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {card.value}
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows for Desktop */}
      {cards.length > itemsToShow && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)}
            className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % cards.length)}
            className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}
      
      {/* Navigation Dots */}
      {cards.length > itemsToShow && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(cards.length - itemsToShow + 1) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-[#076653] dark:bg-[#076653]' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSlider;