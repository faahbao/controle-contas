# API

## Base URL

```text
http://localhost:3000/api
```

## Autenticacao

Todas as rotas, exceto cadastro, login e health check, exigem:

```http
Authorization: Bearer <token>
```

## Health check

### GET /health

Resposta:

```json
{
  "status": "ok"
}
```

## Autenticacao

### POST /auth/cadastro

Body:

```json
{
  "nome": "Joao Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

Resposta:

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "nome": "Joao Silva",
    "email": "joao@email.com"
  }
}
```

### POST /auth/login

Body:

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

## Dashboard

### GET /dashboard

Query params:

```text
mes=08
ano=2026
```

Resposta:

```json
{
  "receitas": 5000,
  "despesas": 3000,
  "saldo": 2000,
  "transacoes": [],
  "grafico": {
    "receitas": 5000,
    "despesas": 3000,
    "receitasPorcentagem": 100,
    "despesasPorcentagem": 60
  }
}
```

## Transacoes

### GET /transacoes

Lista transacoes filtradas por mes e ano.

Query params opcionais:

```text
mes=08
ano=2026
```

### GET /transacoes/todas

Lista todas as transacoes do usuario autenticado, incluindo parcelas futuras.

Esta rota e utilizada pelo botao `Ver todas as parcelas`.

### POST /transacoes

Cria uma transacao.

Body para uma despesa parcelada:

```json
{
  "descricao": "Aluguel",
  "valor": 1000,
  "tipo": "despesa",
  "categoria": "Moradia",
  "data": "2026-08-18",
  "recorrente": true,
  "frequencia": "mensal",
  "parcelas": 5
}
```

Frequencias aceitas:

```text
diaria
semanal
mensal
```

Resposta para varias parcelas:

```json
{
  "mensagem": "5 parcelas criadas com sucesso!",
  "transacoes": []
}
```

### PUT /transacoes/:id

Atualiza uma transacao.

O body usa os mesmos campos de `POST /transacoes`.

### PATCH /transacoes/:id/pagamento

Atualiza o status de pagamento de uma despesa.

Body:

```json
{
  "paga": true
}
```

Para marcar como pendente:

```json
{
  "paga": false
}
```

Somente transacoes do tipo `despesa` podem ser atualizadas por essa rota.

Resposta:

```json
{
  "mensagem": "Transacao marcada como paga.",
  "transacao": {
    "id": 27,
    "paga": true
  }
}
```

### DELETE /transacoes/:id

Exclui somente a transacao selecionada.

### DELETE /transacoes/:id/futuras

Exclui a parcela selecionada e todas as parcelas futuras do mesmo grupo.

Resposta:

```json
{
  "mensagem": "3 parcela(s) atual e futura(s) excluida(s).",
  "quantidadeExcluida": 3
}
```

## Categorias

### GET /categorias

Lista categorias.

### POST /categorias

Body:

```json
{
  "nome": "Transporte",
  "tipo": "despesa"
}
```

Tipos aceitos:

```text
receita
despesa
```

## Relatorio

### GET /relatorio/pdf

Query params obrigatorios:

```text
mes=08
ano=2026
```

Resposta: arquivo PDF para download.