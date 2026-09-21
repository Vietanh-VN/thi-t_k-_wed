from typing import List, Dict, Any
from pydantic import BaseModel

class HourlyTrafficItem(BaseModel):
    Gio: int              # 0 - 23
    KhungGio: str         # "07:00 - 08:00"
    SoXeTrongKhungGio: int # Tổng lượt xe vào + ra
    SoXeVao: int
    SoXeRa: int
    LaGioCaoDiem: bool = False

class DailyTrafficItem(BaseModel):
    Ngay: str             # "2026-09-01"
    Thu: str              # "Thứ 2"
    SoXeVao: int
    SoXeRa: int
    TongLuot: int
    DoanhThu: float

class ZoneOccupancyItem(BaseModel):
    KhuVucId: int
    TenKhuVuc: str
    TongSoCho: int
    SoChoDangDung: int
    SoChoTrong: int
    TyLeLapDay: float     # 0.0 - 100.0%

class VehicleTypeStatItem(BaseModel):
    LoaiXeId: int
    TenLoaiXe: str
    SoLuotGui: int
    DoanhThu: float
    TyLe: float

class DashboardOverviewResponse(BaseModel):
    TongSoViTri: int
    SoViTriDangSuDung: int
    SoViTriTrong: int
    SoViTriBaoTri: int
    TyLeLapDay: float
    SoXeDangGui: int
    TongLuotXeVaoHomNay: int
    TongLuotXeRaHomNay: int
    DoanhThuHomNay: float
    DoanhThuThangNay: float
    TongVeThangHoatDong: int
    KhungGioCaoDiemNhat: str
    KhuVucDongNhat: str
