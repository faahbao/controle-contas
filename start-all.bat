@echo off
setlocal

echo ========================================
echo Iniciando Controle de Contas
echo ========================================

start "Controle de Contas - Backend" cmd /k ""%~dp0start-backend.bat""

timeout /t 3 /nobreak >nul

start "Controle de Contas - Frontend" cmd /k ""%~dp0start-frontend.bat""

echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Duas janelas foram abertas. Nao feche as janelas do backend e frontend.
pause