# Backend

## Visão geral

O backend fornece a API HTTP do Controle de Contas. Ele gerencia autenticação, transações, categorias, parcelas, pagamentos e geração de relatórios.

## Tecnologias

- Node.js.
- Express.
- Prisma ORM.
- SQLite local.
- JSON Web Token.
- bcrypt ou bcryptjs.
- Joi para validação, quando configurado.
- Helmet para cabeçalhos de segurança.
- CORS.
- PDFKit para relatórios.

## Estrutura

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── jobs/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   └── server.js
├── .env
├── .env.example
└── package.json
```

## Modelo de dados

O modelo de usuário armazena nome, e-mail, senha protegida e datas de controle. As transações pertencem a um usuário e podem conter informações de recorrência e parcelamento.

Campos principais de `Transacao`:

- `descricao`, `valor`, `tipo`, `categoria` e `data`.
- `recorrente` e `frequencia`.
- `parcelas` e `parcelaAtual`.
- `grupoParcelasId` para agrupar parcelas relacionadas.
- `paga` para controlar o pagamento de despesas.
- `userId` para isolamento dos dados por usuário.

O modelo `Categoria` possui nome, tipo e datas de controle.

## Índices

As consultas são otimizadas por índices em usuário, data e grupo de parcelas:

```prisma
@@index([userId])
@@index([data])
@@index([grupoParcelasId])
```

## Rotas

- `POST /api/auth/cadastro` ou a rota de cadastro registrada pelo backend.
- `POST /api/auth/login`.
- `GET /api/dashboard`.
- `GET /api/transacoes`.
- `GET /api/transacoes/todas`.
- `POST /api/transacoes`.
- `PUT /api/transacoes/:id`.
- `DELETE /api/transacoes/:id`.
- `DELETE /api/transacoes/:id/futuras`.
- `PATCH /api/transacoes/:id/pagamento`.
- `GET /api/categorias`.
- `POST /api/categorias`.
- `GET /api/relatorio/pdf`.

## Parcelas recorrentes

Ao criar uma transação com parcelas:

1. O backend cria um identificador comum em `grupoParcelasId`.
2. Gera os registros conforme a frequência escolhida.
3. Define `parcelaAtual` de 1 até o total.
4. Mantém cada parcela independente para pagamento e exclusão.

## Pagamento

- Apenas despesas podem ser marcadas como pagas.
- Cada parcela possui seu próprio status.
- O pagamento em lote deve ser sequencial para reduzir bloqueios no SQLite.
- Pagar uma parcela não altera automaticamente as demais.

## Configuração

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="use-uma-chave-secreta-com-pelo-menos-32-caracteres"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

Para acesso externo, acrescente a origem atual do frontend/tunnel à configuração de CORS. Não use a URL temporária antiga do Cloudflare.

## Comandos

```powershell
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
npx prisma studio
```

Para uma nova alteração no schema:

```powershell
npx prisma migrate dev --name descricao_da_migracao
npx prisma generate
```

Não use `--force-reset` em um banco com dados importantes, pois o comando pode apagar os registros.
