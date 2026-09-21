from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class VeThang(Base):
    __tablename__ = "VeThang"

    VeThangId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    PhuongTienId = Column(Integer, ForeignKey("PhuongTien.PhuongTienId"), nullable=False)
    TenKhachHang = Column(String(100), nullable=True)
    SoDienThoai = Column(String(20), nullable=True)
    NgayBatDau = Column(Date, nullable=False)
    NgayHetHan = Column(Date, nullable=False)
    GoiVe = Column(String(50), default="Ngay")  # Ngay: 80k/tháng, QuaDem: 100k/tháng
    GiaTien = Column(Float, default=80000.0)
    TrangThai = Column(String(50), default="ConHan")  # ConHan, HetHan, Huy

    phuong_tien = relationship("PhuongTien", back_populates="ve_thang_list")
