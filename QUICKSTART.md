# Quick Start

## Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Git, se o projeto for obtido de um repositório.

## Backend

No primeiro terminal:

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Deixe o terminal aberto. Confirme a porta indicada pelo servidor.

## Frontend

No segundo terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

Abra a URL mostrada pelo Vite.

## Variável da API

Em `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000/api"
```

Reinicie o Vite depois de alterar essa variável.

## Primeiro acesso

1. Abra o frontend.
2. Cadastre um usuário.
3. Faça login.
4. Lance uma receita ou despesa.
5. Explore dashboard, categorias, parcelas e relatórios.

## Tunnel externo

Depois que o serviço local estiver funcionando, publique a porta correta:

```powershell
cloudflared tunnel --url http://127.0.0.1:3000
```

Se o tunnel estiver publicando o frontend, use a porta do Vite. Um quick tunnel pode gerar um domínio diferente a cada inicialização; atualize a URL da API e o CORS quando isso acontecer.

## Comandos úteis

```powershell
# Backend
cd backend
npm run dev
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Frontend
cd frontend
npm run dev
npm run build
npm run preview
```

## Problemas comuns

### Conexão recusada pelo Cloudflare

O backend não está escutando na porta configurada no tunnel. Verifique a porta e prefira `127.0.0.1` em vez de `localhost`.

### Erro de login

Confira `VITE_API_URL`, o endpoint efetivo de login no backend, CORS, a aba Network do navegador e se o backend continua ativo.

### Prisma com erro

```powershell
cd backend
npx prisma generate
npx prisma migrate dev
```

Não use reset forçado sem backup.
