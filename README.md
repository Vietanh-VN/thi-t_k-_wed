# 🚗 HỆ THỐNG QUẢN LÝ BÃI ĐỖ XE CÓ TÍCH HỢP AI

**Nhóm 02 – Học phần Ứng dụng Trí tuệ Nhân tạo**  
**Trường Đại học CNTT & Truyền thông Thái Nguyên**

> Sinh viên thực hiện: Nông Việt Anh · Hoàng Văn Minh · Giàng A Tùng  
> Giảng viên hướng dẫn: Ngô Hữu Huy

---

## 📋 Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🔐 Đăng nhập phân quyền | Hỗ trợ 3 vai trò: Quản lý, Nhân viên, Khách hàng |
| 🚗 Ghi nhận xe vào | Nhập biển số, tự động kiểm tra vé tháng, tự động phân vị trí đỗ |
| 🏁 Ghi nhận xe ra | Tìm xe, tính phí tự động, xuất phiếu thu PDF |
| 🗺️ Bản đồ bãi đỗ | Sơ đồ thời gian thực theo khu vực, màu sắc trạng thái |
| 📊 Dashboard & Thống kê | Biểu đồ doanh thu 7 ngày, lưu lượng 24h, tỷ lệ lấp đầy |
| 🎫 Vé tháng phương tiện | Đăng ký, gia hạn, hủy vé, kiểm tra trạng thái |
| 🏗️ Quản lý phân khu / vị trí | CRUD phân khu và danh sách vị trí đỗ |
| 💰 Bảng giá dịch vụ | Cấu hình giá theo loại xe và đơn vị tính |
| 📜 Tra cứu lịch sử | Tìm kiếm theo biển số, thời gian, xuất CSV |
| 🤖 Trung tâm AI | Báo cáo ngày/tuần, giờ cao điểm, tư vấn nhân sự, chatbot Q&A |
| 🪟 Cổng Khách hàng | Tra cứu xe, chỗ trống, bảng giá, hỏi AI |

---

## ⚙️ Yêu cầu hệ thống

| Phần mềm | Phiên bản | Ghi chú |
|---|---|---|
| Python | 3.11+ | Cài tại `%LOCALAPPDATA%\Programs\Python\Python311` |
| Node.js | 20+ | Cài tại `%LOCALAPPDATA%\Programs\nodejs` |
| npm | 10+ | Đi kèm với Node.js |

---

## 🚀 Hướng dẫn Cài đặt và Khởi động

### Cách 1: Chạy 1 cú nhấp chuột (Khuyến nghị)

```
Double-click vào file: run_all.bat
```

Script sẽ tự động:
1. Kiểm tra Python và Node.js
2. Cài các thư viện backend (`pip install`)
3. Mở cửa sổ BACKEND FastAPI tại **http://localhost:8000**
4. Mở cửa sổ FRONTEND Vite React tại **http://localhost:3000**
5. Tự động mở trình duyệt

---

### Cách 2: Khởi động thủ công (hoặc qua Terminal của VS Code)

**Bước 1 – Backend (Terminal 1):**
```bash
cd "c:\dự án demo\backend"
python -m pip install -r requirements.txt
python run_backend.py
```

**Bước 2 – Frontend (Terminal 2):**
```bash
cd "c:\dự án demo\frontend"
npm install
npm run dev
```

