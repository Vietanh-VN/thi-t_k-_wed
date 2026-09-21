from typing import Optional
from datetime import date
from pydantic import BaseModel, ConfigDict

class MonthlyPassBase(BaseModel):
    PhuongTienId: int
    TenKhachHang: Optional[str] = None
    SoDienThoai: Optional[str] = None
    NgayBatDau: date
    NgayHetHan: date
    TrangThai: str = "ConHan"  # ConHan, HetHan, Huy

class MonthlyPassCreate(BaseModel):
    BienSo: str
    LoaiXeId: int
    TenKhachHang: Optional[str] = None
    SoDienThoai: Optional[str] = None
    NgayBatDau: date
    SoThang: int = 1  # 1 tháng, 3 tháng, 6 tháng, 12 tháng
    GoiVe: Optional[str] = "Ngay"  # "Ngay" (80k) hoặc "QuaDem" (100k)
    GiaTien: Optional[float] = 80000.0

class MonthlyPassRenew(BaseModel):
    SoThang: int = 1

class MonthlyPassResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    VeThangId: int
    PhuongTienId: int
    BienSo: str
    TenLoaiXe: Optional[str] = None
    TenKhachHang: Optional[str] = None
    SoDienThoai: Optional[str] = None
    NgayBatDau: date
    NgayHetHan: date
    GoiVe: Optional[str] = "Ngay"
    GiaTien: Optional[float] = 80000.0
    TrangThai: str

class MonthlyPassCheckResponse(BaseModel):
    HopLe: bool
    VeThangId: Optional[int] = None
    BienSo: str
    TenKhachHang: Optional[str] = None
    NgayHetHan: Optional[date] = None
    TrangThai: str
    SoNgayConLai: int = 0
