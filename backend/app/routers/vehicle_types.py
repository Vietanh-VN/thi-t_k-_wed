from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vehicle_type import LoaiXe
from app.schemas.vehicle_type import VehicleTypeCreate, VehicleTypeUpdate, VehicleTypeResponse
from app.services.auth_service import require_manager

router = APIRouter(prefix="/vehicle-types", tags=["Quản lý Loại phương tiện"])

@router.get("", response_model=List[VehicleTypeResponse])
def get_vehicle_types(db: Session = Depends(get_db)):
    """Lấy danh mục loại xe."""
    return db.query(LoaiXe).all()

@router.post("", response_model=VehicleTypeResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle_type(item_in: VehicleTypeCreate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Tạo loại xe mới (Chỉ Quản lý)."""
    item = LoaiXe(**item_in.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{type_id}", response_model=VehicleTypeResponse)
def update_vehicle_type(type_id: int, item_in: VehicleTypeUpdate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Cập nhật loại xe (Chỉ Quản lý)."""
    item = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == type_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loại xe không tồn tại.")
    for field, value in item_in.dict(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{type_id}", status_code=status.HTTP_200_OK)
def delete_vehicle_type(type_id: int, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Xóa loại xe (Chỉ Quản lý)."""
    item = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == type_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loại xe không tồn tại.")
    db.delete(item)
    db.commit()
    return {"message": f"Đã xóa loại xe '{item.TenLoaiXe}' thành công."}
