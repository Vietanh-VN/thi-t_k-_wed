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
        // Nếu là Demo Token thì giữ nguyên user trong localStorage
        if (token.startsWith('demo_token_')) {
          const saved = localStorage.getItem('parking_user');
          if (saved) {
            setUser(JSON.parse(saved));
          }
          setLoading(false);
          return;
        }

        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('parking_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn("Token verification failed, fallback to saved user:", err);
          const saved = localStorage.getItem('parking_user');
          if (saved) {
            setUser(JSON.parse(saved));
          } else {
            setUser(null);
            localStorage.removeItem('parking_access_token');
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.data && res.data.user) {
        const { access_token, user: userData } = res.data;
        localStorage.setItem('parking_access_token', access_token);
        localStorage.setItem('parking_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (err) {
      console.warn("Backend login failed, fallback to offline demo mode:", err);
    }

    // Đăng nhập ngoại tuyến Demo (Hoạt động 100% trên GitHub Pages)
    const cleanEmail = (email || '').toLowerCase().trim();
    let demoUser = null;

    if (cleanEmail.includes('admin')) {
      demoUser = {
        MaNguoiDung: 1,
        TenDangNhap: 'admin',
        HoTen: 'Nông Việt Anh (Quản lý)',
        Email: 'admin@parking.vn',
        SoDienThoai: '0988888888',
        VaiTro: 'QuanLy',
        TrangThai: 'HoatDong'
      };
    } else if (cleanEmail.includes('staff')) {
      demoUser = {
        MaNguoiDung: 2,
        TenDangNhap: 'staff',
        HoTen: 'Hoàng Văn Minh (Nhân viên)',
        Email: 'staff@parking.vn',
        SoDienThoai: '0977777777',
        VaiTro: 'NhanVien',
        TrangThai: 'HoatDong'
      };
    } else if (cleanEmail.includes('khachhang') || cleanEmail.includes('customer')) {
      demoUser = {
        MaNguoiDung: 3,
        TenDangNhap: 'khachhang',
        HoTen: 'Giàng A Tùng (Khách hàng)',
        Email: 'khachhang@gmail.com',
        SoDienThoai: '0966666666',
        VaiTro: 'KhachHang',
        TrangThai: 'HoatDong'
      };
    } else if (cleanEmail.includes('ai')) {
      demoUser = {
        MaNguoiDung: 4,
        TenDangNhap: 'ai',
        HoTen: 'AI Engine System',
        Email: 'ai@parking.vn',
        SoDienThoai: '0912345678',
        VaiTro: 'AIEngine',
        TrangThai: 'HoatDong'
      };
    } else {
      demoUser = {
        MaNguoiDung: 99,
        TenDangNhap: cleanEmail.split('@')[0] || 'demo_user',
        HoTen: cleanEmail.split('@')[0] || 'Người dùng Demo',
        Email: cleanEmail || 'demo@parking.vn',
        SoDienThoai: '0988888888',
        VaiTro: 'QuanLy',
        TrangThai: 'HoatDong'
      };
    }

    const mockToken = `demo_token_${Date.now()}`;
    localStorage.setItem('parking_access_token', mockToken);
    localStorage.setItem('parking_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
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
