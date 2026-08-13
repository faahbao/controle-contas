@echo off
REM Script para iniciar o Backend do Sistema de Controle de Contas
REM Este script abre uma nova janela PowerShell/CMD e inicia o servidor Express

cd /d "%~dp0backend"

echo.
echo ========================================
echo   Iniciando Backend - Porta 5000
echo ========================================
echo.
echo Dependencias: Certifique-se de ter rodado "npm install"
echo URL: http://localhost:5000
echo.

npm run dev

pause
