@echo off
chcp 65001 > nul
title FRONTEND - Vite React Server (Port 3000)
cd /d "%~dp0"

echo ===================================================
echo   DANG KHOI DONG FRONTEND VITE REACT (PORT 3000)...
echo ===================================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
call npm run dev

if errorlevel 1 (
    echo.
    echo [CANH BAO] Frontend da dung hoac gap su co!
    pause
)
