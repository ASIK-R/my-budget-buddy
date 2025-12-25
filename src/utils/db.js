let db = null;
let dbPromise = null;

// Enhanced cache with LRU eviction policy and expiration tracking
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = new Set(); // Track access order for LRU
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      // Check if expired
      if (item.expires < Date.now()) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        return null;
      }

      // Move to front (most recently used)
      this.accessOrder.delete(key);
      this.accessOrder.add(key);
      return item.value;
    }
    return null;
  }

  set(key, value, ttl = 300000) {
    // 5 minutes default
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.accessOrder.values().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.accessOrder.delete(firstKey);
      }
    }

    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
    this.accessOrder.add(key);
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
    this.accessOrder.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Cache for faster access
const memoryCache = new LRUCache(100);

// Enhanced error handling utility
const createError = (message, code = 'UNKNOWN_ERROR') => {
  const error = new Error(message);
  error.code = code;
  return error;
};

// Enhanced logging utility
const log = {
  info: (...args) => console.log('[DB INFO]', ...args),
  warn: (...args) => console.warn('[DB WARN]', ...args),
  error: (...args) => console.error('[DB ERROR]', ...args),
};

export const initDB = () => {
  console.log('initDB called');
  // Return existing promise if initialization is in progress
  if (dbPromise) {
    console.log('Returning existing dbPromise');
    return dbPromise;
  }

  // Return existing db if already initialized
  if (db) {
    console.log('DB already initialized, returning existing db');
    return Promise.resolve(db);
  }

  console.log('Creating new dbPromise');
  dbPromise = new Promise((resolve, reject) => {
    try {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, using in-memory storage');
        db = { inMemory: true };
        dbPromise = null;
        resolve(db);
        return;
      }

      console.log('Initializing IndexedDB');
      const request = indexedDB.open('ExpenseTrackerDB', 3); // Updated version

      request.onsuccess = () => {
        db = request.result;
        console.log('IndexedDB initialized successfully');
        dbPromise = null;
        resolve(db);
      };

      request.onerror = event => {
        const errorMessage =
          event.target?.error?.message || event.target?.error || 'Unknown IndexedDB error';
        console.error('IndexedDB initialization failed:', errorMessage);
        // Fallback to in-memory storage
        db = { inMemory: true };
        dbPromise = null;
        resolve(db);
      };

      request.onupgradeneeded = event => {
        console.log('Setting up IndexedDB schema');
        const database = event.target.result;

        // Create object stores if they don't exist
        if (!database.objectStoreNames.contains('transactions')) {
          const transactionStore = database.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('type', 'type', { unique: false });
          transactionStore.createIndex('user_id', 'user_id', { unique: false });
          console.log('Created transactions store');
        }

        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
          console.log('Created settings store');
        }

        // Add cache store for faster access
        if (!database.objectStoreNames.contains('cache')) {
          database.createObjectStore('cache', { keyPath: 'key' });
          console.log('Created cache store');
        }

        // Add wallets store
        if (!database.objectStoreNames.contains('wallets')) {
          database.createObjectStore('wallets', { keyPath: 'id' });
          console.log('Created wallets store');
        }

        // Add budgets store
        if (!database.objectStoreNames.contains('budgets')) {
          database.createObjectStore('budgets', { keyPath: 'id' });
          console.log('Created budgets store');
        }

        // Add categories store
        if (!database.objectStoreNames.contains('categories')) {
          database.createObjectStore('categories', { keyPath: 'id' });
          console.log('Created categories store');
        }

        // Add transfers store
        if (!database.objectStoreNames.contains('transfers')) {
          database.createObjectStore('transfers', { keyPath: 'id' });
          console.log('Created transfers store');
        }

        // Add offline queue store
        if (!database.objectStoreNames.contains('offline_queue')) {
          const offlineQueueStore = database.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
          offlineQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('Created offline queue store');
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error during IndexedDB initialization:', errorMessage);
      db = { inMemory: true };
      dbPromise = null;
      resolve(db);
    }
  });

  return dbPromise;
};

