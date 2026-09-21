from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database
import app.models  # Nạp toàn bộ models

# Import routers
from app.routers import (
    auth_router,
    zones_router,
    spots_router,
    vehicle_types_router,
    vehicles_router,
    parking_router,
    monthly_passes_router,
    pricing_router,
    history_router,
    stats_router,
    ai_router
)

def ensure_db_schema(engine):
    """Kiểm tra và tự động bổ sung cột còn thiếu cho SQLite nếu CSDL đã tồn tại."""
    with engine.connect() as conn:
        try:
            res = conn.exec_driver_sql("PRAGMA table_info(BangGia)").fetchall()
            col_names = [r[1] for r in res]
            if "NoiDungDichVu" not in col_names and len(col_names) > 0:
                conn.exec_driver_sql("ALTER TABLE BangGia ADD COLUMN NoiDungDichVu VARCHAR(200)")
                conn.commit()

            res_ve = conn.exec_driver_sql("PRAGMA table_info(VeThang)").fetchall()
            col_names_ve = [r[1] for r in res_ve]
            if "GoiVe" not in col_names_ve and len(col_names_ve) > 0:
                conn.exec_driver_sql("ALTER TABLE VeThang ADD COLUMN GoiVe VARCHAR(50) DEFAULT 'Ngay'")
                conn.commit()
            if "GiaTien" not in col_names_ve and len(col_names_ve) > 0:
                conn.exec_driver_sql("ALTER TABLE VeThang ADD COLUMN GiaTien FLOAT DEFAULT 80000.0")
                conn.commit()
        except Exception as e:
            print(f"[Schema Migration] Lưu ý: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi tạo bảng CSDL và nạp dữ liệu mẫu
    Base.metadata.create_all(bind=engine)
    ensure_db_schema(engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hệ thống Quản lý Bãi đỗ xe thông minh có tích hợp Trí tuệ Nhân tạo AI (FastAPI + React)",
    lifespan=lifespan
)

# Cấu hình CORS để Frontend kết nối trơn tru
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gắn các router API theo tiền tố /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(zones_router, prefix=settings.API_V1_STR)
app.include_router(spots_router, prefix=settings.API_V1_STR)
app.include_router(vehicle_types_router, prefix=settings.API_V1_STR)
app.include_router(vehicles_router, prefix=settings.API_V1_STR)
app.include_router(parking_router, prefix=settings.API_V1_STR)
app.include_router(monthly_passes_router, prefix=settings.API_V1_STR)
app.include_router(pricing_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(stats_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Hệ thống Quản lý Bãi đỗ xe tích hợp AI đang hoạt động!",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": "2026-09-02"}
