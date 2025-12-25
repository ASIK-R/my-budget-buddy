import { motion } from 'framer-motion';

const ResponsiveHeader = ({ 
  title, 
  subtitle, 
  actions,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`header-responsive ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          {title && (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex gap-2 sm:gap-3">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResponsiveHeader;