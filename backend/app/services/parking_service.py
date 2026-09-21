from datetime import datetime, date
import math
from typing import Optional, Tuple, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.vehicle import PhuongTien
from app.models.parking_spot import ViTriDo
from app.models.parking_session import LuotGuiXe
from app.models.vehicle_type import LoaiXe
from app.models.zone import KhuVuc
from app.models.pricing import BangGia
from app.models.monthly_pass import VeThang
from app.schemas.parking_session import (
    CheckInRequest, CheckInResponse,
    CalculateFeeRequest, CalculateFeeResponse,
    CheckOutRequest, CheckOutResponse
)

def check_monthly_pass(db: Session, phuong_tien_id: int) -> Tuple[bool, Optional[VeThang]]:
    """Kiểm tra phương tiện có vé tháng còn hiệu lực hay không."""
    today = date.today()
    ve_thang = db.query(VeThang).filter(
        VeThang.PhuongTienId == phuong_tien_id,
        VeThang.TrangThai == "ConHan",
        VeThang.NgayBatDau <= today,
        VeThang.NgayHetHan >= today
    ).order_by(VeThang.NgayHetHan.desc()).first()

    if ve_thang:
        return True, ve_thang
    return False, None

def clean_plate(plate: str) -> str:
    """Chuẩn hóa biển số chỉ giữ ký tự chữ và số."""
    import re
    return re.sub(r'[^A-Z0-9]', '', (plate or '').upper())

def get_or_create_vehicle(db: Session, bien_so: str, loai_xe_id: int) -> PhuongTien:
    """Tìm hoặc tạo mới phương tiện theo biển số."""
    bien_so_clean = bien_so.strip().upper()
    phuong_tien = db.query(PhuongTien).filter(PhuongTien.BienSo == bien_so_clean).first()
    if not phuong_tien:
        raw_alphanumeric = clean_plate(bien_so_clean)
        for v in db.query(PhuongTien).all():
            if clean_plate(v.BienSo) == raw_alphanumeric:
                phuong_tien = v
                break

    if not phuong_tien:
        phuong_tien = PhuongTien(BienSo=bien_so_clean, LoaiXeId=loai_xe_id)
        db.add(phuong_tien)
        db.commit()
        db.refresh(phuong_tien)
    else:
        # Cập nhật loại xe nếu có thay đổi
        if loai_xe_id and phuong_tien.LoaiXeId != loai_xe_id:
            phuong_tien.LoaiXeId = loai_xe_id
            db.commit()
            db.refresh(phuong_tien)
    return phuong_tien

