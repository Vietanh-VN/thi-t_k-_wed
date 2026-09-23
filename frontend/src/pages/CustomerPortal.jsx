import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Bike,
  Search,
  MapPin,
  DollarSign,
  CreditCard,
  Clock,
  Sparkles,
  Bot,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CustomerPortal = () => {
  const [plate, setPlate] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [feeInfo, setFeeInfo] = useState(null);
  const [zones, setZones] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  // AI Chat for customer
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [znRes, prRes] = await Promise.all([
          api.get('/zones'),
          api.get('/pricing'),
        ]);
        setZones(znRes.data);
        setPricing(prRes.data.filter((p) => p.TrangThai));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPublicData();
  }, []);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!plate.trim()) return;
    setError('');
    setVehicleInfo(null);
    setFeeInfo(null);
    setSearching(true);

    try {
      const pClean = plate.trim().toUpperCase();
      const res = await api.get(`/vehicles/lookup/${pClean}`);
      setVehicleInfo(res.data);

      if (res.data.DangGuiTrongBai) {
        // Tạm tính phí luôn cho khách xem
        try {
          const feeRes = await api.post('/parking/calculate-fee', { BienSo: pClean });
          setFeeInfo(feeRes.data);
        } catch (fErr) {
          // silent
        }
      }
    } catch (err) {
      setError('Không tìm thấy thông tin phương tiện này trong hệ thống.');
    } finally {
      setSearching(false);
    }
  };

  const handleAskCustomerAi = async (q) => {
    const question = q || aiQuestion;
    if (!question.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    try {
      const res = await api.post('/ai/chat', {
        CauHoi: question,
        VaiTroNguoiHoi: 'KhachHang',
      });
      setAiAnswer(res.data.CauTraLoi);
    } catch (e) {
      setAiAnswer('Xin lỗi, trợ lý AI đang bận. Bạn vui lòng thử lại sau.');
    } finally {
      setAiLoading(false);
    }
  };

  const totalSpots = zones.reduce((sum, z) => sum + (z.TongSoCho || 0), 0);
  const vacantSpots = zones.reduce((sum, z) => sum + (z.SoChoTrong || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Cổng Dịch Vụ Khách Hàng Thông Minh (Customer Kiosk)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Tra Cứu Phương Tiện, Chỗ Trống & Bảng Giá
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-2 leading-relaxed">
            Dành cho quý khách hàng kiểm tra vị trí xe đang gửi trong bãi, xem phí gửi xe tạm tính, kiểm tra thời hạn vé tháng và hỏi đáp với trợ lý AI.
          </p>
        </div>
      </div>

      {/* Main Lookup Search Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Nhập Biển Số Xe Để Tra Cứu Toàn Bộ Thông Tin
            </h2>
            <p className="text-xs text-slate-500">Xem vị trí đỗ, thời gian gửi, vé tháng và phí tạm tính</p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Bike className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Nhập biển số xe máy (VD: 20B1-123.45, 20MD-333.88)..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !plate.trim()}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {searching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tra cứu ngay</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold">Biển số thử nghiệm:</span>
          {['30F-88899', '20B1-12345', '29A-66688', '29MD-44556', '51A-99988'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setPlate(s);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-mono font-bold transition-colors border border-slate-200"
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Lookup Results Card */}
        {vehicleInfo && (
          <div className="mt-6 p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400">Kết quả tra cứu cho xe</span>
                <h3 className="font-mono text-xl font-extrabold text-slate-900">{vehicleInfo.BienSo}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    vehicleInfo.DangGuiTrongBai
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {vehicleInfo.DangGuiTrongBai ? '🚗 Đang trong bãi đỗ' : '⚪ Hiện không có trong bãi'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Box 1: Parking status */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-600 font-bold uppercase tracking-wider text-[11px]">
                  <MapPin className="w-4 h-4" />
                  <span>Vị trí & Thời gian gửi</span>
                </div>
                {vehicleInfo.DangGuiTrongBai ? (
                  <div className="space-y-1.5 pt-1">
                    <p>
                      Vị trí đỗ hiện tại: <strong className="text-indigo-600 font-extrabold text-sm">{vehicleInfo.TenViTri}</strong>
                    </p>
                    <p>
                      Thời gian xe vào: <strong className="text-slate-800">{vehicleInfo.ThoiGianVao}</strong>
                    </p>
                    {feeInfo && (
                      <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                        <p>
                          Thời lượng gửi: <strong>{feeInfo.SoGioGui} giờ</strong> ({feeInfo.SoPhutGui} phút)
                        </p>
                        <p>
                          Phí tạm tính đến hiện tại: <strong className="text-amber-600 font-extrabold text-sm">{feeInfo.PhiGuiXe.toLocaleString('vi-VN')} đ</strong>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 pt-1">Phương tiện hiện không có lượt gửi hoạt động trong bãi.</p>
                )}
              </div>

              {/* Box 2: Monthly Pass status */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
                  <CreditCard className="w-4 h-4" />
                  <span>Thông tin Vé Tháng</span>
                </div>
                {vehicleInfo.CoVeThang ? (
                  <div className="space-y-1.5 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 inline-block">
                      ✓ Vé tháng còn hiệu lực
                    </span>
                    <p>
                      Ngày hết hạn: <strong className="text-slate-900">{vehicleInfo.NgayHetHanVeThang}</strong>
                    </p>
                    <p className="text-slate-500">Được miễn phí 100% các lượt xe vào ra trong thời hạn vé.</p>
                  </div>
                ) : (
                  <div className="space-y-1 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold inline-block">
                      Chưa đăng ký vé tháng
                    </span>
                    <p className="text-slate-500">Khách hàng áp dụng thanh toán theo đơn giá từng lượt gửi.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Spot Availability & Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Real-time spots availability (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                Tình Trạng Chỗ Trống Thực Tế
              </h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Còn {vacantSpots}/{totalSpots} chỗ
            </span>
          </div>

          <div className="space-y-3">
            {zones.map((z) => (
              <div key={z.KhuVucId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{z.TenKhuVuc}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{z.MoTa || 'Phân khu đỗ xe tiêu chuẩn'}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600 block">
                    {z.SoChoTrong} chỗ trống
                  </span>
                  <span className="text-[10px] text-slate-400">Tổng: {z.TongSoCho}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Public Pricing Table (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Bảng Giá Dịch Vụ Gửi Xe
            </h3>
          </div>

          <div className="space-y-3">
            {pricing.map((p) => (
              <div key={p.BangGiaId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center font-bold">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{p.TenLoaiXe}</h4>
                    <span className="text-[10px] text-slate-400">Áp dụng: Theo {p.DonViTinh}</span>
                  </div>
                </div>
                <div className="text-right font-mono font-extrabold text-indigo-600 text-sm">
                  {p.DonGia?.toLocaleString('vi-VN')} đ <span className="text-[10px] font-sans text-slate-500">/{p.DonViTinh}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer AI Assistant Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Hỏi Đáp Nhanh Với Trợ Lý AI Khách Hàng</h3>
            <p className="text-xs text-slate-600">Hỏi bất kỳ thông tin nào về quy định, giá vé hoặc vị trí trống trong bãi</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            'Bãi xe có còn chỗ trống cho xe máy không?',
            'Bảng giá gửi xe máy và xe điện là bao nhiêu?',
            'Làm thế nào để đăng ký vé tháng?',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAiQuestion(q);
                handleAskCustomerAi(q);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold border border-indigo-200 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Nhập câu hỏi của bạn cho AI..."
            className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAskCustomerAi(aiQuestion)}
            disabled={aiLoading || !aiQuestion.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
          >
            {aiLoading ? 'Đang hỏi...' : 'Gửi câu hỏi'}
          </button>
        </div>

        {aiAnswer && (
          <div className="p-4 rounded-2xl bg-white border border-indigo-100 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-line shadow-sm">
            {aiAnswer}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPortal;
