# 🌐 API - Documentaçª£o

## Base URL

```
http://localhost:3000/api
```

## Autenticaçª£o

Todas as rotas (exceto login/cadastro) requerem header:

```
Authorization: Bearer <token>
```

---

## 🔐 Auth

### POST /auth/cadastro

Cadastrar novo usuÆ¡rio

**Body:**
```json
{
  "nome": "JoÆ£o Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_aqui",
  "user": { "id": 1, "email": "joao@email.com", "nome": "JoÆ£o Silva" }
}
```

### POST /auth/login

Login de usuÆ¡rio

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_aqui",
  "user": { "id": 1, "email": "joao@email.com", "nome": "JoÆ£o Silva" }
}
```

---

## 💰 Transaçªµes

### GET /transacoes

Listar transaçªµes (com filtro)

**Query params:**
- `mes` (opcional): 01-12
- `ano` (opcional): 2024, 2025, etc

**Resposta:**
```json
{
  "receitas": 5000,
  "despesas": 3000,
  "saldo": 2000,
  "transacoes": [...],
  "grafico": { ... }
}
```

### POST /transacoes

Criar transaçª£o

**Body:**
```json
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

**Resposta (transaçª£o Æ║nica):**
```json
{ "id": 1, "descricao": "Aluguel", ... }
```

**Resposta (recorrente com parcelas):**
```json
{
  "mensagem": "5 parcelas criadas com sucesso!",
  "transacoes": [...]
}
```

### PUT /transacoes/:id

Atualizar transaçª£o

**Body:**
```json
{
  "descricao": "Novo Aluguel",
  "valor": 1200,
  "tipo": "despesa",
  "categoria": "Moradia",
  "data": "2026-08-15",
  "recorrente": true,
  "frequencia": "mensal",
  "parcelas": 5
}
```

### DELETE /transacoes/:id

Deletar transaçª£o

**Resposta:**
```json
{ "id": 1, ... }
```

---

## 📊 Dashboard

### GET /dashboard

Resumo do mŒs

**Query params:**
- `mes` (opcional): 01-12
- `ano` (opcional): 2024, 2025, etc

**Resposta:**
```json
{
  "receitas": 5000,
  "despesas": 3000,
  "saldo": 2000,
  "transacoes": [...],
  "grafico": {
    "receitas": 5000,
    "despesas": 3000,
    "receitasPorcentagem": 100,
    "despesasPorcentagem": 60
  }
}
```

---

## 📁 Categorias

### GET /categorias

Listar categorias

**Resposta:**
```json
[
  { "id": 1, "nome": "Alimentaçª£o", "tipo": "despesa" },
  { "id": 2, "nome": "SalÆ¡rio", "tipo": "receita" }
]
```

### POST /categorias

Criar categoria

**Body:**
```json
{
  "nome": "Transporte",
  "tipo": "despesa"
}
```

---

## 📄 RelatÆ¢rios

### GET /relatorio/pdf

Gerar PDF do mŒs

**Query params:**
- `mes`: 01-12
- `ano`: 2024, 2025, etc

**Resposta:** Blob PDF para download