// Enhanced save function with retry logic
export const saveToDB = async (storeName, data, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // If using in-memory storage, just store in memory
      if (!db || db.inMemory) {
        if (!global.inMemoryStorage) {
          global.inMemoryStorage = {};
        }
        global.inMemoryStorage[storeName] = data;
        return data;
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      // Clear existing data and save new data
      await store.clear();
      
      if (Array.isArray(data)) {
        // Save array data
        for (const item of data) {
          await store.put(item);
        }
      } else if (data && typeof data === 'object') {
        // Save object data (settings)
        await store.put(data);
      }
      
      await tx.done;
      console.log(`Successfully saved to ${storeName}`);
      return data;
    } catch (error) {
      lastError = error;
      console.warn(`Save attempt ${attempt} failed for ${storeName}:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }
  
  // If all retries failed, fall back to in-memory storage
  console.error(`All save attempts failed for ${storeName}, falling back to in-memory storage:`, lastError.message);
  if (!global.inMemoryStorage) {
    global.inMemoryStorage = {};
  }
  global.inMemoryStorage[storeName] = data;
  return data;
};

// Enhanced load function with fallback
export const loadFromDB = async (storeName) => {
  try {
    // If using in-memory storage, load from memory
    if (!db || db.inMemory) {
      return global.inMemoryStorage?.[storeName] || [];
    }

    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const data = await store.getAll();
    await tx.done;
    
    console.log(`Successfully loaded from ${storeName}:`, data.length, 'items');
    return data;
  } catch (error) {
    console.error(`Load failed for ${storeName}, returning empty array:`, error.message);
    // Return appropriate default based on store type
    if (storeName === 'settings') {
      return {};
    }
    return [];
  }
};

// Save individual item
export const saveItemToDB = async (storeName, item, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // If using in-memory storage, just store in memory
      if (!db || db.inMemory) {
        if (!global.inMemoryStorage) {
          global.inMemoryStorage = {};
        }
        if (!global.inMemoryStorage[storeName]) {
          global.inMemoryStorage[storeName] = [];
        }
        
        // For arrays, add the item
        if (Array.isArray(global.inMemoryStorage[storeName])) {
          // Check if item already exists
          const existingIndex = global.inMemoryStorage[storeName].findIndex(i => i.id === item.id);
          if (existingIndex >= 0) {
            global.inMemoryStorage[storeName][existingIndex] = item;
          } else {
            global.inMemoryStorage[storeName].push(item);
          }
        } else {
          // For objects (settings), update the object
          global.inMemoryStorage[storeName] = { ...global.inMemoryStorage[storeName], ...item };
        }
        
        return item;
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.put(item);
      await tx.done;
      
      console.log(`Successfully saved item to ${storeName}`);
      return item;
    } catch (error) {
      lastError = error;
      console.warn(`Save item attempt ${attempt} failed for ${storeName}:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }
  
  // If all retries failed, fall back to in-memory storage
  console.error(`All save item attempts failed for ${storeName}, falling back to in-memory storage:`, lastError.message);
  if (!global.inMemoryStorage) {
    global.inMemoryStorage = {};
  }
  if (!global.inMemoryStorage[storeName]) {
    global.inMemoryStorage[storeName] = [];
  }
  
  // For arrays, add the item
  if (Array.isArray(global.inMemoryStorage[storeName])) {
    // Check if item already exists
    const existingIndex = global.inMemoryStorage[storeName].findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      global.inMemoryStorage[storeName][existingIndex] = item;
    } else {
      global.inMemoryStorage[storeName].push(item);
    }
  } else {
    // For objects (settings), update the object
    global.inMemoryStorage[storeName] = { ...global.inMemoryStorage[storeName], ...item };
  }
  
  return item;
};

