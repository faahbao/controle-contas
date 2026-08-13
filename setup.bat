@echo off
REM Script para instalar dependências do projeto

echo.
echo ===================================
echo  Controle de Contas - Setup
echo ===================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js não está instalado!
    echo.
    echo Por favor, instale Node.js em:
    echo https://nodejs.org/ (versão LTS recomendada)
    echo.
    echo Após instalar, execute este script novamente.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version
npm --version
echo.

REM Instalar backend
echo Instalando dependências do backend...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do backend
    cd ..
    pause
    exit /b 1
)
cd ..

REM Instalar frontend
echo.
echo Instalando dependências do frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Setup concluído com sucesso!
echo.
echo Para iniciar o projeto:
echo.
echo 1. Em um terminal: cd backend && npm run dev
echo 2. Em outro terminal: cd frontend && npm run dev
echo.
pause
