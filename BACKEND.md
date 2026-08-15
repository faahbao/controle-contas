# 🔧 Backend - Controle Financeiro

## 📁 Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── dev.db
├── src/
│   └── server.js
├── .env
└── package.json
```

## 🗄️ Schema do Prisma

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
  id           Int      @id @default(autoincrement())
  descricao    String
  valor        Float
  tipo         String   // "receita" ou "despesa"
  categoria    String
  data         DateTime @default(now())
  recorrente   Boolean  @default(false)
  frequencia   String?  // "diaria", "semanal", "mensal"
  parcelas     Int?     // quantidade total de parcelas
  parcelaAtual Int?     // nÆºmero da parcela (1, 2, 3...)
  userId       Int
  user         User     @relation(fields: [userId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Categoria {
  id        Int      @id @default(autoincrement())
  nome      String
  tipo      String   // "receita" ou "despesa"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/cadastro` - Cadastrar usuÆ¡rio
- `POST /api/auth/login` - Login

### Transaçªµes
- `GET /api/transacoes` - Listar transaçªµes (filtro: mes, ano)
- `POST /api/transacoes` - Criar transaçª£o
- `PUT /api/transacoes/:id` - Atualizar transaçª£o
- `DELETE /api/transacoes/:id` - Deletar transaçª£o

### Dashboard
- `GET /api/dashboard` - Dashboard com resumo (filtro: mes, ano)

### Categorias
- `GET /api/categorias` - Listar categorias
- `POST /api/categorias` - Criar categoria

### RelatÆ¢rios
- `GET /api/relatorio/pdf` - Gerar PDF (filtro: mes, ano)

## 🚀 Como rodar

```bash
# Instalar dependŒncias
npm install

# Rodar migraçªµes
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

## 📝 Exemplo: Criar transaçª£o recorrente

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

**Resultado:** 5 transaçªµes criadas automaticamente (uma por mŒs).