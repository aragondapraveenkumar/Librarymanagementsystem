import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('vemuToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vemuToken');
      localStorage.removeItem('vemuUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ───────────────────────────────────────────────────────
export const login    = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe    = ()     => api.get('/auth/me');

// ─── Users ──────────────────────────────────────────────────────
export const getUsers    = ()    => api.get('/users');
export const deleteUser  = (id)  => api.delete(`/users/${id}`);
export const updateUser  = (id, data) => api.put(`/users/${id}`, data);

// ─── Books ──────────────────────────────────────────────────────
export const getBooks   = (q)    => api.get('/books', { params: q ? { q } : {} });
export const addBook    = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id)   => api.delete(`/books/${id}`);

// ─── Library ────────────────────────────────────────────────────
export const getIssues      = ()       => api.get('/library/issues');
export const getMyBooks     = ()       => api.get('/library/mybooks');
export const issueBook      = (data)   => api.post('/library/issue', data);
export const returnBook     = (id)     => api.post(`/library/return/${id}`);

export const getRequests    = ()       => api.get('/library/requests');
export const makeRequest    = (bookId) => api.post('/library/requests', { bookId });
export const approveRequest = (id)     => api.put(`/library/requests/${id}/approve`);
export const rejectRequest  = (id)     => api.put(`/library/requests/${id}/reject`);

export const getRecommendations = ()       => api.get('/library/recommendations');
export const addRecommendation  = (data)   => api.post('/library/recommendations', data);
export const archiveRec         = (id)     => api.delete(`/library/recommendations/${id}`);

export const getFeedback  = ()     => api.get('/library/feedback');
export const postFeedback = (data) => api.post('/library/feedback', data);

export const getReports   = ()     => api.get('/library/reports');

export default api;

