@echo off
title CredAccess - Development Launcher
echo ===================================================
echo CredAccess: Starting Development Servers
echo ===================================================
echo.

:: Add fallback Node to path if needed
if exist "C:\Users\%USERNAME%\node_dist\node-v20.18.0-win-x64\npm.cmd" (
    set "PATH=C:\Users\%USERNAME%\node_dist\node-v20.18.0-win-x64;%PATH%"
)

echo Starting Backend API Server (Port 8000)...
start "CredAccess - FastAPI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Frontend Dev Server (Port 5173)...
start "CredAccess - React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - React Dev Server: http://localhost:5173
echo - FastAPI Backend:  http://127.0.0.1:8000
echo - Swagger Docs:     http://127.0.0.1:8000/docs
echo.
pause
