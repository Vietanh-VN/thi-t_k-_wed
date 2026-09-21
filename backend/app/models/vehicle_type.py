from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class LoaiXe(Base):
    __tablename__ = "LoaiXe"

    LoaiXeId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    TenLoaiXe = Column(String(100), nullable=False)  # Xe máy, Ô tô con, Xe tải/khách, Xe đạp điện
    MoTa = Column(String(255), nullable=True)

    vi_tri_list = relationship("ViTriDo", back_populates="loai_xe")
    phuong_tien_list = relationship("PhuongTien", back_populates="loai_xe")
    bang_gia_list = relationship("BangGia", back_populates="loai_xe")
