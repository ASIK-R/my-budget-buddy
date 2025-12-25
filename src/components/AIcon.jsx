const AIcon = ({ size = 20, className = '', ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      {...props}
    >
      <path d="M17 4L7 20M7 4L17 20" />
    </svg>
  );
};

export default AIcon;