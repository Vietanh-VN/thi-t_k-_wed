from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, extract

from app.models.parking_spot import ViTriDo
from app.models.parking_session import LuotGuiXe
from app.models.zone import KhuVuc
from app.models.vehicle import PhuongTien
from app.models.vehicle_type import LoaiXe
from app.models.monthly_pass import VeThang
from app.schemas.stats import (
    DashboardOverviewResponse, HourlyTrafficItem,
    DailyTrafficItem, ZoneOccupancyItem, VehicleTypeStatItem
)

def get_dashboard_overview(db: Session) -> DashboardOverviewResponse:
    """Lấy số liệu thống kê tổng quan Dashboard thời gian thực."""
    # 1. Thống kê vị trí
    total_spots = db.query(func.count(ViTriDo.ViTriId)).scalar() or 0
    occupied_spots = db.query(func.count(ViTriDo.ViTriId)).filter(ViTriDo.TrangThai == "DangSuDung").scalar() or 0
    vacant_spots = db.query(func.count(ViTriDo.ViTriId)).filter(ViTriDo.TrangThai == "Trong").scalar() or 0
    maintenance_spots = db.query(func.count(ViTriDo.ViTriId)).filter(ViTriDo.TrangThai == "BaoTri").scalar() or 0
    
    occupancy_rate = round((occupied_spots / total_spots * 100), 1) if total_spots > 0 else 0.0

    # 2. Số xe đang gửi
    vehicles_parked = db.query(func.count(LuotGuiXe.LuotGuiId)).filter(LuotGuiXe.TrangThai == "DangGui").scalar() or 0

    # 3. Thống kê hôm nay
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())

    today_in = db.query(func.count(LuotGuiXe.LuotGuiId)).filter(
        LuotGuiXe.ThoiGianVao >= today_start,
        LuotGuiXe.ThoiGianVao <= today_end
    ).scalar() or 0

    today_out = db.query(func.count(LuotGuiXe.LuotGuiId)).filter(
        LuotGuiXe.ThoiGianRa >= today_start,
        LuotGuiXe.ThoiGianRa <= today_end,
        LuotGuiXe.TrangThai.in_(["HoanThanh", "DaThanhToan"])
    ).scalar() or 0

    today_revenue = db.query(func.sum(LuotGuiXe.PhiGuiXe)).filter(
        LuotGuiXe.ThoiGianRa >= today_start,
        LuotGuiXe.ThoiGianRa <= today_end,
        LuotGuiXe.TrangThai.in_(["HoanThanh", "DaThanhToan"])
    ).scalar() or 0.0

    # 4. Thống kê tháng này
    first_day_of_month = datetime.combine(date.today().replace(day=1), datetime.min.time())
    month_revenue = db.query(func.sum(LuotGuiXe.PhiGuiXe)).filter(
        LuotGuiXe.ThoiGianRa >= first_day_of_month,
        LuotGuiXe.TrangThai.in_(["HoanThanh", "DaThanhToan"])
    ).scalar() or 0.0

    # 5. Vé tháng đang hoạt động
    active_passes = db.query(func.count(VeThang.VeThangId)).filter(
        VeThang.TrangThai == "ConHan",
        VeThang.NgayHetHan >= date.today()
    ).scalar() or 0

    # 6. Xác định khung giờ cao điểm nhất hôm nay
    hourly_data = get_hourly_traffic(db, date.today())
    peak_hour_item = max(hourly_data, key=lambda x: x.SoXeTrongKhungGio, default=None)
    peak_hour_str = f"{peak_hour_item.KhungGio} ({peak_hour_item.SoXeTrongKhungGio} lượt)" if peak_hour_item and peak_hour_item.SoXeTrongKhungGio > 0 else "Chưa xác định"

    # 7. Khu vực đông nhất
    zone_stats = get_zone_occupancy_stats(db)
    busiest_zone = max(zone_stats, key=lambda z: z.TyLeLapDay, default=None)
    busiest_zone_str = f"{busiest_zone.TenKhuVuc} ({busiest_zone.TyLeLapDay}%)" if busiest_zone else "N/A"

    return DashboardOverviewResponse(
        TongSoViTri=total_spots,
        SoViTriDangSuDung=occupied_spots,
        SoViTriTrong=vacant_spots,
        SoViTriBaoTri=maintenance_spots,
        TyLeLapDay=occupancy_rate,
        SoXeDangGui=vehicles_parked,
        TongLuotXeVaoHomNay=today_in,
        TongLuotXeRaHomNay=today_out,
        DoanhThuHomNay=float(today_revenue),
        DoanhThuThangNay=float(month_revenue),
        TongVeThangHoatDong=active_passes,
        KhungGioCaoDiemNhat=peak_hour_str,
        KhuVucDongNhat=busiest_zone_str
    )

