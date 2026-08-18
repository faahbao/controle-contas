# Instalacao

## Pre-requisitos

- Node.js 20 ou superior
- npm
- Windows, Linux ou macOS

O projeto usa SQLite. Nao e necessario instalar PostgreSQL ou Docker.

## Backend

Abra um terminal:

```powershell
cd D:\Projetos\controle-contas\backend
npm install
```

Crie ou edite o arquivo `.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="substitua-por-uma-chave-forte-com-32-caracteres-ou-mais"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Gere o cliente Prisma:

```powershell
npx prisma generate
```

Crie ou atualize o banco:

```powershell
npx prisma migrate dev
```

Inicie o backend:

```powershell
npm run dev
```

O backend deve iniciar em:

```text
http://localhost:3000
```

## Frontend

Abra outro terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

O frontend normalmente inicia em:

```text
http://localhost:3001
```

Use a URL informada no terminal do Vite.

## Atualizar banco

Quando o arquivo `backend/prisma/schema.prisma` for alterado:

```powershell
cd D:\Projetos\controle-contas\backend
npx prisma migrate dev --name nome-da-alteracao
npx prisma generate
```

Exemplo para o campo de pagamento:

```powershell
npx prisma migrate dev --name add_paga_field
npx prisma generate
```

## Problemas comuns

### CORS bloqueando PATCH

No `backend/src/server.js`, confirme:

```javascript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
```

Depois reinicie o backend.

### Prisma retorna EPERM

Pare todos os processos Node e execute:

```powershell
cd D:\Projetos\controle-contas\backend
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

### SQLite retorna timeout

Confirme no `.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
```

O pagamento em lote deve executar uma atualizacao por vez, sem `Promise.all`.

### Login retorna 404

Confirme:

- Backend rodando em `http://localhost:3000`
- Frontend apontando para `http://localhost:3000/api`
- Rota `POST /api/auth/login` presente no backend