// Cache for read operations (5 minutes)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const ensureConfigured = () => {
  const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;
  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    throw new Error('Google Sheets Web App URL missing. Set VITE_GOOGLE_SHEETS_WEB_APP_URL in your .env file.');
  }
};

const sendRequest = async (payload) => {
  try {
    ensureConfigured();
    const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;
    const GOOGLE_SHEETS_SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
        ...payload,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => 'Unknown error');
      throw new Error(`Google Sheets sync failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Safely extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Google Sheets request failed:', errorMessage);
    throw new Error(`Google Sheets request failed: ${errorMessage}`);
  }
};

export const syncWithSheets = async ({ transactions = [], budgets = [], wallets = [], goals = [] }) => {
  try {
    // Batch updates to reduce network calls
    const batchedPayload = {
      action: 'syncData',
      transactions,
      budgets,
      wallets,
      goals,
    };
    
    const result = await sendRequest(batchedPayload);
    return result;
  } catch (error) {
    // Safely extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Google Sheets sync failed:', errorMessage);
    throw new Error(`Google Sheets sync failed: ${errorMessage}`);
  }
};

export const fetchFromSheets = async () => {
  try {
    // Check cache first
    const cacheKey = 'fetchData';
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached data for fetchFromSheets');
      return cached.data;
    }
    
    const result = await sendRequest({ action: 'fetchData' });
    
    // Cache the result
    cache.set(cacheKey, {
      data: {
        transactions: result.transactions || [],
        budgets: result.budgets || [],
        wallets: result.wallets || [],
        goals: result.goals || [],
      },
      timestamp: Date.now()
    });
    
    return {
      transactions: result.transactions || [],
      budgets: result.budgets || [],
      wallets: result.wallets || [],
      goals: result.goals || [],
    };
  } catch (error) {
    // Safely extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Google Sheets fetch failed:', errorMessage);
    throw new Error(`Google Sheets fetch failed: ${errorMessage}`);
  }
};

// Clear cache when needed
export const clearCache = () => {
  cache.clear();
};

// Google Sheets authentication
export const connectGoogleAccount = async () => {
  // In a real implementation, this would redirect to Google OAuth
  // For now, we'll simulate a successful connection
  return {
    connected: true,
    message: 'Google Sheets connected successfully'
  };
};

export const disconnectGoogleAccount = async () => {
  // In a real implementation, this would disconnect the Google account
  // For now, we'll simulate a successful disconnection
  return {
    connected: false,
    message: 'Google Sheets disconnected successfully'
  };
};