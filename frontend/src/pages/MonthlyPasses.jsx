import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  CreditCard,
  Search,
  Plus,
  RotateCw,
  Trash2,
  Calendar,
  User,
  Phone,
  Car,
  CheckCircle2,
  AlertCircle,
  X,
  Filter
} from 'lucide-react';

const DEFAULT_VEHICLE_TYPES = [
  { LoaiXeId: 1, TenLoaiXe: 'Xe máy', MoTa: 'Xe máy số, xe tay ga và xe hai bánh' },
  { LoaiXeId: 2, TenLoaiXe: 'Xe điện', MoTa: 'Xe máy điện, xe đạp điện có trạm sạc' }
];

const MonthlyPasses = () => {
  const [passes, setPasses] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState(DEFAULT_VEHICLE_TYPES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // Add form state
  const [addForm, setAddForm] = useState({
    BienSo: '',
    LoaiXeId: 1,
    TenKhachHang: '',
    SoDienThoai: '',
    NgayBatDau: new Date().toISOString().split('T')[0],
    SoThang: 1,
    GoiVe: 'Ngay', // 'Ngay' (80.000 đ/tháng) hoặc 'QuaDem' (100.000 đ/tháng)
  });

  // Renew form state
  const [renewMonths, setRenewMonths] = useState(1);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchPasses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status_filter = statusFilter;
      const [res, vtRes] = await Promise.all([
        api.get('/monthly-passes', { params }),
        api.get('/vehicle-types'),
      ]);
      setPasses(res.data);
      setVehicleTypes(vtRes.data);
      if (vtRes.data.length > 0) {
        setAddForm((prev) => ({ ...prev, LoaiXeId: vtRes.data[0].LoaiXeId }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, [search, statusFilter]);

  const handleCreatePass = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    try {
      const payload = {
        BienSo: addForm.BienSo.trim().toUpperCase(),
        LoaiXeId: Number(addForm.LoaiXeId),
        TenKhachHang: addForm.TenKhachHang?.trim() || null,
        SoDienThoai: addForm.SoDienThoai?.trim() || null,
        NgayBatDau: addForm.NgayBatDau,
        SoThang: Number(addForm.SoThang),
        GoiVe: addForm.GoiVe || 'Ngay',
        GiaTien: (addForm.GoiVe === 'QuaDem' ? 100000 : 80000) * Number(addForm.SoThang),
      };
      await api.post('/monthly-passes', payload);
      setIsAddOpen(false);
      setActionSuccess(`Đăng ký vé tháng thành công cho xe ${addForm.BienSo.toUpperCase()}!`);
      setAddForm({
        BienSo: '',
        LoaiXeId: 1,
        TenKhachHang: '',
        SoDienThoai: '',
        NgayBatDau: new Date().toISOString().split('T')[0],
        SoThang: 1,
        GoiVe: 'Ngay',
      });
      fetchPasses();
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = 'Đăng ký vé tháng thất bại.';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      }
      setActionError(msg);
    }
  };

  const handleRenewPass = async (e) => {
    e.preventDefault();
    if (!selectedPass) return;
    setActionError('');
    setActionSuccess('');
    try {
      await api.post(`/monthly-passes/${selectedPass.VeThangId}/renew`, {
        SoThang: Number(renewMonths),
      });
      setIsRenewOpen(false);
      setActionSuccess(`Gia hạn vé tháng thành công cho xe ${selectedPass.BienSo}!`);
      fetchPasses();
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Gia hạn vé tháng thất bại.');
    }
  };

  const handleCancelPass = async (passId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé tháng này không?')) return;
    try {
      await api.delete(`/monthly-passes/${passId}`);
      setActionSuccess('Đã hủy vé tháng.');
      fetchPasses();
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể hủy vé tháng.');
    }
  };

  const activeCount = passes.filter((p) => p.TrangThai === 'ConHan').length;
  const expiredCount = passes.filter((p) => p.TrangThai === 'HetHan').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            <span>Quản Lý Vé Tháng Phương Tiện</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đăng ký mới, gia hạn và kiểm soát thời hạn thẻ gửi xe định kỳ cho khách hàng thân thiết.
          </p>
        </div>
        <button
          onClick={() => {
            setActionError('');
            setIsAddOpen(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng ký Vé Tháng Mới</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Tổng số vé tháng</span>
            <span className="text-2xl font-extrabold text-slate-900">{passes.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 font-semibold block">Vé đang còn hạn</span>
            <span className="text-2xl font-extrabold text-emerald-700">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-800 font-semibold block">Vé đã hết hạn</span>
            <span className="text-2xl font-extrabold text-rose-700">{expiredCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm biển số, chủ xe, SĐT..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ConHan">🟢 Còn hạn</option>
            <option value="HetHan">🔴 Hết hạn</option>
            <option value="Huy">⚪ Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Monthly Passes Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Mã vé</th>
                <th className="py-3 px-4">Biển số</th>
                <th className="py-3 px-4">Loại xe</th>
                <th className="py-3 px-4">Gói vé tháng</th>
                <th className="py-3 px-4">Khách hàng / SĐT</th>
                <th className="py-3 px-4">Ngày bắt đầu</th>
                <th className="py-3 px-4">Ngày hết hạn</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không tìm thấy vé tháng nào phù hợp.
                  </td>
                </tr>
              ) : (
                passes.map((p) => {
                  const isConHan = p.TrangThai === 'ConHan';
                  return (
                    <tr key={p.VeThangId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{p.VeThangId}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-900">
                          {p.BienSo}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{p.TenLoaiXe}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.GoiVe === 'QuaDem'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {p.GoiVe === 'QuaDem' ? '🌙 Qua đêm (100k)' : '☀️ Gói ngày (80k)'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{p.TenKhachHang || 'Chưa cập nhật'}</p>
                        <p className="text-[11px] text-slate-400">{p.SoDienThoai}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.NgayBatDau}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.NgayHetHan}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isConHan
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.TrangThai === 'HetHan'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isConHan ? 'Còn hạn' : p.TrangThai === 'HetHan' ? 'Hết hạn' : 'Đã hủy'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedPass(p);
                              setIsRenewOpen(true);
                              setActionError('');
                            }}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center space-x-1 transition-colors"
                            title="Gia hạn vé"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Gia hạn</span>
                          </button>
                          {isConHan && (
                            <button
                              onClick={() => handleCancelPass(p.VeThangId)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Hủy vé"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Pass */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">ĐĂNG KÝ VÉ THÁNG MỚI</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">{actionError}</div>
            )}

            <form onSubmit={handleCreatePass} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Biển số xe *</label>
                <input
                  type="text"
                  required
                  value={addForm.BienSo}
                  onChange={(e) => setAddForm({ ...addForm, BienSo: e.target.value.toUpperCase() })}
                  placeholder="VD: 20B1-12345 hoặc 29MD-44556"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại phương tiện *</label>
                <select
                  value={addForm.LoaiXeId}
                  onChange={(e) => setAddForm({ ...addForm, LoaiXeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  {vehicleTypes.map((t) => (
                    <option key={t.LoaiXeId} value={t.LoaiXeId}>
                      {t.TenLoaiXe}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ tên chủ xe</label>
                  <input
                    type="text"
                    value={addForm.TenKhachHang}
                    onChange={(e) => setAddForm({ ...addForm, TenKhachHang: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={addForm.SoDienThoai}
                    onChange={(e) => setAddForm({ ...addForm, SoDienThoai: e.target.value })}
                    placeholder="0987654321"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
                    value={addForm.NgayBatDau}
                    onChange={(e) => setAddForm({ ...addForm, NgayBatDau: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời hạn đăng ký</label>
                  <select
                    value={addForm.SoThang}
                    onChange={(e) => setAddForm({ ...addForm, SoThang: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value={1}>1 tháng (30 ngày)</option>
                    <option value={3}>3 tháng (90 ngày)</option>
                    <option value={6}>6 tháng (180 ngày)</option>
                    <option value={12}>12 tháng (365 ngày)</option>
                  </select>
                </div>
              </div>

              {/* Gói vé tháng ngày hoặc qua đêm */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gói vé tháng *</label>
                <select
                  value={addForm.GoiVe}
                  onChange={(e) => setAddForm({ ...addForm, GoiVe: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Ngay">Gói xe gửi theo tháng thông thường - 80.000 VNĐ/tháng</option>
                  <option value="QuaDem">Gói xe gửi theo tháng qua đêm tại nhà xe - 100.000 VNĐ/tháng</option>
                </select>
              </div>

              {/* Tổng tiền dự kiến */}
              <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold">Thành tiền thanh toán:</span>
                <span className="text-indigo-700 font-extrabold text-sm">
                  {((addForm.GoiVe === 'QuaDem' ? 100000 : 80000) * Number(addForm.SoThang)).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Lưu Đăng Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Renew Pass */}
      {isRenewOpen && selectedPass && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">GIA HẠN VÉ THÁNG</h3>
              <button onClick={() => setIsRenewOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">{actionError}</div>
            )}

            <form onSubmit={handleRenewPass} className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p>
                  Biển số xe: <strong className="font-mono text-slate-900">{selectedPass.BienSo}</strong>
                </p>
                <p>
                  Chủ xe: <strong>{selectedPass.TenKhachHang}</strong>
                </p>
                <p>
                  Hạn hiện tại: <strong className="text-indigo-600">{selectedPass.NgayHetHan}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gia hạn thêm</label>
                <select
                  value={renewMonths}
                  onChange={(e) => setRenewMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value={1}>Gia hạn +1 tháng (30 ngày)</option>
                  <option value={3}>Gia hạn +3 tháng (90 ngày)</option>
                  <option value={6}>Gia hạn +6 tháng (180 ngày)</option>
                  <option value={12}>Gia hạn +12 tháng (1 năm)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsRenewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30"
                >
                  Xác nhận Gia hạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPasses;
