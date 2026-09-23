// Mock data chuẩn hóa cho Bãi đỗ xe trường ĐH CNTT & Truyền thông Thái Nguyên (ICTU)
// Đã xóa hoàn toàn ô tô và cập nhật bảng giá chính xác theo biển bảng nhà xe ICTU

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
    HoTen: 'Giàng A Tùng (Sinh viên)',
    Email: 'khachhang@gmail.com',
    SoDienThoai: '0966666666',
    VaiTro: 'KhachHang',
    TrangThai: 'HoatDong'
  },
  'ai@parking.vn': {
    MaNguoiDung: 4,
    TenDangNhap: 'ai',
    HoTen: 'AI Engine ICTU',
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
  TongLuotXeHomNay: 380,
  LuotVaoHomNay: 215,
  LuotRaHomNay: 165,
  DoanhThuHomNay: 950000,
  DoanhThuThang: 28400000,
  VeThangDangHoatDong: 125
};

export const MOCK_HOURLY = [
  { Gio: '06:00', LuotVao: 25, LuotRa: 5 },
  { Gio: '07:00', LuotVao: 95, LuotRa: 12 },
  { Gio: '08:00', LuotVao: 70, LuotRa: 18 },
  { Gio: '09:00', LuotVao: 30, LuotRa: 25 },
  { Gio: '10:00', LuotVao: 20, LuotRa: 35 },
  { Gio: '11:00', LuotVao: 15, LuotRa: 85 },
  { Gio: '12:00', LuotVao: 65, LuotRa: 40 },
  { Gio: '13:00', LuotVao: 80, LuotRa: 20 },
  { Gio: '14:00', LuotVao: 40, LuotRa: 25 },
  { Gio: '15:00', LuotVao: 30, LuotRa: 35 },
  { Gio: '16:00', LuotVao: 20, LuotRa: 75 },
  { Gio: '17:00', LuotVao: 25, LuotRa: 90 },
  { Gio: '18:00', LuotVao: 15, LuotRa: 40 }
];

export const MOCK_WEEKLY = [
  { Ngay: 'T2', DoanhThu: 920000, LuotXe: 420 },
  { Ngay: 'T3', DoanhThu: 980000, LuotXe: 450 },
  { Ngay: 'T4', DoanhThu: 950000, LuotXe: 430 },
  { Ngay: 'T5', DoanhThu: 1050000, LuotXe: 480 },
  { Ngay: 'T6', DoanhThu: 1120000, LuotXe: 510 },
  { Ngay: 'T7', DoanhThu: 680000, LuotXe: 310 },
  { Ngay: 'CN', DoanhThu: 450000, LuotXe: 200 }
];

