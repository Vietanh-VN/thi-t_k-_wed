from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Time
from sqlalchemy.orm import relationship
from app.database import Base

class BangGia(Base):
    __tablename__ = "BangGia"

    BangGiaId = Column(Integer, primary_key=True, index=True, autoincrement=True)
    LoaiXeId = Column(Integer, ForeignKey("LoaiXe.LoaiXeId"), nullable=True)
    NoiDungDichVu = Column(String(200), nullable=True)  # Tên dịch vụ theo Bảng 2
    TuGio = Column(Time, nullable=True)     # Thời gian bắt đầu áp dụng giá
    DenGio = Column(Time, nullable=True)    # Thời gian kết thúc áp dụng giá
    DonGia = Column(Float, nullable=False)  # DECIMAL - Mức phí
    DonViTinh = Column(String(50), nullable=False, default="Luot")  # VARCHAR - Đơn vị tính như giờ hoặc lượt
    TrangThai = Column(Boolean, default=True)  # BOOLEAN - Trạng thái sử dụng

    loai_xe = relationship("LoaiXe", back_populates="bang_gia_list")
