import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor nạp Token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parking_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý lỗi 401 tự động chuyển về trang đăng nhập nếu token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu không phải đang ở trang đăng nhập thì có thể clear token
      if (window.location.pathname !== '/login' && window.location.pathname !== '/customer-portal') {
        localStorage.removeItem('parking_access_token');
        localStorage.removeItem('parking_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
