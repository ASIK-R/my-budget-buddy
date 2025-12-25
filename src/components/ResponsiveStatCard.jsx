import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ResponsiveStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-primary',
  valueColor = 'text-primary',
  className = '',
  trend = 0,
  trendLabel = '',
  bgColor = '',
  textColor = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-md sm:shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 ${bgColor} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs sm:text-sm font-semibold ${textColor || 'text-gray-500 dark:text-gray-400'}`}>{title}</p>
          <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 ${valueColor}`}>{value}</h3>
          {trend !== 0 && (
            <div className="flex items-center mt-1.5 sm:mt-2">
              {trend > 0 ? (
                <TrendingUp 
                  size={14} 
                  className="text-green-500 mr-1 sm:size-16" 
                />
              ) : (
                <TrendingDown 
                  size={14} 
                  className="text-red-500 mr-1 sm:size-16" 
                />
              )}
              <span className={`text-[0.65rem] sm:text-xs ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(trend).toFixed(1)}% {trendLabel}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2 sm:p-3 rounded-lg ${iconColor}`}>
            {typeof Icon === 'function' ? <Icon size={20} className="sm:size-24" /> : Icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResponsiveStatCard;