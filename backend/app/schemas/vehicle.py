from typing import Optional
from pydantic import BaseModel, ConfigDict

class VehicleBase(BaseModel):
    LoaiXeId: int
    BienSo: str

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    LoaiXeId: Optional[int] = None
    BienSo: Optional[str] = None

class VehicleResponse(VehicleBase):
    model_config = ConfigDict(from_attributes=True)
    PhuongTienId: int
    TenLoaiXe: Optional[str] = None

class VehicleLookupResponse(BaseModel):
    PhuongTienId: Optional[int] = None
    BienSo: str
    LoaiXeId: Optional[int] = None
    TenLoaiXe: Optional[str] = None
    CoVeThang: bool = False
    VeThangId: Optional[int] = None
    NgayHetHanVeThang: Optional[str] = None
    TrangThaiVeThang: Optional[str] = None
    DangGuiTrongBai: bool = False
    ViTriId: Optional[int] = None
    TenViTri: Optional[str] = None
    ThoiGianVao: Optional[str] = None
    LuotGuiId: Optional[int] = None
