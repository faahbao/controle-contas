# Backend

## Stack

- Node.js
- Express
- Prisma
- SQLite
- JWT
- bcrypt
- Joi
- Helmet
- express-rate-limit
- PDFKit

## Arquivo principal

```text
backend/src/server.js
```

O servidor concentra:

- Configuracao do Express
- CORS
- Rate limit
- Validacao com Joi
- Autenticacao JWT
- Dashboard
- Categorias
- Transacoes
- Parcelas
- Pagamentos
- Relatorio PDF
- Tratamento de erros

## Banco

O banco e SQLite e a URL e lida de `backend/.env`.

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
```

O parametro `connection_limit=1` reduz conflitos de escrita no SQLite.

## Prisma

Arquivo do schema:

```text
backend/prisma/schema.prisma
```

Campo de pagamento no modelo `Transacao`:

```prisma
paga Boolean @default(false)
```

Campos usados para parcelas:

```prisma
recorrente      Boolean @default(false)
frequencia      String?
parcelas        Int?
parcelaAtual    Int?
grupoParcelasId String?
```

## Rotas importantes

```text
POST   /api/auth/cadastro
POST   /api/auth/login
GET    /api/dashboard
GET    /api/transacoes
GET    /api/transacoes/todas
POST   /api/transacoes
PUT    /api/transacoes/:id
PATCH  /api/transacoes/:id/pagamento
DELETE /api/transacoes/:id
DELETE /api/transacoes/:id/futuras
GET    /api/categorias
POST   /api/categorias
GET    /api/relatorio/pdf
```

## Pagamento de parcelas

A rota abaixo atualiza apenas a transacao do usuario autenticado:

```text
PATCH /api/transacoes/:id/pagamento
```

Body:

```json
{
  "paga": true
}
```

O backend nao permite marcar receitas como pagas.

## Todas as parcelas

A rota abaixo ignora o filtro mensal e retorna todas as transacoes do usuario:

```text
GET /api/transacoes/todas
```

Ela permite que o frontend mostre e pague parcelas futuras.

## CORS

O backend deve permitir PATCH:

```javascript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
```

Origens locais permitidas incluem:

```text
http://localhost:5173
http://localhost:3001
http://localhost:3000
```

## Executar

```powershell
cd D:\Projetos\controle-contas\backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Prisma Studio

```powershell
cd D:\Projetos\controle-contas\backend
npx prisma studio
```

## Solucao de timeout SQLite

Nao atualize diversas parcelas em paralelo com `Promise.all`.

O frontend deve usar:

```javascript
for (const id of idsSelecionados) {
  await api.patch(`/transacoes/${id}/pagamento`, {
    paga: true
  })
}
```

Isso realiza uma gravacao por vez.