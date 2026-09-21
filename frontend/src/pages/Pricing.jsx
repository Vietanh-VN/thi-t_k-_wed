import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Car,
  Clock
} from 'lucide-react';

const Pricing = () => {
  const [pricings, setPricings] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [form, setForm] = useState({
    LoaiXeId: 1,
    NoiDungDichVu: '',
    TuGio: '',
    DenGio: '',
    DonGia: 2000,
    DonViTinh: 'Luot',
    TrangThai: true,
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [prRes, vtRes] = await Promise.all([
        api.get('/pricing'),
        api.get('/vehicle-types'),
      ]);
      setPricings(prRes.data);
      setVehicleTypes(vtRes.data);
      if (vtRes.data.length > 0 && !editingPricing) {
        setForm((prev) => ({ ...prev, LoaiXeId: vtRes.data[0].LoaiXeId }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        NoiDungDichVu: form.NoiDungDichVu ? form.NoiDungDichVu.trim() : null,
        DonGia: Number(form.DonGia),
        DonViTinh: form.DonViTinh,
        TrangThai: form.TrangThai,
        TuGio: form.TuGio ? form.TuGio : null,
        DenGio: form.DenGio ? form.DenGio : null,
      };

      if (editingPricing) {
        await api.put(`/pricing/${editingPricing.BangGiaId}`, payload);
        setMsg({ type: 'success', text: 'Cập nhật mức giá thành công!' });
      } else {
        await api.post('/pricing', {
          ...payload,
          LoaiXeId: Number(form.LoaiXeId),
        });
        setMsg({ type: 'success', text: 'Thêm mức giá mới thành công!' });
      }
      setIsModalOpen(false);
      setEditingPricing(null);
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Lỗi khi lưu bảng giá.' });
    }
  };

  const handleDelete = async (pricingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cấu hình giá này?')) return;
    try {
      await api.delete(`/pricing/${pricingId}`);
      setMsg({ type: 'success', text: 'Đã xóa cấu hình giá.' });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa bảng giá.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <DollarSign className="w-7 h-7 text-indigo-600" />
            <span>Quản Lý Bảng Giá Dịch Vụ Gửi Xe</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cấu hình đơn giá theo từng loại phương tiện, khung thời gian áp dụng (Từ giờ - Đến giờ) và đơn vị tính.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPricing(null);
            setForm({
              LoaiXeId: vehicleTypes[0]?.LoaiXeId || 1,
              NoiDungDichVu: '',
              TuGio: '',
              DenGio: '',
              DonGia: 2000,
              DonViTinh: 'Luot',
              TrangThai: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mức Giá Mới</span>
        </button>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pricings.map((p) => (
          <div
            key={p.BangGiaId}
            className={`p-6 rounded-3xl border-2 transition-all bg-white shadow-sm flex flex-col justify-between ${
              p.TrangThai ? 'border-indigo-200 hover:border-indigo-400' : 'border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5" />
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.TrangThai ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {p.TrangThai ? 'Đang áp dụng' : 'Tạm dừng'}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">{p.TenLoaiXe}</h3>
              {p.NoiDungDichVu && (
                <p className="text-xs font-bold text-indigo-600 mt-0.5">{p.NoiDungDichVu}</p>
              )}

              {/* Khung giờ áp dụng theo Bảng 1 & Bảng 2 */}
              <div className="mt-2">
                {p.TuGio && p.DenGio ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Khung giờ: {p.TuGio} - {p.DenGio}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Áp dụng: Cả ngày</span>
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-indigo-600">
                  {p.DonGia?.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs font-bold text-slate-500">VNĐ / {p.DonViTinh}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">ID: #{p.BangGiaId}</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setEditingPricing(p);
                    setForm({
                      LoaiXeId: p.LoaiXeId,
                      TuGio: p.TuGio || '',
                      DenGio: p.DenGio || '',
                      DonGia: p.DonGia,
                      DonViTinh: p.DonViTinh,
                      TrangThai: p.TrangThai,
                    });
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Sửa mức giá"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.BangGiaId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Xóa mức giá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Pricing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingPricing ? 'CHỈNH SỬA MỨC GIÁ' : 'THÊM MỨC GIÁ MỚI'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              {!editingPricing && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại phương tiện *</label>
                  <select
                    value={form.LoaiXeId}
                    onChange={(e) => setForm({ ...form, LoaiXeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {vehicleTypes.map((t) => (
                      <option key={t.LoaiXeId} value={t.LoaiXeId}>
                        {t.TenLoaiXe}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Khung giờ áp dụng (TuGio & DenGio theo Bảng 1) */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800">
                  Khung thời gian áp dụng (Bảng 1 - Cấu trúc BangGia)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Từ giờ (TuGio)</label>
                    <input
                      type="time"
                      value={form.TuGio || ''}
                      onChange={(e) => setForm({ ...form, TuGio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Đến giờ (DenGio)</label>
                    <input
                      type="time"
                      value={form.DenGio || ''}
                      onChange={(e) => setForm({ ...form, DenGio: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  * Ví dụ mẫu: 06:30 - 12:45, 12:45 - 17:30, hoặc 19:00 - 05:50 (qua đêm). Để trống nếu áp dụng cả ngày.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đơn giá (VNĐ) *</label>
                <input
                  type="number"
                  required
                  step="500"
                  min="0"
                  value={form.DonGia}
                  onChange={(e) => setForm({ ...form, DonGia: e.target.value })}
                  placeholder="2000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đơn vị tính *</label>
                <select
                  value={form.DonViTinh}
                  onChange={(e) => setForm({ ...form, DonViTinh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Luot">Theo Lượt Cố Định (VD: 2.000 đ/lượt)</option>
                  <option value="Gio">Theo Giờ (Block 1h)</option>
                  <option value="NgayDem">Theo Ngày Đêm (24h)</option>
                  <option value="Thang">Theo Tháng (30 ngày)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="trangThaiCheck"
                  checked={form.TrangThai}
                  onChange={(e) => setForm({ ...form, TrangThai: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="trangThaiCheck" className="font-bold text-slate-700">
                  Đang kích hoạt áp dụng
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Lưu Bảng Giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
