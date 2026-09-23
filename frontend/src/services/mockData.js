// Mock data dự phòng khi triển khai trên GitHub Pages (chế độ tĩnh không có backend Python)

export const MOCK_USERS = {
  'admin@parking.vn': {
    MaNguoiDung: 1,
    TenDangNhap: 'admin',
    HoTen: 'Nông Việt Anh (Quản lý)',
    Email: 'admin@parking.vn',
    SoDienThoai: '0988888888',
    VaiTro: 'QuanLy',
    TrangThai: 'HoatDong'
  },
  'staff@parking.vn': {
    MaNguoiDung: 2,
    TenDangNhap: 'staff',
    HoTen: 'Hoàng Văn Minh (Nhân viên)',
    Email: 'staff@parking.vn',
    SoDienThoai: '0977777777',
    VaiTro: 'NhanVien',
    TrangThai: 'HoatDong'
  },
  'khachhang@gmail.com': {
    MaNguoiDung: 3,
    TenDangNhap: 'khachhang',
    HoTen: 'Giàng A Tùng (Khách hàng)',
    Email: 'khachhang@gmail.com',
    SoDienThoai: '0966666666',
    VaiTro: 'KhachHang',
    TrangThai: 'HoatDong'
  },
  'ai@parking.vn': {
    MaNguoiDung: 4,
    TenDangNhap: 'ai',
    HoTen: 'AI Engine System',
    Email: 'ai@parking.vn',
    SoDienThoai: '0912345678',
    VaiTro: 'AIEngine',
    TrangThai: 'HoatDong'
  }
};

export const MOCK_OVERVIEW = {
  TongSoViTri: 120,
  SoViTriDangSuDung: 78,
  SoViTriTrong: 38,
  SoViTriBaoTri: 4,
  TyLeLapDay: 65.0,
  TongLuotXeHomNay: 245,
  LuotVaoHomNay: 142,
  LuotRaHomNay: 103,
  DoanhThuHomNay: 2850000,
  DoanhThuThang: 68400000,
  VeThangDangHoatDong: 45
};

export const MOCK_HOURLY = [
  { Gio: '06:00', LuotVao: 12, LuotRa: 3 },
  { Gio: '07:00', LuotVao: 38, LuotRa: 8 },
  { Gio: '08:00', LuotVao: 45, LuotRa: 12 },
  { Gio: '09:00', LuotVao: 24, LuotRa: 15 },
  { Gio: '10:00', LuotVao: 18, LuotRa: 16 },
  { Gio: '11:00', LuotVao: 22, LuotRa: 28 },
  { Gio: '12:00', LuotVao: 15, LuotRa: 32 },
  { Gio: '13:00', LuotVao: 20, LuotRa: 14 },
  { Gio: '14:00', LuotVao: 28, LuotRa: 19 },
  { Gio: '15:00', LuotVao: 31, LuotRa: 22 },
  { Gio: '16:00', LuotVao: 35, LuotRa: 38 },
  { Gio: '17:00', LuotVao: 42, LuotRa: 50 },
  { Gio: '18:00', LuotVao: 25, LuotRa: 46 }
];

export const MOCK_WEEKLY = [
  { Ngay: 'T2', DoanhThu: 2400000, LuotXe: 210 },
  { Ngay: 'T3', DoanhThu: 2800000, LuotXe: 235 },
  { Ngay: 'T4', DoanhThu: 2650000, LuotXe: 228 },
  { Ngay: 'T5', DoanhThu: 3100000, LuotXe: 260 },
  { Ngay: 'T6', DoanhThu: 3450000, LuotXe: 290 },
  { Ngay: 'T7', DoanhThu: 4200000, LuotXe: 340 },
  { Ngay: 'CN', DoanhThu: 3900000, LuotXe: 315 }
];

export const MOCK_ZONES = [
  { MaKhuVuc: 1, TenKhuVuc: 'Khu A - Ô tô', LoaiXePhuHop: 'OTo', MoTa: 'Khu vực đỗ xe ô tô 4-7 chỗ', TongSoViTri: 40, SoViTriDangSuDung: 28, SoViTriTrong: 12, TyLe: 70 },
  { MaKhuVuc: 2, TenKhuVuc: 'Khu B - Xe máy', LoaiXePhuHop: 'XeMay', MoTa: 'Khu vực bãi đỗ xe máy có mái che', TongSoViTri: 60, SoViTriDangSuDung: 44, SoViTriTrong: 16, TyLe: 73 },
  { MaKhuVuc: 3, TenKhuVuc: 'Khu C - Xe điện & VIP', LoaiXePhuHop: 'OToDien', MoTa: 'Có trạm sạc xe điện nhanh', TongSoViTri: 20, SoViTriDangSuDung: 6, SoViTriTrong: 10, TyLe: 30 }
];

