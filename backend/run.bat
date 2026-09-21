@echo off
chcp 65001 > nul
title BACKEND - FastAPI Server (Port 8000)
cd /d "%~dp0"

echo ===================================================
echo   DANG KHOI DONG BACKEND FASTAPI (PORT 8000)...
echo ===================================================
echo.

set PYTHON_PATH=%LOCALAPPDATA%\Programs\Python\Python311\python.exe
if not exist "%PYTHON_PATH%" (
    set PYTHON_PATH=python
)

set PYTHONIOENCODING=utf-8
"%PYTHON_PATH%" run_backend.py

if errorlevel 1 (
    echo.
    echo [CANH BAO] Backend da dung hoac gap su co!
    pause
)
