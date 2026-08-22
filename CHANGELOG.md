# Changelog

Todas as mudanças importantes devem ser registradas neste arquivo. O formato segue a ideia do [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [1.3.0] — 2026-08-18

### Adicionado

- Status de pagamento para despesas.
- Pagamento individual, em lote e antecipado.
- Visualização de todas as parcelas, incluindo futuras.
- Exclusão da parcela atual ou da parcela atual e posteriores.
- Endpoint para atualizar pagamento.
- Documentação revisada para SQLite e Prisma.

### Modificado

- Modelo de transação com `paga` e `grupoParcelasId`.
- CORS com suporte aos métodos usados pela aplicação.
- Dashboard com controles de pagamento e parcelas.

### Removido

- Referências e dependências antigas de PostgreSQL, Sequelize e Knex, quando não utilizadas pelo projeto atual.

### Segurança

- Recomendação de gerar uma nova chave JWT antes de publicar.
- Arquivos `.env` devem permanecer fora do Git.
- Origens externas devem ser explicitamente configuradas no CORS.

## [1.2.0] — 2026-08-15

### Adicionado

- Cadastro e login com JWT.
- CRUD de transações e categorias.
- Dashboard financeiro.
- Scripts de instalação.
- Documentação inicial.

### Corrigido

- Problemas de CORS e validação.

## [1.1.0] — 2026-08-15

### Adicionado

- Transações recorrentes.
- Geração automática de parcelas.
- Indicadores visuais de parcelamento.
- Filtros por mês e ano.

## [1.0.0] — 2026-01-01

### Adicionado

- Estrutura inicial do backend e frontend.
- Node.js, Express, React, Vite, SQLite e Prisma.

## Categorias do changelog

- **Adicionado:** novos recursos.
- **Modificado:** alterações em recursos existentes.
- **Corrigido:** correções de erros.
- **Removido:** recursos ou dependências retirados.
- **Segurança:** melhorias e recomendações de segurança.
