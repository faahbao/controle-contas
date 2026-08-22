# Instalação

## Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Windows, Linux ou macOS.

O projeto utiliza SQLite local; não é necessário instalar PostgreSQL ou Docker.

## Backend

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend padrão:

```text
http://localhost:3000
```

Confirme a porta exibida pelo servidor antes de configurar o frontend ou o tunnel.

## Frontend

Em outro terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

Acesse a URL exibida pelo Vite, geralmente `http://localhost:3001`.

## Variáveis de ambiente

Backend (`backend/.env`):

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="use-uma-chave-secreta-com-pelo-menos-32-caracteres"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Frontend (`frontend/.env`):

```env
VITE_API_URL="http://localhost:3000/api"
```

Gere uma chave segura:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Nunca publique os valores reais de `.env`.

## Cloudflare Tunnel

Para expor a aplicação, a origem precisa corresponder ao serviço que o tunnel deve publicar:

```powershell
cloudflared tunnel --url http://127.0.0.1:3000
```

Se o frontend e o backend usam portas diferentes, publique o serviço correto ou configure um proxy. Usar `127.0.0.1` evita falhas quando `localhost` é resolvido para IPv6 (`::1`).

Links de quick tunnel podem mudar. Ao trocar o domínio, atualize:

- `VITE_API_URL`.
- `FRONTEND_URL` ou a lista de origens do CORS.
- Favoritos e URLs usadas para acesso externo.

## Prisma

```powershell
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Para criar uma migração:

```powershell
npx prisma migrate dev --name descricao_da_migracao
npx prisma generate
```

Evite `--force-reset` se houver dados que não possam ser perdidos.

## Solução de problemas

### Backend não responde

Confira se o processo está ativo e se a porta está correta:

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

### Cloudflare recusa a conexão

Verifique se o backend escuta na mesma porta usada no comando do tunnel. Prefira `http://127.0.0.1:PORTA`.

### Erro de login

Verifique a URL da API no frontend, o endpoint de autenticação registrado no backend, o CORS e o console do navegador. Depois de alterar `.env` do Vite, reinicie o frontend.
