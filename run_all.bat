@echo off
chcp 65001 > nul
title He Thong Quan Ly Bai Do Xe AI - NHOM 02

echo =========================================================
echo   HE THONG QUAN LY BAI DO XE CO TICH HOP AI - NHOM 02
echo   TRUONG DHCNTT VA TRUYEN THONG THAI NGUYEN
echo =========================================================
echo.

set PYTHON_PATH=%LOCALAPPDATA%\Programs\Python\Python311\python.exe
set NODE_PATH=%LOCALAPPDATA%\Programs\nodejs
set FRONTEND_DIR=%~dp0frontend
set BACKEND_DIR=%~dp0backend

:: Kiem tra Python
if not exist "%PYTHON_PATH%" set PYTHON_PATH=python

:: Kiem tra Node.js
if exist "%NODE_PATH%\node.exe" goto node_in_local
where node.exe > nul 2>&1
if errorlevel 1 (
    echo [LOI] Khong tim thay Node.js tren may tinh!
    pause & exit /b 1
)
goto node_ready

:node_in_local
set "PATH=%NODE_PATH%;%PATH%"

:node_ready

:: Giai phong port 8000 va 3000 neu co tien trinh cu bi ket
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /f /pid %%a > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /f /pid %%a > nul 2>&1

:: 1. Khoi dong Backend FastAPI (Port 8000)
echo [1/2] Dang khoi dong Backend FastAPI (Port 8000)...
start "BACKEND - FastAPI Port 8000" /d "%BACKEND_DIR%" cmd /c run.bat
ping 127.0.0.1 -n 3 > nul
echo      Backend API: http://localhost:8000/docs
echo.

:: 2. Khoi dong Frontend Vite React (Port 3000)
echo [2/2] Dang khoi dong Frontend Vite React (Port 3000)...
start "FRONTEND - Vite React Port 3000" /d "%FRONTEND_DIR%" cmd /c run.bat
ping 127.0.0.1 -n 4 > nul
echo      Frontend Web: http://localhost:3000
echo.

echo =========================================================
echo   CA HAI SERVER DA DUOC KHOI DONG THANH CONG!
echo =========================================================
echo.
echo   Giao dien chinh:   http://localhost:3000
echo   Backend API Docs:  http://localhost:8000/docs
echo.
echo   TAI KHOAN MAC DINH:
echo   Quan ly    : admin / admin123
echo   Nhan vien  : staff / staff123
echo   Khach hang : customer / customer123
echo =========================================================
echo.

:: Mo trinh duyet tu dong
echo Dang mo trinh duyet web...
start "" "http://localhost:3000"

exit
