from typing import Optional
from pydantic import BaseModel, ConfigDict

class SpotBase(BaseModel):
    KhuVucId: int
    LoaiXeId: int
    TenViTri: str
    TrangThai: str = "Trong"  # Trong, DangSuDung, BaoTri

class SpotCreate(SpotBase):
    pass

class SpotUpdate(BaseModel):
    KhuVucId: Optional[int] = None
    LoaiXeId: Optional[int] = None
    TenViTri: Optional[str] = None
    TrangThai: Optional[str] = None

class SpotStatusUpdate(BaseModel):
    TrangThai: str

class SpotResponse(SpotBase):
    model_config = ConfigDict(from_attributes=True)
    ViTriId: int

class SpotWithDetailResponse(SpotResponse):
    TenKhuVuc: Optional[str] = None
    TenLoaiXe: Optional[str] = None
    BienSoHienTai: Optional[str] = None
    ThoiGianVaoHienTai: Optional[str] = None
    LuotGuiIdHienTai: Optional[int] = None
