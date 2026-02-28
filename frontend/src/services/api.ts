import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - attempt token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// API Functions
// ============================================

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh-token', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

// Users
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getLeaderboard: (companyId: string) => api.get(`/users/leaderboard/${companyId}`),
  listUsers: (params?: any) => api.get('/users', { params }),
};

// Companies
export const companyApi = {
  create: (data: any) => api.post('/companies', data),
  getMyCompany: () => api.get('/companies/me'),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  getTheme: (companyId: string) => api.get(`/companies/${companyId}/theme`),
  updateTheme: (companyId: string, data: any) => api.put(`/companies/${companyId}/theme`, data),
  getProducts: (companyId: string, params?: any) => api.get(`/companies/${companyId}/products`, { params }),
  createProduct: (companyId: string, data: any) => api.post(`/companies/${companyId}/products`, data),
  updateProduct: (companyId: string, id: string, data: any) => api.put(`/companies/${companyId}/products/${id}`, data),
  deleteProduct: (companyId: string, id: string) => api.delete(`/companies/${companyId}/products/${id}`),
  getCategories: (companyId: string) => api.get(`/companies/${companyId}/categories`),
  createCategory: (companyId: string, data: any) => api.post(`/companies/${companyId}/categories`, data),
  updateCategory: (companyId: string, id: string, data: any) => api.put(`/companies/${companyId}/categories/${id}`, data),
  deleteCategory: (companyId: string, id: string) => api.delete(`/companies/${companyId}/categories/${id}`),
};

// Subscriptions
export const subscriptionApi = {
  getPlans: () => api.get('/subscriptions/plans'),
  subscribe: (data: any) => api.post('/subscriptions', data),
  getMy: () => api.get('/subscriptions/me'),
  cancel: (id: string) => api.post(`/subscriptions/${id}/cancel`),
  upgrade: (id: string, data: any) => api.post(`/subscriptions/${id}/upgrade`, data),
};

// Payments
export const paymentApi = {
  initiate: (data: any) => api.post('/payments/initiate', data),
  verify: (data: any) => api.post('/payments/verify', data),
  getInvoices: () => api.get('/payments/invoices'),
};

// Rewards
export const rewardApi = {
  getByCompany: (companyId: string, params?: any) => api.get(`/rewards/company/${companyId}`, { params }),
  getActive: () => api.get('/rewards/active'),
  create: (data: any) => api.post('/rewards', data),
  update: (id: string, data: any) => api.put(`/rewards/${id}`, data),
  delete: (id: string) => api.delete(`/rewards/${id}`),
  redeem: (data: any) => api.post('/rewards/redeem', data),
  getRedemptions: () => api.get('/rewards/redemptions/company'),
  getAnalytics: () => api.get('/rewards/analytics'),
  getCoupons: () => api.get('/rewards/coupons'),
  createCoupon: (data: any) => api.post('/rewards/coupons', data),
  deleteCoupon: (id: string) => api.delete(`/rewards/coupons/${id}`),
};

// Master Data
export const masterApi = {
  getIndustries: () => api.get('/master/industries'),
  getPlans: () => api.get('/master/plans'),
  getFaqs: (category?: string) => api.get('/master/faqs', { params: { category } }),
};

// Notifications
export const notificationApi = {
  getUserNotifications: (params?: any) => api.get('/notifications/user', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/read/${id}`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (data: any) => api.put('/notifications/preferences', data),
};

// Admin API (super admin)
export const adminApi = {
  getCompanies: (params?: any) => api.get('/admin/companies', { params }),
  verifyCompany: (id: string) => api.post(`/admin/companies/${id}/verify`),
  rejectCompany: (id: string, reason: string) => api.post(`/admin/companies/${id}/reject`, { reason }),
  getSubscriptions: (params?: any) => api.get('/admin/subscriptions', { params }),
  getDashboardStats: () => api.get('/admin/stats'),
};
