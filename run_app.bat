@echo off
title CredAccess - Unified Server Launcher
echo ===================================================
echo CredAccess: Unlocking Credit for the Unbanked
echo ===================================================
echo.

:: Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

:: Check Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Node/npm was not found in default PATH.
    echo Checking fallback Node installation...
    if exist "C:\Users\%USERNAME%\node_dist\node-v20.18.0-win-x64\npm.cmd" (
        set "PATH=C:\Users\%USERNAME%\node_dist\node-v20.18.0-win-x64;%PATH%"
        echo Found Node in custom path.
    )
)

:: Build frontend if dist doesn't exist
if not exist "frontend\dist" (
    echo [1/2] Building Frontend SPA for production...
    cd frontend
    call npm install
    call npm run build
    cd ..
    echo Frontend build complete.
) else (
    echo [1/2] Frontend build detected in frontend\dist.
)

:: Launch FastAPI backend
echo [2/2] Launching CredAccess Unified Server on http://127.0.0.1:8000 ...
echo.
echo Application will be live at:
echo   - Web App UI:        http://127.0.0.1:8000
echo   - Interactive API:   http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C in this terminal to stop the server.
echo.

cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
