from typing import List, Optional
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.monthly_pass import VeThang
from app.models.vehicle import PhuongTien
from app.models.vehicle_type import LoaiXe
from app.schemas.monthly_pass import (
    MonthlyPassCreate, MonthlyPassRenew,
    MonthlyPassResponse, MonthlyPassCheckResponse
)
from app.services.auth_service import require_manager, require_staff_or_manager

router = APIRouter(prefix="/monthly-passes", tags=["Quản lý Vé tháng"])

@router.get("", response_model=List[MonthlyPassResponse])
def get_monthly_passes(
    search: Optional[str] = Query(None, description="Tìm theo biển số hoặc tên khách hàng"),
    status_filter: Optional[str] = Query(None, description="Lọc theo Trạng thái (ConHan, HetHan, Huy)"),
    db: Session = Depends(get_db)
):
    """Lấy danh sách vé tháng (Use case 2.5.5)."""
    query = db.query(VeThang).join(PhuongTien)
    if search:
        s_clean = search.strip().upper()
        query = query.filter(
            (PhuongTien.BienSo.like(f"%{s_clean}%")) |
            (VeThang.TenKhachHang.like(f"%{search.strip()}%")) |
            (VeThang.SoDienThoai.like(f"%{search.strip()}%"))
        )
    if status_filter:
        query = query.filter(VeThang.TrangThai == status_filter)

    passes = query.order_by(VeThang.NgayHetHan.desc()).all()
    results = []
    today = date.today()

    for p in passes:
        # Cập nhật trạng thái động nếu đã qua ngày hết hạn
        current_status = p.TrangThai
        if p.TrangThai == "ConHan" and p.NgayHetHan < today:
            current_status = "HetHan"
            p.TrangThai = "HetHan"
            db.commit()

        results.append(MonthlyPassResponse(
            VeThangId=p.VeThangId,
            PhuongTienId=p.PhuongTienId,
            BienSo=p.phuong_tien.BienSo if p.phuong_tien else "N/A",
            TenLoaiXe=p.phuong_tien.loai_xe.TenLoaiXe if p.phuong_tien and p.phuong_tien.loai_xe else "N/A",
            TenKhachHang=p.TenKhachHang,
            SoDienThoai=p.SoDienThoai,
            NgayBatDau=p.NgayBatDau,
            NgayHetHan=p.NgayHetHan,
            GoiVe=getattr(p, 'GoiVe', 'Ngay') or 'Ngay',
            GiaTien=getattr(p, 'GiaTien', 80000.0) or 80000.0,
            TrangThai=current_status
        ))
    return results

