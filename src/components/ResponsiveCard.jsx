import { motion } from 'framer-motion';
import { useState } from 'react';

const ResponsiveCard = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  actions,
  collapsible = false,
  defaultCollapsed = false,
  responsivePadding = true,
  ...props 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <motion.div
      className={`rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/60 p-3 sm:p-4 md:p-5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex gap-1.5 sm:gap-2 flex-wrap mt-1.5 sm:mt-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {collapsible ? (
        <div className="pt-1.5 sm:pt-2">
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
          {collapsible && (
            <button
              onClick={toggleCollapse}
              className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#076653] hover:underline font-medium"
            >
              {isCollapsed ? 'Show More' : 'Show Less'}
            </button>
          )}
        </div>
      ) : (
        <div className="pt-1">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default ResponsiveCard;