import { useEffect, useState } from 'react';
import performanceMonitor, { getMemoryUsage } from '../utils/performanceMonitor';

const PerformanceMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    // Monitor memory usage in development mode
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const memory = getMemoryUsage();
        setMemoryInfo(memory);
        
        // Get FPS metric
        const fpsMetric = performanceMonitor.getMetric('fps');
        if (fpsMetric) {
          setFps(fpsMetric);
        }
      }, 1000); // Every second for more responsive updates

      return () => clearInterval(interval);
    }
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg z-50 space-y-1">
      <div className="font-bold">Performance Monitor</div>
      {memoryInfo && (
        <div>
          <div>Memory: {memoryInfo.used} MB / {memoryInfo.total} MB</div>
          <div>Limit: {memoryInfo.limit} MB</div>
        </div>
      )}
      <div>FPS: {fps}</div>
      <div className="text-xs opacity-75">Dev Mode</div>
    </div>
  );
};

export default PerformanceMonitor;