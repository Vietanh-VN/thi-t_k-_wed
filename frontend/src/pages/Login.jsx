import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles, KeyRound, Bot } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError('');
    setLoading(true);
    try {
      await login(quickEmail, quickPass);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Ocean Blue Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-300/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 border border-sky-100 bg-white relative z-10">
        
        {/* Left column: Brand & Project info - Ocean Blue Gradient */}
        <div className="md:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Logo ICTU + Icon Xe */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl shadow-sky-950/25 flex items-center justify-center border-2 border-white/60">
                <img
                  src="./logo-ictu.png"
                  alt="Logo Trường Đại học Công nghệ Thông tin & Truyền thông - ICTU"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-sky-900/15">
                <Bike className="w-6 h-6 text-white" />
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest font-extrabold text-sky-100 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              Học phần Ứng dụng AI
            </span>
            <h1 className="text-2xl lg:text-3xl font-extrabold mt-4 leading-tight tracking-tight text-white drop-shadow-sm">
              HỆ THỐNG QUẢN LÝ BÃI ĐỖ XE TÍCH HỢP AI
            </h1>
            <p className="text-sm text-sky-100 mt-3 leading-relaxed">
              Giải pháp số hóa toàn diện quy trình xe vào/ra, tính phí tự động, tối ưu hóa vị trí đỗ và phân tích giờ cao điểm bằng AI.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 text-xs text-sky-100 space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <img src="./logo-ictu.png" alt="ICTU" className="w-6 h-6 rounded-full bg-white p-0.5 shadow-sm" />
              <p className="font-extrabold text-white text-sm">NHÓM 02 - ĐH CNTT & TT THÁI NGUYÊN</p>
            </div>
            <p className="pl-8.5 text-sky-100">1. Nông Việt Anh (Trưởng nhóm)</p>
            <p className="pl-8.5 text-sky-100">2. Hoàng Văn Minh • 3. Giàng A Tùng</p>
            <p className="pl-8.5 pt-0.5 text-sky-200">Giảng viên hướng dẫn: <span className="font-bold text-white">Ngô Hữu Huy</span></p>
          </div>
        </div>

        {/* Right column: Login form & Demo 1-Click - Clean White & Sky Blue */}
        <div className="md:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Đăng nhập tài khoản</h2>
            <p className="text-sm text-slate-500 mt-1">Chọn tài khoản mẫu bên dưới hoặc nhập thông tin đăng nhập</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Tài khoản hoặc Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin hoặc admin@parking.vn"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Đăng nhập vào Hệ thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo 1-Click Login Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Đăng nhập nhanh 1-Click (Dành cho Chấm điểm & Thử nghiệm):
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@parking.vn', 'admin123')}
                className="p-3 rounded-2xl bg-sky-50/80 hover:bg-sky-100 border border-sky-200 hover:border-sky-400 text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-700 group-hover:text-sky-800">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Quản lý</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1 font-medium">admin@parking.vn</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff@parking.vn', 'staff123')}
                className="p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-400 text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Nhân viên</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1 font-medium">staff@parking.vn</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('khachhang@gmail.com', 'customer123')}
                className="p-3 rounded-2xl bg-cyan-50/80 hover:bg-cyan-100 border border-cyan-200 hover:border-cyan-400 text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700 group-hover:text-cyan-800">
                  <Bike className="w-4 h-4 text-cyan-600" />
                  <span>Khách hàng</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1 font-medium">khachhang@...</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ai@parking.vn', 'ai123')}
                className="p-3 rounded-2xl bg-purple-50/80 hover:bg-purple-100 border border-purple-200 hover:border-purple-400 text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 group-hover:text-purple-800">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>AI Engine</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1 font-medium">ai@parking.vn</p>
              </button>
            </div>

            <div className="mt-5 text-center">
              <Link
                to="/customer-portal"
                className="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1.5"
              >
                <span>👉 Hoặc truy cập nhanh Cổng Tra cứu Khách hàng (Không cần đăng nhập)</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
