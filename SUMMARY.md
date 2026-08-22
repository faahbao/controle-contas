# Resumo do Projeto

## Sistema de Controle Financeiro

Aplicação fullstack para gestão financeira pessoal. O sistema organiza receitas, despesas, categorias e transações recorrentes, com controle de pagamento, parcelas futuras, dashboard e relatórios em PDF.

## Objetivo

Permitir que o usuário registre uma despesa recorrente uma única vez e acompanhe suas parcelas ao longo dos meses, sem perder o histórico e sem precisar repetir o lançamento manualmente.

## Arquitetura

```text
┌──────────────┐      HTTP       ┌──────────────┐      Prisma      ┌──────────┐
│ React/Vite   │ ──────────────> │ Express API  │ ───────────────> │ SQLite   │
│ Frontend     │ <────────────── │ Backend      │ <─────────────── │ Banco    │
└──────────────┘                └──────────────┘                  └──────────┘
```

## Recursos principais

- Autenticação com JWT.
- CRUD de transações.
- Categorias personalizáveis.
- Parcelas recorrentes.
- Pagamento individual e em lote.
- Pagamento antecipado.
- Exclusão da parcela atual ou das futuras.
- Dashboard com filtros e gráficos.
- Relatório PDF.
- Interface responsiva.

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React, Vite, Axios, React Router DOM, CSS |
| Backend | Node.js, Express, JWT, bcrypt, Joi, Helmet, CORS |
| Persistência | Prisma ORM e SQLite |
| Relatórios | PDFKit |

## Fluxo de uma parcela

1. Usuário informa valor, frequência e quantidade de parcelas.
2. Backend cria um grupo de parcelas.
3. Cada lançamento recebe data e número da parcela.
4. O frontend mostra a parcela no período correspondente.
5. O usuário pode pagar ou excluir cada parcela conforme necessário.

## Status

O projeto possui a base funcional de autenticação, transações, recorrência, categorias, pagamentos, dashboard e relatórios. A documentação deve ser mantida junto com as rotas e arquivos reais do projeto.

## Próximos aprimoramentos

- Exportação CSV/XLSX.
- Notificações de vencimento.
- Metas de economia.
- Backup e restauração assistidos.
- Testes automatizados de API e interface.
- Tunnel persistente ou domínio fixo para acesso externo.

## Licença

MIT.
