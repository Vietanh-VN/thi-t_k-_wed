from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class NguoiDung(Base):
    __tablename__ = "NguoiDung"

    NguoiDungId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    HoTen = Column(String(100), nullable=False)
    Email = Column(String(150), unique=True, index=True, nullable=False)
    MatKhauHash = Column(String(255), nullable=False)
    VaiTro = Column(String(50), nullable=False, default="NhanVien")  # QuanLy, NhanVien, KhachHang
    TrangThai = Column(Boolean, default=True)  # True: Hoat dong, False: Bi khoa
