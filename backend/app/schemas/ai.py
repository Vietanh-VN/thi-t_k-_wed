from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AiReportRequest(BaseModel):
    LoaiBaoCao: str = "Ngay"  # "Ngay" hoặc "Tuan"
    NgayXem: Optional[str] = None  # Format: "YYYY-MM-DD", mặc định hôm nay

class AiReportResponse(BaseModel):
    LoaiBaoCao: str
    NgayXem: str
    TieuDe: str
    NoiDungBaoCao: str
    ChiSoChinh: Dict[str, Any]
    KhungGioCaoDiem: List[str]
    NhanXetLuuLuong: str
    GoiYDieuHanh: str
    NguonDuLieu: str

class AiPeakHourResponse(BaseModel):
    NgayXem: str
    DanhSachGioCaoDiem: List[Dict[str, Any]]
    KhungGioCaoNhat: str
    LuuLuongCaoNhat: int
    PhanTichXuHuong: str
    GoiYBaoTri: str

class AiStaffingResponse(BaseModel):
    NgayXem: str
    KhuyenNghiBoTri: List[Dict[str, Any]]
    GiaiThichChiTiet: str
    UuTienToiUu: str

class AiChatRequest(BaseModel):
    CauHoi: str
    VaiTroNguoiHoi: str = "QuanLy"  # "QuanLy", "NhanVien", "KhachHang"
    ContextExtra: Optional[Dict[str, Any]] = None

class AiChatResponse(BaseModel):
    CauHoi: str
    CauTraLoi: str
    DuLieuTrichXuat: Optional[Dict[str, Any]] = None
    GoiYCauHoiTiepTheo: List[str] = []
    TrangThaiAI: str = "ThanhCong"
