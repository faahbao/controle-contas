@echo off
setlocal

cd /d "%~dp0frontend"

echo ========================================
echo Iniciando o frontend...
echo ========================================

if not exist "node_modules" (
  echo Instalando dependencias do frontend...
  call npm install
)

call npm run dev

pause