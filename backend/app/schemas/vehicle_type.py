from typing import Optional
from pydantic import BaseModel, ConfigDict

class VehicleTypeBase(BaseModel):
    TenLoaiXe: str
    MoTa: Optional[str] = None

class VehicleTypeCreate(VehicleTypeBase):
    pass

class VehicleTypeUpdate(BaseModel):
    TenLoaiXe: Optional[str] = None
    MoTa: Optional[str] = None

class VehicleTypeResponse(VehicleTypeBase):
    model_config = ConfigDict(from_attributes=True)
    LoaiXeId: int
