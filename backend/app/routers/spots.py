from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parking_spot import ViTriDo
from app.models.parking_session import LuotGuiXe
from app.models.vehicle import PhuongTien
from app.schemas.parking_spot import (
    SpotCreate, SpotUpdate, SpotResponse,
    SpotWithDetailResponse, SpotStatusUpdate
)
from app.services.auth_service import require_manager, require_staff_or_manager

router = APIRouter(prefix="/spots", tags=["Quản lý Vị trí đỗ"])

@router.get("", response_model=List[SpotWithDetailResponse])
def get_spots(
    zone_id: Optional[int] = Query(None, description="Lọc theo Khu vực"),
    status_filter: Optional[str] = Query(None, description="Lọc theo Trạng thái (Trong, DangSuDung, BaoTri)"),
    vehicle_type_id: Optional[int] = Query(None, description="Lọc theo Loại xe"),
    db: Session = Depends(get_db)
):
    """Lấy danh sách vị trí đỗ với chi tiết thông tin xe đang đỗ (nếu có)."""
    query = db.query(ViTriDo)
    if zone_id:
        query = query.filter(ViTriDo.KhuVucId == zone_id)
    if status_filter:
        query = query.filter(ViTriDo.TrangThai == status_filter)
    if vehicle_type_id:
        query = query.filter(ViTriDo.LoaiXeId == vehicle_type_id)

    spots = query.all()
    results = []

    for spot in spots:
        bien_so = None
        thoi_gian_vao = None
        luot_gui_id = None

        if spot.TrangThai == "DangSuDung":
            active_sess = db.query(LuotGuiXe).filter(
                LuotGuiXe.ViTriId == spot.ViTriId,
                LuotGuiXe.TrangThai == "DangGui"
            ).first()
            if active_sess:
                luot_gui_id = active_sess.LuotGuiId
                thoi_gian_vao = active_sess.ThoiGianVao.strftime("%d/%m/%Y %H:%M")
                if active_sess.phuong_tien:
                    bien_so = active_sess.phuong_tien.BienSo

        results.append(SpotWithDetailResponse(
            ViTriId=spot.ViTriId,
            KhuVucId=spot.KhuVucId,
            LoaiXeId=spot.LoaiXeId,
            TenViTri=spot.TenViTri,
            TrangThai=spot.TrangThai,
            TenKhuVuc=spot.khu_vuc.TenKhuVuc if spot.khu_vuc else None,
            TenLoaiXe=spot.loai_xe.TenLoaiXe if spot.loai_xe else None,
            BienSoHienTai=bien_so,
            ThoiGianVaoHienTai=thoi_gian_vao,
            LuotGuiIdHienTai=luot_gui_id
        ))
    return results

@router.post("", response_model=SpotResponse, status_code=status.HTTP_201_CREATED)
def create_spot(spot_in: SpotCreate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Tạo vị trí đỗ mới (Chỉ Quản lý)."""
    spot = ViTriDo(**spot_in.dict())
    db.add(spot)
    db.commit()
    db.refresh(spot)
    return spot

@router.get("/{spot_id}", response_model=SpotWithDetailResponse)
def get_spot(spot_id: int, db: Session = Depends(get_db)):
    """Lấy chi tiết 1 vị trí đỗ."""
    spot = db.query(ViTriDo).filter(ViTriDo.ViTriId == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vị trí đỗ không tồn tại.")
    
    bien_so = None
    thoi_gian_vao = None
    luot_gui_id = None

    if spot.TrangThai == "DangSuDung":
        active_sess = db.query(LuotGuiXe).filter(
            LuotGuiXe.ViTriId == spot.ViTriId,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()
        if active_sess:
            luot_gui_id = active_sess.LuotGuiId
            thoi_gian_vao = active_sess.ThoiGianVao.strftime("%d/%m/%Y %H:%M")
            if active_sess.phuong_tien:
                bien_so = active_sess.phuong_tien.BienSo

    return SpotWithDetailResponse(
        ViTriId=spot.ViTriId,
        KhuVucId=spot.KhuVucId,
        LoaiXeId=spot.LoaiXeId,
        TenViTri=spot.TenViTri,
        TrangThai=spot.TrangThai,
        TenKhuVuc=spot.khu_vuc.TenKhuVuc if spot.khu_vuc else None,
        TenLoaiXe=spot.loai_xe.TenLoaiXe if spot.loai_xe else None,
        BienSoHienTai=bien_so,
        ThoiGianVaoHienTai=thoi_gian_vao,
        LuotGuiIdHienTai=luot_gui_id
    )

@router.put("/{spot_id}", response_model=SpotResponse)
def update_spot(spot_id: int, spot_in: SpotUpdate, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Cập nhật cấu hình vị trí đỗ (Chỉ Quản lý)."""
    spot = db.query(ViTriDo).filter(ViTriDo.ViTriId == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vị trí đỗ không tồn tại.")
    for field, value in spot_in.dict(exclude_unset=True).items():
        setattr(spot, field, value)
    db.commit()
    db.refresh(spot)
    return spot

@router.patch("/{spot_id}/status", response_model=SpotResponse)
def update_spot_status(spot_id: int, status_in: SpotStatusUpdate, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Cập nhật nhanh trạng thái vị trí (Ví dụ: Chuyển sang bảo trì hoặc hoàn tất sửa chữa)."""
    spot = db.query(ViTriDo).filter(ViTriDo.ViTriId == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vị trí đỗ không tồn tại.")
    spot.TrangThai = status_in.TrangThai
    db.commit()
    db.refresh(spot)
    return spot

@router.delete("/{spot_id}", status_code=status.HTTP_200_OK)
def delete_spot(spot_id: int, db: Session = Depends(get_db), current_user = Depends(require_manager)):
    """Xóa vị trí đỗ (Chỉ Quản lý)."""
    spot = db.query(ViTriDo).filter(ViTriDo.ViTriId == spot_id).first()
    if not spot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vị trí đỗ không tồn tại.")
    if spot.TrangThai == "DangSuDung":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Không thể xóa vị trí đang có xe đỗ.")
    db.delete(spot)
    db.commit()
    return {"message": f"Đã xóa vị trí '{spot.TenViTri}' thành công."}
