/**
 * Offline Queue Manager for Expense Tracker
 * Handles queuing, retrying, and managing offline operations
 */

class OfflineQueueManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000; // milliseconds
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.maxRetryDelay = options.maxRetryDelay || 30000; // 30 seconds
    this.queue = [];
    this.processing = false;
  }

  /**
   * Add an operation to the queue
   * @param {Object} operation - The operation to queue
   * @param {String} operation.type - Type of operation (ADD_TRANSACTION, UPDATE_WALLET, etc.)
   * @param {Object} operation.data - Data for the operation
   * @param {Number} operation.timestamp - When the operation was queued
   * @param {Number} operation.attempts - Number of retry attempts
   */
  enqueue(operation) {
    const queuedOperation = {
      ...operation,
      id: operation.id || this.generateId(),
      timestamp: operation.timestamp || Date.now(),
      attempts: operation.attempts || 0,
      priority: operation.priority || 'normal'
    };
    
    this.queue.push(queuedOperation);
    this.sortQueue(); // Sort by priority and timestamp
    
    console.log('Operation queued:', queuedOperation);
    return queuedOperation.id;
  }

  /**
   * Process the queue
   * @param {Function} processor - Function to process each operation
   */
  async processQueue(processor) {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    
    try {
      // Sort queue before processing
      this.sortQueue();
      
      const failedOperations = [];
      
      for (let i = 0; i < this.queue.length; i++) {
        const operation = this.queue[i];
        
        try {
          await processor(operation);
          console.log('Operation processed successfully:', operation.id);
        } catch (error) {
          console.error('Operation failed:', operation.id, error);
          
          // Increment attempts
          const updatedOperation = {
            ...operation,
            attempts: operation.attempts + 1,
            lastError: error.message,
            lastAttempt: Date.now()
          };
          
          // Retry if under max attempts
          if (updatedOperation.attempts < this.maxRetries) {
            failedOperations.push(updatedOperation);
          } else {
            console.warn('Operation permanently failed after max retries:', updatedOperation);
            // Could trigger a notification to user about permanent failure
          }
        }
      }
      
      // Update queue with failed operations
      this.queue = failedOperations;
      this.sortQueue();
      
      console.log(`Queue processing complete. ${failedOperations.length} operations remain.`);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Sort queue by priority and timestamp
   */
  sortQueue() {
    this.queue.sort((a, b) => {
      // Priority order: high, normal, low
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // Then by timestamp (older first)
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Remove an operation from the queue
   * @param {String} id - Operation ID to remove
   */
  remove(id) {
    this.queue = this.queue.filter(op => op.id !== id);
  }

  /**
   * Clear the entire queue
   */
  clear() {
    this.queue = [];
  }

  /**
   * Get queue length
   * @returns {Number} Number of operations in queue
   */
  length() {
    return this.queue.length;
  }

  /**
   * Get all operations in the queue
   * @returns {Array} Copy of the queue
   */
  getQueue() {
    return [...this.queue];
  }

  /**
   * Check if queue is empty
   * @returns {Boolean} True if queue is empty
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Calculate delay before next retry
   * @param {Number} attempts - Number of attempts made
   * @returns {Number} Delay in milliseconds
   */
  calculateRetryDelay(attempts) {
    const delay = this.retryDelay * Math.pow(this.backoffMultiplier, attempts - 1);
    return Math.min(delay, this.maxRetryDelay);
  }

  /**
   * Generate a unique ID for operations
   * @returns {String} Unique ID
   */
  generateId() {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Set max retries
   * @param {Number} maxRetries - Maximum retry attempts
   */
  setMaxRetries(maxRetries) {
    this.maxRetries = maxRetries;
  }

  /**
   * Set retry delay
   * @param {Number} retryDelay - Base delay in milliseconds
   */
  setRetryDelay(retryDelay) {
    this.retryDelay = retryDelay;
  }
}

export default OfflineQueueManager;