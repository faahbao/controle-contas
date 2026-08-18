# API - Documentacao

## Base URL

```text
http://localhost:3000/api
```

## Autenticacao

Todas as rotas (exceto login e cadastro) requerem o header:

```http
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/cadastro

Cadastrar novo usuario

**Body:**

```json
{
  "nome": "Joao Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**

```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "nome": "Joao Silva"
  }
}
```

---

### POST /auth/login

Login de usuario

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
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "nome": "Joao Silva"
  }
}
```

---

## Dashboard

### GET /dashboard

Resumo do mes com receitas, despesas, saldo e grafico

**Query params:**

- `mes` (opcional): 01-12
- `ano` (opcional): 2024, 2025, 2026, etc

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

## Transacoes

### GET /transacoes

Listar transacoes do mes selecionado

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

---

### GET /transacoes/todas

Listar todas as transacoes do usuario, sem filtro de mes

Usado para visualizar parcelas futuras e pagar antecipadamente

**Resposta:**

```json
[
  {
    "id": 1,
    "descricao": "Aluguel (1/5)",
    "valor": 1000,
    "tipo": "despesa",
    "categoria": "Moradia",
    "data": "2026-08-18T00:00:00.000Z",
    "recorrente": true,
    "frequencia": "mensal",
    "parcelas": 5,
    "parcelaAtual": 1,
    "grupoParcelasId": "abc123",
    "paga": false,
    "userId": 1
  }
]
```

---

### POST /transacoes

Criar transacao

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

**Resposta (transacao unica):**

```json
{
  "id": 1,
  "descricao": "Aluguel",
  ...
}
```

**Resposta (recorrente com parcelas):**

```json
{
  "mensagem": "5 parcelas criadas com sucesso!",
  "transacoes": [...]
}
```

---

### PUT /transacoes/:id

Atualizar transacao

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

---

### DELETE /transacoes/:id

Deletar transacao (parcela unica)

**Resposta:**

```json
{
  "id": 1,
  ...
}
```

---

### DELETE /transacoes/:id/futuras

Excluir parcela selecionada e todas as parcelas futuras do mesmo grupo

**Resposta:**

```json
{
  "mensagem": "Parcelas futuras excluidas com sucesso!",
  "excluidas": 3
}
```

---

### PATCH /transacoes/:id/pagamento

Marcar ou desmarcar transacao como paga

Somente despesas podem ser marcadas como pagas

**Body:**

```json
{
  "paga": true
}
```

**Resposta:**

```json
{
  "mensagem": "Transacao marcada como paga.",
  "transacao": {
    "id": 27,
    "paga": true
  }
}
```

Para desfazer pagamento:

```json
{
  "paga": false
}
```

---

## Categorias

### GET /categorias

Listar categorias

**Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Alimentacao",
    "tipo": "despesa"
  },
  {
    "id": 2,
    "nome": "Salario",
    "tipo": "receita"
  }
]
```

---

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

## Relatorios

### GET /relatorio/pdf

Gerar PDF do mes

**Query params:**

- `mes`: 01-12
- `ano`: 2024, 2025, etc

**Resposta:** Blob PDF para download