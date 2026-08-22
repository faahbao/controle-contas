# API

## Base URL

Em desenvolvimento:

```text
http://localhost:3000/api
```

Se o backend estiver publicado por Cloudflare Tunnel, substitua a origem pelo domínio atual e mantenha o sufixo `/api`.

## Autenticação

As rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

As rotas de cadastro e login não exigem token.

## Autenticação

### POST `/auth/cadastro`

Cadastra um usuário.

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### POST `/auth/login`

Realiza login.

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

Resposta esperada:

```json
{
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "nome": "João Silva"
  }
}
```

> Confirme no código do backend se a rota de cadastro usa `/cadastro` ou `/register` antes de integrar clientes externos. O frontend deve usar a rota efetivamente registrada pelo servidor.

## Dashboard

### GET `/dashboard`

Retorna o resumo financeiro do período.

Query parameters opcionais:

- `mes`: mês de `01` a `12`.
- `ano`: ano com quatro dígitos.

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

## Transações

### GET `/transacoes`

Lista as transações do mês e ano informados.

### GET `/transacoes/todas`

Lista todas as transações do usuário, incluindo parcelas futuras.

### POST `/transacoes`

Cria uma transação. Exemplo:

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

Uma transação parcelada gera registros com `parcelaAtual`, `parcelas` e `grupoParcelasId`.

### PUT `/transacoes/:id`

Atualiza uma transação existente.

### DELETE `/transacoes/:id`

Exclui somente a transação ou parcela indicada.

### DELETE `/transacoes/:id/futuras`

Exclui a parcela indicada e as parcelas posteriores do mesmo grupo.

### PATCH `/transacoes/:id/pagamento`

Marca ou desmarca uma despesa como paga.

```json
{
  "paga": true
}
```

Somente despesas devem utilizar o status de pagamento.

## Categorias

### GET `/categorias`

Lista categorias disponíveis.

### POST `/categorias`

Cria uma categoria:

```json
{
  "nome": "Transporte",
  "tipo": "despesa"
}
```

## Relatórios

### GET `/relatorio/pdf`

Gera o relatório PDF do período informado.

Query parameters:

- `mes`: mês de `01` a `12`.
- `ano`: ano com quatro dígitos.

A resposta é um arquivo PDF para download.

## Erros

Clientes devem tratar pelo menos:

- `400`: dados inválidos.
- `401`: token ausente, inválido ou expirado.
- `404`: rota ou registro não encontrado.
- `409`: conflito, como e-mail já cadastrado.
- `500`: erro interno do servidor.