def get_hourly_traffic(db: Session, target_date: Optional[date] = None) -> List[HourlyTrafficItem]:
    """Lấy lưu lượng xe theo 24 khung giờ trong ngày."""
    if not target_date:
        target_date = date.today()

    start_dt = datetime.combine(target_date, datetime.min.time())
    end_dt = datetime.combine(target_date, datetime.max.time())

    # Lấy tất cả lượt gửi có xe vào hoặc xe ra trong ngày
    sessions = db.query(LuotGuiXe).filter(
        or_(
            and_(LuotGuiXe.ThoiGianVao >= start_dt, LuotGuiXe.ThoiGianVao <= end_dt),
            and_(LuotGuiXe.ThoiGianRa >= start_dt, LuotGuiXe.ThoiGianRa <= end_dt)
        )
    ).all()

    in_counts = {h: 0 for h in range(24)}
    out_counts = {h: 0 for h in range(24)}

    for s in sessions:
        if s.ThoiGianVao and start_dt <= s.ThoiGianVao <= end_dt:
            in_counts[s.ThoiGianVao.hour] += 1
        if s.ThoiGianRa and start_dt <= s.ThoiGianRa <= end_dt:
            out_counts[s.ThoiGianRa.hour] += 1

    total_counts = {h: in_counts[h] + out_counts[h] for h in range(24)}
    max_count = max(total_counts.values()) if total_counts else 0
    peak_threshold = max(3, max_count * 0.7) if max_count > 0 else 999

    result = []
    for h in range(24):
        khung_gio = f"{h:02d}:00 - {h+1:02d}:00"
        tot = total_counts[h]
        result.append(HourlyTrafficItem(
            Gio=h,
            KhungGio=khung_gio,
            SoXeTrongKhungGio=tot,
            SoXeVao=in_counts[h],
            SoXeRa=out_counts[h],
            LaGioCaoDiem=(tot >= peak_threshold and tot > 0)
        ))
    return result

def get_7_days_traffic(db: Session, end_date: Optional[date] = None) -> List[DailyTrafficItem]:
    """Lấy thống kê lưu lượng và doanh thu 7 ngày gần nhất."""
    if not end_date:
        end_date = date.today()

    start_date = end_date - timedelta(days=6)
    thu_map = {0: "Thứ 2", 1: "Thứ 3", 2: "Thứ 4", 3: "Thứ 5", 4: "Thứ 6", 5: "Thứ 7", 6: "Chủ nhật"}

    result = []
    curr = start_date
    while curr <= end_date:
        d_start = datetime.combine(curr, datetime.min.time())
        d_end = datetime.combine(curr, datetime.max.time())

        xe_vao = db.query(func.count(LuotGuiXe.LuotGuiId)).filter(
            LuotGuiXe.ThoiGianVao >= d_start,
            LuotGuiXe.ThoiGianVao <= d_end
        ).scalar() or 0

        xe_ra = db.query(func.count(LuotGuiXe.LuotGuiId)).filter(
            LuotGuiXe.ThoiGianRa >= d_start,
            LuotGuiXe.ThoiGianRa <= d_end
        ).scalar() or 0

        revenue = db.query(func.sum(LuotGuiXe.PhiGuiXe)).filter(
            LuotGuiXe.ThoiGianRa >= d_start,
            LuotGuiXe.ThoiGianRa <= d_end,
            LuotGuiXe.TrangThai.in_(["HoanThanh", "DaThanhToan"])
        ).scalar() or 0.0

        result.append(DailyTrafficItem(
            Ngay=curr.strftime("%Y-%m-%d"),
            Thu=thu_map[curr.weekday()],
            SoXeVao=xe_vao,
            SoXeRa=xe_ra,
            TongLuot=xe_vao + xe_ra,
            DoanhThu=float(revenue)
        ))
        curr += timedelta(days=1)
    return result

def get_zone_occupancy_stats(db: Session) -> List[ZoneOccupancyItem]:
    """Thống kê tỷ lệ lấp đầy theo từng khu vực."""
    zones = db.query(KhuVuc).all()
    res = []
    for z in zones:
        total = db.query(func.count(ViTriDo.ViTriId)).filter(ViTriDo.KhuVucId == z.KhuVucId).scalar() or 0
        occupied = db.query(func.count(ViTriDo.ViTriId)).filter(
            ViTriDo.KhuVucId == z.KhuVucId,
            ViTriDo.TrangThai == "DangSuDung"
        ).scalar() or 0
        vacant = db.query(func.count(ViTriDo.ViTriId)).filter(
            ViTriDo.KhuVucId == z.KhuVucId,
            ViTriDo.TrangThai == "Trong"
        ).scalar() or 0
        rate = round((occupied / total * 100), 1) if total > 0 else 0.0
        res.append(ZoneOccupancyItem(
            KhuVucId=z.KhuVucId,
            TenKhuVuc=z.TenKhuVuc,
            TongSoCho=total,
            SoChoDangDung=occupied,
            SoChoTrong=vacant,
            TyLeLapDay=rate
        ))
    return res

def get_vehicle_type_stats(db: Session) -> List[VehicleTypeStatItem]:
    """Thống kê cơ cấu phương tiện và doanh thu theo loại xe."""
    types = db.query(LoaiXe).all()
    total_all_sessions = db.query(func.count(LuotGuiXe.LuotGuiId)).scalar() or 1
    res = []
    for t in types:
        count = db.query(func.count(LuotGuiXe.LuotGuiId)).join(PhuongTien).filter(
            PhuongTien.LoaiXeId == t.LoaiXeId
        ).scalar() or 0
        revenue = db.query(func.sum(LuotGuiXe.PhiGuiXe)).join(PhuongTien).filter(
            PhuongTien.LoaiXeId == t.LoaiXeId,
            LuotGuiXe.TrangThai == "HoanThanh"
        ).scalar() or 0.0
        pct = round((count / total_all_sessions * 100), 1)
        res.append(VehicleTypeStatItem(
            LoaiXeId=t.LoaiXeId,
            TenLoaiXe=t.TenLoaiXe,
            SoLuotGui=count,
            DoanhThu=float(revenue),
            TyLe=pct
        ))
    return res
