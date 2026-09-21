from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class LuotGuiXe(Base):
    __tablename__ = "LuotGuiXe"

    LuotGuiId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    PhuongTienId = Column(Integer, ForeignKey("PhuongTien.PhuongTienId"), nullable=False)
    ViTriId = Column(Integer, ForeignKey("ViTriDo.ViTriId"), nullable=False)
    ThoiGianVao = Column(DateTime, default=datetime.now, nullable=False)
    ThoiGianRa = Column(DateTime, nullable=True)
    PhiGuiXe = Column(Float, default=0.0)
    TrangThai = Column(String(50), default="DangGui")  # DangGui, HoanThanh

    phuong_tien = relationship("PhuongTien", back_populates="luot_gui_list")
    vi_tri = relationship("ViTriDo", back_populates="luot_gui_list")
