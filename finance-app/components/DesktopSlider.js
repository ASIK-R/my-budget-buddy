import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DesktopSlider({ navItems, currentSlide, onSlideChange, children }) {
  const [direction, setDirection] = useState(0);

  // Handle navigation click
  const handleNavClick = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    onSlideChange(index);
  };

  // Slide variants for animation
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="flex space-x-1 mb-8">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentSlide === index
                ? 'bg-gradient-1 text-brand-dark shadow-md'
                : 'text-brand-dark hover:bg-white/50 dark:text-white dark:hover:bg-gray-700/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[500px]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}