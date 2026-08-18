# Resumo do Projeto

## Sistema de Controle Financeiro

Sistema fullstack para gestao financeira pessoal com foco em transacoes recorrentes parceladas, pagamento de despesas e visualizacao de parcelas futuras.

---

## Objetivo Principal

Permitir que usuarios lancem despesas recorrentes (como aluguel, financiamento, etc.) uma unica vez, e o sistema distribui automaticamente as parcelas nos meses seguintes, com capacidade de pagamento individual, em lote e antecipado.

---

## Funcionalidades Principais

### 1. Autenticacao

- Cadastro e login com JWT
- Protecao de rotas
- Contexto de autenticacao no frontend

### 2. Transacoes

- Receitas e despesas
- Categorias personalizaveis
- **Recorrente com parcelas** (feature principal)
- Pagamento de despesas (individual e em lote)
- Pagamento antecipado de parcelas futuras
- Visualizacao de todas as parcelas
- Exclusao de parcela unica ou futuras

### 3. Dashboard

- Cards com totais do mes
- Grafico receitas vs despesas
- Filtro por mes/ano

### 4. Relatorios

- Exportacao em PDF

---

## Arquitetura

```text
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │ ──────> │    Backend   │ ──────> │    SQLite    │
│   (React)   │  HTTP   │ (Express.js) │  Prisma │   (Dados)    │
└─────────────┘         └──────────────┘         └──────────────┘
```

---

## Estrutura de Arquivos

```text
controle-contas/
├── README.md
├── BACKEND.md
├── FRONTEND.md
├── FEATURES.md
├── INSTALL.md
├── API.md
├── SUMMARY.md
├── QUICKSTART.md
├── PROJECT_STRUCTURE.md
├── CHANGELOG.md
├── UPDATES_V1.1.md
└── VISUAL_GUIDE.md
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        └── styles/
            └── Dashboard.css
```

---

## Destaques

### Transacao Recorrente com Parcelas

**Problema resolvido:** Usuario nao precisa lancar manualmente a mesma despesa todo mes.

**Solucao:**

1. Usuario lanca "Aluguel - R$ 1.000 - 5 parcelas" em agosto
2. Backend cria automaticamente 5 transacoes
3. Cada transacao aparece no mes correto
4. Badge visual identifica: mensal (2/5)

### Pagamento de Despesas

**Funcionalidades:**

- Marcar/desmarcar despesa como paga
- Pagamento em lote de varias despesas
- Pagamento antecipado de parcelas futuras
- Visualizacao de todas as parcelas (sem filtro de mes)

**Tecnologias:**

- Frontend: React + CSS3
- Backend: Node.js + Express + Prisma
- Banco: SQLite

---

## Status

- Autenticacao JWT
- CRUD de transacoes
- Transacoes recorrentes com parcelas
- Dashboard com filtros
- Categorias
- Relatorio PDF
- Pagamento de despesas (individual e em lote)
- Pagamento antecipado de parcelas futuras
- Visualizacao de todas as parcelas
- Exclusao de parcela unica ou futuras
- Documentacao completa

---

## Stack Completo

| Camada | Tecnologia |
|---|---|
| Frontend | React, CSS3, Axios |
| Backend | Node.js, Express |
| ORM | Prisma |
| Banco | SQLite |
| Auth | JWT |
| PDF | PDFKit |

---

## Proximos Passos (Sugestoes)

- Graficos mais avancados (Chart.js ou Recharts)
- Notificacoes de vencimento
- Metas de economia
- Integracao com banco (importacao de extrato)
- App mobile
- Exportacao em Excel/CSV

---

## Licenca

MIT