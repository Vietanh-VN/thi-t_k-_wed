from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class PhuongTien(Base):
    __tablename__ = "PhuongTien"

    PhuongTienId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LoaiXeId = Column(Integer, ForeignKey("LoaiXe.LoaiXeId"), nullable=False)
    BienSo = Column(String(50), unique=True, index=True, nullable=False)

    loai_xe = relationship("LoaiXe", back_populates="phuong_tien_list")
    luot_gui_list = relationship("LuotGuiXe", back_populates="phuong_tien")
    ve_thang_list = relationship("VeThang", back_populates="phuong_tien")
