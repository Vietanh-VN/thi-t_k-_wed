import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Layers,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  Wrench,
  Car,
  Check,
  Filter
} from 'lucide-react';

const ZonesSpots = () => {
  const [zones, setZones] = useState([]);
  const [spots, setSpots] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  // Forms
  const [zoneForm, setZoneForm] = useState({ TenKhuVuc: '', MoTa: '', TrangThai: 'HoatDong' });
  const [spotForm, setSpotForm] = useState({ KhuVucId: '', LoaiXeId: '', TenViTri: '', TrangThai: 'Trong' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [selectedZoneId, setSelectedZoneId] = useState('all');

  const fetchData = async () => {
    try {
      const [znRes, spRes, vtRes] = await Promise.all([
        api.get('/zones'),
        api.get('/spots'),
        api.get('/vehicle-types'),
      ]);
      setZones(znRes.data);
      setSpots(spRes.data);
      setVehicleTypes(vtRes.data);
      if (znRes.data.length > 0 && !spotForm.KhuVucId) {
        setSpotForm((prev) => ({
          ...prev,
          KhuVucId: znRes.data[0].KhuVucId,
          LoaiXeId: vtRes.data[0]?.LoaiXeId || 1,
        }));
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

  const handleSaveZone = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        await api.put(`/zones/${editingZone.KhuVucId}`, zoneForm);
        setMsg({ type: 'success', text: 'Cập nhật khu vực thành công!' });
      } else {
        await api.post('/zones', zoneForm);
        setMsg({ type: 'success', text: 'Thêm khu vực mới thành công!' });
      }
      setIsZoneModalOpen(false);
      setEditingZone(null);
      setZoneForm({ TenKhuVuc: '', MoTa: '', TrangThai: 'HoatDong' });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Lỗi khi lưu khu vực.' });
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khu vực này? Tất cả các vị trí thuộc khu vực sẽ bị xóa.')) return;
    try {
      await api.delete(`/zones/${zoneId}`);
      if (String(selectedZoneId) === String(zoneId)) {
        setSelectedZoneId('all');
      }
      setMsg({ type: 'success', text: 'Đã xóa khu vực.' });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa khu vực.' });
    }
  };

  const handleSaveSpot = async (e) => {
    e.preventDefault();
    try {
      await api.post('/spots', {
        ...spotForm,
        KhuVucId: Number(spotForm.KhuVucId),
        LoaiXeId: Number(spotForm.LoaiXeId),
        TenViTri: spotForm.TenViTri.trim().toUpperCase(),
      });
      setMsg({ type: 'success', text: `Đã thêm vị trí ${spotForm.TenViTri.toUpperCase()}!` });
      setIsSpotModalOpen(false);
      setSpotForm((prev) => ({ ...prev, TenViTri: '' }));
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Lỗi khi thêm vị trí đỗ.' });
    }
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Bạn có chắc muốn xóa vị trí đỗ này?')) return;
    try {
      await api.delete(`/spots/${spotId}`);
      setMsg({ type: 'success', text: 'Đã xóa vị trí đỗ.' });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.detail || 'Không thể xóa vị trí.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Layers className="w-7 h-7 text-indigo-600" />
            <span>Quản Lý Khu Vực & Vị Trí Đỗ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Thiết lập các phân khu trong bãi xe và quản lý danh sách từng vị trí đỗ cụ thể.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingZone(null);
              setZoneForm({ TenKhuVuc: '', MoTa: '', TrangThai: 'HoatDong' });
              setIsZoneModalOpen(true);
            }}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Phân Khu</span>
          </button>
          <button
            onClick={() => {
              if (selectedZoneId !== 'all') {
                setSpotForm((prev) => ({ ...prev, KhuVucId: selectedZoneId }));
              }
              setIsSpotModalOpen(true);
            }}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Vị Trí Đỗ</span>
          </button>
        </div>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ type: '', text: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Zones List Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Lọc theo phân khu:
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedZoneId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedZoneId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Tất cả ({spots.length})
            </button>
            {zones.map((z) => {
              const count = spots.filter((s) => s.KhuVucId === z.KhuVucId).length;
              const isSelected = String(selectedZoneId) === String(z.KhuVucId);
              return (
                <button
                  key={z.KhuVucId}
                  onClick={() => setSelectedZoneId(isSelected ? 'all' : z.KhuVucId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{z.TenKhuVuc}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((z) => {
            const isSelected = String(selectedZoneId) === String(z.KhuVucId);
            const count = spots.filter((s) => s.KhuVucId === z.KhuVucId).length;
            return (
              <div
                key={z.KhuVucId}
                onClick={() => setSelectedZoneId(isSelected ? 'all' : z.KhuVucId)}
                className={`p-5 rounded-3xl bg-white border cursor-pointer transition-all duration-200 flex flex-col justify-between group hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30 shadow-sm'
                    : 'border-slate-200/80 hover:border-indigo-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider font-mono">
                      Mã #{z.KhuVucId}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Đang lọc</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {z.TrangThai}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {z.TenKhuVuc}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{z.MoTa || 'Không có mô tả chi tiết'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Chứa: <strong>{count} vị trí</strong>
                  </span>
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingZone(z);
                        setZoneForm({ TenKhuVuc: z.TenKhuVuc, MoTa: z.MoTa || '', TrangThai: z.TrangThai });
                        setIsZoneModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Sửa phân khu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteZone(z.KhuVucId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa phân khu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spots Table */}
      {(() => {
        const displayedSpots =
          selectedZoneId === 'all'
            ? spots
            : spots.filter((s) => String(s.KhuVucId) === String(selectedZoneId));
        const activeZone = zones.find((z) => String(z.KhuVucId) === String(selectedZoneId));

        return (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  {selectedZoneId === 'all'
                    ? `Danh Sách Tất Cả Vị Trí Đỗ (${spots.length} vị trí)`
                    : `Danh Sách Vị Trí Đỗ - ${activeZone?.TenKhuVuc || ''} (${displayedSpots.length} vị trí)`}
                </h2>
                {selectedZoneId !== 'all' && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đang lọc chỉ hiển thị các vị trí thuộc {activeZone?.TenKhuVuc}.
                  </p>
                )}
              </div>
              {selectedZoneId !== 'all' && (
                <button
                  onClick={() => setSelectedZoneId('all')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <span>Xem tất cả các khu</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Mã Vị Trí</th>
                    <th className="py-3 px-4">Tên Vị Trí</th>
                    <th className="py-3 px-4">Phân Khu Trực Thuộc</th>
                    <th className="py-3 px-4">Loại Phương Tiện</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4">Xe Đang Đỗ</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedSpots.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold">
                          Không có vị trí đỗ nào thuộc phân khu này
                        </p>
                        <button
                          onClick={() => setSelectedZoneId('all')}
                          className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
                        >
                          Hiển thị tất cả các khu
                        </button>
                      </td>
                    </tr>
                  ) : (
                    displayedSpots.map((spot) => (
                      <tr key={spot.ViTriId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">#{spot.ViTriId}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {spot.TenViTri}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{spot.TenKhuVuc}</td>
                        <td className="py-3 px-4 text-slate-600">{spot.TenLoaiXe}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              spot.TrangThai === 'Trong'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : spot.TrangThai === 'DangSuDung'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {spot.TrangThai === 'Trong'
                              ? 'Trống'
                              : spot.TrangThai === 'DangSuDung'
                              ? 'Đang đỗ'
                              : 'Bảo trì'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-900">
                          {spot.BienSoHienTai || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSpot(spot.ViTriId)}
                            disabled={spot.TrangThai === 'DangSuDung'}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 transition-colors"
                            title="Xóa vị trí"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Modal Add/Edit Zone */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {editingZone ? 'CHỈNH SỬA PHÂN KHU' : 'THÊM PHÂN KHU MỚI'}
              </h3>
              <button onClick={() => setIsZoneModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên phân khu *</label>
                <input
                  type="text"
                  required
                  value={zoneForm.TenKhuVuc}
                  onChange={(e) => setZoneForm({ ...zoneForm, TenKhuVuc: e.target.value })}
                  placeholder="VD: Khu E - Xe Vip"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả phân khu</label>
                <textarea
                  rows={3}
                  value={zoneForm.MoTa}
                  onChange={(e) => setZoneForm({ ...zoneForm, MoTa: e.target.value })}
                  placeholder="Mô tả công năng và vị trí địa lý trong bãi..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsZoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Lưu Phân Khu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Spot */}
      {isSpotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">THÊM VỊ TRÍ ĐỖ MỚI</h3>
              <button onClick={() => setIsSpotModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã / Tên vị trí đỗ *</label>
                <input
                  type="text"
                  required
                  value={spotForm.TenViTri}
                  onChange={(e) => setSpotForm({ ...spotForm, TenViTri: e.target.value.toUpperCase() })}
                  placeholder="VD: A-09, B-15..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân khu trực thuộc *</label>
                <select
                  value={spotForm.KhuVucId}
                  onChange={(e) => setSpotForm({ ...spotForm, KhuVucId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {zones.map((z) => (
                    <option key={z.KhuVucId} value={z.KhuVucId}>
                      {z.TenKhuVuc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại xe phù hợp *</label>
                <select
                  value={spotForm.LoaiXeId}
                  onChange={(e) => setSpotForm({ ...spotForm, LoaiXeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {vehicleTypes.map((t) => (
                    <option key={t.LoaiXeId} value={t.LoaiXeId}>
                      {t.TenLoaiXe}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSpotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Lưu Vị Trí
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonesSpots;
