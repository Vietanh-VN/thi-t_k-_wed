from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.stats import (
    DashboardOverviewResponse, HourlyTrafficItem,
    DailyTrafficItem, ZoneOccupancyItem, VehicleTypeStatItem
)
from app.services import stats_service

router = APIRouter(prefix="/stats", tags=["Thống kê & Báo cáo số liệu"])

@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    """Lấy các chỉ số KPI Dashboard thời gian thực."""
    return stats_service.get_dashboard_overview(db)

@router.get("/hourly", response_model=List[HourlyTrafficItem])
def get_hourly_traffic(
    date_str: Optional[str] = Query(None, description="Ngày cần xem (YYYY-MM-DD), mặc định hôm nay"),
    db: Session = Depends(get_db)
):
    """Lấy lưu lượng phương tiện theo 24 khung giờ."""
    target_date = date.today()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    return stats_service.get_hourly_traffic(db, target_date)

@router.get("/7-days", response_model=List[DailyTrafficItem])
def get_7_days_trend(db: Session = Depends(get_db)):
    """Lấy xu hướng lưu lượng và doanh thu 7 ngày gần nhất."""
    return stats_service.get_7_days_traffic(db)

@router.get("/zones", response_model=List[ZoneOccupancyItem])
def get_zone_occupancy(db: Session = Depends(get_db)):
    """Lấy thống kê tỷ lệ lấp đầy theo từng khu vực."""
    return stats_service.get_zone_occupancy_stats(db)

@router.get("/vehicle-types", response_model=List[VehicleTypeStatItem])
def get_vehicle_type_stats(db: Session = Depends(get_db)):
    """Lấy cơ cấu phương tiện và doanh thu theo loại xe."""
    return stats_service.get_vehicle_type_stats(db)
