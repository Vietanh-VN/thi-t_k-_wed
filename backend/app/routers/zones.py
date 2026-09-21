from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.zone import KhuVuc
from app.models.parking_spot import ViTriDo
from app.schemas.zone import ZoneCreate, ZoneUpdate, ZoneResponse, ZoneWithStatsResponse
from app.services.auth_service import require_manager, require_staff_or_manager

router = APIRouter(prefix="/zones", tags=["Quản lý Khu vực"])

@router.get("", response_model=List[ZoneWithStatsResponse])
def get_zones(db: Session = Depends(get_db)):
    """Lấy danh sách khu vực kèm số liệu thống kê chỗ trống."""
    zones = db.query(KhuVuc).all()
    results = []
    for z in zones:
        total = db.query(func.count(ViTriDo.ViTriId)).filter(ViTriDo.KhuVucId == z.KhuVucId).scalar() or 0
        used = db.query(func.count(ViTriDo.ViTriId)).filter(
            ViTriDo.KhuVucId == z.KhuVucId, ViTriDo.TrangThai == "DangSuDung"
        ).scalar() or 0
        vacant = db.query(func.count(ViTriDo.ViTriId)).filter(
            ViTriDo.KhuVucId == z.KhuVucId, ViTriDo.TrangThai == "Trong"
        ).scalar() or 0
        maintenance = db.query(func.count(ViTriDo.ViTriId)).filter(
            ViTriDo.KhuVucId == z.KhuVucId, ViTriDo.TrangThai == "BaoTri"
        ).scalar() or 0
        rate = round((used / total * 100), 1) if total > 0 else 0.0

        results.append(ZoneWithStatsResponse(
            KhuVucId=z.KhuVucId,
            TenKhuVuc=z.TenKhuVuc,
            MoTa=z.MoTa,
            TrangThai=z.TrangThai,
            TongSoCho=total,
            SoChoDangDung=used,
            SoChoTrong=vacant,
            SoChoBaoTri=maintenance,
            TyLeLapDay=rate
        ))
    return results

@router.post("", response_model=ZoneResponse, status_code=status.HTTP_201_CREATED)
def create_zone(zone_in: ZoneCreate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Tạo khu vực mới (Chỉ Quản lý)."""
    zone = KhuVuc(**zone_in.dict())
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone

@router.get("/{zone_id}", response_model=ZoneResponse)
def get_zone(zone_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết khu vực."""
    zone = db.query(KhuVuc).filter(KhuVuc.KhuVucId == zone_id).first()
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khu vực không tồn tại.")
    return zone

@router.put("/{zone_id}", response_model=ZoneResponse)
def update_zone(zone_id: int, zone_in: ZoneUpdate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Cập nhật khu vực (Chỉ Quản lý)."""
    zone = db.query(KhuVuc).filter(KhuVuc.KhuVucId == zone_id).first()
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khu vực không tồn tại.")
    for field, value in zone_in.dict(exclude_unset=True).items():
        setattr(zone, field, value)
    db.commit()
    db.refresh(zone)
    return zone

@router.delete("/{zone_id}", status_code=status.HTTP_200_OK)
def delete_zone(zone_id: int, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Xóa khu vực (Chỉ Quản lý)."""
    zone = db.query(KhuVuc).filter(KhuVuc.KhuVucId == zone_id).first()
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Khu vực không tồn tại.")
    db.delete(zone)
    db.commit()
    return {"message": f"Đã xóa khu vực '{zone.TenKhuVuc}' thành công."}
