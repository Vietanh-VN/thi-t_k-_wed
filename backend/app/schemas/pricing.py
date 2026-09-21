from typing import Optional, Union
from datetime import time
from pydantic import BaseModel, ConfigDict, field_serializer

class PricingBase(BaseModel):
    LoaiXeId: int
    NoiDungDichVu: Optional[str] = None        # Tên dịch vụ hoặc ca áp dụng (VD: Gửi xe buổi tối)
    TuGio: Optional[Union[time, str]] = None   # Thời gian bắt đầu áp dụng giá (VD: 06:30)
    DenGio: Optional[Union[time, str]] = None  # Thời gian kết thúc áp dụng giá (VD: 12:45)
    DonGia: float                              # Mức phí
    DonViTinh: str = "Luot"                    # Luot, Gio, NgayDem, Thang
    TrangThai: bool = True                     # Trạng thái sử dụng

    @field_serializer('TuGio', 'DenGio', mode='plain', when_used='always')
    def serialize_time(self, v):
        if isinstance(v, time):
            return v.strftime("%H:%M")
        return v

class PricingCreate(PricingBase):
    pass

class PricingUpdate(BaseModel):
    NoiDungDichVu: Optional[str] = None
    TuGio: Optional[Union[time, str]] = None
    DenGio: Optional[Union[time, str]] = None
    DonGia: Optional[float] = None
    DonViTinh: Optional[str] = None
    TrangThai: Optional[bool] = None

class PricingResponse(PricingBase):
    model_config = ConfigDict(from_attributes=True)
    BangGiaId: int
    TenLoaiXe: Optional[str] = None

