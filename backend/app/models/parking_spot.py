from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ViTriDo(Base):
    __tablename__ = "ViTriDo"

    ViTriId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    KhuVucId = Column(Integer, ForeignKey("KhuVuc.KhuVucId", ondelete="CASCADE"), nullable=False)
    LoaiXeId = Column(Integer, ForeignKey("LoaiXe.LoaiXeId"), nullable=False)
    TenViTri = Column(String(50), nullable=False)  # Ví dụ: A-01, A-02, B-01...
    TrangThai = Column(String(50), default="Trong")  # Trong, DangSuDung, BaoTri

    khu_vuc = relationship("KhuVuc", back_populates="vi_tri_list")
    loai_xe = relationship("LoaiXe", back_populates="vi_tri_list")
    luot_gui_list = relationship("LuotGuiXe", back_populates="vi_tri")
