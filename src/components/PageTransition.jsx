import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Enhanced card animation with more sophisticated effects
const enhancedCardVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      mass: 1,
      duration: 0.3,
    },
  },
  hover: {
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const PageTransition = memo(({ children }) => {
  const location = useLocation();

  // Memoize the key to prevent unnecessary re-renders
  const locationKey = useMemo(
    () => location.key || location.pathname,
    [location.key, location.pathname]
  );

  return (
    <motion.div
      key={locationKey}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full"
    >
      {children}
    </motion.div>
  );
});

export const CardAnimation = memo(({ children, delay = 0 }) => {
  // Reduce animation duration on mobile for better performance
  const isMobile = window.innerWidth < 768;
  const animationDuration = isMobile ? 0.2 : 0.25;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{
        delay: isMobile ? delay * 0.7 : delay,
        duration: animationDuration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      // Optimize for mobile performance
      whileHover={isMobile ? {} : { y: -2 }}
    >
      {children}
    </motion.div>
  );
});

// Enhanced card component with hover and tap effects
export const EnhancedCard = memo(({ children, className = '', delay = 0, ...props }) => {
  return (
    <motion.div
      className={`card ${className}`}
      variants={enhancedCardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ delay, duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// Staggered list animation
export const StaggeredList = memo(({ children, className = '', staggerDelay = 0.05 }) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
});

// Staggered list item
export const StaggeredItem = memo(({ children, className = '', ...props }) => {
  return (
    <motion.div className={className} variants={cardVariants} {...props}>
      {children}
    </motion.div>
  );
});

export default PageTransition;
