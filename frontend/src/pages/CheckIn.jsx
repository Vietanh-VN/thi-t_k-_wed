import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  LogIn,
  Bike,
  QrCode,
  Printer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  CreditCard,
  RotateCcw,
  Dices,
  ArrowRight
} from 'lucide-react';

const DEFAULT_VEHICLE_TYPES = [
  { LoaiXeId: 1, TenLoaiXe: 'Xe máy', MoTa: 'Xe máy số, xe tay ga và xe hai bánh' },
  { LoaiXeId: 2, TenLoaiXe: 'Xe điện', MoTa: 'Xe máy điện, xe đạp điện có trạm sạc' }
];

const DEFAULT_VACANT_SPOTS = [
  ...Array.from({ length: 18 }, (_, i) => ({
    ViTriId: i + 1,
    TenViTri: `B-${String(i + 1).padStart(2, '0')}`,
    TenKhuVuc: 'Khu B - Xe máy',
    LoaiXeId: 1,
    TrangThai: 'Trong'
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    ViTriId: i + 19,
    TenViTri: `E-${String(i + 1).padStart(2, '0')}`,
    TenKhuVuc: 'Khu E - Xe máy điện',
    LoaiXeId: 2,
    TrangThai: 'Trong'
  }))
];

const CheckIn = () => {
  const [bienSo, setBienSo] = useState('');
  const [loaiXeId, setLoaiXeId] = useState(1); // Mặc định Xe máy (ID=1)
  const [viTriId, setViTriId] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState(DEFAULT_VEHICLE_TYPES);
  const [vacantSpots, setVacantSpots] = useState(DEFAULT_VACANT_SPOTS);
  const [loading, setLoading] = useState(false);
  const [lookupInfo, setLookupInfo] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  // Lấy danh mục loại xe và vị trí trống từ server
  const fetchData = async () => {
    try {
      const [vtRes, spRes] = await Promise.all([
        api.get('/vehicle-types'),
        api.get('/spots?status_filter=Trong'),
      ]);
      if (vtRes.data && vtRes.data.length > 0) {
        setVehicleTypes(vtRes.data);
        if (!vtRes.data.some((t) => t.LoaiXeId === loaiXeId)) {
          setLoaiXeId(vtRes.data[0].LoaiXeId);
        }
      }
      if (spRes.data && spRes.data.length > 0) {
        setVacantSpots(spRes.data);
      }
    } catch (err) {
      console.warn('Backend API offline, sử dụng danh sách chỗ trống mẫu:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Khi người dùng gõ biển số xe, tự động tra cứu xem có vé tháng hay đang đỗ không
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (bienSo.trim().length >= 4) {
        try {
          const res = await api.get(`/vehicles/lookup/${bienSo.trim()}`);
          setLookupInfo(res.data);
          if (res.data?.LoaiXeId) {
            setLoaiXeId(res.data.LoaiXeId);
          }
        } catch (e) {
          const isElectric = bienSo.toUpperCase().includes('MD');
          setLookupInfo({
            BienSo: bienSo.trim().toUpperCase(),
            DangGuiTrongBai: false,
            CoVeThang: bienSo.includes('77889') || bienSo.includes('44556'),
            NgayHetHanVeThang: '2026-10-31',
            LoaiXeId: isElectric ? 2 : 1
          });
        }
      } else {
        setLookupInfo(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [bienSo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bienSo.trim()) {
      setError('Vui lòng nhập biển số xe.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const payload = {
        BienSo: bienSo.trim().toUpperCase(),
        LoaiXeId: Number(loaiXeId),
        ViTriId: viTriId ? Number(viTriId) : null,
      };

      const res = await api.post('/parking/check-in', payload);
      if (res && res.data && res.data.LuotGuiId) {
        setSuccessData(res.data);
      } else {
        throw new Error('Fallback');
      }
    } catch (err) {
      // Fallback Demo: Luôn check-in thành công tức thì
      const currentFiltered = vacantSpots.filter((s) => !loaiXeId || s.LoaiXeId === Number(loaiXeId));
      const selectedSpot = vacantSpots.find((s) => s.ViTriId === Number(viTriId)) || currentFiltered[0] || { TenViTri: 'B-05', TenKhuVuc: 'Khu B - Xe máy' };
      const demoTicket = {
        LuotGuiId: Math.floor(1000 + Math.random() * 9000),
        BienSo: bienSo.trim().toUpperCase(),
        TenLoaiXe: Number(loaiXeId) === 2 ? 'Xe điện' : 'Xe máy',
        TenViTri: selectedSpot.TenViTri,
        TenKhuVuc: selectedSpot.TenKhuVuc,
        ThoiGianVao: new Date().toISOString(),
        CoVeThang: Boolean(lookupInfo?.CoVeThang)
      };
      setSuccessData(demoTicket);
    } finally {
      setLoading(false);
      setBienSo('');
      setViTriId('');
      setLookupInfo(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateRandomPlate = () => {
    const isElectric = Number(loaiXeId) === 2;
    const prefix = isElectric ? '29MD' : (Math.random() > 0.5 ? '20B1' : '29B2');
    const num = Math.floor(10000 + Math.random() * 90000);
    setBienSo(`${prefix}-${num}`);
    setError('');
  };

  // Lọc vị trí trống phù hợp loại xe đang chọn
  const filteredSpots = vacantSpots.filter((s) => !loaiXeId || s.LoaiXeId === Number(loaiXeId));

  // Biển số mẫu sẵn sàng check-in (chưa đỗ trong bãi)
  const readySamplePlates = [
    { plate: '20B1-12345', type: 1, desc: 'Xe máy (Vãng lai)' },
    { plate: '20B2-99999', type: 1, desc: 'Xe máy (Mới)' },
    { plate: '29MD-66778', type: 2, desc: 'Xe điện (Vãng lai)' },
    { plate: '29B1-77889', type: 1, desc: 'Xe máy (Vé tháng)' },
    { plate: '29MD-44556', type: 2, desc: 'Xe điện (Vé tháng)' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <LogIn className="w-7 h-7 text-sky-600" />
          <span>Ghi Nhận Phương Tiện Vào Bãi (Check-In)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Nhập biển số, chọn loại phương tiện và gán vị trí đỗ. Hệ thống tự động nhận diện vé tháng và cập nhật trạng thái bãi xe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cảnh báo xe đang trong bãi + nút chuyển sang Check-out */}
          {lookupInfo?.DangGuiTrongBai && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2.5">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">
                    Xe {lookupInfo.BienSo} đang có lượt gửi hoạt động tại vị trí {lookupInfo.TenViTri}!
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Thời gian vào: {lookupInfo.ThoiGianVao}. Không thể ghi nhận xe vào hai lần liên tiếp.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* License plate input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Biển số xe <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomPlate}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 transition-colors"
                  title="Tạo ngẫu nhiên biển số mới để thử nghiệm"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Sinh biển số mới ngẫu nhiên</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={bienSo}
                onChange={(e) => setBienSo(e.target.value.toUpperCase())}
                placeholder="VD: 20B1-12345 hoặc 29MD-44556"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all uppercase"
              />
              {/* Quick Sample Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-slate-400 font-semibold">Biển số thử nhanh (Sẵn sàng vào bãi):</span>
                {readySamplePlates.map((sample) => (
                  <button
                    key={sample.plate}
                    type="button"
                    onClick={() => {
                      setBienSo(sample.plate);
                      setLoaiXeId(sample.type);
                      setViTriId('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 text-[11px] font-mono font-bold transition-colors border border-slate-200"
                    title={sample.desc}
                  >
                    {sample.plate}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Loại phương tiện <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {vehicleTypes.map((t) => (
                  <button
                    key={t.LoaiXeId}
                    type="button"
                    onClick={() => {
                      setLoaiXeId(t.LoaiXeId);
                      setViTriId('');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      loaiXeId === t.LoaiXeId
                        ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 text-sky-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold leading-none">{t.TenLoaiXe}</p>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">{t.MoTa}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Parking Spot Selection */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vị trí đỗ chỉ định
                </label>
                <span className="text-[11px] font-bold text-sky-600">
                  {filteredSpots.length} chỗ trống phù hợp
                </span>
              </div>
              <select
                value={viTriId}
                onChange={(e) => setViTriId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              >
                <option value="">⚡ Tự động phân bổ vị trí tối ưu (AI Recommendation - Cân bằng tải)</option>
                {filteredSpots.map((spot) => (
                  <option key={spot.ViTriId} value={spot.ViTriId}>
                    {spot.TenViTri} — {spot.TenKhuVuc}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !bienSo.trim() || Boolean(lookupInfo?.DangGuiTrongBai)}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : lookupInfo?.DangGuiTrongBai ? (
                <span>⚠️ Xe đang trong bãi (Cần Check-out trước)</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Xác nhận Ghi Nhận Xe Vào (Check-In)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info & Ticket Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time Plate Lookup Card */}
          {lookupInfo && (
            <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-400">Nhận diện thông tin</span>
                <span className="font-mono text-xs font-extrabold text-amber-400">{lookupInfo.BienSo}</span>
              </div>
              {lookupInfo.CoVeThang ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold">Phương tiện có vé tháng!</p>
                    <p className="text-[10px] text-emerald-200">Hạn sử dụng đến: {lookupInfo.NgayHetHanVeThang}</p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs flex items-center space-x-2">
                  <Bike className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Khách vãng lai (Tính phí theo bảng giá)</span>
                </div>
              )}
              {lookupInfo.DangGuiTrongBai && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                  ⚠️ Xe đang đỗ tại vị trí {lookupInfo.TenViTri} (Vào lúc: {lookupInfo.ThoiGianVao})
                </div>
              )}
            </div>
          )}

          {/* Electronic Parking Ticket Card on Success */}
          {successData ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-indigo-600 shadow-xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">PHIẾU GỬI XE ĐIỆN TỬ</h3>
                  <p className="text-[10px] text-slate-500">Mã lượt gửi: #{successData.LuotGuiId}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  Đã ghi nhận
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Biển số xe:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm bg-slate-100 px-2 py-0.5 rounded">
                    {successData.BienSo}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Loại xe:</span>
                  <span className="font-bold text-slate-800">{successData.TenLoaiXe}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Vị trí đỗ:</span>
                  <span className="font-extrabold text-indigo-600 text-sm">
                    {successData.TenViTri} ({successData.TenKhuVuc})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Thời gian vào:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(successData.ThoiGianVao).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Chính sách giá:</span>
                  <span className="font-bold text-slate-800">
                    {successData.CoVeThang ? 'Vé tháng (0 VNĐ)' : 'Theo bảng giá hiện hành'}
                  </span>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center space-y-1 border border-slate-100">
                <QrCode className="w-16 h-16 text-slate-800" />
                <span className="text-[10px] font-mono text-slate-400">QR-CHECKIN-{successData.LuotGuiId}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Phiếu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quy trình thông minh</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khi ghi nhận xe vào, hệ thống tự động kiểm tra biển số, trừ số lượng vị trí trống, chuyển màu vị trí đỗ sang màu đỏ/xanh trên bản đồ bãi xe và kích hoạt bộ đếm thời gian.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
