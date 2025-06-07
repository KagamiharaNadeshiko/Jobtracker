import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 行业相关API
export const industryAPI = {
  getAll: () => api.get('/industries'),
  getById: (id: string) => api.get(`/industries/${id}`),
  create: (data: any) => api.post('/industries', data),
  update: (id: string, data: any) => api.put(`/industries/${id}`, data),
  delete: (id: string) => api.delete(`/industries/${id}`)
};

// 公司相关API
export const companyAPI = {
  getAll: () => api.get('/companies'),
  getByIndustry: (industryId: string) => api.get(`/companies/industry/${industryId}`),
  getById: (id: string) => api.get(`/companies/${id}`),
  create: (data: any) => api.post('/companies', data),
  update: (id: string, data: any) => api.put(`/companies/${id}`, data),
  delete: (id: string) => api.delete(`/companies/${id}`)
};

// 职位相关API
export const positionAPI = {
  getAll: () => api.get('/positions'),
  getByCompany: (companyId: string) => api.get(`/positions/company/${companyId}`),
  getById: (id: string) => api.get(`/positions/${id}`),
  create: (data: any) => api.post('/positions', data),
  update: (id: string, data: any) => api.put(`/positions/${id}`, data),
  delete: (id: string) => api.delete(`/positions/${id}`)
};

// 申请文书相关API
export const essayAPI = {
  getByPosition: (positionId: string) => api.get(`/essays/position/${positionId}`),
  getById: (id: string) => api.get(`/essays/${id}`),
  create: (data: any) => api.post('/essays', data),
  update: (id: string, data: any) => api.put(`/essays/${id}`, data),
  delete: (id: string) => api.delete(`/essays/${id}`)
};

// 网测相关API
export const onlineTestAPI = {
  getByPosition: (positionId: string) => api.get(`/onlinetests/position/${positionId}`),
  getById: (id: string) => api.get(`/onlinetests/${id}`),
  create: (data: any) => api.post('/onlinetests', data),
  update: (id: string, data: any) => api.put(`/onlinetests/${id}`, data),
  delete: (id: string) => api.delete(`/onlinetests/${id}`)
};

// 面试相关API
export const interviewAPI = {
  getByPosition: (positionId: string) => api.get(`/interviews/position/${positionId}`),
  getById: (id: string) => api.get(`/interviews/${id}`),
  create: (data: any) => api.post('/interviews', data),
  update: (id: string, data: any) => api.put(`/interviews/${id}`, data),
  delete: (id: string) => api.delete(`/interviews/${id}`)
};

export default api; 