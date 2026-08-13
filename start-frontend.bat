@echo off
REM Script para iniciar o Frontend do Sistema de Controle de Contas
REM Este script abre uma nova janela PowerShell/CMD e inicia o servidor Vite

cd /d "%~dp0frontend"

echo.
echo ========================================
echo   Iniciando Frontend - Porta 3000
echo ========================================
echo.
echo Dependencias: Certifique-se de ter rodado "npm install"
echo URL: http://localhost:3000
echo.

npm run dev

pause
