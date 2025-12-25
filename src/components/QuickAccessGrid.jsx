import React from 'react';
import { motion } from 'framer-motion';
import useHapticFeedback from '../hooks/useHapticFeedback.js';

const QuickAccessGrid = ({ items = [], onNavigate = () => {} }) => {
  const { triggerHapticFeedback } = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => {
              onNavigate(item.path);
              triggerHapticFeedback('tap');
            }}
            className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 touch-target card-mobile"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl mb-2">
              {item.icon}
            </div>
            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 text-center">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickAccessGrid;