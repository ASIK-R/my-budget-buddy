import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  minColumnWidth = '120px',
  maxColumnWidth = '1fr',
  gap = '0.5rem',
  responsive = true,
  breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  columnCounts = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 4,
    xl: 5
  },
  ...props 
}) => {
  // Generate responsive grid styles
  const gridStyle = useMemo(() => {
    if (!responsive) {
      return {
        gridTemplateColumns: `repeat(${columnCounts.md}, minmax(0, 1fr))`,
        gap: gap
      };
    }

    // Create responsive grid with container queries
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}, ${maxColumnWidth}))`,
      gap: gap
    };
  }, [minColumnWidth, maxColumnWidth, gap, responsive, columnCounts]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div 
        className="grid"
        style={gridStyle}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ResponsiveGrid;