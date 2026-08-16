@echo off
setlocal

cd /d "%~dp0backend"

echo ========================================
echo Iniciando o backend...
echo ========================================

if not exist "node_modules" (
  echo Instalando dependencias do backend...
  call npm install
)

call npm run dev

pause