from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.parking_session import LuotGuiXe
from app.schemas.parking_session import (
    CheckInRequest, CheckInResponse,
    CalculateFeeRequest, CalculateFeeResponse,
    CheckOutRequest, CheckOutResponse,
    ParkingSessionResponse
)
from app.services.parking_service import (
    process_check_in, process_calculate_fee, process_check_out
)
from app.services.auth_service import require_staff_or_manager

router = APIRouter(prefix="/parking", tags=["Nghiệp vụ Xe Vào - Ra - Tính phí"])

@router.post("/check-in", response_model=CheckInResponse, status_code=status.HTTP_201_CREATED)
def check_in_vehicle(req: CheckInRequest, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Ghi nhận phương tiện vào bãi (Use case 2.5.2)."""
    return process_check_in(db, req)

@router.post("/calculate-fee", response_model=CalculateFeeResponse)
def calculate_parking_fee(req: CalculateFeeRequest, db: Session = Depends(get_db)):
    """Tính toán phí gửi xe tạm tính trước khi check-out (Use case 2.5.4)."""
    return process_calculate_fee(db, req)

@router.post("/check-out", response_model=CheckOutResponse)
def check_out_vehicle(req: CheckOutRequest, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Ghi nhận phương tiện rời bãi và hoàn tất thanh toán (Use case 2.5.3)."""
    return process_check_out(db, req)

@router.get("/active-sessions", response_model=List[ParkingSessionResponse])
def get_active_parking_sessions(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả các xe đang đỗ trong bãi."""
    sessions = db.query(LuotGuiXe).filter(LuotGuiXe.TrangThai == "DangGui").order_by(LuotGuiXe.ThoiGianVao.desc()).all()
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