@router.post("", response_model=MonthlyPassResponse, status_code=status.HTTP_201_CREATED)
def create_monthly_pass(req: MonthlyPassCreate, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Đăng ký vé tháng mới cho phương tiện (Quản lý & Nhân viên)."""
    bien_so = req.BienSo.strip().upper()
    phuong_tien = db.query(PhuongTien).filter(PhuongTien.BienSo == bien_so).first()
    if not phuong_tien:
        phuong_tien = PhuongTien(BienSo=bien_so, LoaiXeId=req.LoaiXeId)
        db.add(phuong_tien)
        db.commit()
        db.refresh(phuong_tien)
    else:
        if req.LoaiXeId and phuong_tien.LoaiXeId != req.LoaiXeId:
            phuong_tien.LoaiXeId = req.LoaiXeId
            db.commit()

    # Kiểm tra xem phương tiện đã có vé tháng còn hiệu lực chưa
    active_pass = db.query(VeThang).filter(
        VeThang.PhuongTienId == phuong_tien.PhuongTienId,
        VeThang.TrangThai == "ConHan",
        VeThang.NgayHetHan >= req.NgayBatDau
    ).first()
    if active_pass:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Phương tiện {bien_so} đang có vé tháng còn hiệu lực đến ngày {active_pass.NgayHetHan.strftime('%d/%m/%Y')}."
        )

    # Tính ngày hết hạn
    so_ngay = req.SoThang * 30
    ngay_het_han = req.NgayBatDau + timedelta(days=so_ngay)
    goi_ve = req.GoiVe or "Ngay"
    gia_tien = (100000.0 if goi_ve == "QuaDem" else 80000.0) * req.SoThang

    new_pass = VeThang(
        PhuongTienId=phuong_tien.PhuongTienId,
        TenKhachHang=req.TenKhachHang,
        SoDienThoai=req.SoDienThoai,
        NgayBatDau=req.NgayBatDau,
        NgayHetHan=ngay_het_han,
        GoiVe=goi_ve,
        GiaTien=gia_tien,
        TrangThai="ConHan"
    )
    db.add(new_pass)
    db.commit()
    db.refresh(new_pass)

    return MonthlyPassResponse(
        VeThangId=new_pass.VeThangId,
        PhuongTienId=phuong_tien.PhuongTienId,
        BienSo=phuong_tien.BienSo,
        TenLoaiXe=phuong_tien.loai_xe.TenLoaiXe if phuong_tien.loai_xe else None,
        TenKhachHang=new_pass.TenKhachHang,
        SoDienThoai=new_pass.SoDienThoai,
        NgayBatDau=new_pass.NgayBatDau,
        NgayHetHan=new_pass.NgayHetHan,
        GoiVe=new_pass.GoiVe,
        GiaTien=new_pass.GiaTien,
        TrangThai=new_pass.TrangThai
    )

@router.post("/{pass_id}/renew", response_model=MonthlyPassResponse)
def renew_monthly_pass(pass_id: int, req: MonthlyPassRenew, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Gia hạn vé tháng (Quản lý & Nhân viên)."""
    p = db.query(VeThang).filter(VeThang.VeThangId == pass_id).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy vé tháng.")

    today = date.today()
    base_date = p.NgayHetHan if p.NgayHetHan > today else today
    p.NgayHetHan = base_date + timedelta(days=req.SoThang * 30)
    p.TrangThai = "ConHan"
    db.commit()
    db.refresh(p)

    return MonthlyPassResponse(
        VeThangId=p.VeThangId,
        PhuongTienId=p.PhuongTienId,
        BienSo=p.phuong_tien.BienSo if p.phuong_tien else "N/A",
        TenLoaiXe=p.phuong_tien.loai_xe.TenLoaiXe if p.phuong_tien and p.phuong_tien.loai_xe else "N/A",
        TenKhachHang=p.TenKhachHang,
        SoDienThoai=p.SoDienThoai,
        NgayBatDau=p.NgayBatDau,
        NgayHetHan=p.NgayHetHan,
        TrangThai=p.TrangThai
    )

@router.get("/check/{license_plate}", response_model=MonthlyPassCheckResponse)
def check_pass_by_plate(license_plate: str, db: Session = Depends(get_db)):
    """Kiểm tra tính hợp lệ của vé tháng theo biển số."""
    import re
    plate_clean = license_plate.strip().upper()
    phuong_tien = db.query(PhuongTien).filter(PhuongTien.BienSo == plate_clean).first()
    if not phuong_tien:
        raw_alphanumeric = re.sub(r'[^A-Z0-9]', '', plate_clean)
        for v in db.query(PhuongTien).all():
            if re.sub(r'[^A-Z0-9]', '', v.BienSo.upper()) == raw_alphanumeric:
                phuong_tien = v
                break

    if not phuong_tien:
        return MonthlyPassCheckResponse(
            HopLe=False,
            BienSo=plate_clean,
            TrangThai="KhongCoVe",
            SoNgayConLai=0
        )

    today = date.today()
    ve_thang = db.query(VeThang).filter(
        VeThang.PhuongTienId == phuong_tien.PhuongTienId,
        VeThang.TrangThai == "ConHan",
        VeThang.NgayHetHan >= today
    ).order_by(VeThang.NgayHetHan.desc()).first()

    if ve_thang:
        days_left = (ve_thang.NgayHetHan - today).days
        return MonthlyPassCheckResponse(
            HopLe=True,
            VeThangId=ve_thang.VeThangId,
            BienSo=plate_clean,
            TenKhachHang=ve_thang.TenKhachHang,
            NgayHetHan=ve_thang.NgayHetHan,
            TrangThai="ConHan",
            SoNgayConLai=days_left
        )

    return MonthlyPassCheckResponse(
        HopLe=False,
        BienSo=plate_clean,
        TrangThai="HetHanHoacChuaDangKy",
        SoNgayConLai=0
    )

@router.delete("/{pass_id}", status_code=status.HTTP_200_OK)
def cancel_monthly_pass(pass_id: int, db: Session = Depends(get_db), current_user = Depends(require_staff_or_manager)):
    """Hủy vé tháng (Quản lý & Nhân viên)."""
    p = db.query(VeThang).filter(VeThang.VeThangId == pass_id).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy vé tháng.")
    p.TrangThai = "Huy"
    db.commit()
    return {"message": "Đã hủy vé tháng thành công."}
