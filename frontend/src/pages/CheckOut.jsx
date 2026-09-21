import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  LogOut,
  Car,
  Search,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Printer,
  Sparkles,
  MapPin
} from 'lucide-react';

const CheckOut = () => {
  const [searchParams] = useSearchParams();
  const initialPlate = searchParams.get('plate') || '';

  const [bienSo, setBienSo] = useState(initialPlate);
  const [matVe, setMatVe] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [feeInfo, setFeeInfo] = useState(null);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách xe đang gửi
  const fetchActiveSessions = async () => {
    try {
      const res = await api.get('/parking/active-sessions');
      setActiveSessions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    if (initialPlate) {
      handleCalculate(initialPlate, matVe);
    }
  }, [initialPlate]);

  const handleCalculate = async (plateToCalc, isLostTicket = matVe) => {
    const target = plateToCalc || bienSo;
    if (!target.trim()) return;

    setError('');
    setCalculating(true);
    setFeeInfo(null);
    setSuccessReceipt(null);

    try {
      const res = await api.post('/parking/calculate-fee', {
        BienSo: target.trim().toUpperCase(),
        MatVe: Boolean(isLostTicket)
      });
      setFeeInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Không tìm thấy lượt gửi đang hoạt động của xe này.');
    } finally {
      setCalculating(false);
    }
  };

  const handleToggleLostTicket = (checked) => {
    setMatVe(checked);
    if (bienSo.trim()) {
      handleCalculate(bienSo.trim(), checked);
    }
  };

  const handleCheckOut = async () => {
    if (!feeInfo) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/parking/check-out', {
        LuotGuiId: feeInfo.LuotGuiId,
        MatVe: matVe
      });
      setSuccessReceipt(res.data);
      setFeeInfo(null);
      setBienSo('');
      setMatVe(false);
      fetchActiveSessions(); // Cập nhật lại danh sách xe đang gửi
    } catch (err) {
      setError(err.response?.data?.detail || 'Xử lý xe ra thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <LogOut className="w-7 h-7 text-sky-600" />
          <span>Ghi Nhận Xe Ra & Thu Phí (Check-Out)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tra cứu xe đang đỗ, tính toán thời gian gửi và mức phí theo bảng giá hoặc vé tháng. Giải phóng chỗ đỗ tự động.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Calculate Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Tra cứu xe xuất bãi</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bienSo}
                  onChange={(e) => setBienSo(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate(bienSo)}
                  placeholder="Nhập biển số xe (VD: 29B1-88990)..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white uppercase transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => handleCalculate(bienSo, matVe)}
                disabled={calculating || !bienSo.trim()}
                className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-sky-500/25 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {calculating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Tính phí</span>
                  </>
                )}
              </button>
            </div>

            {/* Use Case 2.5.4: Khách báo mất vé */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200">
              <label htmlFor="matVeCheck" className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="matVeCheck"
                  checked={matVe}
                  onChange={(e) => handleToggleLostTicket(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Khách báo mất vé xe</span>
                  <span className="text-[11px] text-amber-700 font-medium">Quy định nhà xe: Phụ thu thêm 10.000 VNĐ</span>
                </div>
              </label>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${matVe ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
                {matVe ? '+10.000 đ' : 'Không phụ thu'}
              </span>
            </div>

            {/* Quick Active Parked Vehicles Chips */}
            {activeSessions.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold">Xe đang chờ xuất bãi:</span>
                {activeSessions.slice(0, 5).map((s) => (
                  <button
                    key={s.LuotGuiId}
                    type="button"
                    onClick={() => {
                      setBienSo(s.BienSo);
                      handleCalculate(s.BienSo, matVe);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-mono font-bold transition-colors border border-sky-200"
                    title={`Vào lúc ${new Date(s.ThoiGianVao).toLocaleTimeString('vi-VN')}`}
                  >
                    {s.BienSo} ({s.TenViTri})
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Fee Calculation Details Box */}
          {feeInfo && (
            <div className="bg-white p-6 rounded-3xl border-2 border-sky-500 shadow-lg shadow-sky-900/5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-sky-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">CHI TIẾT TÍNH PHÍ GỬI XE</h3>
                </div>
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                  {feeInfo.BienSo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Loại phương tiện</span>
                  <span className="font-bold text-slate-800 text-sm">{feeInfo.TenLoaiXe}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Vị trí đang đỗ</span>
                  <span className="font-bold text-sky-600 text-sm">
                    {feeInfo.TenViTri} ({feeInfo.TenKhuVuc})
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Thời gian vào</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(feeInfo.ThoiGianVao).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Thời gian ra dự kiến</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(feeInfo.ThoiGianRa).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Duration & Applied Rate */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-sky-900 font-semibold">Tổng thời gian gửi:</span>
                  <span className="font-extrabold text-sky-900 text-sm">
                    {Math.floor(feeInfo.SoPhutGui / 60)} giờ {feeInfo.SoPhutGui % 60} phút ({feeInfo.SoGioGui}h)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Bảng giá áp dụng:</span>
                  <span className="font-bold text-slate-800">{feeInfo.BangGiaApDung}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-sky-100">
                  <span className="text-slate-600">Cước gửi xe:</span>
                  <span className="font-bold text-slate-800">{feeInfo.PhiGuiXe?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                {feeInfo.MatVe && (
                  <div className="flex justify-between items-center text-amber-800 font-bold">
                    <span>Phụ thu mất vé xe:</span>
                    <span>+{feeInfo.PhiMatVe?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                {feeInfo.CoVeThang && (
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-[11px] pt-1 border-t border-sky-200/60">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phương tiện có vé tháng hợp lệ - Miễn phí cước gửi lượt</span>
                  </div>
                )}
              </div>

              {/* Total Fee Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between shadow-md shadow-sky-900/15">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-sky-100">Tổng tiền thanh toán</span>
                  <p className="text-3xl font-extrabold tracking-tight">
                    {(feeInfo.TongThanhToan ?? feeInfo.PhiGuiXe).toLocaleString('vi-VN')} <span className="text-lg font-bold">VNĐ</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="px-6 py-3 bg-white hover:bg-sky-50 text-sky-900 rounded-xl text-sm font-extrabold shadow-lg flex items-center space-x-2 transition-all disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-sky-600" />
                      <span>Xác nhận Cho Xe Ra</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Check-Out Receipt */}
          {successReceipt && (
            <div className="bg-white p-6 rounded-3xl border-2 border-sky-500 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 text-sky-600">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">HÓA ĐƠN XUẤT BÃI & THANH TOÁN</h3>
                    <p className="text-[10px] text-slate-500">Mã lượt: #{successReceipt.LuotGuiId}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold border border-sky-200">
                  Đã hoàn tất
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Biển số:</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {successReceipt.BienSo}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Vị trí đã giải phóng:</span>
                  <span className="font-bold text-sky-600">{successReceipt.TenViTri} (Trạng thái: Trống)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Thời gian gửi:</span>
                  <span className="font-semibold text-slate-800">{successReceipt.SoGioGui} giờ</span>
                </div>
                {successReceipt.MatVe && (
                  <div className="flex justify-between py-1 border-b border-slate-50 text-amber-800 font-medium">
                    <span>Phụ thu mất vé xe:</span>
                    <span>+{successReceipt.PhiMatVe?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tổng tiền đã thanh toán:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {(successReceipt.TongThanhToan ?? successReceipt.PhiGuiXe).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Hóa Đơn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessReceipt(null)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Parked Vehicles Selector (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Xe đang trong bãi ({activeSessions.length})
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">Click để chọn tính phí</span>
          </div>

          {activeSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">Hiện không có xe nào đang đỗ trong bãi.</div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {activeSessions.map((s) => (
                <button
                  key={s.LuotGuiId}
                  type="button"
                  onClick={() => {
                    setBienSo(s.BienSo);
                    handleCalculate(s.BienSo);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                    bienSo === s.BienSo
                      ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 group-hover:bg-sky-100 text-slate-700 group-hover:text-sky-700 flex items-center justify-center font-bold text-xs">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs">{s.BienSo}</span>
                      <p className="text-[11px] text-slate-500">{s.TenLoaiXe}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-sky-600 block">{s.TenViTri}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.ThoiGianVao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
