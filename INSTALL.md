# Instalacao

## Pre-requisitos

- Node.js 20 ou superior
- npm
- Windows, Linux ou macOS

O projeto usa SQLite local. Nao e necessario instalar PostgreSQL ou Docker.

## Backend

### 1. Instalar dependencias

```powershell
cd D:\Projetos\controle-contas\backend
npm install
```

### 2. Configurar .env

Crie ou atualize o arquivo `backend/.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="substitua-por-uma-chave-com-pelo-menos-32-caracteres"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

**Importante:** Gere uma nova chave JWT antes de publicar:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Substitua o valor de `JWT_SECRET` pelo resultado.

### 3. Gerar Prisma e migrar banco

```powershell
npx prisma generate
npx prisma migrate dev
```

### 4. Iniciar servidor

```powershell
npm run dev
```

O backend ficara disponivel em:

```text
http://localhost:3000
```

## Frontend

### 1. Instalar dependencias

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
```

### 2. Iniciar desenvolvimento

```powershell
npm run dev
```

O frontend normalmente ficara disponivel em:

```text
http://localhost:3001
```

Se o Vite usar outra porta, utilize a URL exibida no terminal.

## Variaveis de ambiente

### Backend

| Variavel | Descricao | Exemplo |
|---|---|---|
| DATABASE_URL | Caminho do banco SQLite | file:./dev.db?connection_limit=1 |
| JWT_SECRET | Chave usada para assinar tokens | chave com 32 caracteres ou mais |
| PORT | Porta do backend | 3000 |
| FRONTEND_URL | Origem principal do frontend | http://localhost:3001 |

Nunca compartilhe o arquivo `.env` nem publique o valor real de `JWT_SECRET`.

## Solucao de problemas

### Erro EPERM no Prisma

Pare todos os processos Node, feche terminais antigos e execute:

```powershell
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

### Erro de campo inexistente

Se aparecer erro sobre campo faltando no banco:

```powershell
npx prisma migrate dev
npx prisma generate
```

### Banco vazio ou tabela ausente

Confirme que `DATABASE_URL` aponta para `file:./dev.db` e execute:

```powershell
npx prisma migrate dev --force
npx prisma generate
```