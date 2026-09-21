from typing import Optional
from pydantic import BaseModel, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserResponse"

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    vai_tro: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    HoTen: str
    Email: str
    MatKhau: str
    VaiTro: str = "NhanVien"  # QuanLy, NhanVien, KhachHang

class UserUpdate(BaseModel):
    HoTen: Optional[str] = None
    VaiTro: Optional[str] = None
    TrangThai: Optional[bool] = None
    MatKhau: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    NguoiDungId: int
    HoTen: str
    Email: str
    VaiTro: str
    TrangThai: bool

Token.model_rebuild()
