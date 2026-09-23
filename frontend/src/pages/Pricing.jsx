import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MOCK_PRICING, MOCK_VEHICLE_TYPES } from '../services/mockData';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Sun,
  SunMedium,
  Moon,
  MoonStar,
  Lock,
  Calendar,
  Home,
  Clock,
  Sparkles,
  Bike
} from 'lucide-react';

const Pricing = () => {
  const [pricings, setPricings] = useState(() => MOCK_PRICING);
  const [vehicleTypes, setVehicleTypes] = useState(() => MOCK_VEHICLE_TYPES);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [form, setForm] = useState({
    LoaiXeId: 1,
    NoiDungDichVu: '',
    TuGio: '',
    DenGio: '',
    DonGia: 2000,
    DonViTinh: 'đ',
    TrangThai: true,
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [prRes, vtRes] = await Promise.all([
        api.get('/pricing'),
        api.get('/vehicle-types'),
      ]);
      if (prRes.data && Array.isArray(prRes.data) && prRes.data.length > 0) {
        setPricings(prRes.data);
      }
      if (vtRes.data && Array.isArray(vtRes.data) && vtRes.data.length > 0) {
        setVehicleTypes(vtRes.data);
      }
    } catch (e) {
      console.warn("Backend offline, sử dụng bảng giá ICTU mặc định:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      BangGiaId: editingPricing ? editingPricing.BangGiaId : Date.now(),
      LoaiXeId: Number(form.LoaiXeId),
      TenLoaiXe: 'Xe máy / Xe điện',
      NoiDungDichVu: form.NoiDungDichVu ? form.NoiDungDichVu.trim().toUpperCase() : 'DỊCH VỤ MỚI',
      TuGio: form.TuGio || null,
      DenGio: form.DenGio || null,
      DonGia: Number(form.DonGia),
      DonViTinh: form.DonViTinh || 'đ',
      TrangThai: form.TrangThai,
    };

    try {
      if (editingPricing) {
        await api.put(`/pricing/${editingPricing.BangGiaId}`, payload);
      } else {
        await api.post('/pricing', payload);
      }
    } catch {
      // Fallback client-side update
    }

    if (editingPricing) {
      setPricings((prev) => prev.map((p) => (p.BangGiaId === editingPricing.BangGiaId ? { ...p, ...payload } : p)));
      setMsg({ type: 'success', text: 'Cập nhật mức giá thành công!' });
    } else {
      setPricings((prev) => [...prev, payload]);
      setMsg({ type: 'success', text: 'Thêm mức giá mới thành công!' });
    }

    setIsModalOpen(false);
    setEditingPricing(null);
  };

  const handleDelete = async (pricingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cấu hình giá này?')) return;
    try {
      await api.delete(`/pricing/${pricingId}`);
    } catch {
      // Fallback client-side
    }
    setPricings((prev) => prev.filter((p) => p.BangGiaId !== pricingId));
    setMsg({ type: 'success', text: 'Đã xóa cấu hình giá thành công.' });
  };

  const getPriceIcon = (noiDung) => {
    const text = (noiDung || '').toUpperCase();
    if (text.includes('SÁNG')) return <Sun className="w-5 h-5 text-amber-500" />;
    if (text.includes('CHIỀU')) return <SunMedium className="w-5 h-5 text-orange-500" />;
    if (text.includes('TỐI')) return <Moon className="w-5 h-5 text-indigo-500" />;
    if (text.includes('ĐÊM')) return <MoonStar className="w-5 h-5 text-purple-600" />;
    if (text.includes('MẤT VÉ')) return <Lock className="w-5 h-5 text-rose-500" />;
    if (text.includes('THÁNG QUA ĐÊM') || text.includes('NHÀ XE')) return <Home className="w-5 h-5 text-teal-600" />;
    if (text.includes('THÁNG')) return <Calendar className="w-5 h-5 text-blue-600" />;
    return <DollarSign className="w-5 h-5 text-sky-600" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <DollarSign className="w-7 h-7 text-sky-600" />
            <span>Quản Lý Bảng Giá Dịch Vụ Gửi Xe</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bảng giá thu phí dịch vụ gửi xe máy & xe điện áp dụng tại Nhà xe Trường Đại học CNTT & Truyền thông - ĐH Thái Nguyên (ICTU).
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPricing(null);
            setForm({
              LoaiXeId: 1,
              NoiDungDichVu: '',
              TuGio: '',
              DenGio: '',
              DonGia: 2000,
              DonViTinh: 'đ',
              TrangThai: true,
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mức Giá Mới</span>
        </button>
      </div>

      {/* Alert Messages */}
      {msg.text && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold ${
            msg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg({ type: '', text: '' })} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BIỂN BẢNG GIÁ THỰC TẾ ICTU */}
      <div className="bg-white rounded-3xl border-2 border-sky-600/30 shadow-xl overflow-hidden">
        {/* Banner trường */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-center items-center gap-3 mb-2">
            <img src="./logo-ictu.png" alt="ICTU" className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md" />
            <div className="text-left">
              <p className="text-[11px] font-bold tracking-widest text-sky-200 uppercase">ĐẠI HỌC THÁI NGUYÊN</p>
              <p className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase">
                TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight mt-3 uppercase drop-shadow-sm">
            BẢNG GIÁ THU PHÍ DỊCH VỤ GỬI XE
          </h2>
          <p className="text-xs text-sky-200 mt-1 font-medium">
            (Áp dụng cho toàn bộ sinh viên, cán bộ giảng viên và khách vãng lai)
          </p>
        </div>

        {/* Danh sách các mức giá dạng bảng chuẩn biển thực tế */}
        <div className="p-6 divide-y divide-slate-100">
          {pricings.map((p, idx) => (
            <div
              key={p.BangGiaId || idx}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sky-50/50 px-4 rounded-2xl transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                  {getPriceIcon(p.NoiDungDichVu)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-wide">
                      {p.NoiDungDichVu || p.TenLoaiXe}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.TrangThai ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.TrangThai ? 'Áp dụng' : 'Tạm dừng'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {p.TuGio && p.DenGio ? (
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" />
                        Khung giờ: {p.TuGio} - {p.DenGio}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Áp dụng: Toàn thời gian</span>
                    )}
                    {p.MoTa && <span className="text-[11px] text-slate-400">• {p.MoTa}</span>}
                  </div>
                </div>
              </div>

              {/* Price Tag & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                    {Number(p.DonGia || p.GiaTien || 2000).toLocaleString('vi-VN')} {p.DonViTinh || 'đ'}
                  </span>
                </div>

                <div className="flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingPricing(p);
                      setForm({
                        LoaiXeId: p.LoaiXeId || 1,
                        NoiDungDichVu: p.NoiDungDichVu || '',
                        TuGio: p.TuGio || '',
                        DenGio: p.DenGio || '',
                        DonGia: p.DonGia || p.GiaTien || 2000,
                        DonViTinh: p.DonViTinh || 'đ',
                        TrangThai: p.TrangThai !== undefined ? p.TrangThai : true,
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    title="Chỉnh sửa mức giá này"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.BangGiaId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa mức giá này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Khẩu hiệu dưới chân biển trường ICTU */}
        <div className="bg-sky-700 text-white py-3 px-6 text-center text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2">
          <span>ĐỔI MỚI</span>
          <span>|</span>
          <span>SÁNG TẠO</span>
          <span>|</span>
          <span>TẬN TÂM</span>
          <span>|</span>
          <span>ĐOÀN KẾT</span>
        </div>
      </div>

      {/* Modal Add/Edit Pricing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingPricing ? 'CHỈNH SỬA MỨC GIÁ DỊCH VỤ' : 'THÊM MỨC GIÁ MỚI'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên dịch vụ / Khung giờ *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: BUỔI SÁNG, XE GỬI QUA ĐÊM..."
                  value={form.NoiDungDichVu}
                  onChange={(e) => setForm({ ...form, NoiDungDichVu: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Từ giờ (tùy chọn)</label>
                  <input
                    type="time"
                    value={form.TuGio}
                    onChange={(e) => setForm({ ...form, TuGio: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đến giờ (tùy chọn)</label>
                  <input
                    type="time"
                    value={form.DenGio}
                    onChange={(e) => setForm({ ...form, DenGio: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức giá thu (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500"
                    value={form.DonGia}
                    onChange={(e) => setForm({ ...form, DonGia: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn vị tính</label>
                  <input
                    type="text"
                    value={form.DonViTinh}
                    onChange={(e) => setForm({ ...form, DonViTinh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="trangThai"
                  checked={form.TrangThai}
                  onChange={(e) => setForm({ ...form, TrangThai: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="trangThai" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt mức giá này ngay
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-md"
                >
                  Lưu cấu hình
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
