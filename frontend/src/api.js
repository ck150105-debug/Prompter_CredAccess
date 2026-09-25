/**
 * CredAccess - Frontend API Client
 */

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('credaccess_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('credaccess_token', token);
  } else {
    localStorage.removeItem('credaccess_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail || data?.message || 'Request failed';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),
  switchDemoUser: (mode) => {
    const fd = new FormData();
    fd.append('mode', mode);
    return request('/demo/switch', { method: 'POST', body: fd });
  },

  // Gig Platforms & Verification
  getPlatforms: () => request('/gig/platforms'),
  verifyPlatforms: (platforms) => request('/gig/verify', { method: 'POST', body: { platforms } }),

  // Profile
  getProfile: () => request('/profile'),
  saveProfile: (payload) => request('/profile', { method: 'POST', body: payload }),

  // Income & Statements
  getIncomeOverview: () => request('/income'),
  uploadStatement: (month, file, year = 2025) => {
    const fd = new FormData();
    fd.append('month', month);
    fd.append('year', year.toString());
    if (file) {
      fd.append('file', file);
    }
    return request('/statements/upload', { method: 'POST', body: fd });
  },
  simulateAllStatements: (savingsRate = 0.35) => {
    const fd = new FormData();
    fd.append('savings_rate_target', savingsRate.toString());
    return request('/statements/simulate-all', { method: 'POST', body: fd });
  },

  // Financial Summary & Eligibility
  getFinancialSummary: () => request('/financial/summary'),
  getEligibility: () => request('/eligibility'),
  
  // Certificate & Documents
  generateCertificate: () => request('/certificate/generate', { method: 'POST' }),
  getCertificate: () => request('/certificate'),
  getPortfolio: () => request('/portfolio'),
  getDocuments: () => request('/documents'),
};
