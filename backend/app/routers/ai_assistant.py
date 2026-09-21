from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.ai import (
    AiReportRequest, AiReportResponse,
    AiPeakHourResponse, AiStaffingResponse,
    AiChatRequest, AiChatResponse
)
from app.services.ai_service import (
    generate_traffic_report, analyze_peak_hours,
    get_staffing_advice, chat_with_ai, get_ai_agents_info
)

router = APIRouter(prefix="/ai", tags=["Trợ lý Trí tuệ Nhân tạo (AI Engine)"])

@router.get("/agents")
def get_system_ai_agents(db: Session = Depends(get_db)):
    """Chức năng 2.11.1: Quản lý và theo dõi Hệ thống Đa Tác nhân AI (Multi-Agent System)."""
    return get_ai_agents_info(db)

@router.post("/report", response_model=AiReportResponse)
def create_ai_report(req: AiReportRequest, db: Session = Depends(get_db)):
    """Chức năng 2.11.3: AI sinh báo cáo lưu lượng theo ngày hoặc tuần."""
    return generate_traffic_report(db, req.LoaiBaoCao, req.NgayXem)

@router.get("/peak-hours", response_model=AiPeakHourResponse)
def get_ai_peak_hours(
    date_str: Optional[str] = Query(None, description="Ngày cần phân tích (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Chức năng 2.11.4: AI phân tích khung giờ cao điểm."""
    return analyze_peak_hours(db, date_str)

@router.get("/staffing-advice", response_model=AiStaffingResponse)
def get_ai_staffing_advice(
    date_str: Optional[str] = Query(None, description="Ngày cần gợi ý bố trí nhân sự"),
    db: Session = Depends(get_db)
):
    """Chức năng 2.11.6: AI gợi ý bố trí nhân sự theo khung giờ cao điểm."""
    return get_staffing_advice(db, date_str)

@router.post("/chat", response_model=AiChatResponse)
def ask_ai_assistant(req: AiChatRequest, db: Session = Depends(get_db)):
    """Chức năng 2.11.5: AI trả lời câu hỏi quản trị & giải đáp khách hàng."""
    return chat_with_ai(db, req.CauHoi, req.VaiTroNguoiHoi)

