@echo off
setlocal

REM Sempre usa a pasta onde o proprio arquivo .bat esta salvo
cd /d "%~dp0"

echo.
echo ===================================
echo   Controle de Contas - Setup
echo ===================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js nao esta instalado.
    echo.
    echo Instale a versao LTS em:
    echo https://nodejs.org/
    echo.
    echo Depois execute este arquivo novamente.
    pause
    exit /b 1
)

REM Verificar npm
where npm >nul 2>nul
if errorlevel 1 (
    echo npm nao foi encontrado.
    echo Reinstale o Node.js na versao LTS.
    pause
    exit /b 1
)

echo Node.js encontrado:
node --version
echo npm encontrado:
npm --version
echo.

REM Backend
echo ===================================
echo Instalando dependencias do backend...
echo ===================================

cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
    echo.
    echo Erro ao instalar dependencias do backend.
    pause
    exit /b 1
)

echo.
echo Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo.
    echo Erro ao gerar o Prisma Client.
    echo Verifique o arquivo backend\.env e o schema.prisma.
    pause
    exit /b 1
)

if not exist ".env" (
    echo.
    echo AVISO: o arquivo backend\.env nao foi encontrado.
    echo Crie-o antes de iniciar o backend.
)

REM Frontend
echo.
echo ===================================
echo Instalando dependencias do frontend...
echo ===================================

cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
    echo.
    echo Erro ao instalar dependencias do frontend.
    pause
    exit /b 1
)

if not exist ".env" (
    echo.
    echo AVISO: o arquivo frontend\.env nao foi encontrado.
    echo Crie-o com o conteudo:
    echo VITE_API_URL=http://localhost:3000/api
)

echo.
echo ===================================
echo Setup concluido com sucesso!
echo ===================================
echo.
echo Proximo passo:
echo Execute start-all.bat na pasta raiz do projeto.
echo.
pause