**Bước 3 – Mở trình duyệt:** [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài khoản đăng nhập mặc định

| Vai trò | Tên đăng nhập | Mật khẩu | Phân quyền |
|---|---|---|---|
| **Quản lý** (Admin) | `admin` | `admin123` | Toàn bộ chức năng |
| **Nhân viên** (Staff) | `staff` | `staff123` | Ghi nhận xe vào/ra, vé tháng, lịch sử |
| **Khách hàng** | `customer` | `customer123` | Xem dashboard, cổng tra cứu |

> Dữ liệu mẫu được tự động seed khi khởi động lần đầu: 4 khu vực, 30+ vị trí đỗ, lịch sử 7 ngày.

---

## 🗂️ Cấu trúc dự án

```
c:/dự án demo/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM Models (8 bảng)
│   │   ├── schemas/         # Pydantic v2 Schemas
│   │   ├── routers/         # FastAPI Routers (11 routers)
│   │   ├── services/        # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── parking_service.py
│   │   │   ├── stats_service.py
│   │   │   └── ai_service.py      ← Gemini AI + Offline Engine
│   │   ├── seed_data.py     # Seeder dữ liệu mẫu
│   │   └── main.py          # FastAPI app + CORS
│   ├── tests/
│   │   └── test_parking_system.py  ← 13 test cases (100% pass)
│   ├── requirements.txt
│   └── run_backend.py
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, Sidebar, Navbar
│   │   ├── context/         # AuthContext (RBAC)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CheckIn.jsx
│   │   │   ├── CheckOut.jsx
│   │   │   ├── ParkingMap.jsx
│   │   │   ├── MonthlyPasses.jsx
│   │   │   ├── ZonesSpots.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── History.jsx
│   │   │   ├── AiAssistant.jsx    ← AI Hub đầy đủ
│   │   │   └── CustomerPortal.jsx
│   │   ├── services/
│   │   │   └── api.js       # Axios + JWT interceptors
│   │   ├── App.jsx          # React Router + ProtectedRoute
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js       # Proxy /api → localhost:8000
│
├── run_all.bat              ← 1-click Windows launcher
└── README.md
```

---

## 🤖 Tích hợp AI – Gemini & Offline Engine

Hệ thống AI được thiết kế theo **kiến trúc kép** (dual-mode):

1. **Chế độ Online (Google Gemini)**: Khi cung cấp `GEMINI_API_KEY` trong `backend/app/config.py`, mô hình sẽ gọi API Google Generative AI để tạo báo cáo ngôn ngữ tự nhiên chi tiết.

2. **Chế độ Offline (Built-in Heuristic Engine)**: Khi không có API Key, hệ thống tự động chuyển sang engine tích hợp sẵn để:
   - Sinh báo cáo dựa trên công thức thống kê thực tế
   - Xếp hạng giờ cao điểm theo dữ liệu DB
   - Gợi ý bố trí nhân sự theo ca
   - Trả lời câu hỏi quản trị bằng template NLP thông minh

```
# Để bật Gemini AI (tùy chọn), sửa file backend/app/config.py:
GEMINI_API_KEY = "AIzaSy..."  # Thay bằng API Key của bạn
```

---

## 🧪 Chạy Bộ Kiểm thử Tự động

```bash
cd "c:\dự án demo\backend"
python -m pytest tests/test_parking_system.py -v
```

**Kết quả**: 13/13 test cases PASSED ✅

| Test Case | Mô tả |
|---|---|
| TC01 | Đăng nhập thành công với admin |
| TC02 | Đăng nhập sai mật khẩu |
| TC03 | Lấy danh sách khu vực |
| TC04 | Lấy danh sách loại xe |
| TC05 | Ghi nhận xe vào (check-in) |
| TC06 | Tính phí theo giờ |
| TC07 | Ghi nhận xe ra (check-out) |
| TC08 | Kiểm tra vé tháng còn hạn (miễn phí) |
| TC09 | Ghi nhận xe ra với vé tháng (phí = 0) |
| TC10 | Lấy thống kê dashboard |
| TC11 | Tra cứu lịch sử gửi xe |
| TC12 | Truy vấn AI Assistant |
| TC13 | Tra cứu bản đồ bãi đỗ |

---

## 📡 API Endpoints

Truy cập **Swagger UI** tại: [http://localhost:8000/docs](http://localhost:8000/docs)

| Nhóm | Base URL | Mô tả |
|---|---|---|
| Auth | `/api/auth/` | Đăng nhập, thông tin người dùng |
| Zones | `/api/zones/` | Quản lý khu vực |
| Spots | `/api/spots/` | Quản lý vị trí đỗ |
| Vehicle Types | `/api/vehicle-types/` | Loại phương tiện |
| Vehicles | `/api/vehicles/` | Phương tiện |
| Parking | `/api/parking/` | Check-in / Check-out |
| Monthly Passes | `/api/monthly-passes/` | Vé tháng |
| Pricing | `/api/pricing/` | Bảng giá |
| History | `/api/history/` | Lịch sử gửi xe |
| Stats | `/api/stats/` | Thống kê dashboard |
| AI Assistant | `/api/ai/` | Chat, báo cáo, giờ cao điểm |

---

## 🛠️ Công nghệ sử dụng

**Backend:**
- FastAPI 0.115 + Uvicorn
- SQLAlchemy 2.0 + SQLite
- Pydantic v2 + Bcrypt + PyJWT
- Google Generative AI SDK (Gemini)
- Pytest (13 test cases)

**Frontend:**
- React 18 + Vite 5
- Tailwind CSS 3 + Lucide React Icons
- Recharts (biểu đồ doanh thu / lưu lượng)
- Axios + React Router 6

---

## 📝 Ghi chú phát triển

- Cơ sở dữ liệu SQLite tự tạo tại `backend/parking.db` khi khởi động lần đầu
- Dữ liệu seed thực tế bao gồm lịch sử 7 ngày để dashboard có số liệu trực quan
- Hệ thống sẽ không bị lỗi khi không có Gemini API Key (offline fallback engine)
- Frontend proxy `/api` → `http://localhost:8000` qua Vite dev server

---

*© 2026 – Nhóm 02 – Trường ĐHCNTT & Truyền thông Thái Nguyên*
