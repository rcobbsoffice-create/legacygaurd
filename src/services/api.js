const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  try {
    return JSON.parse(localStorage.getItem('lp_agent_session'))?.token || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me'),

  getLeads: () => request('/api/leads'),
  submitPublicLead: (lead) => request('/api/public/leads', { method: 'POST', body: lead }),
  updateLead: (id, patch) => request(`/api/leads/${id}`, { method: 'PATCH', body: patch }),

  getClients: () => request('/api/clients'),
  createClient: (client) => request('/api/clients', { method: 'POST', body: client }),
  updateClient: (id, patch) => request(`/api/clients/${id}`, { method: 'PATCH', body: patch }),
  deleteClient: (id) => request(`/api/clients/${id}`, { method: 'DELETE' }),
  addClientNote: (id, text) => request(`/api/clients/${id}/notes`, { method: 'POST', body: { text } }),

  getApplications: () => request('/api/applications'),
  createApplication: (app) => request('/api/applications', { method: 'POST', body: app }),
  updateApplication: (id, patch) => request(`/api/applications/${id}`, { method: 'PATCH', body: patch }),

  getPricing: () => request('/api/marketplace/pricing'),
  updatePricing: (pricing) => request('/api/marketplace/pricing', { method: 'PUT', body: pricing }),
  getPurchases: () => request('/api/marketplace/purchases'),
  purchaseItem: (itemType, itemId) => request('/api/marketplace/purchases', { method: 'POST', body: { itemType, itemId } }),
};
