from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class KhuVuc(Base):
    __tablename__ = "KhuVuc"

    KhuVucId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenKhuVuc = Column(String(100), nullable=False)  # Khu A - Ô tô con, Khu B - Xe máy, Khu C - Xe tải...
    MoTa = Column(Text, nullable=True)
    TrangThai = Column(String(50), default="HoatDong")  # HoatDong, TamDung

    vi_tri_list = relationship("ViTriDo", back_populates="khu_vuc", cascade="all, delete-orphan")
