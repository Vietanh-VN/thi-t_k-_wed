from typing import Optional
from pydantic import BaseModel, ConfigDict

class ZoneBase(BaseModel):
    TenKhuVuc: str
    MoTa: Optional[str] = None
    TrangThai: str = "HoatDong"

class ZoneCreate(ZoneBase):
    pass

class ZoneUpdate(BaseModel):
    TenKhuVuc: Optional[str] = None
    MoTa: Optional[str] = None
    TrangThai: Optional[str] = None

class ZoneResponse(ZoneBase):
    model_config = ConfigDict(from_attributes=True)
    KhuVucId: int

class ZoneWithStatsResponse(ZoneResponse):
    TongSoCho: int = 0
    SoChoTrong: int = 0
    SoChoDangDung: int = 0
    SoChoBaoTri: int = 0
    TyLeLapDay: float = 0.0
