# Resumo do Projeto

## Objetivo

Controle Financeiro e uma aplicacao web para registrar receitas, despesas, categorias e compromissos parcelados.

## Arquitetura

```text
React + Vite
    |
    | HTTP com Axios
    v
Node.js + Express
    |
    | Prisma ORM
    v
SQLite
```

## Principais recursos

- Cadastro e login com JWT.
- Dashboard mensal.
- Receitas e despesas.
- Categorias.
- Parcelas recorrentes.
- Pagamento individual de despesas.
- Pagamento de varias parcelas.
- Pagamento antecipado de parcelas futuras.
- Exclusao de parcela unica ou futuras.
- Relatorio PDF.

## Fluxo de parcelas

Uma transacao recorrente cria varias transacoes independentes.

Exemplo:

```text
Financiamento (1/3) - agosto
Financiamento (2/3) - setembro
Financiamento (3/3) - outubro
```

Cada parcela pode ser paga separadamente.

## Pagamento antecipado

O usuario pode abrir `Ver todas as parcelas`, selecionar parcelas futuras e marca-las como pagas antes do mes de vencimento.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React, Vite, Axios, CSS |
| Backend | Node.js, Express |
| Banco | SQLite |
| ORM | Prisma |
| Autenticacao | JWT e bcrypt |
| PDF | PDFKit |