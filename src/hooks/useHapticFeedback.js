/**
 * Custom hook for haptic feedback
 * Provides a consistent way to trigger haptic feedback across the application
 */

const useHapticFeedback = () => {
  /**
   * Trigger haptic feedback with different patterns
   * @param {string} type - Type of haptic feedback ('tap', 'success', 'error')
   */
  const triggerHapticFeedback = (type = 'tap') => {
    // Check if the device supports haptic feedback
    if (typeof window !== 'undefined' && navigator.vibrate) {
      switch (type) {
        case 'tap':
          // Short tap for button presses and interactions
          navigator.vibrate(15);
          break;
        case 'success':
          // Triple tap for successful actions
          navigator.vibrate([15, 15, 15]);
          break;
        case 'error':
          // Longer vibration for errors
          navigator.vibrate([100, 50, 100]);
          break;
        default:
          // Default tap
          navigator.vibrate(15);
      }
    }
  };

  return { triggerHapticFeedback };
};

export default useHapticFeedback;