from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vehicle import PhuongTien
from app.models.parking_session import LuotGuiXe
from app.models.parking_spot import ViTriDo
from app.models.monthly_pass import VeThang
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse, VehicleLookupResponse
from app.services.auth_service import require_staff_or_manager

router = APIRouter(prefix="/vehicles", tags=["Quản lý Phương tiện"])

@router.get("", response_model=List[VehicleResponse])
def get_vehicles(db: Session = Depends(get_db)):
    """Lấy danh sách phương tiện."""
    vehicles = db.query(PhuongTien).all()
    results = []
    for v in vehicles:
        results.append(VehicleResponse(
            PhuongTienId=v.PhuongTienId,
            LoaiXeId=v.LoaiXeId,
            BienSo=v.BienSo,
            TenLoaiXe=v.loai_xe.TenLoaiXe if v.loai_xe else None
        ))
    return results

@router.get("/lookup/{license_plate}", response_model=VehicleLookupResponse)
def lookup_vehicle(license_plate: str, db: Session = Depends(get_db)):
    """Tra cứu toàn diện phương tiện theo biển số: thông tin xe, trạng thái đỗ hiện tại, vé tháng."""
    import re
    plate_clean = license_plate.strip().upper()
    phuong_tien = db.query(PhuongTien).filter(PhuongTien.BienSo == plate_clean).first()
    if not phuong_tien:
        raw_alphanumeric = re.sub(r'[^A-Z0-9]', '', plate_clean)
        for v in db.query(PhuongTien).all():
            if re.sub(r'[^A-Z0-9]', '', v.BienSo.upper()) == raw_alphanumeric:
                phuong_tien = v
                break

    today = date.today()
    has_monthly = False
    monthly_id = None
    expiry_str = None
    pass_status = None

    is_parked = False
    spot_id = None
    spot_name = None
    in_time_str = None
    session_id = None

    if phuong_tien:
        # Kiểm tra vé tháng
        ve_thang = db.query(VeThang).filter(
            VeThang.PhuongTienId == phuong_tien.PhuongTienId,
            VeThang.TrangThai == "ConHan",
            VeThang.NgayBatDau <= today,
            VeThang.NgayHetHan >= today
        ).order_by(VeThang.NgayHetHan.desc()).first()

        if ve_thang:
            has_monthly = True
            monthly_id = ve_thang.VeThangId
            expiry_str = ve_thang.NgayHetHan.strftime("%d/%m/%Y")
            pass_status = "Còn hạn"

        # Kiểm tra lượt gửi đang hoạt động
        active_session = db.query(LuotGuiXe).filter(
            LuotGuiXe.PhuongTienId == phuong_tien.PhuongTienId,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()

        if active_session:
            is_parked = True
            session_id = active_session.LuotGuiId
            in_time_str = active_session.ThoiGianVao.strftime("%d/%m/%Y %H:%M")
            vi_tri = db.query(ViTriDo).filter(ViTriDo.ViTriId == active_session.ViTriId).first()
            if vi_tri:
                spot_id = vi_tri.ViTriId
                spot_name = vi_tri.TenViTri

        return VehicleLookupResponse(
            PhuongTienId=phuong_tien.PhuongTienId,
            BienSo=phuong_tien.BienSo,
            LoaiXeId=phuong_tien.LoaiXeId,
            TenLoaiXe=phuong_tien.loai_xe.TenLoaiXe if phuong_tien.loai_xe else None,
            CoVeThang=has_monthly,
            VeThangId=monthly_id,
            NgayHetHanVeThang=expiry_str,
            TrangThaiVeThang=pass_status,
            DangGuiTrongBai=is_parked,
            ViTriId=spot_id,
            TenViTri=spot_name,
            ThoiGianVao=in_time_str,
            LuotGuiId=session_id
        )

    return VehicleLookupResponse(
        BienSo=plate_clean,
        CoVeThang=False,
        DangGuiTrongBai=False
    )
