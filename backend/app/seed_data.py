import random
import math
import sys
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from app.models.user import NguoiDung
from app.models.zone import KhuVuc
from app.models.vehicle_type import LoaiXe
from app.models.parking_spot import ViTriDo
from app.models.vehicle import PhuongTien
from app.models.pricing import BangGia
from app.models.monthly_pass import VeThang
from app.models.parking_session import LuotGuiXe
from app.utils.security import get_password_hash

def seed_database(db: Session):
    """Khởi tạo toàn bộ dữ liệu mẫu ban đầu cho hệ thống."""
    # 1. Kiểm tra nếu đã có tài khoản admin thì không seed lại
    if db.query(NguoiDung).filter(NguoiDung.Email == "admin@parking.vn").first():
        return

    print("[Seed Data] Đang khởi tạo dữ liệu mẫu cho hệ thống quản lý bãi đỗ xe...")

    # 1. Người dùng mẫu (Bao gồm đầy đủ 4 tác nhân: Quản lý, Nhân viên, Khách hàng, AI Engine)
    users = [
        NguoiDung(
            HoTen="Nông Việt Anh (Quản lý trưởng)",
            Email="admin@parking.vn",
            MatKhauHash=get_password_hash("admin123"),
            VaiTro="QuanLy",
            TrangThai=True
        ),
        NguoiDung(
            HoTen="Hoàng Văn Minh (Nhân viên vận hành)",
            Email="staff@parking.vn",
            MatKhauHash=get_password_hash("staff123"),
            VaiTro="NhanVien",
            TrangThai=True
        ),
        NguoiDung(
            HoTen="Giàng A Tùng (Khách hàng thường xuyên)",
            Email="khachhang@gmail.com",
            MatKhauHash=get_password_hash("customer123"),
            VaiTro="KhachHang",
            TrangThai=True
        ),
        NguoiDung(
            HoTen="AI Engine (Tác nhân Trí tuệ Nhân tạo)",
            Email="ai@parking.vn",
            MatKhauHash=get_password_hash("ai123"),
            VaiTro="AIEngine",
            TrangThai=True
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Loại phương tiện (Chỉ Xe máy và Xe điện)
    types = [
        LoaiXe(LoaiXeId=1, TenLoaiXe="Xe máy", MoTa="Xe máy số, xe tay ga và xe hai bánh"),
        LoaiXe(LoaiXeId=2, TenLoaiXe="Xe điện", MoTa="Xe máy điện, xe đạp điện có trạm sạc")
    ]
    db.add_all(types)
    db.commit()

    # 3. Khu vực đỗ xe (Chuyên biệt cho Xe máy và Xe điện)
    zones = [
        KhuVuc(KhuVucId=1, TenKhuVuc="Khu A - Xe máy (Tầng 1)", MoTa="Khu vực rộng rãi dành cho xe máy hai bánh gần cổng", TrangThai="HoatDong"),
        KhuVuc(KhuVucId=2, TenKhuVuc="Khu B - Xe máy (Tầng 2)", MoTa="Khu vực có mái che dành cho xe máy số và xe tay ga", TrangThai="HoatDong"),
        KhuVuc(KhuVucId=3, TenKhuVuc="Khu C - Xe điện & Trạm sạc", MoTa="Khu vực ưu tiên xe máy điện, xe đạp điện tích hợp trụ sạc nhanh", TrangThai="HoatDong")
    ]
    db.add_all(zones)
    db.commit()

    # 4. Bảng giá mẫu theo Use Case 2.5.4
    from datetime import time as dt_time
    pricings = [
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Gửi xe buổi sáng (06:00 - 12:00)",
            TuGio=dt_time(6, 0),
            DenGio=dt_time(12, 0),
            DonGia=2000.0,
            DonViTinh="Lượt",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Gửi xe buổi chiều (12:00 - 18:00)",
            TuGio=dt_time(12, 0),
            DenGio=dt_time(18, 0),
            DonGia=2000.0,
            DonViTinh="Lượt",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Gửi xe buổi tối (18:00 - 22:00)",
            TuGio=dt_time(18, 0),
            DenGio=dt_time(22, 0),
            DonGia=3000.0,
            DonViTinh="Lượt",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Xe gửi qua đêm (22:00 - 06:00)",
            TuGio=dt_time(22, 0),
            DenGio=dt_time(6, 0),
            DonGia=10000.0,
            DonViTinh="Lượt",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Phụ thu mất vé xe",
            TuGio=None,
            DenGio=None,
            DonGia=10000.0,
            DonViTinh="Lượt",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Xe gửi theo tháng (Gói ngày)",
            TuGio=None,
            DenGio=None,
            DonGia=80000.0,
            DonViTinh="Tháng",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=1,
            NoiDungDichVu="Xe gửi theo tháng qua đêm tại nhà xe",
            TuGio=None,
            DenGio=None,
            DonGia=100000.0,
            DonViTinh="Tháng",
            TrangThai=True
        ),
        BangGia(
            LoaiXeId=2,
            NoiDungDichVu="Xe đạp / Xe điện lượt",
            TuGio=None,
            DenGio=None,
            DonGia=2000.0,
            DonViTinh="Lượt",
            TrangThai=True
        )
    ]
    db.add_all(pricings)
    db.commit()

    # 5. Vị trí đỗ
    spots = []
    # Khu A: 12 chỗ xe máy
    for i in range(1, 13):
        spots.append(ViTriDo(KhuVucId=1, LoaiXeId=1, TenViTri=f"A-{i:02d}", TrangThai="Trong"))
    # Khu B: 12 chỗ xe máy
    for i in range(1, 13):
        spots.append(ViTriDo(KhuVucId=2, LoaiXeId=1, TenViTri=f"B-{i:02d}", TrangThai="Trong"))
    # Khu C: 8 chỗ xe điện
    for i in range(1, 9):
        spots.append(ViTriDo(KhuVucId=3, LoaiXeId=2, TenViTri=f"C-{i:02d}", TrangThai="Trong"))

    # Đặt 1 chỗ bảo trì
    spots[6].TrangThai = "BaoTri"  # A-07
    db.add_all(spots)
    db.commit()

    # 6. Phương tiện và Vé tháng mẫu
    sample_vehicles = [
        {"bien_so": "20B1-12345", "loai_id": 1, "name": "Hoàng Văn Minh", "phone": "0977112233", "pass": True, "expire_days": 90},
        {"bien_so": "20B2-99999", "loai_id": 1, "name": "Lê Tuấn Hưng", "phone": "0966554433", "pass": True, "expire_days": 45},
        {"bien_so": "29B1-77889", "loai_id": 1, "name": "Trần Thị Mai", "phone": "0987654321", "pass": True, "expire_days": 30},
        {"bien_so": "29MD-44556", "loai_id": 2, "name": "Vũ Hải Đăng", "phone": "0933221100", "pass": True, "expire_days": 60},
        {"bien_so": "29MD-12121", "loai_id": 2, "name": "Nguyễn Văn Nam", "phone": "0912345678", "pass": True, "expire_days": 30},
        {"bien_so": "20B1-66778", "loai_id": 1, "name": "Đặng Quốc Bảo", "phone": "0909123456", "pass": False, "expire_days": -10}, # Vé hết hạn
        {"bien_so": "20B2-11223", "loai_id": 1, "name": "Khách Vãng Lai 1", "phone": "", "pass": False, "expire_days": 0},
        {"bien_so": "29B1-88990", "loai_id": 1, "name": "Khách Vãng Lai 2", "phone": "", "pass": False, "expire_days": 0},
        {"bien_so": "20MD-33445", "loai_id": 2, "name": "Khách Vãng Lai 3", "phone": "", "pass": False, "expire_days": 0},
        {"bien_so": "29B2-55441", "loai_id": 1, "name": "Khách Vãng Lai 4", "phone": "", "pass": False, "expire_days": 0},
    ]

    saved_vehicles = []
    for sv in sample_vehicles:
        pt = PhuongTien(BienSo=sv["bien_so"], LoaiXeId=sv["loai_id"])
        db.add(pt)
        db.commit()
        db.refresh(pt)
        saved_vehicles.append(pt)

        if sv["pass"]:
            vt = VeThang(
                PhuongTienId=pt.PhuongTienId,
                TenKhachHang=sv["name"],
                SoDienThoai=sv["phone"],
                NgayBatDau=date.today() - timedelta(days=30),
                NgayHetHan=date.today() + timedelta(days=sv["expire_days"]),
                TrangThai="ConHan"
            )
            db.add(vt)
        elif sv["expire_days"] < 0:
            vt = VeThang(
                PhuongTienId=pt.PhuongTienId,
                TenKhachHang=sv["name"],
                SoDienThoai=sv["phone"],
                NgayBatDau=date.today() - timedelta(days=60),
                NgayHetHan=date.today() + timedelta(days=sv["expire_days"]),
                TrangThai="HetHan"
            )
            db.add(vt)
    db.commit()

    # 7. Khởi tạo một số xe ĐANG ĐỖ trong bãi (Trạng thái 'DangGui')
    db_spots = db.query(ViTriDo).filter(ViTriDo.TrangThai == "Trong").all()
    now = datetime.now()

    # Cho 5 xe vào đỗ ngay lúc này
    parked_specs = [
        {"v_idx": 0, "spot_idx": 0, "hours_ago": 2.5}, # 20B1-12345 đỗ A-01
        {"v_idx": 1, "spot_idx": 1, "hours_ago": 1.2}, # 20B2-99999 đỗ A-02
        {"v_idx": 2, "spot_idx": 11, "hours_ago": 4.0}, # 29B1-77889 đỗ B-01
        {"v_idx": 3, "spot_idx": 22, "hours_ago": 0.8}, # 29MD-44556 đỗ C-01
        {"v_idx": 4, "spot_idx": 23, "hours_ago": 1.5}, # 29MD-12121 đỗ C-02
    ]

    for p in parked_specs:
        if p["v_idx"] < len(saved_vehicles) and p["spot_idx"] < len(db_spots):
            veh = saved_vehicles[p["v_idx"]]
            spot = db_spots[p["spot_idx"]]
            spot.TrangThai = "DangSuDung"
            sess = LuotGuiXe(
                PhuongTienId=veh.PhuongTienId,
                ViTriId=spot.ViTriId,
                ThoiGianVao=now - timedelta(hours=p["hours_ago"]),
                TrangThai="DangGui",
                PhiGuiXe=0.0
            )
            db.add(sess)
    db.commit()

    # 8. Khởi tạo lịch sử 7 ngày qua với các khung giờ cao điểm chân thực (7h-9h sáng, 17h-19h chiều)
    random.seed(42)
    plates_pool = [
        ("20B1-66778", 1, 2000), ("20B2-11223", 1, 2000), ("29B1-88990", 1, 2000),
        ("20B1-99887", 1, 2000), ("20B2-44556", 1, 2000), ("29MD-44556", 2, 2000),
        ("29MD-12121", 2, 2000), ("20MD-33445", 2, 2000), ("29MD-66778", 2, 2000),
        ("29B1-77889", 1, 2000), ("29B2-33445", 1, 2000), ("20B1-55443", 1, 2000),
        ("20B2-88776", 1, 2000), ("29MD-88991", 2, 2000), ("20B1-12345", 1, 2000)
    ]

    # Tạo trước phương tiện phụ
    extra_vehicles = []
    for bp, l_id, fee in plates_pool:
        pt = db.query(PhuongTien).filter(PhuongTien.BienSo == bp).first()
        if not pt:
            pt = PhuongTien(BienSo=bp, LoaiXeId=l_id)
            db.add(pt)
            db.commit()
            db.refresh(pt)
        extra_vehicles.append((pt, fee))

    all_spots = db.query(ViTriDo).all()

    for day_offset in range(7, 0, -1):
        target_day = date.today() - timedelta(days=day_offset)

        # Mô phỏng số lượt xe trong ngày (15 - 25 lượt)
        num_sessions = random.randint(16, 24)
        for _ in range(num_sessions):
            veh_item = random.choice(extra_vehicles)
            veh = veh_item[0]
            fee_base = veh_item[1]
            spot = random.choice(all_spots)

            # Chọn giờ tập trung vào cao điểm sáng (7-9h), trưa (11-12h), chiều (17-19h)
            peak_roll = random.random()
            if peak_roll < 0.40:
                hour_in = random.randint(7, 8) # Sáng
            elif peak_roll < 0.75:
                hour_in = random.randint(17, 18) # Chiều tan tầm
            elif peak_roll < 0.90:
                hour_in = random.randint(11, 13) # Trưa
            else:
                hour_in = random.choice([6, 9, 10, 14, 15, 16, 20, 21])

            minute_in = random.randint(0, 59)
            time_in = datetime.combine(target_day, datetime.min.time()) + timedelta(hours=hour_in, minutes=minute_in)

            park_duration_hours = random.choice([1.0, 1.5, 2.0, 3.5, 4.0, 8.0])
            time_out = time_in + timedelta(hours=park_duration_hours)

            hist_session = LuotGuiXe(
                PhuongTienId=veh.PhuongTienId,
                ViTriId=spot.ViTriId,
                ThoiGianVao=time_in,
                ThoiGianRa=time_out,
                PhiGuiXe=float(fee_base),
                TrangThai="HoanThanh"
            )
            db.add(hist_session)

    # Thêm một vài lượt gửi ĐÃ HOÀN THÀNH trong sáng hôm nay
    today = date.today()
    for hour_in, duration, veh_idx in [(7, 2.0, 0), (8, 1.5, 1), (8, 0.8, 2), (9, 3.0, 3), (10, 1.2, 4), (12, 1.0, 5)]:
        veh_item = extra_vehicles[veh_idx % len(extra_vehicles)]
        veh = veh_item[0]
        spot = random.choice(all_spots)
        time_in = datetime.combine(today, datetime.min.time()) + timedelta(hours=hour_in, minutes=random.randint(5, 45))
        time_out = time_in + timedelta(hours=duration)

        db.add(LuotGuiXe(
            PhuongTienId=veh.PhuongTienId,
            ViTriId=spot.ViTriId,
            ThoiGianVao=time_in,
            ThoiGianRa=time_out,
            PhiGuiXe=2000.0,
            TrangThai="HoanThanh"
        ))

    db.commit()
    print("[Seed Data] Khởi tạo dữ liệu mẫu thành công!")
