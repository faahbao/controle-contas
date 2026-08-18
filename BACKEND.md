# Backend - Documentacao

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
└── package.json
```

## Tecnologias

- Node.js
- Express
- Prisma ORM
- SQLite
- JSON Web Token (jsonwebtoken)
- bcrypt (hash de senhas)
- Joi (validacao)
- Helmet (seguranca HTTP)
- CORS
- PDFKit (geracao de PDF)

## Schema do Prisma

```prisma
model User {
  id         Int          @id @default(autoincrement())
  email      String       @unique
  senha      String
  nome       String
  transacoes Transacao[]
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

model Transacao {
  id              Int      @id @default(autoincrement())
  descricao       String
  valor           Float
  tipo            String
  categoria       String
  data            DateTime @default(now())

  recorrente      Boolean  @default(false)
  frequencia      String?
  parcelas        Int?
  parcelaAtual    Int?
  grupoParcelasId String?
  paga            Boolean  @default(false)

  userId          Int
  user            User     @relation(fields: [userId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([data])
  @@index([grupoParcelasId])
}

model Categoria {
  id        Int      @id @default(autoincrement())
  nome      String
  tipo      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Indices

O modelo `Transacao` possui tres indices para otimizar consultas:

- `@@index([userId])` - Filtra transacoes por usuario
- `@@index([data])` - Ordena e filtra por data
- `@@index([grupoParcelasId])` - Agrupa parcelas de uma transacao recorrente

## Endpoints da API

### Auth

- `POST /api/auth/cadastro` - Cadastrar usuario
- `POST /api/auth/login` - Login

### Dashboard

- `GET /api/dashboard` - Dashboard com resumo (filtro: mes, ano)

### Transacoes

- `GET /api/transacoes` - Listar transacoes (filtro: mes, ano)
- `GET /api/transacoes/todas` - Listar todas as transacoes (sem filtro de mes)
- `POST /api/transacoes` - Criar transacao
- `PUT /api/transacoes/:id` - Atualizar transacao
- `DELETE /api/transacoes/:id` - Deletar transacao (parcela unica)
- `DELETE /api/transacoes/:id/futuras` - Excluir parcela e futuras
- `PATCH /api/transacoes/:id/pagamento` - Marcar/desmarcar como paga

### Categorias

- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria

### Relatorios

- `GET /api/relatorio/pdf` - Gerar PDF (filtro: mes, ano)

## Como rodar

```powershell
# Instalar dependencias
npm install

# Gerar cliente Prisma
npx prisma generate

# Rodar migracoes
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

## Exemplo: Criar transacao recorrente

```json
POST /api/transacoes
{
  "descricao": "Aluguel",
  "valor": 1000,
  "tipo": "despesa",
  "categoria": "Moradia",
  "data": "2026-08-15",
  "recorrente": true,
  "frequencia": "mensal",
  "parcelas": 5
}
```

**Resultado:** 5 transacoes criadas automaticamente (uma por mes)

## Fluxo de parcelas

Ao criar uma despesa recorrente com N parcelas:

1. Backend gera um `grupoParcelasId` unico
2. Cria N transacoes com datas mensais consecutivas
3. Cada transacao tem `parcelaAtual` (1, 2, 3... N)
4. Todas compartilham o mesmo `grupoParcelasId`

Exemplo: aluguel de 5 parcelas em 18/08/2026:

```text
Aluguel (1/5) - 18/08/2026
Aluguel (2/5) - 18/09/2026
Aluguel (3/5) - 18/10/2026
Aluguel (4/5) - 18/11/2026
Aluguel (5/5) - 18/12/2026
```

## Pagamento de despesas

- Somente despesas podem ser marcadas como pagas
- Cada parcela tem seu proprio campo `paga`
- Pagar uma parcela nao afeta as outras
- Pagamento em lote e sequencial para evitar bloqueio do SQLite

## Exclusao de parcelas

- `DELETE /transacoes/:id` - Remove somente a parcela selecionada
- `DELETE /transacoes/:id/futuras` - Remove a parcela e todas as posteriores

Parcelas anteriores permanecem no historico

## Variaveis de ambiente

```env
DATABASE_URL="file:./dev.db?connection_limit=1"
JWT_SECRET="chave-secreta-com-32-caracteres-ou-mais"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

## Comandos do Prisma

```powershell
# Gerar cliente
npx prisma generate

# Criar nova migracao
npx prisma migrate dev --name nome_da_migracao

# Resetar banco (cuidado: apaga todos os dados)
npx prisma migrate dev --force-reset

# Abrir Prisma Studio
npx prisma studio
```