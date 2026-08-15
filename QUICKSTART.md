# Quick Start - Controle de Contas

Guia rapido para colocar o projeto no ar em menos de 5 minutos.

## Pre-requisitos

- Node.js 20+
- Git

## Instalacao Rapida

### Windows

```bash
git clone https://github.com/faahbao/controle-contas.git
cd controle-contas
setup.bat
start-all.bat
```

### Linux/Mac

```bash
git clone https://github.com/faahbao/controle-contas.git
cd controle-contas
chmod +x setup.sh
./setup.sh
./start-all.bat
```

## Acesso

Apos iniciar, acesse: **http://localhost:5173**

## Comandos Uteis

### Backend

```bash
cd backend
npm run dev      # Desenvolvimento
npm run build    # Build producao
npm run start    # Start producao
```

### Frontend

```bash
cd frontend
npm run dev      # Desenvolvimento
npm run build    # Build producao
npm run preview  # Preview producao
```

## Variaveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta"
PORT=3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "Registrar"
3. Crie sua conta
4. Faca login
5. Comece a lancar suas contas!

## Problemas Comuns

### Porta 3000 ocupada

Altere a porta no backend/.env:
```env
PORT=3001
```

E atualize o frontend/.env:
```env
VITE_API_URL=http://localhost:3001/api
```

### Erro no Prisma

```bash
cd backend
npx prisma generate
npx prisma db push
```

## Documentacao Completa

- [README.md](./README.md) - Visao geral
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Estrutura
- [CHANGELOG.md](./CHANGELOG.md) - Versoes

---

Precisa de ajuda? Abra uma issue no GitHub!
