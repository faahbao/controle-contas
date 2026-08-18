# Inicio Rapido

## 1. Backend

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 2. Frontend

Abra outro terminal:

```powershell
cd D:\Projetos\controle-contas\frontend
npm install
npm run dev
```

## 3. Acesse

Abra a URL exibida pelo Vite, normalmente:

```text
http://localhost:3001
```

## 4. Primeiro uso

1. Cadastre um usuario.
2. Faca login.
3. Crie uma receita ou despesa.
4. Para parcelar, marque `Recorrente?`.
5. Escolha frequencia e quantidade de parcelas.
6. Clique em `Adicionar`.

## 5. Pagar parcelas futuras

1. Na secao Transacoes, clique em `Ver todas as parcelas`.
2. Selecione parcelas futuras pendentes.
3. Clique em `Pagar selecionadas`.

## Configuracao minima

Arquivo `backend/.env`:

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="substitua-por-uma-chave-com-32-caracteres-ou-mais"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

## Comandos uteis

```powershell
cd D:\Projetos\controle-contas\backend
npx prisma studio
```

```powershell
cd D:\Projetos\controle-contas\backend
npx prisma generate
```

```powershell
cd D:\Projetos\controle-contas\frontend
npm run build
```