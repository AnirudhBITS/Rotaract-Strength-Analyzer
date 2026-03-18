import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const applicationApi = {
  getQuestions: () => api.get('/application/questions'),
  getPositions: () => api.get('/application/positions'),
  submit: (data) => api.post('/application/submit', data),
};

export const uploadApi = {
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const adminApi = {
  login: (credentials) => api.post('/admin/login', credentials),
  getDashboard: () => api.get('/admin/dashboard'),
  getApplicants: (params) => api.get('/admin/applicants', { params }),
  getApplicant: (id) => api.get(`/admin/applicants/${id}`),
  updateStatus: (id, data) => api.patch(`/admin/applicants/${id}/status`, data),
  exportAll: () => api.get('/admin/export'),
};

export const allocationApi = {
  getPositions: () => api.get('/allocation/positions'),
  getSummary: () => api.get('/allocation/summary'),
  getCandidates: (positionId) => api.get(`/allocation/positions/${positionId}/candidates`),
  allocate: (positionId, data) => api.post(`/allocation/positions/${positionId}/allocate`, data),
  deallocate: (positionId, applicantId) => api.delete(`/allocation/positions/${positionId}/deallocate/${applicantId}`),
};

export default api;
