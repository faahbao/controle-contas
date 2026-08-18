# Changelog

Todas as alteracoes importantes do projeto sao registradas neste arquivo.

## [1.3.0] - 2026-08-18

### Adicionado

- Campo `paga` no modelo Transacao.
- Rota `PATCH /api/transacoes/:id/pagamento`.
- Rota `GET /api/transacoes/todas`.
- Botao para marcar despesa como paga.
- Botao para desmarcar despesa paga.
- Badge visual para despesas pagas.
- Checkbox para selecionar despesas pendentes.
- Pagamento em lote de despesas selecionadas.
- Visualizacao de todas as parcelas.
- Pagamento antecipado de parcelas futuras.
- Botao `Ver todas as parcelas` no cabecalho de Transacoes.

### Modificado

- Pagamento em lote executa atualizacoes sequenciais.
- CORS passou a permitir o metodo PATCH.
- Receitas nao exibem controles de pagamento.
- Documentacao atualizada para SQLite, Prisma, parcelas e pagamentos.

### Corrigido

- Timeout do SQLite durante pagamento de varias parcelas.
- Bloqueio CORS para PATCH.
- Consulta de parcelas futuras fora do filtro mensal.

## [1.2.0] - 2026-08-18

### Adicionado

- Transacoes recorrentes com parcelas.
- Campo `grupoParcelasId`.
- Campo `parcelaAtual`.
- Exclusao de parcela unica.
- Exclusao da parcela atual e futuras.
- Dashboard mensal.
- Categorias personalizadas.
- Relatorio PDF.

## [1.1.0] - 2026-08-15

### Adicionado

- Cadastro e login.
- JWT.
- Protecao de rotas.
- CRUD de transacoes.
- CRUD de categorias.

## [1.0.0] - 2026-08-13

### Adicionado

- Estrutura inicial.
- Backend Node.js e Express.
- Frontend React e Vite.
- Banco SQLite com Prisma.