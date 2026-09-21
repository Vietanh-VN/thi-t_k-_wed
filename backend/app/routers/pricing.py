from typing import List, Optional
from datetime import datetime, time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pricing import BangGia
from app.schemas.pricing import PricingCreate, PricingUpdate, PricingResponse
from app.services.auth_service import require_manager

router = APIRouter(prefix="/pricing", tags=["Quản lý Bảng giá"])

def parse_time_val(val: Optional[object]) -> Optional[time]:
    if not val:
        return None
    if isinstance(val, time):
        return val
    if isinstance(val, str):
        val = val.strip()
        if not val:
            return None
        for fmt in ("%H:%M", "%H:%M:%S"):
            try:
                return datetime.strptime(val, fmt).time()
            except ValueError:
                pass
    return None

@router.get("", response_model=List[PricingResponse])
def get_pricings(db: Session = Depends(get_db)):
    """Lấy danh sách bảng giá gửi xe (UC-04, Quản lý bảng giá)."""
    pricings = db.query(BangGia).all()
    results = []
    for p in pricings:
        results.append(PricingResponse(
            BangGiaId=p.BangGiaId,
            LoaiXeId=p.LoaiXeId,
            NoiDungDichVu=p.NoiDungDichVu,
            TuGio=p.TuGio,
            DenGio=p.DenGio,
            DonGia=p.DonGia,
            DonViTinh=p.DonViTinh,
            TrangThai=p.TrangThai,
            TenLoaiXe=p.loai_xe.TenLoaiXe if p.loai_xe else None
        ))
    return results

@router.post("", response_model=PricingResponse, status_code=status.HTTP_201_CREATED)
def create_pricing(p_in: PricingCreate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Thêm mức giá mới (Chỉ Quản lý)."""
    data = p_in.dict()
    data["TuGio"] = parse_time_val(data.get("TuGio"))
    data["DenGio"] = parse_time_val(data.get("DenGio"))
    item = BangGia(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return PricingResponse(
        BangGiaId=item.BangGiaId,
        LoaiXeId=item.LoaiXeId,
        NoiDungDichVu=item.NoiDungDichVu,
        TuGio=item.TuGio,
        DenGio=item.DenGio,
        DonGia=item.DonGia,
        DonViTinh=item.DonViTinh,
        TrangThai=item.TrangThai,
        TenLoaiXe=item.loai_xe.TenLoaiXe if item.loai_xe else None
    )

@router.put("/{pricing_id}", response_model=PricingResponse)
def update_pricing(pricing_id: int, p_in: PricingUpdate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Cập nhật mức giá (Chỉ Quản lý)."""
    item = db.query(BangGia).filter(BangGia.BangGiaId == pricing_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bảng giá.")
    
    update_data = p_in.dict(exclude_unset=True)
    if "TuGio" in update_data:
        update_data["TuGio"] = parse_time_val(update_data["TuGio"])
    if "DenGio" in update_data:
        update_data["DenGio"] = parse_time_val(update_data["DenGio"])

    for field, value in update_data.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return PricingResponse(
        BangGiaId=item.BangGiaId,
        LoaiXeId=item.LoaiXeId,
        NoiDungDichVu=item.NoiDungDichVu,
        TuGio=item.TuGio,
        DenGio=item.DenGio,
        DonGia=item.DonGia,
        DonViTinh=item.DonViTinh,
        TrangThai=item.TrangThai,
        TenLoaiXe=item.loai_xe.TenLoaiXe if item.loai_xe else None
    )

@router.delete("/{pricing_id}", status_code=status.HTTP_200_OK)
def delete_pricing(pricing_id: int, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Xóa cấu hình giá (Chỉ Quản lý)."""
    item = db.query(BangGia).filter(BangGia.BangGiaId == pricing_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy bảng giá.")
    db.delete(item)
    db.commit()
    return {"message": "Đã xóa cấu hình bảng giá thành công."}

