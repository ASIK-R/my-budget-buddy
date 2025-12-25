// Utility functions for consistent icon styling across the application
export const getIconClass = (isActive = false, isHover = false) => {
  const brandColor = '#076653'; // Dark teal brand color from theme.js
  
  if (isActive) {
    return `text-[${brandColor}]`;
  }
  
  if (isHover) {
    return `hover:text-[${brandColor}]`;
  }
  
  return '';
};

export const getBrandIconClass = (isActive = false, isHover = false) => {
  const brandColor = '#076653'; // Dark teal brand color from theme.js
  
  if (isActive) {
    return `text-[${brandColor}]`;
  }
  
  if (isHover) {
    return `hover:text-[${brandColor}]`;
  }
  
  return '';
};

// Apply brand color to icons with liquid glass effect
export const applyBrandStyling = (iconElement, isActive = false, isHover = false) => {
  const brandColor = '#076653';
  
  // Liquid glass effect classes
  const liquidGlassClasses = 'backdrop-blur-sm border border-opacity-20 rounded-lg';
  
  if (isActive) {
    return `${liquidGlassClasses} text-[${brandColor}] border-[${brandColor}] bg-[${brandColor}] bg-opacity-10`;
  }
  
  if (isHover) {
    return `${liquidGlassClasses} hover:text-[${brandColor}] hover:border-[${brandColor}] hover:bg-[${brandColor}] hover:bg-opacity-5`;
  }
  
  return liquidGlassClasses;
};

export default {
  getBrandIconClass,
  applyBrandStyling
};