import axios from 'axios';
import {
  MOCK_USERS,
  MOCK_OVERVIEW,
  MOCK_HOURLY,
  MOCK_WEEKLY,
  MOCK_ZONES,
  MOCK_VEHICLE_STATS,
  MOCK_SPOTS,
  MOCK_ACTIVE_SESSIONS,
  MOCK_PRICING,
  MOCK_MONTHLY_PASSES,
  MOCK_HISTORY,
  MOCK_VEHICLE_TYPES
} from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor nạp Token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parking_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper giả lập phản hồi Mock Data khi backend offline
const handleMockFallback = (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // 1. Đăng nhập /auth/login
  if (url.includes('/auth/login') && method === 'post') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    } catch {
      body = {};
    }
    const email = (body.email || '').toLowerCase().trim();

    let user = null;
    if (email.includes('admin')) {
      user = MOCK_USERS['admin@parking.vn'];
    } else if (email.includes('staff')) {
      user = MOCK_USERS['staff@parking.vn'];
    } else if (email.includes('khachhang') || email.includes('customer')) {
      user = MOCK_USERS['khachhang@gmail.com'];
    } else if (email.includes('ai')) {
      user = MOCK_USERS['ai@parking.vn'];
    } else {
      user = {
        MaNguoiDung: 99,
        TenDangNhap: email.split('@')[0] || 'demo_user',
        HoTen: email.split('@')[0] || 'Người dùng Demo',
        Email: email || 'demo@parking.vn',
        SoDienThoai: '0988888888',
        VaiTro: 'QuanLy',
        TrangThai: 'HoatDong'
      };
    }

    return {
      data: {
        access_token: `demo_token_${Date.now()}`,
        token_type: 'bearer',
        user
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // 2. /auth/me
  if (url.includes('/auth/me')) {
    const saved = localStorage.getItem('parking_user');
    const user = saved ? JSON.parse(saved) : MOCK_USERS['admin@parking.vn'];
    return { data: user, status: 200, statusText: 'OK', headers: {}, config };
  }

  // 3. Thống kê
  if (url.includes('/stats/overview')) return { data: MOCK_OVERVIEW, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/stats/hourly')) return { data: MOCK_HOURLY, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/stats/7-days')) return { data: MOCK_WEEKLY, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/stats/zones')) return { data: MOCK_ZONES, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/stats/vehicle-types')) return { data: MOCK_VEHICLE_STATS, status: 200, statusText: 'OK', headers: {}, config };

  // 4. Bãi đỗ & Vị trí
  if (url.includes('/parking/active-sessions')) return { data: MOCK_ACTIVE_SESSIONS, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/zones')) return { data: MOCK_ZONES, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/vehicle-types')) return { data: MOCK_VEHICLE_TYPES, status: 200, statusText: 'OK', headers: {}, config };

  if (url.includes('/vehicles/lookup')) {
    const segments = url.split('/');
    const plate = decodeURIComponent(segments[segments.length - 1] || '').toUpperCase();
    const isElectric = plate.includes('MD');
    const hasMonthlyPass = plate.includes('77889') || plate.includes('44556');
    return {
      data: {
        BienSo: plate,
        DangGuiTrongBai: false,
        CoVeThang: hasMonthlyPass,
        NgayHetHanVeThang: hasMonthlyPass ? '2026-10-31' : null,
        LoaiXeId: isElectric ? 2 : 1
      },
      status: 200, statusText: 'OK', headers: {}, config
    };
  }

  if (url.includes('/spots')) {
    if (url.includes('status_filter=Trong')) {
      const vacant = MOCK_SPOTS.filter(s => s.TrangThai === 'Trong');
      return { data: vacant, status: 200, statusText: 'OK', headers: {}, config };
    }
    return { data: MOCK_SPOTS, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Ghi nhận xe vào /parking/check-in
  if (url.includes('/parking/check-in') && method === 'post') {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch {}
    const bienSo = (body.BienSo || '20B1-12345').toUpperCase();
    const loaiXeId = Number(body.LoaiXeId) || 1;
    const spotName = body.ViTriId ? (MOCK_SPOTS.find(s => s.ViTriId === Number(body.ViTriId))?.TenViTri || `B-${body.ViTriId}`) : (loaiXeId === 2 ? 'E-06' : 'B-15');
    const hasPass = bienSo.includes('77889') || bienSo.includes('44556');

    return {
      data: {
        LuotGuiId: Math.floor(1000 + Math.random() * 9000),
        BienSo: bienSo,
        TenLoaiXe: loaiXeId === 2 ? 'Xe điện' : 'Xe máy',
        TenViTri: spotName,
        TenKhuVuc: loaiXeId === 2 ? 'Khu E - Xe máy điện' : 'Khu B - Xe máy',
        ThoiGianVao: new Date().toISOString(),
        CoVeThang: hasPass
      },
      status: 200, statusText: 'OK', headers: {}, config
    };
  }

  // Tính phí xuất bãi /parking/calculate-fee
  if (url.includes('/parking/calculate-fee') && method === 'post') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    } catch {
      body = {};
    }
    const bienSo = (body.BienSo || '20B1-123.45').toUpperCase();
    const isMatVe = Boolean(body.MatVe);
    const matched = MOCK_ACTIVE_SESSIONS.find(s => s.BienSo === bienSo) || MOCK_ACTIVE_SESSIONS[0];

    const phiGui = 2000;
    const phuThu = isMatVe ? 10000 : 0;
    const tongTien = phiGui + phuThu;

    return {
      data: {
        BienSo: bienSo,
        TenLoaiXe: matched?.TenLoaiXe || 'Xe máy',
        TenViTri: matched?.TenViTri || 'A-03',
        TenKhuVuc: matched?.TenKhuVuc || 'Khu A - Xe máy số & Tay ga',
        ThoiGianVao: matched?.ThoiGianVao || '2026-09-24T08:12:00',
        ThoiGianRa: new Date().toISOString(),
        SoPhutGui: 120,
        SoGioGui: 2,
        BangGiaApDung: 'BUỔI SÁNG / BUỔI CHIỀU (2.000 đ / lượt)',
        TienPhi: phiGui,
        PhuThuMatVe: phuThu,
        TongTien: tongTien
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // Xác nhận thanh toán & xuất bãi /parking/checkout
  if (url.includes('/parking/checkout') && method === 'post') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
    } catch {
      body = {};
    }
    const bienSo = (body.BienSo || '20B1-123.45').toUpperCase();
    const isMatVe = Boolean(body.MatVe);
    return {
      data: {
        MaPhieuThu: `REC-${Date.now().toString().slice(-6)}`,
        BienSo: bienSo,
        TenLoaiXe: 'Xe máy',
        ViTriDo: 'B-03',
        ThoiGianVao: '2026-09-24 08:12:00',
        ThoiGianRa: new Date().toISOString().replace('T', ' ').slice(0, 19),
        TongTien: isMatVe ? 15000 : 5000,
        PhuongThucThanhToan: body.PhuongThucThanhToan || 'TienMat',
        TrangThai: 'ThanhCong',
        NhanVienThuTien: 'Hoàng Văn Minh'
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // 5. Bảng giá, Vé tháng, Lịch sử
  if (url.includes('/pricing')) return { data: MOCK_PRICING, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/monthly-passes')) return { data: MOCK_MONTHLY_PASSES, status: 200, statusText: 'OK', headers: {}, config };
  if (url.includes('/history')) return { data: MOCK_HISTORY, status: 200, statusText: 'OK', headers: {}, config };

  // 6. AI Assistant Chatbot
  if (url.includes('/ai')) {
    return {
      data: {
        reply: 'Hệ thống AI nhận diện hiện tại: Tỷ lệ lấp đầy bãi đỗ đạt 65%. Dự báo khung giờ cao điểm tiếp theo vào 16:30 - 18:00 với lưu lượng xe ra lớn. Đề xuất bố trí 2 nhân viên tại cổng ra Khu A và Khu B để tránh ùn ứ.',
        recommendations: [
          'Điều hướng xe máy số còn trống sang dãy A-15 đến A-20.',
          'Mở thêm làn kiểm soát vé tự động tại cổng phụ.',
          'Ưu tiên xe điện vào trạm sạc Khu C.'
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // Mặc định trả về mảng rỗng hoặc thông báo thành công cho các thao tác POST/PUT/DELETE
  return {
    data: { message: 'Thao tác thành công (Chế độ Trực quan Hóa Demo)', success: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config
  };
};

// Interceptor xử lý lỗi: Nếu backend không online thì kích hoạt Mock Fallback mượt mà
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu gặp lỗi mạng (ERR_NETWORK, timeout, 404 trên GitHub Pages hoặc máy chủ chưa bật)
    if (!error.response || error.response.status === 404 || error.response.status === 502 || error.code === 'ERR_NETWORK') {
      console.warn('Backend API không phản hồi hoặc đang ở chế độ Static Pages, chuyển sang Demo Mode cho URL:', error.config?.url);
      return Promise.resolve(handleMockFallback(error.config));
    }

    if (error.response && error.response.status === 401) {
      if (window.location.hash !== '#/login' && window.location.hash !== '#/customer-portal') {
        localStorage.removeItem('parking_access_token');
        localStorage.removeItem('parking_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
