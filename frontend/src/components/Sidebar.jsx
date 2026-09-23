import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  CreditCard,
  Layers,
  DollarSign,
  History,
  Bot,
  UserCircle,
  HelpCircle,
  Car,
  ChevronRight,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout, isManager, isStaff } = useAuth();
  const navigate = useNavigate();
  const [activeCarsCount, setActiveCarsCount] = useState(0);

  useEffect(() => {
    const fetchActiveCount = async () => {
      try {
        const res = await api.get('/stats/overview');
        setActiveCarsCount(res.data.SoXeDangGui || 0);
      } catch (err) {
        // silent fallback
      }
    };
    fetchActiveCount();
    const interval = setInterval(fetchActiveCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'Tổng quan Dashboard',
      icon: LayoutDashboard,
      roles: ['QuanLy', 'NhanVien', 'KhachHang', 'AIEngine'],
    },
    {
      to: '/check-in',
      label: 'Ghi nhận Xe Vào',
      icon: LogIn,
      badge: 'Cổng vào',
      roles: ['QuanLy', 'NhanVien'],
    },
    {
      to: '/check-out',
      label: 'Ghi nhận Xe Ra & Phí',
      icon: LogOut,
      badge: `${activeCarsCount} xe`,
      badgeColor: 'bg-emerald-500 text-white',
      roles: ['QuanLy', 'NhanVien'],
    },
    {
      to: '/parking-map',
      label: 'Sơ đồ Vị trí đỗ',
      icon: MapPin,
      roles: ['QuanLy', 'NhanVien', 'KhachHang', 'AIEngine'],
    },
    {
      to: '/monthly-passes',
      label: 'Quản lý Vé tháng',
      icon: CreditCard,
      roles: ['QuanLy', 'NhanVien'],
    },
    {
      to: '/zones-spots',
      label: 'Khu vực & Vị trí',
      icon: Layers,
      roles: ['QuanLy'],
    },
    {
      to: '/pricing',
      label: 'Quản lý Bảng giá',
      icon: DollarSign,
      roles: ['QuanLy', 'AIEngine'],
    },
    {
      to: '/history',
      label: 'Tra cứu Lịch sử',
      icon: History,
      roles: ['QuanLy', 'NhanVien', 'KhachHang', 'AIEngine'],
    },
    {
      to: '/ai-assistant',
      label: 'Trung tâm Tác nhân AI',
      icon: Bot,
      highlight: true,
      roles: ['QuanLy', 'NhanVien', 'KhachHang', 'AIEngine'],
    },
    {
      to: '/customer-portal',
      label: 'Cổng Khách hàng',
      icon: HelpCircle,
      roles: ['QuanLy', 'NhanVien', 'KhachHang', 'AIEngine'],
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    !user || item.roles.includes(user.VaiTro)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-slate-700 flex flex-col border-r border-sky-100 shadow-xl shadow-sky-950/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo */}
        <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-sky-100 p-1 flex items-center justify-center shadow-md shadow-sky-500/10">
              <img src="./logo-ictu.png" alt="ICTU" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm leading-tight tracking-tight">Smart Parking AI</h1>
              <p className="text-[11px] text-sky-600 font-bold">ĐH CNTT & TT Thái Nguyên</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge Card */}
        {user && (
          <div className={`mx-4 my-3 p-3 rounded-2xl border flex items-center space-x-3 shadow-sm ${
            user.VaiTro === 'AIEngine'
              ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
              : 'bg-gradient-to-r from-sky-50 to-blue-50/50 border-sky-100'
          }`}>
            <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-sm ${
              user.VaiTro === 'AIEngine'
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                : 'bg-gradient-to-tr from-sky-500 to-blue-600'
            }`}>
              {user.VaiTro === 'AIEngine' ? <Bot className="w-5 h-5" /> : (user.HoTen?.charAt(0) || 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user.HoTen}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                {user.VaiTro === 'AIEngine' ? (
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                )}
                <span className={`text-[11px] font-bold ${
                  user.VaiTro === 'AIEngine' ? 'text-purple-700' : 'text-sky-600'
                }`}>
                  {user.VaiTro === 'QuanLy'
                    ? 'Quản lý trưởng'
                    : user.VaiTro === 'NhanVien'
                    ? 'Nhân viên bãi xe'
                    : user.VaiTro === 'AIEngine'
                    ? 'AI Engine (Tác nhân AI)'
                    : 'Khách hàng'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Chức năng hệ thống
          </p>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                      : item.highlight
                      ? 'text-sky-700 bg-sky-50/70 hover:bg-sky-100 hover:text-sky-800 border border-sky-200/80'
                      : 'text-slate-600 hover:bg-sky-50/80 hover:text-sky-700'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-sky-100 text-sky-700'}`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-sky-600 text-white shadow-xs">
                    AI Core
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-sky-100 space-y-2 bg-slate-50/50">
          <div className="px-3 py-2 rounded-xl bg-white border border-sky-100 text-[11px] text-slate-500 shadow-xs">
            <p className="font-bold text-slate-700">Đồ án AI - Nhóm 02</p>
            <p className="text-slate-400">Trường ĐH CNTT & TT Thái Nguyên</p>
          </div>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập hệ thống</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
