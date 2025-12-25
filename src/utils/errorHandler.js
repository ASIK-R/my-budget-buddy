/**
 * Utility functions for consistent error handling across the application
 */

/**
 * Creates a standardized error object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Error} Standardized error object
 */
export const createError = (message, code = 'UNKNOWN_ERROR', details = {}) => {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.timestamp = new Date().toISOString();
  return error;
};

/**
 * Formats an error for display to the user
 * @param {Error|string} error - Error object or message
 * @returns {string} Formatted error message
 */
export const formatError = error => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.code) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Network connection failed. Please check your internet connection.';
        case 'VALIDATION_ERROR':
          return `Validation failed: ${error.message}`;
        case 'AUTH_ERROR':
          return 'Authentication failed. Please try logging in again.';
        case 'PERMISSION_ERROR':
          return 'You do not have permission to perform this action.';
        case 'NOT_FOUND':
          return 'The requested resource was not found.';
        case 'SERVER_ERROR':
          return 'Server error occurred. Please try again later.';
        default:
          return error.message || 'An unknown error occurred.';
      }
    }

    return error.message || 'An unknown error occurred.';
  }

  return 'An unknown error occurred.';
};

/**
 * Logs an error with context
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context, additionalData = {}) => {
  console.error(`[${context}]`, error, additionalData);

  // In production, you might want to send this to an error reporting service
  // Example: Sentry.captureException(error, { contexts: { context, ...additionalData } })
};

/**
 * Handles an error by logging it and optionally showing a notification
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @param {Function} addNotification - Function to add a notification (from useApp)
 * @param {Object} additionalData - Additional data to log
 */
export const handleError = (error, context, addNotification = null, additionalData = {}) => {
  logError(error, context, additionalData);

  if (addNotification) {
    const formattedMessage = formatError(error);

    addNotification({
      type: 'error',
      title: 'Error',
      message: formattedMessage,
      priority: 'high',
    });
  }
};

/**
 * Wraps an async function with error handling
 * @param {Function} asyncFunction - Async function to wrap
 * @param {string} context - Context for error logging
 * @param {Function} addNotification - Function to add a notification (from useApp)
 * @returns {Function} Wrapped function
 */
export const withErrorHandling = (asyncFunction, context, addNotification = null) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      handleError(error, context, addNotification);
      throw error; // Re-throw so caller can handle if needed
    }
  };
};

/**
 * Creates a validation error
 * @param {string} message - Validation error message
 * @param {Object} fields - Fields that failed validation
 * @returns {Error} Validation error object
 */
export const createValidationError = (message, fields = {}) => {
  return createError(message, 'VALIDATION_ERROR', { fields });
};

/**
 * Creates a network error
 * @param {string} message - Network error message
 * @returns {Error} Network error object
 */
export const createNetworkError = message => {
  return createError(message, 'NETWORK_ERROR');
};

/**
 * Creates an authentication error
 * @param {string} message - Authentication error message
 * @returns {Error} Authentication error object
 */
export const createAuthError = message => {
  return createError(message, 'AUTH_ERROR');
};

export default {
  createError,
  formatError,
  logError,
  handleError,
  withErrorHandling,
  createValidationError,
  createNetworkError,
  createAuthError,
};
