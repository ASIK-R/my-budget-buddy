const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Merge options
  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // Handle successful responses
  if (response.ok) {
    const data = await response.json();
    return data;
  }

  // Handle error responses
  let errorMessage = 'An error occurred';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    // If we can't parse the error response, use the status text
    errorMessage = response.statusText || errorMessage;
  }

  throw new Error(errorMessage);
};

// User API
export const userAPI = {
  register: userData =>
    apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: credentials =>
    apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/users/profile'),

  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
  },
};

// Transaction API
export const transactionAPI = {
  getAll: userId => apiRequest(`/transactions?userId=${userId}`),

  getById: id => apiRequest(`/transactions/${id}`),

  create: transactionData =>
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),

  update: (id, transactionData) =>
    apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),

  delete: (id, userId) =>
    apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    }),
};

// Budget API
export const budgetAPI = {
  getAll: userId => apiRequest(`/budgets?userId=${userId}`),

  getById: id => apiRequest(`/budgets/${id}`),

  create: budgetData =>
    apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    }),

  update: (id, budgetData) =>
    apiRequest(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    }),

  delete: (id, userId) =>
    apiRequest(`/budgets/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    }),
};

// Wallet API
export const walletAPI = {
  getAll: userId => apiRequest(`/wallets?userId=${userId}`),

  getById: id => apiRequest(`/wallets/${id}`),

  create: walletData =>
    apiRequest('/wallets', {
      method: 'POST',
      body: JSON.stringify(walletData),
    }),

  update: (id, walletData) =>
    apiRequest(`/wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(walletData),
    }),

  delete: (id, userId) =>
    apiRequest(`/wallets/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    }),
};
