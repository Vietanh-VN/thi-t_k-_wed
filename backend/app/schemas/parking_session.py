from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class CheckInRequest(BaseModel):
    BienSo: str
    LoaiXeId: int
    ViTriId: Optional[int] = None  # Nếu None thì hệ thống tự gợi ý vị trí trống tốt nhất
    PhiThuTruoc: Optional[float] = 0.0
    ThuTienNgay: Optional[bool] = False

class CheckInResponse(BaseModel):
    LuotGuiId: int
    BienSo: str
    TenLoaiXe: str
    ViTriId: int
    TenViTri: str
    TenKhuVuc: str
    ThoiGianVao: datetime
    CoVeThang: bool
    TrangThai: str
    ThongBao: str
    DonGia: Optional[float] = 0.0
    DonViTinh: Optional[str] = "Gio"
    PhiThuTruoc: Optional[float] = 0.0
    DaThuTien: Optional[bool] = False

class CalculateFeeRequest(BaseModel):
    BienSo: Optional[str] = None
    LuotGuiId: Optional[int] = None
    MatVe: Optional[bool] = False  # Use Case 2.5.4: Trường hợp mất vé xe (10.000 đồng)

class CalculateFeeResponse(BaseModel):
    LuotGuiId: int
    BienSo: str
    TenLoaiXe: str
    TenViTri: str
    TenKhuVuc: str
    ThoiGianVao: datetime
    ThoiGianRa: datetime
    SoGioGui: float
    SoPhutGui: int
    CoVeThang: bool
    BangGiaApDung: str
    DonGia: float
    PhiGuiXe: float
    MatVe: Optional[bool] = False
    PhiMatVe: Optional[float] = 0.0
    TongThanhToan: Optional[float] = 0.0

class CheckOutRequest(BaseModel):
    BienSo: Optional[str] = None
    LuotGuiId: Optional[int] = None
    MatVe: Optional[bool] = False  # Use Case 2.5.4: Trường hợp mất vé xe (10.000 đồng)

class CheckOutResponse(BaseModel):
    LuotGuiId: int
    BienSo: str
    TenLoaiXe: str
    TenViTri: str
    TenKhuVuc: str
    ThoiGianVao: datetime
    ThoiGianRa: datetime
    SoGioGui: float
    PhiGuiXe: float
    MatVe: Optional[bool] = False
    PhiMatVe: Optional[float] = 0.0
    TongThanhToan: Optional[float] = 0.0
    CoVeThang: bool
    TrangThai: str
    ThongBao: str

class ParkingSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    LuotGuiId: int
    PhuongTienId: int
    BienSo: str
    LoaiXeId: int
    TenLoaiXe: str
    ViTriId: int
    TenViTri: str
    TenKhuVuc: str
    ThoiGianVao: datetime
    ThoiGianRa: Optional[datetime] = None
    PhiGuiXe: float
    TrangThai: str
    CoVeThang: bool = False
