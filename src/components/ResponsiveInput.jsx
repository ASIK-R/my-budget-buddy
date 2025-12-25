import { motion } from 'framer-motion';

const ResponsiveInput = ({ 
  label, 
  className = '', 
  error,
  helperText,
  fullWidth = false,
  mobileFriendly = true,
  ...props 
}) => {
  const baseClasses = mobileFriendly 
    ? 'form-input w-responsive rounded-responsive transition-all text-primary min-h-[44px] text-base sm:text-lg' 
    : 'form-input w-responsive rounded-responsive transition-all text-primary';
  
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500/20 focus:border-primary-500';
  
  const fullWidthClasses = fullWidth ? 'w-full' : '';
  
  const combinedClasses = `${baseClasses} ${errorClasses} ${fullWidthClasses} ${className}`;
  
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm sm:text-base font-medium mb-2 text-primary">
          {label}
        </label>
      )}
      <input
        className={combinedClasses}
        {...props}
      />
      {helperText && (
        <p className={`mt-2 text-xs sm:text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-tertiary'}`}>
          {helperText}
        </p>
      )}
    </motion.div>
  );
};

export default ResponsiveInput;