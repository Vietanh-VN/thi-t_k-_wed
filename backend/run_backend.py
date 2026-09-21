import sys
import uvicorn

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


if __name__ == "__main__":
    print("==========================================================")
    print("  HỆ THỐNG QUẢN LÝ BÃI ĐỖ XE TÍCH HỢP AI - BACKEND SERVER")
    print("  FastAPI Server đang chạy tại: http://localhost:8000")
    print("  API Docs (Swagger UI):        http://localhost:8000/docs")
    print("==========================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