def process_check_in(db: Session, req: CheckInRequest) -> CheckInResponse:
    """Thực hiện quy trình ghi nhận xe vào bãi (Use case 2.5.2)."""
    bien_so = req.BienSo.strip().upper()
    if not bien_so:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vui lòng nhập biển số xe.")

    # 1. Kiểm tra loại xe
    loai_xe = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == req.LoaiXeId).first()
    if not loai_xe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loại xe không tồn tại.")

    # 2. Lấy hoặc tạo phương tiện
    phuong_tien = get_or_create_vehicle(db, bien_so, req.LoaiXeId)

    # 3. Kiểm tra xem xe này có đang trong bãi (lượt gửi 'DangGui') hay không
    active_session = db.query(LuotGuiXe).filter(
        LuotGuiXe.PhuongTienId == phuong_tien.PhuongTienId,
        LuotGuiXe.TrangThai == "DangGui"
    ).first()
    if active_session:
        vi_tri = db.query(ViTriDo).filter(ViTriDo.ViTriId == active_session.ViTriId).first()
        ten_vi_tri = vi_tri.TenViTri if vi_tri else "Chưa rõ"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Xe biển số {bien_so} đang có lượt gửi hoạt động tại vị trí {ten_vi_tri} (Vào lúc: {active_session.ThoiGianVao.strftime('%d/%m/%Y %H:%M')}). Không thể ghi nhận xe vào lại."
        )

    # 4. Kiểm tra vé tháng
    has_monthly_pass, monthly_pass = check_monthly_pass(db, phuong_tien.PhuongTienId)

    # 5. Xác định vị trí đỗ
    selected_spot: Optional[ViTriDo] = None
    if req.ViTriId:
        spot = db.query(ViTriDo).filter(ViTriDo.ViTriId == req.ViTriId).first()
        if not spot:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vị trí đỗ chỉ định không tồn tại.")
        if spot.TrangThai != "Trong":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Vị trí {spot.TenViTri} hiện không trống (Trạng thái: {spot.TrangThai}).")
        if spot.LoaiXeId != req.LoaiXeId:
            loai_spot = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == spot.LoaiXeId).first()
            ten_loai_spot = loai_spot.TenLoaiXe if loai_spot else "khác"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vị trí {spot.TenViTri} chỉ dành cho loại xe {ten_loai_spot}, không thể xếp loại xe {loai_xe.TenLoaiXe}."
            )
        selected_spot = spot
    else:
        # Tác nhân AI Smart Spot Allocator: Cân bằng tải giữa các phân khu hoạt động cùng loại xe
        active_zones = db.query(KhuVuc).filter(KhuVuc.TrangThai == "HoatDong").all()
        best_zone = None
        max_vacant = -1
        for z in active_zones:
            vacant_count = db.query(ViTriDo).filter(
                ViTriDo.KhuVucId == z.KhuVucId,
                ViTriDo.LoaiXeId == req.LoaiXeId,
                ViTriDo.TrangThai == "Trong"
            ).count()
            if vacant_count > max_vacant and vacant_count > 0:
                max_vacant = vacant_count
                best_zone = z

        if best_zone:
            selected_spot = db.query(ViTriDo).filter(
                ViTriDo.KhuVucId == best_zone.KhuVucId,
                ViTriDo.LoaiXeId == req.LoaiXeId,
                ViTriDo.TrangThai == "Trong"
            ).order_by(ViTriDo.TenViTri.asc()).first()
        else:
            selected_spot = db.query(ViTriDo).join(KhuVuc).filter(
                ViTriDo.LoaiXeId == req.LoaiXeId,
                ViTriDo.TrangThai == "Trong",
                KhuVuc.TrangThai == "HoatDong"
            ).order_by(ViTriDo.ViTriId.asc()).first()

    if not selected_spot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bãi đỗ xe đã hết vị trí trống phù hợp cho loại xe {loai_xe.TenLoaiXe}."
        )

    # 6. Cập nhật vị trí sang Đang sử dụng
    selected_spot.TrangThai = "DangSuDung"

    # 7. Tạo lượt gửi xe
    new_session = LuotGuiXe(
        PhuongTienId=phuong_tien.PhuongTienId,
        ViTriId=selected_spot.ViTriId,
        ThoiGianVao=datetime.now(),
        TrangThai="DangGui",
        PhiGuiXe=0.0
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    khu_vuc_name = selected_spot.khu_vuc.TenKhuVuc if selected_spot.khu_vuc else "Khu vực chung"

    return CheckInResponse(
        LuotGuiId=new_session.LuotGuiId,
        BienSo=phuong_tien.BienSo,
        TenLoaiXe=loai_xe.TenLoaiXe,
        ViTriId=selected_spot.ViTriId,
        TenViTri=selected_spot.TenViTri,
        TenKhuVuc=khu_vuc_name,
        ThoiGianVao=new_session.ThoiGianVao,
        CoVeThang=has_monthly_pass,
        TrangThai="DangGui",
        ThongBao="Ghi nhận xe vào thành công!" + (" (Xe có vé tháng hợp lệ)" if has_monthly_pass else "")
    )

def calculate_fee(db: Session, session: LuotGuiXe, exit_time: datetime, mat_ve: bool = False) -> Dict[str, Any]:
    """Hàm lõi tính phí gửi xe theo thời gian, ca gửi, qua đêm và phụ thu mất vé (Use case 2.5.4)."""
    phi_mat_ve = 10000.0 if mat_ve else 0.0

    # 1. Kiểm tra vé tháng
    has_monthly, pass_obj = check_monthly_pass(db, session.PhuongTienId)
    if has_monthly:
        bang_gia_str = "Vé tháng (Miễn phí lượt gửi)"
        if mat_ve:
            bang_gia_str += " + Phụ thu mất vé xe (10.000 đ)"
        return {
            "CoVeThang": True,
            "BangGiaApDung": bang_gia_str,
            "DonGia": 0.0,
            "PhiGuiXe": 0.0,
            "MatVe": mat_ve,
            "PhiMatVe": phi_mat_ve,
            "TongThanhToan": phi_mat_ve
        }

    # 2. Lấy thông tin loại xe
    phuong_tien = db.query(PhuongTien).filter(PhuongTien.PhuongTienId == session.PhuongTienId).first()
    loai_xe_id = phuong_tien.LoaiXeId if phuong_tien else 1

    # 3. Tính toán theo ca gửi / qua đêm theo Use Case 2.5.4:
    # - Gửi xe buổi sáng: 2.000 đồng/lượt (06:00 - 12:00)
    # - Gửi xe buổi chiều: 2.000 đồng/lượt (12:00 - 18:00)
    # - Gửi xe buổi tối: 3.000 đồng/lượt (18:00 - 22:00)
    # - Xe gửi qua đêm: 10.000 đồng/lượt (22:00 - 06:00 hoặc gửi qua đêm / thời gian gửi >= 12h)
    # - Phụ thu mất vé xe: 10.000 đồng
    duration_seconds = max(0, (exit_time - session.ThoiGianVao).total_seconds())
    hours = duration_seconds / 3600.0

    current_time = exit_time.time()
    time_val = current_time.hour + current_time.minute / 60.0

    # Xác định gửi qua đêm
    is_overnight = (hours >= 12.0) or (session.ThoiGianVao.date() != exit_time.date()) or (time_val >= 22.0 or time_val < 6.0)

    if is_overnight:
        ten_ca = "Xe gửi qua đêm"
        don_gia = 10000.0
        don_vi_tinh = "Lượt"
    elif 6.0 <= time_val < 12.0:
        ten_ca = "Gửi xe buổi sáng (06:00 - 12:00)"
        don_gia = 2000.0
        don_vi_tinh = "Lượt"
    elif 12.0 <= time_val < 18.0:
        ten_ca = "Gửi xe buổi chiều (12:00 - 18:00)"
        don_gia = 2000.0
        don_vi_tinh = "Lượt"
    else:  # 18.0 <= time_val < 22.0
        ten_ca = "Gửi xe buổi tối (18:00 - 22:00)"
        don_gia = 3000.0
        don_vi_tinh = "Lượt"

    # Nếu có cấu hình BangGia trong CSDL cho khung giờ cụ thể thì ưu tiên
    active_pricings = db.query(BangGia).filter(
        BangGia.LoaiXeId == loai_xe_id,
        BangGia.TrangThai == True
    ).all()
    for p in active_pricings:
        if is_overnight and (p.TuGio and p.DenGio and p.TuGio > p.DenGio):
            don_gia = p.DonGia
            don_vi_tinh = p.DonViTinh or "Lượt"
            if p.NoiDungDichVu:
                ten_ca = p.NoiDungDichVu
            break
        elif not is_overnight and p.TuGio and p.DenGio and p.TuGio <= p.DenGio:
            if p.TuGio <= current_time <= p.DenGio:
                don_gia = p.DonGia
                don_vi_tinh = p.DonViTinh or "Lượt"
                if p.NoiDungDichVu:
                    ten_ca = p.NoiDungDichVu
                break

    base_fee = don_gia
    total_payment = base_fee + phi_mat_ve

    bang_gia_str = f"{ten_ca} ({don_gia:,.0f} đ/{don_vi_tinh})"
    if mat_ve:
        bang_gia_str += f" + Phụ thu mất vé (10.000 đ)"

    return {
        "CoVeThang": False,
        "BangGiaApDung": bang_gia_str,
        "DonGia": don_gia,
        "PhiGuiXe": base_fee,
        "MatVe": mat_ve,
        "PhiMatVe": phi_mat_ve,
        "TongThanhToan": total_payment
    }

def process_calculate_fee(db: Session, req: CalculateFeeRequest) -> CalculateFeeResponse:
    """API tạm tính phí cho xe sắp ra (Use case 2.5.4)."""
    session = None
    if req.LuotGuiId:
        session = db.query(LuotGuiXe).filter(
            LuotGuiXe.LuotGuiId == req.LuotGuiId,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()
    elif req.BienSo:
        bien_so = req.BienSo.strip().upper()
        # Tìm chính xác hoặc chuẩn hóa
        session = db.query(LuotGuiXe).join(PhuongTien).filter(
            PhuongTien.BienSo == bien_so,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()
        if not session:
            clean_input = clean_plate(bien_so)
            active_sessions = db.query(LuotGuiXe).filter(LuotGuiXe.TrangThai == "DangGui").all()
            for s in active_sessions:
                if s.phuong_tien and clean_plate(s.phuong_tien.BienSo) == clean_input:
                    session = s
                    break

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lượt gửi đang hoạt động cho phương tiện này."
        )

    exit_time = datetime.now()
    duration_seconds = max(0, (exit_time - session.ThoiGianVao).total_seconds())
    hours = round(duration_seconds / 3600.0, 2)
    minutes = int(duration_seconds // 60)

    fee_calc = calculate_fee(db, session, exit_time, mat_ve=bool(req.MatVe))

    phuong_tien = db.query(PhuongTien).filter(PhuongTien.PhuongTienId == session.PhuongTienId).first()
    vi_tri = db.query(ViTriDo).filter(ViTriDo.ViTriId == session.ViTriId).first()
    loai_xe = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == phuong_tien.LoaiXeId).first() if phuong_tien else None
    khu_vuc = vi_tri.khu_vuc if vi_tri else None

    return CalculateFeeResponse(
        LuotGuiId=session.LuotGuiId,
        BienSo=phuong_tien.BienSo if phuong_tien else "Chưa rõ",
        TenLoaiXe=loai_xe.TenLoaiXe if loai_xe else "Chưa rõ",
        TenViTri=vi_tri.TenViTri if vi_tri else "Chưa rõ",
        TenKhuVuc=khu_vuc.TenKhuVuc if khu_vuc else "Chưa rõ",
        ThoiGianVao=session.ThoiGianVao,
        ThoiGianRa=exit_time,
        SoGioGui=hours,
        SoPhutGui=minutes,
        CoVeThang=fee_calc["CoVeThang"],
        BangGiaApDung=fee_calc["BangGiaApDung"],
        DonGia=fee_calc["DonGia"],
        PhiGuiXe=fee_calc["PhiGuiXe"],
        MatVe=fee_calc["MatVe"],
        PhiMatVe=fee_calc["PhiMatVe"],
        TongThanhToan=fee_calc["TongThanhToan"]
    )

def process_check_out(db: Session, req: CheckOutRequest) -> CheckOutResponse:
    """Thực hiện quy trình ghi nhận xe ra và thanh toán (Use case 2.5.3, 2.5.4)."""
    session = None
    if req.LuotGuiId:
        session = db.query(LuotGuiXe).filter(
            LuotGuiXe.LuotGuiId == req.LuotGuiId,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()
    elif req.BienSo:
        bien_so = req.BienSo.strip().upper()
        session = db.query(LuotGuiXe).join(PhuongTien).filter(
            PhuongTien.BienSo == bien_so,
            LuotGuiXe.TrangThai == "DangGui"
        ).first()
        if not session:
            clean_input = clean_plate(bien_so)
            active_sessions = db.query(LuotGuiXe).filter(LuotGuiXe.TrangThai == "DangGui").all()
            for s in active_sessions:
                if s.phuong_tien and clean_plate(s.phuong_tien.BienSo) == clean_input:
                    session = s
                    break

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy lượt gửi đang hoạt động cho phương tiện này."
        )

    exit_time = datetime.now()
    duration_seconds = max(0, (exit_time - session.ThoiGianVao).total_seconds())
    hours = round(duration_seconds / 3600.0, 2)

    fee_calc = calculate_fee(db, session, exit_time, mat_ve=bool(req.MatVe))

    # 1. Cập nhật lượt gửi xe
    session.ThoiGianRa = exit_time
    session.PhiGuiXe = fee_calc["TongThanhToan"]  # Tổng số tiền thu vào doanh thu
    session.TrangThai = "HoanThanh"

    # 2. Giải phóng vị trí đỗ về trạng thái "Trong"
    vi_tri = db.query(ViTriDo).filter(ViTriDo.ViTriId == session.ViTriId).first()
    if vi_tri:
        vi_tri.TrangThai = "Trong"

    db.commit()
    db.refresh(session)

    phuong_tien = db.query(PhuongTien).filter(PhuongTien.PhuongTienId == session.PhuongTienId).first()
    loai_xe = db.query(LoaiXe).filter(LoaiXe.LoaiXeId == phuong_tien.LoaiXeId).first() if phuong_tien else None
    khu_vuc = vi_tri.khu_vuc if vi_tri else None

    thong_bao = "Ghi nhận xe ra và thanh toán hoàn tất. Vị trí đỗ đã được giải phóng!"
    if fee_calc["MatVe"]:
        thong_bao += " (Đã thu phụ thu mất vé 10.000 đ)"

    return CheckOutResponse(
        LuotGuiId=session.LuotGuiId,
        BienSo=phuong_tien.BienSo if phuong_tien else "Chưa rõ",
        TenLoaiXe=loai_xe.TenLoaiXe if loai_xe else "Chưa rõ",
        TenViTri=vi_tri.TenViTri if vi_tri else "Chưa rõ",
        TenKhuVuc=khu_vuc.TenKhuVuc if khu_vuc else "Chưa rõ",
        ThoiGianVao=session.ThoiGianVao,
        ThoiGianRa=exit_time,
        SoGioGui=hours,
        PhiGuiXe=fee_calc["PhiGuiXe"],
        MatVe=fee_calc["MatVe"],
        PhiMatVe=fee_calc["PhiMatVe"],
        TongThanhToan=fee_calc["TongThanhToan"],
        CoVeThang=fee_calc["CoVeThang"],
        TrangThai="HoanThanh",
        ThongBao=thong_bao
    )