// Delete individual item
export const deleteItemFromDB = async (storeName, id, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // If using in-memory storage, just remove from memory
      if (!db || db.inMemory) {
        if (global.inMemoryStorage?.[storeName]) {
          if (Array.isArray(global.inMemoryStorage[storeName])) {
            global.inMemoryStorage[storeName] = global.inMemoryStorage[storeName].filter(item => item.id !== id);
          }
        }
        return true;
      }

      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.delete(id);
      await tx.done;
      
      console.log(`Successfully deleted item from ${storeName}`);
      return true;
    } catch (error) {
      lastError = error;
      console.warn(`Delete item attempt ${attempt} failed for ${storeName}:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }
  
  // If all retries failed, fall back to in-memory storage
  console.error(`All delete item attempts failed for ${storeName}, falling back to in-memory storage:`, lastError.message);
  if (global.inMemoryStorage?.[storeName]) {
    if (Array.isArray(global.inMemoryStorage[storeName])) {
      global.inMemoryStorage[storeName] = global.inMemoryStorage[storeName].filter(item => item.id !== id);
    }
  }
  
  return true;
};

// Clear cache entries older than specified time
export const clearExpiredCacheEntries = async (userId, maxAgeMs = 1000 * 60 * 60 * 24) => { // 24 hours default
  try {
    // If using in-memory storage, clear memory cache
    if (!db || db.inMemory) {
      memoryCache.clearExpired();
      return;
    }

    const cutoffTime = Date.now() - maxAgeMs;
    const tx = db.transaction('cache', 'readwrite');
    const store = tx.objectStore('cache');
    const index = store.index('timestamp');
    const expiredEntries = await index.getAllKeys(IDBKeyRange.upperBound(cutoffTime));
    
    for (const key of expiredEntries) {
      await store.delete(key);
    }
    
    await tx.done;
    console.log(`Cleared ${expiredEntries.length} expired cache entries`);
  } catch (error) {
    console.error('Failed to clear expired cache:', error.message);
  }
};

// Get setting with cache support
export const getSetting = async (key, userId = 'local') => {
  try {
    const cacheKey = `${userId}:${key}`;
    const cached = memoryCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // If using in-memory storage, get from memory
    if (!db || db.inMemory) {
      const settings = global.inMemoryStorage?.settings || {};
      const value = settings[key];
      if (value !== undefined) {
        memoryCache.set(cacheKey, value);
        return value;
      }
      return null;
    }

    const tx = db.transaction('settings', 'readonly');
    const store = tx.objectStore('settings');
    const setting = await store.get(key);
    await tx.done;
    
    if (setting) {
      memoryCache.set(cacheKey, setting.value);
      return setting.value;
    }
    return null;
  } catch (error) {
    console.error(`Failed to get setting ${key}:`, error.message);
    return null;
  }
};

// Save setting with cache support
export const saveSetting = async (key, value, userId = 'local') => {
  try {
    const cacheKey = `${userId}:${key}`;
    memoryCache.set(cacheKey, value);

    // If using in-memory storage, save to memory
    if (!db || db.inMemory) {
      if (!global.inMemoryStorage) {
        global.inMemoryStorage = {};
      }
      if (!global.inMemoryStorage.settings) {
        global.inMemoryStorage.settings = {};
      }
      global.inMemoryStorage.settings[key] = value;
      return { key, value };
    }

    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    const setting = { key, value };
    await store.put(setting);
    await tx.done;
    
    return setting;
  } catch (error) {
    console.error(`Failed to save setting ${key}:`, error.message);
    throw error;
  }
};

// Cache management functions with enhanced error handling
export const saveToCache = async (key, data, ttl = 300000, maxRetries = 3) => {
  // 5 minutes default
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!db) {
        await initDB();
      }

      const cacheData = {
        key,
        data,
        timestamp: Date.now(),
        expires: Date.now() + ttl,
      };

      // Update memory cache
      memoryCache.set(`cache_${key}`, data, ttl);

      // If using in-memory fallback, just return
      if (db && db.inMemory) {
        log.info('Using in-memory storage for cache');
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.put(cacheData);

        request.onsuccess = () => {
          log.info(`Cache ${key} saved`);
          resolve();
        };

        request.onerror = event => {
          const errorMessage =
            event.target?.error?.message || event.target?.error || 'Unknown save cache error';
          log.error('Save cache error:', errorMessage);
          // Don't reject, just resolve
          resolve();
        };
      });
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.warn(`Save cache attempt ${attempt} failed for ${key}:`, errorMessage);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  // If we get here, all retries failed
  log.error(`Failed to save cache ${key} after ${maxRetries} attempts`);
  // Don't throw error to prevent app crash, just log it
  return;
};

export const getFromCache = async (key, maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check memory cache first
      const cachedData = memoryCache.get(`cache_${key}`);
      if (cachedData !== null) {
        log.info(`Loaded ${key} from memory cache`);
        return cachedData;
      }

      if (!db) {
        await initDB();
      }

      // If using in-memory fallback, return null
      if (db && db.inMemory) {
        log.info('Using in-memory storage for cache');
        return null;
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result;
          if (result && result.expires > Date.now()) {
            log.info(`Loaded cache ${key}`);
            // Update memory cache
            memoryCache.set(`cache_${key}`, result.data);
            resolve(result.data);
          } else {
            // Expired or not found
            resolve(null);
          }
        };

        request.onerror = event => {
          const errorMessage =
            event.target?.error?.message || event.target?.error || 'Unknown get cache error';
          log.error('Get cache error:', errorMessage);
          // Return null as fallback instead of rejecting
          resolve(null);
        };
      });
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.warn(`Get cache attempt ${attempt} failed for ${key}:`, errorMessage);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  // If we get here, all retries failed
  log.error(`Failed to get cache ${key} after ${maxRetries} attempts`);
  return null; // Return null as fallback
};

// Clear expired cache entries
export const clearExpiredCache = async (maxRetries = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!db) {
        await initDB();
      }

      // Clear memory cache
      memoryCache.clearExpired();

      // If using in-memory fallback, just return
      if (db && db.inMemory) {
        log.info('Using in-memory storage for cache');
        return;
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const request = store.getAll();

        request.onsuccess = () => {
          const allCache = request.result;
          const expiredKeys = allCache
            .filter(item => item.expires <= Date.now())
            .map(item => item.key);

          // Delete expired entries
          expiredKeys.forEach(key => {
            store.delete(key);
          });

          log.info(`Cleared ${expiredKeys.length} expired cache entries`);
          resolve();
        };

        request.onerror = event => {
          const errorMessage =
            event.target?.error?.message || event.target?.error || 'Unknown clear cache error';
          log.error('Clear cache error:', errorMessage);
          // Don't reject, just resolve
          resolve();
        };
      });
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.warn(`Clear cache attempt ${attempt} failed:`, errorMessage);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
  }

  // If we get here, all retries failed
  log.error(`Failed to clear cache after ${maxRetries} attempts`);
  // Don't throw error to prevent app crash, just log it
  return;
};

// Utility function to get cache statistics
export const getCacheStats = () => {
  return {
    size: memoryCache.size(),
    maxSize: memoryCache.maxSize,
  };
};

// Utility function to clear all cache
export const clearAllCache = () => {
  memoryCache.clear();
  log.info('Cleared all memory cache');
};
