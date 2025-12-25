import { motion } from 'framer-motion';

const ResponsiveButton = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'btn transition-responsive rounded-responsive font-semibold transition-all cursor-pointer border-none flex items-center justify-center';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-primary',
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:shadow-lg active:scale-95';
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  // Ensure minimum touch target size for mobile
  const buttonStyle = {
    minHeight: '44px',
    minWidth: size === 'sm' ? '44px' : size === 'lg' ? '56px' : '48px',
    ...props.style
  };
  
  return (
    <motion.button
      className={combinedClasses}
      style={buttonStyle}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="mr-2" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} className="ml-2" />
      )}
    </motion.button>
  );
};

export default ResponsiveButton;