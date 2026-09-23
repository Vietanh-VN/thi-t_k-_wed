import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  History as HistoryIcon,
  Search,
  Calendar,
  Download,
  Filter,
  Bike,
  Clock,
  DollarSign,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plate, setPlate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      if (plate) params.license_plate = plate.trim();
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (statusFilter) params.status_filter = statusFilter;

      const res = await api.get('/history', { params });
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Mã Lượt', 'Biển Số', 'Loại Xe', 'Vị Trí', 'Khu Vực', 'Thời Gian Vào', 'Thời Gian Ra', 'Phí Gửi (VNĐ)', 'Trạng Thái'];
    const rows = history.map((item) => [
      item.LuotGuiId,
      item.BienSo,
      item.TenLoaiXe,
      item.TenViTri,
      item.TenKhuVuc,
      new Date(item.ThoiGianVao).toLocaleString('vi-VN'),
      item.ThoiGianRa ? new Date(item.ThoiGianRa).toLocaleString('vi-VN') : 'Đang gửi',
      item.PhiGuiXe,
      item.TrangThai === 'HoanThanh' ? 'Hoàn thành' : 'Đang gửi',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lich_su_gui_xe_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFeeSum = history.reduce((sum, item) => sum + (item.PhiGuiXe || 0), 0);
  const completedCount = history.filter((item) => item.TrangThai === 'HoanThanh').length;
  const activeCount = history.filter((item) => item.TrangThai === 'DangGui').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <HistoryIcon className="w-7 h-7 text-indigo-600" />
            <span>Tra Cứu Lịch Sử Gửi Xe Toàn Diện</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tìm kiếm mọi lượt xe vào/ra theo biển số, khoảng thời gian và xuất báo cáo dữ liệu dạng CSV.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={history.length === 0}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo Cáo CSV</span>
        </button>
      </div>

      {/* Filter Box */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Biển số xe</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Nhập biển số cần tìm..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Trạng thái:</span>
            <button
              onClick={() => setStatusFilter('')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === '' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({history.length})
            </button>
            <button
              onClick={() => setStatusFilter('DangGui')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'DangGui' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang gửi ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('HoanThanh')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'HoanThanh' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đã hoàn thành ({completedCount})
            </button>
          </div>

          <div className="text-slate-500">
            Tổng thu lượt lọc: <strong className="text-amber-600 font-bold">{totalFeeSum.toLocaleString('vi-VN')} đ</strong>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Mã</th>
                <th className="py-3 px-4">Biển số</th>
                <th className="py-3 px-4">Loại xe</th>
                <th className="py-3 px-4">Vị trí đỗ</th>
                <th className="py-3 px-4">Thời gian vào</th>
                <th className="py-3 px-4">Thời gian ra</th>
                <th className="py-3 px-4">Phí thu</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy lượt gửi xe nào trong khoảng thời gian này.
                  </td>
                </tr>
              ) : (
                history.map((s) => {
                  const isDone = s.TrangThai === 'HoanThanh';
                  return (
                    <tr key={s.LuotGuiId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">#{s.LuotGuiId}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {s.BienSo}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{s.TenLoaiXe}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">
                        {s.TenViTri} <span className="text-[10px] text-slate-400">({s.TenKhuVuc})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {new Date(s.ThoiGianVao).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {s.ThoiGianRa ? new Date(s.ThoiGianRa).toLocaleString('vi-VN') : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                        {s.PhiGuiXe > 0 ? `${s.PhiGuiXe.toLocaleString('vi-VN')} đ` : '0 đ (Vé tháng)'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse'
                          }`}
                        >
                          {isDone ? 'Đã xuất bãi' : 'Đang trong bãi'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
