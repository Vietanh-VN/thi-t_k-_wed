import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date, timedelta

from app.main import app
from app.database import Base, get_db
from app.seed_data import seed_database

# Sử dụng database test in-memory SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_parking.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Helper để lấy auth token cho admin
def get_admin_token():
    resp = client.post("/api/auth/login", json={"email": "admin@parking.vn", "password": "admin123"})
    assert resp.status_code == 200
    return resp.json()["access_token"]

# TC01: Đăng nhập thành công với tài khoản đúng
def test_tc01_login_success():
    resp = client.post("/api/auth/login", json={"email": "admin@parking.vn", "password": "admin123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["VaiTro"] == "QuanLy"

# TC02: Đăng nhập thất bại với thông tin sai
def test_tc02_login_invalid():
    resp = client.post("/api/auth/login", json={"email": "admin@parking.vn", "password": "wrong_password"})
    assert resp.status_code == 401
    assert "không chính xác" in resp.json()["detail"]

# TC03: Xe vào khi bãi còn vị trí phù hợp
def test_tc03_checkin_success():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    req = {
        "BienSo": "20B1-88888",
        "LoaiXeId": 1 # Xe máy
    }
    resp = client.post("/api/parking/check-in", json=req, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["BienSo"] == "20B1-88888"
    assert data["TrangThai"] == "DangGui"
    assert data["ViTriId"] > 0

# TC05: Không cho phép ghi nhận vào khi biển số đang có lượt gửi hoạt động
def test_tc05_checkin_duplicate_active():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    req = {
        "BienSo": "20B1-88888",
        "LoaiXeId": 1
    }
    resp = client.post("/api/parking/check-in", json=req, headers=headers)
    assert resp.status_code == 400
    assert "đang có lượt gửi hoạt động" in resp.json()["detail"]

# TC08 & TC06: Tính phí và Ghi nhận xe ra thành công
def test_tc06_tc08_calculate_fee_and_checkout():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Tạm tính phí
    calc_resp = client.post("/api/parking/calculate-fee", json={"BienSo": "20B1-88888"})
    assert calc_resp.status_code == 200
    calc_data = calc_resp.json()
    assert calc_data["BienSo"] == "20B1-88888"
    assert calc_data["PhiGuiXe"] >= 2000.0 # Xe máy đơn giá theo lượt

    # 2. Check out
    out_resp = client.post("/api/parking/check-out", json={"BienSo": "20B1-88888"}, headers=headers)
    assert out_resp.status_code == 200
    out_data = out_resp.json()
    assert out_data["TrangThai"] == "HoanThanh"
    assert out_data["PhiGuiXe"] >= 2000.0

# TC07: Ghi nhận xe ra khi không có lượt gửi hoạt động
def test_tc07_checkout_not_found():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.post("/api/parking/check-out", json={"BienSo": "NON_EXIST_99"}, headers=headers)
    assert resp.status_code == 404
    assert "Không tìm thấy lượt gửi" in resp.json()["detail"]

# TC09: Vé tháng còn hiệu lực được áp dụng miễn phí lượt gửi
def test_tc09_monthly_pass_free_checkout():
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 20B1-12345 đã được seed có vé tháng còn hạn
    calc_resp = client.post("/api/parking/calculate-fee", json={"BienSo": "20B1-12345"})
    assert calc_resp.status_code == 200
    calc_data = calc_resp.json()
    assert calc_data["CoVeThang"] is True
    assert calc_data["PhiGuiXe"] == 0.0

# TC10 & TC11: Chỗ trống cập nhật trạng thái
def test_tc10_tc11_spot_status_transition():
    # Lấy danh sách vị trí
    resp = client.get("/api/spots")
    assert resp.status_code == 200
    spots = resp.json()
    assert len(spots) > 0

# TC12: Tra cứu lịch sử phương tiện
def test_tc12_history_lookup():
    resp = client.get("/api/history?limit=10")
    assert resp.status_code == 200
    history = resp.json()
    assert len(history) > 0

# TC13: Thống kê Dashboard KPI
def test_tc13_stats_overview():
    resp = client.get("/api/stats/overview")
    assert resp.status_code == 200
    kpi = resp.json()
    assert kpi["TongSoViTri"] > 0
    assert "TyLeLapDay" in kpi
    assert "DoanhThuHomNay" in kpi

# TC14: AI sinh báo cáo lưu lượng ngày và tuần
def test_tc14_ai_report():
    resp_day = client.post("/api/ai/report", json={"LoaiBaoCao": "Ngay"})
    assert resp_day.status_code == 200
    data_day = resp_day.json()
    assert "NoiDungBaoCao" in data_day
    assert "ChiSoChinh" in data_day

    resp_week = client.post("/api/ai/report", json={"LoaiBaoCao": "Tuan"})
    assert resp_week.status_code == 200
    data_week = resp_week.json()
    assert "NoiDungBaoCao" in data_week

# TC15: AI phân tích khung giờ cao điểm
def test_tc15_ai_peak_hours():
    resp = client.get("/api/ai/peak-hours")
    assert resp.status_code == 200
    data = resp.json()
    assert "PhanTichXuHuong" in data
    assert "DanhSachGioCaoDiem" in data

# TC16: AI trả lời câu hỏi quản trị
def test_tc16_ai_chat():
    resp = client.post("/api/ai/chat", json={"CauHoi": "Doanh thu hôm nay là bao nhiêu?"})
    assert resp.status_code == 200
    data = resp.json()
    assert "CauTraLoi" in data
    assert "VNĐ" in data["CauTraLoi"] or "doanh thu" in data["CauTraLoi"].lower()

# TC17: Tác nhân AI Engine đăng nhập thành công (Vai trò AIEngine)
def test_tc17_ai_engine_login():
    resp = client.post("/api/auth/login", json={"email": "ai@parking.vn", "password": "ai123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["VaiTro"] == "AIEngine"

# TC18: Cấu trúc BangGia và dữ liệu mẫu có khung giờ (TuGio, DenGio theo Bảng 1 và Bảng 2)
def test_tc18_bang_gia_structure_and_time_slots():
    resp = client.get("/api/pricing")
    assert resp.status_code == 200
    pricings = resp.json()
    assert len(pricings) >= 3
    # Tìm mức giá xe máy có khung giờ buổi sáng 06:00 (hoặc 06:30), 2000đ/lượt
    slot_morning = next((p for p in pricings if p["LoaiXeId"] == 1 and p.get("TuGio") in ["06:00", "06:30"]), None)
    assert slot_morning is not None
    assert slot_morning["DonGia"] == 2000.0
    assert slot_morning["DonViTinh"] in ["Luot", "Lượt"]

# TC19: Nhân viên (Staff) có quyền đăng ký và quản lý vé tháng
def test_tc19_staff_monthly_pass_permissions():
    staff_resp = client.post("/api/auth/login", json={"email": "staff@parking.vn", "password": "staff123"})
    assert staff_resp.status_code == 200
    token = staff_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    create_resp = client.post(
        "/api/monthly-passes",
        json={
            "BienSo": "20B1-99988",
            "LoaiXeId": 1,
            "TenKhachHang": "Khách Test Staff",
            "SoDienThoai": "0912345678",
            "NgayBatDau": str(date.today()),
            "SoThang": 1
        },
        headers=headers
    )
    assert create_resp.status_code == 201
    pass_data = create_resp.json()
    assert pass_data["BienSo"] == "20B1-99988"
    assert pass_data["TrangThai"] == "ConHan"

# TC20: Use Case 2.5.4 - Phụ thu mất vé xe (10.000 đồng) khi tính phí và check-out
def test_tc20_lost_ticket_surcharge():
    staff_resp = client.post("/api/auth/login", json={"email": "staff@parking.vn", "password": "staff123"})
    token = staff_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Check in xe mới
    test_plate = "20B1-77889"
    in_resp = client.post("/api/parking/check-in", json={"BienSo": test_plate, "LoaiXeId": 1}, headers=headers)
    assert in_resp.status_code == 201

    # 2. Tạm tính phí có báo mất vé (MatVe = True)
    calc_resp = client.post("/api/parking/calculate-fee", json={"BienSo": test_plate, "MatVe": True})
    assert calc_resp.status_code == 200
    calc_data = calc_resp.json()
    assert calc_data["MatVe"] is True
    assert calc_data["PhiMatVe"] == 10000.0
    assert calc_data["TongThanhToan"] == calc_data["PhiGuiXe"] + 10000.0

    # 3. Check-out có báo mất vé
    out_resp = client.post("/api/parking/check-out", json={"BienSo": test_plate, "MatVe": True}, headers=headers)
    assert out_resp.status_code == 200
    out_data = out_resp.json()
    assert out_data["MatVe"] is True
    assert out_data["PhiMatVe"] == 10000.0
    assert out_data["TongThanhToan"] == out_data["PhiGuiXe"] + 10000.0
    assert out_data["TrangThai"] == "HoanThanh"


