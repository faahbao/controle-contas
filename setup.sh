#!/bin/bash

# Script para instalar dependências do projeto (Linux/Mac)

echo ""
echo "==================================="
echo "  Controle de Contas - Setup"
echo "==================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo ""
    echo "Por favor, instale Node.js em:"
    echo "https://nodejs.org/ (versão LTS recomendada)"
    echo ""
    echo "Ou use seu gerenciador de pacotes:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  macOS: brew install node"
    exit 1
fi

echo "✅ Node.js encontrado"
node --version
npm --version
echo ""

# Instalar backend
echo "Instalando dependências do backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do backend"
    cd ..
    exit 1
fi
cd ..

# Instalar frontend
echo ""
echo "Instalando dependências do frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do frontend"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "✅ Setup concluído com sucesso!"
echo ""
echo "Para iniciar o projeto:"
echo ""
echo "1. Em um terminal: cd backend && npm run dev"
echo "2. Em outro terminal: cd frontend && npm run dev"
echo ""
