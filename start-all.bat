@echo off
REM Script para iniciar Backend E Frontend simultaneamente
REM Este script abre duas janelas: uma para backend e outra para frontend

cd /d "%~dp0"

echo.
echo ========================================
echo   Iniciando Sistema Completo
echo ========================================
echo.
echo Abrindo Backend (Porta 5000)...
start "Backend - Controle de Contas" call start-backend.bat

timeout /t 3 /nobreak

echo Abrindo Frontend (Porta 3000)...
start "Frontend - Controle de Contas" call start-frontend.bat

echo.
echo ✓ Sistema iniciando...
echo.
echo Acesse: http://localhost:3000
echo.
echo (Duas janelas foram abertas - Backend e Frontend)
echo.

pause
