import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  MapPin,
  Car,
  Zap,
  Filter,
  RefreshCw,
  Clock,
  LogIn,
  LogOut,
  X,
  Wrench,
  Search,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';

const ParkingMap = () => {
  const [zones, setZones] = useState([]);
  const [spots, setSpots] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' (theo phân khu) hoặc 'compact' (lưới gọn)
  const [selectedSpotModal, setSelectedSpotModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [znRes, spRes] = await Promise.all([
        api.get('/zones'),
        api.get('/spots'),
      ]);
      setZones(znRes.data);
      setSpots(spRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleToggleMaintenance = async (spot) => {
    const newStatus = spot.TrangThai === 'BaoTri' ? 'Trong' : 'BaoTri';
    try {
      await api.patch(`/spots/${spot.ViTriId}/status`, { TrangThai: newStatus });
      fetchData();
      if (selectedSpotModal) {
        setSelectedSpotModal({ ...selectedSpotModal, TrangThai: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Không thể đổi trạng thái vị trí.');
    }
  };

  // Lọc vị trí theo phân khu, trạng thái và tìm kiếm
  const filterSpotItem = (spot) => {
    if (selectedZone !== 'all' && spot.KhuVucId !== Number(selectedZone)) return false;
    if (selectedStatus !== 'all' && spot.TrangThai !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = spot.TenViTri?.toLowerCase().includes(q);
      const matchPlate = spot.BienSoHienTai?.toLowerCase().includes(q);
      if (!matchName && !matchPlate) return false;
    }
    return true;
  };

  const filteredSpots = spots.filter(filterSpotItem);

  const totalSpots = spots.length;
  const vacantCount = spots.filter((s) => s.TrangThai === 'Trong').length;
  const occupiedCount = spots.filter((s) => s.TrangThai === 'DangSuDung').length;
  const maintenanceCount = spots.filter((s) => s.TrangThai === 'BaoTri').length;

  // Render từng thẻ vị trí đỗ được tối ưu giao diện gọn gàng, hiện đại
  const renderSpotCard = (spot) => {
    const isVacant = spot.TrangThai === 'Trong';
    const isOccupied = spot.TrangThai === 'DangSuDung';
    const isMaintenance = spot.TrangThai === 'BaoTri';

    return (
      <div
        key={spot.ViTriId}
        onClick={() => setSelectedSpotModal(spot)}
        className={`relative rounded-2xl p-3 border-2 transition-all cursor-pointer flex flex-col justify-between select-none shadow-sm hover:shadow-md hover:-translate-y-0.5 group ${
          isVacant
            ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70'
            : isOccupied
            ? 'bg-indigo-50/60 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/90'
            : 'bg-amber-50/40 border-amber-200 hover:border-amber-400'
        }`}
      >
        {/* Header ô đỗ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="font-mono font-extrabold text-xs text-slate-800 tracking-tight">
              {spot.TenViTri}
            </span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              isVacant
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                : isOccupied
                ? 'bg-indigo-600 ring-2 ring-indigo-300 animate-pulse'
                : 'bg-amber-500'
            }`}
          ></span>
        </div>

        {/* Nội dung trung tâm */}
        <div className="my-2 text-center">
          {isOccupied ? (
            <div className="space-y-1">
              <div className="inline-block bg-white border border-indigo-200 shadow-xs px-2 py-0.5 rounded-lg">
                <span className="font-mono text-[11px] font-extrabold text-indigo-900 tracking-tight block">
                  {spot.BienSoHienTai}
                </span>
              </div>
              <div className="text-[10px] text-indigo-600 font-medium flex items-center justify-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{spot.ThoiGianVaoHienTai?.split(' ')[1] || 'Đang đỗ'}</span>
              </div>
            </div>
          ) : isMaintenance ? (
            <div className="py-1 flex items-center justify-center space-x-1 text-amber-700">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[11px] font-bold">Bảo trì</span>
            </div>
          ) : (
            <div className="py-1">
              <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-xs">
                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700">P</span>
                <span>Trống</span>
              </span>
            </div>
          )}
        </div>

        {/* Footer thông tin phụ */}
        <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate">{spot.TenLoaiXe || 'Xe máy'}</span>
          <span className="font-semibold text-slate-500">{spot.TenKhuVuc?.split(' - ')[0]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <MapPin className="w-7 h-7 text-indigo-600" />
            <span>Sơ Đồ Bãi Đỗ Xe Trực Quan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bố cục vị trí đỗ phân theo khu vực, thời gian thực và quản lý xuất/nhập bãi tức thời.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Nút đổi kiểu hiển thị */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                viewMode === 'grouped' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Phân nhóm theo từng phân khu"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Theo khu</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all ${
                viewMode === 'compact' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Xem ma trận toàn bộ"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Toàn bộ</span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 4 Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block uppercase tracking-wider">Tổng vị trí</span>
            <span className="text-2xl font-black text-slate-900">{totalSpots}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            {totalSpots}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-800 font-semibold block uppercase tracking-wider">Chỗ trống sẵn sàng</span>
            <span className="text-2xl font-black text-emerald-700">{vacantCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-indigo-800 font-semibold block uppercase tracking-wider">Đang đỗ xe</span>
            <span className="text-2xl font-black text-indigo-700">{occupiedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-800 font-semibold block uppercase tracking-wider">Đang bảo trì</span>
            <span className="text-2xl font-black text-amber-700">{maintenanceCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Thanh lọc phân khu, trạng thái & Tìm kiếm nhanh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Tabs phân khu */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả phân khu ({spots.length})
          </button>
          {zones.map((z) => (
            <button
              key={z.KhuVucId}
              onClick={() => setSelectedZone(z.KhuVucId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedZone === z.KhuVucId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z.TenKhuVuc} ({z.TongSoCho})
            </button>
          ))}
        </div>

        {/* Search & Trạng thái filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm vị trí / biển số..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Trong">🟢 Chỗ trống</option>
            <option value="DangSuDung">🔵 Xe đang đỗ</option>
            <option value="BaoTri">🟡 Bảo trì</option>
          </select>
        </div>
      </div>

      {/* NỘI DUNG SƠ ĐỒ ĐỖ XE */}
      {viewMode === 'grouped' && selectedZone === 'all' ? (
        /* CHẾ ĐỘ 1: TÁCH THEO TỪNG PHÂN KHU (GỌN GÀNG, RÕ RÀNG) */
        <div className="space-y-6">
          {zones.map((zone) => {
            const zoneSpots = spots.filter(
              (s) => s.KhuVucId === zone.KhuVucId && filterSpotItem(s)
            );
            const allZoneSpots = spots.filter((s) => s.KhuVucId === zone.KhuVucId);
            const zoneOccupied = allZoneSpots.filter((s) => s.TrangThai === 'DangSuDung').length;
            const zoneVacant = allZoneSpots.filter((s) => s.TrangThai === 'Trong').length;
            const occupancyRate = allZoneSpots.length > 0 ? Math.round((zoneOccupied / allZoneSpots.length) * 100) : 0;
            const isElectricZone = zone.TenKhuVuc?.toLowerCase().includes('điện');

            return (
              <div key={zone.KhuVucId} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                {/* Zone Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                      isElectricZone ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {isElectricZone ? <Zap className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{zone.TenKhuVuc}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {zone.MoTa || 'Khu vực đỗ xe'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tổng cộng: {allZoneSpots.length} vị trí • Trống: <strong className="text-emerald-600">{zoneVacant}</strong> • Đang đỗ: <strong className="text-indigo-600">{zoneOccupied}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Thanh tiến độ lấp đầy */}
                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full transition-all rounded-full ${
                          occupancyRate > 80 ? 'bg-rose-500' : occupancyRate > 50 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-10 text-right">{occupancyRate}%</span>
                  </div>
                </div>

                {/* Grid ô đỗ cho riêng phân khu này */}
                {zoneSpots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Không tìm thấy vị trí nào phù hợp bộ lọc tại phân khu này.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {zoneSpots.map((spot) => renderSpotCard(spot))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* CHẾ ĐỘ 2: LƯỚI MA TRẬN GỌN (CHO BỘ LỌC HOẶC TẤT CẢ) */
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Hiển thị <strong>{filteredSpots.length}</strong> vị trí đỗ xe:</span>
            <span className="text-[11px] text-slate-400 italic">* Bấm vào từng ô để xem chi tiết, Check-In hoặc Check-Out</span>
          </div>
          {filteredSpots.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không tìm thấy vị trí nào phù hợp tiêu chí lọc.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredSpots.map((spot) => renderSpotCard(spot))}
            </div>
          )}
        </div>
      )}

      {/* Spot Detail Modal */}
      {selectedSpotModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base font-mono">
                  {selectedSpotModal.TenViTri}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Chi tiết vị trí đỗ</h3>
                  <p className="text-xs text-slate-500">{selectedSpotModal.TenKhuVuc}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpotModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Loại xe phù hợp:</span>
                <span className="font-bold text-slate-800">{selectedSpotModal.TenLoaiXe}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Trạng thái hiện tại:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    selectedSpotModal.TrangThai === 'Trong'
                      ? 'bg-emerald-50 text-emerald-700'
                      : selectedSpotModal.TrangThai === 'DangSuDung'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {selectedSpotModal.TrangThai === 'Trong'
                    ? 'Chỗ trống'
                    : selectedSpotModal.TrangThai === 'DangSuDung'
                    ? 'Đang đỗ xe'
                    : 'Đang bảo trì'}
                </span>
              </div>

              {selectedSpotModal.TrangThai === 'DangSuDung' && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Biển số đang đỗ:</span>
                    <span className="font-mono font-extrabold text-indigo-600 text-sm bg-indigo-50 px-2 py-0.5 rounded">
                      {selectedSpotModal.BienSoHienTai}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500">Thời gian vào:</span>
                    <span className="font-semibold text-slate-800">{selectedSpotModal.ThoiGianVaoHienTai}</span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions in Modal */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {selectedSpotModal.TrangThai === 'DangSuDung' ? (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/check-out?plate=${selectedSpotModal.BienSoHienTai}`);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Xử lý Check-Out & Tính Phí ({selectedSpotModal.BienSoHienTai})</span>
                </button>
              ) : selectedSpotModal.TrangThai === 'Trong' ? (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/check-in');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ghi Nhận Xe Vào Vị Trí Này</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => handleToggleMaintenance(selectedSpotModal)}
                disabled={selectedSpotModal.TrangThai === 'DangSuDung'}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-40"
              >
                <Wrench className="w-4 h-4" />
                <span>
                  {selectedSpotModal.TrangThai === 'BaoTri'
                    ? 'Hoàn tất bảo trì (Mở lại vị trí)'
                    : 'Chuyển sang trạng thái bảo trì'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingMap;