export const MOCK_VEHICLE_STATS = [
  { name: 'Ô tô 4-7 chỗ', value: 48 },
  { name: 'Xe máy', value: 92 },
  { name: 'Xe tải nhỏ', value: 8 },
  { name: 'Xe đạp điện', value: 14 }
];

export const MOCK_VEHICLE_TYPES = [
  { LoaiXeId: 1, TenLoaiXe: 'Xe máy', MoTa: 'Xe máy số, xe tay ga và xe hai bánh' },
  { LoaiXeId: 2, TenLoaiXe: 'Xe điện', MoTa: 'Xe máy điện, xe đạp điện có trạm sạc' }
];

// Danh sách vị trí đỗ xe máy và xe điện
export const MOCK_SPOTS = [
  ...Array.from({ length: 30 }, (_, i) => ({
    MaViTri: i + 1,
    ViTriId: i + 1,
    MaSoViTri: `B-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `B-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 2,
    TenKhuVuc: 'Khu B - Xe máy',
    TrangThai: i < 12 ? 'DangSuDung' : (i === 29 ? 'BaoTri' : 'Trong'),
    BienSoXe: i < 12 ? `20B1-${20000 + i * 222}` : null,
    ThoiGianVao: i < 12 ? '2026-09-24 08:00:00' : null,
    LoaiXe: 'XeMay',
    LoaiXeId: 1
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    MaViTri: i + 31,
    ViTriId: i + 31,
    MaSoViTri: `E-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `E-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 3,
    TenKhuVuc: 'Khu E - Xe máy điện',
    TrangThai: i < 5 ? 'DangSuDung' : 'Trong',
    BienSoXe: i < 5 ? `29MD-${30000 + i * 333}` : null,
    ThoiGianVao: i < 5 ? '2026-09-24 08:45:00' : null,
    LoaiXe: 'XeDien',
    LoaiXeId: 2
  }))
];

export const MOCK_ACTIVE_SESSIONS = [
  { LuotGuiId: 101, MaLuotDo: 101, BienSo: '20B1-123.45', BienSoXe: '20B1-123.45', TenLoaiXe: 'Xe máy Honda Wave', ThoiGianVao: '2026-09-24T08:12:00', TenViTri: 'B-03', MaViTri: 'B-03', TenKhuVuc: 'Khu B - Xe máy' },
  { LuotGuiId: 102, MaLuotDo: 102, BienSo: '20F1-999.22', BienSoXe: '20F1-999.22', TenLoaiXe: 'Xe máy Honda SH', ThoiGianVao: '2026-09-24T08:50:00', TenViTri: 'B-07', MaViTri: 'B-07', TenKhuVuc: 'Khu B - Xe máy' },
  { LuotGuiId: 103, MaLuotDo: 103, BienSo: '20B2-456.78', BienSoXe: '20B2-456.78', TenLoaiXe: 'Xe máy Yamaha Exciter', ThoiGianVao: '2026-09-24T09:15:00', TenViTri: 'B-11', MaViTri: 'B-11', TenKhuVuc: 'Khu B - Xe máy' },
  { LuotGuiId: 104, MaLuotDo: 104, BienSo: '20M1-333.88', BienSoXe: '20M1-333.88', TenLoaiXe: 'Xe máy điện VinFast', ThoiGianVao: '2026-09-24T09:35:00', TenViTri: 'B-15', MaViTri: 'B-15', TenKhuVuc: 'Khu B - Xe máy' },
  { LuotGuiId: 105, MaLuotDo: 105, BienSo: '20H1-777.66', BienSoXe: '20H1-777.66', TenLoaiXe: 'Xe máy Honda Vision', ThoiGianVao: '2026-09-24T09:50:00', TenViTri: 'B-18', MaViTri: 'B-18', TenKhuVuc: 'Khu B - Xe máy' },
  { LuotGuiId: 106, MaLuotDo: 106, BienSo: '20K1-222.11', BienSoXe: '20K1-222.11', TenLoaiXe: 'Xe máy Honda AirBlade', ThoiGianVao: '2026-09-24T10:10:00', TenViTri: 'B-22', MaViTri: 'B-22', TenKhuVuc: 'Khu B - Xe máy' }
];

