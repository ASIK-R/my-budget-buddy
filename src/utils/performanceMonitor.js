/**
 * Performance monitoring utility for tracking application performance metrics
 */

// Performance monitoring class
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTime = new Map();
  }

  // Start timing a specific operation
  start(name) {
    this.startTime.set(name, performance.now());
  }

  // End timing and record the metric
  end(name) {
    const startTime = this.startTime.get(name);
    if (startTime !== undefined) {
      const duration = performance.now() - startTime;
      this.metrics.set(name, duration);
      this.startTime.delete(name);
      return duration;
    }
    return null;
  }

  // Record a specific metric value
  record(name, value) {
    this.metrics.set(name, value);
  }

  // Get a specific metric
  getMetric(name) {
    return this.metrics.get(name);
  }

  // Get all metrics
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clear() {
    this.metrics.clear();
    this.startTime.clear();
  }

  // Log all metrics to console
  log() {
    console.table(this.getAllMetrics());
  }

  // Get performance report
  getReport() {
    const metrics = this.getAllMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      summary: {
        totalOperations: Object.keys(metrics).length,
        averageDuration: Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length || 0
      }
    };
    return report;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Utility functions for common performance monitoring tasks

// Measure function execution time
export const measureFunction = (fn, name) => {
  return function(...args) {
    performanceMonitor.start(name);
    const result = fn.apply(this, args);
    performanceMonitor.end(name);
    return result;
  };
};

// Measure async function execution time
export const measureAsyncFunction = (fn, name) => {
  return async function(...args) {
    performanceMonitor.start(name);
    const result = await fn.apply(this, args);
    performanceMonitor.end(name);
    return result;
  };
};

// Monitor component render time
export const monitorRenderTime = (componentName) => {
  performanceMonitor.start(`${componentName}_render`);
  return () => {
    performanceMonitor.end(`${componentName}_render`);
  };
};

// Monitor network request time
export const monitorNetworkRequest = (url) => {
  performanceMonitor.start(`network_${url}`);
  return () => {
    performanceMonitor.end(`network_${url}`);
  };
};

// Get memory usage information
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};

// Monitor FPS (frames per second)
export const monitorFPS = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;

  const calculateFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
    }
    performanceMonitor.record('fps', fps);
    requestAnimationFrame(calculateFPS);
  };

  requestAnimationFrame(calculateFPS);
  return fps;
};

export default performanceMonitor;