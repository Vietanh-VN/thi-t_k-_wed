import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Clock, Sparkles, Shield, User, Bell } from 'lucide-react';

const Navbar = ({ onToggleMobile }) => {
  const { user, login } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickSwitch = async (email, pass) => {
    try {
      await login(email, pass);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-sky-100 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-600 bg-sky-50/80 border border-sky-100 px-3.5 py-1.5 rounded-full shadow-xs">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>
            {time.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            {' • '}
            {time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* AI Engine Status Pill */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden md:inline">AI Engine:</span>
          <span>Sẵn sàng</span>
        </div>

        {/* Quick Role Switcher for Demo / Grading */}
        <div className="hidden xl:flex items-center bg-slate-50 p-1 rounded-2xl text-xs space-x-1 border border-sky-100">
          <span className="px-2 text-slate-400 font-bold">Chuyển vai trò test:</span>
          <button
            onClick={() => handleQuickSwitch('admin@parking.vn', 'admin123')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              user?.VaiTro === 'QuanLy'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-600 hover:bg-white'
            }`}
          >
            👑 Quản lý
          </button>
          <button
            onClick={() => handleQuickSwitch('staff@parking.vn', 'staff123')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              user?.VaiTro === 'NhanVien'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-600 hover:bg-white'
            }`}
          >
            👮 Nhân viên
          </button>
          <button
            onClick={() => handleQuickSwitch('khachhang@gmail.com', 'customer123')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              user?.VaiTro === 'KhachHang'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-600 hover:bg-white'
            }`}
          >
            🚗 Khách hàng
          </button>
        </div>

        {/* User Pill */}
        {user ? (
          <div className="flex items-center space-x-2.5 pl-2 border-l border-sky-100">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.HoTen?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user.HoTen}</p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">{user.Email}</p>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