export const MOCK_PRICING = [
  { MaBangGia: 1, TenLoaiXe: 'Xe máy ban ngày', LoaiXe: 'XeMay', DonViTinh: 'Luot', GiaTien: 5000, MoTa: 'Khung giờ từ 06:00 đến 18:00' },
  { MaBangGia: 2, TenLoaiXe: 'Xe máy qua đêm', LoaiXe: 'XeMay', DonViTinh: 'Luot', GiaTien: 10000, MoTa: 'Khung giờ từ 18:00 đến 06:00 sáng hôm sau' },
  { MaBangGia: 3, TenLoaiXe: 'Ô tô 4-7 chỗ theo giờ', LoaiXe: 'OTo', DonViTinh: 'Gio', GiaTien: 25000, MoTa: '25.000đ cho mỗi giờ đỗ' },
  { MaBangGia: 4, TenLoaiXe: 'Ô tô qua đêm', LoaiXe: 'OTo', DonViTinh: 'Luot', GiaTien: 120000, MoTa: 'Khung giờ từ 22:00 đến 07:00' },
  { MaBangGia: 5, TenLoaiXe: 'Vé tháng xe máy', LoaiXe: 'XeMay', DonViTinh: 'Thang', GiaTien: 120000, MoTa: 'Không giới hạn lượt ra vào' },
  { MaBangGia: 6, TenLoaiXe: 'Vé tháng ô tô', LoaiXe: 'OTo', DonViTinh: 'Thang', GiaTien: 1200000, MoTa: 'Ưu tiên vị trí đỗ cố định tại Khu A' }
];

export const MOCK_MONTHLY_PASSES = [
  { MaVeThang: 1, MaThe: 'CARD-8899', BienSoXe: '20A-888.88', TenChuXe: 'Nông Việt Anh', SoDienThoai: '0988888888', TenLoaiXe: 'Ô tô 4-7 chỗ', NgayBatDau: '2026-09-01', NgayHetHan: '2026-10-01', TrangThai: 'HoatDong' },
  { MaVeThang: 2, MaThe: 'CARD-1122', BienSoXe: '20B1-678.90', TenChuXe: 'Hoàng Văn Minh', SoDienThoai: '0977777777', TenLoaiXe: 'Xe máy', NgayBatDau: '2026-09-15', NgayHetHan: '2026-10-15', TrangThai: 'HoatDong' },
  { MaVeThang: 3, MaThe: 'CARD-3344', BienSoXe: '20M-999.99', TenChuXe: 'Giàng A Tùng', SoDienThoai: '0966666666', TenLoaiXe: 'Xe máy', NgayBatDau: '2026-08-10', NgayHetHan: '2026-09-10', TrangThai: 'HetHan' }
];

export const MOCK_HISTORY = [
  { MaLuotDo: 98, BienSoXe: '20A-123.45', TenLoaiXe: 'Ô tô 4 chỗ', ThoiGianVao: '2026-09-23 08:15:00', ThoiGianRa: '2026-09-23 11:45:00', ViTriDo: 'A-04', TongTien: 75000, PhuongThucThanhToan: 'ChuyenKhoan', TrangThai: 'DaRa' },
  { MaLuotDo: 99, BienSoXe: '20B1-555.77', TenLoaiXe: 'Xe máy', ThoiGianVao: '2026-09-23 09:00:00', ThoiGianRa: '2026-09-23 10:30:00', ViTriDo: 'B-12', TongTien: 5000, PhuongThucThanhToan: 'TienMat', TrangThai: 'DaRa' },
  { MaLuotDo: 100, BienSoXe: '30H-888.99', TenLoaiXe: 'Ô tô 7 chỗ', ThoiGianVao: '2026-09-23 14:00:00', ThoiGianRa: '2026-09-23 17:30:00', ViTriDo: 'A-08', TongTien: 100000, PhuongThucThanhToan: 'QR_Code', TrangThai: 'DaRa' }
];
