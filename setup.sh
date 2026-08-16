#!/usr/bin/env bash

set -e

echo ""
echo "==================================="
echo "  Controle de Contas - Setup"
echo "==================================="
echo ""

# Sempre executa a partir da pasta onde este script está salvo
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verificar Node.js e npm
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js não está instalado!"
  echo ""
  echo "Instale a versão LTS em:"
  echo "https://nodejs.org/"
  echo ""
  echo "Ubuntu/Debian: sudo apt install nodejs npm"
  echo "macOS: brew install node"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm não está instalado!"
  exit 1
fi

echo "✅ Node.js encontrado:"
node --version
echo "✅ npm encontrado:"
npm --version
echo ""

# Backend
echo "==================================="
echo "Instalando dependências do backend..."
echo "==================================="

cd "$SCRIPT_DIR/backend"
npm install
npx prisma generate

if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  Arquivo backend/.env não encontrado."
  echo "Crie-o antes de iniciar o backend."
fi

# Frontend
echo ""
echo "==================================="
echo "Instalando dependências do frontend..."
echo "==================================="

cd "$SCRIPT_DIR/frontend"
npm install

if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  Arquivo frontend/.env não encontrado."
  echo "Crie-o com:"
  echo "VITE_API_URL=http://localhost:3000/api"
fi

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para iniciar o projeto:"
echo "  Linux/macOS:"
echo "    Terminal 1: cd backend && npm run dev"
echo "    Terminal 2: cd frontend && npm run dev"
echo ""
echo "  Windows:"
echo "    Execute start-all.bat"
echo ""