export const MOCK_ZONES = [
  { MaKhuVuc: 1, KhuVucId: 1, TenKhuVuc: 'Khu A - Xe máy số & Tay ga', LoaiXePhuHop: 'XeMay', MoTa: 'Khu vực bãi đỗ xe máy sinh viên Cổng 1', TongSoViTri: 60, TongSoCho: 60, SoViTriDangSuDung: 42, SoChoDangDung: 42, SoViTriTrong: 18, SoChoTrong: 18, TyLe: 70, TyLeLapDay: 70 },
  { MaKhuVuc: 2, KhuVucId: 2, TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV', LoaiXePhuHop: 'XeMay', MoTa: 'Nhà xe có mái che trung tâm ICTU', TongSoViTri: 40, TongSoCho: 40, SoViTriDangSuDung: 26, SoChoDangDung: 26, SoViTriTrong: 14, SoChoTrong: 14, TyLe: 65, TyLeLapDay: 65 },
  { MaKhuVuc: 3, KhuVucId: 3, TenKhuVuc: 'Khu C - Xe máy điện & Xe đạp điện', LoaiXePhuHop: 'XeDien', MoTa: 'Bãi đỗ có trạm sạc điện thông minh', TongSoViTri: 20, TongSoCho: 20, SoViTriDangSuDung: 10, SoChoDangDung: 10, SoViTriTrong: 10, SoChoTrong: 10, TyLe: 50, TyLeLapDay: 50 }
];

export const MOCK_VEHICLE_STATS = [
  { name: 'Xe máy số (Wave/Sirius)', value: 185 },
  { name: 'Xe tay ga (Vision/AirBlade)', value: 145 },
  { name: 'Xe máy điện (VinFast/Pega)', value: 55 },
  { name: 'Xe đạp điện', value: 25 }
];

export const MOCK_VEHICLE_TYPES = [
  { LoaiXeId: 1, TenLoaiXe: 'Xe máy', MoTa: 'Xe máy số, xe tay ga sinh viên và cán bộ' },
  { LoaiXeId: 2, TenLoaiXe: 'Xe điện', MoTa: 'Xe máy điện, xe đạp điện có trạm sạc' }
];

// Danh sách vị trí đỗ (Không còn bất kỳ ô tô nào)
export const MOCK_SPOTS = [
  ...Array.from({ length: 30 }, (_, i) => ({
    MaViTri: i + 1,
    ViTriId: i + 1,
    MaSoViTri: `A-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `A-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 1,
    TenKhuVuc: 'Khu A - Xe máy số & Tay ga',
    TrangThai: i < 18 ? 'DangSuDung' : (i === 29 ? 'BaoTri' : 'Trong'),
    BienSoXe: i < 18 ? `20B1-${10000 + i * 111}` : null,
    ThoiGianVao: i < 18 ? '2026-09-24T07:30:00' : null,
    LoaiXe: 'XeMay',
    LoaiXeId: 1
  })),
  ...Array.from({ length: 25 }, (_, i) => ({
    MaViTri: i + 31,
    ViTriId: i + 31,
    MaSoViTri: `B-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `B-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 2,
    TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV',
    TrangThai: i < 15 ? 'DangSuDung' : 'Trong',
    BienSoXe: i < 15 ? `20B2-${20000 + i * 222}` : null,
    ThoiGianVao: i < 15 ? '2026-09-24T08:00:00' : null,
    LoaiXe: 'XeMay',
    LoaiXeId: 1
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    MaViTri: i + 56,
    ViTriId: i + 56,
    MaSoViTri: `C-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `C-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 3,
    TenKhuVuc: 'Khu C - Xe máy điện & Xe đạp điện',
    TrangThai: i < 5 ? 'DangSuDung' : 'Trong',
    BienSoXe: i < 5 ? `20MD-${30000 + i * 333}` : null,
    ThoiGianVao: i < 5 ? '2026-09-24T08:30:00' : null,
    LoaiXe: 'XeDien',
    LoaiXeId: 2
  }))
];

// Danh sách xe máy đang trong bãi
export const MOCK_ACTIVE_SESSIONS = [
  { LuotGuiId: 101, MaLuotDo: 101, BienSo: '20B1-123.45', BienSoXe: '20B1-123.45', TenLoaiXe: 'Xe máy Honda Wave', ThoiGianVao: '2026-09-24T08:12:00', TenViTri: 'A-03', MaViTri: 'A-03', TenKhuVuc: 'Khu A - Xe máy số & Tay ga' },
  { LuotGuiId: 102, MaLuotDo: 102, BienSo: '20F1-999.22', BienSoXe: '20F1-999.22', TenLoaiXe: 'Xe máy Honda SH', ThoiGianVao: '2026-09-24T08:50:00', TenViTri: 'A-07', MaViTri: 'A-07', TenKhuVuc: 'Khu A - Xe máy số & Tay ga' },
  { LuotGuiId: 103, MaLuotDo: 103, BienSo: '20B2-456.78', BienSoXe: '20B2-456.78', TenLoaiXe: 'Xe máy Yamaha Exciter', ThoiGianVao: '2026-09-24T09:15:00', TenViTri: 'B-04', MaViTri: 'B-04', TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV' },
  { LuotGuiId: 104, MaLuotDo: 104, BienSo: '20MD-333.88', BienSoXe: '20MD-333.88', TenLoaiXe: 'Xe máy điện VinFast', ThoiGianVao: '2026-09-24T09:35:00', TenViTri: 'C-02', MaViTri: 'C-02', TenKhuVuc: 'Khu C - Xe máy điện & Xe đạp điện' },
  { LuotGuiId: 105, MaLuotDo: 105, BienSo: '20H1-777.66', BienSoXe: '20H1-777.66', TenLoaiXe: 'Xe máy Honda Vision', ThoiGianVao: '2026-09-24T09:50:00', TenViTri: 'A-11', MaViTri: 'A-11', TenKhuVuc: 'Khu A - Xe máy số & Tay ga' },
  { LuotGuiId: 106, MaLuotDo: 106, BienSo: '20K1-222.11', BienSoXe: '20K1-222.11', TenLoaiXe: 'Xe máy Honda AirBlade', ThoiGianVao: '2026-09-24T10:10:00', TenViTri: 'B-08', MaViTri: 'B-08', TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV' }
];

// BẢNG GIÁ THU PHÍ DỊCH VỤ GỬI XE - CHUẨN 100% THEO BIỂN BẢNG NHÀ XE ICTU THÁI NGUYÊN
export const MOCK_PRICING = [
  {
    BangGiaId: 1,
    MaBangGia: 1,
    LoaiXeId: 1,
    TenLoaiXe: 'Xe máy / Xe điện',
    NoiDungDichVu: 'BUỔI SÁNG',
    TuGio: '06:00',
    DenGio: '12:00',
    DonGia: 2000,
    GiaTien: 2000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'Sun',
    MoTa: 'Áp dụng cho học phần & ca học sáng'
  },
  {
    BangGiaId: 2,
    MaBangGia: 2,
    LoaiXeId: 1,
    TenLoaiXe: 'Xe máy / Xe điện',
    NoiDungDichVu: 'BUỔI CHIỀU',
    TuGio: '12:00',
    DenGio: '18:00',
    DonGia: 2000,
    GiaTien: 2000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'SunMedium',
    MoTa: 'Áp dụng cho ca học chiều'
  },
  {
    BangGiaId: 3,
    MaBangGia: 3,
    LoaiXeId: 1,
    TenLoaiXe: 'Xe máy / Xe điện',
    NoiDungDichVu: 'BUỔI TỐI',
    TuGio: '18:00',
    DenGio: '22:00',
    DonGia: 3000,
    GiaTien: 3000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'Moon',
    MoTa: 'Áp dụng ca học tối & tự học thư viện'
  },
  {
    BangGiaId: 4,
    MaBangGia: 4,
    LoaiXeId: 1,
    TenLoaiXe: 'Xe máy / Xe điện',
    NoiDungDichVu: 'XE GỬI QUA ĐÊM',
    TuGio: '22:00',
    DenGio: '06:00',
    DonGia: 10000,
    GiaTien: 10000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'MoonStar',
    MoTa: 'Phương tiện gửi lưu trú qua đêm'
  },
  {
    BangGiaId: 5,
    MaBangGia: 5,
    LoaiXeId: 1,
    TenLoaiXe: 'Phụ thu vi phạm',
    NoiDungDichVu: 'BỊ MẤT VÉ XE',
    TuGio: null,
    DenGio: null,
    DonGia: 10000,
    GiaTien: 10000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'Lock',
    MoTa: 'Phụ thu xác minh đăng ký xe & CCCD'
  },
  {
    BangGiaId: 6,
    MaBangGia: 6,
    LoaiXeId: 1,
    TenLoaiXe: 'Vé tháng sinh viên',
    NoiDungDichVu: 'XE GỬI THEO THÁNG',
    TuGio: null,
    DenGio: null,
    DonGia: 80000,
    GiaTien: 80000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'Calendar',
    MoTa: 'Gửi ban ngày trong tháng không giới hạn lượt'
  },
  {
    BangGiaId: 7,
    MaBangGia: 7,
    LoaiXeId: 1,
    TenLoaiXe: 'Vé tháng nội trú KTX',
    NoiDungDichVu: 'XE GỬI THEO THÁNG QUA ĐÊM TẠI NHÀ XE',
    TuGio: null,
    DenGio: null,
    DonGia: 100000,
    GiaTien: 100000,
    DonViTinh: 'đ',
    TrangThai: true,
    Icon: 'Home',
    MoTa: 'Gửi cả ngày lẫn qua đêm trọn gói 1 tháng'
  }
];

// Danh sách vé tháng xe máy
export const MOCK_MONTHLY_PASSES = [
  { MaVeThang: 1, MaThe: 'CARD-8899', BienSoXe: '20B1-888.88', TenChuXe: 'Nông Việt Anh', SoDienThoai: '0988888888', TenLoaiXe: 'Xe máy số Honda Wave', LoaiVe: 'Theo tháng', GiaVe: 80000, NgayBatDau: '2026-09-01', NgayHetHan: '2026-10-01', TrangThai: 'HoatDong' },
  { MaVeThang: 2, MaThe: 'CARD-1122', BienSoXe: '20B1-678.90', TenChuXe: 'Hoàng Văn Minh', SoDienThoai: '0977777777', TenLoaiXe: 'Xe máy Yamaha Exciter', LoaiVe: 'Theo tháng qua đêm', GiaVe: 100000, NgayBatDau: '2026-09-15', NgayHetHan: '2026-10-15', TrangThai: 'HoatDong' },
  { MaVeThang: 3, MaThe: 'CARD-3344', BienSoXe: '20MD-999.99', TenChuXe: 'Giàng A Tùng', SoDienThoai: '0966666666', TenLoaiXe: 'Xe máy điện VinFast', LoaiVe: 'Theo tháng', GiaVe: 80000, NgayBatDau: '2026-08-10', NgayHetHan: '2026-09-10', TrangThai: 'HetHan' }
];

export const MOCK_HISTORY = [
  { MaLuotDo: 98, BienSoXe: '20B1-123.45', TenLoaiXe: 'Xe máy số', ThoiGianVao: '2026-09-23T08:15:00', ThoiGianRa: '2026-09-23T11:45:00', ViTriDo: 'A-04', TongTien: 2000, PhuongThucThanhToan: 'ChuyenKhoan', TrangThai: 'DaRa' },
  { MaLuotDo: 99, BienSoXe: '20B1-555.77', TenLoaiXe: 'Xe tay ga', ThoiGianVao: '2026-09-23T13:00:00', ThoiGianRa: '2026-09-23T16:30:00', ViTriDo: 'B-12', TongTien: 2000, PhuongThucThanhToan: 'TienMat', TrangThai: 'DaRa' },
  { MaLuotDo: 100, BienSoXe: '20MD-888.99', TenLoaiXe: 'Xe máy điện', ThoiGianVao: '2026-09-23T18:00:00', ThoiGianRa: '2026-09-23T21:30:00', ViTriDo: 'C-01', TongTien: 3000, PhuongThucThanhToan: 'QR_Code', TrangThai: 'DaRa' }
];
