import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('parking_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('parking_access_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('parking_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Token verification failed:", err);
          setUser(null);
          localStorage.removeItem('parking_access_token');
          localStorage.removeItem('parking_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('parking_access_token', access_token);
    localStorage.setItem('parking_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('parking_access_token');
    localStorage.removeItem('parking_user');
    setUser(null);
  };

  const isManager = user?.VaiTro === 'QuanLy';
  const isStaff = user?.VaiTro === 'NhanVien' || isManager;
  const isCustomer = user?.VaiTro === 'KhachHang';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isManager, isStaff, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
