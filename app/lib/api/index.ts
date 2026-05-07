import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, phone?: string) =>
    api.post('/auth/register', { name, email, password, phone }),
};

// Products
export const productsAPI = {
  getAll: (search?: string, category?: string) =>
    api.get('/products', { params: { search, category } }),
  getOne: (id: number) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Orders
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getByUser: (userId: number) => api.get(`/orders/user/${userId}`),
  getOne: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

// Users
export const usersAPI = {
  getAll: () => api.get('/users'),
  getOne: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
};

// Reviews
export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  getByProduct: (productId: number) =>
    api.get(`/reviews/product/${productId}`),
  getAll: () => api.get('/reviews'),
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

// Coupons
export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  create: (data: any) => api.post('/coupons', data),
  validate: (code: string) => api.post('/coupons/validate', { code }),
  use: (code: string) => api.post('/coupons/use', { code }),
  delete: (id: number) => api.delete(`/coupons/${id}`),
};

// Sellers
export const sellersAPI = {
  getAll: () => api.get('/sellers'),
  getOne: (id: number) => api.get(`/sellers/${id}`),
  create: (data: any) => api.post('/sellers', data),
  approve: (id: number) => api.put(`/sellers/${id}/approve`),
  reject: (id: number) => api.put(`/sellers/${id}/reject`),
};

// Notifications
export const notificationsAPI = {
  getByUser: (userId: number) => api.get(`/notifications/user/${userId}`),
  getUnreadCount: (userId: number) =>
    api.get(`/notifications/unread/${userId}`),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId: number) =>
    api.put(`/notifications/user/${userId}/read-all`),
};

// Admin
export const adminAPI = {
  login: (email: string, password: string) =>
    api.post('/admin/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/admin/register', { name, email, password }),
};

// AI
export const aiAPI = {
  chat: (message: string) => api.post('/ai/chat', { message }),
};