import { motion } from 'framer-motion';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  padding = 'p-responsive',
  maxWidth = 'max-w-7xl',
  center = true,
  ...props 
}) => {
  const baseClasses = 'w-full mx-auto';
  
  const paddingClasses = padding;
  const maxWidthClasses = maxWidth;
  const centerClasses = center ? 'mx-auto' : '';
  
  const combinedClasses = `${baseClasses} ${paddingClasses} ${maxWidthClasses} ${centerClasses} ${className}`;
  
  return (
    <motion.div
      className={combinedClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ResponsiveContainer;