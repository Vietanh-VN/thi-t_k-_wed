import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Bike,
  LogIn,
  LogOut,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Bot,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#06b6d4', '#3b82f6'];

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [hourlyTraffic, setHourlyTraffic] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [zoneStats, setZoneStats] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [ovRes, hrRes, wkRes, znRes, vtRes, actRes] = await Promise.all([
        api.get('/stats/overview'),
        api.get('/stats/hourly'),
        api.get('/stats/7-days'),
        api.get('/stats/zones'),
        api.get('/stats/vehicle-types'),
        api.get('/parking/active-sessions'),
      ]);
      setOverview(ovRes.data);
      setHourlyTraffic(hrRes.data);
      setWeeklyTrend(wkRes.data);
      setZoneStats(znRes.data);
      setVehicleStats(vtRes.data);
      setActiveSessions(actRes.data.slice(0, 6)); // Lấy 6 xe gần nhất
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 20000); // Polling mỗi 20s
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500">Đang đồng bộ dữ liệu bãi đỗ xe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Actions - Ocean Blue Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-sky-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-sky-100 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Trung tâm Điều hành Bãi Đỗ Xe Thông Minh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs uppercase">TỔNG QUAN HOẠT ĐỘNG & LƯU LƯỢNG</h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            Theo dõi thời gian thực tình trạng vị trí đỗ, lượt xe vào/ra, doanh thu và cảnh báo giờ cao điểm từ AI.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center space-x-1.5 transition-all"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Làm mới</span>
          </button>
          <Link
            to="/check-in"
            className="px-4 py-2.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 text-xs font-extrabold shadow-md flex items-center space-x-2 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4 text-sky-600" />
            <span>Ghi nhận Xe Vào</span>
          </Link>
          <Link
            to="/check-out"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-900 text-xs font-extrabold shadow-md flex items-center space-x-2 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Ghi nhận Xe Ra</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng chỗ & Lấp đầy */}
        <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tình trạng chỗ đỗ</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{overview?.SoViTriDangSuDung}</span>
            <span className="text-sm font-semibold text-slate-400">/ {overview?.TongSoViTri} vị trí</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-500">Tỷ lệ lấp đầy</span>
              <span className="text-sky-600 font-bold">{overview?.TyLeLapDay}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(overview?.TyLeLapDay || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Chỗ trống sẵn sàng */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Chỗ trống sẵn sàng</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600">{overview?.SoViTriTrong}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Có thể tiếp nhận
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center space-x-1">
            <span>Bảo trì:</span>
            <span className="font-bold text-amber-600">{overview?.SoViTriBaoTri} vị trí</span>
          </p>
        </div>

        {/* Card 3: Lượt xe hôm nay */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lượt xe hôm nay</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {(overview?.TongLuotXeVaoHomNay || 0) + (overview?.TongLuotXeRaHomNay || 0)}
            </span>
            <span className="text-xs text-slate-500 font-medium">lượt vào/ra</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-1 text-indigo-600">
              <LogIn className="w-3.5 h-3.5" />
              <span>Vào: <strong>{overview?.TongLuotXeVaoHomNay}</strong></span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600">
              <LogOut className="w-3.5 h-3.5" />
              <span>Ra: <strong>{overview?.TongLuotXeRaHomNay}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 4: Doanh thu hôm nay */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Doanh thu hôm nay</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-amber-600">
              {overview?.DoanhThuHomNay?.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs font-bold text-slate-500">đ</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
            Doanh thu tháng này: <strong className="text-slate-800">{overview?.DoanhThuThangNay?.toLocaleString('vi-VN')} đ</strong>
          </p>
        </div>
      </div>

      {/* AI Smart Alert Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">AI Phân tích Vận hành:</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-200/60 text-indigo-800 font-semibold">
                Khung giờ cao điểm: {overview?.KhungGioCaoDiemNhat}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Khu vực có mật độ đỗ cao nhất: <strong className="text-indigo-950">{overview?.KhuVucDongNhat}</strong>. AI khuyến nghị tăng cường nhân sự điều tiết cổng ra vào.
            </p>
          </div>
        </div>
        <Link
          to="/ai-assistant"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors self-start md:self-auto flex-shrink-0"
        >
          <span>Xem Báo cáo AI</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Traffic Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Lưu Lượng Phương Tiện Theo Giờ (0h - 23h)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Biểu đồ tổng lượt xe vào và ra trong từng khung giờ hôm nay</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
              Hôm nay
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Gio" tickFormatter={(val) => `${val}h`} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val, name) => [val, name === 'SoXeVao' ? 'Xe Vào' : name === 'SoXeRa' ? 'Xe Ra' : 'Tổng Lượt']}
                  labelFormatter={(val) => `Khung giờ ${val}:00 - ${Number(val) + 1}:00`}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend formatter={(val) => (val === 'SoXeVao' ? 'Xe Vào' : 'Xe Ra')} />
                <Bar dataKey="SoXeVao" name="SoXeVao" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SoXeRa" name="SoXeRa" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Occupancy List (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Tỷ Lệ Lấp Đầy Khu Vực</h2>
              <Link to="/parking-map" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center">
                <span>Xem bản đồ</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <div className="space-y-3.5">
              {zoneStats.map((zone) => (
                <div key={zone.KhuVucId} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-800">{zone.TenKhuVuc}</span>
                    <span className="font-extrabold text-indigo-600">{zone.TyLeLapDay}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        zone.TyLeLapDay > 80 ? 'bg-rose-500' : zone.TyLeLapDay > 50 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(zone.TyLeLapDay, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Đang đỗ: <strong>{zone.SoChoDangDung}</strong></span>
                    <span>Còn trống: <strong className="text-emerald-600">{zone.SoChoTrong}</strong></span>
                    <span>Tổng: {zone.TongSoCho}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Vé tháng hoạt động:</span>
            <strong className="text-indigo-600 font-bold">{overview?.TongVeThangHoatDong} xe</strong>
          </div>
        </div>
      </div>

      {/* Bottom Grid: 7 Days Trend & Active Vehicles Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7 Days Revenue Trend (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Xu Hướng Doanh Thu 7 Ngày</h2>
              <p className="text-xs text-slate-500 mt-0.5">Biểu đồ tổng hợp doanh thu trong tuần</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Thu" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip
                  formatter={(val) => [`${Number(val).toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']}
                  labelFormatter={(val, items) => {
                    const item = items[0]?.payload;
                    return `${item?.Thu} (${item?.Ngay})`;
                  }}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="DoanhThu" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Parked Vehicles Feed (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Phương Tiện Đang Gửi ({overview?.SoXeDangGui} xe)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Danh sách các xe đang đỗ thực tế trong bãi</p>
            </div>
            <Link to="/check-out" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center">
              <span>Xử lý xe ra</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {activeSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Hiện không có xe nào đang gửi trong bãi.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-2.5">Biển số</th>
                    <th className="pb-2.5">Loại xe</th>
                    <th className="pb-2.5">Vị trí</th>
                    <th className="pb-2.5">Giờ vào</th>
                    <th className="pb-2.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSessions.map((s) => (
                    <tr key={s.LuotGuiId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-bold text-slate-900">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                          {s.BienSo}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600">{s.TenLoaiXe}</td>
                      <td className="py-2.5 font-semibold text-indigo-600">{s.TenViTri}</td>
                      <td className="py-2.5 text-slate-500">
                        {new Date(s.ThoiGianVao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                          Đang đỗ
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
