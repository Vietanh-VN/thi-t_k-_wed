from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parking_session import LuotGuiXe
from app.models.vehicle import PhuongTien
from app.schemas.parking_session import ParkingSessionResponse

router = APIRouter(prefix="/history", tags=["Tra cứu Lịch sử gửi xe"])

@router.get("", response_model=List[ParkingSessionResponse])
def get_parking_history(
    license_plate: Optional[str] = Query(None, description="Tìm theo biển số xe"),
    start_date: Optional[str] = Query(None, description="Từ ngày (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Đến ngày (YYYY-MM-DD)"),
    status_filter: Optional[str] = Query(None, description="Lọc trạng thái (DangGui, HoanThanh)"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Tra cứu lịch sử gửi xe (Use case 2.5.7)."""
    query = db.query(LuotGuiXe).join(PhuongTien)

    if license_plate:
        plate_clean = license_plate.strip().upper()
        query = query.filter(PhuongTien.BienSo.like(f"%{plate_clean}%"))

    if start_date:
        try:
            st_dt = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(LuotGuiXe.ThoiGianVao >= st_dt)
        except ValueError:
            pass

    if end_date:
        try:
            end_dt = datetime.strptime(f"{end_date} 23:59:59", "%Y-%m-%d %H:%M:%S")
            query = query.filter(LuotGuiXe.ThoiGianVao <= end_dt)
        except ValueError:
            pass

    if status_filter:
        query = query.filter(LuotGuiXe.TrangThai == status_filter)

    sessions = query.order_by(LuotGuiXe.ThoiGianVao.desc()).offset(offset).limit(limit).all()

    results = []
    for s in sessions:
        results.append(ParkingSessionResponse(
            LuotGuiId=s.LuotGuiId,
            PhuongTienId=s.PhuongTienId,
            BienSo=s.phuong_tien.BienSo if s.phuong_tien else "N/A",
            LoaiXeId=s.phuong_tien.LoaiXeId if s.phuong_tien else 1,
            TenLoaiXe=s.phuong_tien.loai_xe.TenLoaiXe if s.phuong_tien and s.phuong_tien.loai_xe else "N/A",
            ViTriId=s.ViTriId,
            TenViTri=s.vi_tri.TenViTri if s.vi_tri else "N/A",
            TenKhuVuc=s.vi_tri.khu_vuc.TenKhuVuc if s.vi_tri and s.vi_tri.khu_vuc else "N/A",
            ThoiGianVao=s.ThoiGianVao,
            ThoiGianRa=s.ThoiGianRa,
            PhiGuiXe=s.PhiGuiXe,
            TrangThai=s.TrangThai
        ))
    return results
