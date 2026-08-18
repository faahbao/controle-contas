# Changelog

Todas as mudancas importantes neste projeto estao documentadas neste arquivo.

O formato e baseado em [Keep a Changelog](https://keepachangelog.com/).

## [1.3.0] - 2026-08-18

### Adicionado

- **Pagamento de despesas**
  - Campo `paga` no modelo Transacao
  - Botao para marcar/desmarcar despesa como paga
  - Somente despesas podem ser marcadas como pagas (receitas nao)
  - Endpoint `PATCH /api/transacoes/:id/pagamento`

- **Pagamento em lote**
  - Checkbox para selecao de multiplas despesas
  - Botao "Pagar selecionadas"
  - Atualizacao sequencial para evitar bloqueio do SQLite

- **Pagamento antecipado**
  - Visualizacao de todas as parcelas (sem filtro de mes)
  - Endpoint `GET /api/transacoes/todas`
  - Capacidade de pagar parcelas de meses futuros

- **Exclusao de parcelas futuras**
  - Botao "Excluir futuras"
  - Endpoint `DELETE /api/transacoes/:id/futuras`
  - Remove parcela selecionada e todas as posteriores

- **Documentacao atualizada**
  - Todos os arquivos de documentacao revisados
  - Remocao de referencias a PostgreSQL
  - Foco em SQLite + Prisma
  - Instrucoes de instalacao simplificadas

### Modificado

- **Backend**
  - Schema do Prisma atualizado com campos `paga` e `grupoParcelasId`
  - CORS atualizado para incluir metodo PATCH
  - Remocao de dependencias nao utilizadas (Sequelize, Knex, pg)

- **Frontend**
  - Dashboard com controles de pagamento
  - Selecao multipla de despesas
  - Visualizacao de parcelas futuras
  - Fluxo de pagamento em lote

### Removido

- Dependencias Sequelize, Knex e PostgreSQL
- Migracoes antigas nao Prisma
- Referencias a banco de dados externo

### Seguranca

- Geracao de nova chave JWT recomendada antes de publicar
- `.env` deve estar no `.gitignore`
- Dados armazenados localmente em SQLite

## [1.2.0] - 2026-08-15

### Adicionado

- Autenticacao de usuarios com JWT
- Registro e login de usuarios
- CRUD completo de transacoes
- CRUD de categorias
- Dashboard com resumo financeiro
- Scripts de setup automatico
- Documentacao completa

### Modificado

- Estrutura organizada em backend/frontend
- Migracao para TypeScript
- Melhorias com TailwindCSS

### Corrigido

- Problemas de CORS
- Validacao de dados

## [1.1.0] - 2026-08-15

### Adicionado

- Transacoes recorrentes com parcelas
- Geracao automatica de parcelas
- Badge visual de parcelas
- Filtro por mes/ano corrigido
- Documentacao atualizada

## [1.0.0] - 2026-01-01

### Adicionado

- Estrutura inicial
- Backend Node.js + Express
- Frontend React + Vite
- SQLite + Prisma ORM

---

## Formato

- **[Versao]** - Data
- **Adicionado** - Novas funcionalidades
- **Modificado** - Mudancas em funcionalidades existentes
- **Removido** - Funcionalidades removidas
- **Corrigido** - Bugs corrigidos
- **Seguranca** - Melhorias de seguranca