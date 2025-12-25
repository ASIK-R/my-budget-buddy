/**
 * Performance optimization utilities for the Expense Tracker application
 */

// Debounce function to limit the rate at which a function is called
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Throttle function to limit the rate at which a function is called
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization function for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Function to measure component render time
export const measureRenderTime = (componentName, fn) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${componentName} render time: ${end - start}ms`);
    return result;
  }
  return fn();
};

// Virtual scrolling helper for large lists
export const virtualScroll = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    visibleItems: items.slice(startIndex, endIndex),
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight
  };
};

// Lazy loading image component helper
export const lazyLoadImage = (imgElement, src, placeholderSrc = '') => {
  const img = new Image();
  img.src = src;
  
  img.onload = () => {
    imgElement.src = src;
    imgElement.classList.remove('loading');
  };
  
  img.onerror = () => {
    if (placeholderSrc) {
      imgElement.src = placeholderSrc;
    }
    imgElement.classList.remove('loading');
  };
  
  if (placeholderSrc) {
    imgElement.src = placeholderSrc;
  }
  imgElement.classList.add('loading');
};

// Intersection Observer for lazy loading components
export const createIntersectionObserver = (callback, options = {}) => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '100px',
      ...options
    });
  }
  return null;
};

// Prefetch component for route optimization
export const prefetchRoute = (route) => {
  // In a real implementation, this would prefetch route data
  console.log(`Prefetching route: ${route}`);
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`);
  }
};

// Animation frame throttling
export const requestAnimationFrameThrottle = (fn) => {
  let scheduled = false;
  return (...args) => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        fn(...args);
      });
    }
  };
};