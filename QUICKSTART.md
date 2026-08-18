# Quick Start

Guia rapido para colocar o projeto no ar em menos de 5 minutos.

## Pre-requisitos

- Node.js 20+
- Git

## Instalacao Rapida

### Windows

```powershell
cd D:\Projetos\controle-contas

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Em outro terminal, frontend
cd ..\frontend
npm install
npm run dev
```

### Linux/Mac

```bash
cd controle-contas

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Em outro terminal, frontend
cd ../frontend
npm install
npm run dev
```

## Acesso

Apos iniciar, acesse:

```text
http://localhost:3001
```

Ou a URL exibida pelo Vite no terminal.

## Primeiro Acesso

1. Acesse a aplicacao no navegador
2. Clique em "Registrar" ou "Cadastre-se"
3. Crie sua conta com nome, email e senha
4. Faca login
5. Comece a lancar suas receitas e despesas!

## Comandos Uteis

### Backend

```powershell
cd backend
npm run dev      # Desenvolvimento
npm run build    # Build producao (se houver)
npx prisma generate
npx prisma migrate dev
npx prisma studio  # Visualizar banco
```

### Frontend

```powershell
cd frontend
npm run dev      # Desenvolvimento
npm run build    # Build producao
npm run preview  # Preview producao
```

## Problemas Comuns

### Porta 3000 ocupada

Altere a porta no `backend/.env`:

```env
PORT=3001
```

E atualize o frontend se necessario:

```env
VITE_API_URL=http://localhost:3001/api
```

### Erro no Prisma

```powershell
cd backend
npx prisma generate
npx prisma migrate dev
```

### Erro de login 404

Confirme:

- Backend rodando na porta 3000 (ou a porta configurada)
- Frontend usando a URL correta da API
- Rota `POST /api/auth/login` presente no `server.js`

## Documentacao Completa

- [README.md](./README.md) - Visao geral
- [INSTALL.md](./INSTALL.md) - Guia de instalacao detalhado
- [API.md](./API.md) - Documentacao da API
- [FEATURES.md](./FEATURES.md) - Todas as funcionalidades

---

Precisa de ajuda? Consulte a documentacao completa ou abra uma issue no GitHub!