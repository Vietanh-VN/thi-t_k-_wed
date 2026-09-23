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
  TongSoViTri: 70,
  SoViTriDangSuDung: 38,
  SoViTriTrong: 31,
  SoViTriBaoTri: 1,
  TyLeLapDay: 54.3,
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
  { MaKhuVuc: 1, KhuVucId: 1, TenKhuVuc: 'Khu A - Xe máy số & Tay ga', LoaiXePhuHop: 'XeMay', MoTa: 'Khu vực bãi đỗ xe máy sinh viên Cổng 1', TongSoViTri: 30, TongSoCho: 30, SoViTriDangSuDung: 18, SoChoDangDung: 18, SoViTriTrong: 11, SoChoTrong: 11, TyLe: 60, TyLeLapDay: 60 },
  { MaKhuVuc: 2, KhuVucId: 2, TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV', LoaiXePhuHop: 'XeMay', MoTa: 'Nhà xe có mái che trung tâm ICTU', TongSoViTri: 25, TongSoCho: 25, SoViTriDangSuDung: 15, SoChoDangDung: 15, SoViTriTrong: 10, SoChoTrong: 10, TyLe: 60, TyLeLapDay: 60 },
  { MaKhuVuc: 3, KhuVucId: 3, TenKhuVuc: 'Khu C - Xe máy điện & Xe đạp điện', LoaiXePhuHop: 'XeDien', MoTa: 'Bãi đỗ có trạm sạc điện thông minh', TongSoViTri: 15, TongSoCho: 15, SoViTriDangSuDung: 5, SoChoDangDung: 5, SoViTriTrong: 10, SoChoTrong: 10, TyLe: 33, TyLeLapDay: 33 }
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
    KhuVucId: 1,
    TenKhuVuc: 'Khu A - Xe máy số & Tay ga',
    TenLoaiXe: 'Xe máy số & tay ga',
    TrangThai: i < 18 ? 'DangSuDung' : (i === 29 ? 'BaoTri' : 'Trong'),
    BienSoXe: i < 18 ? `20B1-${10000 + i * 111}` : null,
    BienSoHienTai: i < 18 ? `20B1-${10000 + i * 111}` : null,
    ThoiGianVao: i < 18 ? '2026-09-24T07:30:00' : null,
    ThoiGianVaoHienTai: i < 18 ? '2026-09-24 07:30' : null,
    LoaiXe: 'XeMay',
    LoaiXeId: 1
  })),
  ...Array.from({ length: 25 }, (_, i) => ({
    MaViTri: i + 31,
    ViTriId: i + 31,
    MaSoViTri: `B-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `B-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 2,
    KhuVucId: 2,
    TenKhuVuc: 'Khu B - Xe máy Cán bộ & SV',
    TenLoaiXe: 'Xe máy cán bộ & SV',
    TrangThai: i < 15 ? 'DangSuDung' : 'Trong',
    BienSoXe: i < 15 ? `20B2-${20000 + i * 222}` : null,
    BienSoHienTai: i < 15 ? `20B2-${20000 + i * 222}` : null,
    ThoiGianVao: i < 15 ? '2026-09-24T08:00:00' : null,
    ThoiGianVaoHienTai: i < 15 ? '2026-09-24 08:00' : null,
    LoaiXe: 'XeMay',
    LoaiXeId: 1
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    MaViTri: i + 56,
    ViTriId: i + 56,
    MaSoViTri: `C-${String(i + 1).padStart(2, '0')}`,
    TenViTri: `C-${String(i + 1).padStart(2, '0')}`,
    MaKhuVuc: 3,
    KhuVucId: 3,
    TenKhuVuc: 'Khu C - Xe máy điện & Xe đạp điện',
    TenLoaiXe: 'Xe máy điện & xe đạp điện',
    TrangThai: i < 5 ? 'DangSuDung' : 'Trong',
    BienSoXe: i < 5 ? `20MD-${30000 + i * 333}` : null,
    BienSoHienTai: i < 5 ? `20MD-${30000 + i * 333}` : null,
    ThoiGianVao: i < 5 ? '2026-09-24T08:30:00' : null,
    ThoiGianVaoHienTai: i < 5 ? '2026-09-24 08:30' : null,
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

// Dữ liệu Kiến trúc Đa Tác nhân AI (Multi-Agent PEAS Model)
export const MOCK_AI_AGENTS = {
  system_name: 'Hệ thống Đa Tác nhân AI Bãi đỗ xe Thông minh ICTU',
  agent_count: 5,
  engine_mode: 'Dual-Mode (Online Gemini LLM & Offline Local Heuristic)',
  has_gemini_key: false,
  agents: [
    {
      id: 'agent-spot-allocator',
      name: 'Tác nhân Phân bổ Vị trí Đỗ Tối ưu (Smart Spot Allocator Agent)',
      type: 'Goal-based & Utility-based Agent',
      role: 'Tự động phân tích loại phương tiện (xe máy số, xe tay ga, xe điện), tìm vị trí đỗ trống gần nhất và cân bằng tải giữa các phân khu.',
      status: 'Active',
      peas: {
        performance: 'Tối thiểu hóa thời gian tìm chỗ của xe, tối đa hóa tỷ lệ lấp đầy đồng đều.',
        environment: 'Bãi đỗ xe gồm 70 vị trí (Đang dùng: 38, Trống: 31, Bảo trì: 1).',
        actuators: 'Gán vị trí đỗ ViTriId, cập nhật trạng thái ô đỗ thành DangSuDung, in phiếu gửi xe.',
        sensors: 'Loại phương tiện, kích thước xe, sơ đồ trạng thái vị trí đỗ thời gian thực.'
      },
      metrics: {
        cho_trong: 31,
        ty_le_lap_day: '54.3%'
      }
    },
    {
      id: 'agent-peak-predictor',
      name: 'Tác nhân Nhận diện & Dự báo Giờ Cao điểm (Peak-Hours Predictive Agent)',
      type: 'Model-based Reflex Agent',
      role: 'Phân tích chuỗi thời gian lưu lượng 24h, tự động phát hiện đỉnh tải và cảnh báo nguy cơ ùn tắc cổng vào.',
      status: 'Active',
      peas: {
        performance: 'Phát hiện sớm 100% khung giờ quá tải, độ trễ cảnh báo dưới 1 giây.',
        environment: 'Luồng xe vào/ra 24 giờ và phân bố lưu lượng theo ngày trong tuần.',
        actuators: 'Gửi tín hiệu cảnh báo đỉnh tải, đề xuất mở thêm làn kiểm soát.',
        sensors: 'Dữ liệu giao dịch check-in/check-out theo từng khung giờ trong CSDL.'
      },
      metrics: {
        gio_cao_diem_nhat: '07:00 - 08:00',
        luot_xe_hom_nay: 380
      }
    },
    {
      id: 'agent-staffing-optimizer',
      name: 'Tác nhân Tối ưu Điều phối Nhân sự (Smart Staffing Optimizer Agent)',
      type: 'Utility-based Agent',
      role: 'Tính toán và phân bổ nhân lực bảo vệ/thu ngân tối ưu cho 3 ca làm việc dựa trên lưu lượng phương tiện.',
      status: 'Active',
      peas: {
        performance: 'Tối ưu hóa chi phí nhân công, đảm bảo không thiếu hụt nhân viên giờ cao điểm.',
        environment: '3 ca làm việc (Ca Sáng, Ca Chiều, Ca Đêm) và số lượng cổng kiểm soát.',
        actuators: 'Bảng phân công nhân sự chi tiết, danh sách nhiệm vụ trọng tâm cho từng vị trí.',
        sensors: 'Mật độ phương tiện dự kiến theo ca từ dữ liệu thống kê lưu lượng.'
      },
      metrics: {
        so_ca: 3,
        tieu_chuan: 'Heuristic cân đối tải trọng'
      }
    },
    {
      id: 'agent-executive-reporter',
      name: 'Tác nhân Tổng hợp Báo cáo Tự động (Automated Executive Reporting Agent)',
      type: 'Learning & LLM-Augmented Agent',
      role: 'Tự động thu thập KPIs vận hành, tổng hợp báo cáo điều hành thông minh theo ngày/tuần bằng Dual-Mode Engine.',
      status: 'Active',
      peas: {
        performance: 'Báo cáo đầy đủ 100% chỉ số tài chính và vận hành, triệt tiêu hoàn toàn ảo giác (No Hallucination).',
        environment: 'Toàn bộ cơ sở dữ liệu giao dịch, doanh thu, vé tháng và phân khu.',
        actuators: 'Văn bản báo cáo phân tích đa chiều (Markdown/Text), bảng tổng hợp số liệu KPIs.',
        sensors: 'CSDL Doanh thu, Lịch sử gửi xe, Tỷ lệ lấp đầy bãi đỗ.'
      },
      metrics: {
        doanh_thu_thang: '28.400.000 đ',
        ve_thang_hoat_dong: 125,
        engine_mode: 'Local Heuristic NLP Engine'
      }
    },
    {
      id: 'agent-conversational-assistant',
      name: 'Tác nhân Hỏi đáp & Phục vụ Khách hàng (Conversational Assistant Agent)',
      type: 'Goal-based Interactive Agent',
      role: 'Trợ lý đối thoại tự nhiên, giải đáp thắc mắc, tra cứu vị trí xe theo biển số qua NLP, tư vấn giá vé và chính sách nhà xe ICTU.',
      status: 'Active',
      peas: {
        performance: 'Độ chính xác thông tin 100%, thời gian phản hồi < 15ms.',
        environment: 'Người dùng hệ thống (Quản lý, Nhân viên, Khách hàng) và CSDL tra cứu.',
        actuators: 'Câu trả lời tương tác tự nhiên bằng tiếng Việt, danh sách câu hỏi gợi ý tiếp theo.',
        sensors: 'Câu hỏi ngôn ngữ tự nhiên từ người dùng, biểu thức Regex, CSDL bảng giá & phương tiện.'
      },
      metrics: {
        do_chinh_xac: '100% Grounding',
        ho_tro_tra_cuu_bien_so: 'Tích hợp sẵn'
      }
    }
  ]
};

// Dữ liệu Báo cáo AI trong ngày
export const MOCK_AI_REPORT_DAY = {
  LoaiBaoCao: 'Ngay',
  NgayXem: new Date().toISOString().split('T')[0],
  TieuDe: 'Báo cáo Vận hành Toàn diện Bãi Đỗ Xe ICTU Hôm Nay',
  NguonDuLieu: 'Hệ thống CSDL Smart Parking ICTU Real-time',
  ChiSoChinh: {
    XeVao: 215,
    XeRa: 165,
    TongLuot: 380,
    DoanhThu: 950000,
    TyLeLapDay: 54.3,
    SoChoTrong: 31
  },
  NoiDungBaoCao: `### 1. Tổng quan Hoạt động Trong Ngày
- Tổng lượt xe vào bãi: **215** lượt (Xe máy & xe điện sinh viên, cán bộ).
- Tổng lượt xe xuất bãi: **165** lượt.
- Doanh thu trong ngày đạt: **950.000 VNĐ**.
- Tình trạng bãi: Đang đỗ **38/70** vị trí (Tỷ lệ lấp đầy: **54.3%**), còn **31** chỗ trống sẵn sàng.

### 2. Phân tích Khung Giờ Cao Điểm
- Khung giờ cao điểm sáng: **07:00 - 08:30** (Sinh viên nhập học ca 1).
- Khung giờ cao điểm chiều: **12:30 - 13:30** (Đổi ca học chiều).
- Phân khu A (Xe máy số & tay ga Cổng 1) có lưu lượng tập trung cao nhất (60% công suất).

### 3. Đánh Giá & Xu Hướng
- Không xảy ra tình trạng ùn tắc cục bộ tại cổng vào.
- Trạm sạc xe máy điện (Khu C) đáp ứng tốt nhu cầu, hiện đang sạc 5 phương tiện.`,
  GoiYDieuHanh: 'Bố trí 02 nhân sự trực tại Cổng 1 trong khung giờ 07:00 - 08:30 sáng và 12:30 - 13:30 chiều. Hướng dẫn sinh viên chủ động xếp xe vào sâu bên trong Khu B để tránh ùn ứ cục bộ.'
};

// Dữ liệu Báo cáo AI cả tuần
export const MOCK_AI_REPORT_WEEK = {
  LoaiBaoCao: 'Tuan',
  NgayXem: new Date().toISOString().split('T')[0],
  TieuDe: 'Báo cáo Lưu Lượng & Doanh Thu Toàn Bãi Tuần Này',
  NguonDuLieu: 'Hệ thống CSDL Smart Parking ICTU Real-time',
  ChiSoChinh: {
    XeVao: 1520,
    XeRa: 1480,
    TongLuot: 3000,
    DoanhThu: 6800000,
    TyLeLapDay: 58.5,
    SoChoTrong: 29
  },
  NoiDungBaoCao: `### 1. Tổng kết Hoạt động Tuần
- Tổng lượt xe phục vụ cả tuần: **3.000** lượt xe.
- Doanh thu tuần ước đạt: **6.800.000 VNĐ**.
- Ngày cao điểm nhất: **Thứ 6** (510 lượt) và **Thứ 3** (450 lượt).

### 2. Xu hướng Lưu Lượng Vận Hành
- Đầu tuần và giữa tuần lưu lượng ổn định từ **420 - 510** lượt/ngày.
- Cuối tuần (Thứ 7, Chủ Nhật) giảm còn **200 - 310** lượt/ngày.
- Số lượng vé tháng đang hoạt động: **125** vé, duy trì nguồn thu định kỳ ổn định.`,
  GoiYDieuHanh: 'Bảo dưỡng định kỳ camera và thanh chắn vào sáng Chủ Nhật khi lượng xe gửi thấp nhất.'
};

// Dữ liệu Giờ cao điểm
export const MOCK_AI_PEAK_HOURS = {
  NgayPhanTich: new Date().toISOString().split('T')[0],
  KhungGioCaoNhat: '07:00 - 08:00',
  LuuLuongCaoNhat: 107,
  DanhSachGioCaoDiem: [
    { KhungGio: '07:00 - 08:00', TongLuot: 107, SoXeVao: 95, SoXeRa: 12, DanhGia: 'Cực kỳ đông (Đầu ca học sáng)' },
    { KhungGio: '12:00 - 13:00', TongLuot: 105, SoXeVao: 65, SoXeRa: 40, DanhGia: 'Rất đông (Giờ chuyển ca trưa)' },
    { KhungGio: '13:00 - 14:00', TongLuot: 100, SoXeVao: 80, SoXeRa: 20, DanhGia: 'Cao (Vào ca học chiều)' },
    { KhungGio: '16:00 - 17:00', TongLuot: 95, SoXeVao: 20, SoXeRa: 75, DanhGia: 'Đông chiều (Tan học chiều)' }
  ],
  PhanTichXuHuong: 'Lưu lượng bãi xe tập trung đột biến vào thời điểm đầu ca học (07:00 - 08:00 và 13:00 - 14:00). Sinh viên có xu hướng tập trung ở Cổng 1 gần giảng đường chính.',
  GoiYBaoTri: 'Phân luồng phương tiện xe máy điện sang Cổng 2 / Khu C từ 07:15 để giảm 40% áp lực tại Cổng 1.'
};

// Dữ liệu Gợi ý nhân sự
export const MOCK_AI_STAFFING = {
  NgayApDung: new Date().toISOString().split('T')[0],
  TongSoNhanVienCanThiet: 6,
  KhuyenNghiBoTri: [
    {
      CaLamViec: 'Ca Sáng (06:00 - 14:00)',
      MucDoTai: 'Cao',
      SoNhanVienGoiY: 3,
      LuuLuongDuKien: '220 - 250 lượt xe',
      NhiemVuTrongTam: '02 nhân viên trực quét vé & soát xe Cổng 1; 01 nhân viên điều tiết sắp xếp gọn gàng tại Khu A.'
    },
    {
      CaLamViec: 'Ca Chiều (14:00 - 22:00)',
      MucDoTai: 'Cao',
      SoNhanVienGoiY: 2,
      LuuLuongDuKien: '150 - 180 lượt xe',
      NhiemVuTrongTam: '01 nhân viên thu ngân xuất bãi; 01 nhân viên tuần tra kiểm tra trật tự và trạm sạc xe điện.'
    },
    {
      CaLamViec: 'Ca Đêm (22:00 - 06:00)',
      MucDoTai: 'Thấp',
      SoNhanVienGoiY: 1,
      LuuLuongDuKien: '10 - 20 lượt gửi qua đêm',
      NhiemVuTrongTam: 'Khóa cổng phụ, ghi nhận danh sách xe lưu trú qua đêm và giám sát an ninh camera.'
    }
  ],
  GiaiThichChiTiet: 'Bố trí 3 nhân viên ca sáng giúp triệt tiêu hoàn toàn nguy cơ ùn tắc giờ cao điểm đầu ngày.',
  UuTienToiUu: 'Tối ưu nhân sự giờ cao điểm kết hợp hệ thống camera quét biển số tự động.'
};
